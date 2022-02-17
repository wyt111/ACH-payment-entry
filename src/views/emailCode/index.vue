<template>
  <div id="emailCode">
    <div class="form-title">We will notify you of the purchase result by email</div>
    <div class="form-input"><input type="text" placeholder="Email Address">
      <span class="formOptions" @click="getCode" v-if="timeDown===60">Get code</span>
      <span class="formOptions" v-else>{{ timeDown }}S</span>
    </div>
    <!-- error message -->
    <div class="errorMessage" v-if="emailErrorState">Not a valid email address.</div>
    <div class="form-title">Enter the verification code you received</div>
    <div class="form-input emailCode"><input type="text" maxlength="6"></div>
    <!-- error message -->
    <div class="errorMessage" v-if="codeErrorState">Verification code not match.</div>
    <!-- Permission agreement -->
    <div class="agreement-content">
      <div class="agreement-radio"><input type="checkbox" name="ok"></div>
      <div class="agreement-text">I have read and agree to Alchemy Pay’s <span>《Terms of Service》</span> and <span>《Privacy Policy》</span>.</div>
    </div>
    <includedDetails/>
    <div class="continue">Continue</div>
  </div>
</template>

<script>
import includedDetails from "./childrens/includedDetails";
export default {
  name: "emailCode",
  components: { includedDetails },
  data(){
    return{
      timeDown: 60,
      emailErrorState: false,
      codeErrorState: false,
      detailsState: true
    }
  },
  methods: {
    getCode() {
      this.timeDown -= 1;
      var timeDown = setInterval(()=>{
        this.timeDown -= 1;
        if(this.timeDown === 1){
          clearInterval(timeDown)
          this.timeDown = 60;
        }
      },1000)
    },
    expandCollapse(){
      this.detailsState = this.detailsState === true ? false : true;
    }
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
}
</style>
