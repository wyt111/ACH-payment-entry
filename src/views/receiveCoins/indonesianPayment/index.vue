<template>
  <div id="indonesianPayment">
    <div class="view-content">
      <div class="payTips" v-if="startPayment">Plese completa payment with <span>{{ paymentCountDownMinute }}</span></div>
      <indonesianDetails />
      <!-- pay methods -->
      <div class="payAmountInfo-title">Payment Method</div>
      <div class="payAmountInfo-box">Virtual Account</div>
      <!-- choise bank -->
      <div class="payAmountInfo-title">BANK</div>
      <div class="payAmountInfo-box" v-if="bankState">
        <div class="payAmountInfo-box-line" v-for="(item,index) in bankCardList" :key="index" @click="choiseBankCard(item,index)">
          <div class="logo"><img :src='require(`@/assets/images/bankCard/${item.bankLogo}`)'></div>
          <div class="name">{{ item.bankCardName }} <span>- {{ item.bankCardFullName }}</span></div>
          <div class="option">
            <input type="checkbox" v-model="item.check" :value="item.check"> <!--  v-model="payExplain" -->
          </div>
        </div>
      </div>
      <!-- Display data after selecting bank card -->
      <div v-else>
        <div class="payAmountInfo-box">{{ payExplain.bankCardName }}</div>
        <div class="payAmountInfo-title" v-if="codeState">Payment Code</div>
        <div class="payAmountInfo-box paymentCode" v-if="codeState">{{ payCode }}</div>
        <div class="helpView" v-for="(value,key) in payExplain.allHelpTips" :key="key">
          <div class="helpView-title" @click.stop="lookMore(value,key)">
            <p>How to pay at the {{ value.helpTitle }}</p>
            <p><img src="@/assets/images/rightIcon.png" :class="{'iconCSS3': value.openState,'iconCSS3-back': !value.openState}"></p>
          </div>
          <div class="helpView-line" v-for="(item,index) in value.helpInfo" :key="index" v-show="value.openState">
            <div class="headline"><div class="serialNumber"></div><div>{{ item.text }}</div></div>
            <div class="subtitle" v-for="(itemChild,indexChild) in item.children" :key="indexChild">{{ itemChild.number }} {{ itemChild.text }}</div>
          </div>
        </div>
      </div>
    </div>
    <button class="toPay" :disabled="payState" @click="submit" :data-clipboard-text="payCode">{{ buttonText }}</button>
  </div>
</template>

<script>
import allBankCards from '@/assets/json/bankCardInfo';
import indonesianDetails from '@/components/indonesianDetails';
import { timeDown } from "@/utils/index";
import Clipboard from "clipboard";

export default {
  name: "Indonesian payment",
  components: { indonesianDetails },
  data(){
    return{
      bankCardList: [],

      payExplain: [],
      bankState: true,
      moreOption: 1,

      submissionStatus: "placeOrder", //copy
      buttonText: 'Continue to PAY', //Copy Payment Code

      startPayment: false,
      paymentCountDown: null,
      paymentCountDownNum: 900,
      paymentCountDownMinute: "15:00",

      paystateTimeOut: null,

      codeState: false,
      payCode: '',
    }
  },
  computed: {
    payState(){
      if(this.payExplain.length !== 0){
        return false
      }
      return true
    }
  },
  mounted() {
    this.receiveinfo();
  },
  methods: {
    receiveinfo(){
      //Selected Receive local data
      if(sessionStorage.getItem("indonesiaPayment")){
        this.payExplain = JSON.parse(sessionStorage.getItem("indonesiaPayment"));
        this.payCode = this.payExplain.payCode;
        this.codeState = true;
        this.submissionStatus = "copy";
        this.buttonText = 'Copy Payment Code';
        this.paymentCountDownNum = this.payExplain.paymentCountDownNum;
        this.paymentCountDownMinute = this.payExplain.paymentCountDownMinute;
        this.startPayment = true;
        this.refreshPaystate();
        return;
      }
      //No choice Initialization data
      this.initializationData();
    },

    //Help information add drop-down status add Fetch data
    initializationData(){
      let newData = allBankCards.filter(item => {
        return item.allHelpTips.filter(value => {
          return value.openState = false
        })
      })
      this.bankCardList = newData;
    },

    //Select bank cards
    choiseBankCard(item,index){
      this.payExplain = item;
      this.bankCardList.filter(item=>{return item.check=false});
      this.bankCardList[index].check = true;
      this.payExplain = item;
    },

    //Expand data
    lookMore(value,key){
      if(this.payExplain.allHelpTips[key].openState === false){
        this.payExplain.allHelpTips[key].openState = true;
        return;
      }
      if(this.payExplain.allHelpTips[key].openState === true){
        this.payExplain.allHelpTips[key].openState = false;
      }
    },

    submit(){
      //copy bank code
      if(this.submissionStatus === 'copy'){
        let clipboard = new Clipboard('.toPay');
        clipboard.on('success', () => {
          this.$toast('copy success');
          clipboard.destroy()
        })
        clipboard.on('error', () => {
          clipboard.destroy()
        })
        return;
      }

      //place an order
      this.bankState = false;
      var params = {
        orderNo: JSON.parse(this.$route.query.routerParams).orderNo,
        payBankCode: this.payExplain.bankCode,
        lastname: "11111"
      }
      this.$axios.post(this.$api.post_indonesiaBuy,params,'submitToken').then(res=>{
        if(res && res.returnCode === '0000'){
          this.startPayment = true;
          this.refreshPaystate();
          this.codeState = true;
          this.payCode = res.data.webUrl;
          this.submissionStatus = 'copy';
          this.buttonText = 'Copy Payment Code';
          this.storeData();
        }
      })
    },

    //Store data to prevent page refresh
    storeData(){
      this.payExplain.payCode = this.payCode;
      this.payExplain.paymentCountDownNum = this.paymentCountDownNum;
      this.payExplain.paymentCountDownMinute = this.paymentCountDownMinute;
      sessionStorage.setItem("indonesiaPayment",JSON.stringify(this.payExplain));
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
  .payAmountInfo-box{
    margin-top: 0.1rem;
    min-height: 0.6rem;
    background: #F3F4F5;
    border-radius: 10px;
    font-size: 0.16rem;
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #232323;
    line-height: 0.6rem;
    padding: 0 0.2rem;
    .payAmountInfo-box-line{
      height: 0.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #E9E9E9;
      cursor: pointer;
      &:last-child{
        border-bottom: none;
      }
      .logo{
        display: flex;
        img{
          width: 0.64rem;
          max-height: 0.2rem;
        }
      }
      .name{
        font-size: 0.16rem;
        font-family: Jost-Medium, Jost;
        font-weight: 500;
        color: #232323;
        margin-left: 0.2rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        padding-right: 0.37rem;
        span{
          color: #666666;
        }
      }
      .option{
        margin-left: auto;
      }
    }
  }

  .paymentCode{
    font-size: 0.265rem;
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #232323;
    margin-bottom: 0.4rem;
  }

  .helpView{
    cursor: pointer;
    min-height: 0.6rem;
    background: #F3F4F5;
    border-radius: 10px;
    font-size: 0.14rem;
    font-family: Jost-Regular, Jost;
    font-weight: 400;
    color: #666666;
    padding: 0 0.2rem;
    margin-top: 0.2rem;
    .helpView-title{
      display: flex;
      align-items: center;
      height: 0.6rem;
      p:last-child{
        margin-left: auto;
        img{
          width: 0.1rem;
        }
      }
    }
    .helpView-line{
      margin-top: 0.1rem;
      &:last-child{
        padding-bottom: 0.2rem;
      }
      .headline{
        display: flex;
        align-items: center;
        font-size: 0.14rem;
        font-family: Jost-Regular, Jost;
        font-weight: 400;
        color: #666666;
        .serialNumber{
          width: 0.06rem;
          height: 0.06rem;
          background: #666666;
          border-radius: 50%;
          margin-right: 0.1rem;
        }
        div:last-child{
          max-width: 3rem;
        }
      }
      .subtitle{
        margin-left: 0.15rem;
        margin-top: 0.07rem;
      }
    }
    .iconCSS3{
      transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      /* Internet Explorer 9*/
      -moz-transform: rotate(90deg);
      /* Firefox */
      -webkit-transform: rotate(90deg);
      /* Safari and Chrome */
      -o-transform: rotate(90deg);
      transition-duration: 0.3s;
    }
    .iconCSS3-back{
      transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      /* Internet Explorer 9*/
      -moz-transform: rotate(0deg);
      /* Firefox */
      -webkit-transform: rotate(0deg);
      /* Safari and Chrome */
      -o-transform: rotate(0deg);
      transition-duration: 0.3s;
    }
  }

  .toPay{
    width: 100%;
    height: 0.6rem;
    background: #4479D9;
    border-radius: 4px;
    font-size: 0.18rem;
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #FAFAFA;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.1rem;
    cursor: pointer;
  }
  .toPay[disabled] {
    background: rgba(68, 121, 217, 0.5) !important;
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
