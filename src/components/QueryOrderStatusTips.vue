<template>
  <div id="QueryOrderStatusTips">
    <div class="QueryOrderStatusTips-content">
      <div class="QueryOrderStatusTips-top">
        <p class="title">Payment not funt</p>
        <p class="tipsText">
          Sorry, we did not detect your payment information. If you
          confirm the payment, please stay on this page for a few
          minutes, once we receive your payment, we will transfer
          the corresponding amount of USDT to you.
        </p>
      </div>
      <footer @click="closeView">I Understand</footer>
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.3rem;
  .QueryOrderStatusTips-content{
    background: #FFFFFF;
    border-radius: 0.1rem;
    backdrop-filter: blur(3px);
    .QueryOrderStatusTips-top{
      padding: 0.17rem;
      .title{
        font-size: 0.22rem;
        font-weight: 500;
        color: #232323;
        text-align: center;
      }
      .tipsText{
        font-size: 0.13rem;
        font-weight: 400;
        color: #232323;
        text-align: center;
        margin-top: 0.15rem;
      }
    }
    footer{
      font-size: 0.16rem;
      font-weight: 500;
      color: #4479D9;
      text-align: center;
      padding: 0.2rem 0;
      border-top: 1px solid #999999;
      cursor: pointer;
    }
  }
}

@media (max-width:791px) {
  #QueryOrderStatusTips{
    border-radius: 0;
  }
}
</style>
