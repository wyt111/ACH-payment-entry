<template>
  <div id="tradeHistory-details">
    <div class="content">
      <div class="line-height1">
        <div class="left">Sell USDT</div>
        <div class="right">
          <div></div>
          <div>Block Confirmed (5/15) </div>
        </div>
      </div>
      <div class="amountInfo">
        <div class="amountInfo-line">
          <div class="left">Order Amount (USDT)</div>
          <div class="right">
            <span class="valua"></span>
            <span class="empty">-- </span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Actual Amount (USDT)</div>
          <div class="right">
            <span class="valua"></span>
            <span class="empty">-- </span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Price (USD)</div>
          <div class="right">
            <span class="valua"></span>
            <span class="empty">-- </span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Total (USD)</div>
          <div class="right">
            <span class="valua"></span>
            <span class="empty">-- </span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Ramp Fee (USD)</div>
          <div class="right">
            <span class="valua"></span>
            <span class="empty">-- </span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Final Total (USD)</div>
          <div class="right">
            <span class="valua"></span>
            <span class="empty">-- </span>
          </div>
        </div>
      </div>

      <div class="orderStatus">
        <div class="title">
          <div class="left">Status</div>
          <div class="right">Block Confirmed</div>
        </div>
        <div class="speed-progress"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tradeHistory-details"
}
</script>

<style lang="scss" scoped>
#tradeHistory-details{
  display: flex;
  flex-direction: column;
  .content{
    flex: 1;
    overflow: auto;
    .line-height1{
      min-height: 0.18rem;
      display: flex;
      align-items: center;
      margin-top: 0.32rem;
      padding-bottom: 0.16rem;
      border-bottom: 1px solid #F4F4F4;
      .right{
        margin-left: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'SF Pro Display';
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        color: #0059DA;
        div:first-child{
          width: 0.05rem;
          height: 0.05rem;
          border-radius: 50%;
          background: #0059DA;
          margin-right: 0.04rem;
        }
      }
    }

    .amountInfo-line{
      min-height: 0.14rem;
      display: flex;
      align-items: center;
      font-family: 'SF Pro Display';
      font-style: normal;
      font-weight: 400;
      font-size: 0.13rem;
      color: #949EA4;
      margin-top: 0.16rem;
      .right{
        margin-left: auto;
        .empty{
          font-family: 'SF Pro Display';
          font-style: normal;
          font-weight: 400;
          font-size: 0.13rem;
          color: #949EA4;
        }
        .value{
          font-family: 'SF Pro Display';
          font-style: normal;
          font-weight: 500;
          font-size: 0.13rem;
          color: #063376;
        }
      }
    }

    .orderStatus{
      margin-top: 0.16rem;
      .title{
        display: flex;
        align-items: center;
        font-family: 'SF Pro Display';
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        color: #949EA4;
        .right{
          margin-left: auto;
          font-family: 'SF Pro Display';
          font-style: normal;
          font-weight: 400;
          font-size: 0.13rem;
          color: #0059DA;
        }
      }
      .speed-progress{
        width: 100%;
        height: 0.04rem;
        background: #F7F8FA;
        border-radius: 0.04rem;
        margin-top: 0.08rem;
      }
    }
  }
}
</style>
