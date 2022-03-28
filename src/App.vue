<template>
  <div id="App">
    <tab ref="viewTab"/>
    <router-view class="routerView" v-if="routerViewState"/>
    <routerMenu class="routerView" v-else />
  </div>
</template>

<script>
import tab from "./components/navigationBar";
import routerMenu from "./components/routerMenu";

export default {
  name: 'App',
  components: { tab, routerMenu },
  data(){
    return{
      routerViewState: true,
    }
  },
  mounted(){
    this.$store.state.routerParams.a = '1'
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
html,body,#app,#App{
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
#App {
  -ms-overflow-style: none; /* IE 10+ */
  display: flex;
  flex-direction: column;
  //padding: 0.2rem;
  .routerView{
    flex: 1;
    overflow: auto;
  }
}
.van-overlay{
  border-radius: 0.1rem;
}
</style>
