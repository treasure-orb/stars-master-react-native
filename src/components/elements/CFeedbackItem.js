import React from 'react';
import { Image, Text, View } from 'react-native';

import { GStyle, GStyles } from '../../utils/Global';
import { AirbnbRating } from '../../lib/StarRating/index';

const ic_mini_dot = require('../../assets/images/ic_mini_dot.png');
const ic_mini_clock = require('../../assets/images/ic_mini_clock.png');
const ic_star = require('../../assets/images/ic_star_active.png');

const CFeedbackItem = ({ item, onPress }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image source={item.avatar} style={[GStyles.image, { width: 50 }]} />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <View style={[GStyles.rowBetweenContainer, { marginTop: 8 }]}>
        <Text style={GStyles.regularText}>{item.name}</Text>
        <AirbnbRating
          defaultRating={item.star}
          showRating={false}
          onFinishRating={this.ratingCompleted}
          style={{ paddingVertical: 10 }}
          isDisabled={true}
          starContainerStyle={{ width: 65, height: 15 }}
          size={10}
        />
      </View>
      <Text
        style={{
          fontFamily: 'GothamPro',
          fontSize: 12,
          color: GStyle.grayColor,
          marginTop: 4,
        }}
      >
        {item.date}
      </Text>
      <Text
        style={{
          width: '70%',
          fontFamily: 'GothamPro',
          fontSize: 13,
          color: GStyle.grayColor,
          lineHeight: 16,
          marginTop: 8,
        }}
      >
        {item.content}
      </Text>
    </View>
  </View>
);

export default CFeedbackItem;
