import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';

import Avatar from '../../components/elements/Avatar';
import avatars from '../../assets/avatars';
import { Global } from '../../utils/Global';
import GStyle, { GStyles } from '../../utils/Global/Styles';
import styles from './styles';

import ic_close from '../../assets/images/Icons/ic_close.png';
import CachedImage from '../../components/CachedImage';

const randomNumber = Math.floor(Math.random() * avatars.length);
const randomImageUrl = avatars[randomNumber];

const PanelLive = (props) => {
  const { onPressStart, liveStatus, mode } = props;
  const [topic, setTopic] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const onChangeText = (text) => setTopic(text);
  const onStart = async () => {
    global.showForcePageLoader(true);
    const uploadedUrl = await Global.uploadToCloudinary(
      thumbnail,
      'temporary/liveStreamImages',
    );
    global.showForcePageLoader(false);
    if (!uploadedUrl) {
      alert('Thumbnail required.');
      return;
    }
    onPressStart && onPressStart(topic, uploadedUrl, mode);
  };
  const onPressCloseAction = () => {
    const { onPressClose } = props;
    onPressClose && onPressClose();
  };

  const onPressThumbnail = async () => {
    const granted = await Global.checkPermissionsForStorage();
    if (granted) {
      launchImageLibrary(
        {
          height: 300,
          width: 300,
          mediaType: 'photo',
          cameraType: 'front',
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
            setThumbnail(source);
          }
        },
      );
    } else {
      global.warning('Warning', 'Permission is denied.');
    }
  };

  const avatar = { uri: thumbnail ? thumbnail.uri : randomImageUrl };

  return (
    <View style={style.container}>
      <View>
        <View style={[GStyles.rowEndContainer, { paddingHorizontal: 16 }]}>
          <TouchableOpacity onPress={onPressCloseAction}>
            <CachedImage
              style={[[GStyles.actionIcons, { tintColor: 'white' }]]}
              source={ic_close}
              tintColor="white"
            />
          </TouchableOpacity>
        </View>

        <View style={style.top}>
          <TouchableOpacity
            onPress={onPressThumbnail}
            style={style.thumbnailContainer}
          >
            <Avatar image={avatar} size={82} />
          </TouchableOpacity>
          <TextInput
            style={styles.topicInput}
            placeholder="Pick a topic to chat?"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="white"
            onChangeText={onChangeText}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={onStart}
        style={[
          styles.btnBeginLiveStream,
          { backgroundColor: GStyle.primaryColor },
        ]}
        disabled={liveStatus === -1}
      >
        <Text style={styles.beginLiveStreamText}>Go LIVE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PanelLive;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 72,
  },
  thumbnailContainer: {
    marginRight: 16,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
