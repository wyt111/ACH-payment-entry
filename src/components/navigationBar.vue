<!-- all page navigation bar -->
<template>
  <div class="navigationBar_view" v-if="tabState  &&  $route.path !== '/emailCode'">
    <!-- open menu view -->
    <div class="navigationBar_view_left" v-if="this.$parent.routerViewState">
      <!-- merchant_orderNo 地址栏存在商户订单隐藏返回按钮 -->
      <div class="icon" v-if="$store.state.goHomeState" @click="goBack"><img src="../assets/images/backIcon.png"></div>
      <div class="linkName">{{ $t(routerName) }}</div>
    </div>
    <!-- close menu view -->
    <div class="navigationBar_view_left" v-else>{{ $t('nav.menu') }}</div>
    <div class="navigationBar_view_right" v-if="$route.path !== '/Language'">
      <img src="../assets/images/allPageIcon.png" v-if="this.$parent.routerViewState" @click="openMenu">
      <img src="../assets/images/closeIcon.png" v-else @click="openMenu">
    </div>
  </div>
</template>

<script>
/**
 * tabState - Used to hide the menu bar of other routing pages except the home page  eg:'/receivingMode' Using search components
 */
export default {
  name: "navigationBar",
  data() {
    return {
      routerName: "",
      tabState: true,
      routerPath: '',
    };
  },
  watch: {
    $route:{
      immediate: true,
      handler: function(val,oldVal){
        if(val.meta.title === 'Home') {
          this.tabState = false;
        } else {
          this.tabState = true;
          this.routerName = val.meta.title;
        }
        // console.log(val);
        oldVal ? this.routerPath = oldVal.path : "";
        // console.log(this.routerPath);
      },
    }
  },
  methods: {
    goBack(){
      // if(this.$route.path === '/emailCode'){
      //   this.$router.push('/')
      //   return;
      // }
      //add sellOrder page back home
      if(this.$route.path === '/paymentResult'|| this.$route.path === '/sellOrder' ){
        this.$router.push('/');
        return;
      }
      if(this.routerPath === '/verifyCode' &&  this.$route.path === '/sell-formUserInfo'){
        this.$router.push('/');
        return;
      }
       if(this.routerPath === '/verifyCode' &&  this.$route.path === '/receivingMode'){
        this.$router.push('/');
        return;
      }
      if(this.routerPath === '/verifyCode' && this.$route.path === '/receivingMode'){
        this.$router.push('/');
        return;
      }
      if(this.routerPath === '/verifyCode' && this.$route.path === '/configSell'){
        this.$router.push('/');
        return;
      }

      if(this.routerPath === '/emailCode' || this.routerPath === '/verifyCode'){
        this.$router.go(-1)
        return;
      }
      if(this.$route.path === '/creditCardForm-cardInfo' && this.routerPath === '/basisIdAuth'){
        this.$router.go(-6);
        return;
      }
      if(this.$route.path === '/creditCardConfig' && this.routerPath === '/creditCardForm-cardInfo'){
        this.$router.go(-2);
        return;
      }
      // if(this.$route.path === '/creditCardConfig' && this.routerPath === '/basisIdAuth'){
      //   this.$router.go(-2);
      //   return;
      // }

      //卖币
      if(this.$route.path === '/configSell' && this.routerPath === '/sell-formUserInfo'){
        // console.log("111")
        this.$router.push('/');
        return;
      }

      if(this.$route.path === '/sellOrder' && this.routerPath === '/sell-formUserInfo'){
        this.$router.go(-4);
        return;
      }
      if(this.$route.path === '/configSell' && this.routerPath === '/'){
        this.$router.push('/');
        return;
      }


      this.$router.go(-1);
    },
    openMenu(){
      this.$parent.routerViewState === true ? this.$parent.routerViewState = false : this.$parent.routerViewState = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.navigationBar_view {
  display: flex;
  align-items: center;
  padding-bottom: 0.08rem;
  .navigationBar_view_left {
    display: flex;
    align-items: center;

    font-size: 0.21rem;
    font-family: "GeoDemibold", GeoDemibold;
    font-weight: normal;
    color: #232323;
    .icon {
      cursor: pointer;
      display: flex;
      img {
        width: 0.16rem;
      }
    }
    .linkName {
      margin-left: 0.15rem;
      display: flex;
    }
  }
  .navigationBar_view_right {
    display: flex;
    margin-left: auto;
    img {
      width: 0.24rem;
      cursor: pointer;
    }
  }
}
</style>
