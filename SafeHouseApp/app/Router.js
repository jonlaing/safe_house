'use strict';

import React from 'react-native';

let Router = {
  welcomeScreen() {
    return {
      renderScene(navigator) {
        let WelcomeScreen = require('./WelcomeScreen');
        return <WelcomeScreen navigator={navigator} />;
      }
    };
  },
  signUpLooking() {
    return {
      renderScene(navigator) {
        let SignUpLooking = require('./SignUpLooking');
        return <SignUpLooking navigator={navigator} />;
      }
    };
  },
  signUpHosting() {
    return {
      renderScene(navigator) {
        let SignUpHosting = require('./SignUpHosting');
        return <SignUpHosting navigator={navigator} />;
      }
    };
  },

  loginScreen() {
    return {
      renderScene(navigator) {
        let LoginScreen = require('./LoginScreen');
        return <LoginScreen navigator={navigator} />;
      }
    };
  },

  matchList(token) {
    return {
      renderScene(navigator) {
        let MatchList = require('./MatchList');
        return <MatchList token={token} navigator={navigator} />;
      }
    };
  },

  matchScreen(userID, token, threadID = null) {
    return {
      renderScene(navigator) {
        let MatchScreen = require('./MatchScreen');
        return <MatchScreen userID={userID} token={token} threadID={threadID} navigator={navigator} />;
      }
    };
  },

  chatScreen(threadID, token) {
    return {
      renderScene(navigator) {
        let ChatScreen = require('./ChatScreen');
        return <ChatScreen threadID={threadID} token={token} navigator={navigator} />;
      }
    };
  },

  threadList(token) {
    return {
      renderScene(navigator) {
        let ThreadList = require('./ThreadList');
        return <ThreadList token={token} navigator={navigator} />;
      }
    };
  },

  settingsScreen(token) {
    return {
      renderScene(navigator) {
        let SettingsScreen = require('./SettingsScreen');
        return <SettingsScreen token={token} navigator={navigator} />;
      }
    };
  }
};

module.exports = Router;
