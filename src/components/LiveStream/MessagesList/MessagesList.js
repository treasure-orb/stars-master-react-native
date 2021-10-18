import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import styles from './styles';
import MessageItem from './MessageItem';

export default class MessagesList extends Component {
  renderItem = ({ item }) => (
    <MessageItem
      message={item}
      onPressProfileAction={this.props.onPressProfileAction}
    />
  );

  flatList = React.createRef();

  render() {
    const { messages } = this.props;

    return (
      <View style={styles.wrapListMessages}>
        <FlatList
          ref={this.flatList}
          data={messages}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          inverted
        />
      </View>
    );
  }
}

MessagesList.propTypes = {
  /* eslint-disable */
  messages: PropTypes.array,
};

MessagesList.defaultProps = {
  messages: [],
};
