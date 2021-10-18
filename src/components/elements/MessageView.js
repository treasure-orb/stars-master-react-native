import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';

import PropTypes from 'prop-types';

//import MapView from 'react-native-maps';

class MessageView extends React.Component {
  render() {
    if (this.props.currentMessage.location) {
      return (
        <View
          style={{
            ...styles.container,
            ...this.props.containerStyle,
          }}
        >
          {/*<MapView*/}
          {/*  style={{*/}
          {/*    ...styles.mapView,*/}
          {/*    ...this.props.mapViewStyle,*/}
          {/*  }}*/}
          {/*  region={{*/}
          {/*    latitude: this.props.currentMessage.location.latitude,*/}
          {/*    longitude: this.props.currentMessage.location.longitude,*/}
          {/*    latitudeDelta: 0.0922,*/}
          {/*    longitudeDelta: 0.0421,*/}
          {/*  }}*/}
          {/*  annotations={[*/}
          {/*    {*/}
          {/*      latitude: this.props.currentMessage.location.latitude,*/}
          {/*      longitude: this.props.currentMessage.location.longitude,*/}
          {/*      latitudeDelta: 0.0922,*/}
          {/*      longitudeDelta: 0.0421,*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*  scrollEnabled={false}*/}
          {/*  zoomEnabled={false}*/}
          {/*/>*/}
          <TouchableOpacity
            onPress={() => {
              const url = Platform.select({
                ios: `http://maps.apple.com/?ll=${this.props.currentMessage.location.latitude},${this.props.currentMessage.location.longitude}`,
                android: `http://maps.google.com/?q=${this.props.currentMessage.location.latitude},${this.props.currentMessage.location.longitude}`,
              });
              Linking.canOpenURL(url)
                .then((supported) => {
                  if (supported) {
                    return Linking.openURL(url);
                  }
                })
                .catch((err) => {
                  console.error('An error occurred', err);
                });
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {},
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});

MessageView.defaultProps = {
  currentMessage: {},
  containerStyle: {},
  mapViewStyle: {},
};

MessageView.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style,
};

export default MessageView;
