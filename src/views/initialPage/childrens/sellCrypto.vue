<template>
  <div id="buyCrypto">
    <!-- 买币功能模块 -->
    <div class="buyCrypto_content">
      <div class="form_title pay_title">You Pay</div>
      <div class="methods_select cursor">
        <!-- @keydown="inputChange"   @input="inputChange"    @blur="youPayBlur" -->
        <van-field class="pay_input" :type="youPaytype" v-model.number="payAmount" pattern="[0-9]*" inputmode="decimal" :disabled="payAmountState" placeholder="0.00"/>
        <div class="get_company" @click="openSearch('currency-sell')">
          <div class="getImg"><img :src="currencyData.icon"></div>
          <div class="getText">{{ currencyData.name }}</div>
          <div class="rightIcon"><img src="@/assets/images/rightIcon.png"></div>
        </div>
      </div>
      <div class="warning_text" v-if="warningTextState" v-html="payAmount_tips"></div>

      <div class="form_title get_title">You Get</div>
      <div class="methods_select cursor">
        <input class="pay_input get_input" type="number" v-model="getAmount" onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.getAmount)))" placeholder="0.00" disabled="true">
        <div class="pay_company" @click="openSearch('payCurrency-sell')">
          <div class="countryIcon"><img :src="positionData.positionImg"></div>
          <div>{{ payCommission.code }}</div>
          <img class="rightIcon" src="@/assets/images/rightIcon.png">
        </div>
      </div>

      <!-- 费用模块 -->
      <div class="calculationProcess" v-if="detailedInfo_state">
        <div class="calculationProcess_line">
          <div class="line_name">Remaining time</div>
          <div class="line_number">
            <div class="line_number_icon"><img class="loadingIcon" src="@/assets/images/countDownIcon.svg"></div>
            <div class="line_number_red">{{ timeDownNumber }}S</div>
          </div>
        </div>
        <div class="calculationProcess_line">
          <div class="line_name">{{ currencyData.name }} price</div>
          <div class="line_number">{{ feeInfo.fiatSymbol }}{{ feeInfo.price }}</div>
        </div>
        <div class="calculationProcess_line" v-show="feeState">
          <div class="line_name">
            Ramp fee
            <el-popover
                placement="top"
                :trigger="triggerType"
                :offset="-18"
                content="Based on payment method">
              <div slot="reference"><img class="tipsIcon" src="@/assets/images/exclamatoryMarkIcon.png"></div>
            </el-popover>
          </div>
          <div class="line_number"><span class="minText">as low as</span>{{ feeInfo.fiatSymbol }}{{ feeInfo.rampFee }}</div>
        </div>
        <div class="feeViewBtn" @click="expandFee">{{ feeText }}</div>
        <div class="calculationProcess_line">
          <div class="line_name">Total</div>
          <div class="line_number">{{ feeInfo.fiatSymbol }}{{ payAmount }}</div>
        </div>
      </div>
    </div>

    <button class="continue" @click="nextStep" :disabled="!continueState" :class="{'continue_true': continueState}">Continue</button>
  </div>
</template>

<script>
import common from "../../../utils/common";

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
        alpha2: '',
      },

      payAmount: '',
      youPaytype: 'Number', // Number | digit
      getAmount: '',

      //Expense information
      feeInfo: {},
      timeDown: null,
      timeDownNumber: 15,
      detailedInfo_state: false,

      feeParams: {},
      feeState: false,
      feeText: 'View fees',

      //you get Currency information
      currencyData: {
        icon: '',
        name: '',
        price: '',
      },

      //Payment methods
      allPayMethods: [],
      //Payment method information
      payCommission: {},
      allPayCommission: [],

      triggerType: "hover",
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
    //确认按钮状态
    continueState(){
      if(this.positionData.positionValue !== ''&&
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
  deactivated(){
    clearInterval(this.timeDown);
  },
  methods: {
    openSearch(view){
      //The address bar contains merchant information. It is forbidden to select
      if(view === 'currency'){
        return;
      }
      this.$parent.openSearch(view,this.allPayCommission);
    },

    expandFee(){
      this.feeState = this.feeState === true ? false : true;
      this.feeText = this.feeState === true ? 'Hide fees' : 'View fees';
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
        var minError = `The minimum transaction amount is ${this.payCommission.payMin}.`;
        var maxError = `The maximum transaction amount is ${this.payCommission.payMax}.`;
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
        setTimeout(()=>{
          document.getElementById("buyCrypto").scrollIntoView({behavior: "smooth", block: "end"});
        })
        this.queryFee();
      }else{
        clearInterval(this.timeDown);
        this.detailedInfo_state = false;
      }
    },

    //Purchase information details
    queryFee(){
      this.timeDownNumber = 15;
      this.$axios.get(this.$api.get_inquiryFeeSell,this.feeParams).then(res=>{
        if(res.data){
          this.feeInfo = res.data;
          this.calculationAmount();
        }
      })
      this.timeDown = setInterval(()=> {
        if (this.timeDownNumber === 1) {
          this.timeDownNumber = 15;
          this.$axios.get(this.$api.get_inquiryFeeSell,this.feeParams).then(res=>{
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
        // this.feeInfo.price = this.exchangeRate * this.feeInfo.price;
        this.feeInfo.rampFee = (this.payAmount * this.feeInfo.price * this.feeInfo.percentageFee + this.feeInfo.fixedFee) * this.feeInfo.rate;
        let newGetAmount = this.payAmount * this.feeInfo.price * this.feeInfo.rate - this.feeInfo.rampFee;
        newGetAmount > 0 ? this.getAmount = newGetAmount.toFixed(6) : this.getAmount = 0;
      }
    },

    //position country
    currentLocation(){
      //提示效果判断
      this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";

      this.basicData = this.allBasicData;

      //将you pay的币种和国家数据合并在一起
      this.basicData.worldList.forEach((item,index)=>{
        item.fiatList.forEach((item2,index2)=>{
          this.basicData.fiatCurrencyList.forEach(item3=>{
            if(item3.code === item2){
              this.basicData.worldList[index].fiatList[index2] = item3;
            }
          })
        })
      })

      //获取定位的国家信息
      var worldData = {};
      worldData = this.basicData.worldList.filter((item)=> {
        if(item.alpha2 === this.basicData.param.areaCode){
          return item;
        }
      })
      this.handlePayWayList(worldData[0],1);
    },

    handlePayWayList(data,state){
      //展示所需国家参数
      this.positionData.positionValue = data.enCommonName;
      this.positionData.positionImg = data.flag;
      this.positionData.alpha2 = data.alpha2;
      //费用所需参数
      this.feeParams.fiatCode = data.fiatCode;
      this.feeParams.worldId = data.worldId;
      //根据国家对应的币种处理数据
      //state - 1页面初始化数据处理 state - 2选择国家后数据处理
      if(state === 1){
        this.payCommission = data.fiatList[0];
        this.basicData.cryptoCurrencyResponse.cryptoCurrencyList.forEach(item=>{
          if(item.name === "BTC"){
            this.currencyData = {
              icon: item.logoUrl,
              name: item.name,
            }
            //取最大值最小值
            this.payCommission.payMax = item.maxSell
            this.payCommission.payMin = item.minSell;
            this.feeParams.symbol = item.symbol;
          }
        })
      }else{
        data.fiatList.forEach(item=>{
          if(item.code === data.code){
            this.payCommission = item;
          }
        })
        console.log(data,this.payCommission)
      }

      this.amountControl();
    },

    nextStep(){
      /**
       * - No token jump /emailCode
       * post_coinSupportedWallet - How to get acceptable currency - ACh Wallet OR Chain address
       * - User selected verification
       * choice Indonesian payment /creditCardForm-cardInfo
       * Other payment jump /receivingMode
       * */
      let routerParams = {
        cryptoCurrency: this.currencyData.name,
        amount: this.payAmount,
        getAmount: this.getAmount,
        payCommission: this.payCommission,
        positionData: this.positionData
      }
      // Login information
      if(!localStorage.getItem('token') || localStorage.getItem('token')===''){
        this.$router.push(`/emailCode?routerParams=${JSON.stringify(routerParams)}`);
        return;
      }
      this.$router.push(`/receivingMode?routerParams=${JSON.stringify(routerParams)}`)
    },
  }
}
</script>

<style lang="scss" scoped>
html,body,#buyCrypto{
  width: 100%;
  height: 100%;
}
#buyCrypto{
  display: flex;
  flex-direction: column;
  .buyCrypto_content{
    flex: 1;
    overflow: auto;
  }
}

.form_title{
  font-size: 0.14rem;
  font-family: 'Jost', sans-serif;
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
  font-family: "Jost", sans-serif;
  font-weight: 500;
  color: #232323;
  line-height: 0.6rem;
  padding: 0 0.2rem;
  cursor: pointer;
  position: relative;
}

.pay_title{
  //margin-top: 0.4rem;
}
.pay_input{
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: #F3F4F5;
  font-size: 0.16rem;
  font-family: "Jost", sans-serif;
  font-weight: 500;
  color: #232323;
  padding: 0 0.6rem 0 0;
  &::placeholder{
    color: #999999 !important;
  }
}
.pay_company{
  height: 100%;
  position: absolute;
  top: 0;
  right: 0.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  img{
    width: 0.12rem;
    margin-left: 0.2rem;
  }
  .countryIcon{
    display: flex;
    margin-right: 0.1rem;
    img{
      width: 0.3rem;
    }
  }
}
.warning_text{
  font-size: 0.14rem;
  font-family: "Jost", sans-serif;
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
    font-family: 'Jost', sans-serif;
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
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  color: #FAFAFA;
  margin-top: 0.4rem;
  cursor: no-drop;
  border: none;
}
.continue_true{
  background: #4479D9;
  cursor: pointer;
}
.cursor{
  cursor: auto;
}

.feeViewBtn{
  text-align: right;
  font-size: 0.14rem;
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  color: #4479D9;
  margin-top: 0.1rem;
  cursor: pointer;
}

.calculationProcess{
  padding: 0 0.2rem;
  .calculationProcess_line{
    display: flex;
    align-items: center;
    margin-top: 0.13rem;
    .line_name{
      font-size: 0.14rem;
      font-family: "Jost", sans-serif;
      font-weight: 400;
      color: #232323;
      display: flex;
      align-items: center;
      .tipsIcon{
        width: 0.14rem;
        height: 0.14rem;
        margin-left: 0.1rem;
        display: flex;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .line_number{
      margin-left: auto;
      font-size: 0.14rem;
      font-family: 'Jost', sans-serif;
      font-weight: bold;
      color: #232323;
      display: flex;
      align-items: center;
      .minText{
        font-size: 0.14rem;
        font-weight: 400;
        color: #666666;
        margin-right: 0.2rem;
      }
      .line_number_icon{
        margin-right: 0.05rem;
        img{
          width: 0.12rem;
        }
      }
      .line_number_red{
        font-size: 0.14rem;
        font-family: 'Jost', sans-serif;
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

.pay_input ::v-deep .van-cell__value--alone{
  min-height: 0.6rem;
}
.pay_input ::v-deep .van-field__control{
  min-height: 0.6rem;
  border: none;
  outline: none;
  background: #F3F4F5;
  font-size: 0.16rem !important;
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  color: #232323 !important;
  padding: 0 0.6rem 0 0;
  &::placeholder{
    color: #999999 !important;
  }
}
</style>
