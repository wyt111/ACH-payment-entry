<template>
  <div id="tradeHistory">
    <div class="noData" v-if="historyList.length===0">
      <div class="noDataImg"><img src="../../assets/images/noData.png"></div>
      <div class="noDataText">{{ $t('nav.history_noListText') }}</div>
      <p>{{ $t('nav.history_noListText2') }}</p>
      <button class="continue" @click="goHome">
        {{ $t('nav.history_noListButton') }}
        <img class="rightIcon" src="../../assets/images/slices/rightIcon.png" alt="">
      </button>
    </div>
    <div class="historyList" v-else>
      <van-list v-model="loading" :finished="finished" :finished-text="$t('nav.history_noMore')" @load="onLoad" loading-text="Loading" error-text="Loading failed">
        <div class="van-clearfix">
          <div class="float-item" v-for="(item,index) in historyList" :key="index">
            <div class="historyLi_header">
              <div class="historyLi_header_left">
                <div class="cryptoCurrencyIcon"><img :src="item.cryptoCurrencyIcon"></div>
                <div>
                  <div class="cryptoCurrencyName">{{ item.cryptoCurrency }}</div>
                  <div class="time">{{ item.createdTime }}</div>
                </div>
              </div>
              <div class="state">
                <span v-if="item.orderState === 1 || item.orderState === 2" class="state_loading">{{ $t('nav.history_state_Processing') }}</span>
                <span v-if="item.orderState === 3 || item.orderState === 4" class="state_loading">{{ $t('nav.history_state_Transfer') }}</span>
                <span v-if="item.orderState === 5" class="state_success">{{ $t('nav.history_state_Complete') }}</span>
                <!--                <span v-if="item.orderState === 0" class="state_error">fail</span>-->
<!--                <span v-if="item.orderState === 2 || item.orderState === 3" class="state_loading">Transferring</span>-->
              </div>
            </div>
            <div class="details_line">
              <div class="details_line_title">{{ $t('nav.history_listTitle1') }}:</div>
              <div class="details_line_value">{{ item.orderNo }}</div>
            </div>
            <div class="details_line">
              <div class="details_line_title">{{ $t('nav.payResult_feeAmount') }}:</div>
              <div class="details_line_value">{{ item.fiatCurrencySymbol }}{{ item.amount }}</div>
            </div>
            <div class="details_line">
              <div class="details_line_title">{{ item.cryptoCurrency }} {{ $t('nav.fee_listTitle_price') }}:</div>
              <div class="details_line_value">{{ item.fiatCurrencySymbol }}{{ item.cryptoCurrencyPrice }}</div>
            </div>
            <div class="details_line">
              <div class="details_line_title">{{ $t('nav.history_listTitle2') }}:</div>
              <div class="details_line_value">{{ item.cryptoCurrencyVolume }}{{ item.cryptoCurrency }}</div>
            </div>
            <div class="details_line" >
              <div class="details_line_title">
                <span v-if="item.depositType===1">ACH {{ $t('nav.payResult_feeWallet') }}:</span>
                <span v-if="item.depositType===2">{{ $t('nav.payResult_feeAddress') }}:</span>
              </div>
              <div class="details_line_value address_value">{{ item.address }}</div>
            </div>
            <div class="details_line" v-if="item.hashId">
              <div class="details_line_title">{{ $t('nav.history_listTitle3') }}:</div>
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
        orderState: 1,
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
    this.query = {
      orderState: 1,
      orderType: 1,
      pageIndex: 1,
      pageSize: 5
    };
    this.historyList = [];
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
          let newArray = res.data.result.filter(item=>{return item.orderState !== 0 && item.orderState !== 6});
          _this.historyList = _this.historyList.concat(newArray);
          _this.loading = false;
          if ((_this.query.pageIndex * _this.query.pageSize) > res.data.total || _this.historyList.length === res.data.total){
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
  padding-top: 0.24rem;
  .float-item{
    background: #FFFFFF;
    border-radius: 0.1rem;
    border: 1px solid #E2E1E5;
    margin-top: 0.24rem;
    &:first-child{
      margin-top: 0;
    }
    .historyLi_header{
      display: flex;
      align-items: center;
      font-size: 0.17rem;
      font-family: "GeoRegular", GeoRegular;
      font-weight: normal;
      color: #232323;
      min-height: 0.68rem;
      padding: 0 0.16rem;
      border-bottom: 1px solid #E2E1E5;
      .historyLi_header_left{
        display: flex;
        align-items: center;
        .cryptoCurrencyIcon{
          display: flex;
          align-content: center;
          img{
            width: 36px;
            height: 36px;
            border-radius: 50%;
          }
        }
        .cryptoCurrencyName{
          min-height: 0.17rem;
          font-size: 0.17rem;
          font-family: "GeoDemibold", GeoDemibold;
          font-weight: normal;
          color: #232323;
          margin-left: 0.08rem;
          margin-top: 0.05rem;
        }
        .time{
          font-size: 0.11rem;
          font-family: "GeoLight", GeoLight;
          font-weight: normal;
          color: #707070;
          margin-left: 0.08rem;
        }
      }
      .state{
        margin-left: auto;
        color: #02AF38;
        .state_success{
          color: #02AF38;
        }
        .state_loading{
          color: #0059DA;
        }
        .state_error{
          color: #E55643;
        }
      }
    }

    .details_line{
      font-size: 0.15rem;
      font-family: "GeoLight", GeoLight;
      font-weight: normal;
      color: #232323;
      display: flex;
      align-items: flex-start;
      margin-top: 0.12rem;
      padding: 0 0.16rem;
      &:nth-of-type(2){
        margin-top: 0.16rem;
      }
      &:last-child{
        padding-bottom: 0.16rem;
      }
      .details_line_value{
        max-width: 60%;
        word-wrap: break-word;
        font-weight: 500;
        margin-left: auto;
      }
      .address_value{
        margin-right: -0.06rem;
        font-size: 0.15rem;
        font-family: "GeoDemibold", GeoDemibold;
        font-weight: normal;
        color: #232323;
      }
    }
  }

  .noData{
    //height: 3rem;
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
      font-size: 0.15rem;
      font-family: "GeoLight",GeoLight;
      font-weight: normal;
      color: #707070;
      margin: 0.08rem 0 0 0;
    }
    .noDataText{
      text-align: center;
      margin-top: 0.08rem;
      font-size: 0.21rem;
      font-family: "GeoDemibold",GeoDemibold;
      font-weight: normal;
      color: #000000;
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
    .continue:disabled{
      background: rgba(0, 89, 218, 0.5);
      cursor: no-drop;
    }
  }
}
</style>
