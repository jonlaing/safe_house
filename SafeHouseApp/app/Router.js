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

  matchesScreen(token) {
    return {
      renderScene(navigator) {
        let MatchesScreen = require('./MatchesScreen');
        return <MatchesScreen token={token} navigator={navigator} />;
      }
    };
  }
};

module.exports = Router;
