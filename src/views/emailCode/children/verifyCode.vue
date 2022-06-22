<template>
  <div class="verifyCode-container">
      <div style="position:relative;flex:1">
        <div class="verifyCode_title">We’ve sent a confirmation code to your email.</div>
      <div class="verifyCode_content">
        <span v-for="(item,index) in number" :key="index" @click="changeBlur" :class="index===value.length?'active':''">{{ value[index] }}</span>
        <input type="input" style="outline: none; color:transparent;" v-model="value" :maxlength="6" ref="input">
      </div>
      <div class="verifyCode_title" style="margin-top:.4rem;text-align: center;" v-if="codeTime>0">New verification code sent {{ codeTime }}s</div>
      <div class="verifyCode_title" v-else style="margin-top:.4rem;text-align: center;" >If your code doesn't arrive shortly.  <span @click="getEmailCode">Resend </span></div>
      </div>
      <div style="position:relative;height: 1.1rem;">
        <div class="verifyCode_title bottom">
        <el-checkbox size="small" v-model="checked"></el-checkbox>
        <div> I agree with Alchemy Pay's <span @click="openView('Terms')" style="cursor: pointer;">&lt;Terms of Service&gt;</span> and <span style="cursor: pointer" @click="openView('Privacy')">&lt;Privacy Policy&gt;.</span></div></div>
      <div class="verifyCode_button" @click="toLogin" :style="{background:netActive && !showLoading?'#0059DAFF':''}">Continue
        <img class="icon" src="@/assets/images/slices/rightIcon.png" alt="" v-if="!showLoading">
        <van-loading class="icon" type="spinner" color="#fff" v-else/>
      </div>
      </div>
  </div>
</template>
<script>
import axios from 'axios';
import { debounce } from '../../../utils/index';
import { AES_Encrypt } from '@/utils/encryp.js';
  export default {
  name: "verifyCode",
  data(){
    return {
      number:6,
      value:'',
      checked:false,
      codeTime:0,
      timeVal:null,
      showLoading:false
    }
  },
  mounted(){
    setTimeout(()=>{
      this.changeBlur()
    },500)
    // clearInterval(this.timeVal)
    // this.timeVal = setInterval(()=>{
    //   this.codeTime--
    //   if(this.codeTime <= 0){
    //     // this.codeTime = 10
    //     clearInterval(this.timeVal)
    //   }
    // },1000)
  },
  activated(){
    this.value = ''
    setTimeout(()=>{
      this.changeBlur()
    },500)
    // clearInterval(this.timeVal)
    // this.codeTime = 10
    //   this.timeVal = setInterval(()=>{
    //   this.codeTime--
    //   if(this.codeTime <= 0){
    //     // this.codeTime = 10
    //     clearInterval(this.timeVal)
    //   }
    // },1000)
  },
  methods:{
    //input聚焦
    changeBlur(){
     this.$refs.input.focus()
    },
    //获取验证码
    getEmailCode:debounce(function (){
      this.value = ''
      this.changeBlur()
      // this.codeTime = 10
      let params = {
        email:this.$store.state.userEmail
      }
       this.$axios.post(this.$api.post_sendEmail,params,'').then(res=>{
         if(res.returnCode === '0000'){
           this.codeTime = 10
           clearInterval(this.timeVal)
           this.timeVal = setInterval(()=>{
            this.codeTime--
            if(this.codeTime <= 0){
              clearInterval(this.timeVal)
            }
          },1000)
         }
       })
    },500,false),
    toLogin(){
     if(this.netActive){
       let _this = this;
       this.showLoading = true
       var FormData = require('form-data');
        var data = new FormData();
         data.append('email', this.$store.state.userEmail);
         data.append('verificationCode', AES_Encrypt(this.value));
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
          if(response.returnCode === '0000'){
            _this.codeErrorState = false;
            _this.showLoading = false
            _this.$store.state.isLogin = true
            _this.$store.state.menuState = 'login'
            // debugger
            // console.log(_this.$store.state.routerQueryPath);
        if(_this.$store.state.routerQueryPath === true){
          _this.$router.push('/');
          return
        }
            if(_this.$route.query.fromName === 'tradeList'){
              _this.$router.replace('/tradeHistory');
            }else{
              //登陆跳转路径根据router.from的路由跳转不同页面
              if(_this.$store.state.emailFromPath === 'buyCrypto'){
                _this.$router.push(`/receivingMode`);
              }else if(_this.$store.state.emailFromPath === 'sellCrypto'){
                  // _this.$router.push('/')

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
            // console.log(111);
            _this.codeErrorState = false;
            _this.showLoading = false
            _this.$toast({
              duration: 3000,
              message: response.returnMsg
            });
          }

        }).catch(function (error) {
          _this.showLoading = false
          console.log(error);
        });
     }else if(this.value.length < 6){
       this.$toast({
         duration: 3000,
         message: 'Please fill in the verification'
       });
       return
     }else{
       this.$toast({
         duration: 3000,
         message: 'Please tick the User Agreement'
       });
       return
     }

    },
    openView(name){
      if(name==='Privacy'){
        window.location = 'https://alchemypay.org/privacy-policy/'
        return
      }
      if(name === 'Terms'){
         window.location = 'https://alchemypay.org/terms-of-use/';
        return;
      }
    }
  },
  computed:{
    netActive(){
      if(this.checked && this.value.length === 6){
        return true
      }else if(isNaN(this.value) === true){
        return false
      }else{
        return false
      }
    }
  }
  }
</script>
<style lang="scss" scoped>
.verifyCode-container{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .verifyCode_title{
    font-size: .13rem;
    color: #232323;
    font-family: "GeoLight";
    span{
      color: #0059DAFF;
      cursor: pointer;
    }
  }
  .verifyCode_content{
    width: 100%;
    height: .8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    top: .3rem;
    span{
      display: inline-block;
      width: .5rem;
      height: .65rem;
      border-radius: .12rem;
      font-size: .24rem;
      background: #F3F4F5FF;
      text-align: center;
      line-height: .65rem;
    }
    .active{
      border: 1px solid #0059DAFF;
    }
    input{
      width: 100%;
      height: 100%;
      border: none;
      position: absolute;
      z-index: -1;
      pointer-events: none;
        text-indent: -999em; /*文本向左缩进*/
    margin-left: -100%; /*输入框光标起始点向左左移*／
    width: 200%; /*输入框增大一倍*/
    opacity: 0;

    }
  }
  .verifyCode_button{
    width: 100%;
    height: .58rem;
    background: rgba(0, 89, 218, 0.5);
    border-radius: .29rem;
    font-size: .17rem;
    text-align: center;
    line-height: .58rem;
    // position: absolute;
    // bottom: 0rem;
    position: relative;
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
        top: .03rem;
      }
    }
  }
  .bottom{
    display: flex;
    margin-bottom: .08rem;
    // position: relative;
    // bottom: .14rem;
    div{
      line-height: .2rem;
      margin-left: .11rem;
    }
  }
  .bottom ::v-deep .el-checkbox__inner:hover{
  border-color: #DFDFDF !important;
}
  .bottom ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{

    background-color: #0059DA;
    border: 1px solid #0059DA;
    border-radius: 0.05rem;
  }
  .bottom ::v-deep .el-checkbox__inner{
    // width: .16rem !important;
    //   height: .16rem !important;
    border: 1px solid #DFDFDF;
    margin-top: .03rem;
  }
}
</style>
