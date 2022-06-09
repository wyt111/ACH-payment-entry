<template>
  <div id="internationalCardPay_box">
    <div id="internationalCardPay">
      <div class="view-content">

        <div class="formLine formLine_flex">
          <div class="formLine_flex_child">
            <div class="formTitle">First Name</div>
            <div class="formContent"><input type="text" v-model="params.firstname" maxlength="50"></div>
          </div>
          <div class="formLine_flex_child">
            <div class="formTitle">Last Name</div>
            <div class="formContent"><input type="text" v-model="params.lastname" maxlength="50"></div>
          </div>
        </div>
<!--        <div class="formLine">-->
<!--          <div class="formTitle">Email</div>-->
<!--          <div class="formContent"><input type="email" v-model="params.email"></div>-->
<!--        </div>-->

        <div class="formLine">
          <div class="formTitle">
            <div>Card Number</div>
            <div class="formTitle_logo">
              <img v-if="visaState" src="../../../../assets/images/visaText.png">
              <img v-if="masterState" src="../../../../assets/images/masterIcon.png">
            </div>
          </div>
          <div class="formContent">
            <van-field class="number_input" type="digit" v-model="params.cardNumber" @input="cardChange" @blur="cardBlur" maxlength="23"/>
          </div>
        </div>
        <!-- error tips -->
        <div class="errorTips" v-if="errorCard">Please enter a valid card number.</div>
        <div class="formLine">
          <div>
            <div class="formTitle">Expiration Date</div>
            <div class="formContent"><input type="text" v-model="timeData" @input="timeChange" @blur="timeBlur" @keyup.delete="timeDelete" maxlength="7" placeholder="MM / YY"></div>
          </div>
          <!-- error tips -->
          <div class="errorTips" v-if="errorTime">Invaid expiry date</div>
        </div>
        <div class="formLine">
          <div>
            <div class="formTitle">CVV</div>
            <div class="formContent"><input type="text" v-model="params.cardCvv" oninput ="value=value.replace(/[^0-9]/g,'')" maxlength="4"></div>
          </div>
          <!-- error tips -->
          <div class="errorTips" v-if="errorCvv">Please enter a valid CVV.</div>
        </div>
      </div>
      <button class="continue" :class="{'buttonTrue': buttonState}" :disabled="!buttonState" @click="submitPay">Continue</button>
    </div>
  </div>
</template>

<script>
import { AES_Decrypt, AES_Encrypt } from '@/utils/encryp.js';

export default {
  name: "International-card-payment",
  data(){
    return{
      params: {
        firstname: "",
        lastname: "",
        email: "",
        cardNumber: "",
        cardCvv: "",
        cardExpireYear: "",
        cardExpireMonth: "",
      },

      timeData: '',
      oldTimeData: '',

      visaState: true,
      masterState: true,

      errorCard: false,
      errorCvv: false,
      errorTime: false,
    }
  },
  computed: {
    buttonState(){
      if(this.params.firstname !== ''&&this.params.lastname !== ''&&this.params.email !== ''&&this.params.cardNumber !== "" && this.params.cardCvv !== "" && this.timeData.length === 7&&this.errorTime === false){
        return true;
      }else{
        return false;
      }
    },
  },
  //选择支付方式页选择新增卡信息进入 - configPaymentFrom判断是否是新增卡信息
  beforeRouteEnter(to,from,next){
    next(vm => {
      if(from.path === '/paymentMethod' && to.path === '/creditCardForm-cardInfo' && !from.query.configPaymentFrom){
        vm.params = {
          firstname: "",
          lastname: "",
          email: AES_Decrypt(localStorage.getItem("email")),
          cardNumber: "",
          cardCvv: "",
          cardExpireYear: "",
          cardExpireMonth: "",
        };
        vm.timeData = "";
        vm.visaState = true;
        vm.masterState = true;
        vm.errorCard = false;
        vm.errorCvv = false;
        vm.errorTime = false
      }
    });
  },
  activated(){
    //获取地址卡信息或历史卡信息
    if(this.$route.query.submitForm && this.$route.query.configPaymentFrom === 'userPayment'){
      let addressForm = JSON.parse(this.$route.query.submitForm);
      (addressForm.cardNumber !== undefined && addressForm.cardNumber !== "") ? addressForm.cardNumber = AES_Decrypt(addressForm.cardNumber.replace(/ /g,'+')) : '';
      //去除地址栏穿参导致参数中拼有空格问题
      addressForm.firstname = AES_Decrypt(addressForm.firstname.replace(/ /g,'+'));
      addressForm.lastname = AES_Decrypt(addressForm.lastname.replace(/ /g,'+'));
      // addressForm.phone = AES_Decrypt(addressForm.phone.replace(/ /g,'+'));
      addressForm.email = AES_Decrypt(addressForm.email.replace(/ /g,'+'));
      this.params = {...this.params,...addressForm};
      //获取历史卡信息中的日期
      if(this.$route.query.submitForm && this.params.cardExpireMonth !== '' && this.params.cardExpireYear !== ''){
        this.timeData = this.params.cardExpireMonth + ' / ' + this.params.cardExpireYear.substring(2,4);
      }
      //只有确认支付方式页
      if(this.params.cardCvv !== ""){
        this.params.cardCvv = AES_Decrypt(this.params.cardCvv);
      }else{
        this.params.cardCvv = "";
      }
    }
  },
  watch: {
    //Enter date limit manually - Store value before change
    timeData(val,oldVal){
      this.oldTimeData = oldVal;
    }
  },
  methods:{
    //Enter date limit manually
    timeChange(val){
      var target = Number(val.target.value[val.target.value.length-1]);
      if(target == '1' || target == '2' || target == '3' || target == '4' || target == '5' || target == '6' || target == '7' || target == '8' || target == '9' || target == '0'){
        setTimeout(()=> {
          if(Number(val.target.value.substring(0,2)) > 12){
            this.errorTime = true;
          }else{
            this.errorTime = false;
          }
          if (val.target.value.length === 1 && val.target.value > 1) {
            this.timeData = "0" + val.target.value + ' /\u00a0';
          } else if (val.target.value.length === 2 && this.oldTimeData.length === 1) {
            this.timeData = val.target.value + ' /\u00a0';
          }
          let timeDate = "20" +val.target.value.substring(5,7) + "-" + val.target.value.substring(0,2);
          let currentTime = new Date().getFullYear() + "-" + (new Date().getMonth() + 1)
          if(val.target.value.length === 7 && new Date(timeDate).getTime() < new Date(currentTime).getTime()){
            this.errorTime = true;
          }
        })
      }else{
        this.errorTime = true;
        // this.timeData = val.target.value.replace(/[^0-9// /]/g,'');
        // this.timeData = val.target.value.substr(0,val.target.value.indexOf(val.target.value[val.target.value.length-1]));
      }
    },
    timeBlur(){
      if(this.timeData.length !== 7){
        this.errorTime = true;
      }
    },
    timeDelete(val){
      setTimeout(()=>{
        if(val.target.value.length === 4 && this.oldTimeData.length === 5){
          this.timeData = val.target.value.substring(0,1);
        }
      })
    },

    //卡号验证
    cardBlur(){
      let cardNumber = this.params.cardNumber.replace(/\s*/g,"");
      let firstCardNumber = cardNumber.substring(0,1);
      let regular = firstCardNumber === '4' ? /^4[0-9]{12}(?:[0-9]{3})?$/ : firstCardNumber === '5' ? /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/ : /^4[0-9]{12}(?:[0-9]{3})?$/;
      if(this.params.cardNumber === '' || !regular.test(cardNumber)){
        this.errorCard = true;
      }else {
        this.errorCard = false;
      }
    },

    cardChange(value){
      //Add a space between every four digits of the credit card number
      if(value !== '' && value !== undefined){
        this.params.cardNumber = value.replace(/\s/g,'').replace(/....(?!$)/g,'$& ');
      }
      //判断卡号是Visa or Master
      setTimeout(()=>{
        if(Number(value) === 4){
          this.masterState = false;
          this.visaState = true;
          return;
        }
        if(Number(value) === 5){
          this.masterState = true;
          this.visaState = false;
          return;
        }
        this.masterState = true;
        this.visaState = true;
      })
    },

    //验证、提交卡信息
    submitPay(){
      //email验证
      // if(!new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$").test(this.params.email)){
      //   this.$toast("not a valid email.");
      //   return;
      // }

      //卡号验证
      let cardNumber = this.params.cardNumber.replace(/\s*/g,"");
      let firstCardNumber = cardNumber.substring(0,1);
      let regular = firstCardNumber === '4' ? /^4[0-9]{12}(?:[0-9]{3})?$/ : firstCardNumber === '5' ? /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/ : /^4[0-9]{12}(?:[0-9]{3})?$/;
      if(this.params.cardNumber === '' || !regular.test(cardNumber)){
        this.errorCard = true;
        return;
      }

      //CVV验证
      if(this.params.cardCvv.length < 3 || this.params.cardCvv.length > 4){
        this.errorCvv = true;
        return;
      }
      this.errorCvv = false;
      this.errorCard = false;

      //拼接年月日期参数
      this.params.cardExpireMonth = this.timeData.substring(0,2);
      this.params.cardExpireYear = '20' + this.timeData.substring(5,7);

      let queryParams = {...queryParams,...this.params};

      //需要加密的敏感字段
      queryParams.cardNumber = AES_Encrypt(cardNumber).replace(/ /g,'');
      queryParams.cardCvv = AES_Encrypt(queryParams.cardCvv);

      queryParams.firstname = AES_Encrypt(queryParams.firstname);
      queryParams.lastname = AES_Encrypt(queryParams.lastname);
      queryParams.email = localStorage.getItem("email");

      this.$axios.post(this.$api.post_saveCardInfo,queryParams,'').then(res=>{
        if(res && res.returnCode === '0000'){
          queryParams.cardNumber = queryParams.cardNumber.replace(/ /g,'');
          queryParams.userCardId = res.data.userCardId;
          //是否验证过baseId
          if(JSON.parse(this.$route.query.routerParams).kyc === true){
            this.$router.replace(`/basisIdAuth?routerParams=${this.$route.query.routerParams}&submitForm=${JSON.stringify(queryParams)}`);
            return;
          }
          //跳转确认订单页
          this.$router.replace(`/creditCardConfig?routerParams=${this.$route.query.routerParams}&submitForm=${JSON.stringify(queryParams)}`);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#internationalCardPay{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .view-content{
    flex: 1;
    overflow: auto;
    padding-bottom: 0.2rem;
    .errorTips{
      font-size: 0.14rem;
      font-family: "Jost", sans-serif;
      font-weight: 400;
      color: #FF0000;
      margin-top: 0.1rem;
    }
  }
  .formLine{
    margin-top: 0.2rem;
    .formTitle{
      font-size: 0.14rem;
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      color: #232323;
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
    .formContent{
      display: flex;
      margin-top: 0.12rem;
      position: relative;
      input{
        width: 100%;
        height: 0.6rem;
        background: #F3F4F5;
        border-radius: 10px;
        font-size: 0.16rem;
        font-family: 'Jost', sans-serif;
        font-weight: 500;
        border: none;
        outline: none;
        padding: 0 0.2rem;
      }
      .rightIcon{
        display: flex;
        position: absolute;
        top: 0.23rem;
        right: 0.2rem;
        img{
          width: 0.12rem;
        }
      }
    }
  }
  .formLine_flex{
    display: flex;
    .formLine_flex_child:nth-of-type(1){
      padding-right: 0.1rem;
    }
    .formLine_flex_child:nth-of-type(2){
      padding-left: 0.1rem;
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
    margin: 0.1rem 0 0 0;
    cursor: no-drop;
    border: none;
  }
  .buttonTrue{
    background: #4479D9 !important;
    cursor: pointer;
  }
}
.year ::v-deep .van-picker-column:nth-of-type(2){
  display: none !important;
}
.month ::v-deep .van-picker-column:nth-of-type(1){
  display: none !important;
}

.van-popup{
  max-height: 35%;
  position: absolute;
  bottom: 0;
  left: 0;
  box-shadow: 0 0 40px #4479D9;
  border-radius: 0 0 25px 25px;
}

//数字输入框
.van-cell{
  padding: 0 !important;
}
.number_input ::v-deep .van-field__control{
  width: 100%;
  min-height: 0.6rem;
  background: #F3F4F5;
  border-radius: 10px;
  font-size: 0.16rem;
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  border: none;
  outline: none;
  padding: 0 0.2rem;
  &::placeholder{
    color: #999999 !important;
  }
}
</style>
<style>
.van-overlay{
  background-color: rgba(0,0,0,0);
}
</style>
