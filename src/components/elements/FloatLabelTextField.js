import React, { Component } from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';

import { GStyle } from '../../utils/Global';

class FloatingLabel extends Component {
  constructor(props) {
    super(props);

    let initialPadding = 9;
    let initialOpacity = 0;

    if (this.props.visible) {
      initialPadding = 5;
      initialOpacity = 1;
    }

    this.state = {
      paddingAnim: new Animated.Value(initialPadding),
      opacityAnim: new Animated.Value(initialOpacity),
    };
  }

  componentDidUpdate(prevProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: prevProps.visible ? 5 : 9,
      duration: 230,
      useNativeDriver: false,
    }).start();

    return Animated.timing(this.state.opacityAnim, {
      toValue: prevProps.visible ? 1 : 0,
      duration: 230,
      useNativeDriver: false,
    }).start();
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.floatingLabel,
          {
            paddingTop: this.state.paddingAnim,
            opacity: this.state.opacityAnim,
          },
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

class TextFieldHolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marginAnim: new Animated.Value(this.props.withValue ? 10 : 0),
    };
  }

  componentDidUpdate(prevProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: prevProps.withValue ? 10 : 0,
      duration: 230,
      useNativeDriver: false,
    }).start();
  }

  render() {
    return (
      <Animated.View style={{ marginTop: this.state.marginAnim }}>
        {this.props.children}
      </Animated.View>
    );
  }
}

class FloatLabelTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      text: this.props.value,
    };
  }

  leftPadding() {
    return { width: this.props.leftPadding || 0 };
  }

  withBorder() {
    if (!this.props.noBorder) {
      return styles.withBorder;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.viewContainer}>
          <View style={[styles.paddingView, this.leftPadding()]} />
          <View style={[styles.fieldContainer, this.withBorder()]}>
            <FloatingLabel visible={this.state.text}>
              <Text style={[styles.fieldLabel, this.labelStyle()]}>
                {this.placeholderValue()}
              </Text>
            </FloatingLabel>
            <TextFieldHolder withValue={this.state.text}>
              <TextInput
                {...this.props}
                ref="input"
                placeholderTextColor={GStyle.grayColor}
                underlineColorAndroid="transparent"
                style={[styles.valueText]}
                defaultValue={this.props.defaultValue}
                value={this.state.text}
                maxLength={this.props.maxLength}
                onFocus={() => this.setFocus()}
                onBlur={() => this.unsetFocus()}
                onChangeText={(value) => this.setText(value)}
              />
            </TextFieldHolder>
          </View>
        </View>
      </View>
    );
  }

  inputRef() {
    return this.refs.input;
  }

  focus() {
    this.inputRef().focus();
  }

  blur() {
    this.inputRef().blur();
  }

  isFocused() {
    return this.inputRef().isFocused();
  }

  clear() {
    this.inputRef().clear();
  }

  setFocus() {
    this.setState({
      focused: true,
    });
    try {
      return this.props.onFocus();
    } catch (_error) {}
  }

  unsetFocus() {
    this.setState({
      focused: false,
    });
    try {
      return this.props.onBlur();
    } catch (_error) {}
  }

  labelStyle() {
    if (this.state.focused) {
      return styles.focused;
    }
  }

  placeholderValue() {
    if (this.state.text) {
      return this.props.placeholder;
    }
  }

  setText(value) {
    this.setState({
      text: value,
    });
    try {
      return this.props.onChangeTextValue(value);
    } catch (_error) {}
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 58,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  paddingView: {
    width: 15,
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 0,
  },
  fieldLabel: {
    fontFamily: 'GothamPro-Medium',
    fontSize: 13,
    color: GStyle.grayColor,
  },
  fieldContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  withBorder: {
    borderBottomWidth: 1,
    borderColor: GStyle.lineColor,
  },
  valueText: {
    // height: Platform.OS == 'ios' ? 20 : 60,
    height: 50,
    fontSize: 16,
    fontFamily: 'GothamPro-Medium',
    fontWeight: 'bold',
    color: GStyle.fontColor,
  },
  focused: {
    color: GStyle.grayColor,
  },
});

export default FloatLabelTextField;
