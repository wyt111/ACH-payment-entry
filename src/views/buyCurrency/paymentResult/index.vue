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
        <div class="errorMessage" v-else-if="orderStatus === 0">{{ $t('nav.payResult_timeErrorMessage') }}</div>
        <div class="errorMessage" v-else-if="orderStatus === 6">{{ $t('nav.payResult_errorMessage') }}</div>
      </div>

      <div class="paymentInformation">
        <div class="fee-content">
          <div class="fee-content-title" @click="expandCollapse" v-if="detailsTitleState">
            <div class="left">
              {{ $t('nav.home_buyFee_title1') }} <span>{{ detailsParameters.fiatCurrencySymbol }}{{ detailsParameters.amount }}</span> {{ $t('nav.home_buyFee_title2') }} <span>{{ detailsParameters.cryptoQuantity }} {{ detailsParameters.cryptoCurrency }}</span>
            </div>
            <div class="right"><van-icon name="arrow-down" /></div>
          </div>
          <div class="fee-content-details" :class="{'borderNone': !detailsTitleState}" v-if="detailsState">
            <div class="fee-content-details-line" v-if="orderStatus === 0 || orderStatus === 6">
              <div class="title">{{ $t('nav.payResult_orderNo') }}</div>
              <div class="value">{{ detailsParameters.orderNo }}</div>
            </div>
            <div class="fee-content-details-line" v-if="orderStatus !== 0 && orderStatus !== 6">
              <div class="title">{{ $t('nav.fee_listTitle_price') }}</div>
              <div class="value">{{ detailsParameters.fiatCurrencySymbol }}{{ detailsParameters.cryptoPrice }}</div>
            </div>
            <div class="fee-content-details-line">
              <div class="title">{{ $t('nav.payResult_feeAmount') }}</div>
              <div class="value">{{ detailsParameters.fiatCurrencySymbol }}{{ detailsParameters.amount }}</div>
            </div>
            <div class="fee-content-details-line" v-if="orderStatus !== 0 && orderStatus !== 6">
              <div class="title">{{ $t('nav.payResult_feeAddress') }}</div>
              <div class="value">{{ detailsParameters.address }}</div>
            </div>
            <div class="fee-content-details-line" v-if="detailsParameters.hashId !== null && (orderStatus !== 0 && orderStatus !== 6)">
              <div class="title">{{ $t('nav.payResult_feeHash') }}</div>
              <div class="value">{{ detailsParameters.hashId }}</div>
            </div>
            <div class="fee-content-details-line" v-if="orderStatus === 0 || orderStatus === 6">
              <div class="title">{{ $t('nav.payResult_createdTime') }}</div>
              <div class="value">{{ detailsParameters.createdTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="continue" @click="goHome">
      {{ backText }}
      <img class="rightIcon" src="../../../assets/images/button-right-icon.svg" alt="">
    </button>
  </div>
</template>

<script>
export default {
  data(){
    return{
      orderStatus: '', // 5: success 0: error 6: timeOut
      detailsParameters: {},
      countDown: null,
      detailsState: false,
      detailsTitleState: true,
    }
  },
  activated(){
    this.queryDetails()
  },
  computed:{
    backText(){
      let merchantInfo = sessionStorage.getItem("accessMerchantInfo") ? JSON.parse(sessionStorage.getItem("accessMerchantInfo")) : '{}';
      if(sessionStorage.getItem("accessMerchantInfo") !== '{}' && merchantInfo.redirectUrl && merchantInfo.redirectUrl !== ''){
        return this.$t('nav.result_returnText_merchant');
      }
      return this.$t('nav.orderRsult');
    },
    resultText(){
      if(this.orderStatus >= 3 && this.orderStatus <= 4){
        return `${this.$t('nav.result_stateTo4_your')} ${ this.detailsParameters.amount } ${ this.detailsParameters.cryptoCurrency } ${this.$t('nav.result_stateTo4')}`;
      }
      if(this.orderStatus === 5){
        return `${ this.detailsParameters.amount } ${ this.detailsParameters.cryptoCurrency } ${this.$t('nav.result_stateTo5')}`
      }
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

          (res.data.orderStatus === 0 || res.data.orderStatus === 5 || res.data.orderStatus === 6) ?  (window.clearInterval(this.countDown),this.countDown=null) : '';

          if(res.data.orderStatus === 0 || res.data.orderStatus === 6){
            this.detailsState = true;
            this.detailsTitleState = false;
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

    //Judgment order status display text
    judgeChannel(){
      if(this.orderStatus >= 3 && this.orderStatus <= 4){
        this.resultText = `${this.$t('nav.result_stateTo4_your')} ${ this.detailsParameters.amount } ${ this.detailsParameters.cryptoCurrency } ${this.$t('nav.result_stateTo4')}`;
        return;
      }
      if(this.orderStatus === 5){
        this.resultText = `${ this.detailsParameters.amount } ${ this.detailsParameters.cryptoCurrency } ${this.$t('nav.result_stateTo5')}`
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
    window.clearInterval(this.countDown);
    this.countDown = null;
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

    .borderNone{
      border: none!important;
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
          //margin-right: 0.34rem;
          width: 1.4rem;
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
