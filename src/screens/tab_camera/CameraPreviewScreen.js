import React, { Component } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import RNFS from 'react-native-fs';

import Video from 'react-native-video';

import { Constants, GStyle, GStyles, Helper } from '../../utils/Global';
import CachedImage from '../../components/CachedImage';

const ic_close = require('../../assets/images/Icons/ic_close.png');

class CameraPreviewScreen extends Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    Helper.setDarkStatusBar();
    this.onRefresh();
  }

  componentWillUnmount() {}

  init = () => {
    this.state = {
      videoUri:
        global._prevScreen === 'camera_draft'
          ? global._draftVideoUri
          : global._videoUri,
    };
  };

  onRefresh = () => {};

  onBack = () => {
    this.props.navigation.goBack();
  };

  onVideoReadyForDisplay = (value) => {};

  onVideoBuffer = () => {};


  onVideoLoad = () => {};

  onVideoProgress = (value) => {};

  onPressUpload = () => {
    global._videoUri = global._draftVideoUri;
    global._thumbUri = global._draftThumbUri;
    global._prevScreen = 'camera_preview';
    this.props.navigation.navigate('product_upload');
  };

  onPressDelete = () => {
    Alert.alert(
      'Confirm',
      'Are you sure to delete this video?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.deleteVideo() },
      ],
      { cancelable: true },
    );
  };

  deleteVideo = async () => {
    RNFS.unlink(global._draftVideoUri);
    RNFS.unlink(global._draftThumbUri);

    try {
      const videoDraft = await Helper.getLocalValue(Constants.KEY_VIDEO_DRAFT);
      let videoArray = [];
      if (videoDraft != null) {
        videoArray = JSON.parse(videoDraft);
      }

      let matchIndex = -1;
      for (const index in videoArray) {
        if (videoArray[index].video == global._draftVideoUri) {
          matchIndex = index;
        }
      }
      if (matchIndex !== -1) {
        videoArray.splice(matchIndex, 1);
      }

      await Helper.setLocalValue(
        Constants.KEY_VIDEO_DRAFT,
        JSON.stringify(videoArray),
      );

      global._draftVideoUri = '';
      global._draftThumbUri = '';
    } catch (e) {
      // error reading value
    }

    this.props.navigation.navigate('camera_draft');
  };

  render() {
    return (
      <>
        {this._renderPreview()}
        {this._renderControls()}
        {this._renderButton()}
      </>
    );
  }

  _renderPreview = () => {
    const { videoUri } = this.state;

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <Video
          source={{ uri: videoUri }}
          resizeMode="contain"
          repeat
          paused={false}
          playWhenInactive={false}
          playInBackground={false}
          onReadyForDisplay={this.onVideoReadyForDisplay}
          onBuffer={this.onVideoBuffer}
          onLoad={this.onVideoLoad}
          onProgress={this.onVideoProgress}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: 'black',
          }}
        />
      </View>
    );
  };

  _renderControls = () => {
    const { flash } = this.state;

    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 100,
          marginTop: 14,
          paddingHorizontal: 10,
          zIndex: 1,
          elevation: 1,
        }}
      >
        <TouchableOpacity
          onPress={this.onBack}
          style={{
            ...GStyles.centerAlign,
            width: 40,
            height: 40,
            marginTop: 20,
          }}
        >
          <CachedImage
            source={ic_close}
            style={{ ...GStyles.image, width: 20, tintColor: 'white' }}
            resizeMode="contain"
            tintColor="white"
          />
        </TouchableOpacity>
      </View>
    );
  };

  _renderButton = () => {
    return (
      <>
        {global._prevScreen === 'camera_draft' && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: 50,
              bottom: 36,
              alignItems: 'center',
              paddingHorizontal: 10,
              zIndex: 1,
              elevation: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <TouchableOpacity onPress={this.onPressUpload}>
              <View style={styles.buttonBlank}>
                <Text style={styles.textBlank}>Upload</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onPressDelete}>
              <View style={styles.buttonFill}>
                <Text style={styles.textFill}>Delete</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };
}

const styles = StyleSheet.create({
  buttonBlank: {
    width: 120,
    height: 50,
    justifyContent: 'center',
    backgroundColor: GStyle.snowColor,
    borderWidth: 1,
    borderRadius: GStyle.buttonRadius,
    borderColor: GStyle.activeColor,
  },

  buttonFill: {
    width: 120,
    height: 50,
    justifyContent: 'center',
    borderRadius: GStyle.buttonRadius,
    backgroundColor: GStyle.redColor,
  },

  textBlank: {
    textAlign: 'center',
    color: GStyle.activeColor,
    fontSize: 16,
    fontWeight: 'bold',
  },

  textFill: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default function (props) {
  let navigation = useNavigation();
  let route = useRoute();
  return (
    <CameraPreviewScreen {...props} navigation={navigation} route={route} />
  );
}
