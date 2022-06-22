<template>
  <div id="buyCrypto">
    <!-- 买币功能模块 -->
    <div class="buyCrypto_content">
      <div class="form_title pay_title">Y<span style="margin-left: 0.00001rem">ou</span> Pay</div>
      <div class="methods_select cursor">
        <!-- @keydown="inputChange" -->
        <van-field class="pay_input" :type="youPaytype" @input="inputChange" v-model.number="payAmount" pattern="[0-9]*" inputmode="decimal" @blur="youPayBlur" :disabled="payAmountState" placeholder="0.00"/>
        <div class="pay_company" @click="openSearch('payCurrency')">
          <div class="countryIcon"><img :src="positionData.positionImg"></div>
          <div>{{ payCommission.code }}</div>
          <img class="rightIcon" src="@/assets/images/blackDownIcon.png">
        </div>
      </div>
      <div class="warning_text" v-if="warningTextState" v-html="payAmount_tips"></div>

      <div class="form_title get_title">Y<span style="margin-left: 0.00001rem">ou</span> Get</div>
      <div class="methods_select cursor">
        <div class="get_input">
          <span v-if="getAmount!==''">{{ getAmount }}</span>
          <span class="no_getAmount" v-else>0.00</span>
        </div>
        <div class="get_company" @click="openSearch('currency')">
          <div class="getImg"><img :src="currencyData.icon"></div>
          <div class="getText">{{ currencyData.name }}</div>
          <div class="rightIcon"><img src="@/assets/images/blackDownIcon.png"></div>
        </div>
      </div>

      <!-- 费用模块 -->
      <div class="calculationProcess" v-if="detailedInfo_state">
        <IncludedDetails :isHome="true"/>
      </div>
    </div>

    <footer>
      <button class="continue" @click="nextStep" :disabled="!continueState" :class="{'continue_true': continueState}">
        Continue
        <img class="rightIcon" src="../../../assets/images/button-right-icon.png" alt="">
      </button>
      By continuing you agree to our cookie policy.
    </footer>
  </div>
</template>

<script>
import common from "../../../utils/common";
import IncludedDetails from "../../../components/IncludedDetails";

export default {
  name: "buyCrypto",
  components: {IncludedDetails},
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
        alpha2: ''
      },

      payAmount: '',
      youPaytype: 'number', // Number | digit
      getAmount: '',

      //Expense information
      feeInfo: {},
      detailedInfo_state: false,

      //you get Currency information
      currencyData: {
        icon: '',
        name: '',
        networkFee: '',
        serviceFee: '',
        price: '',
      },
      cryptoSate: false,

      //Payment methods
      allPayMethods: [],
      //Payment method information
      payCommission: {},
      allPayCommission: [],
      //Exchange rate in payment currency
      exchangeRate: 0,

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
  methods: {
    openSearch(view){
      //The address bar contains merchant information. It is forbidden to select
      if(view === 'currency' && this.cryptoSate === false){
        return;
      }
      this.$parent.openSearch(view,this.allPayCommission);
    },

    //If less than two digits, 0 will be added automatically
    youPayBlur(){
      if(this.payAmount > 0 && this.payCommission.code === 'USD'){
        this.payAmount = (Math.round(this.payAmount*100)/100).toFixed(this.payCommission.decimalDigits);
      }
    },

    inputChange(val){
      //币种为USD限制输入两位小数
      if(val.indexOf('.') > 0 && this.payCommission.code === 'USD'){
        this.payAmount = val.substr(0,val.indexOf('.')+3);
      }
    },

    //Process the quantity and display status of received legal currency
    amountControl(){
      if(this.payAmount === ''){
        this.warningTextState = false;
        return;
      }

      //Cannot enter string
      // if(typeof Number(this.payAmount) === typeof NaN && typeof this.payAmount !== "number"){
      //   setTimeout(()=>{
      //     this.payAmount = this.payAmount.replace(/[^\d](\.)/g, "")
      //   })
      // }

      //币种为USD限制输入两位小数 其他都为整数
      if(this.payAmount > 0){
        if(this.payCommission.code === 'USD'){
          this.youPaytype = 'number';
        }else{
          this.youPaytype = 'digit';
          this.payAmount = parseInt(this.payAmount);
        }
      }

      //Purchase amount prompt
      if (Number(this.payAmount) >= this.payCommission.payMin && Number(this.payAmount) <= this.payCommission.payMax){
        this.warningTextState = false;
        //How many digital currencies can I exchange
        this.payinfo();
      }else{
        var minError = `The minimum transaction amount is ${this.payCommission.symbol}${this.payCommission.payMin}.`;
        var maxError = `The maximum transaction amount is ${this.payCommission.symbol}${this.payCommission.payMax}.`;
        if(Number(this.payAmount) < this.payCommission.payMin){
          this.payAmount_tips = minError;
        }else if(Number(this.payAmount) > this.payCommission.payMax){
          this.payAmount_tips = maxError;
        }
        this.warningTextState = true;
        this.getAmount = "";
        this.detailedInfo_state = false;
      }
    },

    //Purchase information details - Scheduled refresh
    payinfo(){
      if (Number(this.payAmount) >= this.payCommission.payMin && Number(this.payAmount) <= this.payCommission.payMax){
        this.$store.state.buyRouterParams.amount = this.payAmount;
        this.detailedInfo_state = true;
        this.$nextTick(()=>{
          document.getElementById("buyCrypto").scrollIntoView({behavior: "smooth", block: "end"});
        })
      }else{
        this.detailedInfo_state = false;
      }
    },

    //Real time calculation getAmount
    calculationAmount(){
      if(Number(this.payAmount) >= this.payCommission.payMin && Number(this.payAmount) <= this.payCommission.payMax){
        //取出费用最小的值rampFee
        let rampFeeList = [];
        this.payCommission.payCommission.forEach(item=>{
          rampFeeList.push((Number(item.feeRate) * Number(this.payAmount) + item.fixedFee).toFixed(this.payCommission.decimalDigits));
        })
        this.payCommission.rampFee = Math.min(...rampFeeList);
        //Filter exchange rate - Calculate cost and accepted quantity
        this.exchangeRate = this.basicData.usdToEXR[this.payCommission.code];
        this.feeInfo.price = this.exchangeRate * this.feeInfo.price;
        this.feeInfo.networkFee = this.exchangeRate * this.feeInfo.networkFee;
        let newGetAmount = (Number(this.payAmount) - this.feeInfo.networkFee - this.payCommission.rampFee) / this.feeInfo.price;
        newGetAmount > 0 ? this.getAmount = newGetAmount.toFixed(6) : this.getAmount = 0;
        this.$store.state.buyRouterParams.getAmount = this.getAmount;
        this.$store.state.buyRouterParams.payCommission = this.payCommission;
        this.$store.state.buyRouterParams.exchangeRate = this.exchangeRate;
      }
    },

    //position country
    currentLocation(){
      this.basicData = this.allBasicData;

      //将you pay的币种和国家数据合并在一起
      this.basicData.worldList.forEach((item,index)=>{
        if(item.fiatList){
          item.fiatList.forEach((item2,index2)=>{
            this.basicData.fiatCurrencyList.forEach(item3=>{
              if(item3.code === item2){
                this.basicData.worldList[index].fiatList[index2] = item3;
              }
            })
          })
        }
      })

      //获取定位的国家信息
      var worldData = {};
      worldData = this.basicData.worldList.filter((item)=> {
        if(item.alpha2 === this.basicData.param.areaCode){
          return item;
        }
      })
      this.handlePayWayList(worldData[0],1);

      //接入商户信息处理
      this.merchantOrderVerification();

      //提示效果判断
      this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";
    },

    handlePayWayList(data,state){
      this.positionData.positionValue = data.enCommonName;
      this.positionData.positionImg = data.flag;
      this.positionData.alpha2 = data.alpha2;
      this.$store.state.buyRouterParams.positionData = this.positionData;
      //根据国家对应的币种处理数据
      //state - 1页面初始化数据处理 state - 2选择国家后数据处理
      if(state === 1){
        this.payCommission = data.fiatList[0];
      }else{
        data.fiatList.forEach(item=>{
          if(item.code === data.code){
            this.payCommission = item;
          }
        })
      }
      // this.allPayCommission = data.fiatList;
      //根据you pay币种类过滤费用
      this.exchangeRate = this.basicData.usdToEXR[this.payCommission.code];
      //you pay输入的最大值最小值：最小值里面取最大, 最大值里面取最小
      let maxNumList = [];
      let minNumList = [];
      this.payCommission.payCommission.forEach(item=>{maxNumList.push(item.payMax);minNumList.push(item.payMin)});
      this.payCommission.payMax = Math.min(...maxNumList);
      this.payCommission.payMin = Math.max(...minNumList);
      this.$store.state.buyRouterParams.exchangeRate = this.exchangeRate;
      this.$store.state.buyRouterParams.payCommission = this.payCommission;

      this.amountControl();
    },

    //接入商户信息接收、验证
    merchantOrderVerification(){
      //There is no merchant information in the address column - Copy local cache
      //Obtain merchant order information in the address bar
      let merchantParams = {};
      JSON.stringify(this.$route.query) !== "{}" ? merchantParams = this.$route.query : merchantParams = JSON.parse(sessionStorage.getItem("accessMerchantInfo"));
      merchantParams === null ? merchantParams = {} : '';
      merchantParams.networkDefault = false;
      merchantParams.addressDefault = false;

      sessionStorage.setItem("accessMerchantInfo",JSON.stringify(merchantParams));
      let cryptoValue = (merchantParams.crypto!== ''&& merchantParams.crypto!==undefined) ? merchantParams.crypto : "ACH";
      this.basicData.cryptoCurrencyResponse.cryptoCurrencyList.forEach(item=>{ //No parameter defaults
        if(item.name === cryptoValue){
          this.currencyData = {
            icon: item.logoUrl,
            name: item.name,
            networkFee: item.networkFee,
            price: item.price,
            serviceFee: item.serviceFee,
          }
          this.$store.state.buyRouterParams.cryptoCurrency = this.currencyData.name;
        }
      })
      let params = merchantParams;
      delete params.networkDefault;
      delete params.addressDefault;
      delete params.merchantParam_state;
      this.$axios.get(this.$api.get_orderVerification, params).then(res=>{
        //商户信息接口success创建订单添加merchantParam参数
        if(res && res.returnCode === "0000"){
          this.cryptoSate = merchantParams.crypto ? false : true;
          merchantParams.merchantParam = JSON.stringify(this.$route.query) !== "{}" ? this.$route.fullPath.substring(2,this.$route.fullPath.length) : JSON.parse(sessionStorage.getItem("accessMerchantInfo")).merchantParam;
          merchantParams.merchantParam_state = true;
          sessionStorage.setItem("accessMerchantInfo",JSON.stringify(merchantParams));
          //network address All passed the verification
          if(res.success === true && res.data === null){
            merchantParams.addressDefault = true;
            merchantParams.networkDefault = true;
            sessionStorage.setItem("accessMerchantInfo",JSON.stringify(merchantParams));
            return;
          }

          //Judge whether a network｜address has passed
          if(res.success === true && res.data !== null){
            //you pay currency - address: false - Address is not brought out by default
            if(res.data.address === false){ //No parameter defaults
              merchantParams.addressDefault = false;
            }else{
              merchantParams.addressDefault = true;
            }

            //network: false - The network is not brought out by default
            if(res.data.network === false) {
              merchantParams.networkDefault = false;
            }else{
              merchantParams.networkDefault = true;
            }
            sessionStorage.setItem("accessMerchantInfo",JSON.stringify(merchantParams));
            return;
          }
        }else{
          //Verification failed. Release all permissions
          this.cryptoSate = true;
          merchantParams.merchantParam_state = false;
          merchantParams.addressDefault = false;
          merchantParams.networkDefault = false;
          sessionStorage.setItem("accessMerchantInfo",JSON.stringify(merchantParams));
        }
      }).catch(()=>{
        this.cryptoSate = true;
        merchantParams.addressDefault = false;
        merchantParams.networkDefault = false;
        sessionStorage.setItem("accessMerchantInfo",JSON.stringify(merchantParams));
      })
    },

    nextStep(){
      /**
       * - No token jump /emailCode
       * post_coinSupportedWallet - How to get acceptable currency - ACh Wallet OR Chain address
       * - User selected verification
       * choice Indonesian payment /creditCardForm-cardInfo
       * Other payment jump /receivingMode
       * */
      //是否是从菜单进入
      this.$store.state.routerQueryPath = false

      let routerParams = {
        cryptoCurrency: this.currencyData.name,
        amount: this.payAmount,
        getAmount: this.getAmount,
        payCommission: this.payCommission,
        exchangeRate: this.exchangeRate,
        positionData: this.positionData
      }
      this.$store.state.buyRouterParams = routerParams;
      // Login information
      if(!localStorage.getItem('token') || localStorage.getItem('token')===''){
        this.$store.state.emailFromPath = 'buyCrypto';
        this.$store.state.homeTabstate = 'buyCrypto';
        this.$router.push(`/emailCode`);
        return;
      }
      this.$store.state.homeTabstate = 'buyCrypto';
      this.$router.push(`/receivingMode`)
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
  font-family: "GeoRegular", GeoRegular;
  font-weight: 500;
  color: #707070;
  padding-bottom: 0.08rem;
}

.methods_title{
  margin-top: 0.2rem;
}
.methods_select{
  min-height: 0.56rem;
  background: #F3F4F5;
  border-radius: 0.12rem;
  font-size: 0.16rem;
  font-family: "GeoDemibold", GeoDemibold;
  font-weight: 500;
  color: #232323;
  line-height: 0.56rem;
  padding: 0 0.16rem;
  cursor: pointer;
  position: relative;
}

.pay_input{
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: #F3F4F5;
  font-size: 0.16rem;
  font-family: "GeoRegular", GeoRegular;
  font-weight: 500;
  color: #232323;
  padding: 0 0.56rem 0 0;
  &::placeholder{
    color: #999999 !important;
  }
}
.pay_company{
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  min-width: 1.44rem;
  border-radius: 0 0.12rem 0.12rem 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "GeoRegular", GeoRegular;
  font-size: 0.16rem;
  color: #232323;
  background: #EDEDEF;
  .countryIcon{
    display: flex;
    margin-right: 0.1rem;
    height: 0.288rem;
    img{
      width: 0.3rem;
      border-radius: 50%;
      background: #E0E0E0;
    }
  }
  .rightIcon{
    width: 0.24rem;
    margin-left: 0.18rem;
  }
}

.warning_text{
  position: absolute;
  font-size: 0.13rem;
  font-family: "GeoLight", GeoLight;
  font-weight: 400;
  color: #E55643;
  margin: 0.08rem 0.2rem 0 0.16rem;
}

.get_title{
  margin-top: 0.32rem;
}
.get_input{
  width: 100%;
  height: 0.56rem;
  padding: 0 1.5rem 0 0;
  background: #F3F4F5;
  font-size: 0.16rem;
  font-family: "GeoRegular", GeoRegular;
  font-weight: 500;
  color: #232323;
  .no_getAmount{
    color: #999999;
  }
}
.get_company{
  position: absolute;
  top: 0;
  right: 0;
  min-width: 1.44rem;
  height: 100%;
  border-radius: 0 0.12rem 0.12rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "GeoRegular", GeoRegular;
  background: #EDEDEF;
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
    font-family: 'GeoRegular', GeoRegular;
    font-weight: 500;
    color: #232323;
    margin-right: 0.18rem;
  }
  .rightIcon{
    display: flex;
    align-items: center;
    img{
      width: 0.24rem;
    }
  }
}

footer{
  text-align: center;
  font-size: 0.13rem;
  font-family: "GeoRegular", GeoRegular;
}
.continue{
  width: 100%;
  height: 0.58rem;
  background: rgba(0, 89, 218, 0.5);
  border-radius: 0.29rem;
  font-size: 0.17rem;
  font-family: "GeoRegular", GeoRegular;
  font-weight: normal;
  color: #FFFFFF;
  margin-top: 0.16rem;
  cursor: no-drop;
  border: none;
  position: relative;
  margin-bottom: 0.16rem;
  .rightIcon{
    position: absolute;
    top: 0.17rem;
    right: 0.32rem;
    width: 0.24rem;
  }
}
.continue_true{
  background: #0059DA;
  cursor: pointer;
}
.cursor{
  cursor: auto;
}

.calculationProcess{
  margin-top: 0.32rem;
  margin-bottom: 0.1rem;
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
  min-height: 0.56rem;
}
.pay_input ::v-deep .van-field__control{
  min-height: 0.56rem;
  border: none;
  outline: none;
  background: #F3F4F5;
  font-size: 0.16rem !important;
  font-family: 'GeoRegular', GeoRegular;
  font-weight: 500;
  color: #232323 !important;
  padding: 0 0.56rem 0 0;
  &::placeholder{
    color: #999999 !important;
  }
}</style>
