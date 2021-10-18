import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import GStyle from '../assets/Styles';
import PaymentScreen from '../screens/PaymentScreen';

export default class PaymentModal extends React.Component {
  static propTypes = {
    request: PropTypes.object,
    modalVisible: PropTypes.bool,
    onPressBack: PropTypes.func.required,
    afterPayFinish: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  _renderBackButton = () => {
    return (
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          position: 'absolute',
          left: 15,
          top: 10,
        }}
        onPress={() => {
          this.props.onPressBack();
        }}
      >
        <Icon
          name="arrow-left"
          type="feather"
          size={30}
          color={GStyle.whiteColor}
        />
      </TouchableOpacity>
    );
  };
  _cardModalViewRender = () => {
    let post = this.props.request;
    if (post === null) {
      return null;
    } else {
      return (
        <Modal
          style={{
            flex: 1,
            margin: 0,
            padding: 0,
            backgroundColor: GStyle.purpleColor1,
          }}
          animationType="slide"
          transparent={false}
          visible={this.props.modalVisible}
        >
          <PaymentScreen
            req_id={post.id.toString()}
            staff_service_id={post.staff_service_id.toString()}
            event_date={post.booking_date}
            booking_slot={post.time_slot}
            address={post.address}
            staff_member_id={post.staff_id.toString()}
            instructions={'Ozenii massage booking - #' + post.id}
            price={post.staff_service.price}
            afterFinish={(result) => {
              // this.setState({ isCardModalView: false, isShowDetail: false })

              // this.loadData();
              this.props.afterPayFinish(result);
            }}
          />

          {this._renderBackButton()}
        </Modal>
      );
    }
  };

  render() {
    return this._cardModalViewRender();
  }
}
