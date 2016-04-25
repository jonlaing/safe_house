/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Router from './app/Router';
import WelcomeScreen from './app/WelcomeScreen';

class SafeHouseApp extends Component {
  _initialRoute() {
    return Router.welcomeScreen();
  }

  render() {
    return (
      <ExNavigator
        initialRoute={this._initialRoute()}
        style={{ flex: 1 }}
        showNavigationBar={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('SafeHouseApp', () => SafeHouseApp);
