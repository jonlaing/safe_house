'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
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
        <View style={styles.hr} />
        <Text style={styles.paragraph}>{I18n.t('welcomeParagraph')}</Text>
        <TouchableHighlight style={styles.button} onPress={() => this.props.navigator.push(Router.signUpLooking())}>
          <View style={styles.buttonInner}>
            <Icon style={styles.buttonIcon} name="search" size={48} color="white" />
            <Text style={styles.buttonText}>{I18n.t('looking')}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button}>
          <View style={styles.buttonInner}>
            <Icon style={styles.buttonIcon} name="home" size={48} color="white" />
            <Text style={styles.buttonText}>{I18n.t('hosting')}</Text>
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
    backgroundColor: Colors.action,
    paddingVertical: 64,
    paddingHorizontal: 16
  },
  header: {
    flex: 1,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '200',
    color: 'white'
  },
  hr: {
    height: 0,
    borderWidth: 0.5,
    borderColor: 'white',
    marginVertical: 32
  },
  paragraph: {
    flex: 2,
    marginHorizontal: 4,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    color: 'white'
  },
  button: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderColor: 'white',
    borderWidth: 2,
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
