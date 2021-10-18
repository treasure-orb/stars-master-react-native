import React, { useState } from 'react';
import { View } from 'react-native';

import styles from './styles';
import TextField from '../../TextField';

const MessageBox = (props) => {
  const [message, setMessage] = useState('');

  const onPressSend = () => {
    const { onPressSendMessage } = props;
    onPressSendMessage(message);
    setMessage('');
  };

  const onChangeMessageText = (text) => setMessage(text);

  return (
    <View style={styles.messageInput}>
      <TextField
        style={styles.textInput}
        placeholder="Write a comment"
        underlineColorAndroid="transparent"
        onChangeText={onChangeMessageText}
        onSubmitEditing={onPressSend}
        value={message}
        autoCapitalize="none"
        showSoftInputOnFocus={true}
        autoFocus={false}
        placeholderTextColor="white"
      />
    </View>
  );
};

export default MessageBox;
