import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';

import PropTypes from 'prop-types';
//import Geolocation from '@react-native-community/geolocation';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { GStyle } from '../../utils/Global';

class MessageActions extends Component {
  constructor(props) {
    super(props);
    this._images = [];
    this.state = {};
  }

  setImages(images) {
    this._images = images;
  }

  onPressActions = () => {
    const options = [
      'Image From Library',
      'Take Photo',
      'Send Location',
      'Cancel',
    ];

    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            launchImageLibrary(
              {
                height: 300,
                width: 300,
                mediaType: 'photo',
                cameraType: 'front',
              },
              (response) => {
                this.props.onSend({
                  image: response.uri,
                });
              },
            );

            break;
          case 1:
            launchCamera(
              {
                height: 300,
                width: 300,
                mediaType: 'photo',
                cameraType: 'front',
              },
              (response) => {
                this.props.onSend({
                  image: response.uri,
                });
              },
            );
            break;
          case 2:
            // Geolocation.getCurrentPosition(
            //   (position) => {
            //     this.props.onSend({
            //       location: {
            //         latitude: position.coords.latitude,
            //         longitude: position.coords.longitude,
            //       },
            //     });
            //   },
            //   (error) => alert(error.message),
            //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
            // );
            break;
          default:
            break;
        }
      },
    );
  };

  render() {
    return (
      <>
        <TouchableOpacity
          style={{ ...styles.container, ...this.props.containerStyle }}
          onPress={this.onPressActions}
        >
          {this._renderIcon()}
        </TouchableOpacity>
      </>
    );
  }

  _renderIcon() {
    if (this.props.icon) {
      return this.props.icon();
    }
    return (
      <View
        style={{
          flex: 1,
          borderRadius: 13,
          borderColor: GStyle.activeColor,
          borderWidth: 2,
          ...this.props.wrapperStyle,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            color: GStyle.activeColor,
            ...this.props.iconTextStyle,
          }}
        >
          +
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
});

MessageActions.contextTypes = {
  actionSheet: PropTypes.func,
};

MessageActions.defaultProps = {
  onSend: () => {},
  options: {},
  icon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
};

MessageActions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  renderIcon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style,
};

export default MessageActions;
