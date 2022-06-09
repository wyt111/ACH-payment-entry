<template>
  <!-- Payment information -->
  <div class="paymentInformation">
    <div class="paymentInformation-line" v-if="titleStatus !== false">
      <div class="line_name detailsName">{{ payCommission.symbol }}{{ routerParams.amount }} is all you pay</div>
      <div class="line_number details" @click="expandCollapse">Details</div>
    </div>
    <div v-if="detailsState">
      <div class="paymentInformation-line">
        <div class="line_name">Remaining time</div>
        <div class="line_number remainingTime">
          <div><img class="loadingIcon" src="../assets/images/countDownIcon.svg"></div>
          <div>{{ timeDownNumber }}S</div>
        </div>
      </div>
      <div class="paymentInformation-line">
        <div class="line_name">{{ routerParams.name }} price</div>
        <div class="line_number">{{ payCommission.symbol }} {{ (feeInfo.price * routerParams.exchangeRate).toFixed(payCommission.decimalDigits) }}</div>
      </div>
      <div class="paymentInformation-line" v-show="feeState">
        <div class="line_name">
          Ramp fee
          <el-popover
              placement="top"
              :trigger="triggerType"
              :offset="-18"
              content="Based on payment method">
            <div slot="reference"><img class="tipsIcon" src="../assets/images/exclamatoryMarkIcon.png"></div>
          </el-popover>
        </div>
        <div class="line_number"><span class="minText">as low as</span>{{ payCommission.symbol }} {{ payCommission.rampFee }}</div>
      </div>
      <div class="paymentInformation-line" v-show="feeState">
        <div class="line_name">Network fee</div>
        <div class="line_number">{{ payCommission.symbol }} {{ (feeInfo.networkFee * routerParams.exchangeRate).toFixed(payCommission.decimalDigits) }}</div>
      </div>
      <div class="feeViewBtn" @click="expandFee">{{ feeText }}</div>
      <div class="paymentInformation-line">
        <div class="line_name">Total</div>
        <div class="line_number">{{ payCommission.symbol }} {{ routerParams.amount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 费用展示组件
 * titleStatus 标题展示状态
 * showState 详情展示状态
 * network 部分情况接口所需添加网络信息
 */
import common from "../utils/common";

export default {
  name: "includedDetails",
  props: ['network','showState','titleStatus'],
  data(){
    return{
      triggerType: "hover",

      timeDown: 60,
      timeOut: null,
      detailsState: true,
      feeState: false,
      feeText: 'View fees',
      feeInfo: {},
      routerParams: {},
      payCommission: {},
      timeDownNumber: 15,
    }
  },
  watch:{
    'network':{
      immediate: true,
      deep: true,
      handler(){
        clearInterval(this.timeOut)
        this.queryFee();
        this.timingSetting();
      }
    },
    //接收父组件是否需要展开费用
    'showState':{
      immediate: true,
      deep: true,
      handler(val){
        this.detailsState = val;
      }
    },
  },
  mounted(){
    //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
    this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";
    //接收路由信息
    let routerParams = JSON.parse(this.$route.query.routerParams);
    this.routerParams = routerParams;
    this.payCommission = routerParams.payCommission;
  },
  activated(){
    //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
    this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";
    //接收路由信息
    let routerParams = JSON.parse(this.$route.query.routerParams);
    this.routerParams = routerParams;
    this.payCommission = routerParams.payCommission;
  },
  destroyed(){
    clearInterval(this.timeOut)
  },
  deactivated(){
    clearInterval(this.timeOut)
  },
  methods:{
    //Countdown 15 refresh data
    timingSetting(){
      this.timeOut = setInterval(()=> {
        if (this.timeDownNumber === 1) {
          this.timeDownNumber = 15;
          this.queryFee();
        }else{
          this.timeDownNumber -= 1;
        }
      },1000)
    },
    queryFee(){
      let params = {
        symbol: JSON.parse(this.$route.query.routerParams).cryptoCurrency+"USDT",
        coin: JSON.parse(this.$route.query.routerParams).cryptoCurrency,
        network: this.network
      }
      this.$axios.get(this.$api.get_inquiryFee,params).then(res=>{
        if(res && res.returnCode === "0000"){
          this.feeInfo = res.data
        }
      })
    },

    //Control details display status
    expandCollapse(){
      this.detailsState = this.detailsState === true ? false : true;
      if(this.$route.path === '/receivingMode' && this.detailsState === true){
        this.$nextTick(()=>{
          this.$parent.$refs.includedDetails_ref.scrollIntoView({behavior: "smooth", block: "end"})
        })
        return
      }
    },

    expandFee(){
      this.feeState = this.feeState === true ? false : true;
      this.feeText = this.feeState === true ? 'Hide fees' : 'View fees';
      if(this.$route.path === '/receivingMode' && this.feeState === true){
        this.$nextTick(()=>{
          this.$parent.$refs.includedDetails_ref.scrollIntoView({behavior: "smooth", block: "end"})
        })
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.paymentInformation{
  border-top: 1px solid #F3F4F5;
  padding: 0.2rem 0.2rem 0 0.1rem;
  .paymentInformation-line{
    display: flex;
    align-items: center;
    margin-top: 0.13rem;
    .line_name{
      font-size: 0.14rem;
      font-family: "Jost", sans-serif;
      font-weight: 400;
      color: #333333;
      display: flex;
      align-items: center;
      .tipsIcon{
        width: 0.14rem;
        height: 0.14rem;
        margin-left: 0.1rem;
        display: flex;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .line_number{
      font-size: 0.14rem;
      font-family: 'Jost', sans-serif;
      font-weight: bold;
      color: #333333;
      margin-left: auto;
      .minText{
        font-size: 0.14rem;
        font-weight: 400;
        color: #666666;
        margin-right: 0.2rem;
      }
    }
    .detailsName{
      font-size: 0.16rem;
      font-weight: 500;
      color: #232323;
    }
    .details{
      color: #4479D9;
      cursor: pointer;
    }
    .remainingTime{
      color: #FF0000;
      display: flex;
      align-items: center;
      img{
        width: 0.12rem;
        margin-right: 0.05rem;
      }
    }
  }
  .feeViewBtn{
    text-align: right;
    font-size: 0.14rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #4479D9;
    margin-top: 0.1rem;
    cursor: pointer;
  }
}

@keyframes loadingIcon {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: no-preference) {
  .loadingIcon {
    animation: loadingIcon infinite 2s linear;
  }
}
</style>
