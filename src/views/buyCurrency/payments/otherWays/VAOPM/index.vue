<template>
  <div id="indonesianPayment">
    <div class="view-content">
      <!-- 支付倒计时提示 -->
      <div class="payTips" v-if="startPayment">Plese completa payment with <span>{{ paymentCountDownMinute }}</span></div>
      <!-- 费用明细 -->
      <!-- 支付方式 10003-Virtual Account | 10008-OPM -->
      <div class="payAmountInfo-title">Paying with</div>
      <div class="payAmountInfo-box" v-if="routerParams.payWayCode === '10003'">Virtual Account</div>
      <div class="payAmountInfo-box" v-else-if="routerParams.payWayCode === '10008'">OPM</div>
      <!-- 支付方式 VA-Virtual Account | OPM-->
      <VA ref="va_ref" v-if="routerParams.payWayCode === '10003'"/>
      <OPM ref="opm_ref" v-else-if="routerParams.payWayCode === '10008'"/>
      <CryptoCurrencyAddress/>
      <AuthorizationInfo :childData="childData" v-if="AuthorizationInfo_state"/>
      <IncludedDetails/>
    </div>
    <Button :buttonData="buttonData" :disabled="payState" @click.native="submit"></Button>
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
      }
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
      this.routerParams = JSON.parse(this.$route.query.routerParams);
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
      if(submitToken === true && this.routerParams.payWayCode === '10008'){
        this.AuthorizationInfo_state = false;
        this.$refs.opm_ref.OPMpay();
      }
    },
    //order status
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
  destroyed() {
    this.$store.commit("clearToken"); //取消请求
    this.$store.commit("emptyToken"); // 清空token数组
  }
}
</script>

<style lang="scss" scoped>
html,body,#indonesianPayment{
  width: 100%;
  height: 100%;
}
#indonesianPayment{
  padding: 0 0 0.2rem 0;
  display: flex;
  flex-direction: column;
  .view-content{
    flex: 1;
    overflow: auto;
  }
  .payTips{
    margin: 0.2rem 0 0.1rem 0;
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
    min-height: 0.6rem;
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
