<template>
  <div>
    <div class="formLine" v-for="(item,index) in formJson" :key="index">
      <!-- 提示信息 - JPY NPR BRL -->
      <div class="tipsMessage" v-if="(currency === 'JPY' && item.paramsName === 'bankCode') || (currency === 'NPR' && item.paramsName === 'swiftCode') || (currency === 'BRL' && item.paramsName === 'bankCode')">tips：{{ item.multinomialTips }}</div>

      <div class="formTitle"><span v-if="item.required">*</span>{{ item.name }}</div>
      <div class="radioFormContent" v-if="item.type === 'radio'">
        <div class="radio" v-for="(radioItem,index2) in item.radioList" :key="index2" :class="{'radioClass': item.model === radioItem}" @click="chiseRadio(radioItem,index)">{{ radioItem }}</div>
      </div>
      <div class="formContent" v-else>
        <input type="text" v-model="item.model" :maxlength="item.maxLength" @input="inputChange(item,index)">
      </div>
      <p class="errorMessage" v-if="item.tipsState">{{ item.tips }}</p>
      <p class="errorMessage" v-else-if="item.multinomialTipsState && currency !== 'JPY' && currency !== 'NPR' && currency !== 'BRL'">{{ item.multinomialTips }}</p>
    </div>
    <button class="continue" :disabled="disabled" @click="submit">button</button>
  </div>
</template>

<script>
import formJson from "@/assets/json/currencyPurchaseFormRules.json";
import { AES_Decrypt, AES_Encrypt } from "../../../utils/encryp";

export default {
  name: "testForm",
  data(){
    return{
      formJson: [],
      currency: "",
    }
  },
  //首页进入卖币卡表单页面清空缓存
  beforeRouteEnter(to,from,next) {
    next(vm => {
      if (to.path === '/sell-formUserInfo' && from.path === '/' && vm.$store.state.cardInfoFromPath !== 'sellOrder') {
        vm.formJson = [];
      }
    })
  },
  activated(){
    //根据货币类型来过滤不同表单

    this.currency = this.$store.state.sellRouterParams.positionData.fiatCode;
    this.formJson = formJson.filter(item=>{return item.currency.includes(this.currency)})[0].form;

    //解密历史表单信息
    if(this.$store.state.sellForm) {
      let sellForm = this.$store.state.sellForm;
      this.formJson.forEach((item,index) => {
        for (let itemKey in sellForm) {
          if(item.paramsName === itemKey){
            if(itemKey === 'contactNumber'||itemKey === 'name'||itemKey === 'email'||itemKey === 'accountNumber'||itemKey === 'idNumber'){
              this.formJson[index].model = AES_Decrypt(sellForm[itemKey]);
            }
            this.formJson[index].model = sellForm[itemKey];
          }
        }
      })
    }
  },
  computed: {
    //动态表单判空、正则校验
    disabled(){
      //必填项数据
      let requiredArray = this.formJson.filter((value) => {
        return value.required === true && (value.model === '' || !new RegExp(value.regular).test(value.model) || value.tipsState === true || value.multinomialTipsState === true)
      })
      //非必填项数据
      let noRequiredArray = this.formJson.filter((value) => {
        return value.required === false && (value.model === '' || !new RegExp(value.regular).test(value.model) || value.tipsState === true || value.multinomialTipsState === true)
      })

      //JPY - bank code和swift code不能同时为空、非必填项校验
      //NPR - swift和location不能同时为空、非必填项校验
      //BRL - bank code和swift code不能同时为空、非必填项校验
      if(this.formJson.length !== 0 && (this.currency === 'JPY' || this.currency === 'NPR' || this.currency === 'BRL')){
        if(requiredArray.length === 0 && noRequiredArray.length === 1 && noRequiredArray[0].model === ""){
          this.formJson.filter(item=>{ return item.paramsName === noRequiredArray[0].paramsName })[0].tipsState = false;
          return false;
        }
        if(requiredArray.length !== 0 || noRequiredArray.length === 2  || (noRequiredArray.length === 1 && noRequiredArray[0].tipsState === true)){
          return true;
        }
        return false;
      }

      //PHP - 金额大于500000地址必输
      if(this.formJson.length !== 0 && this.currency === 'PHP' && noRequiredArray.length > 0 && noRequiredArray[0].tipsState === true){
        return true
      }

      return requiredArray.length === 0 ? false : true;
    }
  },
  methods: {
    // 正则校验 展示提示信息
    inputChange(val,index){
      //BDT - Swift code不是以DBBLBDDH开头的时候branch name必输
      if(this.currency === 'BDT' && val.paramsName === 'swiftCode' && val.model.substr(0,8) === 'DBBLBDDH'){
        this.formJson.filter(item=>{ return item.paramsName === "branchName" })[0].required = true;
      }else if(this.currency === 'BDT' && val.paramsName === 'swiftCode' && val.model.substr(0,8) !== 'DBBLBDDH'){
        this.formJson.filter(item=>{ return item.paramsName === "branchName" })[0].required = false
      }

      //PHP - 金额大于500000地址必输
      if(this.currency === 'PHP' && val.paramsName === 'accountNumber' && val.model > 500000 && this.formJson.filter(item=>{ return item.paramsName === "address" })[0].model === ''){
        this.formJson.filter(item=>{ return item.paramsName === "address" })[0].required = true;
        this.formJson.filter(item=>{ return item.paramsName === "address" })[0].multinomialTipsState = true;
      }else if(this.currency === 'PHP' && val.paramsName === 'address' && val.model !== '' && this.formJson.filter(item=>{ return item.paramsName === "accountNumber" })[0].model > 500000){
        this.formJson[index].required = true;
        this.formJson[index].multinomialTipsState = false;
      }else if(this.currency === 'PHP' && val.paramsName === 'accountNumber' && val.model <= 500000){
        this.formJson.filter(item=>{ return item.paramsName === "address" })[0].required = false
        this.formJson.filter(item=>{ return item.paramsName === "address" })[0].multinomialTipsState = false;
        if(this.formJson.filter(item=>{ return item.paramsName === "address" })[0].model === ''){
          this.formJson.filter(item=>{ return item.paramsName === "address" })[0].tipsState = false;
        }
      }

      //所有表单正则验证
      if(!new RegExp(val.regular).test(this.formJson[index].model)){
        this.formJson[index].tipsState = true;
      }else{
        this.formJson[index].tipsState = false;
      }

    },

    //表单 - 单选框
    chiseRadio(radioItem,index){
      this.formJson[index].model = radioItem;
      this.formJson[index].tipsState = false;
    },

    submit(){
      let queryForm = {
        countryCode: this.$store.state.sellRouterParams.positionData.alpha2, // 国家Code
        id: this.$store.state.sellForm ? this.$store.state.sellForm.positionData.id : '', // 不传为新增卡信息，传为修改卡信息
        fiatCode: this.$store.state.sellRouterParams.positionData.alpha2, // 法币Code
      };
      this.formJson.forEach(item=>{
        if(item.model !== ''){
          queryForm[item.paramsName] = item.model;
        }
      });
      let params = JSON.parse(JSON.stringify(queryForm));
      //加密字段
      params.contactNumber = this.encrypt(params.contactNumber);
      params.name = this.encrypt(params.name);
      params.email = this.encrypt(params.email);
      params.accountNumber = this.encrypt(params.accountNumber);
      params.idNumber = this.encrypt(params.idNumber);
      this.$axios.post(this.$api.post_sellForm,params,'').then(res=>{
        if(res && res.returnCode === '0000'){
          //存储数据 加密字段
          let sellForm = {};
          this.formJson.forEach(item => {
            sellForm[item.paramsName] = item.model;
          })
          sellForm.contactNumber = this.encrypt(sellForm.contactNumber);
          sellForm.name = this.encrypt(sellForm.name);
          sellForm.email = this.encrypt(sellForm.email);
          sellForm.accountNumbe = this.encrypt(sellForm.accountNumber);
          sellForm.idNumber = this.encrypt(sellForm.idNumber);
          this.$store.state.sellForm = sellForm;
          //跳转状态
          if(this.$store.state.cardInfoFromPath === 'configSell' || this.$store.state.cardInfoFromPath === 'sellOrder'){
            this.$router.replace(`/${this.$store.state.cardInfoFromPath}`);
            return;
          }
          this.$router.push(`/${this.$store.state.cardInfoFromPath}`);
        }
      })
    },

    encrypt(val){
      if(val){
        return AES_Encrypt(val);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.formLine{
  margin-top: 0.2rem;
  clear: both;
  .formTitle{
    font-size: 0.14rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #232323;
    display: flex;
    align-items: flex-end;
    span{
      color: #FF0000;
      margin-right: 0.03rem;
    }
    .formTitle_logo{
      margin-left: auto;
      color: darkgray;
      img{
        width: 0.4rem;
      }
    }
  }
  .radioFormContent{
    min-height: 0.5rem;
    margin-left: -0.2rem;
    .radio{
      padding: 0 0.1rem;
      min-width: 0.8rem;
      background: #F3F4F5;
      font-size: 0.16rem;
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      color: #232323;
      height: 0.6rem;
      line-height: 0.6rem;
      text-align: center;
      border-radius: 10px;
      cursor: pointer;
      margin-left: 0.2rem;
      margin-top: 0.12rem;
      float: left;
      &:last-child{
        margin-bottom: 0.2rem;
      }
    }
    .radioClass{
      background: #4479D9;
      color: #FAFAFA;
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
  .errorMessage{
    font-size: 0.14rem;
    font-family: "Jost", sans-serif;
    font-weight: 400;
    color: #FF0000;
    margin: 0.1rem 0 0 0.2rem;
    clear: both;
  }
  .tipsMessage{
    font-size: 0.14rem;
    font-family: "Jost", sans-serif;
    font-weight: 400;
    color: #999999;
    margin: 0.3rem 0 0.1rem 0;
    clear: both;
  }
}

.continue{
  width: 100%;
  height: 0.6rem;
  border-radius: 4px;
  text-align: center;
  background: #4479D9;
  line-height: 0.6rem;
  font-size: 0.18rem;
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  color: #FAFAFA;
  border: none;
  cursor: pointer;
}
.continue[disabled]{
  background: rgba(68, 121, 217, 0.5);
  cursor: no-drop;
}

</style>
