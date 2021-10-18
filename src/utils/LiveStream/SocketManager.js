import io from 'socket.io-client';
import { Constants, Logger } from '../Global';

const EVENT_JOIN_ROOM = 'join-room';
const EVENT_LEAVE_ROOM = 'leave-room';
const EVENT_LIST_LIVE_STREAM = 'list-live-stream';
const EVENT_BEGIN_LIVE_STREAM = 'begin-live-stream';
const EVENT_ERROR_LIVE_STREAM = 'error-live-stream';
const EVENT_FINISH_LIVE_STREAM = 'finish-live-stream';
const EVENT_SEND_HEART = 'send-heart';
const EVENT_SEND_MESSAGE = 'send-message';
const EVENT_SEND_GIFT = 'send-gift';
const EVENT_PREPARE_LIVE_STREAM = 'prepare-live-stream';
const EVENT_SEND_REPLAY = 'replay';

class SocketManager {
  socket = null;

  constructor() {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }
    SocketManager.instance = this;
    this.socket = io(Constants.LIVE_SOCKET_URL);
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
  }

  //
  // ──────────────────────────────────────────────────────────────── I ──────────
  //   :::::: L I S T E N   E V E N T : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────
  //

  disconnect = () => {
    this.socket.disconnect();
  };

  listenPrepareLiveStream(callback = () => null) {
    this.socket?.on(EVENT_PREPARE_LIVE_STREAM, (data) => {
      Logger.instance.log(`${EVENT_PREPARE_LIVE_STREAM} :`);
      return callback(data);
    });
  }

  removePrepareLiveStream = () => {
    this.socket?.removeAllListeners(EVENT_PREPARE_LIVE_STREAM);
  };

  listenErrorLiveStream(callback = () => null) {
    this.socket?.on(EVENT_ERROR_LIVE_STREAM, (data) => {
      Logger.instance.log(`${EVENT_ERROR_LIVE_STREAM} :`, data);
      return callback(data);
    });
  }

  removeErrorLiveStream = () => {
    this.socket?.removeAllListeners(EVENT_ERROR_LIVE_STREAM);
  };

  listenBeginLiveStream(callback = () => null) {
    this.socket?.on(EVENT_BEGIN_LIVE_STREAM, (data) => {
      Logger.instance.log(`${EVENT_BEGIN_LIVE_STREAM} :`, data);
      return callback(data);
    });
  }

  removeBeginLiveStream = () => {
    this.socket?.removeAllListeners(EVENT_BEGIN_LIVE_STREAM);
  };

  listenFinishLiveStream(callback = () => null) {
    this.socket?.on(EVENT_FINISH_LIVE_STREAM, (data) => {
      Logger.instance.log(`${EVENT_FINISH_LIVE_STREAM} :`, data);
      return callback(data);
    });
  }

  removeFinishLiveStream = () => {
    this.socket?.removeAllListeners(EVENT_FINISH_LIVE_STREAM);
  };

  listenListLiveStream(callback = () => null) {
    this.socket?.on(EVENT_LIST_LIVE_STREAM, (data) => {
      Logger.instance.log(`${EVENT_LIST_LIVE_STREAM} :`, data);
      return callback(data);
    });
  }

  removeListLiveStream = () => {
    this.socket?.removeAllListeners(EVENT_LIST_LIVE_STREAM);
  };

  listenSendHeart(callback = () => null) {
    this.socket?.on(EVENT_SEND_HEART, (data) => {
      Logger.instance.log(`${EVENT_SEND_HEART} :`);
      return callback(data);
    });
  }

  removeSendHeart = () => {
    this.socket?.removeAllListeners(EVENT_SEND_HEART);
  };

  listenSendMessage(callback = () => null) {
    this.socket?.on(EVENT_SEND_MESSAGE, (data) => {
      Logger.instance.log(`${EVENT_SEND_MESSAGE} :`);
      return callback(data);
    });
  }

  removeSendMessage = () => {
    this.socket?.removeAllListeners(EVENT_SEND_MESSAGE);
  };

  listenSendGift(callback = () => null) {
    this.socket?.on(EVENT_SEND_GIFT, (data) => {
      Logger.instance.log(`${EVENT_SEND_GIFT} :`);
      return callback(data);
    });
  }

  removeSendGift = () => {
    this.socket?.removeAllListeners(EVENT_SEND_GIFT);
  };

  listenReplay(callback = () => null) {
    this.socket?.on(EVENT_SEND_REPLAY, (data) => {
      Logger.instance.log(`${EVENT_SEND_REPLAY} :`);
      return callback(data);
    });
  }

  removeReplay = () => {
    this.socket?.removeAllListeners(EVENT_SEND_MESSAGE);
  };

  //
  // ──────────────────────────────────────────────────────────── I ──────────
  //   :::::: E M I T   E V E N T : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────
  //

  emitPrepareLiveStream({ streamerId, roomName }) {
    this.socket?.emit(EVENT_PREPARE_LIVE_STREAM, { streamerId, roomName });
  }

  emitJoinRoom({ streamerId, userId }) {
    this.socket?.emit(EVENT_JOIN_ROOM, { streamerId, userId });
  }

  emitLeaveRoom({ streamerId, userId }) {
    this.socket?.emit(EVENT_LEAVE_ROOM, { streamerId, userId });
  }

  emitBeginLiveStream({ streamerId, roomName, topic, thumbnail, mode }) {
    this.socket?.emit(EVENT_BEGIN_LIVE_STREAM, {
      streamerId,
      roomName,
      topic,
      thumbnail,
      mode,
    });
  }

  emitFinishLiveStream({ streamerId }) {
    this.socket?.emit(EVENT_FINISH_LIVE_STREAM, { streamerId });
  }

  emitListLiveStream() {
    this.socket?.emit(EVENT_LIST_LIVE_STREAM);
  }

  emitSendHeart({ streamerId, userId }) {
    this.socket?.emit(EVENT_SEND_HEART, { streamerId, userId });
  }

  emitSendMessage({ streamerId, userId, message }) {
    this.socket?.emit(EVENT_SEND_MESSAGE, { streamerId, userId, message });
  }

  emitSendGift({ streamerId, userId, giftId }) {
    this.socket?.emit(EVENT_SEND_GIFT, { streamerId, userId, giftId });
  }

  emitReplay({ streamerId, userId }) {
    this.socket?.emit(EVENT_SEND_REPLAY, { streamerId, userId });
  }
}

const instance = new SocketManager();
Object.freeze(instance);

export default SocketManager;
