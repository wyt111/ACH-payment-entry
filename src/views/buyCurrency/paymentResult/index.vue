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
        <div class="fee-content">
          <div class="fee-content-title" @click="expandCollapse">
            <div class="left">
              You get <span>{{ detailsParameters.cryptoQuantity }} {{ detailsParameters.cryptoCurrency }}</span> for <span>{{ detailsParameters.fiatCurrencySymbol }}{{ detailsParameters.amount }}</span>
            </div>
            <div class="right"><van-icon name="arrow-down" /></div>
          </div>
          <div class="fee-content-details" v-if="detailsState">
            <div class="fee-content-details-line">
              <div class="title">Price</div>
              <div class="value">{{ detailsParameters.fiatCurrencySymbol }}{{ detailsParameters.cryptoPrice }}</div>
            </div>
            <div class="fee-content-details-line">
              <div class="title">Amount</div>
              <div class="value">{{ detailsParameters.cryptoQuantity }}</div>
            </div>
            <div class="fee-content-details-line" v-if="depositType===2||depositType===3">
              <div class="title">Address</div>
              <div class="value">{{ detailsParameters.address }}</div>
            </div>
            <div class="fee-content-details-line" v-if="depositType===2 && detailsParameters.hashId !== null">
              <div class="title">Hash</div>
              <div class="value">{{ detailsParameters.hashId }}</div>
            </div>
            <div class="fee-content-details-line" v-if="depositType===1">
              <div class="title">ACH Wallet</div>
              <div class="value">{{ detailsParameters.address }}</div>
            </div>
            <div class="fee-content-details-line" v-if="depositType===1">
              <div class="title">Password</div>
              <div class="value">{{ detailsParameters.password }}</div>
            </div>
          </div>
        </div>
        <!-- 老版本 -->
        <!--        <div class="paymentInformation-line">-->
<!--          <div class="line_name">{{ detailsParameters.cryptoCurrency }} Price</div>-->
<!--          <div class="line_number">{{ detailsParameters.fiatCurrencySymbol }}{{ detailsParameters.cryptoPrice }}</div>-->
<!--        </div>-->
<!--        <div class="paymentInformation-line">-->
<!--          <div class="line_name">{{ detailsParameters.cryptoCurrency }} Amount</div>-->
<!--          <div class="line_number">{{ detailsParameters.cryptoQuantity }}</div>-->
<!--        </div>-->
<!--        <div class="paymentInformation-line" v-if="depositType===2||depositType===3">-->
<!--          <div class="line_name">Address</div>-->
<!--          <div class="line_number">{{ detailsParameters.address }}</div>-->
<!--        </div>-->
<!--        <div class="paymentInformation-line" v-if="depositType===2 && detailsParameters.hashId !== null">-->
<!--          <div class="line_name">Hash</div>-->
<!--          <div class="line_number">{{ detailsParameters.hashId }}</div>-->
<!--        </div>-->
<!--        <div class="paymentInformation-line achWallet" v-if="depositType===1">-->
<!--          <div class="line_name">ACH Wallet</div>-->
<!--          <div class="line_number">{{ detailsParameters.address }}</div>-->
<!--        </div>-->
<!--        <div class="paymentInformation-line" v-if="depositType===1">-->
<!--          <div class="line_name">Password</div>-->
<!--          <div class="line_number">{{ detailsParameters.password }}</div>-->
<!--        </div>-->
<!--        <div class="paymentInformation-line">-->
<!--          <div class="line_name">Total</div>-->
<!--          <div class="line_number">{{ detailsParameters.fiatCurrencySymbol }}{{ detailsParameters.amount }}</div>-->
<!--        </div>-->
      </div>
    </div>
    <button class="continue" @click="goHome">
      {{ backText }}
      <img class="rightIcon" src="../../../assets/images/button-right-icon.png" alt="">
    </button>
  </div>
</template>

<script>
export default {
  data(){
    return{
      orderStatus: '', // 5: success 0: error 6: timeOut
      depositType: '', // 1 :ach钱包 2: address
      resultText: '',
      detailsParameters: {},
      countDown: null,
      detailsState: false,
      backText: "Continue to buy crypto", //Return back
    }
  },
  activated(){
    this.queryDetails()
    let merchantInfo = sessionStorage.getItem("accessMerchantInfo") ? JSON.parse(sessionStorage.getItem("accessMerchantInfo")) : '{}';
    if(sessionStorage.getItem("accessMerchantInfo") !== '{}' && merchantInfo.redirectUrl && merchantInfo.redirectUrl !== ''){
      this.backText = "Return back";
    }
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

          (res.data.orderStatus === 0 || res.data.orderStatus === 5 || res.data.orderStatus === 6) ?  clearInterval(this.countDown) : '';
          // depositType - Receiving mode
          this.judgeChannel();
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
      if(sessionStorage.getItem("accessMerchantInfo") !== '{}' && merchantInfo.redirectUrl && merchantInfo.redirectUrl !== ''){
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
  margin-top: 0.32rem;
  .results_img{
    width: 0.97rem;
    margin: 0 auto;
    display: flex;
    img{
      width: 0.97rem;
    }
  }
  .results_text{
    margin-top: 0.08rem;
    font-size: 0.13rem;
    font-family: "GeoLight", GeoLight;
    font-weight: normal;
    color: #232323;
    line-height: 0.2rem;
    text-align: center;
  }
  .results_text ::v-deep span{
    color: #0059DA;
    cursor: pointer;
  }
  .errorMessage{
    margin-top: 0.08rem;
    font-size: 0.13rem;
    font-family: "GeoLight", GeoLight;
    font-weight: normal;
    color: #E55643;
    line-height: 0.2rem;
    text-align: center;
  }
}
.paymentInformation{
  margin-top: 0.32rem;
  //padding: 0.2rem 0.2rem 0 0.1rem;
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
      font-family: "GeoLight", GeoLight;
      font-weight: normal;
      color: #232323;
      cursor: pointer;
      span{
        font-family: "GeoDemibold",GeoDemibold;
      }
      .left{
        word-break: break-all;
      }
      .right{
        width: 0.32rem;
        height: 0.24rem;
        text-align: center;
        line-height: 0.24rem;
        margin-left: auto;
      }
    }

    .fee-content-details{
      border-top: 1px solid #E6E6E6;
      padding: 0.04rem 0 0.16rem 0;
      .fee-content-details-line{
        display: flex;
        align-items: flex-start;
        margin-top: 0.12rem;
        .title{
          display: flex;
          align-items: center;
          font-size: 0.15rem;
          font-family: "GeoLight", GeoLight;
          font-weight: normal;
          color: #232323;
          margin-right: 0.34rem;
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
          word-wrap:break-word;
          word-break:break-all;
          text-align: right;
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
  //.paymentInformation-line{
  //  display: flex;
  //  margin-top: 0.13rem;
  //  .line_name{
  //    font-size: 0.14rem;
  //    font-family: "GeoDemibold", GeoDemibold;
  //    font-weight: 400;
  //    color: #333333;
  //  }
  //  .line_number{
  //    font-size: 0.14rem;
  //    font-family: 'Jost', sans-serif;
  //    font-weight: 500;
  //    color: #333333;
  //    margin-left: auto;
  //    word-break: break-word;
  //    max-width: 60%;
  //    text-align: right;
  //  }
  //}
  //.achWallet{
  //  .line_name{
  //    min-width: 0.9rem;
  //  }
  //}
}

.overtime{
  color: #FF0000;
}

.continue{
  width: 100%;
  height: 0.58rem;
  background: #0059DA;
  border-radius: 0.29rem;
  font-size: 0.17rem;
  font-family: "GeoRegular", GeoRegular;
  font-weight: normal;
  color: #FFFFFF;
  margin-top: 0.16rem;
  cursor: pointer;
  border: none;
  position: relative;
  .rightIcon{
    width: 0.24rem;
    position: absolute;
    top: 0.17rem;
    right: 0.32rem;
  }
}
</style>
