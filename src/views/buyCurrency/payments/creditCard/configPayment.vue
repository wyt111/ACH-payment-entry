<template>
  <div class="cardConfigPayment">
    <div class="cardConfigPayment-content">
      <div class="formLine">
        <div class="formTitle">{{ $t('nav.buy_configPay_title1') }}</div>
        <div class="formContent cardInfo" @click="goPayForm">
          <div class="formContent-left">
            <div class="card-icon">
              <img src="../../../../assets/images/visaText.svg" v-if="cardName==='visa'">
              <img src="../../../../assets/images/masterIcon.svg" v-else>
            </div>
            <div class="card-info">{{ cardData.payWayName }}<span>{{ $t('nav.buy_payment_ending') }} {{ cardData.cardNumber ? cardData.cardNumber.substring(cardData.cardNumber.length-4) : '' }}</span></div>
          </div>
          <div class="formContent-right"><img src="../../../../assets/images/rightBlackIcon.png"></div>
        </div>
      </div>
      <!-- 选择支付方式页选择的是之间交易过的卡信息需要重新填写CVV -->
      <div class="formLine" v-if="newCvvState">
        <div class="formTitle">{{ $t('nav.buy_configPay_title2') }}</div>
        <div class="formContent">
          <input type="text" v-model="newCvv" :disabled="cvvDisabled" oninput ="value=value.replace(/[^0-9]/g,'')" maxlength="3" >
          <img class="rightIcon" src="../../../../assets/images/cvv-icon.png">
        </div>
      </div>
      <!-- 选择接收方式的网络地址和名称 -->
      <CryptoCurrencyAddress/>
      <!-- 支付后隐藏协议模块 -->
      <IncludedDetails class="includedDetails" ref="includedDetails_ref" :useFee="true" :isLoading="isLoading" :network="$store.state.buyRouterParams.networkDefault"/>
      <AuthorizationInfo class="AuthorizationInfo" :childData="childData" v-if="AuthorizationInfo_state"/>
    </div>
    <Button :buttonData="buttonData" :disabled="disabled" :loadingDisabled="true" @click.native="submit"></Button>
  </div>
</template>

<script>
import IncludedDetails from "../../../../components/IncludedDetails";
import CryptoCurrencyAddress from "../../../../components/CryptoCurrencyAddress";
import AuthorizationInfo from "../../../../components/AuthorizationInfo";
import { querySubmitToken } from "../../../../utils/publicRequest";
import { AES_Encrypt } from '@/utils/encryp.js';
import {AES_Decrypt} from "../../../../utils/encryp";

export default {
  name: "configPayment",
  components: { IncludedDetails, CryptoCurrencyAddress, AuthorizationInfo },
  data(){
    return{
      cardData: {},
      wishCardData: "",

      timeDown: null,
      submitState: true,
      cardName: '',

      newCvvState: false,
      newCvv: '',
      cvvDisabled: false,


      //勾选协议
      childData: {
        agreement: false,
      },
      AuthorizationInfo_state: true,

      feeInfo: {},

      //按钮状态
      buttonData: {
        loading: false,
        triggerNum: 0,
      },

      //商户信息加载完 加载费用数据
      isLoading: false,
    }
  },
  beforeRouteEnter(to,from,next) {
    next(vm => {
      if ((from.path === '/creditCardForm-cardInfo' || from.path === '/paymentMethod' )&& to.path === '/creditCardConfig' && !from.query.configPaymentFrom) {
        vm.newCvv = "";
      }
    })
  },
  activated(){
    //恢复页面默认状态
    this.buttonData = {
      loading: false,
      triggerNum: 0,
    };
    this.submitState = true;
    this.cvvDisabled = false;
    this.AuthorizationInfo_state = true;
    //接入商户逻辑
    if(!this.$store.state.goHomeState){
      this.newCvvState = true;
      this.buyOrderInfo();
      return
    }
    this.reviceInfo();
  },
  computed:{
    disabled(){
      if(this.newCvvState === true && this.childData.agreement === true && this.newCvv.length === 3){
        return false;
      }else if(this.newCvvState === false && this.childData.agreement === true){
        return false;
      }else{
        return true;
      }
    }
  },
  methods: {
    //商户接入查询
    buyOrderInfo(){
      let _this = this;
      this.$axios.get(this.$api.get_orderState + this.$route.query.merchant_orderNo,'').then(res=>{
        if(res && res.returnCode === "0000" && res.data !== null){
          //获取订单信息
          _this.$store.state.buyRouterParams.cryptoCurrency = res.data.cryptoCurrency;
          _this.$store.state.buyRouterParams.getAmount = res.data.fiatCurrencyAmount;
          _this.$store.state.buyRouterParams.amount = res.data.fiatCurrencyAmount;
          _this.$store.state.buyRouterParams.payCommission.symbol = res.data.currencySymbol;
          _this.$store.state.buyRouterParams.payCommission.code = res.data.fiatCurrency;
          _this.$store.state.buyRouterParams.addressDefault = res.data.address;
          _this.$store.state.buyRouterParams.networkDefault = res.data.network;
          _this.$store.state.buyRouterParams.feeRate = res.data.feeRate;
          _this.$store.state.buyRouterParams.fixedFee = res.data.fixedFee;
          _this.$store.state.buyRouterParams.exchangeRate = res.data.usdToXR;
          _this.$store.state.buyRouterParams.submitForm = res.data.cardInfo;
          //计算rampFee
          let decimalDigits = 0;
          let resultValue = Number(res.data.feeRate) * Number(res.data.amount) + res.data.fixedFee;
          resultValue >= 1 ? decimalDigits = 2 : decimalDigits = 6;
          let rampFee = resultValue.toFixed(decimalDigits);
          isNaN(resultValue) || rampFee <= 0 ? rampFee = 0 : '';
          this.$store.state.buyRouterParams.payCommission.rampFee = rampFee;
          //费用组件计算数量
          _this.isLoading = true;
          //获取、处理卡信息
          _this.cardData = JSON.parse(JSON.stringify(res.data.cardInfo));
          this.$store.state.buyRouterParams.orderNo = this.$route.query.merchant_orderNo;
          this.$store.state.buyRouterParams.userCardId = res.data.cardInfo.userCardId;
          _this.cardData.cardNumber = AES_Decrypt(_this.cardData.cardNumber.replace(/ /g,'+'));
          let cardNum = _this.cardData.cardNumber.substring(0,1);
          _this.cardName = cardNum === '4' ? 'visa' : 'master';
          _this.wishCardData = JSON.stringify(res.data.cardInfo);
        }
      })
    },

    reviceInfo(){
      //获取卡信息
      if(this.$route.query.submitForm){
        this.cardData = JSON.parse(this.$route.query.submitForm)
        this.cardData.cardNumber = AES_Decrypt(this.cardData.cardNumber.replace(/ /g,'+'));
        let cardNum = this.cardData.cardNumber.substring(0,1);
        this.cardName = cardNum === '4' ? 'visa' : 'master';
        this.wishCardData = this.$route.query.submitForm;
      }

      //判断上一页路由 控制填写CVV状态
      this.newCvvState = (this.$route.query.configPaymentFrom && this.$route.query.configPaymentFrom === 'userPayment') ? true : false;
    },

    //跳转修改卡信息页面
    goPayForm(){
      this.submitState === true ? this.$router.push(`/creditCardForm-cardInfo?submitForm=${this.wishCardData}&configPaymentFrom=userPayment&merchant_orderNo=${this.$route.query.merchant_orderNo}`) : '';
    },

    /**
     * childData.agreement: 勾选协议状态,
     * buttonData.agreement: 1 - 支付 >1 查询支付状态
     * @returns {Promise<void>}
     */
    async submit(){
      //勾选协议校验
      if(this.childData.agreement === false){
        return;
      }

      if(this.buttonData.triggerNum === 1){
        this.cvvDisabled = true;
        await this.pay();
      }
      // else{
      //   this.queryOrderStatus();
      // }
    },
    //支付
    /**
     * submitToken: true状态为已经请求到submit-token
     * submitState: 只能触发一次，直到上一次有回调
     */
    async pay(){
      this.AuthorizationInfo_state = false;
      let submitToken = await querySubmitToken();
      if(this.submitState === true && submitToken === true){
        this.submitState = false;
        let newParams = {};
        newParams.orderNo = this.$store.state.buyRouterParams.orderNo;
        newParams.userCardId = this.$store.state.buyRouterParams.userCardId;
        this.newCvvState === true ? newParams.cvv = AES_Encrypt(this.newCvv) : newParams.cvv = JSON.parse(this.$route.query.submitForm).cardCvv.replace(/ /g,'+');
        this.$axios.post(this.$api.post_internationalCard,newParams,'submitToken').then(res=>{
          if(res && res.returnCode === '0000'){
            if(JSON.stringify(res.data) !== "{}"){
              window.location = res.data.webUrl;
            }else{
              this.timeDown = setInterval(()=>{
                this.queryOrderStatus();
              },1000)
            }
            this.submitState = true;
          }else {
            this.submitState = true;
            this.cvvDisabled = false;
            this.buttonData = {
              loading: false,
              triggerNum: 0,
            };
          }
        }).catch(()=>{
          this.cvvDisabled = false;
          this.submitState = true;
          this.buttonData = {
            loading: false,
            triggerNum: 0,
          };
        })
      }
    },
    //查询订单状态
    queryOrderStatus(){
      let params = {
        "orderNo": this.$store.state.buyRouterParams.orderNo
      }
      this.$axios.get(this.$api.get_payResult,params).then(res2=>{
        if(res2.data.orderStatus && res2.data.orderStatus > 2 && res2.data.orderStatus <= 6){
          // Clear create order token
          localStorage.removeItem("submit-token");
          this.submitState = true;
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.$store.state.buyRouterParams.orderNo}`);
        }
      })
    },
  },
  deactivated(){
    this.$store.commit("clearToken"); //取消请求
    this.$store.commit("emptyToken"); // 清空token数组
    window.clearInterval(this.timeDown);
    this.timeDown = null;
  },
}
</script>

<style lang="scss" scoped>
.cardConfigPayment{
display: flex;
flex-direction: column;
.cardConfigPayment-content{
  flex: 1;
  overflow: auto;
}
}

.formLine{
  margin-top: 0.32rem;
  .formTitle{
    font-size: 0.13rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
    color: #707070;
    display: flex;
    align-items: flex-end;
    .formTitle_logo{
      margin-left: auto;
      color: darkgray;
      img{
        width: 0.4rem;
      }
    }
  }
  .cardInfo{
    cursor: pointer;
  }
  .formContent{
    display: flex;
    align-items: center;
    margin-top: 0.08rem;
    position: relative;
    height: 0.56rem;
    background: #F3F4F5;
    border-radius: 0.12rem;
    font-size: 0.13rem;
    font-family: "GeoLight", GeoLight;
    font-weight: normal;
    color: #707070;
    border: none;
    outline: none;
    padding: 0 0.16rem;
    input{
      width: 100%;
      height: 0.56rem;
      background: #F3F4F5;
      border-radius: 0.12rem;
      font-size: 0.16rem;
      color: #232323;
      font-family: "GeoRegular", GeoRegular;
      font-weight: normal;
      border: none;
      outline: none;
      padding: 0 0.08rem 0 0;
    }
    .rightIcon{
      width: 0.2rem;
    }
    .formContent-left{
      display: flex;
      align-items: center;
      .card-info{
        font-size: 0.16rem;
        font-family: "GeoRegular", GeoRegular;
        font-weight: normal;
        color: #232323;
        margin-left: 0.16rem;
        span{
          font-size: 0.13rem;
          font-family: "GeoLight", GeoLight;
          font-weight: normal;
          color: #707070;
          margin-left: 0.08rem;
        }
      }
      .card-icon{
        display: flex;
        align-items: center;
        img{
          width: 0.52rem;
        }
      }
    }
    .formContent-right{
      display: flex;
      align-items: center;
      margin-left: auto;
      img{
        width: 0.24rem;
      }
    }
  }
}
.includedDetails{
  margin-top: 0.32rem;
}
.AuthorizationInfo{
  margin-bottom: 0.2rem;
}
</style>
