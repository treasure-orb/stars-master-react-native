import React from 'react';
import { View } from 'react-native';

import { GStyle } from '../utils/Global';
import { SkypeIndicator } from 'react-native-indicators';

const ModalIndicator = () => (
  <View
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      opacity: 0.3,
      zIndex: 100,
      elevation: 10,
    }}
  >
    <View style={{ flex: 1 }}>
      <SkypeIndicator color={GStyle.whiteColor} />
    </View>
  </View>
);

export default ModalIndicator;
