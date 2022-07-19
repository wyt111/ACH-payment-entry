<template>
  <div id="box">
    <div id="sell-form" ref="box_ref" @scroll="handleScroll">
      <div class="sellForm-content" ref="form_ref">
        <div class="formLine" v-for="(item,index) in formJson" :key="index">
          <!-- 提示信息 - JPY NPR BRL -->
          <div class="tipsMessage" v-if="(currency === 'JPY' && item.paramsName === 'bankCode') ||
        (currency === 'NPR' && item.paramsName === 'routingCodeValue1') ||
        (currency === 'BRL' && item.paramsName === 'bankCode') ||
        (currency === 'BDT' && item.paramsName === 'routingCodeValue1')">
            {{ $t('nav.sell_form_tips') }}：{{ $t(item.multinomialTips) }}</div>
          <div class="formTitle"><span v-if="item.required">*</span>{{ $t(item.name) }}</div>
          <!-- bank account type -->
          <div class="formContent cursor" v-if="item.type === 'radio' && item.paramsName === 'bankAccountType'" @click="openSelect(item,index)">
            <div class="radioInput">
              <div class="value">{{ $t(item.model) }}</div>
              <div class="rightIcon"><img src="../../../assets/images/rightBlackIcon.png" alt=""></div>
            </div>
          </div>
          <div class="formContent cursor" v-else-if="item.type === 'radio'" @click="openSelect(item,index)">
            <div class="radioInput">
              <div class="value">{{ item.model }}</div>
              <div class="rightIcon"><img src="../../../assets/images/rightBlackIcon.png" alt=""></div>
            </div>
          </div>
          <div class="formContent" v-else>
            <input type="text" v-model="item.model" :maxlength="item.maxLength" @input="inputChange(item,index)"  @focus="inputFocus" @blur="inputBlur">
          </div>
          <p class="errorMessage" v-if="item.tipsState">{{ $t(item.tips) }}</p>
          <p class="errorMessage" v-else-if="item.multinomialTipsState && currency !== 'JPY' && currency !== 'NPR' && currency !== 'BRL'">{{ $t(item.multinomialTips) }}</p>
        </div>
        <!-- tips icon -->
        <div class="downTips-icon" v-show="goDown_state" @click="goDown"><img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt=""></div>
      </div>

      <button class="continue" :disabled="disabled" @click="submit" v-show="buttonIsShow" ref="button_ref">
        {{ $t('nav.Continue') }}
        <img class="rightIcon" src="../../../assets/images/button-right-icon.png" v-if="!request_loading">
        <van-loading class="icon rightIcon" type="spinner" color="#fff" v-else/>
      </button>

    </div>
    <!-- 单选框 -->
    <!-- bank account type -->
    <div class="selectView" v-if="selectState && selected.paramsName === 'bankAccountType'" @click="selectState=false">
      <ul class="selectDate">
        <li v-for="(item,index) in this.selected.item" :key="index" @click="specialChiseCheck(item)">{{ $t(item.value) }}</li>
      </ul>
    </div>
    <div class="selectView" v-else-if="selectState" @click="selectState=false">
      <ul class="selectDate">
        <li v-for="(item,index) in this.selected.item" :key="index" @click="chiseCheck(item)">{{ $t(item) }}</li>
      </ul>
    </div>
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
      formJsonCopy: [],
      currency: "",
      buttonIsShow:true,
      selectState: false,
      selected: {
        item: {},
        index: 0,
      },
      request_loading: false,

      goDown_state: true,
      oldOffsetTop: 0,
      timeDown: null,
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
    //初始化根据可视高度控制向下提示按钮状态
    setTimeout(()=>{
      if(this.$refs.box_ref.offsetHeight + 4 < document.getElementById("sell-form").scrollHeight - 50){
        this.goDown_state = true;
      }else{
        this.goDown_state = false;
      }
    })
    //根据货币类型来过滤不同表单
    this.currency = this.$store.state.sellRouterParams.positionData.code;
    this.formJson = formJson.filter(item=>{return item.currency.includes(this.currency)})[0].form;

    //PHP - 金额大于500000地址必输
    if(this.currency === 'PHP' && this.$store.state.sellRouterParams.getAmount > 500000){
      this.formJson.filter(item=>{ return item.paramsName === "address" })[0].required = true;
    }else if(this.currency === 'PHP' && this.$store.state.sellRouterParams.getAmount <= 500000){
      this.formJson.filter(item=>{ return item.paramsName === "address" })[0].required = false;
    }

    //解密历史表单信息
    if(this.$store.state.sellForm) {
      let sellForm = this.$store.state.sellForm;
      this.formJson.forEach((item,index) => {
        for (let itemKey in sellForm) {
          if(item.paramsName === itemKey){
            if(itemKey === 'contactNumber'||itemKey === 'name'||itemKey === 'email'||itemKey === 'accountNumber'||itemKey === 'idNumber'){
              this.formJson[index].model = AES_Decrypt(sellForm[itemKey]);
            }else{
              this.formJson[index].model = sellForm[itemKey];
            }
          }
        }
      })
      let bankAccountTypeDate = this.formJson.filter(res=>{return res.paramsName === 'bankAccountType'})[0];
      this.bankAccountType(bankAccountTypeDate,1);
    }
  },
  computed: {
    //动态表单判空、正则校验
    disabled(){
      //表单非必填项数量
      let noRequiredNum = this.formJson.filter((value) => {
        return value.required === false
      }).length;
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
          return this.request_loading === false ?  false : true;
        }
        if(requiredArray.length !== 0 || noRequiredArray.length === 2  || (noRequiredArray.length === 1 && noRequiredArray[0].tipsState === true)){
          return true;
        }
        return this.request_loading === false ?  false : true;
      }

      //针对PHP
      if(requiredArray.length === 0 && noRequiredArray.length > 0 && noRequiredArray[0].model !== '' && noRequiredArray.length === 1 && noRequiredNum === 1){
        return true
      }

      requiredArray.length === 0 ? this.formJson.forEach((item,index)=>{this.formJson[index].tipsState = false}) : '';
      return requiredArray.length === 0 && this.request_loading === false ? false : true;
    },
  },
  methods: {
    // 正则校验 展示提示信息
    inputChange(val,index){
      //BDT - Swift code不是以DBBLBDDH开头的时候branch name必输
      if(this.currency === 'BDT' && val.paramsName === 'routingCodeValue1' && val.model.substr(0,8) !== 'DBBLBDDH'){
        this.formJson.filter(item=>{ return item.paramsName === "routingCodeValue2" })[0].required = true;
      }else if(this.currency === 'BDT' && val.paramsName === 'routingCodeValue1' && val.model.substr(0,8) === 'DBBLBDDH'){
        this.formJson.filter(item=>{ return item.paramsName === "routingCodeValue2" })[0].required = false
      }
      //所有表单正则验证
      if(!new RegExp(val.regular).test(this.formJson[index].model)){
        this.formJson[index].tipsState = true;
      }else{
        this.formJson[index].tipsState = false;
      }

    },

    //表单 - 单选框
    openSelect(item,index){
      this.selectState = true;
      console.log(this.selectState)
      this.selected = {
        item: item.radioList,
        index: index,
        paramsName: item.paramsName
      };
    },
    chiseCheck(item){
      this.selectState = false;
      this.formJson[this.selected.index].model = this.$t(item);
      this.formJson[this.selected.index].tipsState = false;
    },
    specialChiseCheck(item){
      this.selectState = false;
      this.bankAccountType(item,2);
      this.formJson[this.selected.index].tipsState = false;
    },
    bankAccountType(value,step){
      if(step === 1){
        this.formJson.forEach((item,index)=>{
          if(item.paramsName === 'bankAccountType'){
            switch (value.model){
              case "3":
                this.formJson[index].model = "nav.sell_form_bankAccountTypeLi_Saving";
                break;
              case "4":
                this.formJson[index].model = "nav.sell_form_bankAccountTypeLi_Checking";
                break;
              case "5":
                this.formJson[index].model = "nav.sell_form_bankAccountTypeLi_TimeDeposit";
                break;
              case "6":
                this.formJson[index].model = "nav.sell_form_bankAccountTypeLi_Others";
                break;
              case "7":
                this.formJson[index].model = "nav.sell_form_accountTypeLi_Maestra";
                break;
            }
          }
        })
        return;
      }
      if(step === 2){
        switch (value.key){
          case "3":
            this.formJson[this.selected.index].model = "nav.sell_form_bankAccountTypeLi_Saving";
            break;
          case "4":
            this.formJson[this.selected.index].model = "nav.sell_form_bankAccountTypeLi_Checking";
            break;
          case "5":
            this.formJson[this.selected.index].model = "nav.sell_form_bankAccountTypeLi_TimeDeposit";
            break;
          case "6":
            this.formJson[this.selected.index].model = "nav.sell_form_bankAccountTypeLi_Others";
            break;
          case "7":
            this.formJson[this.selected.index].model = "nav.sell_form_accountTypeLi_Maestra";
            break;
        }
        return;
      }
      if(step === 3){
        this.formJsonCopy.forEach((item,index)=> {
          if (item.paramsName === 'bankAccountType') {
            switch (value.model) {
              case 'nav.sell_form_bankAccountTypeLi_Saving':
                this.formJsonCopy[index].model = "3";
                break;
              case "nav.sell_form_bankAccountTypeLi_Checking":
                this.formJsonCopy[index].model = "4";
                break;
              case "nav.sell_form_bankAccountTypeLi_TimeDeposit":
                this.formJsonCopy[index].model = "5";
                break;
              case "nav.sell_form_bankAccountTypeLi_Others":
                this.formJsonCopy[index].model = "6";
                break;
              case "nav.sell_form_accountTypeLi_Maestra":
                this.formJsonCopy[index].model = "7";
                break;
            }
          }
        })
        return;
      }
    },

    submit(){
      let queryForm = {
        countryCode: this.$store.state.sellRouterParams.positionData.alpha2, // 国家Code
        id: this.$store.state.sellForm ? this.$store.state.sellForm.id : '', // 不传为新增卡信息，传为修改卡信息
        fiatCode: this.$store.state.sellRouterParams.positionData.code, // 法币Code
      };
      this.formJsonCopy = JSON.parse(JSON.stringify(this.formJson));
      let bankAccountTypeDate = this.formJsonCopy.filter(res=>{return res.paramsName === 'bankAccountType'})[0];
      this.bankAccountType(bankAccountTypeDate,3);
      this.formJsonCopy.forEach(item=>{
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
      this.currency === "BRL" ? params.idType = "CPF" : '';
      this.currency === "CLP" ?  params.idType = "RUT" : '';
      if(this.request_loading === false){
        this.request_loading = true;
        this.$axios.post(this.$api.post_sellForm,params,'').then(res=>{
          this.request_loading = false;
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
        }).catch(()=>{
          this.request_loading = false;
        })
      }
    },
    inputFocus(){
      if(this.$store.state.isPcAndPhone === 'phone'){
        this.buttonIsShow = false
        return
      }else{
        this.buttonIsShow = true
        return
      }
    },
    inputBlur(){
        this.buttonIsShow = true
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

    encrypt(val){
      if(val){
        return AES_Encrypt(val);
      }
    }
  },
}
</script>

<style lang="scss" scoped>
#sell-form{
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  position: absolute;
  .sellForm-content{
    position: relative;
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
}

#box{
  width: 100%;
  height: 100%;
  position: relative;
}
.selectView{
  width: 100%;
  height: 100%;
  position: absolute;
  .selectDate{
    z-index: 99;
    position: absolute;
    top: 2rem;
    left: 0.16rem;
    background: #FFFFFF;
    box-shadow: 0 0 0.14rem 0 rgba(0, 0, 0, 0.12);
    border-radius: 0.16rem;
    max-height: 4rem;
    min-width: 1.8rem;
    overflow: auto;
    li{
      font-size: 0.16rem;
      font-family: "GeoRegular", GeoRegular;
      font-weight: normal;
      color: #232323;
      text-indent: 0.16rem;
      border: 1px solid #F3F4F5;
      height: 0.56rem;
      line-height: 0.56rem;
      &:last-child{
        border: none;
      }
    }
  }
}

.formLine{
  margin-top: 0.28rem;
  clear: both;
  position: relative;
  .formTitle{
    font-size: 0.13rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
    color: #707070;
    display: flex;
    align-items: flex-end;
    span{
      color: #E55643;
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
  .cursor{
    cursor: pointer;
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
      font-weight: normal;
      color: #232323;
      border: none;
      outline: none;
      padding: 0 0.16rem;
    }
    .radioInput{
      width: 100%;
      display: flex;
      align-items: center;
      height: 0.56rem;
      line-height: 0.56rem;
      padding: 0 0.16rem;
      background: #F3F4F5;
      border-radius: 0.12rem;
      font-size: 0.16rem;
      font-family: "GeoRegular", GeoRegular;
      font-weight: normal;
      color: #232323;
      .rightIcon{
        margin-left: auto;
        display: flex;
        align-items: center;
        img{
          width: 0.24rem;
        }
      }
    }
  }
  .errorMessage{
    position: absolute;
    font-size: 0.13rem;
    font-family: "GeoLight", GeoLight;
    font-weight: 400;
    color: #E55643;
    margin: 0.08rem 0.2rem 0 0.16rem;
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
  &:last-child{
    margin-bottom: 0.3rem;
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
  margin-top: 0.3rem;
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
</style>
