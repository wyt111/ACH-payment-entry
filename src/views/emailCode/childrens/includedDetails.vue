<template>
  <!-- Payment information -->
  <div class="paymentInformation">
    <div class="paymentInformation-line">
      <div class="line_name detailsName">$30.00 is all you pay,fees included</div>
      <div class="line_number details" @click="expandCollapse">Details</div>
    </div>
    <div v-if="detailsState">
      <div class="paymentInformation-line">
        <div class="line_name">Remaining time</div>
        <div class="line_number remainingTime">
          <div><img src="../../../assets/images/countDownIcon.svg"></div>
          <div>15S</div>
        </div>
      </div>
      <div class="paymentInformation-line">
        <div class="line_name">ACH Price</div>
        <div class="line_number">$238</div>
      </div>
      <div class="paymentInformation-line">
        <div class="line_name">Ramp fee</div>
        <div class="line_number">$10</div>
      </div>
      <div class="paymentInformation-line">
        <div class="line_name">Network Fee</div>
        <div class="line_number">$10</div>
      </div>
      <div class="paymentInformation-line">
        <div class="line_name">Total</div>
        <div class="line_number">$30.00</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "includedDetails",
  data(){
    return{
      timeDown: 60,
      detailsState: true
    }
  },
  methods:{
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
</style>
