'use strict';

import React, {
  Component,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  TextInput,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import I18n from './i18n';
import Router from './Router';
import Colors from './Colors';
import Messager from './Messager';

import NavBar from './NavBar';
import IconButton from './IconButton';
import IconInput from './IconInput';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.api = this.props.navigator.props.api;

    this.state = {
      username: '',
      password: '',
      usernameError: '',
      passwordError: ''
    };
  }

  _handleSubmit() {
    this.setState({usernameError: '', passwordError: ''});

    let messager = new Messager();
    messager.getKeys().then((keys) => {
      this.api.auth().login(this.state.username, this.state.password, keys.pub)
      .then(res => this._handleSuccess(res))
      .catch(err => {
        console.log(err);
        switch(err.response.status) {
          case 401:
            this.setState({passwordError: I18n.t('incorrectPassword')});
            break;
          case 404:
            this.setState({usernameError: I18n.t('incorrectUsername') });
            break;
          default:
            this.setState({usernameError: I18n.t('problem'), passwordError: I18n.t('problem')});
            break;
        }
      });
    });
  }

  _handleSuccess(res) {
    this.props.navigator.props.eventEmitter.emit('login');
    if(res.user.type === 2) {
      this.props.navigator.push(Router.threadList(res.token));
    } else {
      this.props.navigator.push(Router.matchList(res.token));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.scroll}>
            <IconInput name="account-circle" error={this.state.usernameError}>
              <TextInput
                style={styles.input}
                placeholder={I18n.t('username')}
                autoCorrect={false}
                autoCapitalize='none'
                value={this.state.username}
                autoFocus={true}
                onChangeText={text => this.setState({username: text})}
              />
            </IconInput>
            <IconInput name="lock" error={this.state.passwordError}>
              <TextInput
                style={styles.input}
                placeholder={I18n.t('password')}
                value={this.state.password}
                secureTextEntry={true}
                onChangeText={text => this.setState({password: text})}
              />
            </IconInput>
          </View>
          <View style={styles.hr} />
          <View style={styles.actionContainer}>
            <View style={styles.actionInner}>
              <IconButton name="check-circle" label={I18n.t('submit')} primary={true} onPress={this._handleSubmit.bind(this)} />
              <IconButton name="close" label={I18n.t('cancel')} onPress={() => this.props.navigator.pop()} />
            </View>
          </View>
        </ScrollView>
        <NavBar
          title={I18n.t('login')}
          leftButton={<Icon name="chevron-left" size={32} color={Colors.action} />}
          leftButtonPress={() => this.props.navigator.pop()}
        />
        <KeyboardSpacer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72,
    backgroundColor: Colors.lighterGrey
  },
  scroll: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 24,
    paddingHorizontal: 16
  },
  header: {
    flex: 1,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '200',
    color: '#00ff7f'
  },
  inputBlock: {
    height: 54,
    marginBottom: 16
  },
  inputBlockInner: {
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
    fontSize: 18,
    height: 48,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4
  },
  actionContainer: {
    height: 72
  },
  actionInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  hr: {
    height: 0,
    borderWidth: 0.5,
    borderColor: 'lightgrey'
  }
});

module.exports = LoginScreen;
