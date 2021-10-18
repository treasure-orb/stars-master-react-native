import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import map from 'lodash.map';
import noop from 'lodash.noop';
import result from 'lodash.result';
import findindex from 'lodash.findindex';
import RadioButton from './RadioButton';

class RadioGroup extends Component {
  state = {
    selected: findindex(this.props.radioGroupList, [
      'value',
      this.props.initialValue,
    ]),
  };

  radioSelect = (key, value) => {
    this.setState({ selected: key });
    this.props.onChange(value);
  };
  render() {
    const { selected } = this.state;
    const {
      normalMode,
      radioGroupList,
      containerStyle,
      buttonTextStyle,
      buttonTextActiveStyle,
      buttonTextInactiveStyle,
    } = this.props;

    const radioGroup = map(radioGroupList, (radiocomp, index) => (
      <RadioButton
        key={index}
        normalMode={normalMode}
        label={result(radiocomp, 'label', '')}
        value={result(radiocomp, 'value', '')}
        index={index}
        radioSelect={this.radioSelect}
        active={selected === index}
        buttonTextStyle={buttonTextStyle}
        buttonTextActiveStyle={buttonTextActiveStyle}
        buttonTextInactiveStyle={buttonTextInactiveStyle}
      />
    ));

    return <View style={[styles.container, containerStyle]}>{radioGroup}</View>;
  }
}
RadioGroup.defaultProps = {
  normalMode: false,
  radioGroupList: [], // [{label: '', value: ''}]
  onChange: noop, // CallBack with the selected radio button value
  initialValue: '', // VALUE of option to be intially selected
  containerStyle: {},
  buttonTextStyle: {},
  buttonTextActiveStyle: {},
  buttonTextInactiveStyle: {},
};
RadioGroup.propTypes = {
  normalMode: Proptypes.bool,
  radioGroupList: Proptypes.array.isRequired,
  onChange: Proptypes.func,
  initialValue: Proptypes.string,
  containerStyle: Proptypes.object,
  buttonTextStyle: Proptypes.object,
  buttonTextActiveStyle: Proptypes.object,
  buttonTextInactiveStyle: Proptypes.object,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default RadioGroup;
