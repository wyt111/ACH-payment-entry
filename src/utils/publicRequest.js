import store from "../store";
import axios from "axios";
import { AES_Encrypt } from '@/utils/encryp.js';
// import moment from 'moment-timezone';

//Request service address
const baseUrl = process.env.VUE_APP_BASE_API;

/**
 * 提交订单、确认订单前获取submit-token公共接口
 * @returns 获取成功返回true，失败则是fasle
 */
export function querySubmitToken(){
    let params = {
        "coin": store.state.buyRouterParams.cryptoCurrency,
        "email": localStorage.getItem("email")
    }
    //请求接口请求头信息
    let timestamp = '';
    if(localStorage.getItem("token")){
        let sign = localStorage.getItem("userId");
        let userId = sign.substring(sign.lastIndexOf("H")+1,sign.length);
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
            timezone: moment.tz.guess(),
        }
    }).then(res=>{
        if(res.data !== null && res.returnCode === '0000') {
            return true;
        }else{
            return false
        }
    }).catch(()=>{
        return false
    })
}
