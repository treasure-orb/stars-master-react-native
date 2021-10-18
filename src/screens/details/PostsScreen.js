import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import ProgressModal from '../../components/ProgressModal';
import RenderPosts from '../../components/posts/RenderPosts';

import {
  Constants,
  Global,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';
import CommentsScreen from './CommentsScreen';
import RBSheet from 'react-native-raw-bottom-sheet';
import CachedImage from '../../components/CachedImage';
import RenderProducts from '../../components/products/RenderProduct';

const ic_back = require('../../assets/images/Icons/ic_back.png');

const VIDEO_HEIGHT = Dimensions.get('window').height;

class PostsScreen extends Component {
  constructor(props) {
    super(props);

    this.profileSheet = React.createRef();
    this.init();
  }

  init = () => {
    this.state = {
      isVideoPause: false,

      isVisibleProgress: false,
      percent: 0,

      isFetching: false,
      isLiking: false,
      totalCount: global._totalCount,
      curPage: global._curPage ? global._curPage : '1',
      keyword: global._keyword ? global._keyword : '',
      posts: global._postsList || [],
      curIndex: 0,
      item: {},
    };
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  onViewableItemsChanged = ({ changed }) => {
    changed.forEach((change) => {
      if (change.isViewable) {
        const item = change?.item;
        if (this.state.item?.id !== change?.item.id) {
          this.setState({ curIndex: change.index, item });
          global._opponentUser = item.user;
          let params = {
            postId: item.id,
            viewerId: global.me ? global.me.id : 0,
            deviceType: Platform.OS === 'ios' ? '1' : '0',
            deviceIdentifier: global._deviceId,
          };
          RestAPI.update_post_view(params, (json, err) => {});
        }
      } else {
      }
    });
  };

  onPressAvatar = () => {
    const user = this.state.item?.user || {};
    if (global.me) {
      if (user.id === global.me?.id) {
        this.props.navigation.navigate('profile');
      } else {
        global._opponentUser = user;
        global._prevScreen = 'profile_video';
        this.props.navigation.navigate('profile_other');
      }
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  onPressReport = () => {
    const params = {
      userId: global.me?.id,
      postId: this.state.item?.id,
    };

    RestAPI.report_post(params, (json, err) => {
      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else {
        if (json.status === 200) {
          global.success(Constants.SUCCESS_TITLE, 'Success to report');
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };
  onPressLike = (isChecked) => {
    if (this.state.isLiking) {
      return;
    }
    if (global.me) {
      const item = this.state.item || {};
      const { posts } = this.state;
      item.likeCount = (item.likeCount || 0) + (isChecked ? 1 : -1);
      item.isLiked = isChecked;
      const params = {
        userId: global.me?.id,
        ownerId: item?.user?.id,
        postId: item.id,
        isLiked: isChecked,
      };
      this.setState({ isLiking: true });
      RestAPI.update_like_post(params, (json, err) => {
        global.showForcePageLoader(false);

        if (err !== null) {
          Helper.alertNetworkError(err?.message);
        } else {
          if (json.status === 200) {
            this.setState({ posts });
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

  onPressShare = () => {
    if (global.me) {
      Global.sharePost(this.state.item, global.me);
    } else {
      this.props.navigation.navigate('signin');
    }
  };

  onOpenProfileSheet = () => {
    this.profileSheet?.current?.open();
  };

  onCloseComments = () => {
    this.profileSheet?.current?.close();
  };

  onAddComment = (postId, commentsCount) => {
    const { posts } = this.state;
    const newPosts = [...posts];
    const item = newPosts.find((p) => p.id === postId);
    if (item) {
      item.commentsCount = commentsCount;
    }
    this.setState({ posts: newPosts });
  };

  render() {
    return (
      <View style={[GStyles.container, styles.container]}>
        {this.___renderStatusBar()}
        {this._renderVideo()}
        {this._renderProgress()}
        {this._renderBack()}
        <RBSheet
          ref={this.profileSheet}
          openDuration={250}
          keyboardAvoidingViewEnabled={true}
          customStyles={{
            draggableIcon: {
              width: 0,
              height: 0,
              padding: 0,
              margin: 0,
            },
            container: {
              height: VIDEO_HEIGHT * 0.75,
            },
          }}
        >
          <CommentsScreen
            post={this.state.item}
            onCloseComments={this.onCloseComments}
            onAddComment={this.onAddComment}
          />
        </RBSheet>
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

  keyExtractor = (item, index) => index.toString();

  _renderVideo = () => {
    const { isFetching, posts } = this.state;

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        initialScrollIndex={
          posts.length > global._selIndex ? global._selIndex : 0
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
        data={posts}
        renderItem={this._renderItem}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 60,
        }}
        onViewableItemsChanged={this.onViewableItemsChanged}
        keyExtractor={this.keyExtractor}
        style={{ height: '100%', width: '100%' }}
      />
    );
  };

  actions = {
    onPressLike: this.onPressLike,
    onPressShare: this.onPressShare,
    onPressAvatar: this.onPressAvatar,
    onPressReport: this.onPressReport,
    onOpenProfileSheet: this.onOpenProfileSheet,
  };

  _renderItem = ({ item, index }) => (
    <RenderPosts
      item={item}
      curIndex={this.state.curIndex}
      isVideoPause={this.state.isVideoPause}
      actions={this.actions}
      index={index}
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
  return <PostsScreen {...props} navigation={navigation} route={route} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
});
