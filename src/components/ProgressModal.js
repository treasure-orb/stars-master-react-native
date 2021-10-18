import React from 'react';
import { Text, View } from 'react-native';

import ProgressBar from '../lib/Progress/Bar';
import { GStyle, GStyles, Helper } from '../utils/Global';

const WINDOW_WIDTH = Helper.getWindowWidth();

const ProgressModal = ({ percent, isVisible }) => {
  return (
    <>
      {isVisible && (
        <>
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: 'black',
              opacity: 0.4,
              zIndex: 100,
              elevation: 10,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 101,
              elevation: 11,
            }}
          >
            <ProgressBar
              progress={percent * 0.01}
              width={WINDOW_WIDTH * 0.5}
              height={6}
              color={GStyle.activeColor}
              borderColor={'white'}
            />
            <Text
              style={{
                ...GStyles.mediumText,
                color: 'white',
                marginTop: 10,
              }}
            >
              Downloading: {percent}%
            </Text>
          </View>
        </>
      )}
    </>
  );
};

export default ProgressModal;
