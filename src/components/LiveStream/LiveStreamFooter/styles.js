import { StyleSheet } from 'react-native';
import GStyle, { GStyles } from '../../../utils/Global/Styles';

const styles = StyleSheet.create({
  messageInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: 44,
    paddingHorizontal: 15,
    borderRadius: 32,
    flex: 1,
  },
  textInput: {
    flex: 1,
    ...GStyles.textSmall,
  },
  wrapIconSend: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconSend: {
    width: 24,
    height: 24,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    padding: 10,
    overflow: 'hidden',
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
  container: {
    position: 'absolute',
    bottom: 16,
    zIndex: 9,
    width: '100%',
    paddingHorizontal: 16,
  },
});

export default styles;
