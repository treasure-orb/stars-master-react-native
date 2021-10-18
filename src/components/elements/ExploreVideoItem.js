import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FastImage from 'react-native-fast-image';
import { Constants, GStyles, Helper } from '../../utils/Global';
import CachedImage from '../CachedImage';

const WINDOW_WIDTH = Helper.getWindowWidth();
const ITEM_WIDTH = (WINDOW_WIDTH - 24 - 12) / 2;

const ExploreVideoItem = ({ item, index, onPress, onLongPress }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(item);
      }}
      onLongPress={() => {
        onLongPress && onLongPress(item);
      }}
      style={[styles.container, index % 2 === 0 && { marginRight: 0 }]}
    >
      <CachedImage
        source={{
          uri: item?.thumb || '',
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />
      <View style={styles.infoWrapper}>
        <View style={GStyles.rowBetweenContainer}>
          <View style={{ flex: 1 }} />
          {item.sticker > 0 && (
            <View style={GStyles.stickerContainer}>
              <Text style={GStyles.stickerText}>
                {Constants.STICKER_NAME_LIST[item.sticker]}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1 }} />
        <View style={GStyles.rowBetweenContainer}>
          <View style={GStyles.rowContainer}>
            <View style={GStyles.stickerContainer}>
              <Text style={styles.textPrice}>৳ {item?.price || 0}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    ...GStyles.centerAlign,
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 8,
    elevation: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 6,
    shadowOpacity: 0.3,
  },
  image: {
    width: ITEM_WIDTH,
    aspectRatio: 1,
    backgroundColor: '#ccc',
  },
  icons: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  infoWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    padding: 6,
  },
  textPrice: {
    ...GStyles.textSmall,
    color: 'white',
  },
});

export default ExploreVideoItem;
