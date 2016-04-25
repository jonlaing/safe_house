'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  Image,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import I18n from './i18n';
import Router from './Router';
import Colors from './Colors';

export default class WelcomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{I18n.t('welcome')}</Text>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('./images/refugees.png')}/>
        </View>
        <View style={styles.hr} />
        <Text style={styles.paragraph}>{I18n.t('welcomeParagraph')}</Text>
        <TouchableHighlight style={styles.button} onPress={() => this.props.navigator.push(Router.signUpLooking())}>
          <View style={styles.buttonInner}>
            <Icon style={styles.buttonIcon} name="search" size={48} color="white" />
            <Text style={styles.buttonText}>{I18n.t('looking')}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={() => this.props.navigator.push(Router.signUpHosting())}>
          <View style={styles.buttonInner}>
            <Icon style={styles.buttonIcon} name="home" size={48} color="white" />
            <Text style={styles.buttonText}>{I18n.t('hosting')}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={[styles.button, {backgroundColor: 'transparent'}]} onPress={() => this.props.navigator.push(Router.loginScreen())}>
          <View style={[styles.buttonInner, {justifyContent: 'center'}]}>
            <Icon style={{marginRight: 8}} name="lock-open" size={32} color="grey" />
            <Text style={[styles.buttonText, {color: 'grey'}]}>{I18n.t('login')}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'white',
    paddingTop: 64,
    paddingHorizontal: 16
  },
  header: {
    flex: 1,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '200',
    color: Colors.action
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  image: {
    height: 45,
    width: 79,
    marginRight: 16
  },
  hr: {
    height: 0,
    borderWidth: 0.5,
    borderColor: 'lightgrey',
    marginBottom: 32
  },
  paragraph: {
    flex: 2,
    marginHorizontal: 4,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    color: 'grey'
  },
  button: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: Colors.action,
    borderRadius: 8
  },
  buttonInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '300',
    color: 'white'
  },
  buttonIcon: {
    width: 48,
    marginHorizontal: 48
  }
});

module.exports = WelcomeScreen;
