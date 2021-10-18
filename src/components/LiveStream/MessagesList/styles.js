import { Dimensions, StyleSheet } from 'react-native';
import { GStyles } from '../../../utils/Global/Styles';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapListMessages: {
    height: screenWidth / 1.5,
    flex: 1,
    zIndex: 2,
    marginRight: 16,
  },
  chatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageItem: {
    flex: 1,
  },
  name: {
    ...GStyles.liveStreamChatSender,
  },
  content: {
    marginTop: 3,
    ...GStyles.liveStreamChatText,
  },
  giftIcon: {
    width: 36,
    height: 36,
  },
});

export default styles;
