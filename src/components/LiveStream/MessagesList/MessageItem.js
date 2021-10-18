import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import CachedImage from '../../CachedImage';

const MessageItem = (props) => {
  const { message } = props;
  const { sender } = message;
  const senderName =
    sender?.userType === 0 ? sender?.displayName : sender?.username;
  const onPressProfileAction = () => {
    props.onPressProfileAction && props.onPressProfileAction(sender);
  };

  return (
    <View style={styles.chatItem}>
      <View style={styles.messageItem}>
        <TouchableOpacity onPress={onPressProfileAction}>
          <Text style={styles.name}>{senderName}</Text>
        </TouchableOpacity>
        <Text style={styles.content}>{message?.message}</Text>
      </View>
      {message?.giftIcon && (
        <CachedImage
          style={styles.giftIcon}
          source={{ uri: message.giftIcon }}
        />
      )}
    </View>
  );
};

MessageItem.propTypes = {
  data: PropTypes.shape({
    userName: PropTypes.string,
    message: PropTypes.string,
  }),
};
MessageItem.defaultProps = {
  data: {
    userName: '',
    message: '',
  },
};

export default MessageItem;
