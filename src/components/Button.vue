<template>
  <button class="button" :disabled="disabled" @click="submit" :class="{'loadingDisabled': this.buttonData.triggerNum >= 1 && loadingDisabled}">
    <slot v-if="buttonData.customName"/>
    <div v-else>{{ $t(buttonName) }}</div>
    <i v-if="buttonData.loading" class="el-icon-loading loadingIcon"></i>
    <img v-else class="rightIcon" src="../assets/images/button-right-icon.svg" alt="">
  </button>
</template>

<script>
/**
 * 确认订单按钮组件 可查询订单状态
 * buttonData.agreement === 1 支付
 * buttonData.agreement >1 查询支付状态
 * buttonData.customName 自定义按钮名称状态
 * @returns {Promise<void>}
 */
export default {
  name: "Button",
  props: {
    buttonData: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: null
    },
    loadingDisabled: {
      type: Boolean,
      default: null
    },
  },
  data(){
    return{
      buttonName: "nav.ConfirmPayment", // Confirm Payment ｜ I have completed the payment
    }
  },
  watch:{
    'buttonData': {
      deep: true,
      immediate: true,
      handler(val){
        if(val.loading === true && val.customName && val.customName === false){
          this.buttonName = this.$t('nav.queryOderState');
        }
      }
    }
  },
  methods: {
    submit(){
      this.buttonData.triggerNum += 1;
      if(this.buttonData.triggerNum === 1){
        this.buttonData.loading = true;
        if(this.buttonData.customName === false){
          this.buttonName = "nav.queryOderState";
        }
        return;
      }
      if(this.buttonData.triggerNum > 1 && this.buttonData.customName === false){
        this.$parent.$parent.tipsState = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.button{
  width: 100%;
  height: 0.58rem;
  background: #0059DA;
  border-radius: 0.29rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.17rem;
  font-family: "GeoRegular", GeoRegular;
  font-weight: normal;
  color: #FFFFFF;
  margin-top: 0.26rem;
  cursor: pointer;
  border: none;
  position: relative;
  .rightIcon{
    width: 0.24rem;
    position: absolute;
    top: 0.17rem;
    right: 0.32rem;
  }
  .loadingIcon{
    font-size: 0.24rem;
    position: absolute;
    right: 0.22rem;
  }
}
.button[disabled] {
  background: rgba(0, 89, 218, 0.5);
  cursor: no-drop;
}
.loadingDisabled{
  cursor: no-drop !important;
  background: rgba(0, 89, 218, 0.5) !important;
}

.continue{
}
.continue:disabled{
  background: rgba(0, 89, 218, 0.5);
  cursor: no-drop;
}
</style>
