<template>
  <div id="confirmPayment">
    <div class="confirmPayment-content">
      <div class="payTips" v-if="startPayment">Plese completa payment with <span>{{ paymentCountDownMinute }}</span></div>
      <indonesianDetails/>
      <div class="payAmountInfo-title">Payment Method</div>
      <div class="payAmountInfo-box">{{ parameter.payWayName }}</div>
      <!-- QRIS -->
      <div class="QRISView" v-show="parameter.payWayCode === '10004' && qrCodeState">
        <div class="QRISCode" ref="qrCodeUrl"></div>
        <div class="QRISText">Scan QR Code to complete payment</div>
      </div>
      <!-- OVO -->
      <div class="OVOView"  v-if="parameter.payWayCode === '10006'">
        <div class="payAmountInfo-title">Payment Method</div>
        <div class="payAmountInfo-box ovoPhone">
          <div class="region">+ 62</div>
          <div class="input"><input type="number" v-model="phone"><sapn class="loading" v-if="ovoLoading"><van-loading color="#1989fa" /></sapn></div>
        </div>
      </div>
      <div class="ovoTips"  v-if="parameter.payWayCode === '10006' && startPayment">Open OVO app to complete payment.</div>
    </div>

    <div class="continue" @click="submit" v-if="!startPayment">Continue to PAY</div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import indonesianDetails from '@/components/indonesianDetails';
import { timeDown } from '@/utils/index';

export default {
  name: "confirmPayment",
  components: { indonesianDetails },
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
      paymentCountDownMinute: "15:00"
    }
  },
  mounted(){
    this.receiveInfo();
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
      }
    },

    generateQRcode(){
      new QRCode(this.$refs.qrCodeUrl, {
        text: this.qrUrl,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    },

    submit(){
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
            // window.open(res.data.webUrl);
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
    },

    //Store data to prevent page refresh
    storeData(){
      let newData = {};
      newData.webUrl = this.qrUrl;
      newData.phone = this.phone;
      newData.paymentCountDownMinute = this.paymentCountDownMinute;
      newData.paymentCountDownNum = this.paymentCountDownNum;
      sessionStorage.setItem("indonesiaPayment",JSON.stringify(newData));
    },

    refreshPaystate(){
      //15 minutes order countdown
      this.paymentCountDown = setInterval(()=>{
        //order overtime
        if(this.paymentCountDownNum === 0){
          this.$router.replace(`/paymentReSult?routerParams=${this.$route.query.routerParams}&orderNo=${JSON.parse(this.$route.query.routerParams).orderNo}`);
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
          this.$router.replace(`/paymentReSult?routerParams=${this.$route.query.routerParams}&orderNo=${JSON.parse(this.$route.query.routerParams).orderNo}`);
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
  //padding: 0.4rem 0 0 0;
  display: flex;
  flex-direction: column;
  .confirmPayment-content{
    flex: 1;
    overflow: auto;
  }
  .payTips{
    //position: fixed;
    //top: 0.1rem;
    padding: 0.1rem 0;
    font-size: 0.16rem;
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #232323;
    span{
      color: #FF0000;
    }
  }
  .payAmountInfo-title{
    font-size: 0.14rem;
    font-family: Jost-Medium, Jost;
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
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #232323;
    line-height: 0.6rem;
    padding: 0 0.2rem;
  }
}

.QRISView{
  .QRISCode{
    min-height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.4rem;
  }
  .QRISText{
    font-size: 0.15rem;
    font-family: Jost-Medium, Jost;
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
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #232323;
  margin-top: 0.1rem;
}

.continue{
  height: 0.6rem;
  line-height: 0.6rem;
  text-align: center;
  background: #4479D9;
  border-radius: 4px;
  font-size: 0.18rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #FAFAFA;
  margin: 0.2rem 0;
}
</style>
