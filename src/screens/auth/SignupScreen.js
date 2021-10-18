import React from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Dialog from 'react-native-dialog';
import PhoneInput from 'react-native-phone-number-input';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { TextField } from '../../lib/MaterialTextField/index';
import GHeaderBar from '../../components/GHeaderBar';
import {
  Constants,
  GStyle,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';
import validatePhone from '../../utils/Global/validatePhone';

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    this.onRefresh();
  }

  componentWillUnmount() {}

  init = () => {
    this.state = {
      secureTextEntry: global.debug ? false : true,
      userName: global.debug ? 'a113' : '',
      phoneNumber: global.debug ? '3333333333' : '',
      phoneValue: '',
      phoneError: '',
      password: global.debug ? '1234' : '',
      confirmPassword: global.debug ? '1234' : '',
      visible: false,
      code: '',
      confirmation: null,
    };

    this.initRef();
  };

  onRefresh = () => {};

  initRef = () => {
    this.userNameRef = (ref) => {
      this.userName = ref;
    };
    this.phoneNumberRef = React.createRef();
    this.passwordRef = (ref) => {
      this.password = ref;
    };
    this.confirmPasswordRef = (ref) => {
      this.confirmPassword = ref;
    };
  };

  onFocus = () => {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref?.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  };

  onChangeText = (text) => {
    ['userName', 'phoneNumber', 'password', 'confirmPassword']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref?.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  };

  onSubmitUserName = () => {
    this.phoneNumber.focus();
  };

  onSubmitPhoneNumber = () => {
    this.password.focus();
  };

  onSubmitPassword = () => {
    this.confirmPassword.focus();
  };

  onSubmitConfirmPassword = () => {
    this.confirmPassword.blur();
  };

  onAccessoryPress = () => {
    this.setState(({ secureTextEntry }) => ({
      secureTextEntry: !secureTextEntry,
    }));
  };

  renderPasswordAccessory = () => {
    let { secureTextEntry } = this.state;

    let name = secureTextEntry ? 'visibility' : 'visibility-off';

    return (
      <MaterialIcon
        size={24}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={this.onAccessoryPress}
        suppressHighlighting={true}
      />
    );
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  signInWithPhoneNumber = async (phoneNumber) => {
    try {
      return await auth().signInWithPhoneNumber(phoneNumber);
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  onSubmit = () => {
    let errors = {};
    if (
      !this.state.phoneValue.match(/\d/g) ||
      this.state.phoneValue.match(/\d/g)?.length < 8
    ) {
      console.log('here');
      this.setState({ phoneError: 'Invalid Phone Number' });
      errors.phoneNumber = 'Invalid Phone Number';
    } else this.setState({ phoneError: '' });

    ['userName', 'phoneNumber', 'password', 'confirmPassword'].forEach(
      (name) => {
        let value = this[name]?.value();

        if (!value) {
          errors[name] = 'Should not be empty';
        } else {
          if (name === 'phoneNumber') {
          } else if (
            (name === 'password' || name === 'confirmPassword') &&
            value?.length != 4
          ) {
            errors[name] = 'Should be 4 digits';
          }
        }
      },
    );

    const { password, confirmPassword, phoneNumber } = this.state;
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Not match with password';
    }

    this.setState({ errors });

    const errorCount = Object.keys(errors).length;
    console.log(errorCount);
    if (errorCount < 2) {
      this.signInWithPhoneNumber(phoneNumber)
        .then((confirmation) =>
          confirmation?.confirm
            ? this.setState({ visible: true, confirmation })
            : null,
        )
        .catch((error) => {
          this.setState({ visible: false });
          Alert.alert(error.message);
        });
    }
  };

  proceedToSignUp = () => {
    const { password, userName, phoneNumber } = this.state;

    const params = {
      username: userName,
      phone: phoneNumber,
      password: password,
      userType: 1,
    };

    global.showForcePageLoader(true);

    RestAPI.signup(params, (json, err) => {
      global.showForcePageLoader(false);

      if (err !== null) Helper.alertNetworkError(err?.message);
      else {
        if (json.status === 201) {
          global.me = json.data || {};
          Helper.setLocalValue(Constants.KEY_USER, JSON.stringify(global.me));
          success(Constants.SUCCESS_TITLE, 'Success to signup');
          this.props.navigation.navigate('signin');
        } else {
          Alert.alert(Constants.ERROR_TITLE, json.error);
        }
      }
    });
  };

  onTerm = () => {
    const url = 'http://www.stars.limited/terms-and-conditions';
    Linking.openURL(url);
  };

  onPrivacy = () => {
    const url = 'http://www.stars.limited/privacy-policy';
    Linking.openURL(url);
  };

  PromptModal = () => (
    <Dialog.Container visible={this.state.visible}>
      <Dialog.Title>SMS Code</Dialog.Title>
      <Dialog.Description>
        Enter the 6 digits Code you recieved
      </Dialog.Description>
      <Dialog.Input
        style={{ color: 'black' }}
        onChangeText={(code) => this.setState({ code })}
      />
      <Dialog.Button
        onPress={() => {
          this.state?.confirmation
            ?.confirm(this.state?.code)
            .then(this.proceedToSignUp)
            .catch((err) => Alert.alert(err.message));

          this.setState({ visible: false });
        }}
        label="Ok"
      />
      <Dialog.Button
        onPress={() => this.setState({ visible: false })}
        label="Cancel"
      />
    </Dialog.Container>
  );

  render() {
    return (
      <>
        {this.PromptModal()}
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
            {this._renderBottom()}
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
        <Text style={GStyles.titleText}>Hi, create your account</Text>
        <View
          style={[
            GStyles.titleDescription,
            GStyles.rowContainer,
            { marginTop: 20 },
          ]}
        >
          <Text style={GStyles.regularText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('signin');
            }}
          >
            <Text
              style={[
                GStyles.regularText,
                { color: GStyle.linkColor, paddingLeft: 5 },
              ]}
            >
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  _renderInput = () => {
    let {
      errors = {},
      userName,
      phoneNumber,
      password,
      confirmPassword,
      secureTextEntry,
    } = this.state;

    return (
      <>
        <PhoneInput
          ref={this.phoneNumberRef}
          defaultCode="BD"
          layout="first"
          onChangeText={(txt) => this.setState({ phoneValue: txt })}
          value={phoneNumber}
          onChangeFormattedText={(txt) => this.setState({ phoneNumber: txt })}
          withDarkTheme
          containerStyle={{
            marginTop: 50,
            width: '100%',
            borderBottomColor: this.state.phoneError ? 'red' : 'lightgrey',
            borderBottomWidth: 1,
          }}
        />
        <Text style={{ color: 'red', fontSize: 12 }}>
          {this.state.phoneError}
        </Text>
        <TextField
          ref={this.userNameRef}
          autoCorrect={false}
          autoCapitalize="none"
          enablesReturnKeyAutomatically={true}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitUserName}
          returnKeyType="next"
          label="Username"
          value={userName}
          error={errors.userName}
          containerStyle={{ marginTop: 8 }}
        />
        {/* <TextField
          ref={this.phoneNumberRef}
          keyboardType="phone-pad"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitPhoneNumber}
          returnKeyType="next"
          label="Phone Number"
          value={phoneNumber}
          error={errors.phoneNumber}
          containerStyle={{ marginTop: 8 }}
        /> */}
        <TextField
          ref={this.passwordRef}
          keyboardType="number-pad"
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          //clearTextOnFocus={true}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitPassword}
          returnKeyType="next"
          label="Pin"
          value={password}
          error={errors.password}
          renderRightAccessory={this.renderPasswordAccessory}
          maxLength={4}
          containerStyle={{ marginTop: 8 }}
        />
        <TextField
          ref={this.confirmPasswordRef}
          keyboardType="number-pad"
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          //clearTextOnFocus={true}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitConfirmPassword}
          returnKeyType="done"
          label="Confirm Pin"
          value={confirmPassword}
          error={errors.confirmPassword}
          maxLength={4}
          containerStyle={{ marginTop: 8 }}
        />
      </>
    );
  };

  _renderButton = () => {
    return (
      <View style={{ marginVertical: 50 }}>
        <TouchableOpacity onPress={this.onSubmit}>
          <View style={GStyles.buttonFill}>
            <Text style={GStyles.textFill}>Sign Up</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  _renderBottom = () => {
    return (
      <View style={{ height: 50 }}>
        <Text
          style={{
            fontFamily: 'GothamPro',
            fontSize: 13,
            lineHeight: 22,
            color: GStyle.grayColor,
          }}
        >
          By signing up, you agree to Stars
        </Text>
        <View style={GStyles.rowCenterContainer}>
          <TouchableOpacity onPress={this.onTerm}>
            <Text
              style={{
                fontFamily: 'GothamPro',
                fontSize: 13,
                lineHeight: 22,
                color: GStyle.linkColor,
                paddingLeft: 5,
              }}
            >
              Term of Service
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: 'GothamPro',
              fontSize: 13,
              lineHeight: 22,
              color: GStyle.grayColor,
              paddingLeft: 5,
            }}
          >
            and
          </Text>
          <TouchableOpacity onPress={this.onPrivacy}>
            <Text
              style={{
                fontFamily: 'GothamPro',
                fontSize: 13,
                lineHeight: 22,
                color: GStyle.linkColor,
                paddingLeft: 5,
              }}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({});

export default SignupScreen;
