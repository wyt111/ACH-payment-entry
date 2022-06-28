<template>
  <div id="buyCrypto">
    <!-- 买币功能模块 -->
    <div class="buyCrypto_content">
      <div class="form_title pay_title">{{ $t('nav.home_youSell') }}</div>
      <div class="methods_select cursor">
        <!-- @blur="youPayBlur" -->
        <van-field class="pay_input" type="number" v-model.number="payAmount" @input="inputChange" :disabled="payAmountState" pattern="[0-9]*" inputmode="decimal" placeholder="0.00"/>
        <div class="get_company" @click="openSearch('currency-sell')">
          <div class="getImg"><img :src="currencyData.icon"></div>
          <div class="getText">{{ currencyData.name }}</div>
          <div class="rightIcon"><img src="@/assets/images/blackDownIcon.png"></div>
        </div>
      </div>
      <div class="warning_text" v-if="warningTextState" v-html="payAmount_tips"></div>

      <div class="form_title get_title">{{ $t('nav.home_buyFee_title1') }}</div>
      <div class="methods_select cursor">
        <div class="get_input">
          <span v-if="getAmount!==''">{{ getAmount }}</span>
          <span class="no_getAmount" v-else>0.00</span>
        </div>
        <div class="pay_company" @click="openSearch('payCurrency-sell')">
          <div class="countryIcon"><img :src="positionData.positionImg"></div>
          <div>{{ payCommission.fiatCode }}</div>
          <img class="rightIcon" src="@/assets/images/blackDownIcon.png">
        </div>
      </div>

      <!-- 费用模块 -->
      <div class="calculationProcess" v-if="detailedInfo_state">
        <IncludedDetailsSell :isHome="true"/>
      </div>
    </div>

    <footer>
      <button class="continue" @click="nextStep" :disabled="!continueState" :class="{'continue_true': continueState}">
        {{ $t('nav.Continue') }}
        <img class="rightIcon" src="../../../assets/images/button-right-icon.png" alt="">
      </button>
      {{ $t('nav.home_Tips') }}
    </footer>
  </div>
</template>

<script>
import common from "../../../utils/common";
import IncludedDetailsSell from '../../../components/IncludedDetailsSell';

export default {
  name: "buyCrypto",
  components: { IncludedDetailsSell },
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
        fiatCode: ''
      },

      payAmount: '',
      getAmount: '',

      //Expense information
      feeInfo: {},
      detailedInfo_state: false,

      //you get Currency information
      currencyData: {
        icon: '',
        name: '',
        price: '',
        maxSell: '',
        minSell: ''
      },

      //Payment method information
      payCommission: {},
      allPayCommission: [],

      triggerType: "hover",
    }
  },
  computed: {
    //you pay input status - Data can only be entered after loading
    payAmountState(){
      if(this.currencyData.maxSell > 0 && this.currencyData.minSell > 0){
        return false
      }else{
        return true
      }
    },
    //确认按钮状态
    continueState(){
      if(this.positionData.positionValue !== ''&&
          this.payAmount !== '' && Number(this.payAmount) >= this.currencyData.minSell &&
          Number(this.payAmount) <= this.currencyData.maxSell && this.getAmount !== '' &&
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
      if(view === 'currency'){
        return;
      }
      this.$parent.openSearch(view,this.allPayCommission);
    },

    //限制输入六位小数
    inputChange(val){
      if(val.indexOf('.') > 0){
        this.payAmount = val.substr(0,val.indexOf('.')+7);
      }
    },
    // youPayBlur(){
    //   if(this.payAmount > 0){
    //     this.payAmount = (Math.round(this.payAmount*100)/100).toFixed(2);
    //   }
    // },

    //Process the quantity and display status of received legal currency
    amountControl(){
      if(this.payAmount === ''){
        this.warningTextState = false;
        return;
      }
      //Purchase amount prompt
      if (Number(this.payAmount) >= this.currencyData.minSell && Number(this.payAmount) <= this.currencyData.maxSell){
        this.warningTextState = false;
        this.$store.state.sellRouterParams.amount = this.payAmount;
        //How many digital currencies can I exchange
        this.payinfo();
      }else{
        var minError = `${this.$t('nav.home_minAmountTips')} ${this.currencyData.minSell}.`;
        var maxError = `${this.$t('nav.home_maxAmountTips')} ${this.currencyData.maxSell}.`;
        if(Number(this.payAmount) < this.currencyData.minSell){
          this.payAmount_tips = minError;
        }else if(Number(this.payAmount) > this.currencyData.maxSell){
          this.payAmount_tips = maxError;
        }
        this.warningTextState = true;
        this.getAmount = "";
        this.detailedInfo_state = false;
      }
    },

    //Purchase information details - Scheduled refresh
    payinfo(){
      if (Number(this.payAmount) >= this.currencyData.minSell && Number(this.payAmount) <= this.currencyData.maxSell){
        this.detailedInfo_state = true;
        setTimeout(()=>{
          document.getElementById("buyCrypto").scrollIntoView({behavior: "smooth", block: "end"});
        })
      }else{
        this.detailedInfo_state = false;
      }
    },

    //Real time calculation getAmount
    calculationAmount(){
      if(Number(this.payAmount) >= this.currencyData.minSell && Number(this.payAmount) <= this.currencyData.maxSell){
        //Filter exchange rate - Calculate cost and accepted quantity
        // this.feeInfo.price = this.feeInfo.rate * this.feeInfo.price;
        this.feeInfo.rampFee = ((this.payAmount * this.feeInfo.price * this.feeInfo.percentageFee) + this.feeInfo.fixedFee) * this.feeInfo.rate;
        let newGetAmount = (this.payAmount * this.feeInfo.price * this.feeInfo.rate) - this.feeInfo.rampFee;
        newGetAmount > 0 ? this.getAmount = newGetAmount.toFixed(this.feeInfo.accuracy) : this.getAmount = 0;
        this.$store.state.sellRouterParams.getAmount = this.getAmount;
      }
    },

    //position country
    currentLocation(){
      //提示效果判断
      this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";

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
    },

    handlePayWayList(data,state){
      //展示所需国家参数
      this.positionData = {
        positionValue: data.enCommonName,
        positionImg: data.flag,
        alpha2: data.alpha2,
        fiatCode: data.fiatCode,
      };
      //费用所需参数
      this.$store.state.feeParams.fiatCode = data.fiatCode;
      this.$store.state.feeParams.worldId = data.worldId;
      this.positionData.worldId = data.worldId;
      this.payCommission = data;
      this.$store.state.sellRouterParams.payCommission = data;
      this.$store.state.sellRouterParams.positionData = this.positionData;
      //根据国家对应的币种处理数据
      //state - 1页面初始化数据处理 state - 2选择国家后数据处理
      if(state === 1){
        this.basicData.cryptoCurrencyResponse.cryptoCurrencyList.forEach(item=>{
          if(item.name === "BTC"){
            this.currencyData = {
              icon: item.logoUrl,
              name: item.name,
              maxSell: item.maxSell,
              minSell: item.minSell,
              cryptoCurrencyNetworkId: item.cryptoCurrencyNetworkId
            }
            this.$store.state.feeParams.symbol = item.name; //name -- popularList币种
            this.$store.state.sellRouterParams.cryptoCurrency = item.name;
            this.$store.state.sellRouterParams.currencyData = this.currencyData;
          }
        })
      }
      this.amountControl();
    },

    nextStep(){
      //是否是从菜单进入
      this.$store.state.routerQueryPath = false


      this.payCommission.symbol = this.$store.state.feeParams.symbol;
      let routerParams = {
        amount: this.payAmount,
        getAmount: this.getAmount,
        cryptoCurrency: this.currencyData.name,
        currencyData: this.currencyData,
        payCommission: this.payCommission,
        positionData: this.positionData
      }
      this.$store.state.sellRouterParams = routerParams;
      //获取用户卡信息
      let params = {
        country: this.positionData.alpha2,
        fiatName: this.positionData.fiatCode,
      };
      // Login information
      this.$store.state.emailFromPath = 'sellCrypto';
      this.$axios.get(this.$api.get_userSellCardInfo,params).then(res=>{
        //data - null 没有填写过表单,跳转到表单页
        //data - !null 有填写过表单,跳转到确认订单页
        if(res && res.returnCode === "0000" && res.data === null){
          this.$store.state.homeTabstate = 'sellCrypto';
          this.$store.state.cardInfoFromPath = 'configSell';
          delete this.$store.state.sellForm;
          this.$router.push('/sell-formUserInfo')
        }else if(res && res.returnCode === "0000" && res.data !== null){
          this.$store.state.sellForm = res.data;
          this.$store.state.homeTabstate = 'sellCrypto';
          this.$router.push('/configSell')
        }
      })
    },
  },
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
  font-size: 0.16rem;
  font-family: "GeoRegular", GeoRegular;
  font-weight: normal;
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
  margin: 0.06rem 0.2rem 0 0.16rem;
}

.get_title{
  margin-top: 0.4rem;
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
      border-radius: 50%;
    }
  }
  .getText{
    display: flex;
    font-size: 0.16rem;
    font-family: 'GeoRegular', GeoRegular;
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
  margin-top: 0.32rem;
  margin-bottom: 0.1rem;
  .calculationProcess_line{
    display: flex;
    align-items: center;
    margin-top: 0.13rem;
    .line_name{
      font-size: 0.14rem;
      font-family: "GeoDemibold", GeoDemibold;
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
}
</style>
