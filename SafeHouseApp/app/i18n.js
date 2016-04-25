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
    capacity: 'How many people?',
    duration: 'For how long?',
    postalCode: 'Postal Code',

    // LOG IN
    login: 'Log In',
    incorrectUsername: 'This username was not found.',
    incorrectPassword: 'This password is incorrect.',

    submit: 'Submit',
    cancel: 'Cancel',
    problem: 'There was a problem.',
    person: 'person',
    people: 'people'
  }
};

module.exports = I18n;