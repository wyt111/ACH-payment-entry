<template>
  <div id="QueryOrderStatusTips">
    <div class="QueryOrderStatusTips-content">
      <div class="QueryOrderStatusTips-top">
        <p class="title">{{ $t('nav.orderTips_title') }}</p>
        <p class="tipsText">{{ $t('nav.orderTips_text1') }} {{ $store.state.buyRouterParams.cryptoCurrency }} {{ $t('nav.orderTips_text2') }}</p>
        <footer @click="closeView">
          {{ $t('nav.orderTips_buttonText') }}
          <img class="rightIcon" src="../assets/images/button-right-icon.svg" alt="">
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * 确认支付后 查询支付状态提示框
   */
  name: "QueryOrderStatusTips",
  methods:{
    closeView(){
      this.$parent.tipsState = false;
    }
  }
}
</script>

<style lang="scss" scoped>
#QueryOrderStatusTips{
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.16rem;
  .QueryOrderStatusTips-content{
    background: #FFFFFF;
    border-radius: 0.16rem;
    backdrop-filter: blur(3px);
    .QueryOrderStatusTips-top{
      padding: 0.44rem 0.16rem;
      .title{
        font-size: 0.21rem;
        font-family: "GeoDemibold", GeoDemibold;
        font-weight: normal;
        color: #232323;
        text-align: center;
      }
      .tipsText{
        font-size: 0.13rem;
        font-family: "GeoLight", GeoLight;
        font-weight: normal;
        color: #232323;
        line-height: 0.2rem;
        word-spacing: 0.02rem;
        text-align: center;
        margin-top: 0.08rem;
      }
    }
    footer{
      height: 0.58rem;
      background: #0059DA;
      border-radius: 0.29rem;
      font-size: 0.17rem;
      font-family: "GeoRegular", GeoRegular;
      font-weight: normal;
      color: #FFFFFF;
      text-align: center;
      line-height: 0.58rem;
      border-top: 1px solid #999999;
      cursor: pointer;
      margin-top: 0.16rem;
      position: relative;
      .rightIcon{
        width: 0.24rem;
        position: absolute;
        top: 0.17rem;
        right: 0.32rem;
      }
    }
  }
}

@media (max-width:791px) {
  #QueryOrderStatusTips{
    border-radius: 0;
  }
}
</style>
