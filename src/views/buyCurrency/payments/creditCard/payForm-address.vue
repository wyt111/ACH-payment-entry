<template>
  <div id="internationalCardPay_box">
    <search v-show="searchViewState" viewName="country" :allBasicData="allBasicData" routerFrom="payForm"/>
    <div id="internationalCardPay" v-show="!searchViewState">
      <div class="view-content">
        <div class="formLine">
          <div class="formTitle">Country</div>
          <div class="formContent" @click="openSearch"><input type="text" v-model="countryAbbreviation" disabled="true"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">{{ $t('nav.payResult_feeAddress') }}</div>
          <div class="formContent"><input type="text" v-model="params.address"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">City</div>
          <div class="formContent"><input type="text" v-model="params.city"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">State</div>
          <div class="formContent"><input type="text" v-model="params.state"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">Zip Code</div>
          <div class="formContent"><input type="number" v-model="params.postcode" onKeypress="return(/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></div>
        </div>
        <div class="formLine formLine_flex">
          <div class="formLine_flex_child">
            <div class="formTitle">{{ $t('nav.buy_form_firstName') }}</div>
            <div class="formContent"><input type="text" v-model="params.firstname"></div>
          </div>
          <div class="formLine_flex_child">
            <div class="formTitle">{{ $t('nav.buy_form_lastName') }}</div>
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
      </div>
      <div class="continue" :class="{'buttonTrue': buttonState}" @click="nextStep">{{ $t('nav.Continue') }}</div>
    </div>
  </div>
</template>

<script>
import search from "../../../../components/search";
import { AES_Decrypt } from '@/utils/encryp.js';
import {AES_Encrypt} from "../../../../utils/encryp";

export default {
  name: "payForm-address",
  components: { search },
  data(){
    return{
      params: {
        firstname: "",
        lastname: "",
        phone: "",
        country: "",
        city: "",
        state: "",
        address: "",
        email: "",
        postcode: "",
        userCardId: '',
      },

      countryAbbreviation: "",

      searchViewState: false,
      allBasicData: {},
    }
  },
  computed: {
    buttonState(){
      if(this.params.postcode !== ""&&this.params.firstname !== ""&& this.params.lastname !== ""&&
          this.params.phone !== ""&&this.params.country !== ""&&
          this.params.city !== ""&&this.params.state !== ""&&
          this.params.address !== ""&&this.params.email !== ""){
        return true;
      }else{
        return false;
      }
    },
  },
  mounted(){
    if(this.$route.query.submitForm){
      let oldCardInfo = JSON.parse(this.$route.query.submitForm);
      //需要解密信息
      oldCardInfo.firstname = AES_Decrypt(oldCardInfo.firstname);
      oldCardInfo.lastname = AES_Decrypt(oldCardInfo.lastname);
      oldCardInfo.phone = AES_Decrypt(oldCardInfo.phone);
      oldCardInfo.email = AES_Decrypt(oldCardInfo.email);
      this.params = oldCardInfo;
    }

    this.allBasicData = JSON.parse(localStorage.getItem("allBasicData"));

    //If you have not filled in the international card information, select the country from the home page
    if(this.$route.meta.fromPage === 'basisIdAuth'){
      this.params.country = JSON.parse(this.$route.query.routerParams).positionData.alpha2;
      this.countryAbbreviation = JSON.parse(this.$route.query.routerParams).positionData.positionValue;
    }
  },
  methods:{
    openSearch(){
      this.searchViewState = true;
      this.$parent.$refs.viewTab.tabState = false;
    },
    nextStep(){
      //email verification
      if(!new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$").test(this.params.email)){
        this.$toast({
          duration: 3000,
          message: this.$t('nav.sell_form_EmailTips')
        });
        return;
      }
      let newParams = {...newParams,...this.params};
      newParams.firstname = AES_Encrypt(this.params.firstname);
      newParams.lastname = AES_Encrypt(this.params.lastname);
      newParams.phone = AES_Encrypt(this.params.phone);
      newParams.email = AES_Encrypt(this.params.email);
      // sessionStorage.setItem("payForm-address",JSON.stringify(newParams));
      this.$router.push(`/creditCardForm-cardInfo?routerParams=${this.$route.query.routerParams}&submitForm=${JSON.stringify(newParams)}`);
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
      font-family: "GeoDemibold", GeoDemibold;
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
</style>
<style>
.van-overlay{
  background-color: rgba(0,0,0,0);
}
</style>
