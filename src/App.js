import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import branch from 'react-native-branch';

import { Provider } from 'react-redux';
import Bugsnag from '@bugsnag/react-native';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import { Provider as PaperProvider } from 'react-native-paper';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import AppNavigator from './navigation/AppNavigator';
import PageLoaderIndicator from '../src/components/PageLoaderIndicator';
import CachedImage from './components/CachedImage';

import LiveStreamSocketManager from './utils/LiveStream/SocketManager';
import ChatStreamSocketManager from './utils/Message/SocketManager';
import * as RootNavigation from './utils/Global/RootNavigation';
import { isReadyRef, navigationRef } from './utils/Global/RootNavigation';
import { store } from './redux/store';

import GStyle from './utils/Global/Styles';
import { Constants, Helper } from './utils/Global';
import ic_logo_01 from './assets/images/Icons/ic_logo_01.png';

const handleDeepLink = ({ product, roomId, post }) => {
  global._prevScreen = 'deep_link';
  if (product) {
    try {
      global._selIndex = 0;

      if (typeof product === 'string') {
        global._productsList = [JSON.parse(product)];
      } else {
        global._productsList = [product];
      }
    } catch (error) {}

    RootNavigation.navigate('profile_video', { isDeepLinking: true });
  } else if (post) {
    try {
      global._selIndex = 0;

      if (typeof post === 'string') {
        global._postsList = [JSON.parse(post)];
      } else {
        global._postsList = [post];
      }
    } catch (error) {}

    RootNavigation.navigate('post_detail', { isDeepLinking: true });
  } else if (roomId) {
    RootNavigation.navigate('view_live', { roomId });
  }
};

const subscribeDeepLink = () => {
  return branch.subscribe(({ error, params, uri }) => {
    if (error) {
      console.error('Error from Branch: ' + error);
      return;
    }

    // params will never be null if error is nulli

    if (params['+non_branch_link']) {
      // Route non-Branch URL if appropriate.
      return;
    }
    if (!params['+clicked_branch_link']) {
      // Indicates initialization success and some other conditions.
      // No link was opened.
      return;
    }

    // A Branch link was opened.
    // Route link based on data in params, e.g.

    const { roomId, product, post } = params;
    if (isReadyRef.current && navigationRef.current) {
      handleDeepLink({ product, roomId, post });
    } else {
      setTimeout(() => {
        handleDeepLink({ product, roomId, post });
      }, 5000);
    }
  });
};

const onReceived = (receivedEvent) => {
  const notification = receivedEvent.getNotification();
  receivedEvent.complete(notification);
  Helper.callFunc(global.onSetUnreadCount);
};

const onOpened = async () => {
  if (!global.me) {
    try {
      const userString = await Helper.getLocalValue(Constants.KEY_USER);
      if (userString) {
        global.me = JSON.parse(userString);
      }
    } catch (error) {}
  }

  await Helper.setDeviceId();

  if (isReadyRef.current && navigationRef.current) {
    RootNavigation.navigate('message');
  } else {
    setTimeout(() => {
      RootNavigation.navigate('message');
    }, 5000);
  }
};

const init = async () => {
  Bugsnag.start();
  global.success = (title, text) => {
    showMessage({
      message: title,
      description: text,
      type: 'success',
      icon: 'auto',
    });
  };

  global.warning = (title, text) => {
    showMessage({
      message: title,
      description: text,
      type: 'warning',
      icon: 'auto',
    });
  };

  global.error = (title, text) => {
    showMessage({
      message: title,
      description: text,
      type: 'error',
      icon: 'auto',
    });
  };
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId('b90b63c2-bbc8-4c56-84fe-39298ff4ca45'); // TODO move to a constant
  //Prompt for push on iOS
  OneSignal.promptForPushNotificationsWithUserResponse((response) => {
    console.log('Prompt response:', response);
  });
  OneSignal.setNotificationWillShowInForegroundHandler(onReceived);
  OneSignal.setNotificationOpenedHandler(onOpened);
  const deviceState = await OneSignal.getDeviceState();
  global._pushToken = deviceState.pushToken;
  global._pushAppId = deviceState.userId;
  await Helper.setDeviceId();
  //await Global.checkPermissionsForNotification();
};

init();

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

function App() {
  const [isShowPageLoader, setIsShowPageLoader] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const branchUnsubscribe = subscribeDeepLink();
    LiveStreamSocketManager.instance.connect();
    ChatStreamSocketManager.instance.connect();
    ChatStreamSocketManager.instance.listenReceiveMessages();

    return () => {
      LiveStreamSocketManager.instance.disconnect();
      ChatStreamSocketManager.instance.disconnect();
      ChatStreamSocketManager.instance.removeReceiveMessages();
      branchUnsubscribe();
    };
  }, []);

  useEffect(() => {
    global.showForcePageLoader = (isShow) => {
      if (isShowPageLoader !== isShow) {
        setIsShowPageLoader(isShow);
      }
    };

    global.setIsInitLoading = (isLoading) => {
      if (initLoading !== isLoading) {
        setInitLoading(isLoading);
      }
    };
  }, [isShowPageLoader, initLoading]);

  return (
    <ErrorBoundary FallbackComponent={ErrorView}>
      <View style={styles.container}>
        <Provider store={store}>
          <PaperProvider>
            <AppNavigator />
            <FlashMessage position="top" />
            <PageLoaderIndicator isPageLoader={isShowPageLoader} />
            {initLoading && (
              <View style={styles.splashContainer}>
                <StatusBar hidden={true} />
                <CachedImage source={ic_logo_01} style={styles.logo} />
              </View>
            )}
          </PaperProvider>
        </Provider>
      </View>
    </ErrorBoundary>
  );
}

const ErrorView = () => {
  return (
    <View style={styles.errorContainer}>
      <Text>Unexpected error occurred.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: GStyle.activeColor,
    position: 'absolute',
    top: 0,
    left: 0,
    width: Constants.WINDOW_WIDTH,
    height: Constants.WINDOW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
  },
  logo: {
    width: 120,
    height: 120,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default App;
