<template>
  <div id="basisIdAuth">
    <div id="bas-widget-container" ref="iframe" style="height: 100%;display: block">
      <div class="loadingContent">
        <img class="loadingImage" src="@/assets/images/Pinwheel.gif">
        <p class="loadingText">BASIS ID loading...</p>
      </div>
    </div>
    <div class="promptInfo" v-show="nextState" ref="search">
      <div class="promptInfo_contnet">
        <div class="img">
          <img v-if="CallbackState" src="@/assets/images/basisIdAuthIcon_success.png">
          <img v-else src="@/assets/images/basisIdAuthIcon_error.png">
        </div>
        <div class="text">
          <span v-if="CallbackState">Your identity information has been confirmed, you can proceed to pay now.</span>
          <span v-else>Your identity information has not been verified,you cannot buy cryptocurrency with a credit card.</span>
        </div>
        <div class="nextStep-button" @click="payNext">
            <span v-if="CallbackState">Continue to Pay</span>
            <span v-else>Back Home</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: "basis-Id-Auth",
  data(){
    return{
      nextState: false,
      CallbackState: true,
      timeDown: null
    }
  },
  activated() {
    this.nextStep = new BScroll(this.$refs.search, {click: true});
    this.evokePlugIn();
  },
  deactivated(){
    window.clearInterval(this.timeDown);
    this.timeDown = null;
  },
  methods: {
    evokePlugIn(){
      let _this = this;
      window.BAS.AS.initFrame({
        key: "prod-avCfbDdentVAUboRTTnfxrZCfKsWqfkA",
        bas_gw: "https://api.basisid.com/",
        container_id: "bas-widget-container",
        ui: {
          width: "100%",
          height: "100%",
          mobile_height: "auto",
          display: "block"
        },
        options: {
          language: "en"
        },
        events:{
          onLoad: function(){},
          onManualCheck: function(result) {
            if (result.status === "ok"){
              //Refresh the form status filled in by the user
              this.timeDown = setInterval(()=>{
                _this.$axios.get(_this.$api.get_isbasisIdAuth, '').then(res=>{
                  if(res && res.returnCode === "0000"){
                    //10 of Authentication successful
                    if(res.data.status === 10){
                      _this.nextState = true;
                      _this.CallbackState = true;
                      _this.storeInfo(result)
                      window.clearInterval(_this.timeDown);
                      _this.timeDown = null;
                    }else{
                      _this.nextState = true;
                      _this.CallbackState = false;
                      window.clearInterval(_this.timeDown);
                      _this.timeDown = null;
                    }
                  }
                })
              },1000);
            }
          },
        }
      });
    },

    //Store user filled information
    storeInfo(result){
      let params = {
        "userId": result.user_id,
        "userHash": result.user_hash
      }
      this.$axios.post(this.$api.post_storageBasisIdAuth, params,'').then(res=>{
        if(res && res.returnCode === "0000"){
          console.log("store userId ok");
        }
      })
    },

    //go to next page
    payNext(){
      if(this.CallbackState === true){
        this.$router.replace(`/creditCardConfig?submitForm=${this.$route.query.submitForm}`);
      }else{
        this.$router.replace('/');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
width,body,#basisIdAuth,.promptInfo{
  width: 100%;
  height: 100%;
}
.loadingContent{
  margin: 2.5rem auto;
  .loadingImage{
    display: flex;
    margin: 0.2rem auto;
  }
  .loadingText{
    font-size: 0.16rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    text-align: center;
    color: #232323;
    line-height: 0.23rem;
  }
}
.promptInfo{
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  .promptInfo_contnet{
    margin-top: -20%;
    width: 85%;
    background: #FFFFFF;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 0.3rem 0.18rem 0.2rem 0.18rem;
    .img{
      display: flex;
      justify-content: center;
      margin-left: 0.15rem;
      img{
        width: 1.11rem;
      }
    }
    .text{
      font-size: 0.14rem;
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      color: #000000;
      line-height: 0.24rem;
      text-align: center;
      margin-top: 0.22rem;
    }
    .nextStep-button{
      width: 80%;
      height: 0.44rem;
      background: #4479D9;
      border-radius: 4px;
      text-align: center;
      line-height: 0.44rem;
      font-size: 0.18rem;
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      color: #FAFAFA;
      margin: 0 auto;
      margin-top: 0.46rem;
      cursor: pointer !important;
    }
  }
}
#bas-widget-container{
  display: block !important
}
</style>
