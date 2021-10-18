import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Constants, GStyles, Helper, RestAPI } from '../../utils/Global';
import CommentItem from '../../components/posts/CommentItem';
import WriteComment from '../../components/posts/WriteComment';
import ic_close from '../../assets/images/Icons/ic_close.png';
import CachedImage from '../../components/CachedImage';

const VIDEO_HEIGHT = Dimensions.get('window').height;

const CommentsScreen = ({ post, onCloseComments, onAddComment }) => {
  const [comments, setComments] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [onEndReachedDuringMomentum, setOnEndReachedDuringMomentum] = useState(
    true,
  );
  const [curPage, setCurPage] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    onRefresh('init');
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );
    return () => {
      keyboardDidShowListener && keyboardDidShowListener.remove();
      keyboardDidHideListener && keyboardDidHideListener.remove();
    };
  }, []);

  const _keyboardDidShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const _keyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  const onRefresh = (type) => {
    if (isFetching) {
      return;
    }
    let tempPage;
    if (type === 'more') {
      tempPage = curPage + 1;
      const maxPage =
        (totalCount + Constants.COUNT_PER_PAGE - 1) / Constants.COUNT_PER_PAGE;
      if (tempPage > maxPage) {
        return;
      }
    } else {
      tempPage = 1;
    }

    setCurPage(tempPage);

    setOnEndReachedDuringMomentum(true);
    if (type === 'init') {
      //global.showForcePageLoader(true);
    } else {
      setIsFetching(true);
    }

    let params = {
      postId: post?.id,
      user_id: global.me ? global.me?.id : '',
      page_number: type === 'more' ? tempPage : '1',
      count_per_page: Constants.COUNT_PER_PAGE,
    };
    RestAPI.get_all_comment_list(params, (json, err) => {
      if (type === 'init') {
        global.showForcePageLoader(false);
      } else {
        setIsFetching(false);
      }

      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else if (json?.status === 200) {
        setTotalCount(json.data?.totalCount || 0);
        const commentsList = json.data?.comments || [];
        if (type === 'more') {
          let data = comments.concat(commentsList);
          setComments(data);
        } else {
          setComments(commentsList);
        }
      } else {
        Helper.alertServerDataError();
      }
    });
  };

  const onPressComment = (text) => {
    if (!text) {
      return;
    }
    let params = {
      userId: global.me ? global.me?.id : '',
      postId: post?.id,
      description: text,
    };
    RestAPI.add_comment(params, (json, err) => {
      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else if (json?.status === 201) {
        const data = json?.data || {};
        const comment = data?.comment || {};
        let newComments = [comment].concat(comments);
        setComments(newComments);
        if (data?.commentsCount) {
          onAddComment(post?.id, data?.commentsCount);
        }
        if (data?.totalCount) {
          setTotalCount(data?.totalCount);
        }
      } else {
        Helper.alertServerDataError();
      }
    });
  };

  const _renderItem = ({ item }) => <CommentItem comment={item} />;
  const marginBottom =
    Platform.OS === 'ios'
      ? keyboardHeight
      : Math.max(0, keyboardHeight - 0.25 * VIDEO_HEIGHT + 24);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView enabled={false} style={{ flex: 1 }}>
        <View>
          <Text
            style={[
              GStyles.regularText,
              { alignSelf: 'center', fontWeight: '700' },
            ]}
          >
            {totalCount} comments
          </Text>
          <TouchableOpacity
            onPress={onCloseComments}
            style={{ position: 'absolute', right: 0 }}
          >
            <CachedImage
              style={styles.icoClose}
              source={ic_close}
              tintColor="black"
            />
          </TouchableOpacity>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            onRefresh('pull');
          }}
          refreshing={isFetching}
          onEndReachedThreshold={0.2}
          onMomentumScrollBegin={() => {
            setOnEndReachedDuringMomentum(false);
          }}
          onEndReached={() => {
            if (!onEndReachedDuringMomentum) {
              setOnEndReachedDuringMomentum(true);
              onRefresh('more');
            }
          }}
          data={comments}
          renderItem={_renderItem}
          keyExtractor={(item) => item.id}
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={{ paddingBottom: 64 }}
        />
        <View style={{ marginBottom: marginBottom }}>
          <WriteComment post={post} onPressComment={onPressComment} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
  },
  contentContainerStyle: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  icoClose: {
    width: 12,
    height: 12,
    tintColor: 'black',
  },
});

export default CommentsScreen;
