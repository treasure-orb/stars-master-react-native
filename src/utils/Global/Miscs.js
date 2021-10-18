import ChatStreamSocketManager from '../Message/SocketManager';
import { Constants, Helper, Global } from './index';

const initUser = (user, username, password, setMyUserAction) => {
  ChatStreamSocketManager.instance.emitLeaveRoom({
    roomId: global.me?.id,
    userId: global.me?.id,
  });
  global.me = user;
  ChatStreamSocketManager.instance.emitJoinRoom({
    roomId: global.me?.id,
    userId: global.me?.id,
  });

  Helper.setLocalValue(Constants.KEY_USERNAME, username);
  Helper.setLocalValue(Constants.KEY_PASSWORD, password);
  Helper.setLocalValue(Constants.KEY_USER, JSON.stringify(global.me));
  Helper.callFunc(global.onSetUnreadCount);
  Global.registerPushToken();
};

export default { initUser };
