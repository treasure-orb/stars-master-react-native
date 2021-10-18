import React from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

import { TextField } from '../../lib/MaterialTextField/index';
import GHeaderBar from '../../components/GHeaderBar';
import { Constants, GStyles, RestAPI } from '../../utils/Global';

class FCRecoverPasswordScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: global.debug ? '8pnvIg' : '',
      newPassword: global.debug ? '1234' : '',
      confirmPassword: global.debug ? '1234' : '',
    };

    this.initRef();
  }

  componentWillUnmount() {}

  componentDidMount() {}

  initRef = () => {
    this.codeRef = (ref) => {
      this.code = ref;
    };

    this.newPasswordRef = (ref) => {
      this.newPassword = ref;
    };

    this.confirmPasswordRef = (ref) => {
      this.confirmPassword = ref;
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
    ['code', 'newPassword', 'confirmPassword']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  };

  onSubmitCode() {
    this.code.focus();
  }

  onSubmitNewPassword() {
    this.confirmPassword.focus();
  }

  onSubmitConfirmPassword() {
    this.confirmPassword.blur();
  }

  onBack = () => {
    this.props.navigation.navigate('fc_forget_password');
  };

  onChangePassword = () => {
    let errors = {};

    ['code', 'newPassword', 'confirmPassword'].forEach((name) => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'Should not be empty';
      } else {
        if (
          (name === 'newPassword' || name === 'confirmPassword') &&
          value.length < 6
        ) {
          errors[name] = 'Too short';
        }
      }
    });

    let { newPassword, confirmPassword } = this.state;
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Not match with password';
    }

    this.setState({ errors });

    const errorCount = Object.keys(errors).length;
    if (errorCount < 1) {
      const { code, newPassword, confirmPassword } = this.state;

      global.showForcePageLoader(true);
      // TODO - hooks up recover password endpoint
      RestAPI.recover_password(
        global.forgetPasswordEmail,
        code,
        newPassword,
        (json, err) => {
          global.showForcePageLoader(false);

          if (err !== null) {
            Alert.alert(
              Constants.ERROR_TITLE,
              'Failed to recover password, please try again.',
            );
            console.error(err);
            return;
          }

          if (json.status === 200) {
            this.props.navigation.navigate('fc_recover_password_success');
          } else {
            Alert.alert(
              Constants.ERROR_TITLE,
              'Failed to recover password, please try again.',
            );
          }
        },
      );
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
            {this._renderInput()}
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
        <Text style={GStyles.titleText}>Recovery Password</Text>
        <Text style={[GStyles.titleDescription, { marginTop: 20 }]}>
          Reset code was sent to your email. Please enter the code and create
          new password.
        </Text>
      </>
    );
  };

  _renderInput = () => {
    const { code, newPassword, confirmPassword, errors = {} } = this.state;

    return (
      <>
        <TextField
          ref={this.codeRef}
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitCode}
          returnKeyType="next"
          label="Code"
          value={code}
          error={errors.code}
          containerStyle={{ marginTop: 24 }}
        />
        <TextField
          ref={this.newPasswordRef}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          clearTextOnFocus={true}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitNewPassword}
          returnKeyType="next"
          label="New Password"
          value={newPassword}
          error={errors.newPassword}
          containerStyle={{ marginTop: 8 }}
        />
        <TextField
          ref={this.confirmPasswordRef}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          clearTextOnFocus={true}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitConfirmPassword}
          returnKeyType="done"
          label="Confirm Password"
          value={confirmPassword}
          error={errors.confirmPassword}
          containerStyle={{ marginTop: 8 }}
        />
      </>
    );
  };

  _renderButton = () => {
    return (
      <View style={{ marginVertical: 40 }}>
        <TouchableOpacity onPress={this.onChangePassword}>
          <View style={GStyles.buttonFill}>
            <Text style={GStyles.textFill}>Change Password</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({});

export default FCRecoverPasswordScreen;
