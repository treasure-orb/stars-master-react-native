import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

import { GStyle, GStyles, Helper, RestAPI } from '../../utils/Global';
import HomeVideoScreen from './HomeVideoScreen';
import { setCategories } from '../../redux/categories/actions';
import CachedImage from '../../components/CachedImage';

const ic_search = require('../../assets/images/Icons/ic_search.png');

class HomeMainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      Helper.setLightStatusBar();
    });
    this.refreshCategories();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  init = () => {
    this.state = {
      isFetching: false,
      categories: [],
    };
  };

  refreshCategories = () => {
    const { isFetching } = this.state;
    if (isFetching) {
      return;
    }
    let params = {
      user_id: global.me ? global.me?.id : '',
    };
    //global.showForcePageLoader(true);
    RestAPI.get_product_categories(params, (json, error) => {
      this.setState({ isFetching: false });
      global.showForcePageLoader(false);

      if (error !== null) {
        Helper.alertNetworkError(error?.message);
      } else {
        if (json.status === 200) {
          const response = json.data || [];
          this.props.setCategories(response);
          const categories = response
            .filter((category) => !category.parent)
            .map((parent, index) => {
              const subCategories = response.filter(
                (category, index) => category.parent?.id === parent.id,
              );
              return {
                ...parent,
                subCategories,
              };
            });
          this.setState({
            categories,
          });
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  onPressSearch = () => {
    const { navigation } = this.props;
    navigation.navigate('home_search');
  };

  render() {
    const { categories } = this.state;

    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'white', paddingTop: 16 }}
      >
        <ScrollableTabView
          initialPage={0}
          tabBarBackgroundColor="white"
          tabBarTextStyle={styles.tabBarTextStyle}
          tabBarInactiveTextColor={'black'}
          tabBarActiveTextColor={GStyle.activeColor}
          tabBarUnderlineStyle={{ backgroundColor: 'transparent' }}
          renderTabBar={(props) => {
            return (
              <View style={[GStyles.rowBetweenContainer, { paddingRight: 16 }]}>
                <ScrollableTabBar {...props} style={styles.scrollBar} />
                <TouchableOpacity onPress={this.onPressSearch}>
                  <CachedImage
                    source={ic_search}
                    style={{
                      ...GStyles.actionIcons,
                      tintColor: '#5F5F5F',
                    }}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        >
          {categories.map((category, index) => (
            <HomeVideoScreen
              tabLabel={category.title}
              category={category}
              key={index.toString()}
            />
          ))}
        </ScrollableTabView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  tabBarTextStyle: {
    fontFamily: 'GothamPro-Medium',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollBar: {
    borderWidth: 0,
    backgroundColor: 'white',
    flex: 1,
    marginRight: 16,
  },
});

const THomeMainScreen = (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return <HomeMainScreen {...props} navigation={navigation} route={route} />;
};

export default connect((state) => ({}), { setCategories })(THomeMainScreen);
