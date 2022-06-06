<template>
  <!-- Payment information -->
  <div class="paymentInformation" v-if="orderState===null">
    <div class="calculationProcess">
      <div class="calculationProcess_line" v-if="timeDownState_child">
        <div class="line_name">Remaining time</div>
        <div class="line_number">
          <div class="line_number_icon"><img class="loadingIcon" src="@/assets/images/countDownIcon.svg"></div>
          <div class="line_number_red">{{ timeDownNumber }}S</div>
        </div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">{{ currencyData.name }} price</div>
        <div class="line_number">{{ feeInfo.fiatSymbol }}{{ feeInfo.price }}</div>
      </div>
      <div class="calculationProcess_line" v-show="feeState">
        <div class="line_name">
          Ramp fee
          <el-popover
              placement="top"
              :trigger="triggerType"
              :offset="-18"
              content="Based on payment method">
            <div slot="reference"><img class="tipsIcon" src="@/assets/images/exclamatoryMarkIcon.png"></div>
          </el-popover>
        </div>
        <div class="line_number"><span class="minText">as low as</span>{{ feeInfo.fiatSymbol }}{{ feeInfo.rampFee ? feeInfo.rampFee.toFixed(2) : '' }}</div>
      </div>
      <div class="feeViewBtn" @click="expandFee">{{ feeText }}</div>
      <div class="calculationProcess_line">
        <div class="line_name">Total</div>
        <div class="line_number">{{ feeInfo.fiatSymbol }}{{ routerParams.getAmount }}</div>
      </div>
    </div>
  </div>
  <div class="paymentInformation" v-else>
    <div class="calculationProcess">
      <div class="calculationProcess_line" v-if="timeDownState_child">
        <div class="line_name">Remaining time</div>
        <div class="line_number">
          <div class="line_number_icon"><img class="loadingIcon" src="@/assets/images/countDownIcon.svg"></div>
          <div class="line_number_red">{{ timeDownNumber }}S</div>
        </div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">{{ orderState.cryptoCurrency }} price</div>
        <div class="line_number">{{orderState.feeUnit}}{{ orderState.cryptoCurrencyRate }}{{ orderState.fiatRate }}</div>
      </div>
      <div class="calculationProcess_line" v-show="feeState">
        <div class="line_name">
          Ramp fee
          <el-popover
              placement="top"
              :trigger="triggerType"
              :offset="-18"
              content="Based on payment method">
            <div slot="reference"><img class="tipsIcon" src="@/assets/images/exclamatoryMarkIcon.png"></div>
          </el-popover>
        </div>
        <div class="line_number"><span class="minText">as low as</span>{{ orderState.feeUnit }}{{ orderState.fee }}</div>
      </div>
      <div class="feeViewBtn" @click="expandFee">{{ feeText }}</div>
      <div class="calculationProcess_line">
        <div class="line_name">Total</div>
        <div class="line_number">{{ orderState.feeUnit }}{{ orderState.fiatAmount - orderState.fee }}</div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * timeDownState 定时刷新状态
 */
import common from "../utils/common";

export default {
  name: "includedDetails",
  props: {
    timeDownState: {
      type: Boolean,
      default: null
    },
    orderState:{
      type:Object,
      default:null
    }
  },
  data(){
    return{
      triggerType: "hover",

      timeDownState_child: true,

      timeDown: 60,
      timeOut: null,
      feeState: false,
      feeText: 'View fees',
      feeParams: {},
      feeInfo: {},
      routerParams: {},
      currencyData: {},
      timeDownNumber: 15,
    }
  },
  watch: {
    'timeDownState': {
      deep: true,
      immediate: true,
      handler(val){
        this.timeDownState_child = (val !== null && val === false) ? false : true;
        if(val === false){
          clearInterval(this.timeOut);
        }
      }
    }
  },
  activated(){
    //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
    this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";
    //接收路由信息
    this.currencyData = this.$store.state.routerParams.currencyData;
    this.routerParams = this.$store.state.routerParams;
    this.feeParams = this.$store.state.feeParams;
    this.timingSetting();
  },
  deactivated(){
    clearInterval(this.timeOut)
  },
  methods:{
    //Countdown 15 refresh data
    timingSetting(){
      this.queryFee();
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
      this.$axios.get(this.$api.get_inquiryFeeSell,this.feeParams).then(res=>{
        if(res && res.returnCode === "0000"){
          this.feeInfo = res.data;
          this.feeInfo.rampFee = (this.routerParams.amount * this.feeInfo.price * this.feeInfo.percentageFee + this.feeInfo.fixedFee) * this.feeInfo.rate;
        }
      })
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
  padding: 0.2rem 0 0 0;
  .calculationProcess{
    padding: 0 0.2rem;
    .calculationProcess_line{
      display: flex;
      align-items: center;
      margin-top: 0.13rem;
      .line_name{
        font-size: 0.14rem;
        font-family: "Jost", sans-serif;
        font-weight: 400;
        color: #232323;
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
        margin-left: auto;
        font-size: 0.14rem;
        font-family: 'Jost', sans-serif;
        font-weight: bold;
        color: #232323;
        display: flex;
        align-items: center;
        .minText{
          font-size: 0.14rem;
          font-weight: 400;
          color: #666666;
          margin-right: 0.2rem;
        }
        .line_number_icon{
          margin-right: 0.05rem;
          img{
            width: 0.12rem;
          }
        }
        .line_number_red{
          font-size: 0.14rem;
          font-family: 'Jost', sans-serif;
          font-weight: 500;
          color: #FF0000;
        }
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
