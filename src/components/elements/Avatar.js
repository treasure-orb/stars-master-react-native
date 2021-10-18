import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import FastImage from 'react-native-fast-image';
import GStyle from '../../utils/Global/Styles';
import CachedImage from '../CachedImage';

const ic_mini_call = require('../../assets/images/Icons/ic_mini_call.png');
const ic_mini_chat = require('../../assets/images/Icons/ic_mini_chat.png');
const Avatar = ({
  image,
  size,
  borderRadius,
  onPress,
  status,
  interviewType,
  borderWidth,
  containerStyle,
}) => {
  const defaults = {
    width: 56,
    height: 56,
    // borderRadius: size ? size * 0.35 : 12,
    borderRadius: 0,
    onPress: () => {},
  };

  const statusColor = {
    online: '#49CAE9',
    offline: '#DCDCDC',
    away: '#FE8D65',
    disturb: '#FA395E',
  };

  const interviewImage = {
    chat: ic_mini_chat,
    call: ic_mini_call,
  };

  const icon_size = size ? size : defaults.width;
  const calc_size = (icon_size - 56) * 0.3 - icon_size * 0.15;
  const interviewImageMargin = calc_size > 0 ? 0 : calc_size;
  const statusMargin = (icon_size - 56) * 0.1;

  return (
    <View
      style={[
        styles.container,
        {
          width: size ? size : defaults.width,
          height: size ? size : defaults.height,
        },
        containerStyle,
      ]}
    >
      <TouchableOpacity
        onPress={onPress ? onPress : defaults.onPress}
        disabled={!onPress}
      >
        <CachedImage
          source={{
            uri: image?.uri?.toString() || '',
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          style={{
            width: '100%',
            height: '100%',
            borderWidth: borderWidth > 0 ? borderWidth : 0,
            borderColor: 'white',
            borderRadius: borderRadius ? borderRadius : defaults.borderRadius,
          }}
        />
        {status && (
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              borderWidth: 2,
              borderColor: 'white',
              position: 'absolute',
              right: statusMargin,
              bottom: statusMargin,
              backgroundColor: statusColor[status],
            }}
          />
        )}
        {interviewType && (
          <CachedImage
            source={interviewImage[interviewType]}
            style={{
              width: 24,
              height: 24,
              position: 'absolute',
              right: interviewImageMargin,
              bottom: interviewImageMargin,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 3,
    borderRadius: 56,
    overflow: 'hidden',
    backgroundColor: GStyle.lineColor,
  },
});

export default Avatar;
