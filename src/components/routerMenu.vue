<template>
  <div id="routerMenu">
    <div class="router_nav" v-if="$route.path==='/sellOrder'">
      <div class="navigationBar_view_left" >{{ $t('nav.menu') }}</div>
      <div class="navigationBar_view_right" >
        <img class="closeIcon" src="../assets/images/closeIcon.png" @click="$parent.routerViewState=true">
      </div>
    </div>
    <div class="routerMenu_isLogo" v-if="token===false">
        <img src="../assets/images/slices/pay.png" alt="">
        <h2>{{ $t('nav.RouterMenu_Welcome') }}</h2>
        <p>{{ $t('nav.RouterMenu_experience') }}</p>
        <div @click="goLogin" :style="{background:loading?'#0059DA80':''}">{{ $t('nav.login') }} <img class="icon" src="../assets/images/rightIconSell.png" alt="" v-if="!loading">
        <van-loading  class="icon" type="spinner" color="#fff" v-else/></div>
    </div>
    <div class="routerMenu_history" @click="goView('/tradeHistory')" v-else >
      <div class="lineIcon"><img src="../assets/images/slices/histry.png"></div>
      <div class="lineName">
        <p>{{ $t('nav.menu_transactions') }}</p>
        <p><span v-if="finished">{{ $t('nav.RouterMenu_history') }}</span></p>
      </div>
      <div class="lineRight">
        <div><img src="../assets/images/slices/right_icon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" style="margin-top:.32rem" @click="LanguageIsShow">
      <div class="lineIcon"><img src="../assets/images/slices/iconLang.png"></div>
      <div class="lineName">{{ $t('nav.menu_language') }}</div>

      <div class="lineRight">
        <p>{{ languageName() }}</p>
        <div><img src="../assets/images/slices/right_icon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="goProtocol('termsUse')">
      <div class="lineIcon"><img src="../assets/images/slices/terms.png"></div>
      <div class="lineName">{{ $t('nav.code_name') }}</div>
      <div class="lineRight">
        <div><img src="../assets/images/slices/right_icon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="goProtocol('privacyPolicy')">
      <div class="lineIcon"><img src="../assets/images/slices/privacy.png"></div>
      <div class="lineName">{{ $t('nav.menu_privacy') }}</div>
      <div class="lineRight">
        <div><img src="../assets/images/slices/right_icon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="loginOutIsShow" v-if="email !== ''">
      <div class="lineIcon"><img src="../assets/images/slices/logOut.png"></div>
      <div class="lineName">{{ $t('nav.menu_logOut') }}</div>
      <div class="lineRight">
        <div class="email">{{ emailSlice }}</div>
        <div><img src="../assets/images/slices/right_icon.png"></div>
      </div>
    </div>
    <div class="routerMenu_loginOut" v-show="show" @click="show=false">
      <div class="content" ref="loginOutView" @click.stop="show=true">
        <h2>{{ $t('nav.loginOut_title') }}</h2>
       <div>
          <div @click.stop="outLogin">{{ $t('nav.loginOut') }} </div>
          <p @click.stop="show=false">{{ $t('nav.loginOut_Dismiss') }}</p>
       </div>
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
        orderState: 1,
        orderType: 1,
        pageIndex: 1,
        pageSize: 5,
        historyList:[],
        
      },
     
      finished:false,
      newVal:'',
      
    }
  },
  activated(){
    localStorage.getItem("token") ? this.token = true : this.token =false;
    localStorage.getItem("email") ? this.email = AES_Decrypt(localStorage.getItem("email")) :this.email = '';
 
    
    // this.transationsList()
  },
  deactivated(){
     localStorage.getItem("token") ? this.token = true :this.token = false;
    localStorage.getItem("email") ? this.email = AES_Decrypt(localStorage.getItem("email")) :this.email = '';
  },
  // mounted(){
  //   localStorage.getItem("token") ? this.token = true : false;
  //   localStorage.getItem("email") ? this.email = AES_Decrypt(localStorage.getItem("email")) : '';
  // },
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
    //语言栏显示切换语言
     languageName(){
      let language = sessionStorage.getItem('language')?sessionStorage.getItem('language'):'en-US'
      let LanguageName = ''
      for(let item of Object.keys(this.$i18n.messages)){
            if(item === language){
              // console.log(this.$i18n.messages[item].language);
              LanguageName = this.$i18n.messages[item].language
            }
          }
          return LanguageName
    },
    //Exit the login hidden menu and clear the login information
    outLogin(){
      
      if(this.email){
        this.$axios.post(this.$api.post_outLogin,'','').then(res=>{
          if(res && res.returnCode === "0000"){
            localStorage.removeItem("sign");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("userNo");
            localStorage.removeItem("userId");
            localStorage.removeItem("kycStatus");
            // sessionStorage.removeItem('accessMerchantInfo')
            sessionStorage.removeItem('store')
            this.show = false
            if(this.$route.path !== '/'){
              this.$parent.routerViewState = true
              setTimeout(()=>{
                this.$parent.routerViewState = false
             
              },200)
              this.$router.replace('/')
            return
            }else{
                this.token = false
                this.email = ''
            }
             
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
          message: this.$t('nav.login_Youlogged')
        });
      }else{
        this.loading = false
        //是否是从菜单进入
        this.$store.state.routerQueryPath = true
        this.$parent.routerViewState = true;
        this.$router.push('/emailCode')
      }
    },
    //显示退出登陆判断是否是pc 还是 移动
    loginOutIsShow(){
      let winWidth = document.body.clientWidth || document.documentElement.clientWidth
      if(winWidth < 791){
        this.$refs.loginOutView.style = 'top:10%;tannsfrom:translate(-50%,-10%)'
      }else{
        this.$refs.loginOutView.style = 'left:50%;top:30%;tannsfrom:translate(-50%,-30%)'
      }
      this.show = true
      
    },
    //是否有历史记录
    transationsList(){
      let _this = this;
      this.$axios.get(this.$api.get_transactionHistory,this.query).then(res=>{
        if(res && res.data){
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
    },
   
  
  },
  watch:{
    //打开菜单栏并且已经登陆以后才会获取有没有历史记录
    '$store.state.menuState':{
      immediate:true,
      deep:true,
       handler(newVal){
        if(newVal  === true){
          localStorage.getItem("token") ? this.token = true :this.token = false;
          localStorage.getItem("email") ? this.email = AES_Decrypt(localStorage.getItem("email")) :this.email = '';
       
        }
         if(newVal === true && localStorage.getItem("token")){

           this.token===true?this.transationsList():''
          //  console.log(this.finished);
         }
      }
    },
    
  }
}
</script>

<style lang="scss" scoped>
#routerMenu{
  position: relative;
.router_nav{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .05rem 0 .15rem;
  font-size: 0.21rem;
    font-family: "GeoDemibold", GeoDemibold;
    font-weight: normal;
    color: #232323;
  img{
    width: .2rem;
    cursor: pointer;
  }
}
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
      color: #949EA4;
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
        color: #C2C2C2;
        margin-right: .12rem;
      }
      .email{
        margin-right: 0.12rem;
        font-size: 0.14rem;
        font-family: "GeoLight", GeoLight;
        font-weight: 400;
        color: #C2C2C2;
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
      font-size: .2rem;
      font-family: "GeoLight";
      font-weight: normal;
      color: #063376;
      line-height: .25rem;
      font-weight: 500;
      margin: .2rem 0 .06rem 0;
    }
    p{
      font-size: .13rem;
      font-family: "GeoRegular";
      font-weight: normal;
      color: #949EA4;
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
        width: .13rem;
        // height: .1rem;
        margin-left: .05rem;
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
    margin-top: .3rem;
    .lineName{
      
      margin-left: .16rem;
      flex: 1;
      p:first-child{
        font-family: GeoRegular;
        font-size: .17rem;
        font-weight: normal;
        color: #063376;
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
     
      max-width: 3.5rem;
      background: #FFFFFF;
      border-radius: 16px;
      position: absolute;
      left:50%;
      top: 30%;
      transform: translate(-50%,30%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: .32rem .16rem .32rem;
      box-sizing: border-box;
      
      h2{
        text-align: center;
        font-style: normal;
        font-weight: 400;
        color: #949EA4;;
        line-height: .31rem;
        font-size: .16rem;
      }
      >div{
        width: 3.3rem;
        height: .6rem;
        display: flex;
        margin-top: .2rem;
        justify-content: center;
        align-items: center;
        div{
          width: 1.5rem;
          height: .5rem;
          background: #E55643;
          border-radius: .29rem;
          text-align: center;
          line-height: .49rem;
          font-size: .16rem;
          font-weight: normal;
          color: #FFFFFF;
          font-family: GeoRegular;
          margin-top: .05rem;
          margin-right: .13rem;
          cursor: pointer;
        }
        p{
           width: 1.5rem;
          height: .5rem;
          text-align: center;
          font-weight: normal;
          color: #063376;
          font-family: GeoDemibold;
          font-size: .16rem;
          line-height: .49rem;
          border: 1px solid #EEEEEE;
          border-radius: .25rem;
          cursor: pointer;
        }
      }
    }
   
  }
}
</style>
