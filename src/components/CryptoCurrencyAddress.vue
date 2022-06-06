<template>
  <div class="addressForm"> <!--  v-if="routerParams.receiveMethods === 'address'"  -->
    <div class="formLine">
      <div class="formTitle" >{{ routerParams.networkDefault }} Address</div>
      <div class="formContent" :data-clipboard-text="routerParams.addressDefault" @click="copy">
        <p>{{ routerParams.addressDefault ? routerParams.addressDefault.substring(0,10) + "……"  + routerParams.addressDefault.substring(routerParams.addressDefault.length-10,routerParams.addressDefault.length) : '' }}</p>
        <p><img src="../assets/images/copyIcon.png"></p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 接收币名称和网络地址的模块
 */

import Clipboard from "clipboard";
export default {
  name: "CryptoCurrencyAddress",
  data(){
    return{
      routerParams: {},
    }
  },
  mounted(){
    this.routerParams = JSON.parse(this.$route.query.routerParams);
  },
  methods:{
    copy(){
      //copy bank code
      let clipboard = new Clipboard('.formContent');
      clipboard.on('success', () => {
        this.$toast('copy success');
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        clipboard.destroy()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.formLine {
  margin-top: 0.2rem;
  .formTitle {
    font-size: 0.14rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #232323;
    display: flex;
    align-items: flex-end;
  }
  .formContent{
    display: flex;
    align-items: center;
    padding: 0 0.2rem;
    margin-top: 0.1rem;
    font-size: 0.16rem;
    font-weight: 500;
    color: #232323;
    height: 0.6rem;
    background: #F3F4F5;
    border-radius: 0.1rem;
    cursor: pointer;
    p:last-child{
      margin-left: auto;
      display: flex;
      align-items: center;
      img{
        width: 0.14rem;
      }
    }
  }
}
</style>
