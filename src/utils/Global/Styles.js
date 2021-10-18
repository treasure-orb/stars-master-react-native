import { StyleSheet } from 'react-native';

import Helper from './Util';

const WINDOW_WIDTH = Helper.getWindowWidth();
const BUTTON_WIDTH = WINDOW_WIDTH * 0.88;

const GStyle = {
  //** color */
  primaryColor: '#1BF2DD',
  secondaryColor: '#9CFDFF',
  activeColor: '#1BF2DD',
  inactiveColor: '#9CFDFF',
  fontColor: '#272755',
  linkColor: '#0C4682',
  grayColor: '#9393AA',
  // grayColor: '#a9a9a9',
  grayBackColor: '#F0F0F0',
  lineColor: '#bbbbbb',
  modalBackColor: '#27275599',
  infoColor: '#778CA2',

  blackColor: '#000000',
  opacityBlack: '#00000099',
  snowColor: '#FAFAFA',
  orangeColor: '#E98123',
  // orangeColor: '#FE9870',
  redColor: '#FF0000',
  // redColor: '#bd0008',
  // redColor: '#ff4444',
  transparentColor: '#FFFFFF00',

  buttonWhiteColor: '#FAFAFA',
  backWhiteColor: '#E7F6FB',

  blueColor: '#5B4EFE',
  lightBlueColor: '#64C7D1',

  purpleColor: '#9B30FF',
  // purpleColor: '#C98FD4',
  // purpleColor: '#6733BB',
  opacityPurpleColor: '#6733BBBB',
  greenColor: '#5CB85C',
  // greenColor: '#007225',
  // greenColor: '#119F3B',
  lightPurple: '#EFE7F1',
  yellowColor: '#FF9C1A',
  // yellowColor: '#F5B024',
  whiteColor: 'white',
  purpleOpacityColor: '#C98FD488',
  placeholderColor: '#fff8',
  inputColor: '#333',
  modalBackground: 'rgba(13,13,13,0.52)',

  borderRadius: 9,
  loginBackColor: '#EEEEEE',

  pinkColor: '#FF1493',
  // pinkColor: '#FF69B4',
  purpleColor1: '#242B48',
  purpleColor2: '#3A2E54',
  purpleColor3: '#4D315F',
  purpleColor4: '#63346B',

  loginButtonColor: '#D38AE0',

  googleColor: '#dd4b39',
  fbColor: '#385898',
  // fbColor: '#4267B2',

  menuInactiveColor: '#4D4D4D',

  //** other */
  buttonRadius: 15,
};

const GStyles = StyleSheet.create({
  statusBar: {
    flex: 0,
    backgroundColor: GStyle.snowColor,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },

  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  elementContainer: {
    flex: 1,
    width: '88.1%',
    height: '100%',
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetweenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowCenterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rowEndContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  columnEndContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rowEvenlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  columnEvenlyContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  absoluteContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  centerAlign: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: GStyle.grayColor,
    paddingBottom: 8,
  },
  shadow: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: GStyle.activeColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 0.12,
    elevation: 3,
  },
  defaultShadow: {
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
  },
  bigText: {
    fontFamily: 'GothamPro-Medium',
    color: GStyle.fontColor,
    fontSize: 24,
    lineHeight: 32,
  },
  largeText: {
    fontFamily: 'GothamPro-Medium',
    color: GStyle.fontColor,
    fontSize: 20,
    lineHeight: 32,
  },
  mediumText: {
    fontFamily: 'GothamPro-Medium',
    color: GStyle.blackColor,
    fontSize: 18,
  },
  regularText: {
    fontFamily: 'GothamPro',
    color: GStyle.blackColor,
    fontSize: 16,
  },
  titleText: {
    fontFamily: 'GothamPro-Medium',
    color: GStyle.fontColor,
    fontSize: 24,
    lineHeight: 28,
    marginTop: 20,
  },
  titleDescription: {
    fontFamily: 'GothamPro',
    color: GStyle.fontColor,
    fontSize: 15,
    lineHeight: 24,
  },
  notifyTitle: {
    fontFamily: 'GothamPro-Medium',
    color: GStyle.fontColor,
    fontSize: 17,
    marginTop: 35,
  },
  notifyDescription: {
    fontFamily: 'GothamPro',
    color: GStyle.fontColor,
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 20,
  },
  elementLabel: {
    color: GStyle.grayColor,
    fontFamily: 'GothamPro-Medium',
    fontSize: 13,
  },
  image: {
    width: 56,
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  buttonFill: {
    justifyContent: 'center',
    backgroundColor: GStyle.activeColor,
    borderRadius: GStyle.buttonRadius,
    width: BUTTON_WIDTH,
    height: 50,
  },
  textFill: {
    fontFamily: 'GothamPro-Medium',
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
  },
  miniDot: {
    width: 3,
    height: 3,
    resizeMode: 'contain',
    marginHorizontal: 4,
  },
  liveStreamChatText: {
    fontFamily: 'GothamPro',
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  liveStreamChatSender: {
    fontFamily: 'GothamPro',
    color: GStyle.activeColor,
    fontSize: 12,
    fontWeight: '700',
  },
  textSmall: {
    fontFamily: 'GothamPro',
    fontWeight: '600',
    fontSize: 12,
    color: 'white',
  },
  textExtraSmall: {
    fontFamily: 'GothamPro',
    fontWeight: '400',
    fontSize: 10,
    color: 'white',
  },
  videoActionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 58, 132, 0.71)',
    width: 32,
    height: 32,
    marginTop: 16,
    borderRadius: 32,
  },
  playInfoTextWrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 4,
  },
  playInfoText: {
    fontFamily: 'GothamPro',
    fontWeight: '500',
    fontSize: 12,
    color: 'black',
  },
  actionIcons: {
    width: 16,
    height: 16,
    tintColor: 'white',
  },
  playInfoWrapper: {
    position: 'absolute',
    width: '100%',
    bottom: 64 + Helper.getBottomBarHeight(),
    left: 0,
    paddingHorizontal: 16,
  },
  normalText: {
    fontWeight: '400',
  },
  textMedium: {
    fontWeight: '500',
  },
  semiBoldText: {
    fontWeight: '600',
  },
  boldText: {
    fontWeight: '700',
  },
  upperCaseText: {
    textTransform: 'uppercase',
  },
  stickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  stickerText: {
    fontFamily: 'GothamPro',
    fontWeight: '700',
    fontSize: 10,
    color: 'white',
  },
  backButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    width: 42,
    height: 42,
    left: 16,
    top: Helper.getStatusBarHeight() + 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 120,
    position: 'absolute',
  },
});
export default GStyle;
export { GStyles };
