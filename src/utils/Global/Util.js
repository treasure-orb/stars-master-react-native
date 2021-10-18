import { Alert, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Moment from 'moment';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import publicIP from 'react-native-public-ip';

import Constants from './Constants';

const Helper = {
  //** window */
  getWindowWidth: function () {
    return Dimensions.get('window').width;
  },

  getWindowHeight: function () {
    return Dimensions.get('window').height;
  },

  getContentWidth: function () {
    return Dimensions.get('window').width * 0.88;
  },

  getStatusBarHeight: function () {
    return StaticSafeAreaInsets.safeAreaInsetsTop;
  },

  getBottomBarHeight: function () {
    return Platform.OS === 'ios'
      ? StaticSafeAreaInsets.safeAreaInsetsBottom
      : 0;
  },

  setDarkStatusBar: function () {
    // if (Platform.OS === 'android') {
    //   StatusBar.setBackgroundColor('black');
    // }
    // StatusBar.setBarStyle('light-content');
    // changeNavigationBarColor('black', false);
  },

  setLightStatusBar: function () {
    // if (Platform.OS === 'android') {
    //   StatusBar.setBackgroundColor('white');
    // }
    // StatusBar.setBarStyle('dark-content');
    // changeNavigationBarColor('white', true);
  },

  alertNetworkError: function (message = 'Network error.') {
    Alert.alert('Error', message);
  },

  alertServerDataError: function () {
    Alert.alert(Constants.ERROR_TITLE, 'Failed to get data from server');
  },

  //** string */
  getShortString: (value, len = 30) => {
    try {
      if (value.length > len) {
        let res = value.substr(0, len) + ' ...';
        return res;
      }
      return value;
    } catch (ex) {
      return null;
    }
  },

  isEmptyString: (str) => {
    const newStr = Helper.removeWhiteSpace(str);
    return newStr == '';
  },

  removeWhiteSpace: (str) => {
    if (str) {
      const newStr = str.replace(/\s/g, '');
      // const newStr = str.replace(' ', '');
      // const newStr = str.replace(/ /g, '');
      return newStr;
    } else {
      return '';
    }
  },

  removeFirstWhiteSpace: (str) => {
    if (str) {
      const newStr = str.replace(/\s+/, '');
      return newStr;
    } else {
      return '';
    }
  },

  capitalizeString: function (str) {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    return '';
  },

  //** type conversion */
  getFixedFloatString: (val) => {
    const number = parseFloat(val);
    if (!number) {
      return null;
    }
    return number.toFixed(2);
  },

  //** local save */
  setLocalValue: async function (key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  },

  getLocalValue: async function (key) {
    let value = null;

    try {
      value = await AsyncStorage.getItem(key);
    } catch (e) {
      // error reading value
    }

    return value;
  },

  removeLocalValue: async function (key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // remove error
    }
  },

  //** date */
  getTimeStamp: function () {
    return new Date().valueOf();
  },

  getDateString: (date) => {
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();

    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;

    return y + '-' + m + '-' + d;
  },

  getTimeString: (date, isShowSecond = false) => {
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    if (isShowSecond) {
      return h + ':' + m + s;
    } else {
      return h + ':' + m + ':00';
    }
  },

  getDateTimeString: (date, isShowSecond = false) => {
    return (
      Constants.getDateString(date) +
      ' ' +
      Constants.getTimeString(date, isSHOWSecond)
    );
  },

  getCurMonthString: function () {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const d = new Date();
    return monthNames[d.getMonth()];
  },

  getLastMonthList: function () {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const d = new Date();
    const lastMonthList = [
      ...monthNames.slice(d.getMonth()),
      ...monthNames.slice(0, d.getMonth()),
    ].reverse();

    return lastMonthList;
  },

  getDateString4Input: function (inputDateString) {
    let date = Moment(inputDateString, 'MMM DD, YYYY').toDate();
    return Moment(date).format('YYYY-MM-DD');
  },

  getDateString4Server: function (serverDateString) {
    if (!serverDateString) {
      return '';
    }

    let serverDate = Moment(serverDateString);
    return serverDate.format('MMM DD, YYYY');
  },

  getPastTimeString: function (serverDateString) {
    if (!serverDateString) {
      return '';
    }

    const nowDate = Moment.utc();
    // let serverDate = Moment.utc(serverDateString).subtract({hours: 1});
    let serverDate = Moment.utc(serverDateString);
    return Moment.duration(nowDate.diff(serverDate)).humanize();
  },

  getYear4DateString: function (monthYearString) {
    const stringArray = monthYearString.split('/');
    if (stringArray.length === 2) {
      return stringArray[1];
    }
    return '';
  },

  getMonth4DateString: function (monthYearString) {
    const stringArray = monthYearString.split('/');
    if (stringArray.length === 2) {
      return stringArray[0];
    }
    return '';
  },

  //** check, validate */
  validateEmail: function (email) {
    // const rex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const rex = /\A(?=[a-z0-9@.!#$%&'*+/=?^_`{|}~-]{6,254}\z)(?=[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@)[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:(?=[a-z0-9-]{1,63}\.)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?=[a-z0-9-]{1,63}\z)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\z/
    const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexp.test(email);
  },

  validatePhoneNumber: function (phoneNumber) {
    const regexp = /^[\+]?[0-9]{0,3}[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3,6}[-\s\.]?[0-9]{3,6}$/;
    return regexp.test(phoneNumber);
  },

  //** image */
  getMembershipImage: function (membershipPlan) {
    const ic_membership_free = require('../../assets/images/Icons/ic_membership_free.png');
    const ic_membership_basic = require('../../assets/images/Icons/ic_membership_basic.png');
    const ic_membership_professional = require('../../assets/images/Icons/ic_membership_professional.png');
    const ic_membership_business = require('../../assets/images/Icons/ic_membership_business.png');
    const ic_membership_executive = require('../../assets/images/Icons/ic_membership_executive.png');

    let membershipImage = ic_membership_free;

    switch (membershipPlan) {
      case 'Basic':
        membershipImage = ic_membership_free;
        break;
      case 'Basic+':
        membershipImage = ic_membership_basic;
        break;
      case 'Professional':
        membershipImage = ic_membership_professional;
        break;
      case 'Business':
        membershipImage = ic_membership_business;
        break;
      case 'Executive':
        membershipImage = ic_membership_executive;
        break;
      default:
        membershipImage = ic_membership_free;
        break;
    }

    return membershipImage;
  },

  //** utility */
  callFunc: function (func) {
    if (func) {
      func();
    }
  },

  //** file, directory */
  getFile4Path: function (path) {
    return path.substring(path.lastIndexOf('/') + 1, path.length);
  },

  getFileName4Uri: function (uri) {
    let fileName = '';

    if (uri) {
      let uriParts = uri.split('/');
      fileName = uriParts[uriParts.length - 1];
    }

    return fileName;
  },

  getFileExt4Uri: function (uri) {
    let fileExt = '';

    if (uri) {
      let uriParts = uri.split('.');
      fileExt = uriParts[uriParts.length - 1];
    }

    return fileExt;
  },

  getDraftDirectoryPath: function () {
    const draftPath = RNFS.DocumentDirectoryPath + '/draft/';

    RNFS.mkdir(draftPath);

    return draftPath;
  },

  setDeviceId: async () => {
    if (global._deviceId && global._devId) {
      return;
    }

    const deviceId = await DeviceInfo.getUniqueId();

    if (deviceId.length < 8) {
      const ip = await publicIP();
      if (ip.length < 8) {
        global.error(Constants.ERROR_TITLE, 'Network error');
        global._deviceId = '';
        global._devId = 'xxxxxxxx';
      } else {
        const ipId = ip.replace(/\./g, '0');
        global._deviceId = ipId;
        global._devId = ipId.substr(ip.length - 8);
      }
    } else {
      global._deviceId = deviceId;
      global._devId = deviceId.substr(deviceId.length - 8);
    }
  },
  getLvLGuest: function (diamondSpent) {
    const levels = Constants.diamondLvLMap.filter(
      (item) => item.diamond <= diamondSpent,
    );
    const level = Math.max.apply(
      Math,
      levels.map(function (o) {
        return o.lvl;
      }),
    );

    return level || 1;
  },
  getLvlLiveStream: (elixir) => {
    const levels = Constants.elixirLvLMap.filter(
      (item) => item.elixir <= elixir,
    );
    const level = Math.max.apply(
      Math,
      levels.map(function (o) {
        return o.lvl;
      }),
    );

    return level || 0;
  },
  getElixirFromLvl: (lvl) => {
    const lvlItem = Constants.elixirLvLMap.find((level) => level.lvl === lvl);
    const maxElixir = Math.max.apply(
      Math,
      Constants.elixirLvLMap.map((o) => o.elixir),
    );

    return lvlItem && lvl >= 0 ? lvlItem.elixir : maxElixir;
  },
  getProgress: (elixir, lvl) => {
    const targetElixir = Helper.getElixirFromLvl(lvl + 1);
    const lvlElixir = Helper.getElixirFromLvl(lvl);
    const target = targetElixir - lvlElixir;
    const current = elixir - lvlElixir;
    return target <= 0 ? '100%' : `${Math.min(100, (current * 100) / target)}%`;
  },
  normalizeImageSource: (imageSource) => {
    let source = imageSource || {};
    let uri = source?.uri || '';
    source.uri = uri === 'null' || uri === 'undefined' ? '' : uri;
    return source;
  },
};

export default Helper;
