import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FastImage from 'react-native-fast-image';
import { GStyles, Helper } from '../../utils/Global';

const WINDOW_WIDTH = Helper.getWindowWidth();
const ITEM_WIDTH = (WINDOW_WIDTH - 24 - 12) / 2;

const PostItem = ({ item, index, onPress, onLongPress }) => {
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
      <FastImage
        source={{
          uri: item?.thumb || '',
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />
      <View style={styles.infoWrapper}>
        <View style={{ flex: 1 }} />
        <View style={GStyles.rowBetweenContainer}>
          <View style={GStyles.stickerContainer}>
            <Text style={styles.textPrice}>{item?.title || 'no name'}</Text>
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
    width: '100%',
    aspectRatio: 1,
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

export default PostItem;
