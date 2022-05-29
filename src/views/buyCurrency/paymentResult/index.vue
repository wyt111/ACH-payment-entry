<!--
Three channels for successful payment --- 'depositType'
1.There is an ACh account
2.Chain address
3.No ACh account Auto register ACh account
-->
<template>
  <div id="paymentResult">
    <div class="paymentResult-content">
      <!-- Confirm Payment Payment results -->
      <div class="results_content">
        <div class="results_img">
          <img src="../../../assets/images/paymentSuccessful.png" v-if="orderStatus >= 3 && orderStatus <= 5">
          <img src="../../../assets/images/paymentOvertime.png" v-else-if="orderStatus === 6">
          <img src="../../../assets/images/paymentFailure.png" v-else-if="orderStatus === 0">
        </div>
        <div class="results_text" v-if="orderStatus >= 3 && orderStatus <= 5" v-html="resultText"></div>
        <div class="errorMessage" v-else-if="orderStatus === 6">Invoice Expired!</div>
        <div class="errorMessage" v-else-if="orderStatus === 0">Payment Fail! Please check your card information.</div>
      </div>

      <div class="paymentInformation">
        <div class="paymentInformation-line">
          <div class="line_name">{{ detailsParameters.cryptoCurrency }} Price</div>
          <div class="line_number">{{ detailsParameters.fiatCurrencySymbol }}{{ detailsParameters.cryptoPrice }}</div>
        </div>
        <div class="paymentInformation-line">
          <div class="line_name">{{ detailsParameters.cryptoCurrency }} Amount</div>
          <div class="line_number">{{ detailsParameters.cryptoQuantity }}</div>
        </div>
        <div class="paymentInformation-line" v-if="depositType===2||depositType===3">
          <div class="line_name">Address</div>
          <div class="line_number">{{ detailsParameters.address }}</div>
        </div>
        <div class="paymentInformation-line" v-if="depositType===2 && detailsParameters.hashId !== null">
          <div class="line_name">Hash</div>
          <div class="line_number">{{ detailsParameters.hashId }}</div>
        </div>
        <div class="paymentInformation-line achWallet" v-if="depositType===1">
          <div class="line_name">ACH Wallet</div>
          <div class="line_number">12345678hg9876543df765xzZxdfgh54321</div>
        </div>
        <div class="paymentInformation-line" v-if="depositType===1">
          <div class="line_name">Password</div>
          <div class="line_number">{{ detailsParameters.password }}</div>
        </div>
        <div class="paymentInformation-line">
          <div class="line_name">Total</div>
          <div class="line_number">{{ detailsParameters.fiatCurrencySymbol }}{{ detailsParameters.amount }}</div>
        </div>
      </div>
    </div>
    <div class="continue" @click="goHome">Buy more crypto</div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      orderStatus: 5, // 5: success 0: error 6: timeOut
      depositType: 1, // 1 :ach钱包 2: address
      resultText: '',
      detailsParameters: {},
      countDown: null,
    }
  },
  activated(){
    this.queryDetails()
  },
  methods: {
    //Get result information
    queryDetails(){
      this.orderInfo();
      this.countDown = setInterval(()=>{
        this.orderInfo();
      },1000);
    },
    orderInfo(){
      let params = {
        "orderNo": this.$route.query.customParam
      }
      this.$axios.get(this.$api.get_payResult,params).then(res=>{
        if(res && res.data){
          this.detailsParameters = res.data;
          //order status
          this.orderStatus = res.data.orderStatus;
          this.depositType = res.data.depositType;

          (res.data.orderStatus === 5||this.orderStatus === 6) ?  clearInterval(this.countDown) : '';
          // depositType - Receiving mode
          this.judgeChannel();
        }
      })
    },

    //Judgment order status display text
    judgeChannel(){
      if(this.depositType === 1 && this.orderStatus >= 3 && this.orderStatus <= 5){
        this.resultText = `Payment success! <span>${ this.detailsParameters.fiatCurrencySymbol }${ this.detailsParameters.cryptoQuantity } ${ this.detailsParameters.cryptoCurrency }</span> has deposited to your Alchemy Pay Wallet Account. You can download it in <span>Apple Store</span> or<span>Google Play</span>.`;
        return;
      }
      if(this.depositType === 2 && this.orderStatus >= 3 && this.orderStatus <= 4){
        this.resultText = `Your ${ this.detailsParameters.cryptoQuantity } ${ this.detailsParameters.cryptoCurrency } order is being processed and will be sent to your designated address shortly.`;
        return;
      }
      if(this.depositType === 2 && this.orderStatus === 5){
        this.resultText = `${ this.detailsParameters.cryptoQuantity } ${ this.detailsParameters.cryptoCurrency } has transfered to your wallt address.`
      }
    },

    goHome(){
      let merchantInfo = sessionStorage.getItem("accessMerchantInfo") ? JSON.parse(sessionStorage.getItem("accessMerchantInfo")) : '{}';
      if(this.depositType === 2 && sessionStorage.getItem("accessMerchantInfo") !== '{}' && merchantInfo.redirectUrl && merchantInfo.redirectUrl !== ''){
        window.location = merchantInfo.redirectUrl;
        return;
      }
      this.$router.push("/");
    }
  },
  deactivated(){
    clearInterval(this.countDown);
  },
}
</script>

<style lang="scss" scoped>
#paymentResult{
  display: flex;
  flex-direction: column;
  .paymentResult-content{
    flex: 1;
    overflow: auto;
  }
}

.results_content{
  margin-top: 0.3rem;
  .results_img{
    width: 1.43rem;
    margin: 0 auto;
    display: flex;
    img{
      width: 1.43rem;
    }
  }
  .results_text{
    margin-top: 0.4rem;
    font-size: 0.14rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #232323;
    line-height: 0.24rem;
    text-align: center;
  }
  .results_text ::v-deep span{
    color: #4479D9;
    cursor: pointer;
  }
  .errorMessage{
    margin-top: 0.4rem;
    font-size: 0.14rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #FF0000;
    text-align: center;
  }
}
.paymentInformation{
  margin-top: 0.4rem;
  border-top: 1px solid #F3F4F5;
  padding: 0.2rem 0.2rem 0 0.1rem;
  .paymentInformation-line{
    display: flex;
    align-items: flex-start;
    margin-top: 0.13rem;
    .line_name{
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
      word-break: break-word;
      max-width: 60%;
      text-align: right;
    }
  }
  .achWallet{
    .line_name{
      min-width: 0.9rem;
    }
  }
}

.overtime{
  color: #FF0000;
}

.continue{
  width: 100%;
  height: 0.6rem;
  background: #4479D9;
  border-radius: 4px;
  text-align: center;
  line-height: 0.6rem;
  font-size: 0.18rem;
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  color: #FAFAFA;
  margin-top: 0.4rem;
  cursor: pointer;
}
</style>
