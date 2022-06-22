import store from "../store";
import axios from "axios";
import { AES_Encrypt } from '@/utils/encryp.js';

//Request service address
const baseUrl = process.env.VUE_APP_BASE_API;

export function querySubmitToken(){
    //Payment or submission interface failed to obtain again 'submit-token'
    let params = {
        "coin": store.state.buyRouterParams.cryptoCurrency,
        "email": localStorage.getItem("email")
    }
    //timestamp and sign
    let timestamp = '';
    if(localStorage.getItem("token")){
        let sign = localStorage.getItem("userId");
        let userId = sign.substring(sign.lastIndexOf("\H")+1,sign.length);
        let userNo = localStorage.getItem("userNo").substring(localStorage.getItem("userNo").length-5);
        timestamp = new Date().getTime();
        let newSign = AES_Encrypt(userId + "-" + userNo + "-" + timestamp);
        localStorage.setItem("sign",newSign);
    }
    return axios({
        method: 'post',
        url: baseUrl + '/crypto/wallet/check',
        data: params,
        headers: {
            'token': localStorage.getItem('token') ? localStorage.getItem('token') : '',
            'sign': localStorage.getItem('sign') ? localStorage.getItem('sign') : '',
            'timestamp': timestamp,
            'Content-Type': 'application/json',
        }
    }).then(res=>{
        if(res.data !== null && res.returnCode === '0000') {
            return true;
        }else{
            return false
        }
    })
}
