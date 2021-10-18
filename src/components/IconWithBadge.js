import React from 'react';
import { Text, View } from 'react-native';

import { Icon } from 'react-native-elements';

export default class IconWithBadge extends React.Component {
  render() {
    const { name, type, badgeCount, color, size, isBadgeTextShow } = this.props;
    return (
      <View style={{ width: size, height: size, margin: 5 }}>
        <Icon name={name} size={size} color={color} type={type} />
        {badgeCount > 0 && (
          <View
            style={{
              // If you're using react-native < 0.57 overflow outside of the parent
              // will not work on Android, see https://git.io/fhLJ8
              position: 'absolute',
              right: 0,
              top: 0,
              backgroundColor: 'red',
              borderRadius: 7,
              paddingHorizontal: 4,
              width: 14,
              height: 14,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isBadgeTextShow && (
              <Text
                style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}
              >
                {badgeCount}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
}
