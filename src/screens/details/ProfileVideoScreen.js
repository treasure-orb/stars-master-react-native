import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import ProgressModal from '../../components/ProgressModal';

import { Global, GStyles, Helper, RestAPI } from '../../utils/Global';
import RenderProducts from '../../components/products/RenderProduct';
import CachedImage from '../../components/CachedImage';

const ic_back = require('../../assets/images/Icons/ic_back.png');

const VIDEO_HEIGHT = Dimensions.get('window').height;

class ProfileVideoScreen extends Component {
  constructor(props) {
    super(props);

    this.init();
  }

  init = () => {
    this.state = {
      isVideoLoading: false,
      isVideoPause: false,

      isVisibleProgress: false,
      percent: 0,

      isFetching: false,
      isLiking: false,
      totalCount: global._totalCount,
      curPage: global._curPage ? global._curPage : '1',
      keyword: global._keyword ? global._keyword : '',
      itemDatas: global._productsList || [],
      curIndex: -1,
      item: {},
    };
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  onViewableItemsChanged = ({ changed }) => {
    if (changed.length > 0) {
      const focused = changed[0];
      const item = focused?.item || {};

      if (this.state.item?.id === item?.id) {
        return;
      }

      this.setState({ curIndex: focused.index, item });
      global._opponentUser = item.user;
      if (global.me?.id) {
        if (!item.isViewed) {
          let params = {
            video_id: item?.id,
            viewer_id: global.me ? global.me?.id : 0,
            device_type: Platform.OS === 'ios' ? '1' : '0',
            device_identifier: global._deviceId,
          };
          RestAPI.update_video_view(params, (json, err) => {});
        }
      }
    }
  };

  onPressAvatar = () => {
    const user = this.state.item?.user || {};
    if (global.me) {
      if (user.id === global.me?.id) {
        this.props.navigation.navigate('profile');
      } else {
        global._opponentUser = user;
        global._prevScreen = 'post_detail';
        this.props.navigation.navigate('profile_other');
      }
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  onPressLike = (isChecked) => {
    if (this.state.isLiking) {
      return;
    }

    if (global.me) {
      const item = this.state.item || {};
      let { itemDatas } = this.state;

      item.likeCount = (item.likeCount || 0) + (isChecked ? 1 : -1);
      item.isLiked = isChecked;
      const params = {
        user_id: global.me?.id,
        video_id: item.id || item._id,
        is_like: isChecked,
      };
      this.setState({ isLiking: true });

      RestAPI.update_like_video(params, (json, err) => {
        global.showForcePageLoader(false);

        if (err !== null) {
          Helper.alertNetworkError(err?.message);
        } else {
          if (json.status === 200) {
            this.setState({ itemDatas });
          } else {
            Helper.alertServerDataError();
          }
        }
        this.setState({ isLiking: false });
      });
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  onPressMessage = () => {
    const user = this.state.item?.user || {};

    if (global.me) {
      if (user.id !== global.me?.id) {
        this.props.navigation.navigate('message_chat', { opponentUser: user });
      }
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  onPressShare = () => {
    if (global.me) {
      Global.shareProduct(this.state.item, global.me);
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  render() {
    return (
      <View style={[GStyles.container, { backgroundColor: 'black' }]}>
        {this.___renderStatusBar()}
        {this._renderVideo()}
        {this._renderProgress()}
        {this._renderBack()}
      </View>
    );
  }

  _renderBack = () => {
    return (
      <TouchableOpacity
        style={GStyles.backButtonContainer}
        onPress={this.onBack}
      >
        <CachedImage
          source={ic_back}
          style={{ width: 16, height: 16, tintColor: 'white' }}
          resizeMode={'contain'}
          tintColor={'white'}
        />
      </TouchableOpacity>
    );
  };

  _renderVideo = () => {
    const { isFetching, itemDatas } = this.state;

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        initialScrollIndex={
          itemDatas.length > global._selIndex ? global._selIndex : 0
        }
        getItemLayout={(data, index) => ({
          length: VIDEO_HEIGHT,
          offset: VIDEO_HEIGHT * index,
          index,
        })}
        pagingEnabled
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={6}
        removeClippedSubviews={false}
        refreshing={isFetching}
        onEndReachedThreshold={0.4}
        data={itemDatas}
        renderItem={this._renderItem}
        onViewableItemsChanged={this.onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 60,
        }}
        keyExtractor={(item, index) => index.toString()}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          zIndex: 1,
        }}
      />
    );
  };
  actions = {
    onPressLike: this.onPressLike,
    onPressMessage: this.onPressMessage,
    onPressShare: this.onPressShare,
    onPressAvatar: this.onPressAvatar,
  };
  _renderItem = ({ item, index }) => (
    <RenderProducts
      item={item}
      curIndex={this.state.curIndex}
      isVideoPause={this.state.isVideoPause}
      index={index}
      actions={this.actions}
      detailStyle={{ bottom: 36 + Helper.getBottomBarHeight() }}
    />
  );

  _renderProgress = () => {
    const { percent, isVisibleProgress } = this.state;

    return <ProgressModal percent={percent} isVisible={isVisibleProgress} />;
  };

  ___renderStatusBar = () => {
    return <StatusBar hidden />;
  };
}

export default function (props) {
  let navigation = useNavigation();
  let route = useRoute();
  return (
    <ProfileVideoScreen {...props} navigation={navigation} route={route} />
  );
}
