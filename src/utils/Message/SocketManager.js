import io from 'socket.io-client';
import { Constants, Logger } from '../Global';
import Helper from '../Global/Util';

class SocketManager {
  socket = null;

  constructor() {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }
    SocketManager.instance = this;
    this.socket = io(Constants.CHAT_SOCKET_URL);
    this.setupListenDefaultEvents();
    return this;
  }

  connect = () => {
    if (this.socket?.disconnected) {
      this.socket?.connect();
    }
  };

  setupListenDefaultEvents() {
    this.socket?.on('connect', () => {
      Logger.instance.log('connect');
    });
    this.socket?.on('disconnect', () => {
      Logger.instance.log('disconnect');
    });
    this.socket?.on('connect_error', (error) => {
      console.log('--- univ_dev --- socket_connect_error:', error);
    });

    this.socket?.on('connect_timeout', (timeout) => {
      console.log('--- univ_dev --- socket_connect_timeout:', timeout);
    });

    this.socket?.on('error', (error) => {
      console.log('--- univ_dev --- socket_error:', error);
    });

    this.socket?.on('disconnect', (reason) => {
      console.log('--- univ_dev --- socket_disconnect_reason:', reason);
    });

    this.socket?.on('reconnect', (attemptNumber) => {
      console.log(
        '--- univ_dev --- socket_reconnect_attemptNumber:',
        attemptNumber,
      );
    });

    this.socket?.on('reconnect_attempt', (attemptNumber) => {
      console.log(
        '--- univ_dev --- socket_reconnect_attempt_attemptNumber:',
        attemptNumber,
      );
    });

    this.socket?.on('reconnecting', (attemptNumber) => {
      console.log(
        '--- univ_dev --- socket_reconnecting_attemptNumber:',
        attemptNumber,
      );
    });

    this.socket?.on('reconnect_error', (error) => {
      console.log('--- univ_dev --- socket_reconnect_error:', error);
    });

    this.socket?.on('reconnect_failed', () => {
      console.log('--- univ_dev --- socket_reconnect_failed');
    });
    this.listenError();
  }

  //
  // ──────────────────────────────────────────────────────────────── I ──────────
  //   :::::: L I S T E N   E V E N T : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────
  //

  disconnect = () => {
    this.socket?.disconnect();
  };

  emitJoinRoom({ roomId, userId }) {
    this.socket?.emit(Constants.SOCKET_JOIN_STREAM, { roomId, userId });
  }

  emitLeaveRoom({ roomId, userId }) {
    this.socket?.emit(Constants.SOCKET_USER_LEFT, { roomId, userId });
  }

  listenReceiveMessages() {
    this.socket?.on(Constants.SOCKET_NEW_MESSAGE, (data) => {
      Logger.instance.log(`${Constants.SOCKET_NEW_MESSAGE} :`);
      return global.onReceiveMessageList
        ? global.onReceiveMessageList(data)
        : Helper.callFunc(global.onSetUnreadCount);
    });
  }

  removeReceiveMessages = () => {
    this.socket?.removeAllListeners(Constants.SOCKET_NEW_MESSAGE);
  };

  emitSendMessage({
    roomId,
    senderId,
    receiverId,
    message,
    messageType = 1,
    createdAt,
  }) {
    this.socket?.emit(Constants.SOCKET_SEND_MESSAGE, {
      roomId,
      senderId,
      receiverId,
      message,
      messageType,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    });
  }

  emitFetchMessages(params) {
    this.socket?.emit(Constants.SOCKET_FETCH_MESSAGE_LIST, params);
  }

  listenError(callback = () => null) {
    this.socket?.on(Constants.SOCKET_ERROR, (errorCode) => {
      console.log(
        '--- univ_dev --- SOCKET_ERROR:',
        Constants.ERROR_CODES[errorCode.code],
      );
      alert('Socket Error ' + Constants.ERROR_CODES[errorCode.code]);
      callback ? callback(errorCode) : Helper.callFunc(global.onSocketError);
    });
  }

  removeError = () => {
    this.socket?.removeAllListeners(Constants.SOCKET_ERROR);
  };
}

const instance = new SocketManager();
Object.freeze(instance);

export default SocketManager;
