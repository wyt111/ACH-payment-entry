<template>
  <!-- Payment information -->
  <div class="paymentInformation" v-if="orderState===null">
    <div class="feeTitle">
      <div class="feeTitle-name">Remaining time</div>
      <div class="feeTitle-value">
        <div class="loading-svg"><img src="../assets/images/countDownIcon.png" alt=""></div>
        <div class="feeTitle-value-text">Quote updates in {{ timeDownNumber }}s</div>
      </div>
    </div>
    <div class="fee-content">
      <div class="fee-content-title" @click="expandFee">
        <div class="left">
          You sell <span>{{ routerParams.amount }} {{ routerParams.cryptoCurrency }}</span> to <span>{{ currencyData.fiatCode }}{{ routerParams.getAmount }}</span>
        </div>
        <div class="right">
          <img src="@/assets/images/blackDownIcon.png">
        </div>
      </div>
      <div class="fee-content-details" v-if="feeState">
        <div class="fee-content-details-line">
          <div class="title">price</div>
          <div class="value">{{ feeInfo.fiatSymbol }} {{ (feeInfo.price * feeInfo.rate).toFixed(this.feeInfo.accuracy) }}</div>
        </div>
        <div class="fee-content-details-line">
          <div class="title">
            Ramp fee
            <el-popover
                placement="top"
                :trigger="triggerType"
                :offset="-18"
                content="Based on payment method">
              <div slot="reference"><img class="tipsIcon" src="../assets/images/exclamatoryMarkIcon.png"></div>
            </el-popover>
          </div>
          <div class="value">
            <span class="minText">as low as</span>
            {{ feeInfo.fiatSymbol }} {{ feeInfo.rampFee ? feeInfo.rampFee.toFixed(this.feeInfo.accuracy) : 0 }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 下单成功不刷新费用 -->
  <div class="paymentInformation" v-else>
    <div class="feeTitle">
      <div class="feeTitle-name">Remaining time</div>
      <div class="feeTitle-value">
        <div class="loading-svg"><img src="../assets/images/countDownIcon.png" alt=""></div>
        <div class="feeTitle-value-text">Quote updates in {{ timeDownNumber }}s</div>
      </div>
    </div>
    <div class="fee-content">
      <div class="fee-content-title" @click="expandFee">
        <div class="left">
          You sell <span> <!-- {{ routerParams.amount }} {{ routerParams.cryptoCurrency }} --> </span> to <span>{{ orderState.feeUnit }}{{ Math.round((orderState.fiatAmount - orderState.fee) * 100) / 100 }}</span>
        </div>
        <div class="right">
          <img src="@/assets/images/blackDownIcon.png">
        </div>
      </div>
      <div class="fee-content-details" v-if="feeState">
        <div class="fee-content-details-line">
          <div class="title">price</div>
          <div class="value">{{orderState.feeUnit}}{{ Math.round((orderState.cryptoCurrencyRate * orderState.fiatRate)*100) /100 }}</div>
        </div>
        <div class="fee-content-details-line">
          <div class="title">
            Ramp fee
            <el-popover
                placement="top"
                :trigger="triggerType"
                :offset="-18"
                content="Based on payment method">
              <div slot="reference"><img class="tipsIcon" src="../assets/images/exclamatoryMarkIcon.png"></div>
            </el-popover>
          </div>
          <div class="value">
            <span class="minText">as low as</span>
            {{ orderState.feeUnit }}{{ orderState.fee }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * timeDownState 定时刷新状态
 * isHome 是否是首页使用
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
    },
    isHome: {
      type: Boolean,
      default: null
    }
  },
  data(){
    return{
      triggerType: "hover",

      timeDownState_child: true,

      timeDown: 60,
      timeOut: null,
      feeState: false,
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
    },
    //选择国家后刷新数据
    '$store.state.sellRouterParams.positionData': {
      deep: true,
      handler(){
        clearInterval(this.timeOut)
        //接收路由信息
        this.currencyData = this.$store.state.sellRouterParams.currencyData;
        this.routerParams = this.$store.state.sellRouterParams;
        this.feeParams = this.$store.state.feeParams;
        this.timingSetting();
      }
    },
  },
  mounted(){
    //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
    this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";
    //接收路由信息
    this.currencyData = this.$store.state.sellRouterParams.currencyData;
    this.routerParams = this.$store.state.sellRouterParams;
    this.feeParams = this.$store.state.feeParams;
    this.timingSetting();
  },
  activated(){
    //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
    this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";
    //接收路由信息
    this.currencyData = this.$store.state.sellRouterParams.currencyData;
    this.routerParams = this.$store.state.sellRouterParams;
    this.feeParams = this.$store.state.feeParams;
    this.timingSetting();
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
      clearInterval(this.timeOut)
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
          //修改首页费用数据
          if(this.isHome && this.isHome === true){
            this.$parent.feeInfo = this.feeInfo;
            this.$parent.calculationAmount();
          }
        }
      })
    },

    expandFee(){
      this.feeState = this.feeState === true ? false : true;
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
.paymentInformation {
  .feeTitle {
    font-size: 13px;
    font-weight: normal;
    color: #707070;
    line-height: 15px;
    display: flex;
    align-items: center;

    .feeTitle-name {
      font-family: "GeoRegular", GeoRegular;
    }

    .feeTitle-value {
      font-family: "GeoLight", GeoLight;
      display: flex;
      align-items: center;
      margin-left: auto;

      .loading-svg {
        margin-right: 0.04rem;

        img {
          height: 0.12rem;
        }
      }
    }
  }

  .fee-content {
    background: #F3F4F5;
    border-radius: 0.12rem;
    margin-top: 0.08rem;
    padding: 0 0.16rem;

    .fee-content-title {
      padding: 0.19rem 0;
      display: flex;
      align-items: center;
      font-size: 0.16rem;
      font-family: Fieldwork-GeoLight, Fieldwork;
      font-weight: normal;
      color: #232323;
      cursor: pointer;

      span {
        font-weight: bold;
      }

      .left {
        word-break: break-all;
        font-size: 0.16rem;
        font-family: "GeoLight", GeoLight;
        font-weight: normal;
        color: #232323;

        span {
          font-family: "GeoDemibold", GeoDemibold;
        }
      }

      .right {
        margin-left: auto;
        img{
          width: 0.24rem;
        }
      }
    }

    .fee-content-details {
      border-top: 1px solid #E6E6E6;
      padding: 0.04rem 0 0.16rem 0;

      .fee-content-details-line {
        display: flex;
        align-items: center;
        margin-top: 0.12rem;

        .title {
          display: flex;
          align-items: center;
          font-size: 0.15rem;
          font-family: "GeoLight", GeoLight;
          font-weight: normal;
          color: #232323;

          .tipsIcon {
            width: 0.16rem;
            height: 0.16rem;
            margin-left: 0.08rem;
            display: flex;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .value {
          margin-left: auto;
          display: flex;
          align-items: center;
          font-size: 0.15rem;
          font-family: "GeoDemibold", GeoDemibold;
          color: #232323;
          font-weight: normal;

          .minText {
            font-family: "GeoLight", GeoLight;
            font-weight: normal;
            color: #848484;
            margin-right: 0.04rem;
            margin-top: -0.02rem;
          }
        }
      }
    }
  }
}
</style>
