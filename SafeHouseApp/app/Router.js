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
  }
};

module.exports = Router;
