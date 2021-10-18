import { StyleSheet } from 'react-native';
import { GStyles, Helper } from './../../../utils/Global';
import GStyle from '../../../utils/Global/Styles';

const screenWidth = Helper.getWindowWidth();
const giftSize = (screenWidth - 32) / 4;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flex: 1,
  },
  giftIcon: {
    aspectRatio: 1,
    height: giftSize / 1.75,
  },
  giftContainer: {
    marginBottom: 16,
    width: giftSize,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  diamondIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  sendButton: {
    height: 36,
    paddingHorizontal: 24,
    ...GStyles.centerAlign,
    backgroundColor: GStyle.activeColor,
    borderRadius: 120,
  },
  sendText: {
    ...GStyles.textSmall,
    color: GStyle.whiteColor,
    ...GStyles.semiBoldText,
  },
});

export default styles;
