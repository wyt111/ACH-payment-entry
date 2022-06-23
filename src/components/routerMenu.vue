<template>
  <div id="routerMenu">
    <div class="routerMenu_isLogo" v-if="token===false">
        <img src="../assets/images/slices/pay.png" alt="">
        <h2>Welcome to Alchemy Pay!</h2>
        <p>Login to unlock the full experience</p>
        <div @click="goLogin" :style="{background:loading?'#0059DA80':''}">Login <img class="icon" src="../assets/images/slices/rightIcon.png" alt="" v-if="!loading">
        <van-loading  class="icon" type="spinner" color="#fff" v-else/></div>
    </div>
    <div class="routerMenu_history" @click="goView('/tradeHistory')" v-else >
      <div class="lineIcon"><img src="../assets/images/slices/histry.png"></div>
      <div class="lineName">
        <p>Transactions</p>
        <p><span v-if="finished">No history yet</span></p>
      </div>
      <div class="lineRight">
        <div><img src="../assets/images/slices/right_icon.png"></div>

      </div>
    </div>
    <!-- <div class="routerMenu_line" @click="goView('/','buyCrypto')">
      <div class="lineIcon"><img src="../assets/images/menu/icon1.png"></div>
      <div class="lineName">Buy Crypto</div>
      <div class="lineRight">
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="goView('/','sellCrypto')">
      <div class="lineIcon"><img src="../assets/images/menu/icon2.png"></div>
      <div class="lineName">Sell Crypto</div>
      <div class="lineRight">
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div> -->
    <div class="routerMenu_line" style="margin-top:.32rem" @click="LanguageIsShow">
      <div class="lineIcon"><img src="../assets/images/slices/iconLang.png"></div>
      <div class="lineName">Language</div>

      <div class="lineRight">
        <p>{{ $store.state.languageValue }}</p>
        <div><img src="../assets/images/slices/right_icon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="goProtocol('termsUse')">
      <div class="lineIcon"><img src="../assets/images/slices/terms.png"></div>
      <div class="lineName">Terms of Service</div>
      <div class="lineRight">
        <div><img src="../assets/images/slices/right_icon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="goProtocol('privacyPolicy')">
      <div class="lineIcon"><img src="../assets/images/slices/privacy.png"></div>
      <div class="lineName">Privacy Policy</div>
      <div class="lineRight">
        <div><img src="../assets/images/slices/right_icon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="show=!show" v-if="email !== ''">
      <div class="lineIcon"><img src="../assets/images/slices/logOut.png"></div>
      <div class="lineName">Log Out</div>
      <div class="lineRight">
        <div class="email">{{ emailSlice }}</div>
        <div><img src="../assets/images/slices/right_icon.png"></div>
      </div>
    </div>
    <div class="routerMenu_loginOut" v-show="show" @click="show=false">
      <div class="content" @click.stop="show=true">
        <h2>Are you sure you want to logout?</h2>
        <div @click.stop="outLogin">Login <img src="../assets/images/slices/rightIcon.png" alt=""></div>
        <p @click.stop="show=false">Dismiss</p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 菜单组件
 */
import {AES_Decrypt} from "../utils/encryp";

export default {
  name: "routerMenu",
  data(){
    return{
      email: '',
      token:false,
      show:false,
      loading:false,
      query: {
        orderState: 4,
        orderType: 1,
        pageIndex: 1,
        pageSize: 5,
        historyList:[],
      },
      finished:false,
      newVal:''
    }
  },
  activated(){
    localStorage.getItem("token") ? this.token = true : false;
    localStorage.getItem("email") ? this.email = AES_Decrypt(localStorage.getItem("email")) : '';
    // this.transationsList()
  },
  deactivated(){
     localStorage.getItem("token") ? this.token = true : false;
    localStorage.getItem("email") ? this.email = AES_Decrypt(localStorage.getItem("email")) : '';
  },
  mounted(){
    localStorage.getItem("token") ? this.token = true : false;
    localStorage.getItem("email") ? this.email = AES_Decrypt(localStorage.getItem("email")) : '';
  },
  methods: {
    //Select menu
    goView(name,homeTab){
      this.$parent.routerViewState = true;
      this.$parent.menuState = false;
      if(name === '/'){
        this.$store.state.homeTabstate = homeTab;
        this.$router.push(name);
        return;
      }
      if(name === 'Language'){
        this.$router.push(name);
        return;
      }

      if(!localStorage.getItem("token")){
        this.$store.state.emailFromPath = this.$parent.tabstate;
        this.$router.push('/emailCode?fromName=tradeList').catch(()=>{});
      }else{
        this.$router.push(name);
      }
    },
    onClose(){
      this.show = false
    },
    //Exit the login hidden menu and clear the login information
    outLogin(){
      if(this.email){
        this.$axios.post(this.$api.post_outLogin,'','').then(res=>{
          if(res && res.returnCode === "0000"){
            this.$parent.routerViewState = true;
            this.$parent.menuState = false;
            this.$store.state.isLogin = false
            localStorage.removeItem("sign");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("userNo");
            localStorage.removeItem("userId");
            localStorage.removeItem("kycStatus");
            sessionStorage.removeItem('accessMerchantInfo')
            sessionStorage.removeItem('store')
            this.$router.push('/');
            window.location.reload()
          }
        })
      }
    },
    goProtocol(name){
      if(name === 'privacyPolicy'){
        window.location = 'https://alchemypay.org/privacy-policy/';
        return;
      }
      if(name === 'termsUse'){
        window.location = 'https://alchemypay.org/terms-of-use/';
        return;
      }
    },
    goLogin(){
      this.loading = true
      if(this.$route.path === '/emailCode' || this.$route.path === '/verifyCode'){
        this.loading = false
        this.$toast({
          duration: 3000,
          message: 'You re already logged in'
        });
      }else{
        this.loading = false
        //是否是从菜单进入
        this.$store.state.routerQueryPath = true
        this.$router.push('/emailCode')
      }
    },
    //是否有历史记录
    transationsList(){
      let _this = this;
      this.$axios.get(this.$api.get_transactionHistory,this.query).then(res=>{
        if(res.data){
          // console.log(res.data);
          let newArray = res.data.result;
          if (newArray.length <= 0 ) {
            _this.finished = true;
          }
        }
      })
    },
    //语言切换的显示隐藏
    LanguageIsShow(){
      this.$store.state.LanguageIsShow = true
    }
  },
  computed:{
    emailSlice(){
      let email = this.email
      let email1 = email.slice(0,3)+' *** '+ email.slice(email.indexOf('@'),email.length)
      return email1
    }
  },
  watch:{

    '$store.state.menuState':{
      immediate:true,
      deep:true,
       handler(newVal){
        //  console.log(newVal);
         if(newVal === true && this.$store.state.isLogin === true){
           this.transationsList()
           localStorage.getItem("token") ? this.token = true : false;
           this.token===true?this.transationsList():''
          //  console.log(this.finished);
         }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#routerMenu{
  position: relative;

  .routerMenu_line{
    display: flex;
    align-items: center;
    margin-top: 0.24rem;
    cursor: pointer;
    .lineIcon{
      display: flex;
      img{
        width: 0.36rem;
      }
    }
    .lineName{
      font-size: 0.17rem;
      font-family: "GeoRegular";
      font-weight: 500;
      color: #232323;
      margin-left: 0.08rem;
    }
    .lineRight{
      margin-left: auto;
      display: flex;
      align-items: center;
      p{
        font-size: .15rem;
        font-family: GeoLight;
        font-weight: normal;
        color: #707070;
        margin-right: .12rem;
      }
      .email{
        margin-right: 0.12rem;
        font-size: 0.14rem;
        font-family: "GeoLight", GeoLight;
        font-weight: 400;
        color: #999999;;
      }
      div{
        display: flex;
      }
      img{
        // width: 0.6rem;
        // height: ;
        height: .2rem;
      }
    }
    &:nth-of-type(1){
      margin-top: 0.2rem;
    }
  }
  .routerMenu_isLogo{
    width: 100%;
    height: 2.26rem;
    // text-align: center;
    border-radius: .12rem;
    border: 1px solid #E2E1E5;
    display: flex;
    flex-direction: column;
    align-items: center;
    >img{
      width: .5rem;
      height: .5rem;
      margin-top: .18rem;
    }
    h2{
      font-size: .21rem;
      font-family: "GeoBold";
      font-weight: normal;
      color: #232323;
      line-height: .25rem;
      margin: .2rem 0 .06rem 0;
    }
    p{
      font-size: .15rem;
      font-family: "GeoRegular";
      font-weight: normal;
      color: #232323;
    }
    >div{
      width: 90%;
      background: #0059DA;
      border-radius: .3rem;
      height: .58rem;
      font-size: .17rem;
      margin-top: .17rem;
      text-align: center;
      line-height: .58rem;
      color: #fff;
      font-family: "GeoRegular";
      position: relative;
      cursor: pointer;
      .icon{
        width: .24rem;
        height: .24rem;
        position: absolute;
        right: .16rem;
        top: .16rem;
        span{
          position: absolute;
          // top: -.13rem;
          right: .01rem;
        }
      }
    }
  }
  .routerMenu_history{
    width: 100%;
    height: .8rem;
    background: #FFFFFF;
    border-radius: 12px;
    border: 1px solid #E2E1E5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .31rem 0 .24rem;
    cursor: pointer;
    .lineName{
      margin-left: .16rem;
      flex: 1;
      p:first-child{
        font-family: GeoRegular;
        font-size: .17rem;
        font-weight: normal;
        color: #232323;
        line-height: .17rem;
      }
      p:last-child{
        font-family: GeoLight;
        font-weight: normal;
        color: #C0C0C2;
        line-height: 17px;
        font-size: .15rem;
        margin-top: .04rem;
      }
    }
    .lineIcon{
      img{
        width: .36rem;
      }
    }
    .lineRight{
      img{
        // width: .1rem;
        height: .23rem;
      }
    }

  }
  .routerMenu_loginOut{
    width: 100%;
    height: 100%;
    background: #00000080;
    position: fixed;
    left: 0;
    top: 0;
    .content{
      width: 90%;
      height: 2.6rem;
      max-width: 3.5rem;
      background: #FFFFFF;
      border-radius: 16px;
      position: absolute;
      left:50%;
      top: 50%;
      transform: translate(-50%,-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: .4rem 0 0 0;
      box-sizing: border-box;
      h2{
        width: 2.4rem;
        text-align: center;
        font-weight: normal;
        color: #232323;
        line-height: .31rem;
        font-family: GeoDemibold;
        font-size: .21rem;
      }
      div{
        width: 90%;
        height: .58rem;
        background: #E55643;
        border-radius: .29rem;
        text-align: center;
        line-height: .58rem;
        position: relative;
        font-size: .17rem;
        font-weight: normal;
        color: #FFFFFF;
        font-family: GeoRegular;
        margin-top: .05rem;
        cursor: pointer;
        img{
          width: .24rem;
          position: absolute;
          right: .16rem;
          top: .17rem;
        }
      }
      p{
        width: 90%;
        height: .56rem;
        text-align: center;
        font-weight: normal;
        color: #232323;
        font-family: GeoDemibold;
        font-size: .17rem;
        margin-top: .24rem;
        cursor: pointer;
      }
    }
  }
}
</style>
