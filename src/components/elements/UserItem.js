import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GStyle, GStyles, Helper } from '../../utils/Global';
import CheckBox from '../../lib/Checkbox/index';
import Avatar from './Avatar';
import Flag from '../../lib/SvgFlagkit/Flag';
import CachedImage from '../CachedImage';

const ic_favorite_active = require('../../assets/images/Icons/ic_default_avatar.png');
const ic_favorite_inactive = require('../../assets/images/Icons/ic_default_avatar.png');
const ic_mini_star = require('../../assets/images/Icons/ic_default_avatar.png');
const ic_mini_hourly_rate = require('../../assets/images/Icons/ic_default_avatar.png');
const ic_membership_free = require('../../assets/images/Icons/ic_membership_free.png');
const ic_membership_basic = require('../../assets/images/Icons/ic_membership_basic.png');
const ic_membership_professional = require('../../assets/images/Icons/ic_membership_professional.png');
const ic_membership_business = require('../../assets/images/Icons/ic_membership_business.png');
const ic_membership_executive = require('../../assets/images/Icons/ic_membership_executive.png');
const ic_default_avatar = require('../../assets/images/Icons/ic_default_avatar.png');

const itemTypeColor = {
  Completed: '#0EAD69',
  Accepted: '#2574FF',
  Unconfirmed: '#FE9870',
  Declined: '#FA4169',
  Canceled: GStyle.grayColor,
};

const membershipImages = {
  Basic: ic_membership_free,
  'Basic+': ic_membership_basic,
  Professional: ic_membership_professional,
  Business: ic_membership_business,
  Executive: ic_membership_executive,
};

const UserItem = ({ item, onPress, onFavorite }) => {
  return (
    <View style={{ marginTop: 24 }}>
      <Avatar
        image={item.photo ? { uri: item.photo } : ic_default_avatar}
        size={80}
        status={item.status}
        containerStyle={styles.avatarContainer}
      />
      {item.job_status && (
        <View
          style={{
            ...GStyles.rowContainer,
            position: 'absolute',
            left: 90,
            top: 0,
          }}
        >
          <Text
            style={{
              fontFamily: 'GothamPro-Medium',
              fontSize: 13,
              color: itemTypeColor[Helper.capitalizeString(item.job_status)],
              marginLeft: 8,
            }}
          >
            {Helper.capitalizeString(item.job_status)}
          </Text>
          <Text
            style={{
              fontFamily: 'GothamPro',
              fontSize: 13,
              color: GStyle.grayColor,
              marginLeft: 8,
            }}
          >
            {item.leftTime}
          </Text>
        </View>
      )}
      <CachedImage
        source={membershipImages[item.package]}
        style={styles.tagImage}
      />

      <View style={[GStyles.shadow, { marginLeft: 16, marginTop: 16 }]}>
        <View style={styles.descriptionContainer}>
          <View style={GStyles.rowBetweenContainer}>
            <TouchableOpacity
              onPress={() => {
                onPress(item.user_id);
              }}
            >
              <Text style={[GStyles.mediumText, { lineHeight: 20 }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
            <CheckBox
              label={''}
              checkedImage={ic_favorite_active}
              uncheckedImage={ic_favorite_inactive}
              forceCheck={true}
              checked={
                item.is_favorite == 'true' || item.is_favorite === true
                  ? true
                  : false
              }
              onChange={(value) => {
                onFavorite(value.checked, item);
              }}
              checkboxStyle={[GStyles.image, { width: 16 }]}
            />
          </View>
          <Text
            numberOfLines={1}
            style={[GStyles.regularText, { fontSize: 13, marginTop: 6 }]}
          >
            {item.description}
          </Text>
          <View style={[GStyles.rowContainer, { marginTop: 10 }]}>
            {true && (
              <Flag id={item.country_code || ''} width={16} height={16} />
            )}
            <Text
              style={[GStyles.regularText, { fontSize: 13, marginLeft: 8 }]}
            >
              {item.location}
            </Text>
          </View>
          <View style={[GStyles.rowContainer, { marginTop: 10 }]}>
            <CachedImage
              source={ic_mini_star}
              style={[GStyles.image, { width: 16 }]}
              resizeMode="contain"
            />
            <Text
              style={[
                GStyles.regularText,
                { fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
              ]}
            >
              {item.review_score}
            </Text>
            <Text
              style={[
                GStyles.regularText,
                { fontSize: 11, color: GStyle.grayColor, marginLeft: 2 },
              ]}
            >
              ({item.review_count} reviews)
            </Text>
          </View>
          <View style={[GStyles.rowContainer, { marginTop: 10 }]}>
            <CachedImage
              source={ic_mini_hourly_rate}
              style={[GStyles.image, { width: 16 }]}
              resizeMode="contain"
            />
            <Text style={[GStyles.mediumText, { fontSize: 13, marginLeft: 8 }]}>
              {item.hourly_rate}/hr
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: 80,
    height: 80,
    zIndex: 99,
  },

  tagImage: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: 40,
    top: 92,
    zIndex: 99,
  },

  descriptionContainer: {
    marginLeft: 80,
    marginTop: 16,
    marginRight: 16,
    marginBottom: 16,
  },
});

export default UserItem;
