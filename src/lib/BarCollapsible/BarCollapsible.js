'use strict';

import React, { Component } from 'react';
import { Animated, Image, Text, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './style';

const ic_plus = require('../../assets/images/ic_plus.png');
const ic_minus = require('../../assets/images/ic_minus.png');

class BarCollapsible extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(0),
      icon: props.icon,
      onPressed: null,
      title: '',
      children: null,
      show: props.showOnStart,
    };
  }

  static defaultProps = {
    isIcon: true,
    showOnStart: false,
    icon: 'angle-right',
    iconOpened: 'minus',
    iconActive: 'plus',
    iconCollapsed: 'plus',
    img: ic_plus,
    imgOpened: ic_minus,
    imgActive: ic_plus,
    imgCollapsed: ic_plus,
    tintColor: '#fff',
    iconSize: 30,
    imgSize: 30,
  };

  componentDidMount() {
    const {
      isIcon,
      collapsible,
      clickable,
      icon,
      img,
      title,
      tintColor,
      iconSize,
      iconOpened,
      iconActive,
      iconCollapsed,
      imgSize,
      imgOpened,
      imgActive,
      imgCollapsed,
      showOnStart,
      onPressed,
    } = this.props;
    const { fadeAnim } = this.state;

    if (clickable) {
      this.setState({
        icon,
        img,
        onPressed,
        title,
      });
    } else if (collapsible) {
      this.setState(
        {
          icon: showOnStart ? iconOpened : iconActive,
          iconCollapsed,
          iconOpened,
          img: showOnStart ? imgOpened : imgActive,
          imgCollapsed,
          imgOpened,
          title,
        },
        Animated.timing(fadeAnim, {
          toValue: 1,
          useNativeDriver: false,
        }).start(),
      );
    } else {
      this.setState({ title });
    }
  }

  toggleView = () => {
    const {
      show,
      iconCollapsed,
      iconOpened,
      imgCollapsed,
      imgOpened,
    } = this.state;

    this.setState({
      show: !show,
      icon: show ? iconCollapsed : iconOpened,
      img: show ? imgCollapsed : imgOpened,
    });
  };

  renderDefault = () => {
    const { titleStyle } = this.props;
    const { title } = this.state;

    return (
      <View style={styles.bar}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
    );
  };

  renderCollapsible = () => {
    const {
      isIcon,
      style,
      iconStyle,
      imgStyle,
      titleStyle,
      tintColor,
      iconSize,
      imgSize,
      children,
    } = this.props;
    const { icon, img, fadeAnim, title } = this.state;

    return (
      <View>
        <TouchableHighlight
          style={styles.barWrapper}
          underlayColor="transparent"
          onPress={this.toggleView}
        >
          <View style={[styles.bar, style]}>
            {isIcon ? (
              <Icon
                name={icon}
                size={iconSize}
                color={tintColor}
                style={[styles.icon, iconStyle]}
              />
            ) : (
              <Image
                source={img}
                style={{
                  width: imgSize,
                  height: imgSize,
                  resizeMode: 'contain',
                  marginRight: 4,
                  marginBottom: 4,
                }}
              />
            )}
            <Text style={[styles.title, titleStyle]}>{title}</Text>
          </View>
        </TouchableHighlight>
        {this.state.show && (
          <Animated.View style={{ opacity: fadeAnim }}>
            {children}
          </Animated.View>
        )}
      </View>
    );
  };

  renderClickable = () => {
    const {
      style,
      titleStyle,
      tintColor,
      iconSize,
      iconStyle,
      imgSize,
      imgStyle,
    } = this.props;
    const { isIcon, icon, img, title, onPressed } = this.state;

    return (
      <TouchableHighlight
        style={styles.barWrapper}
        underlayColor="transparent"
        onPress={onPressed}
      >
        <View style={[styles.bar, style]}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {isIcon ? (
            <Icon
              name={icon}
              size={iconSize}
              color={tintColor}
              style={[styles.icon, iconStyle]}
            />
          ) : (
            <Image
              source={img}
              style={{
                width: imgSize,
                height: imgSize,
                resizeMode: 'contain',
                marginRight: 4,
                marginBottom: 4,
              }}
            />
          )}
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { clickable, collapsible } = this.props;

    if (clickable) {
      return this.renderClickable();
    } else if (collapsible) {
      return this.renderCollapsible();
    } else {
      return this.renderDefault();
    }
  }
}

export default BarCollapsible;
