<template>
  <div id="tradeHistory">
    <div class="noData" v-if="historyList.length===0">
      <div class="noDataImg"><img src="../../assets/images/noData.png"></div>
      <div class="noDataText">No transactions</div>
      <p>Buy some crypto to get started</p>
      <div class="continue" @click="goHome">Buy crypto now <img src="../../assets/images/slices/rightIcon.png" alt=""></div>
    </div>
    <div class="historyList" v-else>
      <van-list v-model="loading" :finished="finished" finished-text="No more" @load="onLoad" loading-text="Loading" error-text="Loading failed">
        <div class="van-clearfix">
          <div class="float-item" v-for="(item,index) in historyList" :key="index">
            <div class="historyLi_header">
              <div class="time">{{ item.createdTime }}</div>
              <div class="state">
                <span v-if="Number(item.orderState) === 4" class="state_success">Processing</span>
                <span v-if="Number(item.orderState) === 5" class="state_success">Complete</span>
<!--                <span v-if="item.orderState === 0" class="state_error">fail</span>-->
<!--                <span v-if="item.orderState === 2 || item.orderState === 3" class="state_loading">Transferring</span>-->
              </div>
            </div>
            <div class="details_line">
              <div class="details_line_title">Amount:</div>
              <div class="details_line_value">{{ item.fiatCurrencySymbol }}{{ item.amount }}</div>
            </div>
            <div class="details_line">
              <div class="details_line_title">{{ item.cryptoCurrency }} price:</div>
              <div class="details_line_value">{{ item.cryptoCurrencyPrice }}{{ item.fiatCurrency }}</div>
            </div>
            <div class="details_line">
              <div class="details_line_title">Crypto:</div>
              <div class="details_line_value">{{ item.cryptoCurrencyVolume }}{{ item.cryptoCurrency }}</div>
            </div>
            <div class="details_line" >
              <div class="details_line_title">
                <span v-if="item.depositType===1">ACH Wallet:</span>
                <span v-if="item.depositType===2">Address:</span>
              </div>
              <div class="details_line_value address_value">{{ item.address }}</div>
            </div>
            <div class="details_line" v-if="item.hashId">
              <div class="details_line_title">Hash ID:</div>
              <div class="details_line_value">{{ item.hashId }}</div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>

export default {
  name: "Trade History",
  data(){
    return{
      query: {
        orderState: 4,
        orderType: 1,
        pageIndex: 1,
        pageSize: 5
      },
      historyList: [],

      loading: false,
      finished: false,
    }
  },
  activated(){
    this.queryTransactionHistory();
  },
  methods:{
    goHome(){
      this.$router.push('/')
    },
    queryTransactionHistory(){
      let _this = this;
      this.$axios.get(this.$api.get_transactionHistory,this.query).then(res=>{
        if(res.data){
          let newArray = res.data.result;
          _this.historyList = _this.historyList.concat(newArray);
          _this.loading = false;
          if (_this.historyList.length === res.data.total) {
            _this.finished = true;
          }
        }
      })
    },
    onLoad() {
      setTimeout(() => {
        this.query.pageIndex += 1;
        this.queryTransactionHistory();
      }, 1000);
    },
  }
}
</script>

<style lang="scss" scoped>
html,body,#tradeHistory,.historyList,.van-list{
  height: 100%;
}
#tradeHistory{
  .float-item{
    background: #FFFFFF;
    border-radius: 10px;
    border: 1px solid #232323;
    margin-top: 0.2rem;
    .historyLi_header{
      display: flex;
      align-items: center;
      font-size: 0.16rem;
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      color: #232323;
      height: 0.64rem;
      padding: 0 0.2rem;
      border-bottom: 1px solid #F3F4F5;
      .state{
        margin-left: auto;
        color: #02AF38;
        .state_success{
          color: #02AF38;
        }
        .state_loading{
          color: #FFA400;
        }
        .state_error{
          color: red;
        }
      }
    }

    .details_line{
      font-size: 0.16rem;
      font-family: "GeoDemibold", GeoDemibold;
      font-weight: 400;
      color: #232323;
      display: flex;
      align-items: flex-start;
      margin-top: 0.2rem;
      padding: 0 0.2rem;
      &:nth-of-type(2){
        margin-top: 0.1rem;
      }
      &:last-child{
        padding-bottom: 0.2rem;
      }
      .details_line_value{
        max-width: 60%;
        word-wrap: break-word;
        font-weight: 500;
        margin-left: auto;
      }
      .address_value{
        margin-right: -0.06rem;
      }
    }
  }

  .noData{
    width: 3rem;
    height: 3rem;
    text-align: center;
    margin: 0 auto;
    .noDataImg{
      display: flex;
      justify-content: center;
      margin-top: 1rem;
      img{
        width: 1rem;
      }
    
    }
      p{
        font-size: .15rem;
        font-family: GeoLight;
        font-weight: normal;
        color: #707070;
        margin: .08rem 0 .16rem 0;
      }
    .noDataText{
      text-align: center;
      margin-top: 0.08rem;
      font-size: .21rem;
      font-family:GeoDemibold;
      font-weight: normal;
      color: #000000;
    }
    .continue{
      width: 90%;
      height: 0.6rem;
      background: #4479D9;
      border-radius: .29rem;
      text-align: center;
      line-height: 0.6rem;
      font-size: 0.18rem;
      font-family: GeoRegular;
      font-weight: 500;
      color: #FAFAFA;
      cursor: pointer;
      position: absolute;
      left: 5%;
      img{
        width: .24rem;
        position: absolute;
        right: .16rem;
        top: .18rem;
      }
    }
  }
}
</style>
