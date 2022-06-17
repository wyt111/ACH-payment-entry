<template>
  <div id="homePage">
    <div class="homePage_content" v-show="searchState">
      <div class="homePage_view" v-show="!menuState">
        <div class="home-header">
          <div class="home-tab">
            <div :class="{'tabClass': tabstate==='buyCrypto'}" @click="switchTab('buyCrypto')">Buy Crypto</div>
            <div :class="{'tabClass': tabstate==='sellCrypto'}" @click="switchTab('sellCrypto')">Sell Crypto</div>
          </div>
          <div class="allPage-icon">
            <img src="@/assets/images/allPageIcon.png" @click="openMenu">
          </div>
        </div>
        <div class="home-children">
          <buyCrypto v-if="$store.state.homeTabstate === 'buyCrypto'" :allBasicData="basicData" ref="buyCrypto_ref"/>
          <sellCrypto v-else-if="$store.state.homeTabstate === 'sellCrypto'" :allBasicData="basicData" ref="sellCrypto_ref"/>
        </div>
      </div>
      <!--  menu view  -->
      <div v-show="menuState">
        <div class="navigationBar_view">
          <div class="navigationBar_view_left">Menu</div>
          <div class="navigationBar_view_right">
            <img src="@/assets/images/closeIcon.png" @click="openMenu">
          </div>
        </div>
        <routerMenu/>
      </div>
    </div>
    <!-- search Public organization -->
    <search v-if="!searchState" ref="search_ref" :viewName="viewName" :choiseItemData='choiseItem' :allBasicData="basicData" routerFrom="home"/>
  </div>
</template>

<script>
import sellCrypto from '/src/views/initialPage/childrens/sellCrypto'
import buyCrypto from '/src/views/initialPage/childrens/buyCrypto'
import search from '/src/components/search'
import routerMenu from '/src/components/routerMenu'

export default {
  name: "index",
  components: { buyCrypto, sellCrypto, search, routerMenu },
  data() {
    return {
      menuState: false,
      // tabstate:
      searchState: true,
      viewName: "",
      basicData: {},
      choiseItem: {},
    }
  },
  mounted(){
    this.queryInfo();
  },
  computed: {
    tabstate(){
      return this.$store.state.homeTabstate;
    }
  },
  methods: {
    openSearch(view,choiseItem) {
      this.searchState = false;
      this.viewName = view;
      this.choiseItem = choiseItem;
    },
    openMenu(){
      this.menuState = this.menuState === true ? false : true;
    },
    switchTab(tab){
      this.$store.state.homeTabstate = tab;
    },
    queryInfo(){
      let _this = this;
      this.$axios.get(this.$api.get_buyCryptoInfo,"").then(res=>{
        if(res && res.returnCode === "0000"){
          _this.basicData = res.data;
          localStorage.setItem("allBasicData",JSON.stringify(res.data));
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
html,body,#homePage,.homePage_view,.homePage_content{
  width: 100%;
  height: 100%;
}
.homePage_view{
  display: flex;
  flex-direction: column;
  .home-children{
    flex: 1;
    overflow: auto;
  }
  .home-header {
    display: flex;
    align-items: center;
    padding-bottom: 0.32rem;
    .home-tab{
      display: flex;
      align-items: center;
      font-size: 0.2rem;
      font-family: 'GeoDemibold', GeoDemibold;
      font-weight: bold;
      color: #CCCCCC;
      div{
        display: flex;
        cursor: pointer;
      }
      div:nth-of-type(2){
        margin-left: 0.4rem;
        cursor: pointer;
      }
      .tabClass{
        color: #232323;
      }
    }
    .allPage-icon {
      margin-left: auto;
      display: flex;
      img{
        width: 0.2rem;
        cursor: pointer;
      }
    }
  }
}

.navigationBar_view {
  display: flex;
  align-items: center;
  padding-bottom: 0.2rem;
  .navigationBar_view_left {
    display: flex;
    align-items: center;
    font-size: 0.2rem;
    font-family: 'GeoDemibold';
    font-weight: bold;
    color: #232323;
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
