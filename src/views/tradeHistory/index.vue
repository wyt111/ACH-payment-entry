<template>
  <div id="tradeHistory">
    <div class="historyList" v-if="judgeData">
      <div class="historyLi">
        <div class="historyLi_header">
          <div class="time">2022-02-24  12:34:45</div>
          <div class="state">Complete</div>
        </div>
        <div class="details_line">
          <div class="details_line_title">Amount:</div>
          <div class="details_line_value">$30.00</div>
        </div>
        <div class="details_line">
          <div class="details_line_title">Crypto:</div>
          <div class="details_line_value">18.67</div>
        </div>
        <div class="details_line">
          <div class="details_line_title">Address:</div>
          <div class="details_line_value">43df765xzZ326575432</div>
        </div>
        <div class="details_line">
          <div class="details_line_title">Hash ID:</div>
          <div class="details_line_value">43df765xzZ326575432</div>
        </div>
      </div>

      <!-- state: Transferring -->
      <div class="historyLi">
        <div class="historyLi_header">
          <div class="time">2022-02-24  12:34:45</div>
          <div class="state">Transferring</div>
        </div>
        <div class="details_line">
          <div class="details_line_title">Amount:</div>
          <div class="details_line_value">$30.00</div>
        </div>
        <div class="details_line">
          <div class="details_line_title">Crypto:</div>
          <div class="details_line_value">18.67</div>
        </div>
        <div class="details_line">
          <div class="details_line_title">ACH Wallet:</div>
          <div class="details_line_value">43df765xzZ@qq.com</div>
        </div>
      </div>

      <div class="historyLi">
        <div class="historyLi_header">
          <div class="time">2022-02-24  12:34:45</div>
          <div class="state">Complete</div>
        </div>
        <div class="details_line">
          <div class="details_line_title">Amount:</div>
          <div class="details_line_value">$30.00</div>
        </div>
        <div class="details_line">
          <div class="details_line_title">Crypto:</div>
          <div class="details_line_value">18.67</div>
        </div>
        <div class="details_line">
          <div class="details_line_title">Address:</div>
          <div class="details_line_value">43df765xzZ326575432</div>
        </div>
      </div>
    </div>
    <div class="noData" v-else>
      <div class="noDataImg"><img src="../../assets/images/noData.png"></div>
      <div class="noDataText">No transactions</div>
      <div class="continue" @click="goHome">Buy Crypto</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Trade History",
  data(){
    return{
      judgeData: false,
    }
  },
  methods:{
    goHome(){
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
#tradeHistory{
  .historyLi{
    background: #FFFFFF;
    border-radius: 10px;
    border: 1px solid #232323;
    margin-top: 0.2rem;
    .historyLi_header{
      display: flex;
      align-items: center;
      font-size: 0.16rem;
      font-family: Jost-Medium, Jost;
      font-weight: 500;
      color: #232323;
      height: 0.64rem;
      padding: 0 0.2rem;
      border-bottom: 1px solid #F3F4F5;
      .state{
        margin-left: auto;
        color: #02AF38;
      }
    }

    .details_line{
      font-size: 0.16rem;
      font-family: Jost-Regular, Jost;
      font-weight: 400;
      color: #232323;
      display: flex;
      align-items: center;
      margin-top: 0.2rem;
      padding: 0 0.2rem;
      &:nth-of-type(2){
        margin-top: 0.1rem;
      }
      &:last-child{
        padding-bottom: 0.2rem;
      }
      .details_line_value{
        font-weight: 500;
        margin-left: auto;
      }
    }
  }

  .noData{
    width: 2rem;
    height: 3rem;
    margin: 0 auto;
    .noDataImg{
      display: flex;
      justify-content: center;
      margin-top: 1rem;
      img{
        width: 2rem;
      }
    }
    .noDataText{
      text-align: center;
      margin-top: 0.4rem;
      font-size: 0.14rem;
      font-family: Jost-Medium, Jost;
      font-weight: 500;
      color: #AFC5D8;
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
      cursor: pointer;
      position: fixed;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
