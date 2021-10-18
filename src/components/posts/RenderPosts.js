import React, { PureComponent } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';

import { GStyle, GStyles, Global } from '../../utils/Global';
import Avatar from '../elements/Avatar';
import avatars from '../../assets/avatars';
import Helper from '../../utils/Global/Util';
import CachedImage from '../CachedImage';

import LottieView from 'lottie-react-native';
import Heart from '../../assets/lottie/heart';

const heart = require('../../assets/images/gifts/heart.png');
const eye = require('../../assets/images/Icons/ic_eye.png');
const ic_comment = require('../../assets/images/Icons/ic_comment.png');
const ic_share = require('../../assets/images/Icons/ic_share.png');

const randomNumber = Math.floor(Math.random() * avatars.length);
const randomImageUrl = avatars[randomNumber];

const VIDEO_HEIGHT = Dimensions.get('window').height;

class RenderPosts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showTexts: false,
      lastPress: 0,
      showHeart: false,
    };
  }

  onLike = () => {
    const { item, actions } = this.props;
    const isLike = !!item.isLiked;

    if (!isLike) {
      this.setState({ showHeart: true });
      setTimeout(() => {
        this.setState({ showHeart: false });
      }, 1000);
    }
    actions.onPressLike(!isLike);
  };

  onPress = () => {
    const delta = new Date().getTime() - this.state.lastPress;

    if (delta < 200) {
      this.onLike();
      this.setState({ lastPress: 0 });
    } else {
      this.setState({ lastPress: new Date().getTime() });
      this.setState((prev) => ({ showTexts: !prev.showTexts }));
    }
  };

  onPressComments = () => {
    this.props.actions.onOpenProfileSheet();
  };

  render() {
    const { showHeart, showTexts } = this.state;
    const {
      item,
      actions,
      detailStyle,
      isVideoPause,
      curIndex,
      index,
    } = this.props;
    const user = item.user || {};
    const isLike = !!item.isLiked;

    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={this.onPress}
      >
        <>
          <Video
            source={{
              uri: Global.convertToHLS(item.url || ''),
            }}
            repeat
            paused={isVideoPause || curIndex !== index}
            poster={item.thumb}
            resizeMode="contain"
            posterResizeMode="contain"
            style={styles.video}
          />
          {showHeart && (
            <View style={styles.lottieContainer}>
              <LottieView source={Heart} autoPlay loop style={styles.lottie} />
            </View>
          )}
          <View
            style={[GStyles.playInfoWrapper, detailStyle, styles.detailStyle]}
          >
            <View style={styles.textsContainer}>
              {showTexts && (
                <>
                  {!!item?.title && (
                    <View style={styles.textContainer}>
                      <Text numberOfLines={5} style={styles.title}>
                        {item.title}
                      </Text>
                    </View>
                  )}
                  {!!item?.description && (
                    <View style={[styles.textContainer, { marginTop: 12 }]}>
                      <Text numberOfLines={5} style={styles.description}>
                        {item.description}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>

            <View style={GStyles.centerAlign}>
              <TouchableOpacity
                onPress={this.onLike}
                style={[GStyles.videoActionButton]}
              >
                <CachedImage
                  source={heart}
                  style={{
                    ...GStyles.actionIcons,
                    tintColor: isLike ? GStyle.primaryColor : 'white',
                  }}
                  tintColor={isLike ? GStyle.primaryColor : 'white'}
                />
              </TouchableOpacity>
              <Text style={GStyles.textSmall}>
                {typeof item.likeCount === 'number' ? item.likeCount : 0}
              </Text>
              <TouchableOpacity
                onPress={this.onPressComments}
                style={GStyles.videoActionButton}
              >
                <CachedImage
                  source={ic_comment}
                  style={GStyles.actionIcons}
                  tintColor={'white'}
                />
              </TouchableOpacity>
              <Text style={GStyles.textSmall}>{item.commentsCount || 0}</Text>

              <TouchableOpacity
                onPress={actions.onPressShare}
                style={GStyles.videoActionButton}
              >
                <CachedImage
                  source={ic_share}
                  style={GStyles.actionIcons}
                  tintColor={'white'}
                />
              </TouchableOpacity>
              <Avatar
                image={{
                  uri: user.photo ? user.photo : randomImageUrl,
                }}
                size={40}
                onPress={actions.onPressAvatar}
                containerStyle={{ marginVertical: 16 }}
              />
            </View>
          </View>
          <View style={styles.topPart}>
            <TouchableOpacity
              style={styles.topBadge}
              onPress={actions.onPressReport}
            >
              <Text style={GStyles.textSmall}>Report</Text>
            </TouchableOpacity>
            <View style={styles.topBadge}>
              <CachedImage
                source={eye}
                style={styles.viewCountIcon}
                tintColor="white"
              />
              <Text style={GStyles.textSmall}>{item.viewCount || 0}</Text>
            </View>
          </View>
        </>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: 'black',
  },
  topPart: {
    position: 'absolute',
    flexDirection: 'row',
    right: 16,
    top: 32 + Helper.getStatusBarHeight(),
  },
  video: {
    width: '100%',
    height: '100%',
  },
  detailStyle: {
    flexDirection: 'row',
    ...GStyles.rowBetweenContainer,
  },
  lottieContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    height: 150,
    alignSelf: 'center',
    position: 'absolute',
  },
  title: {
    ...GStyles.elementLabel,
    color: 'white',
  },
  description: {
    ...GStyles.textSmall,
    color: 'white',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 4,
    borderRadius: 8,
  },
  textsContainer: {
    flex: 1,
    height: '100%',
    marginRight: 12,
    justifyContent: 'flex-end',
  },
  topBadge: {
    flexDirection: 'row',
    ...GStyles.centerContainer,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  viewCountIcon: {
    width: 16,
    height: 16,
    tintColor: 'white',
    marginRight: 6,
  },
});

export default RenderPosts;
