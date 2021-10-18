import React from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from 'react-native-check-box';

import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';

import ProgressBar from '../../lib/Progress/Bar';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import { createThumbnail } from 'react-native-create-thumbnail';
import TagInput from '../../lib/react-native-tag-input/index';
import RNFS from 'react-native-fs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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

import { connect } from 'react-redux';
import { setCategories } from '../../redux/categories/actions';
import Video from 'react-native-video';
import { launchImageLibrary } from 'react-native-image-picker';

const WINDOW_WIDTH = Helper.getWindowWidth();

const inputProps = {
  keyboardType: 'default',
  placeholder: '',
  autoFocus: false,
  style: {
    ...GStyles.regularText,
    marginVertical: Platform.OS === 'ios' ? 10 : -2,
  },
};

class ProductUploadScreen extends React.Component {
  constructor(props) {
    super(props);

    this.init();
    this.setOpenCategoryDropdown = this.setOpenCategoryDropdown.bind(this);
    this.setOpenSubCategoryDropdown = this.setOpenSubCategoryDropdown.bind(
      this,
    );
    this.setCategories = this.setCategories.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.setSubCategories = this.setSubCategories.bind(this);
    this.setSubCategory = this.setSubCategory.bind(this);
  }

  componentDidMount() {
    if (global._prevScreen !== 'camera_preview') {
      this.onRefresh(global._videoUri);
    }
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBack,
    );
    this.refreshCategories();
  }

  componentWillUnmount() {
    this.backHandler?.remove();
  }

  refreshCategories = () => {
    const { isFetching } = this.state;
    if (isFetching) {
      return;
    }
    let params = {
      user_id: global.me ? global.me?.id : '',
    };
    global.showForcePageLoader(true);
    RestAPI.get_product_categories(params, (json, error) => {
      this.setState({ isFetching: false });
      global.showForcePageLoader(false);

      if (error !== null) {
        Helper.alertNetworkError(error?.message);
      } else {
        if (json.status === 200) {
          const response = json.data || [];
          this.props.setCategories(response);
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ): void {
    if (prevProps.categories !== this.props.categories) {
      const categories = this.props.categories
        ?.filter((category) => !category.parent)
        ?.map((category) => ({
          label: category?.title,
          value: category?.id,
        }));
      this.setState({ categories });
    }

    if (prevState.category !== this.state.category) {
      const subCategories = this.props.categories
        .filter((category) => category.parent?.id === this.state.category)
        .map((category) => ({
          label: category?.title,
          value: category?.id,
        }));
      this.setState({ subCategories });
    }
  }

  setOpenCategoryDropdown(open) {
    this.setState({
      openCategoryDropdown: open,
      zIndexCategory: open ? 9999 : 999,
      zIndexSubCategory: open ? 999 : 9999,
    });
  }

  setCategory(callback) {
    this.setState((state) => ({
      category: callback(state.category),
    }));
  }

  setCategories(callback) {
    this.setState((state) => ({
      categories: callback(state.categories),
    }));
  }

  setOpenSubCategoryDropdown(open) {
    this.setState({
      openSubCategoryDropdown: open,
      zIndexSubCategory: open ? 9999 : 999,
      zIndexCategory: open ? 999 : 9999,
    });
  }

  setSubCategory(callback) {
    this.setState((state) => ({
      subCategory: callback(state.subCategory),
    }));
  }

  setSubCategories(callback) {
    this.setState((state) => ({
      subCategories: callback(state.subCategories),
    }));
  }

  init = () => {
    this.state = {
      isVisibleProgress: false,
      isVisibleDialog: false,
      percent: 0,
      isPermanent: false,
      tags: [],
      text: '',
      price: '',
      description: '',
      category: null,
      categories: [],
      videoUri: '',
      thumbUri: '',
      duration: 0,
      loading: false,
      zIndexCategory: 9999,
      zIndexSubCategory: 9999,
      subCategory: null,
      subCategories: [],
      openCategoryDropdown: false,
      openSubCategoryDropdown: false,
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
          this.saveDraft();
        })
        .catch((err) => {
          global.showForcePageLoader(false);
          global._thumbUri = null;
          this.setState({ thumbUri: '' });
          global.error(Constants.ERROR_TITLE, 'Failed to create thumbnail');
        });
    }
  };

  initRef = () => {
    this.priceRef = (ref) => {
      this.price = ref;
    };
    this.descriptionRef = (ref) => {
      this.description = ref;
    };
  };

  saveDraft = async () => {
    try {
      const videoDraft = await Helper.getLocalValue(Constants.KEY_VIDEO_DRAFT);
      let videoArray = [];
      if (videoDraft != null) {
        videoArray = JSON.parse(videoDraft);
      }

      let filename = Helper.getFile4Path(global._videoUri);
      const videoDraftPath =
        'file://' + Helper.getDraftDirectoryPath() + filename;
      RNFS.moveFile(global._videoUri, videoDraftPath);
      filename = Helper.getFile4Path(global._thumbUri);
      global._videoUri = videoDraftPath;
      const thumbDraftPath =
        Platform.OS === 'ios'
          ? Helper.getDraftDirectoryPath() + filename
          : 'file://' + Helper.getDraftDirectoryPath() + filename;
      RNFS.moveFile(global._thumbUri, thumbDraftPath);
      global._thumbUri = thumbDraftPath;

      const itemDatas = [
        ...videoArray,
        { video: videoDraftPath, thumb: thumbDraftPath },
      ];
      await Helper.setLocalValue(
        Constants.KEY_VIDEO_DRAFT,
        JSON.stringify(itemDatas),
      );
      this.setState({
        videoUri: videoDraftPath,
      });
    } catch (e) {
      // error reading value
    }
  };

  uploadVideoToBackend = () => {
    const {
      tags,
      price,
      description,
      uploadedThumbUrl,
      uploadedVideoUrl,
      category,
      subCategory,
      isPermanent,
    } = this.state;

    if (!uploadedThumbUrl || !uploadedVideoUrl) {
      alert('Resource not found.');
    }

    global.showForcePageLoader(true);
    const tagSet = tags.join(',');
    const params = {
      userId: global.me?.id,
      url: uploadedVideoUrl,
      thumb: uploadedThumbUrl,
      tags: tagSet,
      price: parseInt(price, 10) || 0,
      description: description,
      number: (Number(global.me?.uploadCount || 0) + 1).toString(),
      category,
      subCategory,
      isPermanent,
    };
    RestAPI.add_video(params, async (json, err) => {
      global.showForcePageLoader(false);
      if (err !== null) {
        global.error(Constants.ERROR_TITLE, 'Failed to upload video1');
        if (global._prevScreen === 'camera_main') {
          this.props.navigation.goBack();
        } else {
          this.props.navigation.navigate('camera_draft');
        }
      } else {
        if (json.status === 201) {
          if (global.me) {
            global.me.uploadCount = Number(global.me?.uploadCount || 0) + 1;
          }
          global.success(Constants.SUCCESS_TITLE, 'Success to upload video');
          await this.deleteVideo();
          if (global._prevScreen === 'camera_main') {
            this.props.navigation.goBack();
          } else {
            this.props.navigation.navigate('camera_draft');
          }
        } else {
          global.error(Constants.ERROR_TITLE, 'Failed to upload video2');
          if (global._prevScreen === 'camera_main') {
            this.props.navigation.goBack();
          } else {
            this.props.navigation.navigate('camera_draft');
          }
        }
      }
    });
  };

  deleteVideo = async () => {
    RNFS.unlink(global._videoUri);
    RNFS.unlink(global._thumbUri);

    try {
      const videoDraft = await Helper.getLocalValue(Constants.KEY_VIDEO_DRAFT);
      let videoArray = [];
      if (videoDraft != null) {
        videoArray = JSON.parse(videoDraft);
      }

      let matchIndex = -1;
      for (const index in videoArray) {
        if (videoArray[index].video == global._videoUri) {
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

      global._videoUri = '';
      global._thumbUri = '';
      this.setState({ videoUri: '' });
    } catch (e) {
      // error reading value
    }
  };

  onChangeTags = (tags) => {
    this.setState({ tags });
  };

  onChangeTagText = (text) => {
    const lastTyped = text.charAt(text.length - 1);
    const parseWhen = [',', ' ', ';', '\n'];

    if (text.length === 1) {
      if (parseWhen.indexOf(text.charAt(0)) > -1) {
        return;
      }
    }

    this.setState({ text });

    if (parseWhen.indexOf(lastTyped) > -1) {
      this.setState({
        tags: [...this.state.tags, this.state.text],
        text: '',
      });
    }
  };

  onBlurTagInput = () => {
    const { text } = this.state;

    const newText = text + ',';
    this.onChangeTagText(newText);
    setTimeout(() => {
      Keyboard.dismiss();
    }, 200);
  };

  labelExtractor = (tag) => tag;

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
    ['price', 'description']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  };

  onSubmitPrice = () => {
    this.description.focus();
  };

  onPressPreview = () => {
    global._prevScreen = 'product_upload';
    this.props.navigation.navigate('camera_preview');
  };

  onPressDraft = () => {
    this.props.navigation.navigate('camera_draft');
  };

  setPermanent = (isPermanent) => {
    this.setState({
      isPermanent,
    });
  };

  onPressUploadVideo = async () => {
    const { isPermanent, duration } = this.state;
    this.setState({ isVisibleDialog: false });

    if (global.me?.isBannedProduct) {
      alert('You are not allowed to post products');
      return;
    }

    if (duration === 0 && global._prevScreen === 'my_products') {
      global.warning('Warning', 'Invalid video.');
      return;
    }
    if (duration > 30 && global._prevScreen === 'my_products') {
      global.warning(
        'Warning',
        'Sorry the video is too long, max duration is 30 secs.',
      );
      return;
    }
    let imageName = Helper.getFile4Path(global._thumbUri);
    const imageSource = {
      uri: global._thumbUri,
      name: imageName,
      type: 'image/jpeg',
    };
    const videoName = Helper.getFile4Path(global._videoUri);
    const videoSource = {
      uri: global._videoUri,
      name: videoName,
      type: 'video/mp4',
    };
    global.showForcePageLoader(true);
    const uploadedThumbUrl = await Global.uploadToCloudinary(
      imageSource,
      isPermanent ? 'permanent/productImages' : 'temporary/productImages',
    );
    if (uploadedThumbUrl) {
      const uploadedVideoUrl = await Global.uploadToCloudinary(
        videoSource,
        isPermanent ? 'permanent/products' : 'temporary/products',
        true,
      );
      if (uploadedVideoUrl) {
        this.setState(
          {
            uploadedThumbUrl,
            uploadedVideoUrl,
          },
          this.uploadVideoToBackend,
        );
      }
    }
    global.showForcePageLoader(false);
  };

  onLoad = (data) => {
    const duration = data?.duration || 0;
    this.setState({ loading: false, duration });
  };

  onPressCancelUpload = () => {
    this.setState({ isVisibleDialog: false });
  };

  onSubmit = () => {
    const { tags } = this.state;
    let errors = {};

    if (global.me?.userType === 0) {
      global.warning(Constants.WARNING_TITLE, 'Guest can not upload video.');
      return;
    }

    if (!global.me) {
      this.props.navigation.navigate('signin');
      return;
    }

    if (tags.length < 1) {
      Alert.alert('Please input tag');
      return;
    }

    ['price'].forEach((name) => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'Should not be empty';
      }
    });

    this.setState({ errors });

    const errorCount = Object.keys(errors).length;
    if (errorCount < 1) {
      this.setState({ isVisibleDialog: true });
    }
  };

  onBack = () => {
    const { isVisibleProgress } = this.state;

    if (!isVisibleProgress) {
      this.props.navigation.goBack();
    }

    return true;
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
            this.onRefresh(response?.uri);
          }
        },
      );
    } else {
      global.warning('Warning', 'Permission is denied.');
    }
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

  render() {
    return (
      <>
        <SafeAreaView style={[GStyles.container, { paddingBottom: 36 }]}>
          {this._renderHeader()}
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            style={GStyles.elementContainer}
          >
            {this._renderVideo()}
            {this._renderTagInput()}
            {this._renderMainInputs()}
            {this._renderCategories()}
            {this._renderButtons()}
          </KeyboardAwareScrollView>
          {this._renderProgress()}
          {this._renderDialog()}
        </SafeAreaView>
      </>
    );
  }

  _renderHeader = () => {
    return (
      <GHeaderBar
        headerTitle="Video Upload"
        leftType="back"
        onPressLeftButton={this.onBack}
      />
    );
  };

  _renderCategories = () => {
    const {
      categories,
      subCategories,
      category,
      subCategory,
      openCategoryDropdown,
      openSubCategoryDropdown,
      zIndexCategory,
      zIndexSubCategory,
    } = this.state;

    return (
      <View>
        <Text
          style={{ ...GStyles.mediumText, marginTop: 20, marginBottom: 12 }}
        >
          Category
        </Text>
        <DropDownPicker
          loading={true}
          search={true}
          open={openCategoryDropdown}
          value={category}
          items={categories}
          setOpen={this.setOpenCategoryDropdown}
          setValue={this.setCategory}
          setItems={this.setCategories}
          zIndex={zIndexCategory}
          zIndexInverse={zIndexCategory}
        />
        <Text
          style={{ ...GStyles.mediumText, marginTop: 20, marginBottom: 12 }}
        >
          Sub Category
        </Text>
        <DropDownPicker
          open={openSubCategoryDropdown}
          value={subCategory}
          items={subCategories}
          setOpen={this.setOpenSubCategoryDropdown}
          setValue={this.setSubCategory}
          setItems={this.setSubCategories}
          zIndex={zIndexSubCategory}
          zIndexInverse={zIndexSubCategory}
        />
      </View>
    );
  };

  _renderTagInput = () => {
    const { tags } = this.state;

    return (
      <View
        style={{
          ...GStyles.borderBottom,
          flex: 1,
          marginTop: 30,
        }}
      >
        <Text style={{ ...GStyles.mediumText, marginTop: 20 }}>Tags</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#00000011',
            borderRadius: 10,
            marginTop: 8,
            paddingHorizontal: 8,
          }}
        >
          <TagInput
            value={tags}
            onChange={this.onChangeTags}
            labelExtractor={this.labelExtractor}
            text={this.state.text}
            onChangeText={this.onChangeTagText}
            onBlur={this.onBlurTagInput}
            tagColor="#888888"
            tagTextColor="white"
            tagContainerStyle={{ paddingHorizontal: 4, paddingVertical: 0 }}
            inputProps={inputProps}
            maxHeight={200}
          />
        </View>
      </View>
    );
  };

  _renderMainInputs = () => {
    const { errors = {}, price, description, isPermanent } = this.state;

    return (
      <View>
        <TextField
          ref={this.priceRef}
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={false}
          enablesReturnKeyAutomatically={true}
          onFocus={this.onFocus}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitPrice}
          returnKeyType="done"
          label="Price"
          value={price}
          error={errors.price}
          containerStyle={{ marginTop: 8 }}
        />
        <TextField
          ref={this.descriptionRef}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={this.onFocus}
          autoFocus={false}
          onChangeText={this.onChangeText}
          returnKeyType="next"
          label="Description"
          value={description}
          multiline={true}
          characterRestriction={120}
          error={errors.description}
        />
        <View style={styles.checkboxContainer}>
          <CheckBox
            isChecked={isPermanent}
            onClick={() => this.setPermanent(!isPermanent)}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Keep the product permanently</Text>
        </View>
      </View>
    );
  };

  _renderButtons = () => {
    const { videoUri, loading } = this.state;

    const disabled = loading || !videoUri;

    return (
      <View style={{ zIndex: -1 }}>
        <View style={{ marginTop: 50 }}>
          <TouchableOpacity onPress={this.onPressPreview}>
            <View style={GStyles.buttonFill}>
              <Text style={GStyles.textFill}>Preview</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity onPress={this.onPressDraft}>
            <View style={GStyles.buttonFill}>
              <Text style={GStyles.textFill}>Draft</Text>
            </View>
          </TouchableOpacity>
        </View>
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
              <Dialog.Title style={{ marginLeft: 4 }}>
                Video Upload
              </Dialog.Title>
            </View>
            <Dialog.Content>
              <Paragraph>
                ভিডিও আপলোড করার পর আপনি ভিডিও ডিলিট করতে পারবেন না. ৩০দিন পর
                ভিডিও অটো ডিলিট হয়ে যাবে!
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this.onPressUploadVideo}>Upload</Button>
              <Button onPress={this.onPressCancelUpload}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  };
}

const styles = {
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
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
};

const TProductUploadScreen = (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return (
    <ProductUploadScreen {...props} navigation={navigation} route={route} />
  );
};

export default connect(
  (state) => ({
    categories: state.categories?.categories,
  }),
  { setCategories },
)(TProductUploadScreen);
