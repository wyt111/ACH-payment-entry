import axios from 'axios';
import { Toast } from 'vant';
import router from "../router";
import store from '../store/index';
import { AES_Decrypt, AES_Encrypt } from '@/utils/encryp.js';

//Request service address
const baseUrl = process.env.VUE_APP_BASE_API;

//Encrypted sign
/**
 * sign - Encryption and decryption rules
 * Sign encryption/decryption key：@ALCHEMY$VPG!J8vq
 * Sign encryption/Decryption algorithm：通过AES/ECB/PKCS5Padding
 * The content of the generated sign is：userId - Last 5 digits of userno - timestamp，eg：12345678-12345-1645427147261
 * After successful decryption and login，You can get userId from sign,Remove the ACh from the decrypted content of the sign is userId，eg：ACH12345 delete ACH = userId=12345
 */
var timestamp = '';
function processSign_encryption(){
  if(localStorage.getItem("token")){
    let sign = localStorage.getItem("userId");
    let userId = sign.substring(sign.lastIndexOf("\H")+1,sign.length);
    let userNo = localStorage.getItem("userNo").substring(localStorage.getItem("userNo").length-5);
    timestamp = new Date().getTime();
    let newSign = AES_Encrypt(userId + "-" + userNo + "-" + timestamp);
    localStorage.setItem("sign",newSign);
  }
}

//Request status
function requestPrompt(response){
  if (response) {
    // The request is executed and the server responds with a status code
    switch (response.returnCode) {
      case "70006":
        Toast({
          duration: 3000,
          message: response.returnMsg
        });
        break;
      case "70003":
        Toast({
          duration: 3000,
          message: response.returnMsg
        });
        break;
      case "10003":
        Toast({
          duration: 3000,
          message: response.returnMsg
        });
        break;
      //pay card form
      case "10005":
        Toast({
          duration: 3000,
          message: response.returnMsg
        });
        break;
      case "80007":
        Toast({
          duration: 3000,
          message: response.returnMsg
        });
        break;
      //买币表单 - 中国卡提示
      case "10004":
        Toast({
          duration: 3000,
          message: response.returnMsg
        });
        break;
      //登陆获取验证码超过5次提示
      case "1025":
        Toast({
          duration: 3000,
          message: response.returnMsg
        });
        break;
    }
  }
}

//request interceptor
axios.interceptors.request.use(function (config) {
  config.cancelToken = new axios.CancelToken(function (cancel) {
    store.commit('pushToken', {cancelToken: cancel})
  })
  return config
  // return config;
}, function (error) {
  return Promise.reject(error)
});

//Response interceptor
axios.interceptors.response.use(function (response) {
  //token effect: Login information verification
  if(response.config.url === process.env.VUE_APP_BASE_API + '/user/login' && response.data.data !== null){
    localStorage.setItem("userId",AES_Decrypt(response.headers.sign));
    localStorage.setItem("token",response.headers.token);
    localStorage.setItem("email",response.data.data.email);
    localStorage.setItem("userNo",response.data.data.userNo);
    localStorage.setItem("kycStatus",response.data.data.kycStatus);
  }

  //token effect: Multiple trigger interface verification
  if(response.config.url !== process.env.VUE_APP_BASE_API + '/user/login' && response.headers.token){
    localStorage.setItem("submit-token",response.headers.token);
  }

  //no login info
  if((response.data.returnCode === '70006' || response.data.returnCode === '70008') && router.currentRoute.path !== '/emailCode'){
    localStorage.removeItem("sign");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userNo");
    localStorage.removeItem("userId");
    localStorage.removeItem("kycStatus");
    if(fromRouter === '/receivingMode' && toRouter === '/'){
      router.replace(`/emailCode`);
      return;
    }
    if(fromRouter === '/tradeHistory'){
      router.replace('/emailCode?fromName=tradeList');
      return;
    }
    router.replace('/emailCode');
  }
  //Request callback prompt
  requestPrompt(response.data);
  return response.data
});

axios.defaults.timeout = 30000; // Set the request timeout (MS) to no more than half a minute

//Store which route to jump over
var fromRouter = '';
var toRouter = '';
router.beforeEach((from,to,next)=>{
  fromRouter = from.path;
  toRouter = to.path;
  next();
})

export default {
  /**
   *
   * @param requestUrl  Interface address
   * @param submitToken Submit Token
   * @param params Interface parameters (object)
   * @returns {Q.Promise<any>}
   */
  post(requestUrl, params, submitToken) {
    processSign_encryption();
    return axios({
      method: 'post',
      url: baseUrl + requestUrl,
      data: params,
      headers: {
        'token': localStorage.getItem('token') ? localStorage.getItem('token') : '',
        'sign': localStorage.getItem('sign') ? localStorage.getItem('sign') : '',
        'timestamp': timestamp,
        'submit-token': submitToken === 'submitToken' ? localStorage.getItem("submit-token") : '',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.returnCode === "0000") {
        return Promise.resolve(response);
      }
      // else {
        // Toast(response.returnMsg);
        // return Promise.reject('data');
      // }
    }).catch(error => {
      console.log('failed', error);
    })
  },

  /**
   *
   * @param requestUrl  Interface address
   * @param params Interface parameters (object)
   * @returns {Q.Promise<any>}
   */
  get(requestUrl, params) {
    processSign_encryption();
    return axios({
      method: 'get',
      url: baseUrl + requestUrl,
      params: params,
      headers: {
        'token': localStorage.getItem('token') ? localStorage.getItem('token') : '',
        'sign': localStorage.getItem('sign') ? localStorage.getItem('sign') : '',
        'timestamp': timestamp,
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      if (response.returnCode === "0000") {
        return Promise.resolve(response);
      }
      // else {
        // Toast(response.returnMsg);
        // return Promise.reject(response);
      // }
    }).catch(function (error) {
      console.log('failed', error);
    });
  },

  /**
   *
   * @param url  Interface address
   * @param params Interface parameters (object)
   * @param Mainly used for login
   * @returns {Q.Promise<any>}
   */
  // postForm(url, params){
  //   return axios({
  //     method: 'post',
  //     url: url,
  //     params: params,
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     }
  //   }).then((response) => {
  //     // debugger;
  //     if (response.returnCode === "0000") {
  //       return Promise.resolve(response);
  //     } else {
  //       this.$toast(response.returnMsg);
  //       return Promise.reject('data');
  //     }
  //   }).catch(function (error) {
  //     console.log('failed', error);
  //   });
  // },
}
