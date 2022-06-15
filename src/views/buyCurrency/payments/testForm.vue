<template>
  <div>
    <div class="formLine" v-for="(item,index) in formJson" :key="index">
      <div class="formTitle"><span v-if="item.required">*</span>{{ item.name }}</div>
      <div class="radioFormContent" v-if="item.type === 'radio'">
        <div class="radio" v-for="(radioItem,index2) in item.radioList" :key="index2" :class="{'radioClass': item.model === radioItem}" @click="chiseRadio(radioItem,index)">{{ radioItem }}</div>
      </div>
      <div class="formContent" v-else>
        <input type="text" v-model="item.model" :maxlength="item.maxLength" @input="inputChange(item,index)" @blur="inputBlur(item,index)">
      </div>
      <p class="errorMessage" v-if="item.tipsState">{{ item.tips }}</p>
      <p class="errorMessage" v-else-if="item.multinomialTipsState">{{ item.multinomialTips }}</p>
    </div>
    <button class="continue" :disabled="disabled" @click="submit">button</button>
  </div>
</template>

<script>
import formJson from "@/assets/json/currencyPurchaseFormRules.json";

export default {
  name: "testForm",
  data(){
    return{
      formJson: [],
      currency: "JPY",
    }
  },
  mounted(){
    //根据货币类型来过滤不同表单
    this.formJson = formJson.filter(item=>{return item.currency.includes(this.currency)})[0].form;
  },
  computed: {
    //动态表单判空校验
    disabled(){
      let resultArray = this.formJson.filter((value) => {
        console.log(value.model === '' && value.required === true && value.tipsState === false && value.multinomialTipsState === false && new RegExp(value.regular).test(value.model))
        return (value.model === '' && value.required === true) || value.tipsState === false || value.multinomialTipsState === false || new RegExp(value.regular).test(value.model)
      })
      console.log(resultArray,"----let")
      // console.log(this.formJson[3])
      console.log(resultArray.length === 0)
      return resultArray.length === 0 ? false : tru;
    }
  },
  methods: {
    inputChange(val,index){
      //BDT ----- Swift code不是以DBBLBDDH开头的时候branch name必输
      if(this.currency === 'BDT' && val.paramsName === 'swiftCode' && val.model.substr(0,8) === 'DBBLBDDH'){
        this.formJson.filter(item=>{ return item.paramsName === "branchName" })[0].required = true;
      }else if(this.currency === 'BDT' && val.paramsName === 'swiftCode' && val.model.substr(0,8) !== 'DBBLBDDH'){
        this.formJson.filter(item=>{ return item.paramsName === "branchName" })[0].required = false
      }

      //JPY ----- bank code和swift code不能同时为空
      if(this.currency === 'JPY' && val.paramsName === 'swiftCode' && val.model === '' && this.formJson.filter(item=>{ return item.paramsName === "branchCode" })[0].model === ''){
        this.formJson.filter(item=>{ return item.paramsName === "swiftCode" })[0].multinomialTipsState = true;
        this.formJson.filter(item=>{ return item.paramsName === "branchCode" })[0].multinomialTipsState = false;
      }else if(this.currency === 'JPY' && val.paramsName === 'branchCode' && val.model === '' && this.formJson.filter(item=>{ return item.paramsName === "swiftCode" })[0].model === ''){
        this.formJson.filter(item=>{ return item.paramsName === "branchCode" })[0].multinomialTipsState = true;
        this.formJson.filter(item=>{ return item.paramsName === "swiftCode" })[0].multinomialTipsState = false;
      }

      //所有表单正则验证
      if(!new RegExp(val.regular).test(this.formJson[index].model)){
        this.formJson[index].tipsState = true;
      }else{
        this.formJson[index].tipsState = false;
      }
    },
    // 正则校验 展示提示信息
    inputBlur(val,index){
      //根据币种特殊校验 提示multinomialTips

      // if(!new RegExp(val.regular).test(this.formJson[index].model)){
      //   this.formJson[index].tipsState = true;
      // }else{
      //   this.formJson[index].tipsState = false;
      // }
      console.log(this.formJson[index].tipsState)
    },

    chiseRadio(radioItem,index){
      this.formJson[index].model = radioItem;
      this.formJson[index].tipsState = false;
    },

    submit(){
    //   this.formJson.forEach((item,index)=>{
    //     if(item.model === '' && item.required === true){
    //       this.formJson[index].tipsState = true;
    //     }
    //   })
    //   console.log(this.disabled)
    //     if(this.disabled === false){
    //     console.log("触发")
    //     let params = {};
    //     this.formJson.forEach(item=>{
    //       params[item.paramsName] = item.model;
    //     })
    //   }
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
      min-width: 0.3rem;
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
