const CryptoJS = require('crypto-js');

const key = "@ALCHEMY$VPG!J8vq";
var pwhash = CryptoJS.SHA1(CryptoJS.enc.Utf8.parse(key));
var newKey = CryptoJS.enc.Hex.parse(pwhash.toString(CryptoJS.enc.Hex).substr(0, 32));

export function AES_Encrypt(word) {
    let message = CryptoJS.AES.encrypt(word,newKey,{
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    var ciphertext1 = message.ciphertext.toString(CryptoJS.enc.Hex);
    var ciphertext = CryptoJS.enc.Hex.parse(ciphertext1);
    return CryptoJS.enc.Base64.stringify(ciphertext);
}

export function AES_Decrypt(word) {
    let newWord = CryptoJS.enc.Base64.parse(word);
    let dcMessage = CryptoJS.AES.decrypt({
      ciphertext: newWord
    },newKey,{
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    return dcMessage;
}
