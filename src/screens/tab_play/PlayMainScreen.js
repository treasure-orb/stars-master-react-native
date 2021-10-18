import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import RBSheet from './../../components/react-native-raw-bottom-sheet';

import RenderPosts from '../../components/posts/RenderPosts';
import ProgressModal from '../../components/ProgressModal';

import { setMyUserAction } from '../../redux/me/actions';

import {
  Constants,
  Global,
  GStyles,
  Helper,
  RestAPI,
  Miscs,
} from '../../utils/Global';
import CommentsScreen from '../details/CommentsScreen';

const SHEET_HEIGHT = Helper.getWindowHeight() * 0.75;

class PlayMainScreen extends Component {
  constructor(props) {
    super(props);

    this.profileSheet = React.createRef();
    this.init();
    //SplashScreen.hide();
  }

  componentDidMount() {
    this.onRefresh('init');
    global.checkSignIn = this.checkSignIn;
    this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
      Helper.setDarkStatusBar();
      this.setState({ isVideoPause: false });
    });
    this.unsubscribeBlur = this.props.navigation.addListener('blur', () => {
      this.setState({ isVideoPause: true });
    });
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
  }

  componentWillUnmount() {
    this.unsubscribeFocus && this.unsubscribeFocus();
    this.unsubscribeBlur && this.unsubscribeBlur();
    global.checkSignIn = null;
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  init = async () => {
    this.state = {
      isVideoPause: false,
      posts: [],
      isVisibleProgress: false,
      percent: 0,

      isFetching: false,
      isLiking: false,
      totalCount: 0,
      item: {},
      onEndReachedDuringMomentum: true,
      curIndex: 0,
    };
    await Helper.setDeviceId();
  };

  onRefresh = async (type) => {
    let { posts, isFetching, totalCount } = this.state;
    if (isFetching) {
      return;
    }
    const storageUsername = await Helper.getLocalValue(Constants.KEY_USERNAME);
    const storagePassword = await Helper.getLocalValue(Constants.KEY_PASSWORD);

    const guestUsername = 'guest_' + global._devId;
    const guestPassword = 'guest_' + global._devId;

    const username = storageUsername || guestUsername;
    const password = storagePassword || guestPassword;

    let params = {
      userId: global.me ? global.me.id : '',
      amount: Constants.COUNT_PER_PAGE,
      username,
      password,
    };
    if (type === 'more') {
      if (totalCount > Constants.COUNT_PER_PAGE) {
        params.lastMessageCreatedAt =
          posts[posts.length - 1]?.createdAt || new Date();
      } else {
        return;
      }
    }
    this.setState({ onEndReachedDuringMomentum: true });

    if (type !== 'init') {
      this.setState({ isFetching: true });
    }

    RestAPI.get_new_post_list(params, async (json, err) => {
      if (type !== 'init') {
        this.setState({ isFetching: false });
      }
      global.setIsInitLoading(false);
      global.showForcePageLoader(false);
      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else if (json?.status === 200) {
        const user = json.data?.loginResult?.user;
        const postList = json?.data?.postList || [];
        this.setState({ totalCount: json.data.totalCount || 0 });
        if (user) {
          Miscs.initUser(user, username, password);
          this.props.setMyUserAction(user);
        }

        if (type === 'more') {
          let data = [];
          postList.forEach((post) => {
            if (!posts.find((p) => p.id === post.id)) {
              data.push(post);
            }
          });
          data = posts.concat(data);
          this.setState({ posts: data });
        } else {
          this.setState({
            posts: postList,
          });
          if (postList?.length > 0) {
            this.viewItem(postList[0]);
          }
        }
      } else {
        Helper.alertServerDataError();
      }
    });
  };

  onBack = () => {
    if (this.props.navigation.isFocused()) {
      Alert.alert(Constants.WARNING_TITLE, 'Are you sure to quit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    }

    return false;
  };

  onViewableItemsChanged = ({ changed }) => {
    changed.forEach((change) => {
      if (change.isViewable) {
        const item = change?.item;
        if (this.state.item?.id !== change?.item.id) {
          this.setState({ curIndex: change.index, item });
          global._opponentUser = item.user;
          this.viewItem(item);
        }
      } else {
      }
    });
  };

  viewItem = (item) => {
    let params = {
      postId: item.id,
      viewerId: global.me ? global.me.id : 0,
      deviceType: Platform.OS === 'ios' ? '1' : '0',
      deviceIdentifier: global._deviceId,
    };
    RestAPI.update_post_view(params, (json, err) => {});
  };

  onPressAvatar = () => {
    const user = this.state.item?.user || {};
    if (global.me) {
      if (user.id === global.me?.id) {
        this.props.navigation.jumpTo('profile');
      } else {
        global._opponentUser = user;
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
        postId: item?.id,
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

  onAddComment = (postId, commentsCount) => {
    const { posts } = this.state;
    const newPosts = [...posts];
    const item = newPosts.find((p) => p.id === postId);
    if (item) {
      item.commentsCount = commentsCount;
    }
    this.setState({ posts: newPosts });
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

  checkSignIn = () => {
    this.onRefresh();
  };

  render() {
    const { posts } = this.state;

    return (
      <View style={[GStyles.container, styles.container]}>
        {this.___renderStatusBar()}
        {this._renderVideo()}
        {posts?.length < 1 && this._renderNotFound()}
        {this._renderProgress()}
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
              height: SHEET_HEIGHT,
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

  onMomentumScrollBegin = () => {
    this.setState({ onEndReachedDuringMomentum: false });
  };

  onEndReached = () => {
    if (!this.state.onEndReachedDuringMomentum) {
      this.setState({ onEndReachedDuringMomentum: true });
      this.onRefresh('more');
    }
  };

  pullRefresh = () => {
    this.onRefresh('pull');
  };

  keyExtractor = (item) => item.id;

  _renderVideo = () => {
    const { isFetching, posts } = this.state;

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        pagingEnabled
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={6}
        onRefresh={this.pullRefresh}
        refreshing={isFetching}
        ListFooterComponent={this._renderFooter}
        onEndReachedThreshold={0.4}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        onEndReached={this.onEndReached}
        data={posts}
        renderItem={this._renderItem}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 60,
        }}
        removeClippedSubviews={false}
        onViewableItemsChanged={this.onViewableItemsChanged}
        keyExtractor={this.keyExtractor}
        style={{ height: '100%', width: '100%' }}
      />
    );
  };

  _renderNotFound = () => {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          ...GStyles.centerAlign,
          position: 'absolute',
        }}
      >
        <Text style={GStyles.notifyDescription}>
          You have watched all videos.
        </Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
});

export default connect(
  (state) => ({
    user: state.me?.user || {},
  }),
  { setMyUserAction },
)(PlayMainScreen);
