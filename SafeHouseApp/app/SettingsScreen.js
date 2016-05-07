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

import NavBarMain from './NavBarMain';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.api = new Api(this.props.navigator.props.eventEmitter);
  }

  handleLogout() {
    this.api.auth().logout()
    .catch(err => console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.handleLogout.bind(this)}>
          <Text>Logout</Text>
        </TouchableHighlight>
        <NavBarMain
          userType={this.props.navigator.props.userType}
          leftButtonPress={() => this.props.navigator.replace(Router.matchList(this.props.token)) }
          middleButtonPress={() => this.props.navigator.replace(Router.threadList(this.props.token)) }
        />
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
