import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  algorithm = 'aes-256-ctr';
  key = 'utgfj980274938hrfhf983274391ehfk';
  iv = 'fbcfbba96206875d';

  constructor() {}

  encrypt(data: any): any {
    try {
      let input = JSON.stringify(data);
      let cipher = crypto.AES.encrypt(input, crypto.enc.Utf8.parse(this.key), {
        iv: crypto.enc.Utf8.parse(this.iv),
        padding: crypto.pad.Pkcs7,
        mode: crypto.mode.CBC,
      });
      const output = cipher.toString();
      var rdata = {};
      rdata['data'] = output;
      // console.log('rdata',rdata);
      return rdata;
    } catch (e) {
      console.log(e);
    }
  }
  decrypt(textToDecrypt: string) {
    var decrypted = crypto.AES.decrypt(
      textToDecrypt,
      crypto.enc.Utf8.parse(this.key),
      {
        iv: crypto.enc.Utf8.parse(this.iv),
      }
    );
    let output = decrypted.toString(crypto.enc.Utf8);
    return output;
  }
}
