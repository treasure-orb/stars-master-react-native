import { StyleSheet } from 'react-native';
import { Helper } from '../../utils/Global';
import { GStyles } from '../../utils/Global/Styles';

const width = Helper.getWindowWidth();
const height = Helper.getWindowHeight();
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    marginTop: 24,
    zIndex: 999,
  },
  playerView: {
    position: 'absolute',
    top: 0,
    left: 0,
    height,
    width,
    backgroundColor: 'black',
  },
  streamerView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
  },
  audioLiveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    ...GStyles.centerAlign,
    width,
    height,
  },
  bottomGroup: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  btnBeginLiveStream: {
    borderRadius: 24,
    paddingVertical: 12,
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  beginLiveStreamText: {
    ...GStyles.regularText,
    fontWeight: '700',
    color: 'white',
  },
  wrapperStartPanel: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'black',
    zIndex: 9999,
  },
  topicInput: {
    ...GStyles.regularText,
    height: 48,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'white',
    textAlign: 'center',
    width: '75%',
    color: 'white',
  },
  sheetDragIcon: {
    width: 0,
    height: 0,
    padding: 0,
    margin: 0,
  },
  sheetWrapper: {
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  sheetCommonContainer: {
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetGiftContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: 'white',
    height: 360,
  },
});

export default styles;
