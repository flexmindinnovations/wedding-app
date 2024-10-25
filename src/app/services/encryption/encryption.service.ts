import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey = '3vRDXoCdi9PYZvc2EdncXv19QmjXPHZxhgcL+0DcLzw=';  // Replace with your actual secret key

  constructor() { }

  // Function to encrypt data
  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  // Function to decrypt data
  decryptData(cipherText: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
