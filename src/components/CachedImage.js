import React from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Helper } from './../utils/Global';

export default function CachedImage(props) {
  const source = Helper.normalizeImageSource(props.source);

  return <FastImage {...props} source={source} />;
}
