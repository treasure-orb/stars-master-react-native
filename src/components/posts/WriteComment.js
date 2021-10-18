import React, { useState } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import TextField from '../TextField';

import { GStyles } from '../../utils/Global/Styles';
import CachedImage from '../CachedImage';

const WriteSomething = ({ onPressComment }) => {
  const [comment, setComment] = useState('');

  const onPressSend = () => {
    onPressComment && onPressComment(comment);
    setComment('');
    Keyboard.dismiss();
  };

  const onChangeMessageText = (text) => setComment(text);

  return (
    <View style={styles.container}>
      <TextField
        style={styles.textInput}
        placeholder="Write a comment"
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
        onPress={onPressSend}
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    borderRadius: 24,
    marginRight: 12,
  },
  iconSend: {
    width: 24,
    height: 24,
  },
});

export default WriteSomething;
