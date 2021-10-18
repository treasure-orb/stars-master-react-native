import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import RBSheet from 'react-native-raw-bottom-sheet';

import {
  Constants,
  GStyle,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';
import GHeaderBar from '../../components/GHeaderBar';
import ProductsList from '../../components/elements/ProductsList';
import PostItem from '../../components/elements/PostItem';

class MyPostsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    this.onRefresh('init');
  }

  init = () => {
    this.state = {
      posts: [],
      totalCount: 0,
      curPage: 1,
      isFetching: false,
      onEndReachedDuringMomentum: true,
    };

    this._selItem = null;
  };

  onRefresh = (type) => {
    let { isFetching, totalCount, curPage, posts } = this.state;
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
      user_id: global.me ? global.me?.id : '',
      me_id: global.me ? global.me?.id : '',
      page_number: type === 'more' ? curPage : '1',
      count_per_page: Constants.COUNT_PER_PAGE,
    };
    //global.showForcePageLoader(true);
    RestAPI.get_user_post_list(params, (json, err) => {
      if (type === 'init') {
        global.showForcePageLoader(false);
      } else {
        this.setState({ isFetching: false });
      }

      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else if (json?.status === 200) {
        this.setState({ totalCount: json.data?.totalCount });
        const postList = json.data?.postList || [];
        if (type === 'more') {
          let data = posts.concat(postList);
          this.setState({ posts: data });
        } else {
          this.setState({ posts: postList });
        }
      } else {
        Helper.alertServerDataError();
      }
    });
  };

  onPressVideo = (item) => {
    const { posts } = this.state;
    global._selIndex = posts.findIndex((obj) => obj.id === item.id);
    global._postsList = posts;
    global._prevScreen = 'profile_my_post';
    const pushAction = StackActions.push('post_detail', null);
    this.props.navigation.dispatch(pushAction);
  };

  onLongPressVideo = (item) => {
    this._selItem = item;
    this.bottomMenu?.open();
  };

  onPressDelete = () => {
    const { posts } = this.state;

    const newPosts = posts.filter((post) => post.id !== this._selItem.id);
    this.setState({ posts: newPosts });

    this.bottomMenu.close();

    this.deletePost();
  };

  onPressNewProduct = () => {
    if (global.me?.isBannedPost) {
      alert('You are not allowed to post posts');
      return;
    }
    global._prevScreen = 'my_posts';
    global._videoUri = '';
    global._thumbUri = '';
    this.props.navigation.navigate('post_upload');
    // Alert.alert('', 'Choose an option.', [
    //   {
    //     text: 'Camera',
    //     onPress: () =>
    //       this.props.navigation.navigate('camera_main', {
    //         maxDuration: 20,
    //         mode: 2,
    //       }),
    //   },
    //   {
    //     text: 'Photo Gallery',
    //     onPress: () => {
    //       global._prevScreen = 'my_posts';
    //       global._videoUri = '';
    //       global._thumbUri = '';
    //       this.props.navigation.navigate('post_upload');
    //     },
    //   },
    // ]);
  };

  deletePost = () => {
    let params = {
      postId: this._selItem?.id,
      userId: global?.me?.id,
    };
    RestAPI.delete_post(params, (json, err) => {});
  };

  _renderBottomMenu = () => (
    <ScrollView style={{ width: '100%' }}>
      <TouchableOpacity
        onPress={this.onPressDelete}
        style={{ ...styles.panelButton }}
      >
        <Text style={styles.panelButtonTitle}>Delete</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  setOnEndReachedDuringMomentum = (onEndReachedDuringMomentum) => {
    this.setState({
      onEndReachedDuringMomentum,
    });
  };

  renderItem = ({ item, index }) => {
    return (
      <PostItem
        item={item}
        onPress={this.onPressVideo}
        onLongPress={this.onLongPressVideo}
        index={index}
      />
    );
  };

  _renderVideo = () => {
    const { isFetching, posts, onEndReachedDuringMomentum } = this.state;
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <ProductsList
          products={posts}
          onRefresh={this.onRefresh}
          isFetching={isFetching}
          onPressVideo={this.onPressVideo}
          renderItem={this.renderItem}
          onLongPressVideo={this.onLongPressVideo}
          onEndReachedDuringMomentum={onEndReachedDuringMomentum}
          setOnEndReachedDuringMomentum={this.setOnEndReachedDuringMomentum}
        />
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={GStyles.container}>
        <GHeaderBar
          headerTitle="My Videos"
          leftType="back"
          navigation={navigation}
          rightAvatar={
            <TouchableOpacity onPress={this.onPressNewProduct}>
              <Text
                style={[
                  GStyles.textSmall,
                  GStyles.boldText,
                  { color: 'black' },
                ]}
              >
                Add Video
              </Text>
            </TouchableOpacity>
          }
        />
        {this._renderVideo()}
        <RBSheet
          ref={(ref) => {
            this.bottomMenu = ref;
          }}
          height={300}
          closeOnDragDown
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
          }}
        >
          <View
            style={{
              ...GStyles.rowContainer,
              justifyContent: 'space-around',
            }}
          >
            {this._renderBottomMenu()}
          </View>
        </RBSheet>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  panelButton: {
    width: '100%',
    height: 36,
    backgroundColor: GStyle.grayBackColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 1,
  },
  panelButtonTitle: {
    fontSize: 14,
  },
});

export default (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return <MyPostsScreen {...props} navigation={navigation} route={route} />;
};
