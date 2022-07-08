<template>
  <div class="addressForm"> <!--  v-if="routerParams.receiveMethods === 'address'"  -->
    <div class="formLine">
      <div class="formTitle" >{{ routerParams.networkDefault }} {{ $t('nav.networkAddress_components_title') }}</div>
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
    this.routerParams = this.$store.state.buyRouterParams;
  },
  activated(){
    this.routerParams = this.$store.state.buyRouterParams;
  },
  methods:{
    copy(){
      //copy bank code
      let clipboard = new Clipboard('.formContent');
      clipboard.on('success', () => {
        this.$toast({
          duration: 3000,
          message: this.$t('nav.copyTips')
        });
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
  margin-top: 0.32rem;
  .formTitle {
    font-size: 0.13rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
    color: #707070;
    display: flex;
    align-items: flex-end;
  }
  .formContent{
    display: flex;
    align-items: center;
    padding: 0 0.16rem;
    margin-top: 0.08rem;
    font-size: 0.16rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
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
