<template>
  <!-- Payment amount information -->
  <div class="payAmountInfo">
    <div class="title">{{ routerParams.amount }} <span>{{ payCommission.currency }}</span></div>
    <div class="line-info">
      <div class="line-info-title">Remaining time</div>
      <div class="line_number remainingTime">
        <div><img class="loadingIcon" src="@/assets/images/countDownIcon.svg"></div>
        <div>{{ timeDownNumber }}S</div>
      </div>
    </div>
    <div class="line-info">
      <div class="line-info-title">{{ routerParams.cryptoCurrency }} price</div>
      <div class="line_number">{{ payCommission.currencySymbol }}{{ (feeInfo.price * routerParams.exchangeRate).toFixed(6) }}</div>
    </div>
    <div class="line-info">
      <div class="line-info-title">{{ routerParams.cryptoCurrency }} amount</div>
      <div class="line_number">{{ routerParams.getAmount }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "indonesianDetails",
  props: ['network'],
  data(){
    return{
      routerParams: {},
      payCommission: {},
      feeInfo: {},
      timeDown: null,
      timeDownNumber: 15,
    }
  },
  mounted() {
    this.routerParams = JSON.parse(this.$route.query.routerParams);
    this.payCommission = this.routerParams.payCommission;
    this.orderStatus();
    this.timeDown = setInterval(()=>{
      if(this.timeDownNumber === 1){
        this.timeDownNumber = 15;
        this.orderStatus();
      }else{
        this.timeDownNumber -= 1;
      }
    },1000);
  },
  deactivated(){
    clearInterval(this.timeDown);
  },
  methods: {
    //query order status
    orderStatus(){
      let params = {
        symbol: JSON.parse(this.$route.query.routerParams).cryptoCurrency+"USDT",
        coin: JSON.parse(this.$route.query.routerParams).cryptoCurrency,
        network: this.network
      }
      this.$axios.get(this.$api.get_inquiryFee,params).then(res=> {
        if (res && res.returnCode == '0000') {
          this.feeInfo = res.data;
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.payAmountInfo{
  background: #F3F4F5;
  padding: 0.2rem;
  border-radius: 0.1rem;
  .title{
    font-size: 0.28rem;
    font-family: Jost-SemiBold, Jost;
    font-weight: 600;
    color: #232323;
    text-align: center;
    span{
      font-size: 0.16rem;
      font-family: "Jost", sans-serif;
      font-weight: 400;
      color: #232323;
    }
  }
  .line-info{
    display: flex;
    margin-top: 0.2rem;
    .line-info-title{
      font-size: 0.14rem;
      font-family: "Jost", sans-serif;
      font-weight: 400;
      color: #333333;
    }
    .line_number{
      font-size: 0.14rem;
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      color: #333333;
      margin-left: auto;
    }
    .remainingTime{
      color: #FF0000;
      display: flex;
      align-items: center;
      img{
        width: 0.12rem;
        margin-right: 0.05rem;
      }
      div:last-child{
        width: 0.2rem;
        text-align: right;
      }
    }
  }
}
</style>
