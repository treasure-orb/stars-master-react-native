import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import HeartShape from './HeartShape';

class StaticHeart extends Component {
  state = {
    height: null,
  };

  handleOnLayout = (e) => {
    const { height } = e.nativeEvent.layout;

    this.setState({ height });
  };

  render() {
    const { height } = this.state;
    const { color } = this.props;
    const isReady = height !== null;

    const heartProps = {};
    if (color !== null) {
      heartProps.color = color;
    }

    return (
      <View
        style={[styles.container, this.props.style]}
        onLayout={this.handleOnLayout}
        pointerEvents="none"
      >
        {isReady && <HeartShape {...heartProps} />}
      </View>
    );
  }
}

/**
 * @class AnimatedShape
 */

/**
 * Styles
 */

const styles = StyleSheet.create({
  container: {
    right: 30,
    bottom: 0,
    position: 'absolute',
  },

  shapeWrapper: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

/**
 * Exports
 */

export default StaticHeart;
