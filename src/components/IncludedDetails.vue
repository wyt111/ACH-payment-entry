<template>
  <!-- Payment information -->
  <div class="paymentInformation">
    <div class="feeTitle">
      <div class="feeTitle-name">Remaining time</div>
      <div class="feeTitle-value">
        <div class="loading-svg">
          <van-icon name="clock-o" />
<!--          <img src="../assets/images/countDownIcon.png" alt="">-->
        </div>
        <div class="feeTitle-value-text">Quote updates in<span>{{ timeDownNumber }}</span>s</div>
      </div>
    </div>
    <div class="fee-content">
      <div class="fee-content-title" @click="expandCollapse">
        <div class="left">
          You get <span>{{ routerParams.getAmount }} {{ routerParams.cryptoCurrency }}</span> for <span>{{ payCommission.symbol }}{{ routerParams.amount }}</span>
        </div>
        <div class="right">
          <img src="@/assets/images/blackDownIcon.png">
        </div>
      </div>
      <div class="fee-content-details" v-if="detailsState">
        <div class="fee-content-details-line">
          <div class="title">price</div>
          <div class="value">{{ payCommission.symbol }} {{ (feeInfo.price * routerParams.exchangeRate).toFixed(payCommission.decimalDigits) }}</div>
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
          <div class="value"><span class="minText">as low as</span> {{ payCommission.symbol }} {{ payCommission.rampFee }}</div>
        </div>
        <div class="fee-content-details-line">
          <div class="title">Network fee</div>
          <div class="value">{{ payCommission.symbol }} {{ (feeInfo.networkFee * routerParams.exchangeRate).toFixed(payCommission.decimalDigits) }}</div>
        </div>
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
 * isHome 是否是首页使用
 */
import common from "../utils/common";

export default {
  name: "includedDetails",
  props: ['isHome','network','showState','titleStatus'],
  data(){
    return{
      triggerType: "hover",

      timeDown: 60,
      timeOut: null,
      detailsState: true,
      feeInfo: {},
      routerParams: {},
      payCommission: {
        code: "",
        decimalDigits: 0,
        name: "",
        payCommission: [],
        payMax: 0,
        payMin: 0,
        rampFee: 0,
        symbol: "",
        symbolNative: ""
      },
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

    //输入金额改变后刷新数据
    '$store.state.buyRouterParams.amount': {
      deep: true,
      handler() {
        clearInterval(this.timeOut)
        this.queryFee();
        this.timingSetting();
      }
    },
    //选择数字货币后刷新数据
    '$store.state.buyRouterParams.cryptoCurrency': {
      deep: true,
      handler() {
        clearInterval(this.timeOut)
        this.queryFee();
        this.timingSetting();
      }
    }
  },
  mounted(){
    //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
    this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";
    //接收路由信息
    this.routerParams = this.$store.state.buyRouterParams;
    this.payCommission = this.routerParams.payCommission;
  },
  activated(){
    //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
    this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";
    //接收路由信息
    this.routerParams = this.$store.state.buyRouterParams;
    this.payCommission = this.routerParams.payCommission;
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
        symbol: this.$store.state.buyRouterParams.cryptoCurrency+"USDT",
        coin: this.$store.state.buyRouterParams.cryptoCurrency,
        network: this.network
      }
      this.$axios.get(this.$api.get_inquiryFee,params).then(res=>{
        if(res && res.returnCode === "0000"){
          this.feeInfo = res.data;
          //修改首页费用数据
          if(this.isHome && this.isHome === true){
            this.$parent.feeInfo = this.feeInfo;
            this.$parent.calculationAmount();
          }
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
      this.$nextTick(()=>{
        this.$parent.$refs.includedDetails_ref.scrollIntoView({behavior: "smooth", block: "end"})
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.paymentInformation{
  .feeTitle{
    font-size: 13px;
    font-weight: normal;
    color: #707070;
    line-height: 15px;
    display: flex;
    align-items: center;
    .feeTitle-name{
      font-family: "GeoRegular", GeoRegular;
    }
    .feeTitle-value{
      font-family: "GeoLight", GeoLight;
      display: flex;
      align-items: center;
      margin-left: auto;
      .loading-svg{
        margin-right: 0.04rem;
        font-size: 0.15rem;
        margin-top: 0.02rem;
        img{
          height: 0.12rem;
        }
      }
      .feeTitle-value-text{
        span{
          display: inline-block;
          width: 0.15rem;
          text-align: center;
        }
      }
    }
  }

  .fee-content{
    background: #F3F4F5;
    border-radius: 0.12rem;
    margin-top: 0.08rem;
    padding: 0 0.16rem;
    .fee-content-title{
      padding: 0.19rem 0;
      display: flex;
      align-items: center;
      font-size: 0.16rem;
      font-family: Fieldwork-GeoLight, Fieldwork;
      font-weight: normal;
      color: #232323;
      cursor: pointer;
      span{
        font-weight: bold;
      }
      .left{
        word-break: break-all;
        font-size: 0.16rem;
        font-family: "GeoLight", GeoLight;
        font-weight: normal;
        color: #232323;
        span{
          font-family: "GeoDemibold",GeoDemibold;
        }
      }
      .right {
        margin-left: auto;
        img{
          width: 0.24rem;
        }
      }
    }

    .fee-content-details{
      border-top: 1px solid #E6E6E6;
      padding: 0.04rem 0 0.16rem 0;
      .fee-content-details-line{
        display: flex;
        align-items: center;
        margin-top: 0.12rem;
        .title{
          display: flex;
          align-items: center;
          font-size: 0.15rem;
          font-family: "GeoLight", GeoLight;
          font-weight: normal;
          color: #232323;
          .tipsIcon{
            width: 0.16rem;
            height: 0.16rem;
            margin-left: 0.08rem;
            display: flex;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
        .value{
          margin-left: auto;
          display: flex;
          align-items: center;
          font-size: 0.15rem;
          font-family: "GeoDemibold",GeoDemibold;
          color: #232323;
          font-weight: normal;
          .minText{
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
