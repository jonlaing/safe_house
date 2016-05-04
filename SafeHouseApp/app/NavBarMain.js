'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from './Colors';

export default class NavBarMain extends Component {
  render() {
    if(this.props.userType !== 2) {
      return (
        <View style={[styles.container, this.props.style]}>
          <TouchableHighlight style={styles.button} onPress={this.props.leftButtonPress}>
            <View style={styles.buttonInner}>
              <Icon name="search" size={30} color="white" />
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.props.middleButtonPress}>
            <View style={styles.buttonInner}>
              <Icon name="speaker-notes" size={24} color="white" />
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.props.rightButtonPress}>
            <View style={styles.buttonInner}>
              <Icon name="settings" size={24} color="white" />
            </View>
          </TouchableHighlight>
        </View>
      );
    }

    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableHighlight style={styles.button} onPress={this.props.middleButtonPress}>
          <View style={styles.buttonInner}>
            <Icon name="speaker-notes" size={24} color="white" />
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={this.props.rightButtonPress}>
          <View style={styles.buttonInner}>
            <Icon name="settings" size={24} color="white" />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    paddingTop: 8,
    backgroundColor: Colors.action,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3
  },
  button: {
    width: 64,
    height: 44,
  },
  buttonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});



module.exports = NavBarMain;
