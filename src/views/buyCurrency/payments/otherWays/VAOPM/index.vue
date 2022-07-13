<template>
  <div id="indonesianPayment">
    <!-- 支付倒计时提示 -->
    <div class="payTips" v-if="startPayment && routerParams.payWayCode === '10003'">{{ $t('nav.buy_configPayIDR_timeDownTips') }} <span>{{ paymentCountDownMinute }}</span></div>
    <!-- 费用明细 -->
    <!-- 支付方式 10003-Virtual Account | 10008-OPM -->
    <div class="payAmountInfo-title">{{ $t('nav.buy_configPay_title1') }}</div>
    <div class="payAmountInfo-box" v-if="routerParams.payWayCode === '10003'">Virtual Account</div>
    <div class="payAmountInfo-box" v-else-if="routerParams.payWayCode === '10008'">OPM</div>
    <!-- 支付方式 VA-Virtual Account | OPM-->
    <VA ref="va_ref" v-if="routerParams.payWayCode === '10003'"/>
    <OPM ref="opm_ref" v-else-if="routerParams.payWayCode === '10008'"/>
    <CryptoCurrencyAddress/>
    <IncludedDetails class="includedDetails" ref="includedDetails_ref"/>
    <AuthorizationInfo class="authorizationInfo" :childData="childData" v-if="AuthorizationInfo_state"/>
    <!-- 墨西哥支付确认弹框 -->
    <div class="routerMenu_loginOut" v-show="MEXConfirmState" @click="MEXConfirmState=false">
      <div class="content" @click.stop="show=true">
        <h2>{{ $t('nav.buy_configPay_title3') }}</h2>
        <div @click="MEXConfirmOut">{{ $t('nav.buy_configPay_title4') }} <img src="@/assets/images/slices/rightIcon.png" alt=""></div>
        <p @click.stop="MEXConfirmState=false">{{ $t('nav.buy_configPay_title5') }}</p>
      </div>
    </div>
    <!-- 墨西哥支付按钮 -->
    <button class="continue" @click="MEXConfirmState = true" v-if="routerParams.payWayCode === '10008'">
      {{ $t('nav.queryOderState') }}
      <img class="rightIcon" src="@/assets/images/button-right-icon.svg">
    </button>
    <!-- I confirm that the payment has been completed.-->
    <Button :buttonData="buttonData" :disabled="payState" @click.native="submit" v-else></Button>
  </div>
</template>

<script>
import { querySubmitToken } from "../../../../../utils/publicRequest";
import CryptoCurrencyAddress from '@/components/CryptoCurrencyAddress';
import AuthorizationInfo from '@/components/AuthorizationInfo';
import IncludedDetails from '@/components/IncludedDetails';
import VA from './VA';
import OPM from './OPM';

export default {
  name: "",
  components: { VA, OPM, CryptoCurrencyAddress, AuthorizationInfo, IncludedDetails },
  data(){
    return{
      routerParams: {},

      //VA支付卡信息
      payExplain: [],

      //卡验证码 - 功能:复制验证码
      payCode: '',
      //支付倒计时
      paymentCountDownMinute:  "15:00",
      //支付倒计时状态
      startPayment: false,

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
      },

      MEXConfirmState: false,
    }
  },
  computed: {
    //确认按钮状态
    payState() {
      // pay methods 10003-Virtual Account | 10008-OPM
      if(this.routerParams.payWayCode === '10003'){
        if(this.payExplain.length !== 0 && this.childData.agreement === true){
          return  false;
        }
        return true;
      }
      if(this.routerParams.payWayCode === '10008' && this.childData.agreement === true){
        return false;
      }else if(this.routerParams.payWayCode === '10008' && this.childData.agreement === false){
        return true;
      }
    }
  },
  mounted() {
    this.receiveInfo();
  },
  methods: {
    receiveInfo(){
      this.routerParams = this.$store.state.buyRouterParams;
      if(this.routerParams.payWayCode === '10008') {
        this.MEXPay();
      }
      //还原刷新前数据状态
      if(sessionStorage.getItem("indonesiaPayment")) { // && this.routerParams.payWayCode === '10003'
        this.payExplain = JSON.parse(sessionStorage.getItem("indonesiaPayment"));
        this.AuthorizationInfo_state = JSON.parse(sessionStorage.getItem("indonesiaPayment")).AuthorizationInfo_state;
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
    async submit(){
      if(this.childData.agreement === false){
        return;
      }
      if(this.buttonData.triggerNum === 1){
        await this.pay();
      }else{
        this.requestStatus();
      }
    },
    async pay(){
      // pay methods 10003-Virtual Account | 10008-OPM
      let submitToken = await querySubmitToken();
      if(submitToken === true && this.routerParams.payWayCode === '10003'){
        this.AuthorizationInfo_state = false;
        this.$refs.va_ref.VAPay();
        return;
      }
    },
    //墨西哥支付
    async MEXPay(){
      let submitToken = await querySubmitToken();
      if(submitToken === true){
        this.AuthorizationInfo_state = false;
        this.$refs.opm_ref.OPMpay();
      }
    },
    async MEXConfirmOut(){
      this.$router.push('/tradeHistory');
    },
    //order status
    requestStatus(){
      let params = {
        "orderNo": this.$store.state.buyRouterParams.orderNo
      }
      this.$axios.get(this.$api.get_payResult,params).then(res=>{
        if(res && res.returnCode === '0000' && res.data.orderStatus > 2 && res.data.orderStatus <= 6){
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.$store.state.buyRouterParams.orderNo}`);
        }
      })
    },
  },
  destroyed() {
    this.$store.commit("clearToken"); //取消请求
    this.$store.commit("emptyToken"); // 清空token数组
  }
}
</script>

<style lang="scss" scoped>
//html,body,#indonesianPayment{
//  width: 100%;
//  height: 100%;
//}
#indonesianPayment{
  //display: flex;
  //flex-direction: column;
  //.view-content{
  //  flex: 1;
  //  overflow: auto;
  //}
  .payTips{
    margin: 0.08rem 0 0.1rem 0;
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
    padding-top: 0.32rem !important;
  }

  .payAmountInfo-box {
    margin-top: 0.1rem;
    min-height: 0.56rem;
    background: #F3F4F5;
    border-radius: 0.12rem;
    font-size: 0.16rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #232323;
    line-height: 0.6rem;
    padding: 0 0.16rem;
  }

  .includedDetails{
    margin-top: 0.32rem;
  }
  .authorizationInfo{
    margin-bottom: 0.2rem;
  }

  .routerMenu_loginOut{
    z-index: 1;
    width: 100%;
    height: 100%;
    background: #00000080;
    position: fixed;
    left: 0;
    top: 0;
    .content{
      width: 90%;
      //height: 2.6rem;
      max-width: 3.5rem;
      background: #FFFFFF;
      border-radius: 16px;
      position: absolute;
      left:50%;
      top: 50%;
      transform: translate(-50%,-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: .4rem 0 0 0;
      box-sizing: border-box;
      h2{
        //width: 2.4rem;
        text-align: center;
        font-weight: normal;
        color: #232323;
        line-height: .31rem;
        font-family: GeoDemibold;
        font-size: .21rem;
      }
      div{
        width: 90%;
        height: .58rem;
        background: #E55643;
        border-radius: .29rem;
        text-align: center;
        line-height: .58rem;
        position: relative;
        font-size: .17rem;
        font-weight: normal;
        color: #FFFFFF;
        font-family: GeoRegular;
        margin-top: .05rem;
        cursor: pointer;
        img{
          width: .24rem;
          position: absolute;
          right: .16rem;
          top: .17rem;
        }
      }
      p{
        width: 90%;
        height: .56rem;
        text-align: center;
        font-weight: normal;
        color: #232323;
        font-family: GeoDemibold;
        font-size: .17rem;
        margin-top: .24rem;
        cursor: pointer;
      }
    }
  }
  .continue{
    width: 100%;
    height: 0.58rem;
    background: #0059DA;
    border-radius: 0.29rem;
    font-size: 0.17rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
    color: #FFFFFF;
    margin-top: 0.16rem;
    cursor: pointer;
    border: none;
    position: relative;
    .rightIcon{
      width: 0.24rem;
      position: absolute;
      top: 0.17rem;
      right: 0.16rem;
      font-size: 0.12rem;
    }
    .loadingIcon{
      top: 0.15rem;
    }
  }
  .continue:disabled{
    background: rgba(0, 89, 218, 0.5);
    cursor: no-drop;
  }
}

@keyframes loadingIcon {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: no-preference) {
  .loadingIcon {
    animation: loadingIcon infinite 2s linear;
  }
}
</style>
