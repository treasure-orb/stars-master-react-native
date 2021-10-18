import React from 'react';
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { launchImageLibrary } from 'react-native-image-picker';

import ProgressBar from '../../lib/Progress/Bar';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import { createThumbnail } from 'react-native-create-thumbnail';
import RNFS from 'react-native-fs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import GHeaderBar from '../../components/GHeaderBar';
import { TextField } from '../../lib/MaterialTextField/index';
import {
  Constants,
  Global,
  GStyle,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';

import Video from 'react-native-video';

const WINDOW_WIDTH = Helper.getWindowWidth();

class PostUploadScreen extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    this.onRefresh(global._videoUri);

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBack,
    );
  }

  componentWillUnmount() {
    this.backHandler?.remove();
  }

  init = () => {
    this.state = {
      isVisibleProgress: false,
      isVisibleDialog: false,
      percent: 0,
      text: '',
      description: '',
      videoUri: '',
      thumbUri: '',
      duration: 0,
      loading: false,
    };
    this.initRef();
  };

  onRefresh = async (uri) => {
    const videoUri = await Global.openEditor(uri);
    if (videoUri) {
      global.showForcePageLoader(true);
      createThumbnail({ url: videoUri })
        .then((response) => {
          this.setState({ thumbUri: response.path, videoUri });
          global._thumbUri = response.path;
          global._videoUri = videoUri;
          global.showForcePageLoader(false);
        })
        .catch((err) => {
          global.showForcePageLoader(false);
          global._thumbUri = '';
          this.setState({ thumbUri: '' });
          global.error(Constants.ERROR_TITLE, 'Failed to create thumbnail');
        });
    }
  };

  initRef = () => {
    this.titleRef = (ref) => {
      this.title = ref;
    };
    this.descriptionRef = (ref) => {
      this.description = ref;
    };
  };

  onPressImport = async () => {
    const granted = await Global.checkPermissionsForStorage();
    if (granted) {
      launchImageLibrary(
        {
          height: 300,
          width: 300,
          mediaType: 'video',
        },
        async (response) => {
          if (response?.didCancel) {
          } else if (response?.errorMessage) {
          } else {
            try {
              this.onRefresh(response?.uri);
            } catch (error) {
              global.warning('Warning', 'Error while importing video.');
            }
          }
        },
      );
    } else {
      global.warning('Warning', 'Permission is denied.');
    }
  };

  uploadPostToBackend = () => {
    const {
      title,
      description,
      uploadedThumbUrl,
      uploadedVideoUrl,
    } = this.state;

    if (!uploadedThumbUrl || !uploadedVideoUrl) {
      alert('Resource not found.');
    }

    global.showForcePageLoader(true);
    const params = {
      userId: global.me?.id,
      url: uploadedVideoUrl,
      thumb: uploadedThumbUrl,
      title,
      description: description,
    };

    RestAPI.add_post(params, async (json, err) => {
      global.showForcePageLoader(false);
      if (err !== null) {
        global.error(Constants.ERROR_TITLE, 'Failed to post');
      } else {
        if (json.status === 201) {
          global.success(Constants.SUCCESS_TITLE, 'Success to post');
          await this.deleteVideo();
        } else {
          global.error(Constants.ERROR_TITLE, 'Failed to post');
        }
      }
      this.props.navigation.goBack();
    });
  };

  deleteVideo = async () => {
    try {
      const { thumbUri, videoUri } = this.state;
      RNFS.unlink(thumbUri);
      RNFS.unlink(videoUri);
    } catch (error) {}
    this.setState({ thumbUri: '', videoUri: '' });
  };

  onChangeText = (text) => {
    ['title', 'description']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  };

  onSubmitTitle = () => {
    this.description.focus();
  };

  onPressUploadPost = async () => {
    this.setState({ isVisibleDialog: false });

    if (global.me?.isBannedPost) {
      alert('You are not allowed to post posts');
      return;
    }
    const { thumbUri, videoUri, duration } = this.state;
    if (!videoUri || !thumbUri) {
      global.warning('Warning', 'Empty source.');
      return;
    }
    if (duration === 0 && global._prevScreen === 'my_posts') {
      global.warning('Warning', 'Invalid video.');
      return;
    }
    if (duration > 20 && global._prevScreen === 'my_posts') {
      global.warning(
        'Warning',
        'Sorry the video is too long, max duration is 20 secs.',
      );
      return;
    }
    let imageName = Helper.getFile4Path(thumbUri);
    const imageSource = {
      uri: thumbUri,
      name: imageName,
      type: 'image/jpeg',
    };
    const videoName = Helper.getFile4Path(videoUri);
    const videoSource = {
      uri: videoUri,
      name: videoName,
      type: 'video/mp4',
    };
    global.showForcePageLoader(true);
    const uploadedThumbUrl = await Global.uploadToCloudinary(
      imageSource,
      'permanent/postImages',
    );
    if (uploadedThumbUrl) {
      const uploadedVideoUrl = await Global.uploadToCloudinary(
        videoSource,
        'permanent/posts',
        true,
      );
      if (uploadedVideoUrl) {
        this.setState(
          {
            uploadedThumbUrl,
            uploadedVideoUrl,
          },
          this.uploadPostToBackend,
        );
      }
    }
    global.showForcePageLoader(false);
  };

  onPressCancelUpload = () => {
    this.setState({ isVisibleDialog: false });
  };

  onSubmit = () => {
    if (global.me?.userType === 0) {
      global.warning(Constants.WARNING_TITLE, 'Guest can not upload post.');
      return;
    }

    if (!global.me) {
      this.props.navigation.navigate('signin');
      return;
    }

    this.setState({ isVisibleDialog: true });
  };

  onBack = () => {
    const { isVisibleProgress } = this.state;

    if (!isVisibleProgress) {
      this.props.navigation.goBack();
    }

    return true;
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.container}>
          {this._renderHeader()}
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            {this._renderVideo()}
            <View style={{ paddingHorizontal: 16 }}>
              {this._renderMainInputs()}
              {this._renderButtons()}
            </View>
          </KeyboardAwareScrollView>
          {this._renderProgress()}
          {this._renderDialog()}
        </SafeAreaView>
      </>
    );
  }

  onLoad = (data) => {
    const duration = data?.duration || 0;
    this.setState({ loading: false, duration });
  };

  _renderVideo = () => {
    const { videoUri } = this.state;
    return (
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={this.onPressImport}
      >
        <View style={styles.videoSubContainer}>
          {!!videoUri && (
            <Video
              source={{ uri: videoUri }}
              repeat
              resizeMode="contain"
              posterResizeMode="contain"
              style={styles.video}
              onLoad={this.onLoad}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  _renderHeader = () => {
    return (
      <GHeaderBar
        headerTitle="Add Post"
        leftType="back"
        onPressLeftButton={this.onBack}
      />
    );
  };

  _renderMainInputs = () => {
    const { errors = {}, price, description } = this.state;

    return (
      <>
        <TextField
          ref={this.titleRef}
          //autoCapitalize="none"
          // autoCorrect={false}
          // autoFocus={false}
          enablesReturnKeyAutomatically={true}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitTitle}
          returnKeyType="next"
          label="Title"
          value={price}
        />
        <TextField
          ref={this.descriptionRef}
          //autoCapitalize="none"
          // autoCorrect={false}
          // autoFocus={false}
          onChangeText={this.onChangeText}
          returnKeyType="done"
          label="Description"
          value={description}
          multiline={true}
          characterRestriction={120}
        />
      </>
    );
  };

  _renderButtons = () => {
    const { videoUri, loading } = this.state;
    const disabled = loading || !videoUri;

    return (
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity onPress={this.onSubmit} disabled={disabled}>
          <View
            style={{
              ...GStyles.buttonFill,
              backgroundColor: GStyle.redColor,
            }}
          >
            <Text style={GStyles.textFill}>Upload</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  _renderProgress = () => {
    const { percent, isVisibleProgress } = this.state;

    return (
      <>
        {isVisibleProgress && (
          <>
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: 'black',
                opacity: 0.4,
                zIndex: 100,
                elevation: 10,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 101,
                elevation: 11,
              }}
            >
              <ProgressBar
                progress={percent * 0.01}
                width={WINDOW_WIDTH * 0.5}
                height={6}
                color={GStyle.activeColor}
                borderColor={'white'}
              />
              <Text
                style={{
                  ...GStyles.mediumText,
                  color: 'white',
                  marginTop: 10,
                }}
              >
                Uploading: {percent}%
              </Text>
            </View>
          </>
        )}
      </>
    );
  };

  _renderDialog = () => {
    const { isVisibleDialog } = this.state;

    return (
      <View>
        <Portal>
          <Dialog
            visible={isVisibleDialog}
            onDismiss={this.onPressCancelUpload}
          >
            <View style={{ ...GStyles.rowContainer }}>
              <FontAwesome
                name="warning"
                style={{
                  fontSize: 20,
                  color: '#f3430a',
                  marginLeft: 8,
                }}
              />
              <Dialog.Title style={{ marginLeft: 4 }}>Post Upload</Dialog.Title>
            </View>
            <Dialog.Content>
              <Paragraph>Are you sure?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this.onPressUploadPost}>Post</Button>
              <Button onPress={this.onPressCancelUpload}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 36,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoSubContainer: {
    elevation: 32,
    shadowOffset: {
      width: 2,
      height: 8,
    },
    shadowRadius: 12,
    shadowOpacity: 0.2,
    backgroundColor: 'black',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 250,
  },
  videoContainer: {
    marginVertical: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return <PostUploadScreen {...props} navigation={navigation} route={route} />;
};
