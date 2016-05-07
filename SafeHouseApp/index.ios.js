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

import EventEmitter from 'EventEmitter';
import ExNavigator from '@exponent/react-native-navigator';

import Api from './app/Api';
import Router from './app/Router';
import Messager from './app/Messager';

class SafeHouseApp extends Component {
  constructor(props) {
    super(props);

    this.eventEmitter = new EventEmitter();
    this.api = new Api(this.eventEmitter, true); // true: production
    this.messager = new Messager();
    this.state = { token: null, tokenFetched: false, userType: 0 };
  }

  componentDidMount() {
    this._getUserProps();
    this.eventEmitter.addListener('login', this._getUserProps.bind(this));
    this.eventEmitter.addListener('logout', () => this.refs.nav.replace(Router.welcomeScreen()));
  }

  _getUserProps() {
    AsyncStorage.multiGet(['AUTH_TOKEN', 'user_type'])
    .then(stores => {
      let tok, uType;
      stores.map((v, k, store) => {
        if(store[k][0] === 'AUTH_TOKEN') {
          tok = store[k][1];
        }

        if(store[k][0] === 'user_type') {
          uType = store[k][1];
        }
      });

      this.setState({token: tok, tokenFetched: true, userType: parseInt(uType)});
    })
    .then(() => this.messager.getKeys()) // generate keys if they're not already there
    .catch((err) => { console.log(err); this.setState({tokenFetched: true}); });
  }

  _initialRoute() {
    if(this.state.token !== null && this.state.tokenFetched === true && this.state.userType === 1) {
      return Router.matchList(this.state.token);
    }

    if(this.state.token !== null && this.state.tokenFetched === true && this.state.userType === 2) {
      return Router.threadList(this.state.token);
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
        userType={this.state.userType}
        eventEmitter={this.eventEmitter}
        api={this.api}
        messager={this.messager}
        ref="nav"
      />
    );
  }
}

AppRegistry.registerComponent('SafeHouseApp', () => SafeHouseApp);
