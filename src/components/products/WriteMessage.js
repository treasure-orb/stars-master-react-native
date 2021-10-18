import React, { useState } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import TextField from '../TextField';

import { GStyles } from '../../utils/Global/Styles';
import CachedImage from '../CachedImage';

const WriteMessage = ({ onPressSend }) => {
  const [comment, setComment] = useState('');

  const onPress = () => {
    onPressSend && onPressSend(comment);
    setComment('');
    Keyboard.dismiss();
  };

  const onChangeMessageText = (text) => setComment(text);

  return (
    <View style={styles.container}>
      <TextField
        style={styles.textInput}
        placeholder="Write a message"
        underlineColorAndroid="transparent"
        onChangeText={onChangeMessageText}
        value={comment}
        autoCapitalize="none"
        showSoftInputOnFocus={true}
        autoFocus={false}
        placeholderTextColor="#666"
      />
      <TouchableOpacity
        style={styles.wrapIconSend}
        onPress={onPress}
        activeOpacity={0.6}
      >
        <CachedImage
          source={require('../../assets/images/Icons/ico_send.png')}
          style={styles.iconSend}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GStyles.rowContainer,
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    height: 42,
    color: 'black',
    paddingHorizontal: 12,
    marginRight: 12,
  },
  iconSend: {
    width: 24,
    height: 24,
  },
});

export default WriteMessage;
