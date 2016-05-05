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


    // MATCHES
    shortTerm: 'Short Term',
    mediumTerm: 'Medium Term',
    longTerm: 'Long Term',
    nothing: 'There is nothing to show!',
    about: 'About this user',
    message: 'Message this person',
    waiting: 'Awaiting confirmation',
    accept: 'Accept conversation',
    pubKeyAccept: 'Accept new PublicKey',
    pubKeyWaiting: 'Awaiting PublicKey',

    // THREADS
    noContact: 'No one has contacted you yet.\nCheck back soon.',
    noMessages: "You haven't contacted anyone yet.\nFind matches and request to chat.",

    submit: 'Submit',
    cancel: 'Cancel',
    problem: 'There was a problem.',
    person: 'person',
    people: 'people'
  }
};

module.exports = I18n;
