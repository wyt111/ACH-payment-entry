const CryptoJS = require('crypto-js');

/**
 * AES - ECB
 */
// const key = "@ALCHEMY$VPG!J8vq";
// var pwhash = CryptoJS.SHA1(CryptoJS.enc.Utf8.parse(key));
// var newKey = CryptoJS.enc.Hex.parse(pwhash.toString(CryptoJS.enc.Hex).substr(0, 32));
//
// export function AES_Encrypt(word) {
//     let message = CryptoJS.AES.encrypt(word,newKey,{
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7
//     });
//     var ciphertext1 = message.ciphertext.toString(CryptoJS.enc.Hex);
//     var ciphertext = CryptoJS.enc.Hex.parse(ciphertext1);
//     return CryptoJS.enc.Base64.stringify(ciphertext);
// }
//
// export function AES_Decrypt(word) {
//     let newWord = CryptoJS.enc.Base64.parse(word);
//     let dcMessage = CryptoJS.AES.decrypt({ciphertext: newWord},newKey,{
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7
//     }).toString(CryptoJS.enc.Utf8);
//     return dcMessage;
// }

/**
 * AES - CBC
 */
var secretkey = "&ADrs&o5*K%tlxZe5$b3QkVqG!J8vqUS";
var key = CryptoJS.enc.Utf8.parse(secretkey);
var iv = CryptoJS.enc.Utf8.parse(secretkey.substring(0, 16));

/*-- Encryption --*/
export function AES_Encrypt(word) {
    return CryptoJS.AES.encrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

/*-- Decryption --*/
export function AES_Decrypt(word) {
    return  CryptoJS.AES.decrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
}

