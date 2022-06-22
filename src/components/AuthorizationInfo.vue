<template>
  <div id="AuthorizationInfo">
    <div class="agreement-content">
      <div class="agreement-radio">
        <el-checkbox v-model="childData.agreement"></el-checkbox>
      </div>
      <div class="agreement-text">
        I authorise <span>AlchemyPay</span> to debit my chosen payment method
        for the amount above on today’s date and understand that this
        can not be cancelled, recalled or refunded.
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 勾选协议组件
 */
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
  margin-top: 0.18rem;
  .agreement-content{
    display: flex;
    .agreement-radio{
      display: flex;
    }
    .agreement-text{
      font-size: 0.13rem;
      font-family: "GeoLight", GeoLight;
      font-weight: normal;
      color: #333333;
      margin-left: 0.08rem;
      margin-top: 0.02rem;
      span{
        color: #0059DA;
      }
    }
  }
}

//element-ui复选框
#AuthorizationInfo ::v-deep .el-checkbox__inner:hover{
  border-color: #DFDFDF !important;
}
#AuthorizationInfo ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: #0059DA;
  border: 1px solid #0059DA;
  border-radius: 0.05rem;
}
#AuthorizationInfo ::v-deep .el-checkbox__inner{
  border: 1px solid #DFDFDF;
}
</style>
