<template>
  <div id="internationalCardPay">
    <div class="view-content">
      <div class="formLine">
        <div class="formTitle">Country</div>
        <div class="formContent"><input type="text" v-model="params.country"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">State</div>
        <div class="formContent"><input type="text" v-model="params.state"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">City</div>
        <div class="formContent"><input type="text" v-model="params.city"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">Postcode</div>
        <div class="formContent"><input type="number" v-model="params.postcode" onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">Address</div>
        <div class="formContent"><input type="text" v-model="params.address"></div>
      </div>
      <div class="formLine formLine_flex">
        <div class="formLine_flex_child">
          <div class="formTitle">First Name</div>
          <div class="formContent"><input type="text" v-model="params.firstname"></div>
        </div>
        <div class="formLine_flex_child">
          <div class="formTitle">Last Name</div>
          <div class="formContent"><input type="text" v-model="params.lastname"></div>
        </div>
      </div>
      <div class="formLine">
        <div class="formTitle">Phone</div>
        <div class="formContent"><input type="number" v-model="params.phone" onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">Email</div>
        <div class="formContent"><input type="email" v-model="params.email"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">
          <div>Card Number</div>
          <div class="formTitle_logo">
            <img src="../../../assets/images/visaText.png">
            <img src="../../../assets/images/visaImage.png">
          </div>
        </div>
        <div class="formContent cardNumber"><input type="text" v-model="params.cardNumber"></div>
      </div>
      <!-- error tips -->
      <div class="errorTips" v-if="errorCard">not a valid card.</div>
      <div class="formLine formLine_flex">
        <div class="formLine_flex_child">
          <div class="formTitle">Expiration Date</div>
          <div class="formContent" @click="monthPickerState=true"><input type="text" v-model="params.cardExpireMonth" :placeholder="timePlaceholder_month" disabled><span class="rightIcon"><img src="../../../assets/images/rightIcon.png"></span></div>
        </div>
        <div class="formLine_flex_child">
          <div class="formTitle">&nbsp;</div>
          <div class="formContent" @click="yearPickerState=true"><input type="text" v-model="params.cardExpireYear" :placeholder="timePlaceholder_year" disabled><span class="rightIcon"><img src="../../../assets/images/rightIcon.png"></span></div>
        </div>
      </div>
      <div class="formLine">
        <div class="formTitle">Card CVV</div>
        <div class="formContent"><input type="text" v-model="params.cardCvv"></div>
      </div>
      <!-- error tips -->
      <div class="errorTips" v-if="errorCvv">not a valid cvv.</div>
    </div>

    <div class="continue" :class="{'buttonTrue': buttonState}" @click="submitPay">Confirm Payment</div>

    <div class="year">
      <van-popup v-model="yearPickerState" round position="bottom">
        <van-datetime-picker
            v-model="currentDate_year"
            type="year-month"
            confirm-button-text="Continue"
            cancel-button-text="Cancel"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="yearPickerState = false"
            @confirm="onConfirmYear"
        />
      </van-popup>
    </div>
    <div class="month">
      <van-popup v-model="monthPickerState" round position="bottom">
        <van-datetime-picker
            v-model="currentDate_month"
            type="year-month"
            confirm-button-text="Continue"
            cancel-button-text="Cancel"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="monthPickerState = false"
            @confirm="onConfirmMonth"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
// import moment from ''
import { parseTime } from '@/utils/index';

export default {
  name: "International-card-payment",
  data(){
    return{
      params: {
        cardNumber: "",
        cardCvv: "",
        cardExpireYear: "",
        cardExpireMonth: "",
        firstname: "",
        lastname: "",
        phone: "",
        country: "",
        city: "",
        state: "",
        address: "",
        email: "",
        postcode: "",
      },

      timePlaceholder_year: parseTime(new Date(),'{y}'),
      timePlaceholder_month: parseTime(new Date(),'{m}'),

      yearPickerState: false,
      monthPickerState: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate_year: new Date(),
      currentDate_month: new Date(),

      errorCard: false,
      errorCvv: false,
    }
  },
  computed: {
    buttonState(){
      if(this.params.cardNumber !== ""&&this.params.postcode !== ""&&
          this.params.cardCvv !== ""&&this.params.cardExpireYear !== ""&&
          this.params.cardExpireMonth !== ""&&this.params.firstname !== ""&&
          this.params.lastname !== ""&&this.params.phone !== ""&&
          this.params.country !== ""&&this.params.city !== ""&&
          this.params.state !== ""&&this.params.address !== ""&&this.params.email !== ""){
        return true;
      }else{
        return false;
      }
    }
  },
  beforeRouteEnter(to,from,next){
    if(from.path === '/internationalCardConfigPag'){
      to.meta.fromPage = 'internationalCardConfigPag'
    }else{
      to.meta.fromPage = 'basisIdAuth'
    }
    next();
  },
  mounted(){
    this.params = JSON.parse(this.$route.query.submitForm);
  },
  watch: {
    //Add a space between every four digits of the credit card number
    ['params.cardNumber'](val) {
      this.$nextTick(() => {
        this.params.cardNumber = val.replace(/\s/g,'').replace(/....(?!$)/g,'$& ');
      });
    }
  },
  methods:{
    onConfirmYear(value){
      this.currentDate_year = value;
      this.params.cardExpireYear = parseTime(value,'{y}');
      this.yearPickerState = false;
    },
    onConfirmMonth(value) {
      this.currentDate_month = value;
      this.params.cardExpireMonth = parseTime(value,'{m}');
      this.monthPickerState = false;
    },
    submitPay(){
      if(!this.buttonState){
        return;
      }
      //email verification
      if(!new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$").test(this.params.email)){
        this.$toast("not a valid email.");
        return;
      }
      let cardNumber = this.params.cardNumber.replace(/\s*/g,"");
      if(this.params.cardNumber === '' || !/^[4-5]/.test(cardNumber) || cardNumber.length > 17 || cardNumber.length < 16){
        this.errorCard = true;
        return;
      }
      if(this.params.cardCvv.length < 2 || this.params.cardCvv.length > 3){
        this.errorCvv = true;
        return;
      }
      this.errorCvv = false;
      this.errorCard = false;
      this.$axios.post(this.$api.post_saveCardInfo,this.params,'').then(res=>{
        if(res && res.returnCode === '0000'){
          this.params.userCardId = res.data.userCardId;
          this.$router.replace(`/${this.$route.meta.fromPage}?routerParams=${this.$route.query.routerParams}&submitForm=${JSON.stringify(this.params)}`);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#internationalCardPay{
  display: flex;
  flex-direction: column;
  .view-content{
    flex: 1;
    overflow: auto;
    padding-bottom: 0.2rem;
    .errorTips{
      font-size: 0.14rem;
      font-family: Jost-Regular, Jost;
      font-weight: 400;
      color: #FF0000;
      margin-top: 0.1rem;
    }
  }
  .formLine{
    margin-top: 0.2rem;
    .formTitle{
      font-size: 0.14rem;
      font-family: Jost-Medium, Jost;
      font-weight: 500;
      color: #232323;
      display: flex;
      align-items: flex-end;
      .formTitle_logo{
        margin-left: auto;
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
        font-family: Jost-Medium, Jost;
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
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #FAFAFA;
    margin: 0.1rem 0 0.2rem 0;
    cursor: no-drop;
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
</style>
