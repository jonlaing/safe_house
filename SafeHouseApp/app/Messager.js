'use strict';

import React, {
  AsyncStorage
} from 'react-native';

import keypair from 'keypair';

const privKeyIndex = 'PRIV_KEY';
const pubKeyIndex = 'PUB_KEY';

export default class Messager {
  constructor(username, theirKey = null, theirSig = null) {
    this.username = username;
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
    let keys = keypair();
    console.log(keys);

    return new Promise((resolve, reject) => {
      AsyncStorage.multiSet([[privKeyIndex, keys.private], [pubKeyIndex, keys.public]])
      .then(() => { this.privKey = keys.private; this.pubKey = keys.public; })
      .then(() => resolve({priv: keys.private, pub: keys.public}))
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
    return pgp.encrypt({data: message, publicKeys: key, privateKeys: this.privKey});
  }

  encrypt(message) {
    return this._encrypt(message, this.theirKey);
  }

  encryptForMe(message) {
    return this._encrypt(message, this.pubKey);
  }

  decrypt(cipher) {
    return new Promise((resolve, reject) => {
      if(this.privKey == null) {
        reject(new Error("Key has not been generated"));
        return;
      }

      pgp.decrypt({message: cipher, privateKey: this.key})
      .then((result) => {
        if(this.theirKey === null && result.signatures[0].valid) {
          this.theirKey = result.signatures[0].keyid;
        }

        resolve(result.data);
      })
      .catch(err => reject(err));
    });
  }
}

module.exports = Messager;
