'use strict';

import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    // WELCOME SCREEN
    welcome: 'Welcome to SafeHouse',
    welcomeParagraph: "Select whether you are looking for housing, or if you'd like to host someone.",
    looking: 'I am looking',
    hosting: 'I want to host',

    // SIGN UP
    signUp: 'Sign Up',
    username: 'Username',
    summary: 'Tell us a little about yourself',
    password: 'Password',
    passwordConfirm: 'Password Confirm',
    // SIGN UP LOOKING
    capacityL: 'For how many people?',
    durationL: 'For how long?',
    // SIGN UP HOSTING
    postalCode: 'Postal Code',
    capacityH: 'How many people can you house?',
    durationH: 'For how long can you house someone?'
  }
};

module.exports = I18n;
