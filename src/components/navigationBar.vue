<!-- all page navigation bar -->
<template>
  <div class="navigationBar_view" v-if="tabState">
    <!-- open menu view -->
    <div class="navigationBar_view_left" v-if="this.$parent.routerViewState">
      <div class="icon" @click="goBack"><img src="../assets/images/backIcon.png"></div>
      <div class="linkName">{{ routerName }}</div>
    </div>
    <!-- close menu view -->
    <div class="navigationBar_view_left" v-else>Menu</div>
    <div class="navigationBar_view_right">
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
        oldVal ? this.routerPath = oldVal.path : "";
      },
    }
  },
  methods: {
    goBack(){
      if(this.$route.path === '/emailCode'){
        this.$router.push('/')
        return;
      }
      if(this.$route.path === '/paymentResult'){
        this.$router.push('/');
        return;
      }
      if(this.routerPath === '/emailCode' && this.$route.path === '/receivingMode'){
        this.$router.go(-2);
        return;
      }
      if(this.routerPath === '/emailCode'){
        this.$router.back(-2);
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
  padding-bottom: 0.2rem;
  .navigationBar_view_left {
    display: flex;
    align-items: center;
    font-size: 0.2rem;
    font-family: 'Jost', sans-serif;
    font-weight: bold;
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
      width: 0.2rem;
      cursor: pointer;
    }
  }
}
</style>
