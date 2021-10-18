import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import ProgressBar from '../../lib/Progress/Bar';
import { RNCamera } from 'react-native-camera';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Constants, Global, GStyles, Helper } from '../../utils/Global';
import CachedImage from '../../components/CachedImage';

const ic_close = require('../../assets/images/Icons/ic_close.png');
const ic_camera_flip = require('../../assets/images/Icons/ic_camera_flip.png');
const ic_camera_flash_on = require('../../assets/images/Icons/ic_camera_flash_on.png');
const ic_camera_flash_off = require('../../assets/images/Icons/ic_camera_flash_off.png');
const ic_audio_on = require('../../assets/images/Icons/ic_audio_on.png');
const ic_audio_off = require('../../assets/images/Icons/ic_audio_off.png');

const WINDOW_WIDTH = Helper.getWindowWidth();

const flashModeOrder = {
  off: 'torch',
  torch: 'off',
};

class CameraMainScreen extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.init();
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      Helper.setDarkStatusBar();
    });
    this.requestCameraPermission();
  }

  requestCameraPermission = async () => {
    const granted = await Global.checkPermissionsForVideo();
    if (!granted) {
      Alert.alert(
        Constants.WARNING_TITLE,
        'Camera or Microphone permission is not granted. You can not record properly. Continue? ',
        [
          {
            text: 'NO',
            onPress: () => this.props.navigation.goBack(),
            style: 'cancel',
          },
          { text: 'YES', onPress: () => null },
        ],
      );
    }
  };

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.timer);
  }

  init = () => {
    const { maxDuration = 30, mode = 1 } = this.props.route?.params || {};

    this.state = {
      flash: 'off',
      mute: false,
      zoom: 0,
      autoFocus: 'on',
      autoFocusPoint: {
        normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
        drawRectPosition: {
          x: Dimensions.get('window').width * 0.5 - 32,
          y: Dimensions.get('window').height * 0.5 - 32,
        },
      },
      depth: 0,
      type: 'back',
      whiteBalance: 'auto',
      ratio: '16:9',
      maxDuration,
      mode,
      quality: RNCamera.Constants.VideoQuality['1080p'],
      isRecording: false,
      canDetectFaces: false,
      canDetectText: false,
      canDetectBarcode: false,
      faces: [],
      textBlocks: [],
      barcodes: [],

      isVisibleTimer: true,
      timerProgress: 0,
    };
  };

  onBack = () => {
    this.props.navigation.goBack();
  };

  onTick = async () => {
    const { timerProgress, maxDuration } = this.state;

    if (timerProgress >= maxDuration * 5) {
      this.onPressStopRecord();
      return;
    }

    this.setState({
      timerProgress: timerProgress + 1,
    });
  };

  onTakeVideo = (value) => {
    const { timerProgress, mode } = this.state;

    if (timerProgress < 50) {
      return;
    }

    global._videoUri = value;
    global._thumbUri = '';
    global._prevScreen = 'camera_main';
    this.props.navigation.navigate(
      mode === 1 ? 'product_upload' : 'post_upload',
      { videoUri: value },
    );
  };

  toggleFacing = () => {
    const { isRecording } = this.state;
    if (isRecording) {
      return;
    }

    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  };

  toggleFlash = () => {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  };

  toggleMute = () => {
    const { isRecording, mute } = this.state;
    if (isRecording) {
      return;
    }

    this.setState({
      mute: !mute,
    });
  };

  onPressStartRecord = async () => {
    const { isRecording, maxDuration, mute, quality } = this.state;
    const recordOptions = {
      //maxDuration: maxDuration,
      mute: mute,
      quality: quality,
    };
    if (this.camera && !isRecording) {
      try {
        const promise = this.camera.recordAsync(recordOptions);

        if (promise) {
          this.setState({ isRecording: true });
          clearInterval(this.timer);
          this.timer = setInterval(this.onTick, 200);
          const data = await promise;
          this.setState({ isRecording: false });
          clearInterval(this.timer);
          this.onTakeVideo(data.uri);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  onPressStopRecord = async () => {
    await this.camera.stopRecording();
    clearInterval(this.timer);
    this.setState({ isRecording: false });
  };

  render() {
    return (
      <>
        {Platform.OS === 'ios' && <SafeAreaView style={styles.statusBar} />}
        <SafeAreaView style={styles.container}>
          {this._renderCamera()}
        </SafeAreaView>
      </>
    );
  }

  _renderCamera() {
    return (
      <RNCamera
        ref={(ref) => {
          this.camera = ref;
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        faceDetectionLandmarks={undefined}
        onFacesDetected={null}
        onTextRecognized={null}
        onGoogleVisionBarcodesDetected={null}
        style={{ flex: 1 }}
      >
        {this._renderAll()}
      </RNCamera>
    );
  }

  _renderAll = () => {
    return (
      <View style={{ flex: 1 }}>
        {this._renderTimer()}
        {this._renderControls()}
        {this._renderRecording()}
      </View>
    );
  };

  _renderTimer = () => {
    const { isRecording, timerProgress } = this.state;

    return (
      <>
        {isRecording && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ProgressBar
              progress={timerProgress / 150}
              width={WINDOW_WIDTH * 0.5}
              height={6}
              color={'red'}
              borderColor={'white'}
            />
          </View>
        )}
      </>
    );
  };

  _renderControls = () => {
    const { flash, mute } = this.state;

    return (
      <View
        style={{
          width: '100%',
          height: 150,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 14,
          paddingHorizontal: 20,
          zIndex: 200,
        }}
      >
        <TouchableOpacity
          onPress={this.onBack}
          style={{ ...GStyles.centerAlign, width: 40, height: 40 }}
        >
          <CachedImage
            source={ic_close}
            style={{ ...GStyles.image, width: 20, tintColor: 'white' }}
            tintColor="white"
          />
        </TouchableOpacity>
        <View style={{ justifyContent: 'space-between', marginTop: 10 }}>
          <TouchableOpacity onPress={this.toggleFacing}>
            <CachedImage
              source={ic_camera_flip}
              style={{ ...GStyles.image, width: 28 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleFlash}>
            <CachedImage
              source={
                flash === 'torch' ? ic_camera_flash_on : ic_camera_flash_off
              }
              style={{ ...GStyles.image, width: 32 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleMute}>
            <CachedImage
              source={mute ? ic_audio_off : ic_audio_on}
              style={{ ...GStyles.image, width: 32 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderRecording = () => {
    const { isRecording } = this.state;
    const backgroundColor = isRecording ? 'white' : 'darkred';
    const action = isRecording
      ? this.onPressStopRecord
      : this.onPressStartRecord;
    const button = isRecording
      ? this._renderStopRecBtn()
      : this._renderRecBtn();
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: 'flex-end',
          zIndex: 100,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity
            style={{ ...styles.recordButton, ...styles.center }}
            onPress={() => action()}
          >
            {button}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderStopRecBtn() {
    return <FontAwesome name="stop" size={34} color={'#FF0000'} />;
  }

  _renderRecBtn() {
    return <View style={{ ...styles.record }} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  statusBar: {
    flex: 0,
    backgroundColor: 'black',
  },
  flipButton: {
    width: '33%',
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },

  recordButton: {
    height: 72,
    width: 72,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  record: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#FF0000',
  },
  center: {
    position: 'absolute',
    left: WINDOW_WIDTH / 2 - 36,
    bottom: 20,
  },
});

export default function (props) {
  let navigation = useNavigation();
  let route = useRoute();
  return <CameraMainScreen {...props} navigation={navigation} route={route} />;
}
