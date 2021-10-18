import React from 'react';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { GStyles } from '../../../utils/Global/Styles';
import CachedImage from '../../CachedImage';

const GradientIconButton = (props) => {
  const { icon, onPress, containerStyle, iconStyle } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={containerStyle}
      onPress={onPress}
    >
      <LinearGradient
        colors={[
          'rgba(200, 58, 132, 0.71)',
          'rgba(200, 58, 253, 0.71)',
          'rgba(200, 58, 132, 0.71)',
        ]}
        style={styles.gradient}
      >
        <CachedImage
          source={icon}
          style={[GStyles.actionIcons, iconStyle]}
          tintColor={'white'}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientIconButton;
