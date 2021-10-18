import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { Helper, RestAPI } from '../utils/Global';
import TopUsersScreen from '../screens/tab_top/TopUsersScreen';
import HomeMainScreen from '../screens/tab_home/HomeMainScreen';
import BrowseRooms from '../screens/tab_liveStream/BrowseRooms';
import ProfileMainScreen from '../screens/tab_profile/ProfileMainScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { connect } from 'react-redux';
import { setUnreadCount } from '../redux/message/actions';
import avatars from '../assets/avatars';
import PlayMainScreen from '../screens/tab_play/PlayMainScreen';
import CachedImage from '../components/CachedImage';

const ic_tab_play = require('../assets/images/Icons/ic_tab_play.png');
const ic_tab_play_focused = require('../assets/images/Icons/ic_tab_play_focused.png');
const ic_tab_home = require('../assets/images/Icons/ic_tab_home.png');
const ic_tab_home_focused = require('../assets/images/Icons/ic_tab_home_focused.png');
const ic_tab_top = require('../assets/images/Icons/ic_tab_top.png');
const ic_tab_top_focused = require('../assets/images/Icons/ic_tab_top_focused.png');
const ic_tab_liveStream = require('../assets/images/Icons/ic_tab_liveStream.png');
const ic_tab_liveStream_focused = require('../assets/images/Icons/ic_tab_liveStream_focused.png');

const Tab = createBottomTabNavigator();

let BOTTOM_TAB_HEIGHT = 60 + Helper.getBottomBarHeight();

const MainTabNavigator = (props) => {
  const unreadCount = props.unreadCount || 0;
  useEffect(() => {
    init();
  }, []);

  const init = () => {
    global.onSetUnreadCount = onSetUnreadCount;
  };

  const onSetUnreadCount = () => {
    let params = {
      user_id: global.me?.id,
    };
    RestAPI.get_unread_count(params, (json, err) => {
      if (json.status === 200) {
        props.setUnreadCount(json.data?.unreadCount || 0);
      }
    });
  };

  const routeName = getFocusedRouteNameFromRoute(props.route) ?? 'Feed';

  return (
    <Tab.Navigator
      initialRouteName="play"
      tabBarOptions={{
        style: {
          height: BOTTOM_TAB_HEIGHT,
          backgroundColor: 'black',
          borderTopColor: 'grey',
          borderTopWidth: 0.5,
          position: 'absolute',
          elevation: 1,
        },
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="top"
        component={TopUsersScreen}
        options={{
          tabBarLabel: 'Top',
          tabBarIcon: ({ color, size }) => (
            <CachedImage
              source={routeName === 'top' ? ic_tab_top_focused : ic_tab_top}
              style={[styles.tabIconImage, { width: 24, height: 24 }]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="play"
        component={PlayMainScreen}
        options={{
          tabBarLabel: 'Play',
          tabBarIcon: ({ color, size }) => (
            <CachedImage
              source={routeName === 'play' ? ic_tab_play_focused : ic_tab_play}
              style={styles.tabIconImage}
            />
          ),
        }}
      />
      <Tab.Screen
        name="home"
        component={HomeMainScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <CachedImage
              source={routeName === 'home' ? ic_tab_home_focused : ic_tab_home}
              style={styles.tabIconImage}
            />
          ),
        }}
      />
      <Tab.Screen
        name="live_stream"
        component={BrowseRooms}
        options={{
          tabBarLabel: 'LiveStream',
          tabBarIcon: ({ color, size }) => (
            <CachedImage
              source={
                routeName === 'live_stream'
                  ? ic_tab_liveStream_focused
                  : ic_tab_liveStream
              }
              style={styles.tabIconImage}
            />
          ),
          tabBarBadgeStyle: { backgroundColor: 'red' },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!global.me) {
              e.preventDefault();
              navigation.navigate('signin');
            }
          },
        })}
      />
      <Tab.Screen
        name="profile"
        component={ProfileMainScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ color, size }) => {
            const randomNumber = Math.floor(Math.random() * avatars.length);
            const randomImageUrl = avatars[randomNumber];

            const avatarImage = { uri: global.me?.photo ?? randomImageUrl };
            return (
              <CachedImage
                source={avatarImage}
                style={[styles.tabIconImage, styles.profileIcon]}
              />
            );
          },
          ...(unreadCount > 0 && { tabBarBadge: unreadCount }),
          tabBarBadgeStyle: { backgroundColor: 'red', fontSize: 12 },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!global.me) {
              e.preventDefault();
              navigation.navigate('signin');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default connect(
  (state) => ({
    unreadCount: state.message?.unreadCount || 0,
  }),
  {
    setUnreadCount,
  },
)(MainTabNavigator);

const styles = StyleSheet.create({
  tabIconImage: {
    width: 28,
    height: 28,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  homeIconContainer: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderRadius: 32,
  },
  homeIconInnerContainer: {
    width: 52,
    height: 52,
    backgroundColor: '#1BF2DD',
    borderRadius: 26,
  },
  profileIcon: {
    borderRadius: 16,
    overflow: 'hidden',
    resizeMode: 'cover',
  },
});
