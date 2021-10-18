import React, { Component } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { GStyle } from '../../../utils/Global';
import { GStyles } from '../../../utils/Global/Styles';
import diamond from './../../../assets/images/Icons/ic_diamond.png';
import { connect } from 'react-redux';
import CachedImage from '../../CachedImage';

class Gifts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      selectedGift: null,
    };
  }

  onPressSendGift = () => {
    const { onPressSendGift } = this.props;
    const { selectedGift } = this.state;
    selectedGift && onPressSendGift && onPressSendGift(selectedGift);
  };

  setSelectedGift = (selectedGift) => {
    this.setState({ selectedGift });
  };

  _renderItem = ({ item }) => {
    const { selectedGift } = this.state;
    return (
      <TouchableOpacity
        style={[
          styles.giftContainer,
          selectedGift?.id === item?.id && {
            backgroundColor: 'rgba(27, 242, 221, 0.2)',
          },
        ]}
        onPress={() => this.setSelectedGift(item)}
      >
        <CachedImage source={{ uri: item.icon }} style={styles.giftIcon} />
        <Text
          style={[GStyles.textSmall, { marginVertical: 8, color: 'black' }]}
        >
          {item.name}
        </Text>
        <View style={GStyles.rowContainer}>
          <CachedImage source={diamond} style={styles.diamondIcon} />
          <Text style={[GStyles.textExtraSmall, { color: GStyle.redColor }]}>
            {item.diamond || 0}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const gifts = this.props.gifts || [];
    const diamonds = this.props.user?.diamond || 0;
    const { selectedGift } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          onEndReachedThreshold={0.4}
          numColumns={4}
          data={gifts}
          renderItem={this._renderItem}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 60,
          }}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
        <View style={[GStyles.rowBetweenContainer, { marginTop: 16 }]}>
          <View style={{ flex: 1, ...GStyles.centerAlign }}>
            <Text style={[GStyles.regularText, GStyles.boldText]}>
              Your diamond: {diamonds}
            </Text>
          </View>
          {selectedGift && selectedGift?.diamond <= diamonds && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={this.onPressSendGift}
            >
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

export default connect(
  (state) => ({
    user: state.me?.user || {},
  }),
  {},
)(Gifts);
