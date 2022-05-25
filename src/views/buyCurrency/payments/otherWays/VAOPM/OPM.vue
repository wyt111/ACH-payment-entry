<template>
  <div id="OPM">
    <div class="payAmountInfo-title" v-if="codeState">Payment Code</div>
    <div class="payAmountInfo-box paymentCode" v-if="codeState" @click="copy" :data-clipboard-text="payCode">
      <p>{{ payCode }}</p>
      <p class="copyIcon"><img src="../../../../../assets/images/copyIcon.png"></p>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import { timeDown } from "@/utils/index";

export default {
  name: "OPM",
  data(){
    return{
      routerParams: {},

      payExplain: {},

      paymentCountDown: null,
      paymentCountDownNum: 900,
      paymentCountDownMinute: "15:00",
      paystateTimeOut: null,

      codeState: false,
      payCode: '',
    }
  },
  activated(){
    this.receiveinfo();
  },
  methods:{
    receiveinfo(){
      //Selected Receive local data
      if(sessionStorage.getItem("indonesiaPayment")){
        this.payExplain = JSON.parse(sessionStorage.getItem("indonesiaPayment"));
        this.payCode = this.payExplain.payCode;
        this.$parent.payCode = this.payExplain.payCode;
        this.codeState = true;
        //刷新倒计时
        this.paymentCountDownNum = this.payExplain.paymentCountDownNum;
        this.$parent.paymentCountDownMinute = this.payExplain.paymentCountDownMinute;
        //倒计时状态
        this.$parent.startPayment = true;
        //刷新订单状态
        this.refreshPaystate();
      }
      //存储地址栏信息
      this.routerParams = JSON.parse(this.$route.query.routerParams);
    },

    OPMpay(){
      //place an order
      var params = {
        orderNo: JSON.parse(this.$route.query.routerParams).orderNo,
        phone: ""
      }
      this.$axios.post(this.$api.post_mxnSubmit,params,'submitToken').then(res=>{
        if(res && res.returnCode === '0000'){
          this.$parent.startPayment = true;
          this.refreshPaystate();
          this.payCode = res.data.vaNumber;
          this.$parent.payCode = res.data.vaNumber;
          this.codeState = true;
          this.storeData();
        }
      })
    },

    //查询订单状态
    refreshPaystate(){
      //15 minutes order countdown
      this.paymentCountDown = setInterval(()=>{
        //order overtime
        if(this.paymentCountDownNum === 0){
          this.$router.replace(`/paymentResult?customParam=${JSON.parse(this.$route.query.routerParams).orderNo}`);
        }
        this.$parent.paymentCountDownMinute = timeDown(this.paymentCountDownNum);
        this.paymentCountDownNum -= 1;
        //Real time storage countdown
        this.storeData();
      },1000);

      //Refresh payment status
      this.requestStatus();
      this.paystateTimeOut = setInterval(()=>{
        this.requestStatus();
      },1000);
    },

    //order status
    requestStatus(){
      let params = {
        "orderNo": JSON.parse(this.$route.query.routerParams).orderNo
      }
      this.$axios.get(this.$api.get_payResult,params).then(res=>{
        if(res && res.returnCode === '0000' && res.data.orderStatus > 2 && res.data.orderStatus <= 6){
          this.$router.replace(`/paymentResult?customParam=${JSON.parse(this.$route.query.routerParams).orderNo}`);
        }
      })
    },

    //存储进行中的订单
    storeData(){
      this.payExplain.payCode = this.payCode;
      this.payExplain.paymentCountDownNum = this.paymentCountDownNum;
      this.payExplain.paymentCountDownMinute = this.$parent.paymentCountDownMinute;
      this.payExplain.AuthorizationInfo_state = this.$parent.AuthorizationInfo_state;
      sessionStorage.setItem("indonesiaPayment",JSON.stringify(this.payExplain));
    },

    //复制code
    copy(){
      let clipboard = new Clipboard('.paymentCode');
      clipboard.on('success', () => {
        this.$toast('copy success');
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        clipboard.destroy()
      })
    }
  },
  deactivated(){
    clearInterval(this.paystateTimeOut);
    clearInterval(this.paymentCountDown);
    sessionStorage.removeItem("indonesiaPayment");
  },
}
</script>

<style lang="scss" scoped>
.payAmountInfo-title{
  font-size: 0.14rem;
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  color: #232323;
  margin-top: 0.2rem;
}
.payAmountInfo-box {
  width: 100%;
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
  display: flex;
  align-items: center;
  cursor: pointer;
  p:nth-of-type(1){
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }
  .copyIcon{
    display: flex;
    align-items: center;
    margin-left: auto;
    img{
      width: 0.14rem;
    }
  }
}
.paymentCode{
  font-size: 0.265rem;
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  color: #232323;
  margin-bottom: 0.4rem;
}
</style>
