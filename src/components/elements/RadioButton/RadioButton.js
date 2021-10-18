import React, { Component } from 'react';
import Proptypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import noop from 'lodash.noop';
import { GStyle } from '../../../utils/Global';

const image_active = require('../../../assets/images/ic_radio_active.png');
const image_inactive = require('../../../assets/images/ic_radio_inactive.png');

class RadioButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image_source: '',
    };
  }

  onToggle = () => {
    const { radioSelect, value, index } = this.props;
    radioSelect(index, value);
  };
  render() {
    const {
      normalMode,
      active,
      label,
      buttonTextStyle,
      buttonTextActiveStyle,
      buttonTextInactiveStyle,
    } = this.props;

    const activeTextStyles = active
      ? [styles.activeText, buttonTextActiveStyle]
      : [styles.inactiveText, buttonTextInactiveStyle];

    this.state.image_source = active ? image_active : image_inactive;

    return (
      <TouchableWithoutFeedback onPress={this.onToggle}>
        {normalMode ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image
              source={this.state.image_source}
              style={{ width: 20, height: 20 }}
            />
            <Text
              style={[
                styles.text,
                buttonTextStyle,
                activeTextStyles,
                { marginLeft: 14 },
              ]}
            >
              {label}
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={[styles.text, buttonTextStyle, activeTextStyles]}>
              {label}
            </Text>
            <Image
              source={this.state.image_source}
              style={{ width: 20, height: 20 }}
            />
          </View>
        )}
      </TouchableWithoutFeedback>
    );
  }
}
RadioButton.defaultProps = {
  index: 0,
  normalMode: false,
  active: false,
  label: '',
  value: '',
  radioSelect: noop,
  buttonTextStyle: {},
  buttonTextActiveStyle: {},
  buttonTextInactiveStyle: {},
};
RadioButton.propTypes = {
  index: Proptypes.number,
  normalMode: Proptypes.bool,
  active: Proptypes.bool,
  label: Proptypes.string,
  value: Proptypes.string,
  radioSelect: Proptypes.func,
  buttonTextStyle: Proptypes.object,
  buttonTextActiveStyle: Proptypes.object,
  buttonTextInactiveStyle: Proptypes.object,
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'GothamPro',
    fontSize: 15,
  },
  activeText: {
    fontFamily: 'GothamPro-Medium',
    fontSize: 15,
    color: GStyle.fontColor,
  },
  inactiveText: {
    fontFamily: 'GothamPro',
    fontSize: 15,
    color: GStyle.fontColor,
  },
});

export default RadioButton;
