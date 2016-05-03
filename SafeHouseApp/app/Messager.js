'use strict';

import {
  AsyncStorage
} from 'react-native';

import cryptico from 'cryptico';

const privKey = 'PRIV_KEY';

class Messager {
  constructor(username, theirKey = null, theirSig = null) {
    this.key = null;
    this.theirKey = theirKey;
    this.theirSig = theirSig;

    this.getKey().then(key => this.key = key)
    .catch(() => {
      this.genKey(username).then(key => this.key = key)
      .catch(err => { throw err; });
    });
  }

  getKey() {
    return AsyncStorage.getItem(privKey);
  }

  genKey(username) {
    let priv = cryptico.generateRSAKey(username, 1024);

    return AsyncStorage.setItem(privKey, priv);
  }

  publicKey() {
    if(this.publicKey === undefined) {
      this.publicKey = cryptico.publicKeyString(this.key);
    }

    return this.publicKey;
  }

  _encrypt(message, key) {
    return new Promise((resolve, reject) => {
      if(this.key === null) {
        reject(new Error("Key has not been generated"));
        return;
      }

      if(this.theirKey === null) {
        reject(new Error("Unknown public key"));
      }

      let encrypted = cryptico.encrypt(message, key, this.key);

      if(encrypted.status !== "success") {
        reject(new Error("Couldn't encrypt message with provided keys"));
        return;
      }

      resolve(encrypted.cipher);
    });
  }

  encrypt(message) {
    return this._encrypt(message, this.theirKey);
  }

  encryptForMe(message) {
    return this._encrypt(message, this.key);
  }

  decrypt(cipher) {
    return new Promise((resolve, reject) => {
      if(this.key == null) {
        reject(new Error("Key has not been generated"));
        return;
      }

      let decrypted = cryptico.decrypt(cipher, this.key);

      if(decrypted.status !== "success") {
        reject(new Error("Couldn't decrypt message with provided key"));
        return;
      }

      if(this.theirKey === null) {
        this.theirKey = decrypted.publicKeyString;
      }

      if(this.theirSig === null) {
        this.theirSig = decrypted.signature;
      }

      resolve(decrypted.plaintext);
    });
  }
}

export default Messager;

module.exports = Messager;
