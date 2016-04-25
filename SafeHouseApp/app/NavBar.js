'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Colors from './Colors';

export default class NavBar extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableHighlight style={styles.button} onPress={this.props.leftButtonPress}>
          <View style={styles.buttonInner}>
            {this.props.leftButton}
          </View>
        </TouchableHighlight>
        <Text style={styles.header}>{this.props.title}</Text>
        <TouchableHighlight style={styles.button} onPress={this.props.rightButtonPress}>
          <View style={styles.buttonInner}>
            {this.props.rightButton}
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
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3
  },
  header: {
    flex: 1,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '200',
    color: Colors.action,
  },
  button: {
    width: 44,
    height: 44
  },
  buttonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});



module.exports = NavBar;
