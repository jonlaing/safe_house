'use strict';

import React, {
  Component,
  View,
  Text
} from 'react-native';

import I18n from './i18n';

export default class SignUpHosting extends Component {
  render() {
    return (
      <View>
        <Text>{I18n.t('signUp')}</Text>
      </View>
    );
  }
}

module.exports = SignUpHosting;
