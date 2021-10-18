import { Dimensions } from 'react-native';

const Constants = {
  //** key */
  PAY_STACK_PUB_KEY: 'pk_test_dbd30ba86e6fe5dd0cf839208fff9be36b36e260',
  MAP_API_KEY: 'AIzaSyDUNFhK6gsWN2V-A5E69R5e7vXQhLExrFw',
  GOOGLE_API_KEY: 'AIzaSyBYWssWxa3wRKMeazm2maDJnGNF0RRf0o8',

  //** local save key */
  KEY_USERNAME: 'KEY_USERNAME',
  KEY_PASSWORD: 'KEY_PASSWORD',
  KEY_USER: 'KEY_USER',
  KEY_VIDEO_DRAFT: 'KEY_VIDEO_DRAFT',

  //** url */
  // crn_dev
  HOST_URL: 'http://107.180.73.164:3000',
  //HOST_URL: 'http://192.168.1.110:3000',
  //CHAT_SOCKET_URL: 'http://192.168.1.110:3000/ChatStream',
  CHAT_SOCKET_URL: 'http://107.180.73.164:3000/ChatStream',
  LIVE_SOCKET_URL: 'http://107.180.73.164:3000/LiveStream',
  //LIVE_SOCKET_URL: 'http://192.168.1.110:3000/LiveStream',
  RTMP_SERVER: 'rtmp://107.180.73.164',
  //RTMP_SERVER: 'rtmp://192.168.1.110',
  GOOGLE_PLAY_URL:
    'https://play.google.com/store/apps/details?id=com.stars.android',
  APPSTORE_URL: 'https://apps.apple.com/us/app/stars/id1543058540',
  JWT_SECRET:
    '5wQsqz9FnhY8tKGSRTaVOBGsZLzUH28DDJtgYoXx8b9X7DhO_KYx1yu_9RqetpDMnOwUvMniIsZpJNbZgjYBMF0rcg1zUWFgWtVcp9X7B4FLvzoGNWiJkbPnI_4u7jkebpGsBtY-bVbS_fapv0gLt-zgMl9rwFOVTv0CZRZzgg8',

  //** socket */
  MESSAGE_TYPE_TEXT: 1,
  MESSAGE_TYPE_FILE: 2,
  MESSAGE_TYPE_LOCATION: 3,
  MESSAGE_TYPE_CONTACT: 4,
  MESSAGE_TYPE_STICKER: 5,

  MESSAGE_TYPE_STREAM: 0,
  MESSAGE_TYPE_COMMENT: 1,

  MESSAGE_NEW_USER: 1000,
  MESSAGE_USER_LEAVE: 1001,

  SOCKET_ERROR: 'socketerror',
  SOCKET_LOGIN: 'login',
  SOCKET_LOGOUT: 'logout',
  SOCKET_NEW_USER: 'newUser',
  SOCKET_FETCH_MESSAGE_LIST: 'FetchMessageList',
  SOCKET_NEW_MESSAGE: 'newMessage',
  SOCKET_SEND_MESSAGE: 'sendMessage',
  SOCKET_SEND_TYPING: 'sendTyping',
  SOCKET_TYPING: 'typing',
  SOCKET_OPEN_MESSAGE: 'openMessage',
  SOCKET_UPDATE_MESSAGE: 'messageUpdated',
  SOCKET_DELETE_MESSAGE: 'deleteMessage',
  SOCKET_CHANGE_MESSAGE: 'MessageChanges',
  SOCKET_DELETE_DURATION_MESSAGE: 'deleteDurationMessage',
  SOCKET_DISCONNECT: 'disconnect',
  SOCKET_USER_LEFT: 'userLeft',
  SOCKET_JOIN_STREAM: 'joinStream',
  SOCKET_STREAM: 'stream',
  SOCKET_STREAM_COMMENT: 'streamComment',

  ERROR_CODES: {
    1000001: 'Name is not provided.',
    1000002: 'Room ID is not provided.',
    1000003: 'User ID is not provided.',
    1000004: 'Room ID is not provided.',
    1000005: 'Roomo ID is not provided.',
    1000006: 'Last Meesage ID is not provided.',
    1000007: 'File not provided.',
    1000008: 'Room ID not provided.',
    1000009: 'User ID is not provided.',
    1000010: 'Type is not provided.',
    1000011: 'File is not provided.',
    1000012: 'Unknown Error',
    1000013: 'User ID is not provided.',
    1000014: 'Message ID is not provided.',
    1000015: 'Room ID is not provided.',
    1000016: 'User ID is not provided.',
    1000017: 'Type is not provided.',
    1000018: 'Message is not provided.',
    1000019: 'Location is not provided.',
    1000020: 'Failed to send message.',
    1000027: 'Invalid token',
    2001: 'Invalid parameter',
  },

  //** constant */
  WINDOW_WIDTH: Dimensions.get('window').width,
  WINDOW_HEIGHT: Dimensions.get('window').height,
  CELL_WIDTH: (Dimensions.get('window').width - 50) / 3,

  SUCCESS_TITLE: 'Success!',
  WARNING_TITLE: 'Warning!',
  ERROR_TITLE: 'Oops!',
  COUNT_PER_PAGE: 20,
  BOTTOM_TAB_HEIGHT: 50,
  KEY_UNREAD_MESSAGE_COUNT: 'KEY_UNREAD_MESSAGE_COUNT',
  DELAY_FOR_RENDER: 30,

  STICKER_NAME_LIST: [
    '',
    'Out of stock',
    'Special offer',
    'Free delivery',
    'Was ৳500',
    'Was ৳700',
    'Was ৳1000',
    'Was ৳1500',
    'Was ৳2000',
    'Was ৳2500',
    'Was ৳3000',
    'Was ৳4000',
    'Was ৳5000',
    'Was ৳8000',
    'Was ৳10000',
  ],
  Months3: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Org',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  Weeks3: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  elixirLvLMap: [
    {
      lvl: 0,
      elixir: 0,
    },
    {
      lvl: 1,
      elixir: 24,
    },
    {
      lvl: 2,
      elixir: 150,
    },
    {
      lvl: 3,
      elixir: 500,
    },
    {
      lvl: 4,
      elixir: 1000,
    },
    {
      lvl: 5,
      elixir: 2000,
    },
    {
      lvl: 6,
      elixir: 3000,
    },
    {
      lvl: 7,
      elixir: 5000,
    },
    {
      lvl: 8,
      elixir: 10000,
    },
    {
      lvl: 9,
      elixir: 15000,
    },
    {
      lvl: 10,
      elixir: 25000,
    },
    {
      lvl: 11,
      elixir: 50000,
    },
    {
      lvl: 12,
      elixir: 100000,
    },
    {
      lvl: 13,
      elixir: 150000,
    },
    {
      lvl: 14,
      elixir: 200000,
    },
    {
      lvl: 15,
      elixir: 250000,
    },
  ],
  diamondLvLMap: [
    {
      lvl: 1,
      diamond: 0,
    },
    {
      lvl: 2,
      diamond: 5,
    },
    {
      lvl: 3,
      diamond: 50,
    },
    {
      lvl: 4,
      diamond: 100,
    },
    {
      lvl: 5,
      diamond: 200,
    },
    {
      lvl: 6,
      diamond: 500,
    },
    {
      lvl: 7,
      diamond: 1000,
    },
    {
      lvl: 8,
      diamond: 2000,
    },
    {
      lvl: 9,
      diamond: 3000,
    },
    {
      lvl: 10,
      diamond: 5000,
    },
    {
      lvl: 11,
      diamond: 6000,
    },
    {
      lvl: 12,
      diamond: 7000,
    },
    {
      lvl: 13,
      diamond: 8000,
    },
    {
      lvl: 14,
      diamond: 9000,
    },
    {
      lvl: 15,
      diamond: 12000,
    },
  ],
};

export default Constants;
