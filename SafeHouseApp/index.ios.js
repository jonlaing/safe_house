/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  AsyncStorage,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Router from './app/Router';

class SafeHouseApp extends Component {
  constructor(props) {
    super(props);

    this.state = { token: null, tokenFetched: false };
  }

  componentDidMount() {
    // AsyncStorage.removeItem('AUTH_TOKEN');
    AsyncStorage.getItem('AUTH_TOKEN')
    .then(tok => this.setState({token: tok, tokenFetched: true}))
    .catch((err) => { console.log(err); this.setState({tokenFetched: true}); });
  }

  _initialRoute() {
    if(this.state.token !== null && this.state.tokenFetched === true) {
      return Router.matchList(this.state.token);
    }

    return Router.welcomeScreen();
  }

  render() {
    if(this.state.tokenFetched === false) {
      return <Text>Loading...</Text>;
    }

    return (
      <ExNavigator
        initialRoute={this._initialRoute()}
        style={{ flex: 1 }}
        showNavigationBar={false}
      />
    );
  }
}

AppRegistry.registerComponent('SafeHouseApp', () => SafeHouseApp);
