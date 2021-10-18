import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { connect } from 'react-redux';

import { Constants, GStyles, Helper, RestAPI } from '../../utils/Global';
import GHeaderBar from '../../components/GHeaderBar';
import MessageRoomItem from '../../components/elements/MessageRoomItem';

class MessageMainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    this.onRefresh('init');
  }

  componentWillUnmount() {
    Helper.callFunc(global.onSetUnreadCount);
  }

  init = () => {
    this.state = {
      isFetching: false,
      totalCount: 0,
      curPage: 1,
      itemDatas: [],
      onEndReachedDuringMomentum: true,
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

    this.setState({ curPage, onEndReachedDuringMomentum: true });

    if (type === 'init' || type === 'update') {
      global.showForcePageLoader(true);
    } else {
      this.setState({ isFetching: true });
    }
    let params = {
      user_id: global.me?.id,
      page_number: type === 'more' ? curPage : '1',
      count_per_page: Constants.COUNT_PER_PAGE,
    };
    RestAPI.get_room_list(params, (json, err) => {
      if (type === 'init') {
        global.showForcePageLoader(false);
      } else {
        this.setState({ isFetching: false });
      }

      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else if (json.status === 200) {
        this.setState({ totalCount: json.data.totalCount || 0 });
        if (type === 'more') {
          let data = itemDatas.concat(json.data.roomList);
          this.setState({ itemDatas: data });
        } else {
          this.setState({ itemDatas: json.data.roomList });
        }
      } else {
        Helper.alertServerDataError();
      }
    });
  };

  onLogo = () => {
    this.props.navigation.goBack();
  };

  onPressChatThread = (opponent) => {
    let params = {
      userId: global.me?.id,
      otherId: opponent?.id,
    };
    RestAPI.set_read_status(params, (json, err) => {
      if (json.status === 204) {
        const { itemDatas } = this.state;
        let newItems = [...itemDatas];
        const findIndex = newItems.findIndex(
          (item) => item?.id === opponent?.id,
        );
        if (findIndex > -1) {
          newItems[findIndex] = {
            ...newItems[findIndex],
            unreadCount: 0,
          };
          this.setState({ itemDatas: newItems });
        }
        Helper.callFunc(global.onSetUnreadCount);
      }
    });
    this.props.navigation.navigate('message_chat', {
      opponentUser: opponent || {},
    });
  };

  render() {
    return (
      <>
        <SafeAreaView style={GStyles.statusBar} />
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          {this._renderHeader()}
          {this._renderRooms()}
        </SafeAreaView>
      </>
    );
  }

  _renderHeader = () => {
    return (
      <GHeaderBar
        headerTitle="Messages"
        leftType="back"
        onPressLeftButton={this.onLogo}
      />
    );
  };

  _renderRooms = () => {
    const { isFetching, itemDatas } = this.state;

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        onRefresh={() => {
          this.onRefresh('pull');
        }}
        refreshing={isFetching}
        ListFooterComponent={this._renderFooter}
        onEndReachedThreshold={0.4}
        onMomentumScrollBegin={() => {
          this.setState({ onEndReachedDuringMomentum: false });
        }}
        onEndReached={() => {
          if (!this.state.onEndReachedDuringMomentum) {
            this.setState({ onEndReachedDuringMomentum: true });
            this.onRefresh('more');
          }
        }}
        data={itemDatas}
        renderItem={this._renderItem}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    );
  };

  _renderFooter = () => {
    const { isFetching } = this.state;

    if (!isFetching) {
      return null;
    }
    return <ActivityIndicator style={{ color: '#000' }} />;
  };

  _renderItem = ({ item }) => {
    return (
      <MessageRoomItem
        item={item}
        onPress={() => this.onPressChatThread(item)}
      />
    );
  };
}

const styles = StyleSheet.create({});

const TMessageMainScreen = function (props) {
  let navigation = useNavigation();
  let route = useRoute();
  return <MessageMainScreen {...props} navigation={navigation} route={route} />;
};
export default connect(
  (state) => ({
    unreadCount: state.message?.unreadCount,
  }),
  {},
)(TMessageMainScreen);
