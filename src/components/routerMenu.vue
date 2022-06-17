<template>
  <div id="routerMenu">
    <div class="routerMenu_line" @click="goView('/','buyCrypto')">
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
    </div>
    <div class="routerMenu_line" @click="goView('/tradeHistory')">
      <div class="lineIcon"><img src="../assets/images/menu/icon3.png"></div>
      <div class="lineName">Trade History</div>
      <div class="lineRight">
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="goProtocol('termsUse')">
      <div class="lineIcon"><img src="../assets/images/menu/icon4.png"></div>
      <div class="lineName">Terms of Use</div>
      <div class="lineRight">
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="goProtocol('privacyPolicy')">
      <div class="lineIcon"><img src="../assets/images/menu/icon5.png"></div>
      <div class="lineName">Privacy Policy</div>
      <div class="lineRight">
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="outLogin" v-if="email !== ''">
      <div class="lineIcon"><img src="../assets/images/menu/icon6.png"></div>
      <div class="lineName">Log Out</div>
      <div class="lineRight">
        <div class="email">{{ email }}</div>
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {AES_Decrypt} from "../utils/encryp";

export default {
  name: "routerMenu",
  data(){
    return{
      email: '',
    }
  },
  mounted(){
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

      if(!localStorage.getItem("token")){
        this.$store.state.emailFromPath = this.$parent.tabstate;
        this.$router.push('/emailCode?fromName=tradeList').catch(()=>{});
      }else{
        this.$router.push(name);
      }
    },

    //Exit the login hidden menu and clear the login information
    outLogin(){
      if(this.email){
        this.$axios.post(this.$api.post_outLogin,'','').then(res=>{
          if(res && res.returnCode === "0000"){
            this.$parent.routerViewState = true;
            this.$parent.menuState = false;
            localStorage.removeItem("sign");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("userNo");
            localStorage.removeItem("userId");
            localStorage.removeItem("kycStatus");
            this.$router.push('/');
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
    }
  }
}
</script>

<style lang="scss" scoped>
#routerMenu{
  .routerMenu_line{
    display: flex;
    align-items: center;
    margin-top: 0.3rem;
    cursor: pointer;
    .lineIcon{
      display: flex;
      img{
        width: 0.25rem;
      }
    }
    .lineName{
      font-size: 0.16rem;
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      color: #232323;
      margin-left: 0.2rem;
    }
    .lineRight{
      margin-left: auto;
      display: flex;
      align-items: center;
      .email{
        margin-right: 0.3rem;
        font-size: 0.14rem;
        font-family: "GeoDemibold", GeoDemibold;
        font-weight: 400;
        color: #999999;;
      }
      div{
        display: flex;
      }
      img{
        width: 0.12rem;
      }
    }
    &:nth-of-type(1){
      margin-top: 0.2rem;
    }
  }
}
</style>
