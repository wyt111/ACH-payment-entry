<template>
  <div class="cardConfigPayment">
    <div class="cardConfigPayment-content">
      <indonesianDetails />
      <div class="payAmountInfo-title">Pay Card</div>
      <div class="card-info">
        <div class="card-value" @click="goPayForm">
          <div class="card-left">
            <div class="card-number">{{ cardData.cardNumber.replace(/\s/g,'').replace(/....(?!$)/g,'$& ') }}</div>
            <div class="card-name">{{ cardData.firstname }} {{ cardData.lastname }}</div>
          </div>
          <div class="rightIcon"><img src="../../../assets/images/rightIcon.png"></div>
        </div>
        <div class="card-logo">
          <img src="../../../assets/images/visaIcon.png">
        </div>
      </div>
    </div>
    <div class="continue" @click="submit">Continue</div>
  </div>
</template>

<script>
import indonesianDetails from "../../../components/indonesianDetails";

export default {
  name: "configPayment",
  components: { indonesianDetails },
  data(){
    return{
      cardData: {},
      timeDown: null,
      submitState: true
    }
  },
  mounted(){
    this.reviceInfo();
  },
  methods: {
    reviceInfo(){
      this.cardData = JSON.parse(this.$route.query.submitForm);
    },

    goPayForm(){
      this.submitState === true ? this.$router.push(`/internationalCardPay?routerParams=${this.$route.query.routerParams}&submitForm=${this.$route.query.submitForm}`) : '';
    },

    submit(){
      //submitState - submit state
      if(this.submitState === true){
        this.submitState = false;
        let newParams = {};
        newParams.orderNo = JSON.parse(this.$route.query.routerParams).orderNo;
        newParams.userCardId = JSON.parse(this.$route.query.submitForm).userCardId;
        this.$axios.post(this.$api.post_internationalCard,newParams,'submitToken').then(res=>{
          if(res && res.returnCode === '0000'){
            this.timeDown = setInterval(()=>{
              let params = {
                "orderNo": JSON.parse(this.$route.query.routerParams).orderNo
              }
              this.$axios.get(this.$api.get_payResult,params).then(res=>{
                if(res.data.orderStatus && res.data.orderStatus > 2 && res.data.orderStatus <= 6){
                  // Clear create order token
                  localStorage.removeItem("submit-token");
                  this.submitState = true;
                  this.$router.replace(`/paymentReSult?routerParams=${this.$route.query.routerParams}&submitForm=${this.$route.query.submitForm}&orderNo=${JSON.parse(this.$route.query.routerParams).orderNo}`);
                }
              })
            },1000)
          }else {
            this.submitState = true;
          }
        })
      }
    }
  },
  destroyed(){
    clearInterval(this.timeDown);
  }
}
</script>

<style lang="scss" scoped>
.cardConfigPayment{
  display: flex;
  flex-direction: column;
  .cardConfigPayment-content{
    flex: 1;
    overflow: auto;
  }
}

.payAmountInfo-title{
  font-size: 0.14rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #232323;
  margin-top: 0.2rem;
}
.card-info{
  display: flex;
  align-items: center;
  margin-top: 0.1rem;
  .card-value{
    cursor: pointer;
    min-height: 1.05rem;
    background: #F3F4F5;
    border-radius: 10px;
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 0.2rem;
    margin-right: 0.2rem;
    .card-left{
      font-size: 0.16rem;
      font-family: Jost-Medium, Jost;
      font-weight: 500;
      color: #232323;
      .card-name{
        margin-top: 0.2rem;
      }
    }
    .rightIcon{
      width: 0.12rem;
      margin-left: auto;
      display: flex;
      align-items: center;
      img{
        width: 100%;
      }
    }
  }
  .card-logo{
    width: 0.6rem;
    margin-left: auto;
    display: flex;
    align-items: center;
    img{
      width: 100%;
    }
  }
}

.continue{
  height: 0.6rem;
  line-height: 0.6rem;
  text-align: center;
  background: #4479D9;
  border-radius: 4px;
  font-size: 0.18rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #FAFAFA;
  margin: 0.2rem 0;
  cursor: pointer;
}
</style>
