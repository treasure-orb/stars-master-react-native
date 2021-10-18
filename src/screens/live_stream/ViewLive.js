import React, { Component } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { NodePlayerView } from 'react-native-nodemediaclient';
import RBSheet from 'react-native-raw-bottom-sheet';
import KeepAwake from 'react-native-keep-awake';

import SocketManager from '../../utils/LiveStream/SocketManager';
import Index from '../../components/LiveStream/LiveStreamFooter';
import FloatingHearts from '../../components/LiveStream/FloatingHearts';
import Gifts from '../../components/LiveStream/Gifts';
import Header from '../../components/LiveStream/Header';
import ProfileBottom from '../../components/LiveStream/ProfileBottom/ProfileBottom';

import { setGifts } from '../../redux/liveStream/actions';
import { LIVE_STATUS } from '../../utils/LiveStream/Constants';
import { Constants, Global, RestAPI } from '../../utils/Global';
import styles from './styles';
import ic_audio from '../../assets/images/Icons/ic_audio_on.png';
import { setMyUserAction } from '../../redux/me/actions';
import CachedImage from '../../components/CachedImage';
import StaticHeart from '../../components/LiveStream/FloatingHearts/StaticHeart';

const RTMP_SERVER = Constants.RTMP_SERVER;

class ViewLive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      inputUrl: null,
      room: {},
      countHeart: 0,
      showHeart: false,
      isJoined: false,
      lastPress: 0,
    };
    this.giftBottomSheet = React.createRef();
    this.messageBottomSheet = React.createRef();
    this.profileSheet = React.createRef();
    this.timeout = null;
  }

  componentDidMount() {
    const { route } = this.props;
    const roomId = get(route, 'params.roomId');

    const params = {
      roomId,
      userId: this.props.user?.id,
    };
    global.showForcePageLoader(true);

    RestAPI.get_liveStream(params, (json, err) => {
      global.showForcePageLoader(false);
      if (err || json?.status !== 200 || !json?.data) {
        alert('Error while loading the stream.');
      } else if (json?.status === 200) {
        const room = json?.data || {};
        this.setState({ room }, this.init);
      }
    });

    RestAPI.get_gifts({ userId: this.props.user?.id }, (json, error) => {
      if (json?.status === 200 || json?.data) {
        this.props.setGifts(json.data.gifts || []);
      }
    });

    KeepAwake.activate();
  }

  init = () => {
    const { user } = this.props;
    const { room } = this.state;
    if (room?.liveStatus !== LIVE_STATUS.ON_LIVE) {
      Alert.alert('', 'Live Streaming is over.', [
        { text: 'OK', onPress: this.props.navigation.goBack },
      ]);
    } else {
      const userId = user?.id;
      const streamerId = room?.user?.id;

      SocketManager.instance.emitJoinRoom({
        streamerId,
        userId,
      });
      SocketManager.instance.listenBeginLiveStream((newRoom) => {
        if (newRoom?.id === room?.id) {
          this.setState((prevState) => ({
            room: {
              ...prevState?.room,
              liveStatus: newRoom?.liveStatus || 1,
            },
          }));
        }
      });
      SocketManager.instance.listenPrepareLiveStream((newRoom) => {
        if (newRoom?.d === room?.id) {
          this.setState((prevState) => ({
            room: {
              ...prevState?.room,
              liveStatus: newRoom?.liveStatus || 0,
            },
          }));
        }
      });
      SocketManager.instance.listenFinishLiveStream(() => {
        this.setState((prevState) => ({
          room: {
            ...prevState?.room,
            liveStatus: LIVE_STATUS.FINISH,
          },
        }));
        Alert.alert('', 'Thanks for viewing. Live Streaming is over.', [
          { text: 'OK', onPress: this.props.navigation.goBack },
        ]);
      });
      this.onPressJoin();
    }

    // if (liveStatus === LIVE_STATUS.FINISH) {
    //   SocketManager.instance.emitReplay({
    //     userId,
    //     streamerId,
    //   });
    //   SocketManager.instance.listenReplay((data) => {
    //     const { beginAt, messages } = data;
    //     const start = moment(beginAt);
    //     for (let i = 0; i < messages.length; i += 1) {
    //       ((j, that) => {
    //         const end = moment(messages[j].createdAt);
    //         const duration = end.diff(start);
    //         setTimeout(() => {
    //           that.setState((prevState) => ({
    //             messages: [...prevState.messages, messages[j]],
    //           }));
    //         }, duration);
    //       })(i, this);
    //     }
    //   });
    //   const inputUrl = `${RTMP_SERVER}/live/${streamerId}/replayFor${userId}`;
    //   this.setState({ inputUrl });
    // }
  };

  onPressJoin = () => {
    const { room } = this.state;
    const streamerId = room?.user?.id;

    this.setState({
      inputUrl: `${RTMP_SERVER}/live/${streamerId}`,
      isJoined: true,
    });

    SocketManager.instance.listenSendHeart((data) => {
      const newRoom = data?.room;
      if (newRoom) {
        this.setState((prevState) => ({
          room: newRoom,
          countHeart: prevState.countHeart + 1,
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
      const { message, room: newRoom } = data;
      if (message && message?.sender?.id !== this.props.user?.id) {
        const messages = this.state.messages || [];
        this.setState({ messages: [message].concat(messages) });
      }
      if (newRoom) {
        this.setState({ room: newRoom });
      }
    });

    SocketManager.instance.listenSendGift((data) => {
      const { gift, room: newRoom, senderName, senderId } = data;
      if (senderId !== this.props.user?.id && gift) {
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
      if (newRoom) {
        this.setState({ room: newRoom });
      }
    });
  };

  onLeave = () => {
    if (this.nodePlayerView) {
      this.nodePlayerView.stop();
    }
    this.setState({
      messages: [],
      inputUrl: null,
      isJoined: false,
      room: null,
    });
    this.removeListenersForLeave();
  };

  removeListenersForLeave = () => {
    SocketManager.instance.removeSendMessage();
    SocketManager.instance.removeSendHeart();
    SocketManager.instance.removeSendGift();
  };

  removeListenersForExit = () => {
    const { user } = this.props;
    const { room } = this.state;
    const userId = user?.id;
    const streamerId = room?.user?.id;

    SocketManager.instance.removePrepareLiveStream();
    SocketManager.instance.removeBeginLiveStream();
    SocketManager.instance.removeFinishLiveStream();
    SocketManager.instance.emitLeaveRoom({
      streamerId,
      userId,
    });
    //SocketManager.instance.disconnect();
  };

  componentWillUnmount() {
    this.onLeave();
    this.removeListenersForExit();
    KeepAwake.deactivate();
  }

  onPressGiftAction = () => {
    this.giftBottomSheet?.current?.open();
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

  onPressSendHeart = () => {
    const userId = this.props.user?.id;
    SocketManager.instance.emitSendHeart({
      streamerId: this.state.room?.user?.id,
      userId,
    });
  };

  onPressSendGift = (gift) => {
    const user = this.props.user || {};
    if (user.diamond <= gift.diamond) {
      return;
    }
    const { room } = this.state;
    this.giftBottomSheet?.current?.close();
    SocketManager.instance.emitSendGift({
      streamerId: room?.user?.id,
      userId: user?.id,
      giftId: gift?.id,
    });
    const message = {
      message: `Sent a ${gift.name}`,
      giftIcon: gift.icon,
      sender: {
        username: user?.username,
      },
    };
    const messages = this.state.messages || [];
    this.setState({ messages: [message].concat(messages) });
    this.props.setMyUserAction({
      ...user,
      diamond: (user.diamond || 0) - (gift.diamond || 0),
    });
  };

  onCloseProfileSheet = () => {
    this.profileSheet?.current?.close();
  };

  onDoubleTap = () => {
    const delta = new Date().getTime() - this.state.lastPress;

    if (delta < 300) {
      this.onPressSendHeart();
      this.setState({ lastPress: 0 });
    } else {
      this.setState({
        lastPress: new Date().getTime(),
      });
    }
  };

  onPressSendMessage = (message) => {
    if (!message) {
      return;
    }
    this.messageBottomSheet?.current?.close();

    const { isJoined } = this.state;

    if (!isJoined) {
      return;
    }
    SocketManager.instance.emitSendMessage({
      streamerId: this.state.room?.user?.id,
      userId: this.props.user?.id,
      message,
    });
    const messages = this.state.messages || [];
    this.setState({
      messages: [
        {
          message,
          sender: this.props.user,
          type: 1,
        },
      ].concat(messages),
    });
  };

  renderNodePlayerView = () => {
    const { inputUrl } = this.state;
    const mode = this.state.room?.mode || 0;

    if (!inputUrl) {
      return null;
    }
    return (
      <NodePlayerView
        style={[styles.playerView, mode === 1 && { width: 0, height: 0 }]}
        ref={(vb) => {
          this.nodePlayerView = vb;
        }}
        inputUrl={inputUrl}
        //scaleMode="ScaleAspectFit"
        bufferTime={300}
        maxBufferTime={1000}
        autoplay
      />
    );
  };

  render() {
    const { messages, isJoined, showHeart, countHeart } = this.state;
    const room = this.state.room || {};
    const liveStatus = room?.liveStatus || 0;
    const gifts = this.props.gifts || [];
    const mode = room?.mode || 0;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={this.onDoubleTap}
        >
          {this.renderNodePlayerView()}
          {mode === 1 && (
            <View style={styles.audioLiveContainer}>
              <CachedImage
                source={ic_audio}
                style={{ width: 24, height: 24 }}
              />
            </View>
          )}
          <View style={styles.contentWrapper}>
            <View style={styles.header}>
              <Header
                room={room}
                liveStatus={liveStatus}
                onPressProfileAction={this.onPressProfileAction}
              />
            </View>
            <Index
              onPressJoin={this.onPressJoin}
              onExit={this.onLeave}
              onPressSendHeart={this.onPressSendHeart}
              onPressGiftAction={this.onPressGiftAction}
              onPressSendMessage={this.onPressSendMessage}
              onPressShareAction={this.onPressShareAction}
              onPressProfileAction={this.onPressProfileAction}
              isJoined={isJoined}
              liveStatus={liveStatus}
              mode="viewer"
              messages={messages}
            />
          </View>
        </TouchableOpacity>
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
        <RBSheet
          ref={this.giftBottomSheet}
          openDuration={250}
          customStyles={{
            container: styles.sheetGiftContainer,
            wrapper: styles.sheetWrapper,
            draggableIcon: styles.sheetDragIcon,
          }}
        >
          <Gifts gifts={gifts} onPressSendGift={this.onPressSendGift} />
        </RBSheet>
        {/*<FloatingHearts count={countHeart} />*/}
        {showHeart && <StaticHeart />}
      </SafeAreaView>
    );
  }
}

export default connect(
  (state) => ({
    user: state.me?.user || {},
    gifts: state.liveStream?.gifts || [],
  }),
  { setGifts, setMyUserAction },
)(ViewLive);
