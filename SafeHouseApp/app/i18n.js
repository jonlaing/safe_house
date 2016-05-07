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
  },
  ar: {
    // WELCOME SCREEN
    welcome: 'مرحبة بك في منزل امن',
    welcomeParagraph: "اختار إذا تبحث إيواء أو إذا تريد ان استضاف شخص",
    looking: 'ابحث',
    hosting: 'اريد ان استضاف شخص',

    // SIGN UP
    signUp: 'سجل',
    username: 'اسم المستخدم',
    summary: 'حدثننا عن نفسك',
    password: 'كلمة سر',
    passwordConfirm: 'أكيد كلمة سر',
    capacity: 'كم أشخاص؟',
    duration: 'كم المدة؟',
    postalCode: 'بريدي',

    // LOG IN
    login: 'دخول',
    incorrectUsername: 'اسم المستخدم ما وجَدَ',
    incorrectPassword: 'كلمة سر خاطئ',


    // MATCHES
    shortTerm: 'قصير الأجل',
    mediumTerm: 'متوسط الأجل',
    longTerm: 'طويل الأجل',
    nothing: 'ما في أي شيء لعرض',
    about: 'حول هذا المستخدم',
    message: 'رسل رسالة إلى هذا الشخص',
    waiting: 'انتظار تأكيد',
    accept: 'قبل المحادثة',
    pubKeyAccept: 'قبل ببلك كي جديد',
    pubKeyWaiting: 'انتظار ببلك كي',

    // THREADS
    noContact: "لا أحد وقد اتصلت بعد. \n إرى مرة ثانية قريباً.",
    noMessages: "لم يتصل أي شخص حتى الآن.\n إبحث أشخاص و إطلب للدردشة.",

    submit: 'إرسال',
    cancel: 'إلغي',
    problem: 'كان مشكلة',
    person: 'شخص',
    people: 'أشخاص'
  }
};

module.exports = I18n;
