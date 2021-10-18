import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GStyle, GStyles } from '../../utils/Global';

export default SectionHeader = ({ title, count, onPress }) => (
  <View style={styles.titleContainer}>
    <View style={GStyles.rowContainer}>
      <Text style={[GStyles.mediumText, { fontSize: 17 }]}>{title}</Text>
      <Text
        style={[
          GStyles.regularText,
          { lineHeight: 17, color: GStyle.grayColor, marginLeft: 4 },
        ]}
      >
        {count}
      </Text>
    </View>

    {(() => {
      if (onPress) {
        return (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={onPress} style={GStyles.rowContainer}>
              <Text
                style={[
                  GStyles.mediumText,
                  { fontSize: 13, color: GStyle.activeColor },
                ]}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    })()}
  </View>
);

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginTop: 48,
  },

  rightArrowImage: {
    width: 12,
    height: 12,
    resizeMode: 'center',
    marginLeft: 4,
    marginBottom: 2,
  },
});
