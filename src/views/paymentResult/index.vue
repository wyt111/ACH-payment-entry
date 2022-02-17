<!--
Three channels for successful payment --- 'channel'
1.There is an ACh account
2.Chain address
3.No ACh account Auto register ACh account
-->
<template>
  <div id='paymentReSult'>
    <!-- Confirm Payment Payment results -->
    <div class="results_content">
      <div class="results_img">
        <img src="../../assets/images/paymentSuccessful.png" v-if="resultState">
        <img src="../../assets/images/paymentFailure.png" v-else>
      </div>
      <div class="results_text" v-if="resultState" v-html="resultText"></div>
      <div class="errorMessage" v-else>Payment Fail! Please check your card information.</div>
    </div>

    <div class="paymentInformation">
      <div class="paymentInformation-line">
        <div class="line_name">ACH Price</div>
        <div class="line_number">$238</div>
      </div>
      <div class="paymentInformation-line">
        <div class="line_name">ACH Amount</div>
        <div class="line_number">10</div>
      </div>
      <div class="paymentInformation-line" v-if="channel===1||channel===2">
        <div class="line_name">Address</div>
        <div class="line_number">12345678hg9876543df765xzZxdfgh54321</div>
      </div>
      <div class="paymentInformation-line" v-if="channel===2">
        <div class="line_name">Hash ID</div>
        <div class="line_number">1234567894532</div>
      </div>
      <div class="paymentInformation-line achWallet" v-if="channel===3">
        <div class="line_name">ACH Wallet</div>
        <div class="line_number">12345678hg9876543df765xzZxdfgh54321</div>
      </div>
      <div class="paymentInformation-line" v-if="channel===3">
        <div class="line_name">Password</div>
        <div class="line_number">wq1345678</div>
      </div>
      <div class="paymentInformation-line">
        <div class="line_name">Total</div>
        <div class="line_number">$30.00</div>
      </div>
    </div>
    <div class="continue">Continue to by Cryptos</div>
  </div>
</template>

<script>
export default {
  name: "Payment ReSult",
  data(){
    return{
      resultState: true,
      channel: 1,
      resultText: '',
    }
  },
  mounted(){
    this.judgeChannel();
  },
  methods: {
    judgeChannel(){
      if(this.channel === 1){
        this.resultText = ` Payment success!
        <span>18.67 ACH</span> will transfer to your wallet address.
        We will notify you of the result by email
        <span>zyfqqq123456@gmail.com</span>`;
      }else if(this.channel === 2){
        this.resultText = `<span>18.67 ACH</span> has transfered to your wallt address.`;
      }else{
        this.resultText = `Payment success! <span>18.67 ACH</span> has deposited to your Alchemy
        Pay Wallet Account. You can download it in <span>Apple Store</span> or<span>Google Play</span>.`;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.results_content{
  margin-top: 0.3rem;
  .results_img{
    width: 1.93rem;
    margin: 0 auto;
    display: flex;
    img{
      width: 1.93rem;
    }
  }
  .results_text{
    margin-top: 0.4rem;
    font-size: 0.14rem;
    font-family: Jost-Medium, Jost;
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
    font-family: Jost-Medium, Jost;
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
  }
  .achWallet{
    .line_name{
      min-width: 0.9rem;
    }
    .line_number{
      word-break: break-word;
    }
  }
}

.continue{
  width: 100%;
  height: 0.6rem;
  background: #4479D9;
  border-radius: 4px;
  text-align: center;
  line-height: 0.6rem;
  font-size: 0.18rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #FAFAFA;
  margin-top: 0.4rem;
  cursor: pointer;
}
</style>
