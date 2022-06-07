<template>
  <div id="confirmPayment">
    <div class="confirmPayment-content">
      <div class="payTips" v-if="startPayment">Plese completa payment with <span>{{ paymentCountDownMinute }}</span></div>
      <div class="payAmountInfo-title">Paying with</div>
      <div class="payAmountInfo-box">{{ parameter.payWayName }}</div>
      <!-- QRIS -->
      <div class="QRISView" v-show="parameter.payWayCode === '10004' && qrCodeState">
        <div class="QRISCode" ref="qrCodeUrl"></div>
        <div class="QRISText">Scan QR Code to complete payment</div>
      </div>
      <!-- OVO -->
      <div class="OVOView"  v-if="parameter.payWayCode === '10006'">
        <div class="payAmountInfo-title">Paying with</div>
        <div class="payAmountInfo-box ovoPhone">
          <div class="region">+ 62</div>
          <div class="input"><input type="text" v-model="phone" :disabled="ovoLoading"  oninput ="value=value.replace(/[^0-9]/g,'')" maxlength="10"><sapn class="loading" v-if="ovoLoading"><van-loading color="#1989fa" /></sapn></div>
        </div>
      </div>
      <div class="ovoTips" v-if="parameter.payWayCode === '10006' && startPayment">Open OVO app to complete payment.</div>
      <!-- 选择接收方式的网络地址和名称 -->
      <CryptoCurrencyAddress class="CryptoCurrencyAddress"/>
      <AuthorizationInfo :childData="childData" v-if="AuthorizationInfo_state"/>
      <IncludedDetails class="IncludedDetails"/>
    </div>

    <Button :buttonData="buttonData" :disabled="disabled" @click.native="submit"></Button>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import IncludedDetails from '@/components/IncludedDetails';
import CryptoCurrencyAddress from '@/components/CryptoCurrencyAddress';
import AuthorizationInfo from '@/components/AuthorizationInfo';
import { timeDown } from '@/utils/index';
import {querySubmitToken} from "../../../../utils/publicRequest";

export default {
  // name: "confirmPayment",
  components: { IncludedDetails, CryptoCurrencyAddress, AuthorizationInfo },
  data(){
    return{
      parameter: {},

      phone: "",
      ovoLoading: false,

      qrCodeState: false,
      qrUrl: "",

      startPayment: false,

      paystateTimeOut: null,

      paymentCountDown: null,
      paymentCountDownNum: 900,
      paymentCountDownMinute: "15:00",

      //勾选协议
      childData: {
        agreement: false,
      },
      AuthorizationInfo_state: true,

      //按钮状态
      buttonData: {
        loading: false,
        triggerNum: 0,
        customName: false,
      }
    }
  },
  mounted(){
    this.receiveInfo();
  },
  computed: {
    disabled() {
      if(this.childData.agreement === true){
        return false;
      }else{
        return true;
      }
    }
  },
  methods: {
    receiveInfo(){
      this.parameter = JSON.parse(this.$route.query.routerParams);
      //Restore the data before refreshing the page
      if(sessionStorage.getItem("indonesiaPayment")) {
        let data = JSON.parse(sessionStorage.getItem("indonesiaPayment"));
        this.startPayment = true;
        this.paymentCountDownNum = data.paymentCountDownNum;
        this.paymentCountDownMinute = data.paymentCountDownMinute;
        this.refreshPaystate();
        //QRIS
        if(this.parameter.payWayCode === '10004'){
          this.qrCodeState = true;
          this.qrUrl = data.webUrl;
          this.generateQRcode();
        }
        //OVO
        if(this.parameter.payWayCode === '10006'){
          this.phone = data.phone;
          this.ovoLoading = true;
        }

        this.AuthorizationInfo_state = data.AuthorizationInfo_state;
        this.childData = {
          agreement: true,
        };
        this.buttonData = {
          loading: true,
          triggerNum: 1
        };
      }
    },

    generateQRcode(){
      this.$nextTick(()=>{
        new QRCode(this.$refs.qrCodeUrl, {
          text: this.qrUrl,
          width: 200,
          height: 200,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      })
    },

    async submit(){
      if(this.childData.agreement === false){
        return;
      }
      if(this.buttonData.triggerNum === 1){
        this.AuthorizationInfo_state = false;
        await this.pay();
      }else{
        this.requestStatus();
      }
    },
    async pay(){
      let submitToken = await querySubmitToken();
      if(submitToken === true){
        //DANA、QRIS
        var params = {
          orderNo: JSON.parse(this.$route.query.routerParams).orderNo,
          lastname: "11111"
        }
        //OVO
        if(this.parameter.payWayCode === '10006'){
          params.phone = this.phone;
          this.ovoLoading = true;
        }
        this.$axios.post(this.$api.post_indonesiaBuy,params,'submitToken').then(res=>{
          if(res && res.returnCode === '0000'){
            this.storeData(res);
            //Happy countdown refresh order status
            this.startPayment = true;
            this.refreshPaystate();
            //QRIS
            if(this.parameter.payWayCode === '10004'){
              this.qrCodeState = true;
              this.qrUrl = res.data.webUrl;
              this.generateQRcode();
              return;
            }
            //DANA
            if(this.parameter.payWayCode === '10005'){
              window.location = res.data.webUrl;
              return;
            }
            //OVO
            if(this.parameter.payWayCode === '10006'){
              this.ovoLoading = true;
              return;
            }
          }else{
            this.startPayment = false;
          }
        })
      }
    },

    //Store data to prevent page refresh
    storeData(){
      let newData = {};
      newData.webUrl = this.qrUrl;
      newData.phone = this.phone;
      newData.paymentCountDownMinute = this.paymentCountDownMinute;
      newData.paymentCountDownNum = this.paymentCountDownNum;
      newData.AuthorizationInfo_state = this.AuthorizationInfo_state;
      sessionStorage.setItem("indonesiaPayment",JSON.stringify(newData));
    },

    refreshPaystate(){
      //15 minutes order countdown
      this.paymentCountDown = setInterval(()=>{
        //order overtime
        if(this.paymentCountDownNum === 0){
          this.$router.replace(`/paymentResult?customParam=${JSON.parse(this.$route.query.routerParams).orderNo}`);
        }
        this.paymentCountDownMinute = timeDown(this.paymentCountDownNum);
        this.paymentCountDownNum -= 1;
        this.storeData();
      },1000);
      //Refresh payment status
      this.requestStatus();
      this.paystateTimeOut = setInterval(()=>{
        this.requestStatus();
      },1000);
    },
    requestStatus(){
      let params = {
        "orderNo": JSON.parse(this.$route.query.routerParams).orderNo
      }
      this.$axios.get(this.$api.get_payResult,params).then(res=>{
        if(res && res.returnCode === '0000' && res.data.orderStatus > 2 && res.data.orderStatus <= 6){
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${JSON.parse(this.$route.query.routerParams).orderNo}`);
        }
      })
    },
  },
  destroyed(){
    clearInterval(this.paystateTimeOut);
    clearInterval(this.paymentCountDown);
    sessionStorage.removeItem("indonesiaPayment");
  },
}
</script>

<style lang="scss" scoped>
#confirmPayment{
  position: relative;
  display: flex;
  flex-direction: column;
  .confirmPayment-content{
    flex: 1;
    overflow: auto;
  }
  .payTips{
    padding: 0.1rem 0;
    font-size: 0.16rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #232323;
    span{
      color: #FF0000;
    }
  }
  .payAmountInfo-title{
    font-size: 0.14rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #232323;
    margin-top: 0.2rem;
  }
  .payAmountInfo-box {
    margin-top: 0.1rem;
    height: 0.6rem;
    background: #F3F4F5;
    border-radius: 10px;
    font-size: 0.16rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #232323;
    line-height: 0.6rem;
    padding: 0 0.2rem;
  }
}

.QRISView{
  margin-bottom: 0.2rem;
  .QRISCode{
    min-height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.4rem;
  }
  .QRISText{
    font-size: 0.15rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #232323;
    text-align: center;
    margin-top: 0.2rem;
  }
}

.ovoPhone{
  display: flex;
  align-items: center;
  min-height: 0.3rem !important;
  line-height: 0.33rem !important;
  padding: 0.15rem 0 !important;
  .region{
    min-width: 0.75rem;
    text-align: center;
    border-right: 1px solid #979797;
  }
  .input{
    width: 100%;
    display: flex;
    position: relative;
    input{
      display: flex;
      padding: 0 0.2rem;
      border: none;
      width: 100%;
      background: #F3F4F5;
      letter-spacing: 4px;
    }
  }
  .loading{
    position: absolute;
    right: 0.2rem;
    width: 0.3rem;
    height: 0.3rem;
  }
}
.ovoTips{
  font-size: 0.16rem;
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  color: #4479D9;
  margin-top: 0.1rem;
  margin-bottom: 0.2rem;
}

.CryptoCurrencyAddress{
  margin-top: 0.4rem;
}
</style>
