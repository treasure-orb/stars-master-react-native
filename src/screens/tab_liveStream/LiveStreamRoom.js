import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GStyle, Helper } from '../../utils/Global';
import { GStyles } from '../../utils/Global/Styles';

import ic_speaker from '../../assets/images/Icons/ic_speaker.png';
import ic_eye from '../../assets/images/Icons/ic_eye.png';
import ic_group from '../../assets/images/Icons/ic_group.png';
import ico_play from '../../assets/images/Icons/ico_play.png';
import ic_audio_on from '../../assets/images/Icons/ic_audio_on.png';
import CachedImage from '../../components/CachedImage';

const WINDOW_WIDTH = Helper.getWindowWidth();
const ITEM_WIDTH = (WINDOW_WIDTH - 24 - 12) / 2;

const LiveStreamRoom = (props) => {
  const { room, index } = props;
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('view_live', { roomId: room?.id });
  };

  const streamModeIcon =
    room?.mode === 0 ? ico_play : room?.mode === 1 ? ic_audio_on : ic_group;
  const streamMode =
    room?.mode === 0
      ? 'Video-Live'
      : room?.mode === 1
      ? 'Audio-Live'
      : 'Multi-Guests';
  const thumbnail = room?.thumbnail || room?.user?.photo;
  const roomTitle = room?.topic || room?.roomName;
  const viewerCount = room?.people?.length || 0;

  return (
    <TouchableOpacity
      style={[styles.card, index % 2 === 0 && { marginRight: 0 }]}
      onPress={onPress}
    >
      <Image
        source={{ uri: thumbnail }}
        resizeMode="cover"
        style={styles.thumbnail}
      />
      <View style={styles.infoWrapper}>
        <View style={styles.top}>
          <View style={[styles.row, styles.multiGuest]}>
            <CachedImage source={streamModeIcon} style={styles.icons} />
            <Text style={styles.viewersCount}>{streamMode}</Text>
          </View>
          <View style={styles.row}>
            <CachedImage
              source={ic_eye}
              style={styles.icons}
              tintColor="white"
            />
            <Text style={styles.viewersCount}>{viewerCount}</Text>
          </View>
        </View>
        <View style={styles.bottom}>
          <View style={styles.row}>
            <CachedImage
              source={ic_speaker}
              style={styles.icons}
              tintColor="white"
            />
            <View style={{ flexShrink: 1 }}>
              <Text
                style={GStyles.textSmall}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {roomTitle}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: GStyle.greenColor,
    borderRadius: 6,
    marginHorizontal: 12,
    marginTop: 12,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
  },
  thumbnail: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  roomName: {
    fontWeight: '600',
    fontSize: 22,
  },
  infoWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'space-between',
    padding: 6,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottom: {
    flexDirection: 'row',
  },
  viewersCount: {
    ...GStyles.textExtraSmall,
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icons: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: 'white',
  },
  multiGuest: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
  },
  topic: {},
});

export default LiveStreamRoom;
