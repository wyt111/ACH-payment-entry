<template>
  <div id="viewBox" ref="viewApp">
    <div class="buyCrypto_iframe_view" :class="{'buyCrypto_iframe_view_pc': logoState===true}"  >
        <div id="App" >
          <!-- 导航栏 -->
          <tab ref="viewTab"/>
          <!-- 页面内容 -->
          <div class="routerView_box" v-show="routerViewState">
            <div class="routerView" v-show="keepAlive">
              <keep-alive class="keepAlive">
                <router-view/>
              </keep-alive>
            </div>
            <div class="routerView" v-if="!keepAlive"><router-view class="noKeepAlive"/></div>
          </div>
          <!-- 菜单栏 -->
          <routerMenu v-if="!routerViewState" />
          <!-- 语言切换 -->
          <Language v-if="LanguageShow"/>
          <!-- 确认支付后查询支付状态提示框 -->
          <QueryOrderStatusTips v-if="tipsState"/>
        </div>
      <!-- pc端展示logo -->
      <div class="logoView" v-if="logoState">
        <div>Powered By</div>
        <div><img src="./assets/images/pcLogo.png"></div>
      </div>
      <!-- 版本号 -->
<!--      <span class="version">V: {{ version }}</span>-->
    </div>
  </div>
</template>

<script>
import tab from "./components/navigationBar";
import routerMenu from "./components/routerMenu";
import QueryOrderStatusTips from "./components/QueryOrderStatusTips";
import Language from './components/Language.vue'
import common from "./utils/common";
import remSize from './utils/remSize';

export default {
  name: 'App',
  components: { tab, routerMenu, QueryOrderStatusTips ,Language},
  data(){
    return{
      routerViewState: true,
      logoState: true,
      tipsState: false,
      version: '',
      LanguageShow:true
    }
  },
  computed:{
    //赋值路由是否需要缓存状态
    keepAlive(){
      return this.$route.meta.keepAlive;
    },
  },
  watch:{
    '$store.state.LanguageIsShow':{
      immediate:true,
      handler(newVal){
        this.LanguageShow = newVal
      },
      deep:true
    },
    routerViewState(newVal){
      this.$store.state.menuState = !newVal
    }
  },
  mounted(){
    this.obtainWidth();
    let innerHight = document.documentElement.clientHeight || document.body.clientHeight;
    let innerWidth = document.documentElement.clientWidth || document.body.clientWidth
      window.addEventListener('resize',()=>{
        if(innerWidth < 791)
        this.$refs.viewApp.style.height = (innerHight ) + 'px'
        else
        return false
      })
    //Vuex store data
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    }
    //pagehide防止移动端beforeunload不能触发
    window.addEventListener('pagehide', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
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
          remSize();
          this.logoState = false;
          this.$store.state.isPcAndPhone = 'phone'
          return;
        }
        common.uiSize = width + 100;
        common.equipmentEnd = 'pc';
        remSize();
        this.logoState = true;
        this.$store.state.isPcAndPhone = 'pc'
      })
    },
  },
}
</script>

<style lang="scss">
//@font-face {
//  font-family: "GeoDemibold";
//  src: url('https://static.alchemypay.org/alchemypay/crypto-images/Fieldwork13-SemiBoldGeo.otf');
//  font-weight: normal;
//  font-style: normal;
//}
//@font-face {
//  font-family: "GeoBold";
//  src: url('https://static.alchemypay.org/alchemypay/crypto-images/Fieldwork16-GeoBold.otf');
//  font-weight: normal;
//  font-style: normal;
//}
//@font-face {
//  font-family: "GeoLight";
//  src: url('https://static.alchemypay.org/alchemypay/crypto-images/Fieldwork7-GeoLight.otf');
//  font-weight: normal;
//  font-style: normal;
//}
//@font-face {
//  font-family: "GeoRegular";
//  src: url('https://static.alchemypay.org/alchemypay/crypto-images/Fieldwork10-GeoRegular.otf');
//  font-weight: normal;
//  font-style: normal;
//}
@font-face {
  font-family: "GeoDemibold";
  src: url('./assets/fonts/Fieldwork/Fieldwork13-SemiBoldGeo.otf');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: "GeoBold";
  src: url('./assets/fonts/Fieldwork/Fieldwork16-GeoBold.otf');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: "GeoLight";
  src: url('./assets/fonts/Fieldwork/Fieldwork7-GeoLight.otf');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: "GeoRegular";
  src: url('./assets/fonts/Fieldwork/Fieldwork10-GeoRegular.otf');
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
  touch-action: pan-y;
}

html,body,#app,#viewBox{
  width: 100%;
  height: 100%;
  font-size: 0.16rem;
  overflow: hidden;
}

#viewBox{
  display: flex;
  justify-content: center;
  align-items: center;
}
.buyCrypto_iframe_view_pc{
  padding: 0.40rem 0.30rem 0.40rem 0.30rem !important;
}
.buyCrypto_iframe_view{
  width: 375px;
  height: 580px;
  background: #FFFFFF;
  border-radius: 0.25rem;
  position: relative;
  padding: 0.26rem 0.22rem;
  display: flex;
  justify-content: center;
  margin-top: -0.6rem;
  box-shadow: 0 0 0.4rem 0 rgba(68, 121, 217, 0.3);
  overflow: hidden;
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
  .routerView_box{
    flex: 1;
    overflow: auto;
  }
  .routerView{
    height: 100%;
    .noKeepAlive,.KeepAlive{
      height: 100%;
    }
    &>div{
      height: 100%;
    }
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
