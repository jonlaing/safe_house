'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default class IconInput extends Component {
  _renderError() {
    if(this.props.error.length < 1) {
      return <View />;
    }

    return <Text style={styles.error}>{this.props.error}</Text>;
  }

  render() {
    return (
      <View style={[styles.container, this.props.large === true ? {height: 160} : {}]}>
        <View style={styles.inputBlock}>
          <Icon style={[styles.inputIcon, this.props.large === true ? {alignSelf: 'flex-start'} : {}]} name={this.props.name} size={this.props.iconSize} color="grey" />
          <View style={styles.input}>
            {this.props.children}
            {this._renderError()}
          </View>
        </View>
      </View>
    );
  }
}

IconInput.propTypes = {
  name: React.PropTypes.string.isRequired,
  iconSize: React.PropTypes.number,
  error: React.PropTypes.string,
  children: React.PropTypes.node.isRequired,
  large: React.PropTypes.bool
};

IconInput.defaultProps = {
  iconSize: 32,
  error: "",
  large: false
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  inputBlock: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  inputIcon: {
    width: 48,
    height: 48,
    marginHorizontal: 8
  },
  input: {
    flex: 1,
    // flexDirection: 'column'
  },
  error: {
    marginVertical: 4,
    color: "darkred"
  }
});

module.exports = IconInput;
