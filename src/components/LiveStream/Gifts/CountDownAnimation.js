import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const GO = 'GO!';

export default class extends React.Component {
  animation = new Animated.Value(0);
  state = {
    count: 5,
  };

  componentDidMount() {
    setTimeout(() => this.start(), 500);
  }

  componentDidUpdate(prevProps) {
    // paused -> playing
    if (prevProps.paused && !this.props.paused) {
      if (this.state.count === GO) {
        this.end();
      } else if (this.state.count > 0) {
        this.start();
      }
    }
  }

  start = () => {
    const { paused } = this.props;
    this.animation.setValue(0);

    if (paused) {
      return;
    }

    Animated.sequence([
      Animated.timing(this.animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(this.animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const nextCount = this.state.count - 1;

      if (paused) {
        return;
      }

      if (nextCount < 0) {
        return;
      }

      if (nextCount === 0) {
        this.setState({ count: 'GO!' });
        this.props.playGoAudio && this.props.playGoAudio();
        this.end();
      } else {
        this.setState({ count: this.state.count - 1 });
        this.start();
      }
    });
  };

  end = () => {
    if (this.props.paused) {
      return;
    }

    Animated.sequence([
      Animated.timing(this.animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(this.animation, {
        toValue: 2,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.props.onEnd && this.props.onEnd();
    });
  };

  render() {
    const { count } = this.state;

    const opacity = this.animation.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const scale = this.animation.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 2],
      extrapolate: 'clamp',
    });

    const containerStyles = [
      styles.container,
      { opacity, transform: [{ scale }] },
    ];

    const fontSize = count === GO ? 25 : 40;
    const lineHeight = count === GO ? 35 : 55;

    const countStyles = [styles.count, { fontSize, lineHeight }];

    return (
      <View style={styles.giftAnimationContainer}>
        <Animated.View style={containerStyles}>
          <Text style={countStyles}>{count}</Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  giftAnimationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(33, 41, 61, 0.4)',
    borderRadius: 50,
  },
  count: {
    fontSize: 35,
    lineHeight: 55,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
});
