/*global fetch, navigator */
import React from 'react-native';

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
      login(username, password) {
        return fetch('http://localhost:4000/login', {
          headers: _headers(),
          method: 'POST',
          body: JSON.stringify({
            username: username,
            password: password
          })
        })
        .then(resp => _processJSON(resp));
      },

      _signUp(user) {
        return new Promise((resolve, reject) => {
          fetch('http://localhost:4000/signup', {
            headers: _headers(),
            method: 'POST',
            body: JSON.stringify(user)
          })
          .then(resp => _processJSON(resp))
          .then(resp => resolve(resp))
          .catch(err => {
            err.response.json()
            .then(d => reject(d))
            .catch(() => reject(err));
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
      list(page, distance = 25, units = 0) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition((pos) => {
            let search = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              distance: distance,
              duration: 0,
              units: units,
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
  }
};

export default Api;

module.exports = Api;
