<template>
  <div class="KycVer-container">
    
    <div class="Verification_content" v-if="status==0" :key="0">
      <div class="kyc_nav">
      <img src="@/assets/images/ShutDown.png" @click="$router.replace('/')" alt="">
    </div>
        <div class="content" v-if="kycVerState==0">
          <img src="@/assets/images/kycIcon1.png" alt="">
            <p>Please verify your identity.
            It usually takes about 2 minutes.</p>
            <div>
              · Prepare your ID
            </div>
            <div>
              · Get ready to take a selfie with document.
            </div>
        </div>
        <div class="content" v-else-if="kycVerState==1">
          <img src="@/assets/images/kycIcon1.png" alt="">
            <p style="text-align:center">Congrats! Your verification completed.</p>
            
        </div>
        <div class="content" v-else>
          <img src="@/assets/images/kycIcon1.png" alt="">
            <p style="text-align:center">Your verification failed.</p>
            <ul class="verify_list">
                <li>Please ensure:</li>
                <li>· You submitted your own ID document .</li>
                <li>T· The name on your ID document is identical to your payment's cardholder name .</li>
                <li>· You did not use multiple ID documents for the KYC verification .</li>
            </ul>
        </div>
        <div class="Verification_button" v-if="kycVerState==0" @click="nextKycVer(0)">
          <p  >Begin Verification</p>
          <img src="@/assets/images/rightIconSell.png" alt="">
        </div>
        <div class="Verification_button" v-else-if="kycVerState==1">
          <p>Continue the Payment</p>
          <img src="@/assets/images/rightIconSell.png" alt="">
        </div>
        <div class="Verification_button" v-else>
          <p >Try Again </p>
          <img src="@/assets/images/rightIconSell.png" alt="">
        </div>
    </div>
    <div class="verif_kyc" v-else :key="1">
          <img src="@/assets/images/ShutDown.png" @click="status=0" alt="">
      <div id="sumsub-websdk-container" ></div>
    </div>
    
  </div>
</template>
<script>
import snsWebSdk from '@sumsub/websdk';
export default {
  name:'KycVerification',
  data(){
    return {
      status:0,
      kycVerState:0
    }
  },
  methods:{
    //kyc验证
    launchWebSdk(accessToken){
      let snsWebSdkInstance = snsWebSdk.init(
            accessToken,
            // token update callback, must return Promise
            // Access token expired
            // get a new one and pass it to the callback to re-initiate the WebSDK
            () => this.getNewAccessToken()
        )
        .withConf({
            lang: 'zh', //language of WebSDK texts and comments (ISO 639-1 format)
        })
        
        .withOptions({ addViewportTag: false, adaptIframeHeight: true})
        // see below what kind of messages WebSDK generates
        .on('idCheck.stepCompleted', (payload) => {
           console.log(payload);
            
        })
        .on('idCheck.onAction',(res)=>{
          console.log(res);
        })
        .on('idCheck.onError', (error) => {
            console.log('onError', error)
        })
        .build();
  
    // you are ready to go:
    // just launch the WebSDK by providing the container element for it
    snsWebSdkInstance.launch('#sumsub-websdk-container')
},
    //获取kyc验证的token
    getNewAccessToken() {
      // let newAccessToken = '_act-sbx-080f8eef-29d9-42a2-b9f8-dd894ad94e7e'
        return Promise.resolve('')// get a new token from your backend
    },
    //next
    nextKycVer(val){
      this.status=1
      setTimeout(()=>{
        this.launchWebSdk('_act-sbx-71d678b8-5172-4238-a5f0-e54d4ca4f9c4')
      },1000)
    }
  },
  mounted(){
   
    
  }
}
</script>

<style lang="scss" scoped>
.KycVer-container{
  height: 100%;
 display: flex;
 justify-content: center;
 align-items: center;
  .kyc_nav{
    width: 100%;
    height: .2rem;
    // margin-bottom: .65rem;
    img{
      float: right;
      height: .11rem;
      cursor: pointer;
    }
  }
  .Verification_content{
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .content{
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: GeoRegular;
      >img{
        width: 1.75rem;
      }
      p{
        width: 2.2rem;
        margin-top: .2rem;
        color: #063376;
        line-height: 22px;
      }
      div{
        width: 2.2rem;
        font-size: .13rem;
        line-height: .16rem;
        color: #949EA4;
        font-family: GeoRegular;
         white-space: nowrap;
      }
       div:nth-of-type(1){
        margin: .2rem 0 .08rem 0;
      }
      .verify_list{
        width: 90%;
        font-size: .13rem;
        color: #949EA4;
        line-height: .16rem;
        margin-top: .2rem;
        li{
          margin-top: .06rem;
        }
      }
    }
    .Verification_button{
      width: 100%;
      height: .58rem;
      background: #0059DA;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: .3rem;
      font-family: GeoRegular;
      color: #FFFFFF;
      cursor: pointer;
      img{
        height: .12rem;
        margin-left: .12rem;
        
      }
    }
  }
  .verif_kyc{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
   >img{
     height: .15rem;
     cursor: pointer;
     position: absolute;
     right: .3rem;
     top: .4rem;
   }
 
  }
}
</style>