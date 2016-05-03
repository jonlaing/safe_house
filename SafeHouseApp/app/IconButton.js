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
  _style() {
    let style = {};
    if(this.props.large === true) {
      style.paddingVertical = 16;
    }

    if(this.props.primary === true) {
      style.backgroundColor = Colors.action;
    }

    return [styles.actionButton, style];
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={this._style()}>
          <View style={styles.actionIconContainer}>
            <Icon style={styles.actionIcon} name={this.props.name} size={this.props.iconSize} color={this.props.primary === true ? "white" : "grey"} />
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4
  },
  actionIconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 8
  },
  actionText: {
    flex: 2,
    fontSize: 18,
    color: 'grey'
  },
  actionTextMain: {
    fontWeight: 'bold',
    color: 'white'
  }
});

module.exports = IconButton;
