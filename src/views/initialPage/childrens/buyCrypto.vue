<template>
  <div id="buyCrypto">
    <div class="selectCountry" @click="openSearch('country')">
      <div class="selectCountry_left">
        <div><img :src="positionData.positionImg"></div>
        <div>{{ positionData.positionValue }}</div>
      </div>
      <div class="selectCountry_right"><img src="@/assets/images/rightIcon.png"></div>
    </div>

    <div class="form_title methods_title">Payment Method</div>
    <div class="methods_select" @click="openPicker">{{ paymentMethod }}</div>

    <div class="form_title pay_title">You Pay</div>
    <div class="methods_select">
      <input class="pay_input" type="number" v-model="payAmount" onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder="0.00">
      <span class="pay_company">USD</span>
    </div>
    <div class="warning_text" v-if="warningTextState" v-html="payAmount_tips"></div>

    <div class="form_title get_title">You Get</div>
    <div class="methods_select">
      <input class="pay_input get_input" type="number" v-model="getAmount" onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder="0.00" disabled="true">
      <div class="get_company" @click="openSearch('currency')">
        <div class="getImg"><img :src="currencyData.icon"></div>
        <div class="getText">{{ currencyData.name }}</div>
        <div class="rightIcon"><img src="@/assets/images/rightIcon.png"></div>
      </div>
    </div>

    <div class="calculationProcess" v-if="detailedInfo_state">
      <div class="calculationProcess_line">
        <div class="line_name">Remaining time</div>
        <div class="line_number">
          <div class="line_number_icon"><img class="loadingIcon" src="@/assets/images/countDownIcon.svg"></div>
          <div class="line_number_red">{{ timeDownNumber }}S</div>
        </div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">{{ currencyData.name }} Price</div>
        <div class="line_number">${{ feeInfo.price }}</div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">Ramp fee</div>
        <div class="line_number">${{ Number(feeInfo.serviceFee) * Number(payAmount) }}</div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">Network Fee</div>
        <div class="line_number">${{ feeInfo.networkFee }}</div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">Total</div>
        <div class="line_number">${{ payAmount }}</div>
      </div>
    </div>

    <div class="continue" @click="nextStep" :class="{'continue_true': continueState}">Continue</div>

    <!-- select network -->
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
          show-toolbar
          :columns="payType"
          value-key="payWayName"
          @cancel="showPicker = false"
          @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "buyCrypto",
  props: ['allBasicData'],
  data(){
    return{
      warningTextState: false,
      payAmount_tips: '',

      basicData: {},
      positionData: {
        positionValue: '',
        positionImg: '',
      },
      currencyData: {
        icon: '',
        name: '',
        networkFee: '',
        serviceFee: '',
        price: '',
      },
      payAmount: '',
      getAmount: '',
      detailedInfo_state: false,
      timeDownNumber: 15,

      paymentMethod: '',
      paymentMethodCode: '',
      payType: [],
      showPicker: false,

      feeInfo: {},
      timeDown: null,
    }
  },
  computed: {
    //Control button status
    continueState(){
      if(this.positionData.positionValue !== ''&& this.paymentMethod !== '' &&
          this.payAmount !== '' && Number(this.payAmount) >= 30 && Number(this.payAmount) <= 100 &&
          this.getAmount !== '' && Number(this.payAmount) > 0){
        return true
      }else{
        return false
      }
    }
  },
  watch: {
    allBasicData: {
      immediate: true,
      deep: true,
      handler() {
        this.allBasicData.worldList !== undefined ? this.currentLocation() : '';
      },
    },
    payAmount: {
      deep: true,
      handler() {
        if(this.payAmount === ''){
          this.warningTextState = false;
          return;
        }
        //Purchase amount prompt
        if (Number(this.payAmount) >= 30 && Number(this.payAmount) <= 100){
          this.warningTextState = false;
          //How many digital currencies can I exchange
          this.calculationAmount();
        }else{
          var minError = "The minimum transaction amount is $30.00.";
          var maxError = "The maximum transaction amount is $100.00.";
          if(Number(this.payAmount) < 30){
            this.payAmount_tips = minError;
          }else if(Number(this.payAmount) > 100){
            this.payAmount_tips = maxError;
          }
          this.warningTextState = true;
          this.getAmount = "";
        }
        this.payinfo();
      }
    },
  },
  destroyed(){
    clearInterval(this.timeDown);
  },
  methods: {
    openSearch(view){
      this.$parent.openSearch(view);
    },

    //Real time calculation getAmount
    calculationAmount(){
      if(Number(this.payAmount) >= 30 && Number(this.payAmount) <= 100){
        this.getAmount = (((Number(this.payAmount) - this.feeInfo.networkFee) - Number(this.payAmount)*this.feeInfo.serviceFee) / this.feeInfo.price).toFixed(6)*1;
      }
    },

    //Purchase information details - Scheduled refresh
    payinfo(){
      clearInterval(this.timeDown);
      if (Number(this.payAmount) >= 30 && Number(this.payAmount) <= 100 && Number(this.getAmount) > 0){
        this.detailedInfo_state = true;
        this.queryFee();
      }else{
        clearInterval(this.timeDown);
        this.detailedInfo_state = false;
      }
    },

    //Purchase information details
    queryFee(){
      this.timeDownNumber = 15;
      let params = {
        symbol: this.currencyData.name + "USDT",
        coin: this.currencyData.name,
      }
      this.$axios.get(this.$api.get_inquiryFee,params).then(res=>{
        if(res.data){
          this.feeInfo = res.data;
          this.calculationAmount();
        }
      })
      this.timeDown = setInterval(()=> {
        if (this.timeDownNumber === 1) {
          this.timeDownNumber = 15;
          let params = {
            symbol: this.currencyData.name + "USDT",
            coin: this.currencyData.name,
          }
          this.$axios.get(this.$api.get_inquiryFee,params).then(res=>{
            if(res.data){
              this.feeInfo = res.data;
              this.calculationAmount();
            }
          })
        }else{
          this.timeDownNumber -= 1;
        }
      },1000);
    },

    //position country
    currentLocation(){
      this.basicData = this.allBasicData;
      this.paymentMethod = this.basicData.payWayList[0].payWayName;
      this.paymentMethodCode = this.basicData.payWayList[0].payWayCode;
      this.basicData.worldList.forEach((item)=>{
        if(item.alpha2 === JSON.parse(localStorage.getItem("Position")).cid){
          this.positionData.positionValue = item.enCommonName;
          this.positionData.positionImg = item.flag;
          //pay methods
          if(item.payWayList.length===1){
            this.payType[0] = this.basicData.payWayList[0];
          }else{
            this.payType = this.basicData.payWayList;
          }
          if(this.payType.length === 0){
            this.payType = this.basicData.payWayList;
          }
        }else if(JSON.parse(localStorage.getItem("Position")).cid === 'CN' ||
            JSON.parse(localStorage.getItem("Position")).cid === '810000'||
            JSON.parse(localStorage.getItem("Position")).cid === '110000'){
          this.positionData.positionValue = 'Hong Kong'
          this.positionData.positionImg = 'https://flagcdn.com/hk.svg'
          this.payType[0] = this.basicData.payWayList[0];
        }
      })

      //Default currency
      this.basicData.cryptoCurrencyResponse.cryptoCurrencyList.forEach(item=>{
        if(item.name === 'ACH'){
          this.currencyData = {
            icon: item.logoUrl,
            name: item.name,
            networkFee: item.networkFee,
            price: item.price,
            serviceFee: item.serviceFee,
          }
        }
      })
    },

    nextStep(){
      /**
       * - No token jump /emailCode
       * post_coinSupportedWallet - How to get acceptable currency - ACh Wallet OR Chain address
       * - User selected verification
       * choice Indonesian payment /internationalCardPay
       * Other payment jump /receiveCoins
       * */
      let routerParams = {
        cryptoCurrency: this.currencyData.name,
        fiatCurrency: 'USD',
        amount: this.payAmount,
        payWayCode: this.paymentMethodCode,
        payWayName: this.paymentMethod
      }
      if(this.positionData.positionValue === ''|| this.paymentMethod === '' ||
          this.payAmount === '' || Number(this.payAmount) < 30 || Number(this.payAmount) > 100 ||
          this.getAmount === '' || Number(this.payAmount) <= 0){
        return;
      }
      // Login information
      if(!localStorage.getItem('token') || localStorage.getItem('token')===''){
        this.$store.state.routerParams = routerParams;
        window.onbeforeunload = function() {
          console.log("youxiao")
        }
          window.addEventListener("beforeunload",()=>{
          localStorage.setItem("store",JSON.stringify(this.$store.state));
        })
        this.$router.push(`/emailCode?routerParams=${JSON.stringify(routerParams)}`);
        return;
      }
      this.$router.push(`/receiveCoins?routerParams=${JSON.stringify(routerParams)}`)
    },

    //open pay methods view
    openPicker(){
      this.payType.length > 1 ? this.showPicker = true : '';
    },
    //choise pay methods
    onConfirm(val){
      this.paymentMethod = val.payWayName;
      this.paymentMethodCode = val.payWayCode;
      this.showPicker = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.selectCountry{
  display: flex;
  align-items: center;
  height: 0.6rem;
  background: #F3F4F5;
  border-radius: 10px;
  padding: 0 0.2rem;
  cursor: pointer;
  .selectCountry_left{
    display: flex;
    align-items: center;
    font-size: 0.16rem;
    font-family: Jost-Bold, Jost;
    font-weight: bold;
    color: #232323;
    div{
      display: flex;
    }
    div:nth-of-type(2){
      margin-left: 0.1rem;
    }
    img{
      width: 0.3rem;
    }
  }
  .selectCountry_right{
    margin-left: auto;
    display: flex;
    img{
      width: 0.12rem;
    }
  }
}

.form_title{
  font-size: 0.14rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #232323;
  padding-bottom: 0.1rem;
}

.methods_title{
  margin-top: 0.2rem;
}
.methods_select{
  min-height: 0.6rem;
  background: #F3F4F5;
  border-radius: 10px;
  font-size: 0.16rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #232323;
  line-height: 0.6rem;
  padding: 0 0.2rem;
  cursor: pointer;
  position: relative;
}

.pay_title{
  margin-top: 0.4rem;
}
.pay_input{
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: #F3F4F5;
  font-size: 0.16rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #232323;
  padding: 0 0.6rem 0 0;
}
.pay_company{
  position: absolute;
  right: 0.2rem;
}
.warning_text{
  font-size: 0.14rem;
  font-family: Jost-Regular, Jost;
  font-weight: 400;
  color: #FF0000;
  margin: 0.1rem 0.2rem 0 0.2rem;
}

.get_title{
  margin-top: 0.2rem;
}
.get_input{
  padding: 0 1.5rem 0 0;
}
.get_company{
  position: absolute;
  top: 0;
  right: 0.2rem;
  display: flex;
  align-items: center;
  .getImg{
    display: flex;
    margin-right: 0.1rem;
    img{
      width: 0.3rem;
    }
  }
  .getText{
    display: flex;
    font-size: 0.16rem;
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #232323;
    margin-right: 0.2rem;
  }
  .rightIcon{
    img{
      width: 0.12rem;
    }
  }
}

.continue{
  width: 100%;
  height: 0.6rem;
  background: rgba(68, 121, 217, 0.5);
  border-radius: 4px;
  text-align: center;
  line-height: 0.6rem;
  font-size: 0.18rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #FAFAFA;
  margin-top: 0.4rem;
  cursor: no-drop;
}
.continue_true{
  background: #4479D9;
}

.calculationProcess{
  padding: 0 0.2rem;
  .calculationProcess_line{
    display: flex;
    align-items: center;
    margin-top: 0.2rem;
    .line_name{
      font-size: 0.14rem;
      font-family: Jost-Regular, Jost;
      font-weight: 400;
      color: #232323;
    }
    .line_number{
      margin-left: auto;
      font-size: 0.14rem;
      font-family: Jost-Medium, Jost;
      font-weight: 500;
      color: #232323;
      display: flex;
      align-items: center;
      .line_number_icon{
        margin-right: 0.05rem;
        img{
          width: 0.12rem;
        }
      }
      .line_number_red{
        font-size: 0.14rem;
        font-family: Jost-Medium, Jost;
        font-weight: 500;
        color: #FF0000;
      }
    }
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
