<template>
  <div id="App">
    <tab />
    <router-view class="routerView" v-if="routerViewState"/>
    <routerMenu class="routerView" v-else />
  </div>
</template>

<script>
import tab from "./components/navigationBar";
import routerMenu from "./components/routerMenu";

export default {
  name: "index",
  components: { tab, routerMenu },
  data(){
    return{
      routerViewState: true,
    }
  },
};
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
html,body,#App,#app{
  width: 100%;
  height: 100%;
}
#App {
  -ms-overflow-style: none; /* IE 10+ */
  display: flex;
  flex-direction: column;
  .routerView{
    flex: 1;
    overflow: auto;
  }
}
</style>
