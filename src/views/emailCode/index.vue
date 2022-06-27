<template>
  <!-- <div id="emailCode"> -->
    <!-- <div class="form-title">Enter your emai address</div>
    <div class="form-input"><input type="text" placeholder="Email Address" v-model="email">
      <span class="formOptions" :class="{'getCodeClass': email===''}" @click="getCode" v-if="timeDown===60">Get code</span>
      <span class="formOptions" v-else>{{ timeDown }}S</span>
    </div> -->
    <!-- error message -->
    <!-- <div class="errorMessage" v-if="emailErrorState" v-html="emailError"></div>
    <div class="form-title">Enter the verification code you received</div>
    <div class="form-input emailCode"><input type="text" v-model="code" placeholder="Login Code" maxlength="6"></div> -->
    <!-- error message -->
    <!-- <div class="errorMessage" v-if="codeErrorState" v-html="codeError">Verification code not match.</div> -->
    <!-- Permission agreement -->
    <!-- <div class="agreement-content">
      <div class="agreement-radio"><input type="checkbox" v-model="agreement"></div>
      <div class="agreement-text">I have read and agree to Alchemy Pay’s <span @click="goProtocol('termsUse')">{{ '<' }}Terms of Use{{ '>' }}</span> and <span @click="goProtocol('privacyPolicy')">{{ '<' }}Privacy Policy{{ '>' }}</span>.</div>
    </div>
    <includedDetails v-if="includedDetails_state"/>
    <div class="continue" :class="{'buttonTrue': email!==''&&code.length===6&&agreement===true}" @click="toLogin">Continue</div> -->

  <!-- </div> -->
  <div class="emailCode-container" ref="emailCode">
    <div>
      <div class="emailCode_tab">
      <img  @click="$router.replace('/')" src="@/assets/images/closeIcon.png" alt="">
    </div>
      <div class="emailCode-container_top">
        <img src="@/assets/images/slices/pay.png" alt="">
        <h2>{{ $t('nav.loginTitle1') }}</h2>
        <p>{{ $t('nav.loginTitle2') }}</p>
      </div>
      <div class="emailCode_content" ref="emailInput">
        <p>{{ $t('nav.enterEmail') }}</p>
        <img src="@/assets/images/slices/emailIcon.png" alt="">
        <input type="text"  v-model="email" placeholder="john.doe@example.com">
      </div>
      <div class="errorMessage" v-if="emailErrorState" v-html="emailError"></div>
    </div>

      <div class="emailCode_button" :style="{background: (email!=='' && email!==undefined && login_loading=== true)?'#0059DAFF':login_loading===false?'':''}" @click="getCode">
        {{ $t('nav.Continue') }}
        <img class="icon" src="@/assets/images/slices/rightIcon.png" alt="" v-if="login_loading">
        <van-loading class="icon" type="spinner" color="#fff" v-if="login_loading===false"/>
      </div>
  </div>
</template>

<script>
// import includedDetails from "../../components/IncludedDetails";
import axios from 'axios';
import { debounce } from '../../utils/index';
import { AES_Encrypt } from '@/utils/encryp.js';

export default {
  name: "emailCode",
  // components: { includedDetails },
  data(){
    return{
      timeDown: 60,
      timeVal: null,
      emailErrorState: false,
      emailError: '',
      detailsState: true,
      email: '',
      code: '',
      agreement: false,
      codeErrorState: false,
      codeError: '',
      includedDetails_state: false,

      getCode_state: true,
      login_state: true,
      login_loading:true
    }
  },
  activated(){
    this.login_loading= true
    this.code = "";
    this.timeDown = 60;
    this.includedDetails_state = this.$route.query.fromName ? this.$route.query.fromName === 'tradeList' ? false : true : '';
    if(sessionStorage.getItem("accessMerchantInfo") !== "{}" && sessionStorage.getItem("accessMerchantInfo") !== null){
      this.email = JSON.parse(sessionStorage.getItem("accessMerchantInfo")).mail;
    }
  },
  deactivated(){
    clearInterval(this.timeVal)
  },
  methods: {
    getCode:debounce(function () {
      this.getCode_state = false;
      // this.emailErrorState = false;
      var reg = new RegExp(".+@.+\\..+");
      if(!reg.test(this.email)){
        this.emailErrorState = true
        // this.emailError = "Not a valid email address.";
        this.emailError = "Required.";
        // this.login_loading = false
        this.$refs.emailInput.style = 'border:1px solid #D92D20'
        return;
      }
      this.$refs.emailInput.style = 'border:none'
      this.emailErrorState = false;
      this.login_loading = false
      //Get code
      let params = {
        email: AES_Encrypt(this.email)
      }
      this.$axios.post(this.$api.post_sendEmail,params,'').then(res=>{
        this.login_loading = true
        this.getCode_state = true;
        if(res.returnCode === '0000'){
          this.login_loading = false
          this.$store.state.userEmail = AES_Encrypt(this.email)
          this.$router.push({
            path:'/verifyCode',
          })
        }
      })

    },500,false),
    expandCollapse(){
      this.detailsState = this.detailsState === true ? false : true;
    },
    toLogin:debounce(function (){
      this.login_state = false;
      let _this = this;
      if(this.email!==''&&this.code.length===6&&this.agreement===true){
        var FormData = require('form-data');
        var data = new FormData();
        data.append('email', AES_Encrypt(this.email));
        data.append('verificationCode', AES_Encrypt(this.code));
        var config = {
          method: 'post',
          url: process.env.VUE_APP_BASE_API + this.$api.post_login,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data : data
        };
        axios.interceptors.response.use(function (config) {
          return config;
        }, function (error) {
          // Do something with response error
          return Promise.reject(error);
        })
        axios(config).then(function (response) {
          _this.login_state = true;

          if(response.returnCode === '0000'){
            _this.codeErrorState = false;
            if(_this.$route.query.fromName === 'tradeList'){
              _this.$router.replace('/tradeHistory');
            }else{
              //登陆跳转路径根据router.from的路由跳转不同页面
              if(_this.$store.state.emailFromPath === 'buyCrypto'){
                _this.$router.push(`/receivingMode`);
              }else if(_this.$store.state.emailFromPath === 'sellCrypto'){
                let params = {
                  country: _this.$store.state.sellRouterParams.positionData.alpha2,
                  fiatName: _this.$store.state.sellRouterParams.positionData.fiatCode,
                };
                _this.$axios.get(_this.$api.get_userSellCardInfo,params).then(res=>{
                  //data - null 没有填写过表单,跳转到表单页
                  //data - !null 有填写过表单,跳转到确认订单页
                  if(res && res.returnCode === "0000" && res.data === null){
                    delete _this.$store.state.sellForm;
                    _this.$router.push('/sell-formUserInfo')
                  }else if(res && res.returnCode === "0000" && res.data !== null){
                    _this.$store.state.sellForm = res.data;
                    _this.$router.push('/configSell')
                  }
                })
              }else if(_this.$store.state.emailFromPath === 'sellOrder'){
                _this.$router.push('/sellOrder');
              }else{
                _this.$router.push('/');
              }
            }
          }else if(response.returnCode === "10002" || response.returnCode === "10003" || response.returnCode === "1026" || response.returnCode === "1027" || response.returnCode === "1025"){
            _this.codeErrorState = true;
            _this.codeError = response.returnMsg;
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    },300,false),

    goProtocol(name){
      if(name === 'privacyPolicy'){
        window.location = 'https://alchemypay.org/privacy-policy/';
        return;
      }
      if(name === 'termsUse'){
        window.location = 'https://alchemypay.org/terms-of-use/';
        return;
      }
    }
  },
  mounted(){

  }
}
</script>

<style lang="scss" scoped>
#emailCode{
  .form-title{
    font-size: 0.14rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #232323;
    padding-top: 0.2rem;
  }
  .form-input{
    height: 0.6rem;
    background: #F3F4F5;
    border-radius: 10px;
    margin-top: 0.1rem;
    display: flex;
    position: relative;
    input{
      width: 100%;
      height: 100%;
      background: #F3F4F5;
      border-radius: 10px;
      font-size: 0.16rem;
      color: #232323;
      font-family: "GeoDemibold", GeoDemibold;
      font-weight: 400;
      padding: 0 1rem 0 0.2rem;
      border: none;
      outline: none;
    }
  }
  .emailCode input::placeholder{
    letter-spacing: 0;
  }
  .emailCode input{
    letter-spacing: 3px;
  }
  .errorMessage{
    font-size: 0.14rem;
    font-family: "GeoDemibold", GeoDemibold;
    font-weight: 400;
    color: #FF0000;
    margin: 0.1rem 0 0 0.2rem;
  }
  .formOptions{
    position: absolute;
    top: 0.19rem;
    right: 0.2rem;
    font-size: 0.16rem;
    font-family: 'Jost', sans-serif;
    font-weight: bold;
    color: #4479D9;
    cursor: pointer;
  }
  .getCodeClass{
    opacity: 0.5;
    cursor: no-drop;
  }
  .agreement-content{
    display: flex;
    margin-top: 0.2rem;
    padding-bottom: 0.4rem;
    .agreement-radio{
      display: flex;
      margin-top: 0.05rem;
      input{
        cursor: pointer;
        width: 0.13rem;
        height: 0.13rem;
      }
    }
    .agreement-text{
      font-size: 0.14rem;
      font-family: "GeoDemibold", GeoDemibold;
      font-weight: 400;
      color: #333333;
      margin-left: 0.2rem;
      span{
        font-weight: bold;
        color: #4479DA;
        cursor: pointer;
      }
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
    margin-top: 0.4rem;
    cursor: no-drop;
  }
  .buttonTrue{
    background: #4479D9 !important;
    cursor: pointer;
  }
}
.emailCode-container{
  width: 100%;
  // height: 100%;
  overflow: hidden;
  // position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .emailCode-container_top{
    height: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    h2{
      font-size: .21rem;
      font-family:"GeoBold";
      font-weight: normal;
      color: #232323;
      margin: .24rem 0 .16rem 0;
    }
    p{
      width: 2.5rem;
      font-size: .13rem;
      font-family: "GeoRegular";
      font-weight: normal;
      color: #232323;
      text-align: center;
    }
    img{
      width: .4rem;
      height: .4rem;
    }
  }
  .emailCode_content{
    width: 100%;
    height: .56rem;
    background: #F3F4F5;
    border-radius: .12rem;
    position: relative;
    input{
      width: calc(100% - .42rem);
      height: 100%;
      border: none;
      font-size: .16rem;
      position: absolute;
      left: .42rem;
      background: transparent;
      font-family: "GeoLight";
      outline: none;
    }
    p{
      font-size: .13rem;
      color: #707070;
      position: absolute;
      font-family: "GeoRegular";
      top: -.22rem;
    }
    img{
      width: .16rem;
      height: .13rem;
      position: absolute;
      left: .16rem;
      top: .22rem;
    }
  }
  .emailCode_button{
    width: 100%;
    height: .58rem;
    background: rgba(0, 89, 218, 0.5);
    border-radius: .29rem;
    font-size: .17rem;
    text-align: center;
    line-height: .58rem;
    position: relative;
    // position: absolute;
    // bottom: 0rem;
    color: #FAFAFA;
    font-family: "GeoRegular";
    cursor: pointer;
    .icon{
      width: .24rem;
      height: .24rem;
      position: absolute;
      right: .16rem;
      top: .18rem;
      span{
        position: absolute;
        left: 0;
        top: .0rem;
      }
    }
  }
  .emailCode_tab{
    width: 100%;
    height: .35rem;
    img{
      height: .24rem;
      float: right;
    }
  }
  .errorMessage{
    font-weight: normal;
    color: #D92D20;
    line-height: 17px;
    font-size: 15px;
    font-family:GeoRegular;
    margin-top: .08rem;
  }
}
</style>
