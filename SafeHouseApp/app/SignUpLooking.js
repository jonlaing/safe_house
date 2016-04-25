'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  TextInput,
  Picker,
  View,
  Text
} from 'react-native';

import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import I18n from './i18n';
import Api from './Api';
import Colors from './Colors';

import NavBar from './NavBar';
import IconButton from './IconButton';
import IconInput from './IconInput';

export default class SignUpLooking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      capacity: null,
      showCapacityPicker: false,
      summary: '',
      password: '',
      passwordConfirm: '',
      usernameError: '',
      capacityError: '',
      passwordError: ''
    };
  }

  _handleSubmit() {
    this.setState({
      usernameError: '',
      capacityError: '',
      passwordError: ''
    });

    Api.auth().signUpLooking(
      this.state.username,
      this.state.capacity,
      this.state.summary,
      this.state.password,
      this.state.passwordConfirm
    )
    .then(resp => console.log(resp))
    .then(() => this.props.navigator.pop())
    .catch((err) => this._handleErrors(err));
  }

  _handleErrors(err) {
    if(err.validation_errors === undefined) {
      console.log(err);
      return;
    }

    let newState = {};
    _.forOwn(err.validation_errors, (v, k) => {
      switch (k) {
              case "Password":
                      newState.passwordError = v;
                      break;
              case "Username":
                      newState.usernameError = v;
                      break;
              case "Capacity":
                      newState.capacityError = v;
                      break;
      }
    });

    this.setState(newState);
  }

  _renderCapacityPicker() {
    if(this.state.showCapacityPicker !== true) {
      return <View />;
    }

    return (
      <Picker
        style={styles.picker}
        selectedValue={this.state.capacity}
        onValueChange={cap => this.setState({capacity: cap, showCapacityPicker: false})}>
        <Picker.Item label={I18n.t('capacity')} value={null} />
        <Picker.Item label="1 person" value={1} />
        <Picker.Item label="2 people" value={2} />
        <Picker.Item label="3 people" value={3} />
        <Picker.Item label="4 people" value={4} />
        <Picker.Item label="5 people" value={5} />
        <Picker.Item label="6 people" value={6} />
        <Picker.Item label="7 people" value={7} />
        <Picker.Item label="8 people" value={8} />
        <Picker.Item label="9 people" value={9} />
        <Picker.Item label="10+ people" value={10} />
      </Picker>
    );
  }

  _capacityToString() {
    if(this.state.capacity === null) {
      return I18n.t('capacity');
    }

    if(this.state.capacity === 10) {
      return '10+ people';
    }

    return `${this.state.capacity} people`;
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
            <IconInput name="people" error={this.state.capacityError}>
              <TouchableHighlight style={{flex: 1}} onPress={() => this.setState({showCapacityPicker: true})}>
                <TextInput
                  style={[styles.input, {color: 'grey'}]}
                  placeholder={I18n.t('capacity')}
                  value={this._capacityToString()}
                  editable={false}
                />
              </TouchableHighlight>
            </IconInput>
            <IconInput name="comment" large={true} error={this.state.summaryError}>
              <TextInput
                style={styles.textBlock}
                placeholder={I18n.t('summary')}
                value={this.state.summary}
                onChangeText={text => this.setState({summary: text})}
                multiline={true}
                returnKeyType='done'
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
            <IconInput name="lock-outline" error={this.state.passwordError}>
              <TextInput
                style={styles.input}
                placeholder={I18n.t('passwordConfirm')}
                value={this.state.passwordConfirm}
                secureTextEntry={true}
                onChangeText={text => this.setState({passwordConfirm: text})}
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
        {this._renderCapacityPicker()}
        <NavBar
          title={I18n.t('signUp')}
          leftButton={<Icon name="chevron-left" size={32} color={Colors.action} />}
          leftButtonPress={() => this.props.navigator.pop()}
          rightButton={<Icon name="help-outline" size={24} color={Colors.action} />}
          rightButtonPress={() => this.props.navigator.pop()}
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
    backgroundColor: 'rgb(242,242,242)'
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
  inputBlockLarge: {
    height: 160,
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
  textBlock: {
    flex: 1,
    fontSize: 18,
    height: 160,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4
  },
  picker: {
    flex: 1,
    backgroundColor: 'white'
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
  actionTextMain: {
    flex: 1,
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white'
  },
  actionTextSecondary: {
    flex: 1,
    alignItems: 'center',
    fontSize: 18,
    color: 'grey'
  },
  hr: {
    height: 0,
    borderWidth: 0.5,
    borderColor: 'lightgrey'
  }
});

module.exports = SignUpLooking;
