import GHeaderBar from '../../components/GHeaderBar';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const Test = ({ navigation }) => {
  return (
    <View>
      <TouchableOpacity onPress={navigation.goBack}>
        <Text style={{ color: 'white' }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Test;
