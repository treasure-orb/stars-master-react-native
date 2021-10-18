import React, { forwardRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Constants, GStyles, Helper, RestAPI } from '../../utils/Global';
import ExploreUserItem from '../../components/elements/ExploreUserItem';
import GHeaderBar from '../../components/GHeaderBar';

class FollowingUsersScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    this.onRefresh('init');
  }

  init = () => {
    this.state = {
      isFetching: false,
      totalCount: 0,
      curPage: 1,
      itemDatas: [],
    };
  };

  onRefresh = (type) => {
    let { isFetching, totalCount, curPage, itemDatas } = this.state;

    if (isFetching) {
      return;
    }

    if (type === 'more') {
      curPage += 1;
      const maxPage =
        (totalCount + Constants.COUNT_PER_PAGE - 1) / Constants.COUNT_PER_PAGE;
      if (curPage > maxPage) {
        return;
      }
    } else {
      curPage = 1;
    }
    this.setState({ curPage });

    if (type === 'init') {
      //global.showForcePageLoader(true);
    } else {
      this.setState({ isFetching: true });
    }
    let params = {
      userId: global.me ? global.me?.id : 0,
      page_number: type === 'more' ? curPage : '1',
      count_per_page: Constants.COUNT_PER_PAGE,
    };
    RestAPI.get_following_list(params, (json, err) => {
      if (type === 'init') {
        global.showForcePageLoader(false);
      } else {
        this.setState({ isFetching: false });
      }

      if (err !== null) {
        Helper.alertNetworkError();
      } else {
        if (json.status === 200) {
          this.setState({ totalCount: json.data?.totalCount });
          if (type === 'more') {
            let data = itemDatas.concat(json.data?.userList);
            this.setState({ itemDatas: data });
          } else {
            this.setState({ itemDatas: json.data?.userList });
          }
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  onPressUser = (item) => {
    if (global.me) {
      if (item.id === global.me?.id) {
        this.props.navigation.navigate('profile');
      } else {
        global._opponentUser = item;
        global._prevScreen = 'following_users';
        this.props.navigation.navigate('profile_other');
      }
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  scrollToTop = () => {
    this.flatListRef?.scrollToOffset({ animated: false, offset: 0 });
  };

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={GStyles.container}>
        <GHeaderBar
          headerTitle="Stars I follow"
          leftType="back"
          navigation={navigation}
        />
        {this._renderUserList()}
      </SafeAreaView>
    );
  }

  _renderUserList = () => {
    const { isFetching, itemDatas } = this.state;

    return (
      <View style={{ width: '100%', paddingTop: 16 }}>
        {itemDatas?.length ? (
          <FlatList
            ref={(ref) => {
              this.flatListRef = ref;
            }}
            showsVerticalScrollIndicator={false}
            onRefresh={() => {
              this.onRefresh('pull');
            }}
            refreshing={isFetching}
            ListFooterComponent={this._renderFooter}
            onEndReachedThreshold={0.4}
            onEndReached={() => {
              this.onRefresh('more');
            }}
            data={itemDatas}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 90 }}
          />
        ) : (
          <View style={{ flex: 1, ...GStyles.centerAlign }}>
            <Text style={GStyles.notifyDescription}>Not found.</Text>
          </View>
        )}
      </View>
    );
  };

  _renderFooter = () => {
    const { isFetching } = this.state;

    if (!isFetching) {
      return null;
    }
    return <ActivityIndicator style={{ color: '#000' }} />;
  };

  _renderItem = ({ item, index }) => {
    return (
      <ExploreUserItem item={item} index={index} onPress={this.onPressUser} />
    );
  };
}

const styles = StyleSheet.create({});

export default forwardRef((props, ref) => {
  let navigation = useNavigation();
  let route = useRoute();
  return (
    <FollowingUsersScreen
      {...props}
      ref={ref}
      navigation={navigation}
      route={route}
    />
  );
});
