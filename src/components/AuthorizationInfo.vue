<template>
  <div id="AuthorizationInfo">
    <div class="agreement-content">
      <div class="agreement-radio"><input type="checkbox" v-model="childData.agreement"></div>
      <div class="agreement-text">
        I authorise <span>AlchemyPay</span> to debit my chosen payment method
        for the amount above on today’s date and understand that this
        can not be cancelled, recalled or refunded.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthorizationInfo",
  props: {
    childData: {
      type: Object,
      default: null
    }
  },
}
</script>

<style lang="scss" scoped>
#AuthorizationInfo{
  .agreement-content{
    display: flex;
    margin-top: 0.2rem;
    padding-bottom: 0.4rem;
    .agreement-radio{
      display: flex;
      margin-top: 0.05rem;
      input{
        cursor: pointer;
        width: 0.15rem;
        height: 0.15rem;
      }
    }
    .agreement-text{
      font-size: 0.14rem;
      font-family: "Jost", sans-serif;
      font-weight: 400;
      color: #333333;
      margin-left: 0.2rem;
      span{
        color: #4479D9;
      }
    }
  }
}
</style>
