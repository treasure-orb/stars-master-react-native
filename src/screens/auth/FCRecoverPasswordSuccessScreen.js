import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { GStyles } from '../../utils/Global';

const ic_success = require('../../assets/images/ic_success.png');

class FCRecoverPasswordSuccessScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {}

  componentDidMount() {}

  onGoBack = () => {
    this.props.navigation.navigate('fc_signin');
  };

  render() {
    return (
      <SafeAreaView style={GStyles.centerContainer}>
        {this._renderImage()}
        {this._renderMessage()}
        {this._renderButton()}
      </SafeAreaView>
    );
  }

  _renderImage = () => {
    return (
      <Image source={ic_success} style={[GStyles.image, { width: 100 }]} />
    );
  };

  _renderMessage = () => {
    return (
      <>
        <Text style={[GStyles.notifyTitle, { fontSize: 24 }]}>
          Congratulations!
        </Text>
        <Text style={GStyles.notifyDescription}>
          You have successfully change password.{'\n'}Please use the new
          password when logging in.
        </Text>
      </>
    );
  };

  _renderButton = () => {
    return (
      <View style={{ marginTop: 40 }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('fc_signin');
          }}
        >
          <View style={GStyles.buttonFill}>
            <Text style={GStyles.textFill}>Login</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({});

export default FCRecoverPasswordSuccessScreen;
