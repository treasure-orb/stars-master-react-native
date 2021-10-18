import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import Loading from '../../../assets/lottie/floating.json';

const HeartShape = () => {
  // return (
  //   <CachedImage
  //     source={require('../../../assets/images/Icons/ico_heart.png')}
  //     style={{
  //       width: 40,
  //       height: 40,
  //     }}
  //   />
  // );
  // return (
  //   <MaterialIcon
  //     size={36}
  //     name={'heart'}
  //     color={'red'}
  //     suppressHighlighting={true}
  //   />
  // );
  return <LottieView source={Loading} autoPlay loop style={styles.lottie} />;
};

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    alignSelf: 'center',
  },
});

export default HeartShape;
