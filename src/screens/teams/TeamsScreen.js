import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

import { GStyle, GStyles, Helper, RestAPI } from '../../utils/Global';
import TeamTab from './TeamTab';
import GHeaderBar from '../../components/GHeaderBar';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import CachedImage from '../../components/CachedImage';
import formatNumber from '../../utils/Global/formatNumber';
const ic_flame = require('../../assets/images/Icons/ic_flame.png');

class TeamsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      Helper.setLightStatusBar();
    });
    this.refreshTeams();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  init = () => {
    this.state = {
      isFetching: false,
      teams: [],
    };
  };

  refreshTeams = () => {
    const { isFetching } = this.state;
    if (isFetching) {
      return;
    }
    let params = {
      user_id: global.me ? global.me?.id : '',
    };
    //global.showForcePageLoader(true);
    RestAPI.get_teams(params, (json, error) => {
      this.setState({ isFetching: false });
      global.showForcePageLoader(false);

      if (error !== null) {
        Helper.alertNetworkError(error?.message);
      } else {
        if (json.status === 200) {
          const teams = json.data?.teams || [];
          this.setState({
            teams,
          });
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  _renderHeader = () => {
    return (
      <GHeaderBar
        headerTitle="Teams"
        leftType="back"
        onPressLeftButton={this.onBack}
      />
    );
  };

  render() {
    const { teams } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {this._renderHeader()}

        <ScrollableTabView
          initialPage={0}
          tabBarBackgroundColor="white"
          tabBarTextStyle={styles.tabBarTextStyle}
          tabBarInactiveTextColor={'black'}
          tabBarActiveTextColor={GStyle.activeColor}
          tabBarUnderlineStyle={{ backgroundColor: 'transparent' }}
          renderTabBar={(header) => (
            <View style={[GStyles.rowBetweenContainer, { paddingRight: 16 }]}>
              <ScrollableTabBar
                {...header}
                tabs={header.tabs.map(
                  (t, i) =>
                    `${t}\n\n${formatNumber(teams[i].totalElixirFlame)}`,
                )}
                style={styles.scrollBar}
              />
            </View>
          )}
        >
          {teams.map((team, index) => (
            <TeamTab tabLabel={team.name} team={team} key={index.toString()} />
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
  tabBar: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: GStyle.snowColor,
    borderRadius: 5,
    marginLeft: 15,
  },
});

export default (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return <TeamsScreen {...props} navigation={navigation} route={route} />;
};
