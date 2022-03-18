<template>
  <div id="emailCode">
    <div class="form-title">We will notify you of the purchase result by email</div>
    <div class="form-input"><input type="text" placeholder="Email Address" v-model="email">
      <span class="formOptions" :class="{'getCodeClass': email===''}" @click="getCode" v-if="timeDown===60">Get code</span>
      <span class="formOptions" v-else>{{ timeDown }}S</span>
    </div>
    <!-- error message -->
    <div class="errorMessage" v-if="emailErrorState" v-html="emailError"></div>
    <div class="form-title">Enter the verification code you received</div>
    <div class="form-input emailCode"><input type="text" v-model="code" maxlength="6"></div>
    <!-- error message -->
    <div class="errorMessage" v-if="codeErrorState" v-html="codeError">Verification code not match.</div>
    <!-- Permission agreement -->
    <div class="agreement-content">
      <div class="agreement-radio"><input type="checkbox" v-model="agreement"></div>
      <div class="agreement-text">I have read and agree to Alchemy Pay’s <span>《Terms of Service》</span> and <span>《Privacy Policy》</span>.</div>
    </div>
    <includedDetails v-if="includedDetails_state"/>
    <div class="continue" :class="{'buttonTrue': email!==''&&code.length===6&&agreement===true}" @click="toLogin">Continue</div>
  </div>
</template>

<script>
import includedDetails from "../../components/includedDetails";
import axios from 'axios';

export default {
  name: "emailCode",
  components: { includedDetails },
  data(){
    return{
      timeDown: 60,
      emailErrorState: false,
      emailError: '',
      detailsState: true,
      email: '',
      code: '',
      agreement: false,
      codeErrorState: false,
      codeError: '',
      includedDetails_state: false,
    }
  },
  mounted(){
    this.includedDetails_state = this.$route.query.fromName ? this.$route.query.fromName === 'tradeList' ? false : true : '';
  },
  methods: {
    getCode() {
      //verification
      if(this.email === ''){
        // this.emailError = "Please fill in the email.";
        // this.emailErrorState = true;
        return;
      }
      var reg = new RegExp(".+@.+\\..+");
      if(!reg.test(this.email)){
        this.emailErrorState = true;
        this.emailError = "Not a valid email address.";
        return;
      }
      this.emailErrorState = false;
      //Get code
      let params = {
        email: this.email
      }
      this.$axios.post(localStorage.getItem("baseUrl")+this.$api.post_sendEmail,params).then(res=>{
        if(res.returnCode === '0000'){
          this.timeDown -= 1;
          var timeDown = setInterval(()=>{
            this.timeDown -= 1;
            if(this.timeDown === 1){
              clearInterval(timeDown)
              this.timeDown = 60;
            }
          },1000)
        }
      })
    },
    expandCollapse(){
      this.detailsState = this.detailsState === true ? false : true;
    },
    toLogin(){
      let _this = this;
      if(this.email!==''&&this.code.length===6&&this.agreement===true){
        var FormData = require('form-data');
        var data = new FormData();
        data.append('email', this.email);
        data.append('verificationCode', this.code);
        var config = {
          method: 'post',
          url: localStorage.getItem("baseUrl")+this.$api.post_login,
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
            console.log(_this.$route.query.fromName)
            if(_this.$route.query.fromName === 'tradeList'){
              _this.$router.replace('/tradeHistory');
            }else{
              _this.$router.push(`/receiveCoins?routerParams=${_this.$route.query.routerParams}`);
            }
          }else if(response.returnCode === "10002" || response.returnCode === "10003" || response.returnCode === "1026" || response.returnCode === "1027" || response.returnCode === "1025"){
            _this.codeErrorState = true;
            _this.codeError = response.returnMsg;
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
#emailCode{
  .form-title{
    font-size: 0.14rem;
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #232323;
    margin-top: 0.2rem;
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
      font-family: Jost-Regular, Jost;
      font-weight: 400;
      padding: 0 1rem 0 0.2rem;
      border: none;
      outline: none;
    }
  }
  .emailCode input{
    letter-spacing: 3px;
  }
  .errorMessage{
    font-size: 0.14rem;
    font-family: Jost-Regular, Jost;
    font-weight: 400;
    color: #FF0000;
    margin: 0.1rem 0 0 0.2rem;
  }
  .formOptions{
    position: absolute;
    top: 0.19rem;
    right: 0.2rem;
    font-size: 0.16rem;
    font-family: Jost-Bold, Jost;
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
      margin-top: 0.02rem;
      input{
        cursor: pointer;
      }
    }
    .agreement-text{
      font-size: 0.14rem;
      font-family: Jost-Regular, Jost;
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
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #FAFAFA;
    margin-top: 0.4rem;
    cursor: no-drop;
  }
  .buttonTrue{
    background: #4479D9 !important;
  }
}
</style>
