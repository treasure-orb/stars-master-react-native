import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GStyle, GStyles, Helper } from '../../utils/Global';
import Avatar from './Avatar';
import avatars from '../../assets/avatars';

const randomNumber = Math.floor(Math.random() * avatars.length);
const randomImageUrl = avatars[randomNumber];

const MessageRoomItem = ({ item, onPress }) => (
  <TouchableOpacity
    style={{
      marginTop: 24,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    }}
    onPress={() => {
      onPress(item);
    }}
  >
    <Avatar
      image={{ uri: item?.photo || randomImageUrl }}
      // status={item.opponent_status}
    />
    <View
      style={{
        marginLeft: 10,
        marginRight: 12,
        flex: 1,
      }}
    >
      <Text
        style={[GStyles.regularText, GStyles.boldText, GStyles.upperCaseText]}
      >
        {item?.userType === 0 ? item?.displayName : item?.username}
      </Text>
      <View style={{ ...GStyles.rowBetweenContainer, marginTop: 5 }}>
        <Text
          numberOfLines={1}
          style={{
            width: '70%',
            fontFamily: 'GothamPro',
            fontSize: 13,
            color: GStyle.grayColor,
            lineHeight: 16,
          }}
        >
          {item?.lastMessage}
        </Text>
        <Text
          style={{
            fontFamily: 'GothamPro',
            fontSize: 13,
            color: GStyle.grayColor,
          }}
        >
          {Helper.getPastTimeString(item.lastMessagedAt)} ago
        </Text>
      </View>
    </View>
    {item.unreadCount > 0 && (
      <View style={styles.messageBadgeContainer}>
        <View style={styles.messageBadgeWrapper}>
          <Text style={[GStyles.textExtraSmall, GStyles.boldText]}>
            {item?.unreadCount}
          </Text>
        </View>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  messageBadgeContainer: {
    ...GStyles.rowEndContainer,
  },
  messageBadgeWrapper: {
    backgroundColor: 'red',
    borderRadius: 120,
    ...GStyles.centerAlign,
    width: 20,
    height: 20,
  },
});

export default MessageRoomItem;
