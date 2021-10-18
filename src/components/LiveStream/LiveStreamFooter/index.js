import React, { Component, useEffect, useState } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import GradientIconButton from './GradientIconButton';
import MessagesList from '../MessagesList';
import MessageBox from './MessageBox';

import ic_switch_camera from '../../../assets/images/Icons/ic_switch_camera.png';
import ic_share from '../../../assets/images/Icons/ic_share.png';
import ic_gift from '../../../assets/images/Icons/ic_gift.png';
import heart from '../../../assets/images/gifts/heart.png';

import { GStyles } from '../../../utils/Global/Styles';
import styles from './styles';

class LiveStreamFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  onPressSendHeart = () => {
    const { onPressSendHeart } = this.props;
    onPressSendHeart && onPressSendHeart();
  };

  onPressGiftAction = () => {
    const { onPressGiftAction } = this.props;
    onPressGiftAction && onPressGiftAction();
  };

  onPressShareAction = () => {
    const { onPressShareAction } = this.props;
    onPressShareAction && onPressShareAction();
  };

  onPressSwitchCamera = () => {
    const { onPressSwitchCamera } = this.props;
    onPressSwitchCamera && onPressSwitchCamera();
  };

  onPressSwitchAudio = () => {
    const { onPressSwitchAudio } = this.props;
    onPressSwitchAudio && onPressSwitchAudio();
  };

  render() {
    const {
      mode,
      method,
      onPressSendMessage,
      messages,
      keyboardHeight,
    } = this.props;
    const bottom = Platform.OS === 'ios' ? keyboardHeight : 16;

    return (
      <View style={[styles.container, { bottom }]}>
        <View
          style={[
            GStyles.rowContainer,
            { alignItems: 'flex-end', marginBottom: 24 },
          ]}
        >
          <MessagesList
            messages={messages}
            onPressProfileAction={this.props.onPressProfileAction}
          />
          <View>
            {mode === 'streamer' && method === 0 && (
              <GradientIconButton
                onPress={this.onPressSwitchCamera}
                icon={ic_switch_camera}
                containerStyle={{ marginRight: 0, marginBottom: 8 }}
              />
            )}

            {mode === 'viewer' && (
              <GradientIconButton
                icon={ic_share}
                onPress={this.onPressShareAction}
              />
            )}
          </View>
        </View>
        <View style={GStyles.rowContainer}>
          <MessageBox onPressSendMessage={onPressSendMessage} />

          {mode === 'streamer' && (
            <GradientIconButton
              icon={ic_share}
              onPress={this.onPressShareAction}
              containerStyle={{ marginLeft: 8 }}
            />
          )}

          {mode === 'viewer' && (
            <GradientIconButton
              icon={heart}
              onPress={this.onPressSendHeart}
              containerStyle={{ marginLeft: 8 }}
            />
          )}
          {mode === 'viewer' && (
            <GradientIconButton
              icon={ic_gift}
              onPress={this.onPressGiftAction}
              containerStyle={{ marginLeft: 8 }}
            />
          )}
        </View>
      </View>
    );
  }
}

export default function (props) {
  let navigation = useNavigation();
  let route = useRoute();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );
    return () => {
      keyboardDidShowListener && keyboardDidShowListener.remove();
      keyboardDidHideListener && keyboardDidHideListener.remove();
    };
  }, []);

  const _keyboardDidShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const _keyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  return (
    <LiveStreamFooter
      {...props}
      navigation={navigation}
      route={route}
      keyboardHeight={keyboardHeight}
    />
  );
}
