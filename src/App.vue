<template>
  <div id="viewBox">
    <div class="buyCrypto_iframe_view">
        <div id="App">
          <!-- logo view for phone -->
          <div class="logoView_phone" v-if="!logoState"><img src="./assets/images/phoneLogo.svg"></div>
          <tab ref="viewTab"/>
          <keep-alive>
            <router-view class="routerView" v-show="routerViewState"/>
          </keep-alive>
          <routerMenu class="routerView" v-if="!routerViewState" />
          <!-- 确认支付后查询支付状态提示框 -->
          <QueryOrderStatusTips v-if="tipsState"/>
        </div>
      <div class="logoView" v-if="logoState">
        <div>Powered By</div>
        <div><img src="./assets/images/pcLogo.png"></div>
      </div>
      <!-- 版本号 -->
      <span class="version">V: {{ version }}</span>
    </div>
  </div>
</template>

<script>
import tab from "./components/navigationBar";
import routerMenu from "./components/routerMenu";
import QueryOrderStatusTips from "./components/QueryOrderStatusTips";
import common from "./utils/common";
import rem_size from  './utils/rem_size';

export default {
  name: 'App',
  components: { tab, routerMenu, QueryOrderStatusTips },
  data(){
    return{
      routerViewState: true,
      logoState: true,
      tipsState: false,
      version: '',
    }
  },
  mounted(){
    this.obtainWidth();
    //Vuex store data
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    }
    window.addEventListener("beforeunload",()=>{
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })
  },
  methods: {
    //动态获取屏幕大小计算rem
    obtainWidth(){
      this.version = common.version;
      this.changeRem(document.body.clientWidth);
      window.onresize = () => {
        return (() => {
          this.changeRem(document.body.clientWidth);
        })()
      }
    },
    changeRem(width){
      setTimeout(()=>{
        if(width < 791){ //991
          common.uiSize = 375;
          common.equipmentEnd = 'phone';
          rem_size();
          this.logoState = false;
          return;
        }
        common.uiSize = width + 100;
        common.equipmentEnd = 'pc';
        rem_size();
        this.logoState = true;
      })
    },
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: "Jost-Bold";
  src: url('./assets/fonts/Jost-Medium.ttf');
  font-weight: normal;
  font-style: normal;
}
input[type='number'] {
  -moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
a,img,button,input,textarea,span,div {
  -webkit-tap-highlight-color:transparent;
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
  width: 0 !important;
}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,body,#app,#viewBox{
  width: 100%;
  height: 100%;
}

#viewBox{
  background: url(./assets/images/buyCrypto_background.png) no-repeat !important;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Jost', sans-serif;
}
.buyCrypto_iframe_view{
  width: 400px;
  height: 600px;
  background: #FFFFFF;
  border-radius: 25px;
  position: relative;
  padding: 15px;
  display: flex;
  justify-content: center;
  margin-top: -0.6rem;
  .logoView{
    position: absolute;
    bottom: -0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.16rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #FFFFFF;
    img{
      width: 1.4rem;
      margin-left: 0.26rem;
    }
  }
  .logoView_phone{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 15px;
    img{
      width: 1.3rem;
    }
  }
  .version{
    font-size: 0.1rem;
    text-align: center;
    position: absolute;
    bottom: 0;
  }
}
@media (max-width:791px) {
  .buyCrypto_iframe_view{
    width: 100%;
    height: 100%;
    border-radius: 0;
    margin-top: 0;
  }
}

#App {
  -ms-overflow-style: none; /* IE 10+ */
  width: 100%;
  display: flex;
  flex-direction: column;

  .routerView{
    flex: 1;
    overflow: auto;
  }
}
.van-overlay{
  border-radius: 0.1rem;
}

.van-toast{
  font-size: 0.16rem !important;
  line-height: 0.2rem !important;
  padding: 0.08rem 0.12rem !important;
  border-radius: 0.08rem !important;
}

.el-popover{
  font-size: 0.14rem !important;
  font-family: 'Jost', sans-serif !important;
  font-weight: 400 !important;
  color: #FFFFFF !important;
  width: 1.95rem !important;
  height: 0.33rem !important;
  text-align: center !important;
  line-height: 0.33rem !important;
  background: #333333 !important;
  border-radius: 6px;
  margin-bottom: 0.1rem !important;
  padding: 0 !important;
  border: none !important;
}
.popper__arrow::after{
  margin-left: -1px !important;
  border-top-color: #333333 !important;
}
</style>
