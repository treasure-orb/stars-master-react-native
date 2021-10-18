import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import MainTabNavigator from './MainTabNavigator';

import SigninScreen from '../screens/auth/SigninScreen';
import SignupScreen from '../screens/auth/SignupScreen';

import CameraMainScreen from '../screens/tab_camera/CameraMainScreen';
import ProductUploadScreen from '../screens/tab_camera/ProductUploadScreen';
import PostUploadScreen from '../screens/tab_camera/PostUploadScreen';
import CameraPreviewScreen from '../screens/tab_camera/CameraPreviewScreen';
import CameraDraftScreen from '../screens/tab_camera/CameraDraftScreen';
import MessageChatScreen from '../screens/tab_message/MessageChatScreen';
import HomeSearchScreen from '../screens/tab_home/HomeSearchScreen';
import ProfileEditScreen from '../screens/tab_profile/ProfileEditScreen';
import ProfileVideoScreen from '../screens/details/ProfileVideoScreen';
import ProfileOtherScreen from '../screens/tab_play/ProfileOtherScreen';
import MessageMainScreen from '../screens/tab_message/MessageMainScreen';
import SavedProductsScreen from '../screens/details/SavedProductsScreen';
import MyVideoScreen from '../screens/details/MyProductsScreen';
import MyPostsScreen from '../screens/details/MyPostsScreen';
import PostsScreen from '../screens/details/PostsScreen';
import TeamsScreen from '../screens/teams/TeamsScreen';
import CommentsScreen from '../screens/details/CommentsScreen';
import FansScreen from '../screens/details/FansScreen';
import FollowingUsersScreen from '../screens/details/FollowingUsersScreen';
import GoLive from '../screens/live_stream/GoLive';
import ViewLive from '../screens/live_stream/ViewLive';

import { Helper } from '../utils/Global';
import { isReadyRef, navigationRef } from './../utils/Global/RootNavigation';

const WINDOW_HEIGHT = Helper.getWindowWidth();

const Stack = createStackNavigator();

// const config = {
//   animation: 'spring',
//   config: {
//     stiffness: 1000,
//     damping: 500,
//     mass: 3,
//     overshootClamping: true,
//     restDisplacementThreshold: 0.01,
//     restSpeedThreshold: 0.01,
//   },
// };

export default function App() {
  return (
    <NavigationContainer
      theme={{ colors: { background: 'black' } }}
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          gestureResponseDistance: { horizontal: WINDOW_HEIGHT },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        initialRouteName="main_tab_navigator"
      >
        {/* --- start --- */}
        <Stack.Screen name="main_tab_navigator" component={MainTabNavigator} />

        {/* --- Auth --- */}
        <Stack.Screen name="signin" component={SigninScreen} />
        <Stack.Screen name="signup" component={SignupScreen} />

        {/* --- camera tab --- */}
        <Stack.Screen name="camera_main" component={CameraMainScreen} />
        <Stack.Screen name="product_upload" component={ProductUploadScreen} />
        <Stack.Screen name="post_upload" component={PostUploadScreen} />
        <Stack.Screen name="camera_preview" component={CameraPreviewScreen} />
        <Stack.Screen name="camera_draft" component={CameraDraftScreen} />

        {/* --- message tab --- */}
        <Stack.Screen name="message" component={MessageMainScreen} />
        <Stack.Screen name="message_chat" component={MessageChatScreen} />

        {/* --- home tab --- */}
        <Stack.Screen name="home_search" component={HomeSearchScreen} />

        {/* --- profile tab --- */}
        <Stack.Screen name="profile_edit" component={ProfileEditScreen} />
        <Stack.Screen name="profile_other" component={ProfileOtherScreen} />
        <Stack.Screen name="fans_screen" component={FansScreen} />
        <Stack.Screen name="following_users" component={FollowingUsersScreen} />
        <Stack.Screen name="saved_products" component={SavedProductsScreen} />
        <Stack.Screen name="my_products" component={MyVideoScreen} />
        <Stack.Screen name="my_posts" component={MyPostsScreen} />
        <Stack.Screen name="post_comments" component={CommentsScreen} />
        <Stack.Screen name="profile_video" component={ProfileVideoScreen} />
        <Stack.Screen name="post_detail" component={PostsScreen} />
        <Stack.Screen name="go_live" component={GoLive} />
        <Stack.Screen name="view_live" component={ViewLive} />
        <Stack.Screen name="teams_screen" component={TeamsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
