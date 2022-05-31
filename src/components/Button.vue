<template>
  <button class="button" :disabled="disabled" @click="submit">
    <slot v-if="buttonData.customName"/>
    <div v-else>{{ buttonName }}</div>
    <i v-if="buttonData.loading" class="el-icon-loading"></i>
  </button>
</template>

<script>
/**
 * 确认按钮组件
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
  },
  data(){
    return{
      buttonName: 'Confirm Payment', //I have completed the payment
    }
  },
  watch:{
    'buttonData': {
      deep: true,
      immediate: true,
      handler(val){
        if(val.loading === true && val.customName && val.customName === false){
          this.buttonName = 'I have completed the payment';
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
          this.buttonName = 'I have completed the payment';
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 0.56rem;
  background: #4479D9;
  border-radius: 4px;
  font-size: 0.17rem;
  font-family: 'Jost', sans-serif;
  color: #FAFAFA;
  border: none;
  cursor: pointer;
  //margin-bottom: 0.15rem;
  margin-top: 0.15rem;
  i{
    font-size: 0.24rem;
    position: absolute;
    right: 0.35rem;
  }
}
.button[disabled] {
  background: rgba(68, 121, 217, 0.5) !important;
}
</style>
