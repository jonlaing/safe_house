/*global fetch, navigator */
import React, {AsyncStorage} from 'react-native';

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

function _processJSON(resp) {
  // If the status is bad, throw a well-formatted error
  if(!_ok(resp.status)) {
    var error = new Error(resp.statusText);
    error.response = resp;
    throw error;
  }

  // otherwise return the JSON
  return resp.json();
}

function _ok(status) {
  return status >= 200 && status < 300;
}

let Api = {
  auth() {
    return {
      _completeLogin(res) {
        console.log(res.user.type);
        return new Promise((resolve, reject) => {
          AsyncStorage.multiSet([['AUTH_TOKEN', res.token], ['username', res.user.username], ['user_type', res.user.type.toString()]])
          .then(() => resolve(res))
          .catch(err => reject(err));
        });
      },

      login(username, password, publicKey) {
        return fetch('http://localhost:4000/login', {
          headers: _headers(),
          method: 'POST',
          body: JSON.stringify({
            username: username,
            password: password,
            public_key: publicKey
          })
        })
        .then(resp => _processJSON(resp))
        .then(resp => Api.auth()._completeLogin(resp));
      },

      logout() {
        return AsyncStorage.multiRemove(['AUTH_TOKEN', 'username', 'user_type', 'PRIV_KEY', 'PUB_KEY'])
        .catch(err => console.log("error removing", err));
      },

      _signUp(user) {
        return new Promise((resolve, reject) => {
          let messager = new Messager();
          messager.getKeys().then((keys) => {

            user.public_key = keys.pub;

            fetch('http://localhost:4000/signup', {
              headers: _headers(),
              method: 'POST',
              body: JSON.stringify(user)
            })
            .then(resp => _processJSON(resp))
            .then(resp => Api.auth()._completeLogin(resp))
            .then(resp => resolve(resp))
            .catch(err => {
              err.response.json()
              .then(d => reject(d))
              .catch(() => reject(err));
            });
          });
        });
      },

      signUpLooking(username, capacity, summary, password, passwordConfirm) {
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

        return Api.auth()._signUp(user);
      },

      signUpHosting(username, postalCode, capacity, duration, summary, password, passwordConfirm) {
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

        return Api.auth()._signUp(user);
      }
    };
  },

  matches(token) {
    return {
      get(userID, unit = 0) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition((pos) => {
            let search = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              unit: unit
            };

            fetch(`http://localhost:4000/matches/${userID}`, {
              headers: _headers(token),
              method: 'POST',
              body: JSON.stringify(search)
            })
            .then(res => _processJSON(res))
            .then(res => resolve(res))
            .catch(err => reject(err));
          });
        });
      },

      list(page, distance = 25, unit = 0) {
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

            fetch('http://localhost:4000/matches', {
              headers: _headers(token),
              method: 'POST',
              body: JSON.stringify(search)
            })
            .then(res => _processJSON(res))
            .then(res => resolve(res))
            .catch(err => reject(err));
          });
        });
      }
    };
  },

  messages(token) {
    return {
      threads() {
        return fetch(`http://localhost:4000/threads`, { headers: _headers(token) })
        .then(res => _processJSON(res));
      },

      thread(userID) {
        return fetch(`http://localhost:4000/threads/${userID}`, { headers: _headers(token) })
        .then(res => _processJSON(res));
      },

      request(userID, pubKey) {
        return fetch("http://localhost:4000/threads/", {
          headers: _headers(token),
          method: 'POST',
          body: JSON.stringify({
            user_id: userID,
            public_key: pubKey
          })
        })
        .then(res => _processJSON(res));
      },

      list(threadID) {
        return fetch(`http://localhost:4000/messages/${threadID}`, { headers: _headers(token) })
        .then(res => _processJSON(res));
      },

      accept(threadID, pubKey) {
        return fetch(`http://localhost:4000/threads/${threadID}/accept`, {
          headers: _headers(token),
          body: JSON.stringify({
            public_key: pubKey
          }),
          method: 'PATCH'
        })
        .then(res => _processJSON(res));
      },

      send(threadID, text, messager) {
        return new Promise((resolve, reject) => {
          messager.encrypt(text).then(encrypted => {
            messager.encryptForMe(text).then(senderCopy => {
              fetch(`http://localhost:4000/messages/${threadID}`, {
                headers: _headers(token),
                body: JSON.stringify({
                  encrypted_message: encrypted,
                  sender_copy_message: senderCopy
                }),
                method: 'POST'
              })
              .then(res => _processJSON(res))
              .then(res => resolve(res))
              .catch(err => reject(err));
            })
            .catch(err => reject(err));
          })
          .catch(err => reject(err));
        });
      }
    };
  }
};

export default Api;

module.exports = Api;
