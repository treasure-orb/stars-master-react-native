import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';

import { GStyles } from '../../utils/Global';
import CachedImage from '../CachedImage';

const ic_search = require('../../assets/images/Icons/ic_search.png');

export default class SearchBarItem extends Component {
  constructor(props) {
    super(props);

    this.state = { searchText: '' };
  }

  onSearchFilter(text) {
    this.setState({ searchText: text });
    this.props.onChangeText(text);
  }

  onSearchSubmit = () => {
    this.props.onSubmitText();
  };

  searchImage = () => {
    return <CachedImage source={ic_search} style={{ width: 16, height: 16 }} />;
  };

  render() {
    const { searchText } = this.props;

    return (
      <SearchBar
        lightTheme
        searchIcon={this.searchImage}
        onChangeText={(text) => this.onSearchFilter(text)}
        onClear={(text) => this.onSearchFilter('')}
        placeholder="Search"
        value={searchText}
        returnKeyType={'search'}
        onSubmitEditing={this.onSearchSubmit}
        autoCapitalize="none"
        inputStyle={GStyles.regularText}
        containerStyle={{
          ...GStyles.shadow,
          height: 48,
          backgroundColor: 'white',
          justifyContent: 'center',
          borderRadius: 32,
          borderTopWidth: 0,
          borderBottomWidth: 0,
        }}
        inputContainerStyle={{
          height: 44,
          borderRadius: 120,
          backgroundColor: 'white',
        }}
        rightIconContainerStyle={{ paddingLeft: 4 }}
      />
    );
  }
}

const styles = StyleSheet.create({});
