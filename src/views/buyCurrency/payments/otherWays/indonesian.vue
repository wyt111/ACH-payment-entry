<template>
  <div id="confirmPayment">
    <div class="confirmPayment-content">
      <div class="payTips" v-if="startPayment">{{ $t('nav.buy_configPayIDR_timeDownTips') }} <span>{{ paymentCountDownMinute }}</span></div>
      <div class="payAmountInfo-title">{{ $t('nav.buy_configPay_title1') }}</div>
      <div class="payAmountInfo-box">{{ parameter.payWayName }}</div>
      <!-- QRIS -->
      <div class="QRISView" v-show="parameter.payWayCode === '10004' && qrCodeState">
        <div class="QRISCode" ref="qrCodeUrl"></div>
        <div class="QRISText">{{ $t('nav.buy_configPayIDR_codeTips') }}</div>
      </div>
      <!-- OVO -->
      <div class="OVOView"  v-if="parameter.payWayCode === '10006'">
        <div class="payAmountInfo-title">{{ $t('nav.buy_configPayIDR_ovo_title') }}</div>
        <div class="payAmountInfo-box ovoPhone">
          <div class="region">+ 62</div>
          <div class="input">
            <van-field class="number_input" type="digit" v-model="phone" :disabled="ovoLoading" maxlength="12"/>
            <sapn class="loading" v-if="ovoLoading"><van-loading color="#1989fa" /></sapn>
          </div>
        </div>
      </div>
      <div class="ovoTips" v-if="parameter.payWayCode === '10006' && startPayment">{{ $t('nav.buy_configPayIDR_ovo_phoneTips') }}</div>
      <!-- 选择接收方式的网络地址和名称 -->
      <CryptoCurrencyAddress class="CryptoCurrencyAddress"/>
      <IncludedDetails class="IncludedDetails" ref="includedDetails_ref" :class="{'IncludedDetails_top': AuthorizationInfo_state===false}"/>
      <AuthorizationInfo class="AuthorizationInfo" :childData="childData" v-if="AuthorizationInfo_state"/>
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
  name: "confirmPayment",
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
  beforeRouteLeave(to,from,next){
    if(to.path !== '/tradeHistory' && to.path !== '/paymentResult'){
      sessionStorage.removeItem("indonesiaPayment");
    }
    next()
  },
  mounted(){
    this.receiveInfo();
  },
  destroyed(){
    this.$store.commit("clearToken"); //取消请求
    this.$store.commit("emptyToken"); // 清空token数组
    window.clearInterval(this.paystateTimeOut);
    window.clearInterval(this.paymentCountDown);
    this.paystateTimeOut = null;
    this.paymentCountDown = null;
  },
  computed: {
    disabled() {
      if(this.childData.agreement === true && (this.parameter.payWayCode === '10005' || this.parameter.payWayCode === '10004')){
        return false;
      }else if(this.childData.agreement === true && this.phone !== '' && this.parameter.payWayCode === '10006'){
        return false;
      }else{
        return true;
      }
    }
  },
  methods: {
    receiveInfo(){
      this.parameter = this.$store.state.buyRouterParams;
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
          triggerNum: 1,
          customName: false,
        };
      }
    },

    generateQRcode(){
      this.$nextTick(()=>{
        new QRCode(this.$refs.qrCodeUrl, {
          text: this.qrUrl,
          width: 140,
          height: 140,
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
          orderNo: this.$store.state.buyRouterParams.orderNo,
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
          this.$router.replace(`/paymentResult?customParam=${this.$store.state.buyRouterParams.orderNo}`);
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
        "orderNo": this.$store.state.buyRouterParams.orderNo
      }
      this.$axios.get(this.$api.get_payResult,params).then(res=>{
        if(res && res.returnCode === '0000' && (res.data.orderStatus === 0 || (res.data.orderStatus > 2 && res.data.orderStatus <= 6))){
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.$store.state.buyRouterParams.orderNo}`);
        }
      })
    },
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
    font-size: 0.13rem;
    font-family: "GeoLight", GeoLight;
    font-weight: normal;
    color: #232323;
    span{
      color: #E55643;
    }
  }
  .payAmountInfo-title{
    font-size: 0.13rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
    color: #707070;
    margin-top: 0.32rem;
  }
  .payAmountInfo-box {
    margin-top: 0.08rem;
    height: 0.56rem;
    background: #F3F4F5;
    border-radius: 0.12rem;
    font-size: 0.16rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
    color: #232323;
    line-height: 0.6rem;
    padding: 0 0.16rem;
  }
}

.QRISView{
  .QRISCode{
    min-height: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.16rem;
  }
  .QRISText{
    font-size: 0.13rem;
    font-family: "GeoLight", GeoLight;
    font-weight: normal;
    color: #232323;
    text-align: center;
    margin-top: 0.08rem;
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
    border-right: 1px solid #E6E6E6;
    font-size: 0.16rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
    color: #232323;
  }
  .input{
    width: 100%;
    display: flex;
    position: relative;
    input{
      display: flex;
      padding: 0 0.16rem;
      border: none;
      width: 100%;
      background: #F3F4F5;
      font-size: 0.16rem;
      font-family: "GeoRegular", GeoRegular;
      font-weight: normal;
      color: #232323;
      letter-spacing: 4px;
    }
  }
  .loading{
    position: absolute;
    top: 0.07rem;
    right: 0.16rem;
    width: 0.24rem;
    height: 0.24rem;
  }
}
.ovoTips{
  font-size: 0.15rem;
  font-family: "GeoRegular", GeoRegular;
  font-weight: normal;
  color: #0059DA;
  margin-top: 0.08rem;
}

.CryptoCurrencyAddress{
  margin-top: 0.2rem;
}

.IncludedDetails{
  margin-top: 0.32rem;
}

.AuthorizationInfo{
  margin-top: 0.16rem;
  //margin-bottom: 0.2rem;
}

.number_input{
  background: #F3F4F5;
}
.number_input ::v-deep .van-field__control{
  letter-spacing: 4px !important;
}
</style>
