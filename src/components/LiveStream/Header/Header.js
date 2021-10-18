import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { StackActions, useNavigation } from '@react-navigation/native';

import styles from './styles';
import { GStyles, RestAPI } from '../../../utils/Global';
import GStyle from '../../../utils/Global/Styles';

import { LIVE_STATUS } from '../../../utils/LiveStream/Constants';
import ic_love from '../../../assets/images/Icons/ic_love-potion.png';
import ic_star from '../../../assets/images/Icons/ic_star.png';
import ic_flame from '../../../assets/images/Icons/ic_flame.png';
import ic_close from '../../../assets/images/Icons/ic_close.png';

import avatars from '../../../assets/avatars';
import Helper from '../../../utils/Global/Util';
import CachedImage from '../../CachedImage';

const randomNumber = Math.floor(Math.random() * avatars.length);
const randomImageUrl = avatars[randomNumber];

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.timer = null;
    this.state = {
      showingRandomProduct: false,
      randomProduct: null,
    };
  }

  componentDidMount(): void {
    this.interval = setInterval(this.onRandomProduct, 30000);
  }

  componentWillUnmount(): void {
    clearInterval(this.interval);
    clearTimeout(this.timer);
  }

  onRandomProduct = () => {
    RestAPI.get_random_video({}, (json, err) => {
      if (err !== null) {
        Helper.alertNetworkError();
      } else {
        if (json.status === 200) {
          const randomProduct = json?.data || {};
          this.setState({
            showingRandomProduct: true,
            randomProduct,
          });
        } else {
          Helper.alertServerDataError();
        }
      }
    });

    this.timer = setTimeout(this.onHideProduct, 15000);
  };

  onHideProduct = () => {
    this.setState({
      showingRandomProduct: false,
      randomProduct: null,
    });
  };

  onPressClose = () => {
    const { navigation, onPressClose } = this.props;
    if (onPressClose) {
      onPressClose();
    } else {
      navigation.goBack();
    }
  };

  onPressVideo = () => {
    const { randomProduct } = this.state;
    global._productsList = [randomProduct];
    global._prevScreen = 'stream_header';
    const pushAction = StackActions.push('profile_video', null);
    this.props.navigation.dispatch(pushAction);
  };

  onPressProfileAction = () => {
    const { onPressProfileAction } = this.props;
    const user = this.props.room?.user;
    onPressProfileAction && onPressProfileAction(user);
  };

  render() {
    const { room, liveStatus, mode } = this.props;
    const { showingRandomProduct, randomProduct } = this.state;
    const streamer = room?.user || {};
    const streamerName = streamer?.username;
    const avatarImage = { uri: streamer?.photo || randomImageUrl };
    const level = Helper.getLvlLiveStream(room?.elixir || 0);
    const progress = Helper.getProgress(room?.elixir || 0, level);

    const badgeBackground =
      liveStatus === LIVE_STATUS.ON_LIVE
        ? 'red'
        : liveStatus === LIVE_STATUS.PREPARE
        ? GStyle.primaryColor
        : GStyle.grayColor;
    const badgeText =
      liveStatus === LIVE_STATUS.ON_LIVE
        ? 'Live'
        : liveStatus === LIVE_STATUS.PREPARE
        ? 'Preparing'
        : 'Finished';

    return (
      <View>
        <View style={styles.wrapper}>
          <View styles={styles.infoWrapper}>
            <View style={styles.streamerInfoWrapper}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0)']}
                style={styles.streamerGradient}
              >
                <View style={styles.textWrapper}>
                  <Text style={[GStyles.textExtraSmall]}>{streamerName}</Text>
                  <Text style={GStyles.textExtraSmall}>
                    {room?.people?.length || 0}
                  </Text>
                </View>
              </LinearGradient>
              <TouchableOpacity
                style={styles.userAvatarImage}
                onPress={this.onPressProfileAction}
              >
                <CachedImage
                  source={avatarImage}
                  style={{ width: '100%', height: '100%' }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.streamInfoWrapper}>
              <View style={styles.infoLabelWrapper}>
                <CachedImage source={ic_love} style={styles.infoIcon} />
                <Text style={styles.archiveText}>{room?.elixir || 0}</Text>
              </View>
              <View style={styles.progressWrapper}>
                <View style={[styles.infoLabelWrapper, { marginRight: 0 }]}>
                  <CachedImage source={ic_star} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{level} Star</Text>
                </View>
                <View style={[styles.progress, { width: progress }]} />
              </View>
              <View style={styles.infoLabelWrapper}>
                <CachedImage source={ic_flame} style={styles.infoIcon} />
                <Text style={styles.infoText}>{room?.elixirFlame || 0}</Text>
              </View>
            </View>
          </View>
          <View style={GStyles.centerAlign}>
            <TouchableOpacity
              style={styles.btnClose}
              onPress={this.onPressClose}
            >
              <CachedImage
                style={styles.icoClose}
                source={ic_close}
                tintColor="white"
              />
            </TouchableOpacity>
            {mode !== 'streamer' && (
              <View
                style={[
                  styles.badgeWrapper,
                  { backgroundColor: badgeBackground },
                ]}
              >
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            )}
          </View>
        </View>

        {showingRandomProduct && randomProduct && (
          <View style={[GStyles.rowEndContainer]}>
            <TouchableOpacity
              onPress={this.onPressVideo}
              style={{
                marginTop: 24,
                marginRight: 16,
                overflow: 'hidden',
                borderRadius: 16,
                backgroundColor: 'rgba(16, 33, 75, 0.88)',
                width: 100,
                height: 120,
              }}
            >
              <CachedImage
                source={{ uri: randomProduct?.thumb }}
                style={{ width: '100%', height: '100%' }}
              />
              <View
                style={[
                  GStyles.columnEndContainer,
                  {
                    position: 'absolute',
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    padding: 8,
                  },
                ]}
              >
                <View style={GStyles.rowContainer}>
                  <Text style={styles.archiveText}>
                    ৳ {randomProduct?.price || 0}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

export default (props) => {
  let navigation = useNavigation();
  return <Component {...props} navigation={navigation} />;
};
