import React from 'react';
import { View } from 'react-native';
import { BallIndicator } from 'react-native-indicators';
import PropTypes from 'prop-types';

const PageLoaderIndicator = ({ isPageLoader = false }) => {
  if (!isPageLoader) {
    return null;
  }
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(13,13,13,0.4)',
        zIndex: 99999,
      }}
    >
      <BallIndicator color={'white'} />
    </View>
  );
};

PageLoaderIndicator.propTypes = {
  isPageLoader: PropTypes.bool,
};

PageLoaderIndicator.defaultProps = {
  isPageLoader: false,
};

export default PageLoaderIndicator;
