<template>
  <div id="box">
    <div id="sell-form" ref="box_ref" @scroll="handleScroll">
      <div class="sellForm-content" ref="form_ref">
        <!-- 历史表单信息 -->
        <div class="cardInfo-history">
          <div class="line1">
            <div class="line1-1"><el-checkbox class="checkbox" size="medium" v-model="isOldCardInfo" @change="assignmentOldCardInfo"></el-checkbox></div>
            <div class="line1-2">Use this Information</div>
            <div class="more" @click="openCardInfo">More</div>
          </div>
          <div class="info">
            <span>Bank name:</span> HSBC  Account number: {{ oldCardInfo.accountNumber }}
          </div>
        </div>

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
      </div>

      <!-- 购买提示信息 -->
      <div class="attention"><span>Attention:</span> Please ensure the bank account belongs to you and the information is accurate. Returned transactions are subjected to $25 fee charged by our banking partners.</div>

      <button class="continue" :disabled="disabled" @click="submit" v-show="buttonIsShow" ref="button_ref">
        {{ $t('nav.Confirm') }}
        <img class="rightIcon" src="../../../assets/images/button-right-icon.svg" v-if="!request_loading">
        <van-loading class="icon rightIcon" type="spinner" color="#fff" v-else/>
      </button>
    </div>

    <!-- tips icon -->
    <transition>
      <div class="downTips-icon" v-show="goDown_state" @click="goDown"><img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt=""></div>
    </transition>

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
import allFormJson from "@/assets/json/currencyPurchaseFormRules.json";
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

      goDown_state: false,
      oldOffsetTop: 0,
      timeDown: null,

      //历史卡信息
      isOldCardInfo: false,
      oldCardInfo: {},
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

    //加载卡信息列表
    this.queryCardInfoList();

    //根据货币类型来过滤不同表单
    this.currency = this.$store.state.sellRouterParams.positionData.code;
    this.formJson = JSON.parse(JSON.stringify(allFormJson.filter(item=>{return item.currency.includes(this.currency)})[0].form));

    //PHP - 金额大于500000地址必输
    if(this.currency === 'PHP' && this.$store.state.sellRouterParams.getAmount > 500000){
      this.formJson.filter(item=>{ return item.paramsName === "address" })[0].required = true;
    }else if(this.currency === 'PHP' && this.$store.state.sellRouterParams.getAmount <= 500000){
      this.formJson.filter(item=>{ return item.paramsName === "address" })[0].required = false;
    }
  },
  // watch: {
  //   '$parent.historicalCardInfoSell_state': {
  //     deep: true,
  //     immediate: true,
  //     handler(val){
  //       if(val === false){
  //         this.decryptCardInfo();
  //       }
  //     }
  //   }
  // },
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

    //解密历史表单信息
    decryptCardInfo(val){
      if(this.$store.state.sellForm) {
        let sellForm = [];
        if(val && val === 1){
          sellForm = JSON.parse(JSON.stringify(this.$store.state.sellRouterParams.cardInfoList[0]));
        }else{
          sellForm = JSON.parse(JSON.stringify(this.$store.state.sellForm));
        }
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

    //确认订单 - 处理请求参数
    submit(){
      let queryForm = {
        countryCode: this.$store.state.sellRouterParams.positionData.alpha2, // 国家Code
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
      this.processRequest(params);
    },
    //确认订单 - 请求服务
    processRequest(val){
      if(this.request_loading === false){ 
        this.request_loading = true;
        let params = {
          sellCardDTO: val,
          // orderId: this.$store.state.sellForm ? this.$store.state.sellForm.id : '', // 不传为新增卡信息，传为修改卡信息
          cryptoCurrency: this.$store.state.sellRouterParams.currencyData.name,
          sellVolume: this.$store.state.sellRouterParams.amount,
          network: this.$store.state.sellRouterParams.currencyData.sellNetwork.network,
        }
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
            if(this.$store.state.cardInfoFromPath === 'configSell'){
              this.isKyc(val);
            }else{
              
            }
          }
        }).catch(()=>{
          this.request_loading = false;
        })
      }
    },

    isKyc(val){
      let params = {
        amount: this.$store.state.sellRouterParams.amount * this.$store.state.sellRouterParams.currencyData.price
      }
      this.$axios.get(this.$api.get_kyc,params).then(res=>{
        if(res && res.returnCode === '0000'){
          if(res.data.isKyc === true){
            this.$store.state.sellRouterParams.fullName = val.name;
            this.$router.push('/kycVerification');
          }else{
            
          }
        }
      })
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

    //展示历史卡信息
    openCardInfo(){
      this.$parent.historicalCardInfoSell_state = true;
    },

    //加载历史卡信息列表
    queryCardInfoList(){
      let params = {
        country: this.$store.state.sellRouterParams.positionData.alpha2,
        fiatName: this.$store.state.sellRouterParams.payCommission.code,
      }
      this.$axios.get(this.$api.get_cardList,params).then(res=>{
        if(res && res.returnCode === '0000'){
          this.$store.state.sellRouterParams.cardInfoList = res.data;
          this.$store.state.sellForm = res.data[0];
          //默认展示最近一条数据
          let oldCardInfo = JSON.parse(JSON.stringify(res.data[0]));
          oldCardInfo.accountNumber = AES_Decrypt(oldCardInfo.accountNumber);
          this.oldCardInfo = oldCardInfo;
        }
      })
    },

    //赋值最近一次卡信息
    assignmentOldCardInfo(){
      if(this.isOldCardInfo === false){
        this.currency = this.$store.state.sellRouterParams.positionData.code;
        this.formJson = JSON.parse(JSON.stringify(allFormJson.filter(item=>{return item.currency.includes(this.currency)})[0].form));
      }else{
        this.decryptCardInfo(1);
      }
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
  }
}
.downTips-icon{
  position: absolute;
  bottom: 0.4rem;
  right: 0;
  width: 0.58rem;
  height: 0.58rem;
  border-radius: 50%;
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

#box{
  width: 100%;
  height: 100%;
  position: relative;
}

.cardInfo-history{
  margin-top: 0.32rem;
  .line1{
    display: flex;
    align-items: center;
    .line1-2{
      font-family: 'SFProDisplayRegular',SFProDisplayRegular;
      font-weight: 400;
      font-size: 0.13rem;
      color: #949EA4;
      margin-left: 0.08rem;
    }
    .more{
      margin-left: auto;
      font-family: 'SFProDisplaybold',SFProDisplaybold;
      font-weight: 400;
      font-size: 0.13rem;
      color: #0059DA;
      cursor: pointer;
    }
  }
  .info{
    width: 100%;
    height: 0.56rem;
    line-height: 0.56rem;
    background: #FFF4DE;
    border-radius: 0.06rem;
    color: #8A5B00;
    font-size: 0.13rem;
    margin-top: 0.08rem;
    padding: 0 0.07rem 0 0.17rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span{
      font-family: 'SFProDisplaybold',SFProDisplaybold;
    }
  }
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
      border-bottom: 1px solid #EEEEEE;
      height: 0.56rem;
      line-height: 0.56rem;
      &:last-child{
        border: none;
      }
    }
  }
}

.formLine{
  margin-top: 0.24rem;
  clear: both;
  position: relative;
  .formTitle{
    font-family: 'SFProDisplayRegular',SFProDisplayRegular;
    font-weight: 400;
    font-size: 0.13rem;
    color: #949EA4;
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
      border-radius: 0.06rem;
      border: 1px solid #EEEEEE;
      font-family: 'SFProDisplayRegular',SFProDisplayRegular;
      font-weight: 500;
      font-size: 0.16rem;
      color: #949EA4;
      outline: none;
      padding: 0 0.16rem;
      &:focus{
        border: 1px solid #D0ECFC;
        box-shadow: 0 0 0.35rem rgba(89, 153, 248, 0.1);
      }
    }
    .radioInput{
      width: 100%;
      display: flex;
      align-items: center;
      height: 0.56rem;
      line-height: 0.56rem;
      padding: 0 0.16rem;
      border-radius: 0.06rem;
      font-size: 0.16rem;
      font-family: "GeoRegular", GeoRegular;
      font-weight: normal;
      color: #232323;
      border: 1px solid #EEEEEE;
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
    font-size: 0.1rem;
    font-family: "GeoLight", GeoLight;
    font-weight: 400;
    color: #E55643;
    margin: 0.04rem 0.2rem 0 0.16rem;
    clear: both;
  }
  .tipsMessage{
    font-family: 'SFProDisplayRegular',SFProDisplayRegular;
    font-size: 0.13rem;
    color: #C2C2C2;
    margin: 0.3rem 0 0.1rem 0;
    clear: both;
  }
  &:last-child{
    margin-bottom: 0.08rem;
  }
}

.attention{
  font-family: 'SFProDisplayRegular',SFProDisplayRegular;
  font-size: 0.13rem;
  text-align: justify;
  letter-spacing: 0.5px;
  color: #C2C2C2;
  span{
    color: #949EA4;
    font-weight: 600;
  }
}


.continue{
  width: 100%;
  height: 0.58rem;
  background: #0059DA;
  border-radius: 0.29rem;
  font-family: 'SFProDisplayMedium',SFProDisplayMedium;
  font-style: normal;
  font-weight: 500;
  font-size: 0.16rem;
  text-align: center;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.3rem;
  cursor: pointer;
  border: none;
  position: relative;
  .rightIcon{
    width: 0.2rem;
    margin-left: 0.08rem;
  }
}
.continue:disabled{
  background: rgba(0, 89, 218, 0.5);
  cursor: no-drop;
}

// 单选框
.checkbox{
  ::v-deep .el-checkbox__inner{
    border-radius: 100% !important;
  }
}
.checkbox ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background: #0059DA;
  border-color:#0059DA ;
}
</style>
