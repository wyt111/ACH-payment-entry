<template>
  <!-- Payment information -->
  <div class="paymentInformation">
    <div class="paymentInformation-line">
      <div class="line_name detailsName">${{ amountMoney }} is all you pay,fees included</div>
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
        <div class="line_name">{{ cryptoCurrencyName }} Price</div>
        <div class="line_number">${{ feeInfo.price }}</div>
      </div>
      <div class="paymentInformation-line">
        <div class="line_name">Ramp fee</div>
        <div class="line_number">${{ Number(feeInfo.serviceFee) * Number(amountMoney) }}</div>
      </div>
      <div class="paymentInformation-line">
        <div class="line_name">Network Fee</div>
        <div class="line_number">${{ feeInfo.networkFee }}</div>
      </div>
      <div class="paymentInformation-line">
        <div class="line_name">Total</div>
        <div class="line_number">${{ amountMoney }}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "includedDetails",
  props: ['network'],
  data(){
    return{
      timeDown: 60,
      timeOut: null,
      detailsState: true,
      feeInfo: {},
      amountMoney: '',
      cryptoCurrencyName: '',
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
    }
  },
  mounted(){
    this.amountMoney = JSON.parse(this.$route.query.routerParams).amount;
    this.cryptoCurrencyName = JSON.parse(this.$route.query.routerParams).cryptoCurrency;
    // this.queryFee();
    // this.timingSetting();
  },
  destroyed(){
    clearInterval(this.timeOut)
  },
  methods:{
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
    expandCollapse(){
      this.detailsState = this.detailsState === true ? false : true;
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
    margin-top: 0.2rem;
    .line_name{
      font-size: 0.14rem;
      font-family: Jost-Regular, Jost;
      font-weight: 400;
      color: #333333;
    }
    .line_number{
      font-size: 0.14rem;
      font-family: Jost-Medium, Jost;
      font-weight: 500;
      color: #333333;
      margin-left: auto;
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
