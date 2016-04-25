'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Colors from './Colors';

export default class IconButton extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={[styles.actionButton, this.props.primary === true ? styles.actionButtonMain : {}]}>
          <Icon style={styles.actionIcon} name={this.props.name} size={this.props.iconSize} color={this.props.primary === true ? "white" : "grey"} />
          <Text style={[styles.actionText, this.props.primary === true ? styles.actionTextMain : {}]}>{this.props.label}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

IconButton.propTypes = {
  onPress: React.PropTypes.func,
  primary: React.PropTypes.bool,
  name: React.PropTypes.string.isRequired,
  iconSize: React.PropTypes.number,
  label: React.PropTypes.string.isRequired
};

IconButton.defaultProps = {
  onPress: () => {},
  primary: false,
  iconSize: 24
};

let styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4
  },
  actionButtonMain: {
    backgroundColor: Colors.action
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 8
  },
  actionText: {
    flex: 1,
    fontSize: 18,
    color: 'grey'
  },
  actionTextMain: {
    fontWeight: 'bold',
    color: 'white'
  }
});

module.exports = IconButton;
