  <template>
  <div class="KycVer-container">
    <!-- 展示成功失败页面 -->
    <div class="Verification_content" v-if="status==0" :key="0">
      <div class="kyc_nav">
      <img src="@/assets/images/ShutDown.png" @click="goHome" alt="">
    </div>
    <!-- 点击进行kyc验证 -->
        <div class="content" v-if="kycVerState==0">
          <img src="@/assets/images/kycIcon1.svg" alt="">
            <p>Please verify your identity.
            It usually takes about 2 minutes.</p> 
            <div>
              · Prepare your ID
            </div>
            <div>
              · Get ready to take a selfie with document.
            </div>
        </div>
        <!-- kyc验证成功 -->
        <div class="content" v-else-if="kycVerState==1">
          <img src="@/assets/images/kycIcon2.svg" alt="">
            <p style="text-align:center">Congrats! Your verification completed.</p>
            
        </div>
        <!-- kyc验证失败 -->
        <div class="content" v-else>
          <img src="@/assets/images/kycIcon3.svg" alt="">
            <p style="text-align:center">Your verification failed.</p>
            <ul class="verify_list">
                <li>Please ensure:</li>
                <li>· <span>You submitted your own ID document .</span></li>
                <li>· <span>The name on your ID document is identical to your payment's cardholder name .</span></li>
                <li>· <span>You did not use multiple ID documents for the KYC verification .</span></li>
            </ul>
        </div>
        <div class="Verification_button" v-if="kycVerState==0" @click="nextKycVer(0)" :style="{opacity:!nextKyc?'.5':'',cursor:!nextKyc?'not-allowed':''}">
          <p  >Begin Verification</p>
          <img src="@/assets/images/rightIconSell.png" alt="" v-if="nextKyc">
          <van-loading class="icon" type="spinner" color="#fff" v-if="!nextKyc"/>
        </div>
        <div class="Verification_button" v-else-if="kycVerState==1" @click="nextKycVer(1)">
          <p>Continue the Payment</p>
          <img src="@/assets/images/rightIconSell.png" alt="" v-if="nextKyc">
          <van-loading class="icon" type="spinner" color="#fff" v-if="!nextKyc"/>
        </div>
        <div class="Verification_button" v-else @click="nextKycVer(2)">
          <p >Try Again </p>
          <img src="@/assets/images/rightIconSell.png" alt="" v-if="nextKyc">
          <van-loading class="icon" type="spinner" color="#fff" v-if="!nextKyc"/>
        </div>
    </div>
    <!-- kyc验证页面 -->
    <div class="verif_kyc" v-else :key="1">
          <img src="@/assets/images/ShutDown.png" @click="removeItemKyv" alt="">
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
      kycVerState:0,
      getToken:'',
      nextKyc:true,
      timeOut:null
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
            lang: sessionStorage.getItem('language') &&sessionStorage.getItem('language') === 'zh-HK'?'zh':'en-US', //language of WebSDK texts and comments (ISO 639-1 format)
        })
        
        .withOptions({ addViewportTag: false, adaptIframeHeight: true})
       //获取成功或失败或等待状态
      
        .on('idCheck.applicantStatus', (type,) => {
           console.log(type);
          if(!type){
            return
          }
          //正在处理
          if(type.reviewStatus === "pending"){
            console.log('正在处理')
            return
            //成功
          }else if(type.reviewStatus === "completed" && type.reviewResult.reviewAnswer === 'GREEN'){
            this.status = 0
            this.kycVerState = 1
            return
            //失败
          }else if(type.reviewStatus === "completed" && type.reviewResult.reviewAnswer === 'RED'){
            this.status = 0
            this.kycVerState = 2
            return
          }else{
            //重新验证
            this.status = 0
            this.kycVerState = 1
            return
          }
            
        })
       
       //获取kyc高度
        .on('idCheck.onResize', () => {
           let innerHeight = document.querySelector('.verif_kyc')
           let kycInneHeight = document.querySelector('.KycVer-container')
           innerHeight.style = `height:${kycInneHeight.clientHeight}px;overflow:scroll`
        })
        .on('idCheck.onError', (type,error) => {
            console.log('onError', error)
            console.log(type);
        })
        .build();
  
    //kyc容器
    snsWebSdkInstance.launch('#sumsub-websdk-container')
},
    //获取kyc验证的token
    getNewAccessToken() {
      this.getUserToken()
      // let newAccessToken = '_act-sbx-080f8eef-29d9-42a2-b9f8-dd894ad94e7e'
        return Promise.resolve(this.getToken)// get a new token from your backend
    },
    //next 下一步
    nextKycVer(val){
      //0进行kyc验证 1 成功跳转到卖币或者卖币订单page 2失败重新验证kyc
      if(val===0 && this.nextKyc){
        // console.log(this.$store.state.cardInfoFromPath);
        this.nextKyc = false
        setTimeout(()=>{
          this.status=1
        this.getUserToken()
        },1000)
        
        return 
      }else if(val === 1){
        this.status=0
        this.kycVerState = 0
        // if(this.$store.state.cardInfoFromPath === 'configSell'){
        //   this.$router.push(`/sellOrder`)
        //   return
        // }
        sessionStorage.removeItem('getToken')
            sessionStorage.removeItem('sellState')
          alert('成功跳转')
        
        
        return
      }else if(val === 2){
        
        this.nextKyc = false
        
        setTimeout(()=>{
          this.status=1
          this.getUserToken()
          this.nextKyc = true
          this.launchWebSdk(this.getToken)
        },3000)
      }else{
        return false
      }
      
    },
    //关闭页面
    goHome(){
      //返回来的页面并且清空状态
        setTimeout(()=>{
          this.kycVerState = 0
        sessionStorage.setItem('kycVerState',this.kycVerState)
        })
       sessionStorage.removeItem('sellState') 
       sessionStorage.removeItem('getToken')
      this.$router.go(-1)
    },
    //关闭kyc验证
    removeItemKyv(){
      this.status = 0;
       sessionStorage.removeItem('sellState') 
       sessionStorage.removeItem('getToken')
    },
    //获取用户的kyc验证token
    getUserToken(){
      let data = {
        fullName:'20T0fT/6GpV2B6qCvN5HRQ=='
      }
       this.$axios.post(this.$api.post_getKycToken+'?fullName='+data.fullName).then(res=>{
         if(!res){
            this.nextKyc = true
            this.$toast('未知错误')
            return
         }
           
          if(res.data && res.returnCode === '0000'){
            this.getToken =  res.data
            sessionStorage.setItem('getToken',res.data)
            sessionStorage.setItem('sellState',this.status)
            // setTimeout(()=>{
              this.nextKyc = true
              this.launchWebSdk(this.getToken)
            // },2000)
            return 
          }else if(res.data && res.returnCode === '110'){
            this.status = 0
            this.kycVerState = 2
            this.nextKyc = true
            this.$toast(res.data)
            return
          }
        })
        
    }
  },
  watch:{
    //保存页面状态
    kycVerState(newVal,oldVal){
      if(newVal !== oldVal){
        sessionStorage.setItem('kycVerState',newVal)
      }
    },
   
  },
  
  mounted(){
    //保存页面状态
    
   sessionStorage.getItem('kycVerState')?this.kycVerState = sessionStorage.getItem('kycVerState'):''
   if(sessionStorage.getItem('sellState') && sessionStorage.getItem('getToken')){
     this.status = sessionStorage.getItem('sellState') 
      this.getToken = sessionStorage.getItem('getToken')
      setTimeout(()=>{
        this.launchWebSdk(this.getToken)
      },200)
   }else{
     return false
   }
   

  //  console.log(this.kycVerState=2);
  }
}
</script>

<style lang="scss" scoped>
.KycVer-container{
  width: 100%;
  height: 100%;
 overflow: hidden;
  .icon {
    height: .15rem !important;
  }
  .kyc_nav{
    width: 100%;
    height: .2rem;
    // margin-bottom: .65rem;
    img{
      float: right;
      height: .15rem;
      cursor: pointer;
    }
  }
  .Verification_content{
    width: 100%;
    height: 100%;
    // flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .content{
      display: flex;
      flex-direction: column;
      align-items: center;
      
      >img{
        width: 1.75rem;
      }
      p{
        width: 2.2rem;
        margin-top: .2rem;
        color: #063376;
        line-height: 22px;
        font-family: SFProDisplaybold;
      }
      div{
        width: 2.2rem;
        font-size: .13rem;
        line-height: .16rem;
        color: #949EA4;
        font-family: SFProDisplayRegular;
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
          font-family: SFProDisplayRegular;
          display: flex;
          span{
            display: inline-block;
            margin-left: .05rem;
          }
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
      font-family: SFProDisplayRegular;
      color: #FFFFFF;
      cursor: pointer;
      img{
        height: .12rem;
        margin-left: .12rem;
        
      }
    }
  }
  .verif_kyc{
    width: 3.4rem;
    position: fixed;
    overflow: scroll;
   >img{
     height: .14rem;
     cursor: pointer;
     position: absolute;
     right: .1rem;
     top: .0rem;
   }
 #sumsub-websdk-container{
  height: 100%;
  
  overflow: scroll;
 }
  }
}
</style>