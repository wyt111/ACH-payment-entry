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
    <div class="methods_select" @click="openSearch('payMethods')">
      <div class="pay_input">{{ paymentMethod }}</div>
      <span class="pay_company"><img src="@/assets/images/rightIcon.png"></span>
    </div>

    <div class="form_title pay_title">You Pay</div>
    <div class="methods_select cursor">
      <input class="pay_input" type="number" v-model="payAmount" :disabled="payAmountState" onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder="0.00">
      <span class="pay_company" @click="openSearch('payCurrency')">{{ payCommission.currency }} <img src="@/assets/images/rightIcon.png"></span>
    </div>
    <div class="warning_text" v-if="warningTextState" v-html="payAmount_tips"></div>

    <div class="form_title get_title">You Get</div>
    <div class="methods_select cursor">
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
        <div class="line_number">{{ payCommission.currencySymbol }}{{ Number(feeInfo.price).toFixed(6) }}</div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">Ramp fee</div>
        <div class="line_number">{{ payCommission.currencySymbol }}{{ (Number(payCommission.feeRate) * Number(payAmount) + payCommission.fixedFee).toFixed(2) }}</div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">Network Fee</div>
        <div class="line_number">{{ payCommission.currencySymbol }}{{ Number(feeInfo.networkFee).toFixed(2) }}</div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">Total</div>
        <div class="line_number">{{ payCommission.currencySymbol }}{{ payAmount }}</div>
      </div>
    </div>

    <div class="continue" @click="nextStep" :class="{'continue_true': continueState}">Continue</div>
  </div>
</template>

<script>
export default {
  name: "buyCrypto",
  props: ['allBasicData'],
  data(){
    return{
      //you pay Prompt information
      warningTextState: false,
      payAmount_tips: '',

      //All data
      basicData: {},

      //Location data
      positionData: {
        positionValue: '',
        positionImg: '',
      },

      payAmount: '',
      getAmount: '',

      //Expense information
      feeInfo: {},
      timeDown: null,
      timeDownNumber: 15,
      detailedInfo_state: false,

      //you get Currency information
      currencyData: {
        icon: '',
        name: '',
        networkFee: '',
        serviceFee: '',
        price: '',
      },

      //Select or default payment method information
      paymentMethod: '',
      paymentMethodCode: '',
      //Payment methods
      allPayMethods: [],
      //Payment method information
      payCommission: {},
      allPayCommission: [],
      //Exchange rate in payment currency
      exchangeRate: 0,
    }
  },
  computed: {
    //you pay input status - Data can only be entered after loading
    payAmountState(){
      if(this.payCommission.payMax > 0 && this.payCommission.payMin > 0){
        return false
      }else{
        return true
      }
    },
    //Control button status
    continueState(){
      if(this.positionData.positionValue !== ''&& this.paymentMethod !== '' &&
          this.payAmount !== '' && Number(this.payAmount) >= this.payCommission.payMin &&
          Number(this.payAmount) <= this.payCommission.payMax && this.getAmount !== '' &&
          Number(this.payAmount) > 0){
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
        this.amountControl();
      }
    },
  },
  destroyed(){
    clearInterval(this.timeDown);
  },
  methods: {
    openSearch(view){
      //pay methods
      if(view === 'payMethods' && this.positionData.positionValue !== 'Indonesia'){
        return;
      }
      //pay currency
      if(view === 'payCurrency' && this.allPayCommission.length === 0){
        return;
      }
      this.$parent.openSearch(view,this.allPayCommission);
    },

    //Process the quantity and display status of received legal currency
    amountControl(){
      if(this.payAmount === ''){
        this.warningTextState = false;
        return;
      }
      //Purchase amount prompt
      if (Number(this.payAmount) >= this.payCommission.payMin && Number(this.payAmount) <= this.payCommission.payMax){
        this.warningTextState = false;
        //How many digital currencies can I exchange
        this.payinfo();
      }else{
        var minError = `The minimum transaction amount is $${this.payCommission.payMin}.`;
        var maxError = `The maximum transaction amount is $${this.payCommission.payMax}.`;
        if(Number(this.payAmount) < this.payCommission.payMin){
          this.payAmount_tips = minError;
        }else if(Number(this.payAmount) > this.payCommission.payMax){
          this.payAmount_tips = maxError;
        }
        this.warningTextState = true;
        this.getAmount = "";
        this.detailedInfo_state = false;
        clearInterval(this.timeDown);
      }
    },

    //Purchase information details - Scheduled refresh
    payinfo(){
      clearInterval(this.timeDown);
      if (Number(this.payAmount) >= this.payCommission.payMin && Number(this.payAmount) <= this.payCommission.payMax){
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

    //Real time calculation getAmount
    calculationAmount(){
      if(Number(this.payAmount) >= this.payCommission.payMin && Number(this.payAmount) <= this.payCommission.payMax){
        //Filter exchange rate - Calculate cost and accepted quantity
        this.exchangeRate = this.basicData.usdToEXR[this.payCommission.currency];
        this.feeInfo.price = this.exchangeRate * this.feeInfo.price;
        this.feeInfo.networkFee = this.exchangeRate * this.feeInfo.networkFee;
        let newGetAmount = (Number(this.payAmount) - this.feeInfo.networkFee - (Number(this.payCommission.feeRate) * Number(this.payAmount) + this.payCommission.fixedFee)) / this.feeInfo.price;
        newGetAmount > 0 ? this.getAmount = newGetAmount.toFixed(6) : this.getAmount = 0;
        console.log(newGetAmount,"----newGetAmount")
      }
    },

    //position country
    currentLocation(){
      this.basicData = this.allBasicData;

      var worldData = {};
      worldData = this.basicData.worldList.filter((item)=> {
        if(JSON.parse(localStorage.getItem("Position")).cid === 'CN' ||
            JSON.parse(localStorage.getItem("Position")).cid === '810000'||
            JSON.parse(localStorage.getItem("Position")).cid === '110000'){
          return item.enCommonName === 'Hong Kong';
        }else if(item.alpha2 === JSON.parse(localStorage.getItem("Position")).cid){
          return item;
        }
      })
      this.handlePayWayList(worldData[0]);

      //you pay currency
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

    handlePayWayList(data){
      this.positionData.positionValue = data.enCommonName;
      this.positionData.positionImg = data.flag;
      //Screening payment methods by country
      data.payWayList.forEach(item=>{
        let itemPayMethods = this.basicData.payWayList.filter(value=>{
          return item === value.payWayCode;
        })
        this.allPayMethods.push(itemPayMethods[0]);
      })
      //Initialization data  -  Reload data after selection
      this.paymentMethod = this.allPayMethods[0].payWayName;
      this.paymentMethodCode = this.allPayMethods[0].payWayCode;
      this.payCommission = this.allPayMethods[0].payCommissionList[0];
      this.allPayCommission = this.allPayMethods[0].payCommissionList;
      //Filter exchange rate
      this.exchangeRate = this.basicData.usdToEXR[this.payCommission.currency];
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
        amount: this.payAmount,
        getAmount: this.getAmount,
        payWayCode: this.paymentMethodCode,
        payWayName: this.paymentMethod,
        payCommission: this.payCommission,
        exchangeRate: this.exchangeRate
      }
      if(this.positionData.positionValue === ''|| this.paymentMethod === '' ||
          this.payAmount === '' || Number(this.payAmount) < this.payCommission.payMin || Number(this.payAmount) > this.payCommission.payMax ||
          this.getAmount === '' || Number(this.payAmount) <= 0){
        return;
      }
      // Login information
      if(!localStorage.getItem('token') || localStorage.getItem('token')===''){
        this.$router.push(`/emailCode?routerParams=${JSON.stringify(routerParams)}`);
        return;
      }
      this.$router.push(`/receiveCoins?routerParams=${JSON.stringify(routerParams)}`)
    },
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
  top: 0;
  right: 0.2rem;
  cursor: pointer;
  img{
    width: 0.12rem;
    margin-left: 0.2rem;
  }
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
  cursor: pointer;
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
  cursor: pointer;
}
.cursor{
  cursor: auto;
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
