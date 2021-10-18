import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import avatars from '../../assets/avatars';
import Avatar from '../elements/Avatar';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

const randomNumber = Math.floor(Math.random() * avatars.length);
const randomImageUrl = avatars[randomNumber];

function CommentItem({ comment }) {
  const createdAt = comment?.createdAt
    ? new Date(comment.createdAt)
    : new Date();
  const postedAt = timeAgo.format(createdAt);
  const user = comment?.user;
  const description = comment?.description;
  const avatar = {
    uri: user?.photo ? user?.photo : randomImageUrl,
  };

  return (
    <TouchableOpacity style={styles.top}>
      <View style={styles.avatarContainer}>
        <Avatar image={avatar} size={36} />
      </View>
      <View style={styles.topCenter}>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{user.username}</Text>
        </View>
        {description.length !== 0 && (
          <Text style={styles.comment}>{description}</Text>
        )}
        <Text style={styles.date}>{postedAt}</Text>
      </View>
    </TouchableOpacity>
  );
}
export default CommentItem;

const styles = StyleSheet.create({
  comment: {
    fontSize: 12,
    fontFamily: 'GothamPro-Medium',
    color: '#292E3A',
  },
  topCenter: {
    flex: 1,
    marginLeft: 20,
  },
  date: {
    marginTop: 5,
    color: '#96AAC6',
    fontSize: 12,
    fontFamily: 'GothamPro-Medium',
    lineHeight: 20,
  },
  username: {
    fontFamily: 'GothamPro',
    color: '#21293D',
    fontWeight: '700',
    lineHeight: 24,
    fontSize: 14,
    marginRight: 10,
  },
  usernameContainer: {
    marginTop: -2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: 2,
    width: 35,
    height: 35,
    borderRadius: 18,
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    paddingTop: 15,
  },
});
