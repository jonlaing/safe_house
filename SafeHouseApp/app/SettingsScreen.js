'use strict';

import React, {
  Component,
  TouchableHighlight,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Api from './Api';
import Router from './Router';

export default class SettingsScreen extends Component {
  handleLogout() {
    Api.auth().logout()
    .then(() => this.props.navigator.replace(Router.welcomeScreen()))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.handleLogout.bind(this)}>
          <Text>Logout</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80
  }
});

module.exports = SettingsScreen;
