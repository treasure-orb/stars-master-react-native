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
import { Constants, GStyle, GStyles, RestAPI } from '../../utils/Global';

class FCVerifyEmailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: global.debug ? (global.roleId == 1 ? 'njrhu5' : 'ihe6cf') : '',
    };

    this.initRef();
  }

  componentWillUnmount() {}

  componentDidMount() {}

  initRef = () => {
    this.codeRef = (ref) => {
      this.code = ref;
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
    ['code']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  };

  onSubmitCode = () => {
    this.code.blur();
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  onSendAgain = () => {
    global.showForcePageLoader(true);
    RestAPI.resend_email_verification((json, err) => {
      global.showForcePageLoader(false);

      if (err !== null) {
        Alert.alert(Constants.ERROR_TITLE, 'Failed to resend verify email.');
        console.error(err);
        return;
      }
      // TODO - hooks up resend email verification
      if (json.status === 1) {
        Toast.show('Verification email is sent successfully.');
      } else {
        Alert.alert(Constants.ERROR_TITLE, 'Failed to resend verify email.');
      }
    });
  };

  onVerify = () => {
    const { code } = this.state;

    global.showForcePageLoader(true);
    RestAPI.verify_email(code, (json, err) => {
      global.showForcePageLoader(false);

      if (err !== null) {
        Alert.alert(
          Constants.ERROR_TITLE,
          'Failed to verify email, please try again.',
        );
        console.error(err);
        return;
      }

      if (json.status === 1) {
        this.props.navigation.navigate('fc_verify_email_success');
      } else {
        Alert.alert(
          Constants.ERROR_TITLE,
          'Failed to verify email, please try again.',
        );
      }
    });
  };

  onNext = () => {
    const { code } = this.state;
    let errors = {};

    ['code'].forEach((name) => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'Should not be empty';
      }
    });

    this.setState({ errors });

    const errorCount = Object.keys(errors).length;
    if (errorCount < 1) {
      global.showForcePageLoader(true);
      RestAPI.forget_password(code, (json, err) => {
        global.showForcePageLoader(false);

        if (err !== null) {
          Alert.alert(
            Constants.ERROR_TITLE,
            'Failed to send reset password, please try again.',
          );
          console.error(err);
          return;
        }

        if (json.status === 1) {
          this.props.navigation.navigate('fc_recover_password');
        } else {
          Alert.alert(
            Constants.ERROR_TITLE,
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
            {this._renderInput()}
            {this._renderSendAgain()}
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
        {global.roleId == 2 && (
          <Text style={[GStyles.regularText, { marginTop: 12 }]}>
            Step 2 of 2
          </Text>
        )}
        <Text style={GStyles.titleText}>Verify your email address</Text>
        <Text style={[GStyles.titleDescription, { marginTop: 20 }]}>
          Please check your email for a six-digit security code and enter it
          below.
        </Text>
      </>
    );
  };

  _renderInput = () => {
    let { code, errors = {} } = this.state;

    return (
      <TextField
        ref={this.codeRef}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        enablesReturnKeyAutomatically={true}
        onFocus={this.onFocus}
        onChangeText={this.onChangeText}
        onSubmitEditing={this.onSubmitCode}
        returnKeyType="done"
        label="Enter code"
        value={code}
        error={errors.code}
        containerStyle={{ marginTop: 36 }}
      />
    );
  };

  _renderSendAgain = () => {
    return (
      <View style={[GStyles.rowCenterContainer, { height: 30, marginTop: 25 }]}>
        <Text style={[GStyles.regularText, { fontSize: 13, height: '100%' }]}>
          Didn`t get a code?
        </Text>
        <TouchableOpacity onPress={this.onSendAgain}>
          <Text
            style={{
              fontFamily: 'GothamPro',
              fontSize: 13,
              flex: 1,
              color: GStyle.linkColor,
              marginLeft: 5,
            }}
          >
            Send again
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderButton = () => {
    return (
      <View style={{ marginVertical: 50 }}>
        <TouchableOpacity onPress={this.onVerify}>
          <View style={GStyles.buttonFill}>
            <Text style={GStyles.textFill}>Verify</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({});

export default FCVerifyEmailScreen;
