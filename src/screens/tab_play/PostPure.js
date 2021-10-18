import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Helper } from '../../utils/Global';

const WINDOW_WIDTH = Helper.getWindowWidth();
const CELL_WIDTH = (WINDOW_WIDTH - 32 - 10) / 3.0;

class PostPure extends PureComponent {
  render() {
    const { item, index, onPressPost } = this.props;

    const listItem = {
      alignItems: 'center',
      borderRadius: 4,
      marginBottom: 4,
      overflow: 'hidden',
    };

    return (
      <View
        key={index}
        style={[listItem, { marginLeft: index % 3 === 0 ? 0 : 5 }]}
      >
        <TouchableOpacity
          onPress={() => {
            onPressPost(item.id);
          }}
        >
          <FastImage
            source={{
              uri: item.thumb || '',
            }}
            resizeMode={FastImage.resizeMode.cover}
            style={{
              width: CELL_WIDTH,
              aspectRatio: 1,
              backgroundColor: '#ccc',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default PostPure;
