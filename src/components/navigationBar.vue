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
export default {
  name: "navigationBar",
  data() {
    return {
      routerName: "",
      tabState: true,
    };
  },
  watch: {
    $route:{
      immediate: true,
      handler: function(val){
        if(val.name === 'Home') {
          this.tabState = false;
        } else {
          this.tabState = true;
          this.routerName = val.name;
        }
      },
    }
  },
  methods: {
    goBack(){
      this.$router.go(-1)
    },
    openMenu(){
      if(this.$parent.routerViewState === true){
        this.$parent.routerViewState = false;
      }else{
        this.$parent.routerViewState = true;
      }
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
    font-family: Jost-Bold, Jost;
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
