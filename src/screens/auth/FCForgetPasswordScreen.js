import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

import { TextField } from '../../lib/MaterialTextField/index';
import GHeaderBar from '../../components/GHeaderBar';
import { Constant, GStyles } from '../../utils/Global';

class FCForgetPasswordScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: global.debug
        ? global.roleId == 1
          ? 'crn221@163.com'
          : 'dickarnold221@gmail.com'
        : '',
    };

    this.initRef();
  }

  componentWillUnmount() {}

  componentDidMount() {}

  initRef = () => {
    this.emailRef = (ref) => {
      this.email = ref;
    };
  };

  onFocus = () => {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  };

  onChangeText = (text) => {
    ['email']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  };

  onSubmitEmail = () => {
    this.email.blur();
  };

  onBack = () => {
    this.props.navigation.navigate('fc_signin');
  };

  onNext = () => {
    const { email } = this.state;
    let errors = {};

    ['email'].forEach((name) => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'Should not be empty';
      }
    });

    this.setState({ errors });

    const errorCount = Object.keys(errors).length;
    if (errorCount < 1) {
      global.showForcePageLoader(true);
      RestAPI.forget_password(email, (json, err) => {
        global.showForcePageLoader(false);

        if (err !== null) {
          Alert.alert(
            Constant.ERROR_TITLE,
            'Failed to send reset password, please try again.',
          );
          console.error(err);
          return;
        }

        if (json.status === 1) {
          global.forgetPasswordEmail = email;
          this.props.navigation.navigate('fc_recover_password');
        } else {
          Alert.alert(
            Constant.ERROR_TITLE,
            'Failed to send reset password, please try again.',
          );
        }
      });
    }
  };

  render() {
    return (
      <>
        <SafeAreaView style={GStyles.statusBar} />
        <SafeAreaView style={GStyles.container}>
          {this._renderHeader()}
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={GStyles.elementContainer}
          >
            {this._renderTitle()}
            {this._renderEmail()}
            {this._renderButton()}
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </>
    );
  }

  _renderHeader = () => {
    return (
      <GHeaderBar
        headerTitle=""
        leftType="back"
        onPressLeftButton={this.onBack}
      />
    );
  };

  _renderTitle = () => {
    return (
      <>
        <Text style={GStyles.titleText}>Forget Password</Text>
        <Text style={[GStyles.titleDescription, { marginTop: 20 }]}>
          Please enter your email below to receive your password reset
          instructions.
        </Text>
      </>
    );
  };

  _renderEmail = () => {
    let { email, errors = {} } = this.state;

    return (
      <TextField
        ref={this.emailRef}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        enablesReturnKeyAutomatically={true}
        onFocus={this.onFocus}
        onChangeText={this.onChangeText}
        onSubmitEditing={this.onSubmitEmail}
        returnKeyType="done"
        label="Email"
        value={email}
        error={errors.email}
        containerStyle={{ marginTop: 36 }}
      />
    );
  };

  _renderButton = () => {
    return (
      <View style={{ marginVertical: 40 }}>
        <TouchableOpacity onPress={this.onNext}>
          <View style={GStyles.buttonFill}>
            <Text style={GStyles.textFill}>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({});

export default FCForgetPasswordScreen;
