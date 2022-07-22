<template>
  <div id="internationalCardPay_box">
    <div id="internationalCardPay" ref="box_ref" @scroll="handleScroll">
      <div class="view-content" ref="form_ref">
        <div class="formLine formLine_flex">
          <div class="formLine_flex_child">
            <div class="formTitle">{{ $t('nav.buy_form_firstName') }}</div>
            <div class="formContent"><input type="text" v-model="params.firstname" @input="nameChange('first')" maxlength="50"></div>
            <div class="errorTips" v-if="errorFirstname">{{ $t('nav.sell_form_NameTips') }}</div>
          </div>
          <div class="formLine_flex_child">
            <div class="formTitle">{{ $t('nav.buy_form_lastName') }}</div>
            <div class="formContent"><input type="text" v-model="params.lastname" @input="nameChange('last')" maxlength="50"></div>
            <div class="errorTips" v-if="errorLastname">{{ $t('nav.sell_form_NameTips') }}</div>
          </div>
        </div>
        <div class="formLine">
          <div class="formTitle">
            <div>{{ $t('nav.buy_form_cardNumber') }}</div>
            <div class="formTitle_logo">
              <img v-if="visaState" src="../../../../assets/images/visaText.svg">
              <img v-if="masterState" src="../../../../assets/images/masterIcon.svg">
            </div>
          </div>
          <div class="formContent">
            <van-field class="number_input" type="digit" v-model="params.cardNumber" @input="cardChange" maxlength="23"/>
          </div>
          <!-- error tips -->
          <div class="errorTips" v-if="errorCard">{{ $t('nav.buy_form_cardNumTips') }}</div>
        </div>
        <div class="formLine">
          <div>
            <div class="formTitle">{{ $t('nav.buy_form_expirationDate') }}</div>
            <div class="formContent">
              <input type="text" v-model="timeData" @input="timeChange" @blur="timeBlur" @keyup.delete="timeDelete" maxlength="7" placeholder="MM / YY">
            </div>
          </div>
          <!-- error tips -->
          <div class="errorTips" v-if="errorTime">{{ $t('nav.buy_form_dataTips') }}</div>
        </div>
        <div class="formLine">
          <div>
            <div class="formTitle">{{ $t('nav.buy_configPay_title2') }}</div>
            <div class="formContent">
              <van-field class="number_input" type="digit" v-model="params.cardCvv" @input="cvvChange" maxlength="3"/>
            </div>
          </div>
          <!-- error tips -->
          <div class="errorTips" v-if="errorCvv">{{ $t('nav.buy_form_cvvTips') }}</div>
        </div>
        <!-- tips icon -->
        <transition>
          <div class="downTips-icon" v-show="goDown_state" @click="goDown"><img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt=""></div>
        </transition>
      </div>
      <button class="continue" :disabled="buttonState" @click="submitPay" v-show="buttonIsShow" ref="button_ref">
        {{ $t('nav.Continue') }}
        <img class="rightIcon" src="../../../../assets/images/button-right-icon.png" v-if="!request_loading">
        <van-loading class="icon rightIcon loadingIcon" type="spinner" color="#fff" v-else/>
      </button>
    </div>
  </div>
</template>

<script>
import { AES_Decrypt, AES_Encrypt } from '@/utils/encryp.js';
import valid from 'card-validator';

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
        source: 0,
      },

      timeData: '',
      oldTimeData: '',

      visaState: true,
      masterState: true,

      errorFirstname: false,
      errorLastname: false,
      errorCard: false,
      errorCvv: false,
      errorTime: false,

      buttonIsShow:true,

      request_loading: false,

      goDown_state: false,
      oldOffsetTop: 0,
      timeDown: null,
    }
  },
  computed: {
    buttonState(){
      if(this.params.firstname !== ''&&this.params.lastname !== ''&&
          this.errorFirstname===false&&this.errorLastname===false&&
          this.params.cardNumber !== "" && this.errorCard === false &&
          this.params.cardCvv !== "" && this.params.cardCvv.length >= 3 &&
          this.timeData.length === 7 && this.errorTime === false&&
          this.request_loading === false){
        return false;
      }else{
        return true;
      }
    },
  },
  //选择支付方式页选择新增卡信息进入 - configPaymentFrom判断是否是新增卡信息
  beforeRouteEnter(to,from,next){
    next(vm => {
      if(from.path === '/paymentMethod' && to.path === '/creditCardForm-cardInfo' && !from.query.configPaymentFrom){
        vm.firstname = "";
        vm.params = {
          firstname: "",
          lastname: "",
          email: localStorage.getItem("email"),
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
    //初始化根据可视高度控制向下提示按钮状态
    this.$nextTick(()=>{
      if(this.$refs.box_ref.offsetHeight + 4 < document.getElementById("internationalCardPay").scrollHeight - 50){
        this.goDown_state = true;
      }else{
        this.goDown_state = false;
      }
    })
    //获取地址卡信息或历史卡信息
    if(this.$route.query.submitForm && this.$route.query.configPaymentFrom === 'userPayment'){
      let addressForm = JSON.parse(this.$route.query.submitForm);
      addressForm.cardNumber = AES_Decrypt(addressForm.cardNumber.replace(/ /g,'+'));
      addressForm.cardNumber = addressForm.cardNumber.replace(/\s/g,'').replace(/....(?!$)/g,'$& ')
      //去除地址栏穿参导致参数中拼有空格问题
      addressForm.firstname = AES_Decrypt(addressForm.firstname.replace(/ /g,'+'));
      addressForm.lastname = AES_Decrypt(addressForm.lastname.replace(/ /g,'+'));
      // addressForm.phone = AES_Decrypt(addressForm.phone.replace(/ /g,'+'));
      addressForm.email = addressForm.email.replace(/ /g,'+');
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
      this.timeData = this.timeData.replace(/[^0-9][s+][/]/g, '');
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

    nameChange(witch){
      if(witch === 'first'){
        if(!new RegExp("^[A-Za-z]{1,50}$").test(this.params.firstname)){
          this.errorFirstname = true;
        }else{
          this.errorFirstname = false;
        }
      }else{
        if(!new RegExp("^[A-Za-z]{1,50}$").test(this.params.lastname)){
          this.errorLastname = true;
        }else{
          this.errorLastname = false;
        }
      }
    },

    cardChange(value){
      //Add a space between every four digits of the credit card number
      if(value !== '' && value !== undefined){
        this.params.cardNumber = value.replace(/\s/g,'').replace(/....(?!$)/g,'$& ');
        //卡号验证
        let validObject = valid.number(this.params.cardNumber);
        if(this.params.cardNumber !== '' && validObject.isValid && (validObject.card.type === 'mastercard' || validObject.card.type === 'visa')){
          this.errorCard = false;
        }else {
          this.errorCard = true;
        }
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

    //CVV验证
    cvvChange(value){
      if(value.length < 3 || value.length > 4){
        this.errorCvv = true;
      }else{
        this.errorCvv = false;
      }
    },

    //按钮进入可视区域，隐藏滚动到底部按钮
    handleScroll(val){
      window.clearTimeout(this.timeDown);
      this.timeDown = null;
      let offset = this.$refs.button_ref.getBoundingClientRect();

      //滚动的像素+容器的高度>可滚动的总高度-50像素
      if(this.oldOffsetTop !== offset.top && (val.srcElement.scrollTop+val.srcElement.offsetHeight<val.srcElement.scrollHeight - 50)){
        this.goDown_state = false;
        window.clearTimeout(this.timeDown);
        this.timeDown = null;
        this.timeDown = setTimeout(()=>{
          this.goDown_state = true;
        },1000)
      }

      if(val.srcElement.scrollTop+val.srcElement.offsetHeight>val.srcElement.scrollHeight - 50) {
        window.clearTimeout(this.timeDown);
        this.timeDown = null;
        this.goDown_state = false;
      }
      this.oldOffsetTop = offset.top;
    },
    goDown(){
      setTimeout(()=>{
        this.$refs.button_ref.scrollIntoView({behavior: "smooth", block: "end", inline: 'end'})
        this.goDown_state = false;
      })
    },
    elShaking(el) {
      const maxAngle = 10 // 震动偏移角度
      const interval = 12 // 震动快慢，数字越小越快，太小DOM反应不过来，看不出动画
      const quarterCycle = 10 // 一次完整来回震动的四分之一周期
      let curAngle = 0
      let direction = 1
      const timer = setInterval(function(){
        if (direction > 0) {
          curAngle++
          if (curAngle === maxAngle) {
            direction = -1
          }
        } else {
          curAngle--
          if (curAngle === -maxAngle) {
            direction = 1
          }
        }
        el.style.transform = 'rotate(' + curAngle + 'deg)';
      }, interval)
      setTimeout(function(){
        clearInterval(timer)
      }, maxAngle * interval * quarterCycle);
    },

    //验证、提交卡信息
    submitPay(){
      this.request_loading = true;
      //拼接年月日期参数
      this.params.cardExpireMonth = this.timeData.substring(0,2);
      this.params.cardExpireYear = '20' + this.timeData.substring(5,7);

      let queryParams = JSON.parse(JSON.stringify(this.params));

      //需要加密的敏感字段
      let cardNumber = this.params.cardNumber.replace(/\s*/g,"");
      queryParams.cardNumber = AES_Encrypt(cardNumber).replace(/ /g,'');
      queryParams.cardCvv = AES_Encrypt(queryParams.cardCvv);

      queryParams.firstname = AES_Encrypt(queryParams.firstname.trim());
      queryParams.lastname = AES_Encrypt(queryParams.lastname.trim());
      queryParams.email = localStorage.getItem("email");
      queryParams.source = 0;
      this.$axios.post(this.$api.post_saveCardInfo,queryParams,'').then(res=>{
        this.request_loading = false;
        if(res && res.returnCode === '0000'){
          queryParams.cardNumber = queryParams.cardNumber.replace(/ /g,'');
          queryParams.userCardId = res.data.userCardId;
          this.$store.state.buyRouterParams.userCardId = res.data.userCardId;
          //是否验证过baseId
          if(this.$store.state.buyRouterParams.kyc === true){
            this.$router.replace(`/basisIdAuth?submitForm=${JSON.stringify(queryParams)}`);
            return;
          }
          //跳转确认订单页
          this.$router.replace(`/creditCardConfig?submitForm=${JSON.stringify(queryParams)}&merchant_orderNo=${this.$route.query.merchant_orderNo}`);
        }
      }).catch(()=>{
        this.request_loading = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#internationalCardPay{
  height: 100%;
  overflow-y: scroll;
  .view-content{
    padding-bottom: 0.36rem;
    padding-top: 0.28rem;
    .errorTips{
      position: absolute;
      font-size: 0.13rem;
      font-family: "GeoLight", GeoLight;
      font-weight: 400;
      color: #E55643;
      margin: 0.08rem 0.2rem 0 0.16rem;
    }
  }
  .formLine{
    margin-top: 0.28rem;
    position: relative;
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
        display: flex;
        align-items: center;
        img{
          width: 0.41rem;
          &:last-child{
            margin-left: 0.08rem;
          }
        }
      }
    }
    .formContent{
      display: flex;
      margin-top: 0.08rem;
      position: relative;
      input{
        width: 100%;
        height: 0.56rem;
        background: #F3F4F5;
        border-radius: 0.12rem;
        font-size: 0.16rem;
        font-family: "GeoRegular", GeoRegular;
        font-weight: 500;
        color: #232323;
        border: none;
        outline: none;
        padding: 0 0.16rem;
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
      .loadingIcon{
        top: 0.15rem;
      }
    }
    &:first-child{
      margin-top: 0;
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
    height: 0.58rem;
    background: #0059DA;
    border-radius: 0.29rem;
    font-size: 0.17rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
    color: #FFFFFF;
    cursor: pointer;
    border: none;
    position: relative;
    .rightIcon{
      width: 0.24rem;
      position: absolute;
      top: 0.17rem;
      right: 0.32rem;
    }
  }
  .continue:disabled{
    background: rgba(0, 89, 218, 0.5);
    cursor: no-drop;
  }

  .downTips-icon{
    position: absolute;
    bottom: 1.1rem;
    right: 0.3rem;
    width: 0.58rem;
    height: 0.58rem;
    border-radius: 50%;
    //background: #0059DA;
    background: rgba(131,179,249,1);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img{
      width: 0.3rem;
    }
  }
  .downTips-icon img{
    animation: jumpBoxHandler 1.8s infinite;/* 1.8s 事件完成时间周期 infinite无限循环 */
  }

  .v-enter-active,.v-leave-active{
    transition: all 1s;
  }
  .v-enter,.v-leave-to{
    opacity: 0;
  }
  .v-enter-to,.v-leave{
    opacity: 0.8;
  }


  @keyframes jumpBoxHandler { /* css事件 */
    0% {
      transform: translate(0px, 0);
    }
    50% {
      transform: translate(0px, 0.06rem); /* 可配置跳动方向 */
    }
    100% {
      transform: translate(0px, 0px);
    }
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
  border-radius: 0.12rem;
  font-size: 0.16rem;
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  border: none;
  outline: none;
  padding: 0 0.16rem;
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
