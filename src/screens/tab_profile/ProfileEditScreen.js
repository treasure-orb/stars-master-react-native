import React from 'react';
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

import { TextField } from '../../lib/MaterialTextField/index';
import {
  Constants,
  Global,
  GStyle,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';
import GHeaderBar from '../../components/GHeaderBar';
import Avatar from '../../components/elements/Avatar';
import avatars from '../../assets/avatars';
import { setMyUserAction } from '../../redux/me/actions';

class ProfileEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  init = () => {
    const { user } = this.props;
    const isGuest = user?.userType === 0;
    this.state = {
      secureTextEntry: !global.debug,
      userName: user?.username,
      displayName: user?.displayName,
      phoneNumber: user?.phone,
      password: '',
      profilePhotoSelSource: null,
      photo: null,
      isGuest,
    };
    this.initRef();
  };

  initRef = () => {
    this.userNameRef = (ref) => {
      this.userName = ref;
    };
    this.displayNameRef = (ref) => {
      this.displayName = ref;
    };
    this.phoneNumberRef = (ref) => {
      this.phoneNumber = ref;
    };
    this.passwordRef = (ref) => {
      this.password = ref;
    };
  };

  onFocus = () => {
    let { errors = {} } = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref?.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({ errors });
  };

  onChangeText = (text) => {
    ['userName', 'displayName', 'phoneNumber', 'password']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref?.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  };

  onSubmitUserName = () => {
    this.phoneNumber?.focus();
  };

  onSubmitDisplayName = () => {
    this.phoneNumber?.focus();
  };

  onSubmitPhoneNumber = () => {
    this.password?.focus();
  };

  onSubmitPassword = () => {
    this.password?.blur();
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

  onSubmit = async () => {
    const {
      userName,
      phoneNumber,
      displayName,
      password,
      profilePhotoSelSource,
      isGuest,
    } = this.state;

    let errors = {};

    if (!isGuest && !userName) {
      errors.userName = 'user name should not be empty';
    }

    const isValidPhoneNumber = Helper.validatePhoneNumber(phoneNumber);
    if (!isValidPhoneNumber && !isGuest) {
      errors.phoneNumber = 'Phone Number is invalid';
    }

    if (isGuest && !displayName) {
      errors.displayName = 'display name Should not be empty';
    }

    if (password.length > 0 && password.length !== 4) {
      errors.password = 'Should be 4 digits';
    }

    if (password && isGuest) {
      errors.password = 'Guest user can not set password.';
    }

    this.setState({ errors });

    const errorCount = Object.keys(errors).length;
    if (errorCount < 1) {
      global.showForcePageLoader(true);
      let uploadedUrl;
      if (profilePhotoSelSource) {
        try {
          uploadedUrl = await Global.uploadToCloudinary(
            profilePhotoSelSource,
            'permanent/avatars',
          );
        } catch (error) {
          console.log(error);
        }
      }
      this.setState({ photo: uploadedUrl });

      const params = {
        user_id: global.me?.id,
        username: isGuest ? undefined : userName,
        displayName,
        phone: phoneNumber,
        password: isGuest ? undefined : password,
        photo: uploadedUrl,
      };

      RestAPI.update_profile_with_image(params, (json, err) => {
        global.showForcePageLoader(false);

        if (err !== null) {
          global.error(Constants.ERROR_TITLE, 'Failed to update your profile');
        } else {
          if (json.status === 200 || json.data) {
            global.me = json.data;
            this.props.setMyUserAction(json.data);
            Helper.setLocalValue(Constants.KEY_USERNAME, userName);
            Helper.setLocalValue(
              Constants.KEY_PASSWORD,
              isGuest ? userName : password,
            );
            Helper.setLocalValue(Constants.KEY_USER, JSON.stringify(global.me));
            global.success(
              Constants.SUCCESS_TITLE,
              'Success to update your profile',
            );
          } else {
            global.error(
              Constants.ERROR_TITLE,
              'Failed to update your profile',
            );
          }
        }
      });
    }
  };

  onPressProfilePhoto = async () => {
    const granted = await Global.checkPermissionsForStorage();
    if (granted) {
      launchImageLibrary(
        {
          height: 300,
          width: 300,
          mediaType: 'photo',
        },
        (response) => {
          if (response.didCancel) {
          } else if (response.errorMessage) {
          } else {
            const source = {
              uri: response.uri,
              type: response.type,
              name: response.fileName,
            };
            this.setState({
              profilePhotoSelSource: source,
              photo: null,
            });
          }
        },
      );
    } else {
      global.warning('Warning', 'Permission is denied.');
    }
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  onTerm = () => {
    const url = 'http://www.stars.limited/terms-and-conditions';
    Linking.openURL(url);
  };

  onPrivacy = () => {
    const url = 'http://www.stars.limited/privacy-policy';
    Linking.openURL(url);
  };

  render() {
    return (
      <>
        <SafeAreaView style={GStyles.container}>
          {this._renderHeader()}
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={GStyles.elementContainer}
          >
            {this._renderAvartar()}
            {this._renderMainInputs()}
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
        headerTitle="Edit Profile"
        leftType="back"
        onPressLeftButton={this.onBack}
      />
    );
  };

  _renderAvartar = () => {
    const { profilePhotoSelSource } = this.state;
    const { user } = this.props;

    const randomNumber = Math.floor(Math.random() * avatars.length);
    const randomImageUrl = avatars[randomNumber];
    const avatarImage = profilePhotoSelSource
      ? profilePhotoSelSource
      : {
          uri: user?.photo ?? randomImageUrl,
        };

    return (
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <TouchableOpacity onPress={this.onPressProfilePhoto}>
          <Avatar image={avatarImage} size={106} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onPressProfilePhoto}>
          <Text
            style={[
              GStyles.regularText,
              { fontSize: 13, color: GStyle.linkColor, marginTop: 16 },
            ]}
          >
            Edit photo
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderMainInputs = () => {
    const {
      errors = {},
      userName,
      displayName,
      phoneNumber,
      password,
      secureTextEntry,
      isGuest,
    } = this.state;

    return (
      <View style={{ marginTop: 50 }}>
        {isGuest ? (
          <TextField
            ref={this.displayNameRef}
            autoCapitalize="none"
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            onFocus={this.onFocus}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmitDisplayName}
            returnKeyType="next"
            label="User Name"
            value={displayName}
            error={errors.displayName}
          />
        ) : (
          <TextField
            ref={this.userNameRef}
            autoCapitalize="none"
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            onFocus={this.onFocus}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmitUserName}
            returnKeyType="next"
            label="Username"
            value={userName}
            error={errors.userName}
          />
        )}
        {!isGuest && (
          <>
            <TextField
              ref={this.phoneNumberRef}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitPhoneNumber}
              returnKeyType="done"
              label="Phone Number"
              value={phoneNumber}
              error={errors.phoneNumber}
              containerStyle={{ marginTop: 8 }}
            />
            <TextField
              ref={this.passwordRef}
              keyboardType="number-pad"
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitPassword}
              returnKeyType="done"
              label="Pin"
              value={password}
              error={errors.password}
              renderRightAccessory={this.renderPasswordAccessory}
              maxLength={4}
              containerStyle={{ marginTop: 8 }}
            />
          </>
        )}
      </View>
    );
  };

  _renderButton = () => {
    return (
      <View style={{ ...GStyles.centerAlign }}>
        <View style={{ marginTop: 50 }}>
          <TouchableOpacity onPress={this.onSubmit}>
            <View style={GStyles.buttonFill}>
              <Text style={GStyles.textFill}>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderBottom = () => {
    return (
      <View style={{ height: 50 }}>
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

const styles = StyleSheet.create({
  buttonFill: {
    ...GStyles.rowCenterContainer,
    width: 137,
    height: 30,
    justifyContent: 'center',
    backgroundColor: GStyle.grayColor,
    borderRadius: 6,
  },

  textFill: {
    fontFamily: 'GothamPro-Medium',
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
  },
});

export default connect(
  (state) => ({
    user: state.me?.user || {},
  }),
  { setMyUserAction },
)(ProfileEditScreen);
