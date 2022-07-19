<template>
  <!-- Payment information -->
  <div class="paymentInformation">
    <div class="feeTitle">
      <div class="feeTitle-name">{{ $t('nav.home_feeTimeDownTitle') }}</div>
      <div class="feeTitle-value">
        <div class="loading-svg">
          <van-icon name="clock-o" />
        </div>
        <div class="feeTitle-value-text">{{ $t('nav.home_feeTimeDown') }}<span>{{ timeDownNumber }}</span>{{ $t('nav.codeSecond') }}</div>
      </div>
    </div>
    <div class="fee-content">
      <div class="fee-content-title" @click="expandCollapse">
        <div class="left">
          {{ $t('nav.home_youBuyGet') }} <span>{{ routerParams.getAmount }} {{ routerParams.cryptoCurrency }}</span> {{ $t('nav.home_buyFee_title2') }} <span>{{ payCommission.symbol }} {{ routerParams.amount }}</span>
        </div>
        <!-- 商户接入模式禁止点击 -->
        <div class="right" v-if="this.$store.state.goHomeState">
          <img src="@/assets/images/blackDownIcon.png">
        </div>
      </div>
      <div class="fee-content-details" v-if="detailsState">
        <div class="fee-content-details-line">
          <div class="title">{{ $t('nav.fee_listTitle_price') }}</div>
          <div class="value">{{ payCommission.symbol }} {{ price }}</div>
        </div>
        <div class="fee-content-details-line">
          <div class="title">
            {{ $t('nav.home_buyFee_rampFee') }}
            <el-popover
                placement="top"
                :trigger="triggerType"
                :offset="-18"
                :content="this.$t('nav.fee_tips')">
              <div slot="reference"><img class="tipsIcon" src="../assets/images/exclamatoryMarkIcon.png"></div>
            </el-popover>
          </div>
          <div class="value"><span class="minText">{{ $t('nav.home_feeRampFeeTips') }}</span> {{ payCommission.symbol }} {{ payCommission.rampFee }}</div>
        </div>
        <div class="fee-content-details-line">
          <div class="title">{{ $t('nav.home_buyFee_networkFee') }}</div>
          <div class="value">{{ payCommission.symbol }} {{ networkFee }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 费用展示组件
 * titleStatus 标题展示状态
 * network 选择接收方式需带入网络信息
 * isHome 是否是首页使用(监听vuex.state加载数据)、初首页以外activated加载数据
 * useFee 是否使用费用数据
 * isLoading 是否开始加载费用数据
 */
import common from "../utils/common";

export default {
  name: "includedDetails",
  props: {
    isHome: {
      type: Boolean,
      default: null
    },
    network: {
      type: String,
      default: null
    },
    titleStatus: {
      type: Boolean,
      default: null
    },
    useFee: {
      type: Boolean,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: null
    },
  },
  data(){
    return{
      triggerType: "hover",

      timeDown: 60,
      timeOut: null,
      detailsState: false,
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
      },
      timeDownNumber: 15,
    }
  },
  watch:{
    'network': {
      deep: true,
      immediate: true,
      handler(){
        if(this.$store.state.goHomeState && (this.isHome === false || this.isHome === null)){
          this.queryFee();
          this.timingSetting();
        }
      }
    },
    //首页输入金额改变后刷新数据
    '$store.state.buyRouterParams.amount': {
      deep: true,
      immediate: true,
      handler() {
        if(this.isHome && this.isHome === true){
          this.queryFee();
          this.timingSetting();
        }
      }
    },
    //首页选择数字货币后刷新数据
    '$store.state.buyRouterParams.cryptoCurrency': {
      deep: true,
      handler() {
        if(this.isHome && this.isHome === true) {
          this.queryFee();
          this.timingSetting();
        }
      }
    },
    '$store.state.buyRouterParams.exchangeRate': {
      deep: true,
      handler(val){
        this.routerParams.exchangeRate = val;
      }
    },
    'isLoading': {
      deep: true,
      immediate: true,
      handler(val){
        if(val === true && this.$store.state.buyRouterParams.cryptoCurrency !== ''){
          this.routerParams = this.$store.state.buyRouterParams;
          this.payCommission = this.$store.state.buyRouterParams.payCommission;
          this.queryFee();
          this.timingSetting();
        }
      }
    },
    '$store.state.buyRouterParams.payCommission.symbol': {
      deep: true,
      immediate: true,
      handler(){
        if(this.$store.state.buyRouterParams.cryptoCurrency !== '' && this.$store.state.buyRouterParams.goHomeState === true){
          this.queryFee();
          this.timingSetting();
        }
      }
    }
  },
  mounted(){
    //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
    this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";
  },
  activated(){
    //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
    this.triggerType = common.equipmentEnd === 'pc' ? "hover" : "click";
    //接收路由信息
    this.$store.state.buyRouterParams.payCommission !== undefined ? this.payCommission = this.$store.state.buyRouterParams.payCommission : '';
    if(this.isHome === true){
      this.queryFee();
      this.timingSetting();
    }
    if(this.isHome === false || this.isHome === null){
      this.queryFee();
      this.timingSetting();
    }
  },
  destroyed(){
    this.timeDownNumber = 15;
    window.clearInterval(this.timeOut);
    this.timeOut = null;
  },
  deactivated(){
    this.timeDownNumber = 15;
    window.clearInterval(this.timeOut);
    this.timeOut = null;
  },
  computed: {
    //个位数>0，小数点后保留2位、个位数为0，小数点后最多保留6位
    networkFee(){
      if(this.feeInfo.networkFee !== undefined){
        let decimalDigits = 0;
        let resultValue = this.feeInfo.networkFee;
        resultValue = this.feeInfo.networkFee * this.$store.state.buyRouterParams.exchangeRate;
        resultValue >= 1 ? decimalDigits = 2 : decimalDigits = 6;
        let networkFee = resultValue.toFixed(decimalDigits);
        isNaN(resultValue) || networkFee <= 0 ? networkFee = 0 : '';
        return networkFee;
      }
    },
    price(){
      let decimalDigits = 0;
      let resultValue = this.feeInfo.price * this.routerParams.exchangeRate;
      resultValue >= 1 ? decimalDigits = 2 : decimalDigits = 6;
      let price = resultValue.toFixed(decimalDigits);
      isNaN(resultValue) || price <= 0 ? price = 0 : '';
      return price;
    },
  },
  methods:{
    //Countdown 15 refresh data
    timingSetting(){
      this.timeDownNumber = 15;
      window.clearInterval(this.timeOut);
      this.timeOut = null;
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
      //接收路由信息
      this.routerParams = this.$store.state.buyRouterParams;
      this.payCommission = this.routerParams.payCommission;
      let params = {
        symbol: this.$store.state.buyRouterParams.cryptoCurrency+"USDT",
        coin: this.$store.state.buyRouterParams.cryptoCurrency,
        network: this.network
      }
      this.$axios.get(this.$api.get_inquiryFee,params).then(res=>{
        if(res && res.returnCode === "0000"){
          this.feeInfo = JSON.parse(JSON.stringify(res.data));
          //修改首页费用数据
          if(this.isHome && this.isHome === true){
            this.$parent.feeInfo = JSON.parse(JSON.stringify(res.data));
            //赋值费用数据
            this.useFee && this.useFee === true ? this.$parent.feeInfo = JSON.parse(JSON.stringify(this.feeInfo)) : '';
            this.$parent.calculationAmount();
          }
          //选择网络修改you get数量、商户对接计算you get数量
          if(this.$store.state.buyRouterParams.network !== '' && this.$store.state.buyRouterParams.network !== undefined){
            let rampFee = this.$store.state.buyRouterParams.payCommission.rampFee;
            let networkFee = this.$store.state.buyRouterParams.exchangeRate * this.feeInfo.networkFee;
            let price = this.feeInfo.price * this.routerParams.exchangeRate
            let newGetAmount = (this.$store.state.buyRouterParams.amount - networkFee - rampFee) / price;
            let decimalDigits = 0;
            newGetAmount >= 1 ? decimalDigits = 2 : decimalDigits = 6;
            newGetAmount = newGetAmount.toFixed(decimalDigits);
            isNaN(newGetAmount) || newGetAmount <= 0 ? newGetAmount = 0 : '';
            this.routerParams.getAmount = newGetAmount;
          }
          if(this.isLoading && this.isLoading === true){
            let rampFee = this.$store.state.buyRouterParams.payCommission.rampFee;
            this.feeInfo.networkFee = this.$store.state.buyRouterParams.exchangeRate * this.feeInfo.networkFee;
            let newGetAmount = (Number(this.$store.state.buyRouterParams.amount) - this.feeInfo.networkFee - rampFee) / this.feeInfo.price;
            let decimalDigits = 0;
            newGetAmount >= 1 ? decimalDigits = 2 : decimalDigits = 6;
            newGetAmount = newGetAmount.toFixed(decimalDigits);
            isNaN(newGetAmount) || newGetAmount <= 0 ? newGetAmount = 0 : '';
            this.routerParams.getAmount = newGetAmount;
          }
        }
      })
    },

    //Control details display status
    expandCollapse(){
      //商户接入模式禁止点击
      if(!this.$store.state.goHomeState){
        return;
      }

      this.detailsState = this.detailsState === true ? false : true;
      if(this.detailsState === true){
        setTimeout(()=>{
          this.$parent.$refs.includedDetails_ref.$el.scrollIntoView({behavior: "smooth", block: "end", inline: 'end'});
        })
        return
      }
    },
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
