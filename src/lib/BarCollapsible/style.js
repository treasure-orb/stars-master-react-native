import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
  bar: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#333',
    flexDirection: 'row',
    height: 45,
  },

  barWrapper: {
    alignSelf: 'stretch',
  },

  icon: {
    width: 30,
  },

  title: {
    color: '#FFF',
    flex: 1,
    fontSize: 15,
    paddingLeft: 0,
  },
});
