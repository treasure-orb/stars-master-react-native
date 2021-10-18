import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Video from 'react-native-video';
import { IconButton } from 'react-native-paper';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import Sound from 'react-native-sound';

import GHeaderBar from '../../components/GHeaderBar';
import CustomActions from '../../components/elements/MessageActions';
import CustomView from '../../components/elements/MessageView';

import {
  Constants,
  Global,
  GStyle,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';
import SocketManager from './../../utils/Message/SocketManager';
import get from 'lodash/get';
import WriteMessage from '../../components/products/WriteMessage';
import CachedImage from '../../components/CachedImage';

const ic_send = require('../../assets/images/Icons/ic_send.png');

class MessageChatScreen extends Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentWillUnmount() {
    global.onReceiveMessageList = null;
  }

  init = () => {
    const { route } = this.props;
    const opponentUser = get(route, 'params.opponentUser');
    this.state = {
      isFetching: false,
      totalCount: 0,
      opponentUser,
      chatTitle: '',
      messages: [],
      typingText: null,
    };
    global.onReceiveMessageList = this.onReceiveMessageList;
    this.onRefresh('init');
  };

  onRefresh = (type) => {
    let { isFetching, totalCount, messages, opponentUser } = this.state;

    if (isFetching) {
      return;
    }

    const params = {
      otherId: opponentUser?.id,
      userId: global.me?.id,
    };

    if (type === 'more') {
      if (messages.length < totalCount) {
        params.lastMessageCreatedAt =
          messages[messages.length - 1]?.createdAt || new Date();
      } else {
        return;
      }
      this.setState({ isFetching: true });
    }

    RestAPI.get_message_list(params, (json, err) => {
      this.setState({ isFetching: false });

      if (json.status === 200) {
        this.onFetchMessageList(json?.data || {});
      }
    });
  };

  onSocketError = () => {
    this.setState({ isFetching: false });

    Helper.alertNetworkError();
  };

  onFetchMessageList = (response) => {
    this.setState({ isFetching: false });

    this.setState({ totalCount: response?.totalCount || 0 });
    this.onLoadMore(response?.messages);
  };

  onReceiveMessageList = (response) => {
    const messages = response.messages || [];

    this.onReceive(messages);
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  onSend = (message) => {
    if (message) {
      SocketManager.instance.emitSendMessage({
        senderId: global.me?.id,
        receiverId: this.state?.opponentUser?.id,
        messageType: Constants.MESSAGE_TYPE_TEXT,
        roomType: 0,
        message: message,
        createdAt: new Date(),
      });

      const newMessages = [
        {
          _id: Global.makeId(10),
          text: message,
          createdAt: new Date(),
          user: {
            _id: global.me?.id,
            name:
              global.me?.userType === 0
                ? global.me?.displayName
                : global.me?.username,
            avatar: global.me?.photo,
          },
        },
      ];
      this.setState((oldState) => {
        return {
          messages: GiftedChat.append(oldState.messages, newMessages),
        };
      });
    }
  };

  onPlaySound = (value) => {
    const track = new Sound(value, null, (e) => {
      if (e) {
        console.log('error loading track:', e);
      } else {
        track.play();
      }
    });
  };

  onReceive = (message_list = []) => {
    let messages = [];
    message_list.forEach((item) => {
      const newItem = {
        _id: item.id,
        text: item.message,
        createdAt: new Date(),
        user: {
          _id: item.sender?.id,
          name:
            item?.sender?.userType === 0
              ? item.sender?.displayName
              : item.sender?.username,
          avatar: item.sender?.photo,
        },
      };
      messages.push(newItem);
    });

    this.setState((oldState) => {
      return {
        messages: GiftedChat.append(oldState.messages, messages),
      };
    });
  };

  onLoadMore = (array = []) => {
    let messages = [];
    array.forEach((item) => {
      if (item.message) {
        const newItem = {
          _id: item.id,
          text: item.message,
          createdAt: new Date(item.createdAt),
          user: {
            _id: item.sender?.id,
            name:
              item?.sender?.userType === 0
                ? item.sender?.displayName
                : item.sender?.username,
            avatar: item.sender?.photo,
          },
        };
        messages.push(newItem);
      }
    });

    this.setState((oldState) => {
      return {
        messages: GiftedChat.prepend(oldState.messages, messages),
      };
    });
  };

  scrollToBottomComponent = () => {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton
          icon="chevron-double-down"
          size={36}
          color={GStyle.activeColor}
        />
      </View>
    );
  };

  render() {
    return (
      <>
        <SafeAreaView style={GStyles.statusBar} />
        <SafeAreaView style={{ ...GStyles.container }}>
          {this._renderHeader()}
          {this._renderNotification()}
          {this._renderChat()}
        </SafeAreaView>
      </>
    );
  }

  _renderHeader = () => {
    const { opponentUser } = this.state;
    return (
      <GHeaderBar
        headerTitle={
          opponentUser?.userType === 0
            ? opponentUser?.displayName
            : opponentUser?.username
        }
        leftType="back"
        onPressLeftButton={this.onBack}
      />
    );
  };

  _renderNotification = () => {
    const { chatTitle } = this.state;

    return (
      <View style={{ width: '88.1%' }}>
        <Text style={{ ...GStyles.regularText, fontSize: 13, marginBottom: 4 }}>
          {chatTitle}
        </Text>
      </View>
    );
  };

  _renderInput = () => {
    return <WriteMessage onPressSend={this.onSend} />;
  };

  _renderChat = () => {
    const { messages, isFetching, totalCount } = this.state;

    let isLoadEarlier = messages.length > 0;
    if (isLoadEarlier) {
      isLoadEarlier = messages.length < totalCount;
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '95%',
        }}
      >
        <GiftedChat
          messages={messages}
          renderInputToolbar={this._renderInput}
          loadEarlier={isLoadEarlier}
          onLoadEarlier={() => {
            this.onRefresh('more');
          }}
          isLoadingEarlier={isFetching}
          user={{
            _id: global.me?.id,
            name:
              global.me?.userType === 0
                ? global.me?.displayName
                : global.me?.username,
          }}
          renderBubble={this._renderBubble}
          placeholder="Type your message here..."
          showUserAvatar
          alwaysShowSend
          renderSend={this._renderSend}
          scrollToBottom
          scrollToBottomComponent={this.scrollToBottomComponent}
          renderCustomView={this._renderCustomView}
          // renderActions={this._renderCustomActions}
          renderMessageVideo={this._renderMessageVideo}
          renderMessageAudio={this._renderMessageAudio}
          renderFooter={this._renderFooter}
        />
      </SafeAreaView>
    );
  };

  _renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  _renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: GStyle.grayBackColor,
          },
          right: {
            backgroundColor: GStyle.blueColor,
          },
        }}
      />
    );
  };

  _renderSend = (props) => {
    return (
      <Send {...props}>
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 14,
          }}
        >
          <CachedImage
            source={ic_send}
            style={{ ...GStyles.image, width: 24 }}
            resizeMode="contain"
          />
        </View>
      </Send>
    );
  };

  _renderCustomView(props) {
    return <CustomView {...props} />;
  }

  _renderMessageVideo = (props) => {
    const { currentMessage } = props;
    return (
      <View
        style={{
          width: 150,
          height: 100,
          borderRadius: 13,
          overflow: 'hidden',
          margin: 3,
          borderWidth: 1,
          borderColor: 'red',
        }}
      >
        <Video
          source={{ uri: currentMessage.video, cache: true }} // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref;
          }} // Store reference
          resizeMode="cover"
          onBuffer={this.onBuffer} // Callback when remote video is buffering
          onError={this.videoError} // Callback when video cannot be loaded
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        />
      </View>
    );
  };

  _renderMessageAudio = (props) => {
    const { currentMessage } = props;
    return (
      <View
        style={{
          width: 150,
          height: 50,
          borderRadius: 13,
          margin: 3,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'red',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.onPlaySound(currentMessage.audio);
          }}
        >
          <Text>Play</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderFooter = (props) => {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      );
    }
    return null;
  };
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  bottomComponentContainer: {},
});

export default MessageChatScreen;
