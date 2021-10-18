import React, { forwardRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  Constants,
  GStyle,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';
import GHeaderBar from '../../components/GHeaderBar';
import TopUserItem from '../../components/elements/TopUserItem';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import Avatar from '../../components/elements/Avatar';

const WINDOW_WIDTH = Helper.getWindowWidth();
const CELL_WIDTH = (WINDOW_WIDTH - 32 - 32) / 3.0;

class TopUsersScreen extends React.Component {
  constructor(props) {
    super(props);

    this.init();
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      Helper.setLightStatusBar();
    });
    this.onRefresh('init');
    this.getSelectedTopUsers();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  init = () => {
    this.state = {
      isFetching: false,
      totalCount: 0,
      curPage: 1,
      sortBy: 'elixir',
      itemDatas: [],
      onEndReachedDuringMomentum: true,
      topPageText: '',
      topUsers: [],
    };
  };

  // get random top 5 user
  getSelectedTopUsers = () => {
    RestAPI.get_all_users({}, (json, err) => {
      if (err !== null) {
        Helper.alertNetworkError();
      } else {
        if (json.status === 200) {
          const profiles = json.data.userList.filter((user) => user?.isTopUser);
          const shuffled = profiles.sort(() => 0.5 - Math.random());
          const filteredItems = shuffled.slice(0, 5);

          this.setState({ topUsers: filteredItems });
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  onRefresh = (type) => {
    let { isFetching, totalCount, curPage, itemDatas, sortBy } = this.state;

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
    this.setState({ curPage, onEndReachedDuringMomentum: true });

    if (type === 'init') {
      //global.showForcePageLoader(true);
    } else {
      this.setState({ isFetching: true });
    }
    let params = {
      sortBy,
      page_number: type === 'more' ? curPage : '1',
      count_per_page: Constants.COUNT_PER_PAGE,
    };
    RestAPI.get_top_user_list(params, (json, err) => {
      if (type === 'init') {
        global.showForcePageLoader(false);
      } else {
        this.setState({ isFetching: false });
      }

      if (err !== null) {
        Helper.alertNetworkError();
      } else {
        if (json.status === 200) {
          this.setState({ totalCount: json.data.totalCount });
          const profiles = json.data.userList.filter(
            (user) => !user.phone.includes('guest_') && !user?.isBannedTopPage,
          );

          if (type === 'more') {
            let data = itemDatas.concat(profiles);
            this.setState({ itemDatas: data });
          } else {
            this.setState({ itemDatas: profiles });
          }
        } else {
          Helper.alertServerDataError();
        }
      }
    });

    // get top page text
    RestAPI.get_top_page_text({}, (json) => {
      if (json.status === 200) {
        const text = json.data.text[0].text || '';

        this.setState({
          topPageText: text,
        });
      }
    });
  };

  onPressUser = (item) => {
    if (global.me) {
      if (item.id === global.me?.id) {
        this.props.navigation.jumpTo('profile');
      } else {
        global._opponentUser = item;
        global._prevScreen = 'top_users';
        this.props.navigation.navigate('profile_other');
      }
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  scrollToTop = () => {
    this.flatListRef.scrollToOffset({ animated: false, offset: 0 });
  };

  onLogo = () => {};

  render() {
    return (
      <>
        <SafeAreaView style={GStyles.statusBar} />
        <SafeAreaView style={GStyles.container}>
          {this._renderHeader()}
          {this._renderTab()}
          {this._renderUserList()}
        </SafeAreaView>
      </>
    );
  }

  _renderHeader = () => {
    const { topPageText, topUsers } = this.state;

    return (
      <>
        <GHeaderBar
          headerTitle="Top Rank"
          leftType="logo"
          onPressLeftButton={this.onLogo}
        />
        {topPageText ? (
          <View style={styles.banner}>
            <Text style={styles.announcement}>{topPageText}</Text>
          </View>
        ) : null}
        <View style={styles.avatars}>
          {topUsers.map((item) => (
            <Avatar
              key={item.id}
              image={{ uri: item?.photo }}
              containerStyle={{ marginLeft: 10 }}
              onPress={() => this.onPressUser(item)}
            />
          ))}
        </View>
      </>
    );
  };

  _renderUserList = () => {
    const { isFetching, itemDatas } = this.state;

    return (
      <View style={styles.listWrapper}>
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
          onMomentumScrollBegin={() => {
            this.setState({ onEndReachedDuringMomentum: false });
          }}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (!this.state.onEndReachedDuringMomentum) {
              this.setState({ onEndReachedDuringMomentum: true });
              this.onRefresh('more');
            }
          }}
          data={itemDatas}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.id + index}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>
    );
  };

  onChangeTab = (page) => {
    this.setState(
      {
        sortBy: page === 0 ? 'elixir' : 'diamondSpent',
      },
      () => this.onRefresh('init'),
    );
  };

  renderTabItem = (name, page, isTabActive, onPressHandler) => {
    const textColor = isTabActive ? 'black' : GStyle.grayColor;
    const fontWeight = isTabActive ? '700' : '600';
    const onPress = () => {
      onPressHandler(page);
      this.onChangeTab(page);
    };

    return (
      <TouchableOpacity
        style={[styles.tabStyle, isTabActive && { backgroundColor: 'white' }]}
        key={name}
        onPress={onPress}
      >
        <Text style={[{ color: textColor, fontWeight }, styles.tabTextStyle]}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  _renderTab = () => {
    return (
      <View style={styles.tabContainer}>
        <ScrollableTabView
          initialPage={0}
          tabBarUnderlineStyle={{ backgroundColor: 'transparent' }}
          style={styles.tabView}
          renderTabBar={() => {
            return (
              <DefaultTabBar
                style={styles.tabBar}
                renderTab={this.renderTabItem}
              />
            );
          }}
        >
          <View tabLabel="Top" />
          <View tabLabel="Gift Sent" />
        </ScrollableTabView>
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
    const { sortBy } = this.state;
    return (
      <TopUserItem
        index={index}
        item={item}
        onPress={this.onPressUser}
        sortBy={sortBy}
      />
    );
  };
}

const styles = StyleSheet.create({
  announcement: {
    padding: 10,
    textAlign: 'center',
  },
  avatars: {
    display: 'flex',
    flexDirection: 'row',
  },
  banner: {
    backgroundColor: GStyle.grayBackColor,
    borderRadius: 8,
    width: '96%',
    marginVertical: 10,
  },
  statisticsWrapper: {
    ...GStyles.centerAlign,
    marginTop: 24,
    width: CELL_WIDTH,
  },
  statisticsItem: {
    backgroundColor: GStyle.activeColor,
    borderRadius: 8,
    height: 84,
    marginVertical: 8,
    paddingVertical: 8,
    width: '100%',
  },
  listWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  tabContainer: {
    width: '100%',
    marginTop: 16,
  },
  tabView: {
    backgroundColor: '#F8F6F7',
    flex: 0,
    padding: 8,
    borderRadius: 120,
    marginHorizontal: 24,
    overflow: 'hidden',
  },
  tabBar: {
    borderWidth: 0,
  },
  tabStyle: {
    flex: 1,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTextStyle: {
    fontFamily: 'GothamPro',
    fontSize: 16,
  },
});

export default forwardRef((props, ref) => {
  let navigation = useNavigation();
  let route = useRoute();
  return (
    <TopUsersScreen
      {...props}
      ref={ref}
      navigation={navigation}
      route={route}
    />
  );
});
