/*global fetch, navigator, WebSocket */
import React, {AsyncStorage} from 'react-native';

import moment from 'moment';

import Messager from './Messager';

const _UTLookingFor = 1;
const _UTHosting = 2;

const _USNotHousing = 1;
const _USNotAvailable = 2;
const _USAvailable = 3;

const _UHDNone = 0;
const _UHDShortTerm = 1;
const _UHDMediumTerm = 2;
const _UHDLongTerm = 3;

function _root(prod = false) {
  if(prod === true) {
    return "tranquil-island-89911.herokuapp.com";
  }

  return "localhost:4000";
}

function _headers(token, json = true) {
 if(token !== undefined) {
   return {
     'Accept': 'application/json',
     'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8',
     'X-Auth-Token': token
   };
 } else {
   return {
     'Accept': 'application/json',
     'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8'
   };
 }
}

function _ok(status) {
  return status >= 200 && status < 300;
}

function _unauthorized(status) {
  return status === 401;
}

class Api {
  constructor(eventEmitter, prod = false) {
    this.emitter = eventEmitter;
    this.location = _root(prod);
  }

  _processJSON(resp) {
    // If the status is bad, throw a well-formatted error
    if(!_ok(resp.status)) {
      if(_unauthorized(resp.status)) {
        this.auth().logout();
      }

      var error = new Error(resp.statusText);
      error.response = resp;
      throw error;
    }

    // otherwise return the JSON
    return resp.json();
  }

  auth() {
    return {
      _completeLogin: (res) => {
        console.log(res.user.type);
        return new Promise((resolve, reject) => {
          AsyncStorage.multiSet([['AUTH_TOKEN', res.token], ['username', res.user.username], ['user_type', res.user.type.toString()]])
          .then(() => this.emitter.emit('login'))
          .then(() => resolve(res))
          .catch(err => reject(err));
        });
      },

      login: (username, password, publicKey) => {
        return fetch(`http://${this.location}/login`, {
          headers: _headers(),
          method: 'POST',
          body: JSON.stringify({
            username: username,
            password: password,
            public_key: publicKey
          })
        })
        .then(resp => this._processJSON(resp))
        .then(resp => this.auth()._completeLogin(resp));
      },

      logout: () => {
        return AsyncStorage.multiRemove(['AUTH_TOKEN', 'username', 'user_type', 'PRIV_KEY', 'PUB_KEY'])
        .then(() => this.emitter.emit('logout'))
        .catch(err => console.log("error removing", err));
      },

      _signUp: (user) => {
        return new Promise((resolve, reject) => {
          let messager = new Messager();
          messager.getKeys().then((keys) => {

            user.public_key = keys.pub;

            fetch(`http://${this.location}/signup`, {
              headers: _headers(),
              method: 'POST',
              body: JSON.stringify(user)
            })
            .then(resp => this._processJSON(resp))
            .then(resp => this.auth()._completeLogin(resp))
            .then(resp => resolve(resp))
            .catch(err => {
              err.response.json()
              .then(d => reject(d))
              .catch(() => reject(err));
            });
          });
        });
      },

      signUpLooking: (username, capacity, summary, password, passwordConfirm) => {
        let user = {
          username: username,
          type: _UTLookingFor,
          status: _USNotHousing,
          capacity: capacity,
          duration: _UHDNone,
          profile: summary,
          password: password,
          password_confirm: passwordConfirm
        };

        return this.auth()._signUp(user);
      },

      signUpHosting: (username, postalCode, capacity, duration, summary, password, passwordConfirm) => {
        let user = {
          username: username,
          postal_code: postalCode,
          type: _UTHosting,
          status: _USAvailable,
          capacity: capacity,
          duration: duration,
          profile: summary,
          password: password,
          password_confirm: passwordConfirm
        };

        return this.auth()._signUp(user);
      }
    };
  }

  matches(token) {
    return {
      get: (userID, unit = 0) => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition((pos) => {
            let search = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              unit: unit
            };

            fetch(`http://${this.location}/matches/${userID}`, {
              headers: _headers(token),
              method: 'POST',
              body: JSON.stringify(search)
            })
            .then(res => this._processJSON(res))
            .then(res => resolve(res))
            .catch(err => reject(err));
          });
        });
      },

      list: (page, distance = 25, unit = 0) => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition((pos) => {
            let search = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              distance: distance,
              duration: 0,
              unit: unit,
              page: page
            };

            fetch(`http://${this.location}/matches`, {
              headers: _headers(token),
              method: 'POST',
              body: JSON.stringify(search)
            })
            .then(res => this._processJSON(res))
            .then(res => resolve(res))
            .catch(err => reject(err));
          });
        });
      }
    };
  }

  messages(token) {
    return {
      threads: () => {
        return fetch(`http://${this.location}/threads`, { headers: _headers(token) })
        .then(res => this._processJSON(res));
      },

      thread: (userID) => {
        return fetch(`http://${this.location}/threads/${userID}`, { headers: _headers(token) })
        .then(res => this._processJSON(res));
      },

      request: (userID, pubKey) => {
        return fetch(`http://${this.location}/threads/`, {
          headers: _headers(token),
          method: 'POST',
          body: JSON.stringify({
            user_id: userID,
            public_key: pubKey
          })
        })
        .then(res => this._processJSON(res));
      },

      list: (threadID) => {
        return fetch(`http://${this.location}/messages/${threadID}`, { headers: _headers(token) })
        .then(res => this._processJSON(res));
      },

      accept: (threadID, pubKey) => {
        return fetch(`http://${this.location}/threads/${threadID}/accept`, {
          headers: _headers(token),
          body: JSON.stringify({
            public_key: pubKey
          }),
          method: 'PATCH'
        })
        .then(res => this._processJSON(res));
      },

      send: (threadID, text, messager) => {
          let encrypted = messager.encrypt(text);
          let senderCopy = messager.encryptForMe(text);

          return fetch(`http://${this.location}/messages/${threadID}`, {
            headers: _headers(token),
            body: JSON.stringify({
              encrypted_message: encrypted,
              sender_copy_message: senderCopy
            }),
            method: 'POST'
          })
          .then(res => this._processJSON(res));
      },

      socket: (threadID, onMessage, onError) => {
        var _socket = null;
        var sendInterval, reopenInterval;

        // once we get the ticket througha normal https request, open up the socket
        // using the ticket for authentication
        if(!_socket) {
          _socket = new WebSocket(`ws://${this.location}/messages/${threadID}/subscribe?token=${token}`);
        } else {
          return;
        }

        let start = function() {
          _socket.onmessage = onMessage;
          _socket.onerror = onError;

          _socket.onopen = () => {
            clearInterval(reopenInterval);

            let lastNow = moment(Date.now()).unix();

            sendInterval = setInterval(() => {
              if(!_socket || _socket.readyState === 2 || _socket.readyState === 3) {
                clearInterval(sendInterval);
                return;
              }

              _socket.send(lastNow.toString());
              lastNow = moment(Date.now()).unix();
            }, 1000);
          };

          reopenInterval = setInterval(() => {
            if(!_socket || _socket.readyState === 0 || _socket.readyState === 1) {
              clearInterval(reopenInterval);
              return;
            }

            _socket = null;
            start();
          }, 5000);
        };

        start();
      }
    };
  }
}

export default Api;

module.exports = Api;
