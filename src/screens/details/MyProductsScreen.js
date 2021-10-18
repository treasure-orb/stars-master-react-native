import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  NavigationContext,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';

import {
  Constants,
  GStyle,
  GStyles,
  Helper,
  RestAPI,
} from '../../utils/Global';
import GHeaderBar from '../../components/GHeaderBar';
import ProductsList from '../../components/elements/ProductsList';

class MyProductsScreen extends React.Component {
  static contextType = NavigationContext;

  constructor(props) {
    super(props);
    this.init();
  }

  componentDidMount() {
    this.onRefresh('init');
  }

  init = () => {
    this.state = {
      itemDatas: [],
      totalCount: 0,
      curPage: 1,
      isFetching: false,
      onEndReachedDuringMomentum: true,
    };

    this._selItem = null;
  };

  onRefresh = (type) => {
    let { isFetching, totalCount, curPage, itemDatas } = this.state;
    if (isFetching) {
      return;
    }

    if (type === 'more') {
      curPage += 1;
      const maxPage =
        (totalCount + Constants.COUNT_PER_PAGE - 1) / Constants.COUNT_PER_PAGE;
      if (curPage > maxPage) {
        return;
      }
    } else {
      curPage = 1;
    }

    this.setState({ curPage });
    if (type === 'init') {
      //global.showForcePageLoader(true);
    } else {
      this.setState({ isFetching: true });
    }

    let params = {
      user_id: global.me ? global.me?.id : '',
      me_id: global.me ? global.me?.id : '',
      page_number: type === 'more' ? curPage : '1',
      count_per_page: Constants.COUNT_PER_PAGE,
    };
    //global.showForcePageLoader(true);
    RestAPI.get_user_video_list(params, (json, err) => {
      if (type === 'init') {
        global.showForcePageLoader(false);
      } else {
        this.setState({ isFetching: false });
      }

      if (err !== null) {
        Helper.alertNetworkError(err?.message);
      } else {
        if (json.status === 200) {
          this.setState({ totalCount: json.data.totalCount });
          if (type === 'more') {
            let data = itemDatas.concat(json.data.videoList);
            this.setState({ itemDatas: data });
          } else {
            this.setState({ itemDatas: json.data.videoList });
          }
        } else {
          Helper.alertServerDataError();
        }
      }
    });
  };

  onPressVideo = (item) => {
    const { itemDatas } = this.state;
    global._selIndex = itemDatas.findIndex((obj) => obj.id === item.id);
    global._productsList = itemDatas;
    global._prevScreen = 'profile_my_video';
    const pushAction = StackActions.push('profile_video', null);
    this.props.navigation.dispatch(pushAction);
  };

  onLongPressVideo = (item) => {
    this._selItem = item;
    this.bottomMenu?.open();
  };

  onPressOutStock = (sticker) => {
    const { itemDatas } = this.state;

    this._selItem.sticker = sticker;
    this.bottomMenu.close();
    this.setState({ itemDatas });

    this.updateVideoSticker();
  };

  onPressNewProduct = () => {
    if (global.me?.isBannedProduct) {
      alert('You are not allowed to post products');
      return;
    }
    global._prevScreen = 'my_products';
    global._videoUri = '';
    Alert.alert('', 'Choose an option.', [
      {
        text: 'Camera',
        onPress: () =>
          this.props.navigation.navigate('camera_main', {
            maxDuration: 30,
            mode: 1,
          }),
      },
      {
        text: 'Photo Gallery',
        onPress: () => {
          global._prevScreen = 'my_products';
          global._videoUri = '';
          global._thumbUri = '';
          this.props.navigation.navigate('product_upload');
        },
      },
    ]);
  };

  updateVideoSticker = () => {
    let params = {
      video_id: this._selItem.id,
      sticker: this._selItem.sticker,
    };
    RestAPI.update_video_sticker(params, (json, err) => {});
  };

  _renderBottomMenu = () => (
    <ScrollView style={{ width: '100%' }}>
      {Constants.STICKER_NAME_LIST?.map((sticker, index) => {
        return (
          <TouchableOpacity
            onPress={() => this.onPressOutStock(index)}
            key={index.toString()}
            style={{ ...styles.panelButton }}
          >
            <Text style={styles.panelButtonTitle}>
              {sticker ? sticker : 'No Sticker'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  setOnEndReachedDuringMomentum = (onEndReachedDuringMomentum) => {
    this.setState({
      onEndReachedDuringMomentum,
    });
  };

  _renderVideo = () => {
    const { isFetching, itemDatas, onEndReachedDuringMomentum } = this.state;
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <ProductsList
          products={itemDatas}
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          onRefresh={this.onRefresh}
          isFetching={isFetching}
          onPressVideo={this.onPressVideo}
          onLongPressVideo={this.onLongPressVideo}
          onEndReachedDuringMomentum={onEndReachedDuringMomentum}
          setOnEndReachedDuringMomentum={this.setOnEndReachedDuringMomentum}
        />
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={GStyles.container}>
        <GHeaderBar
          headerTitle="My Products"
          leftType="back"
          navigation={navigation}
          rightAvatar={
            <TouchableOpacity onPress={this.onPressNewProduct}>
              <Text
                style={[
                  GStyles.textSmall,
                  GStyles.boldText,
                  { color: 'black' },
                ]}
              >
                Add New
              </Text>
            </TouchableOpacity>
          }
        />
        {this._renderVideo()}
        <RBSheet
          ref={(ref) => {
            this.bottomMenu = ref;
          }}
          height={300}
          closeOnDragDown
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
          }}
        >
          <View
            style={{
              ...GStyles.rowContainer,
              justifyContent: 'space-around',
            }}
          >
            {this._renderBottomMenu()}
          </View>
        </RBSheet>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  panelButton: {
    width: '100%',
    height: 36,
    backgroundColor: GStyle.grayBackColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 1,
  },
  panelButtonTitle: {
    fontSize: 14,
  },
});

export default (props) => {
  let navigation = useNavigation();
  let route = useRoute();
  return <MyProductsScreen {...props} navigation={navigation} route={route} />;
};
