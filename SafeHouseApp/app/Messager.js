'use strict';

import React, {
  AsyncStorage
} from 'react-native';

import RSAKey from 'react-native-rsa';

const privKeyIndex = 'PRIV_KEY';
const pubKeyIndex = 'PUB_KEY';

export default class Messager {
  constructor(theirKey = null, theirSig = null) {
    this.rsa = new RSAKey();
    this.privKey = null;
    this.pubKey = null;
    this.theirKey = theirKey;
    this.theirSig = theirSig;
  }

  setTheirKey(key) {
    this.theirKey = key;
  }

  getKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.multiGet([privKeyIndex, pubKeyIndex])
      .then((keys) => {
        let privKey, pubKey;
        keys.map((k, i, key) => {
          if(key[i][0] === privKeyIndex) {
            privKey = key[i][1];
          }

          if(key[i][0] === pubKeyIndex) {
            pubKey = key[i][1];
          }
        });

        if(privKey === undefined || pubKey === undefined || privKey === null || pubKey === null) {
          throw new Error("Undefined keys");
        }

        this.privKey = privKey;
        this.pubKey = pubKey;

        resolve({priv: privKey, pub: pubKey});
      })
      .catch(() => {
        this.genKeys().then((keys) => resolve(keys))
        .catch(err => reject(err));
      });
    });
  }

  genKeys() {
    const bits = 1024;
    const exponent = '10001'; // must be a string. This is hex string. decimal = 65537
    this.rsa.generate(bits, exponent);

    let pub = this.rsa.getPublicString();
    let priv = this.rsa.getPrivateString();

    return new Promise((resolve, reject) => {
      AsyncStorage.multiSet([[privKeyIndex, priv], [pubKeyIndex, pub]])
      .then(() => { this.privKey = priv; this.pubKey = pub; })
      .then(() => resolve({priv: priv, pub: pub}))
      .catch(err => reject(err));
    });
  }

  publicKey() {
    if(this.pubKey === undefined || this.pubKey === null) {
      throw new Error("Public Key not set");
    }

    return this.pubKey;
  }

  _encrypt(message, key) {
    if(key === undefined || key === null) {
      throw new Error("key not set");
    }

    this.rsa.setPublicString(key);
    let encrypted = this.rsa.encrypt(message);

    if(encrypted === null) {
      throw new Error("Couldn't encrypt message");
    }

    return encrypted;
  }

  encrypt(message) {
    return this._encrypt(message, this.theirKey);
  }

  encryptForMe(message) {
    return this._encrypt(message, this.pubKey);
  }

  decrypt(cipher) {
    if(this.privKey === null) {
      throw new Error("Key has not been generated");
    }

    this.rsa.setPrivateString(this.privKey);
    let decrypted = this.rsa.decrypt(cipher);

    if(decrypted === null) {
      throw new Error("Couldn't decrypt message");
    }

    return decrypted;
  }
}

module.exports = Messager;
