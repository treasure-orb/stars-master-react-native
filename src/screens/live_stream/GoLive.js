import React from 'react';
import {
  Alert,
  BackHandler,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { connect } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import KeepAwake from 'react-native-keep-awake';

import StartPanel from './StartPanel';
import LiveStreamFooter from '../../components/LiveStream/LiveStreamFooter';
import FloatingHearts from '../../components/LiveStream/FloatingHearts';
import Header from '../../components/LiveStream/Header';

import SocketManager from '../../utils/LiveStream/SocketManager';
import { LIVE_STATUS } from '../../utils/LiveStream/Constants';
import { Constants, Global, RestAPI } from '../../utils/Global';
import { setGifts } from '../../redux/liveStream/actions';
import styles from './styles';
import ic_audio from './../../assets/images/Icons/ic_audio_on.png';
import ProfileBottom from '../../components/LiveStream/ProfileBottom/ProfileBottom';
import CachedImage from '../../components/CachedImage';
import StaticHeart from '../../components/LiveStream/FloatingHearts/StaticHeart';

const RTMP_SERVER = Constants.RTMP_SERVER;

class GoLive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      room: {},
      isMuted: false,
      audioConfig: {
        bitrate: 32000,
        profile: 1,
        samplerate: 44100,
      },
      videoConfig: {
        bitrate: 200000,
        preset: 0,
        profile: 0,
        fps: 15,
        videoFrontMirror: true,
      },
      preparing: true,
      showHeart: false,
      countHeart: 0,
    };
    this.profileSheet = React.createRef();
    this.timeout = null;
  }

  componentDidMount() {
    this.init();
    BackHandler.addEventListener('hardwareBackPress', this.onPressClose);
    KeepAwake.activate();
  }

  init = () => {
    this.requestCameraPermission();
    const user = this.props.user || {};
    if (user.isBannedPost) {
      this.handleBannedUser();
      return;
    }
    const { id: streamerId, username: roomName } = user;
    SocketManager.instance.connect();
    SocketManager.instance.emitJoinRoom({
      streamerId,
      userId: streamerId,
    });

    SocketManager.instance.listenPrepareLiveStream((room) => {
      if (streamerId === room?.user) {
        this.setState({
          room: {
            ...room,
            user: this.props.user || {},
            liveStatus: room?.liveStatus || 0,
            //countHeart: 0,
          },
          countHeart: 0,
        });
      }
    });

    SocketManager.instance.listenBeginLiveStream((room) => {
      if (room?.user === streamerId) {
        this.setState((prevState) => ({
          room: {
            ...prevState?.room,
            liveStatus: room?.liveStatus || 1,
            mode: room?.mode || 0,
          },
          preparing: false,
        }));
      }
    });

    SocketManager.instance.listenErrorLiveStream(() => {
      this.handleBannedUser();
    });

    SocketManager.instance.listenFinishLiveStream((data) => {
      if (data?.user === streamerId) {
        this.setState((prevState) => ({
          room: {
            ...prevState?.room,
            liveStatus: LIVE_STATUS.FINISH,
          },
        }));
      }
    });
    SocketManager.instance.listenSendHeart((data) => {
      const room = data?.room;
      if (
        room?.liveStatus !== LIVE_STATUS.ON_LIVE ||
        this.state.room?.liveStatus !== LIVE_STATUS.ON_LIVE ||
        this.state.preparing
      ) {
        return;
      }
      if (room) {
        this.setState((prevState) => ({
          room,
          //countHeart: prevState.countHeart + 1,
          showHeart: true,
        }));
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.setState({
            showHeart: false,
          });
        }, 1500);
      }
    });
    SocketManager.instance.listenSendMessage((data) => {
      const { message, room } = data;
      if (
        room?.liveStatus !== LIVE_STATUS.ON_LIVE ||
        this.state.room?.liveStatus !== LIVE_STATUS.ON_LIVE ||
        this.state.preparing
      ) {
        return;
      }
      if (message && message?.sender?.id !== this.props.user?.id) {
        const messages = this.state.messages || [];
        this.setState({ messages: [message].concat(messages) });
      }
      if (room) {
        this.setState({ room });
      }
    });
    SocketManager.instance.listenSendGift((data) => {
      const { gift, room, senderName } = data;
      if (
        room?.liveStatus !== LIVE_STATUS.ON_LIVE ||
        this.state.room?.liveStatus !== LIVE_STATUS.ON_LIVE ||
        this.state.preparing
      ) {
        return;
      }
      if (gift) {
        const message = {
          message: `Sent a ${gift.name}`,
          giftIcon: gift.icon,
          sender: {
            username: senderName,
          },
        };
        const messages = this.state.messages || [];
        this.setState({ messages: [message].concat(messages) });
      }
      if (room) {
        this.setState({ room });
      }
    });
    SocketManager.instance.emitPrepareLiveStream({
      streamerId,
      roomName,
    });
    RestAPI.get_gifts({ userId: this.props.user?.id }, (json, error) => {
      if (json?.status === 200 || json?.data) {
        this.props.setGifts(json.data.gifts || []);
      }
    });
  };

  componentWillUnmount() {
    const user = this.props.user || {};
    const { id: streamerId } = user;
    if (this.nodeCameraViewRef) {
      this.nodeCameraViewRef.stop();
    }
    SocketManager.instance.emitFinishLiveStream({ streamerId });
    SocketManager.instance.removePrepareLiveStream();
    SocketManager.instance.removeBeginLiveStream();
    SocketManager.instance.removeErrorLiveStream();
    SocketManager.instance.removeFinishLiveStream();
    SocketManager.instance.removeSendHeart();
    SocketManager.instance.removeSendMessage();
    SocketManager.instance.removeSendGift();
    SocketManager.instance.emitLeaveRoom({
      userId: streamerId,
      streamerId,
    });
    BackHandler.removeEventListener('hardwareBackPress', this.onPressClose);
    KeepAwake.deactivate();
  }
  handleBannedUser = () => {
    alert('You are not allowed to stream.');
    this.props.navigation.goBack();
  };

  onPressShareAction = async () => {
    const { room } = this.state;
    const { user } = this.props;
    Global.inviteToLiveStream(room, user);
  };

  onPressProfileAction = (user) => {
    global._opponentUser = user || {};
    this.profileSheet?.current?.open();
  };

  onPressSwitchCamera = () => {
    this.nodeCameraViewRef.switchCamera();
  };

  onPressSwitchAudio = () => {
    const { isMuted } = this.state;
    this.setState({
      // audioConfig: {
      //   bitrate: isMuted ? 32000 : 0,
      //   profile: 1,
      //   samplerate: 44100,
      // },
      isMuted: !isMuted,
    });
  };

  onPressSendMessage = (message) => {
    if (!message) {
      return;
    }
    const user = this.props.user || {};
    const { id: streamerId } = user;
    const messages = this.state.messages || [];
    this.setState({
      messages: [
        {
          message,
          sender: user,
          messageType: 1,
        },
      ].concat(messages),
    });
    SocketManager.instance.emitSendMessage({
      streamerId,
      message,
      userId: streamerId,
    });
  };

  onCloseProfileSheet = () => {
    this.profileSheet?.current?.close();
  };

  onPressClose = () => {
    if (this.props.navigation.isFocused()) {
      Alert.alert(Constants.WARNING_TITLE, 'Stop broadcast?', [
        {
          text: 'NO',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => this.props.navigation.goBack() },
      ]);
      return true;
    }
    return false;
  };

  onPressStart = (topic, thumbnail, mode) => {
    const { navigation } = this.props;
    const user = this.props.user || {};
    const { id: streamerId, username: roomName } = user;
    const liveStatus = this.state.room?.liveStatus || 0;
    if (liveStatus === -1) {
      alert('Error while initializing live.');
      return;
    }
    if (Number(liveStatus) === Number(LIVE_STATUS.PREPARE)) {
      /**
       * Waiting live stream
       */
      SocketManager.instance.emitBeginLiveStream({
        streamerId,
        roomName,
        topic,
        thumbnail,
        mode,
      });
      if (this.nodeCameraViewRef) {
        this.nodeCameraViewRef.startPreview();
        this.nodeCameraViewRef.start();
      }
    } else if (Number(liveStatus) === Number(LIVE_STATUS.ON_LIVE)) {
      /**
       * Finish live stream
       */
      SocketManager.instance.emitFinishLiveStream({
        streamerId,
      });
      if (this.nodeCameraViewRef) {
        this.nodeCameraViewRef.stop();
      }
      Alert.alert(
        'Alert ',
        'Thanks for your live stream',
        [
          {
            text: 'Okay',
            onPress: () => {
              navigation.goBack();
              SocketManager.instance.emitLeaveRoom({
                streamerId,
                userId: streamerId,
              });
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  requestCameraPermission = async () => {
    const granted = await Global.checkPermissionsForVideo();
    if (!granted) {
      Alert.alert(
        Constants.WARNING_TITLE,
        'Camera or Microphone permission is not granted. You can not record properly. Continue? ',
        [
          {
            text: 'NO',
            onPress: () => this.props.navigation.goBack(),
            style: 'cancel',
          },
          { text: 'YES', onPress: () => null },
        ],
      );
    }
  };

  setCameraRef = (ref) => {
    this.nodeCameraViewRef = ref;
  };

  render() {
    const {
      messages,
      audioConfig,
      videoConfig,
      isMuted,
      room,
      preparing,
      showHeart,
    } = this.state;
    const user = this.props.user || {};
    //const countHeart = room?.countHeart || 0;
    const liveStatus = room?.liveStatus || 0;
    const mode = room?.mode || 0;

    const { id: streamerId } = user;
    const outputUrl = `${RTMP_SERVER}/live/${streamerId}`;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <NodeCameraView
          style={[styles.streamerView, mode === 1 && { width: 0, height: 0 }]}
          ref={this.setCameraRef}
          outputUrl={outputUrl}
          camera={{ cameraId: 0, cameraFrontMirror: true }}
          audio={audioConfig}
          video={{
            ...videoConfig,
            ...(mode === 1 && {
              bitrate: 0,
            }),
          }}
          scaleMode={'ScaleAspectFit'}
          smoothSkinLevel={3}
          autopreview={false}
        />
        {liveStatus === LIVE_STATUS.ON_LIVE && mode === 1 && (
          <View style={styles.audioLiveContainer}>
            <CachedImage source={ic_audio} style={{ width: 24, height: 24 }} />
          </View>
        )}

        {preparing && (
          <StartPanel
            liveStatus={liveStatus}
            onPressStart={this.onPressStart}
            onPressClose={this.onPressClose}
          />
        )}
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <Header
              room={room}
              liveStatus={liveStatus}
              mode="streamer"
              onPressClose={this.onPressClose}
              onPressProfileAction={this.onPressProfileAction}
            />
          </View>
          <LiveStreamFooter
            onPressSwitchCamera={this.onPressSwitchCamera}
            onPressSwitchAudio={this.onPressSwitchAudio}
            onPressShareAction={this.onPressShareAction}
            onPressProfileAction={this.onPressProfileAction}
            onPressSendMessage={this.onPressSendMessage}
            mode="streamer"
            method={mode}
            isMuted={isMuted}
            messages={messages}
          />
        </View>
        <RBSheet
          ref={this.profileSheet}
          openDuration={250}
          customStyles={{
            container: {
              backgroundColor: 'rgba(0, 0, 0, 0)',
              height: 420,
              overflow: 'visible',
            },
            wrapper: styles.sheetWrapper,
            draggableIcon: styles.sheetDragIcon,
          }}
        >
          <ProfileBottom onCloseProfileSheet={this.onCloseProfileSheet} />
        </RBSheet>
        {showHeart && <StaticHeart />}
        {/*<FloatingHearts count={countHeart} />*/}
      </SafeAreaView>
    );
  }
}

export default connect(
  (state) => ({
    user: state.me.user,
    gifts: state.liveStream?.gifts || [],
  }),
  { setGifts },
)(GoLive);
