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

import Icon from 'react-native-vector-icons/MaterialIcons';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import I18n from './i18n';
import Colors from './Colors';

import NavBar from './NavBar';

export default class SignUpLooking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      capacity: null,
      showCapacityPicker: false,
      summary: '',
      password: '',
      passwordConfirm: ''
    };
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
        <Picker.Item label={I18n.t('capacityL')} value={null} />
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
      return I18n.t('capacityL');
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
            <View style={styles.inputBlock}>
              <View style={styles.inputBlockInner}>
                <Icon style={styles.inputIcon} name="account-circle" size={32} color="grey" />
                <TextInput
                  style={styles.input}
                  placeholder={I18n.t('username')}
                  autoCorrect={false}
                  autoCapitalize='none'
                  value={this.state.username}
                  autoFocus={true}
                  onChangeText={text => this.setState({username: text})}
                />
              </View>
            </View>
            <View style={styles.inputBlock}>
              <View style={styles.inputBlockInner}>
                <Icon style={styles.inputIcon} name="people" size={32} color="grey" />
                <TouchableHighlight style={{flex: 1}} onPress={() => this.setState({showCapacityPicker: true})}>
                  <TextInput
                    style={[styles.input, {color: 'grey'}]}
                    placeholder={I18n.t('capacityL')}
                    value={this._capacityToString()}
                    editable={false}
                  />
                </TouchableHighlight>
              </View>
            </View>
            <View style={styles.inputBlockLarge}>
              <View style={styles.inputBlockInner}>
                <Icon style={[styles.inputIcon, {alignSelf: 'flex-start'}]} name="comment" size={32} color="grey" />
                <TextInput
                  style={styles.textBlock}
                  placeholder={I18n.t('summary')}
                  value={this.state.summary}
                  onChangeText={text => this.setState({summary: text})}
                  multiline={true}
                  returnKeyType='done'
                />
              </View>
            </View>
            <View style={styles.inputBlock}>
              <View style={styles.inputBlockInner}>
                <Icon style={styles.inputIcon} name="lock" size={32} color="grey" />
                <TextInput
                  style={styles.input}
                  placeholder={I18n.t('password')}
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={text => this.setState({password: text})}
                />
              </View>
            </View>
            <View style={styles.inputBlock}>
              <View style={styles.inputBlockInner}>
                <Icon style={styles.inputIcon} name="lock-outline" size={32} color="grey" />
                <TextInput
                  style={styles.input}
                  placeholder={I18n.t('passwordConfirm')}
                  value={this.state.passwordConfirm}
                  secureTextEntry={true}
                  onChangeText={text => this.setState({passwordConfirm: text})}
                />
              </View>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.actionContainer}>
            <View style={styles.actionInner}>
              <TouchableHighlight>
                <View style={[styles.actionButton, styles.actionButtonMain]}>
                  <Icon style={styles.actionIcon} name="check-circle" size={24} color="white" />
                  <Text style={styles.actionTextMain}>Submit</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.props.navigator.pop()}>
                <View style={styles.actionButton}>
                  <Icon style={styles.actionIcon} name="close" size={24} color="grey" />
                  <Text style={styles.actionTextSecondary}>Cancel</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
        {this._renderCapacityPicker()}
        <NavBar
          title={I18n.t('signUp')}
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
