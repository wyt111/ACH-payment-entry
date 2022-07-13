<template>
  <div id="tradeHistory-details">
    <div class="content">
      <div class="line-height1">
        <div class="left">Sell USDT</div>
        <div class="right">
          <div class="statusView">
            <div></div>
            <div>Block Confirmed (5/15) </div>
          </div>
          <div class="statusView completed">
            <div></div>
            <div>Completed</div>
          </div>
          <div class="statusView failed1">
            <div></div>
            <div>Failed</div>
          </div>
          <div class="statusView failed2">
            <div></div>
            <div>Failed</div>
          </div>
        </div>
      </div>
      <div class="amountInfo">
        <div class="amountInfo-line">
          <div class="left">Order Amount (USDT)</div>
          <div class="right">
            <span class="value"></span>
            <span class="empty">-- </span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Actual Amount (USDT)</div>
          <div class="right">
            <span class="value"></span>
            <span class="empty">-- </span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Price (USD)</div>
          <div class="right">
            <span class="value"></span>
            <span class="empty">-- </span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Total (USD)</div>
          <div class="right">
            <span class="value"></span>
            <span class="empty">-- </span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Ramp Fee (USD)</div>
          <div class="right">
            <span class="value"></span>
            <span class="empty">-- </span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Final Total (USD)</div>
          <div class="right">
            <span class="value"></span>
            <span class="empty">-- </span>
          </div>
        </div>
      </div>

      <div class="orderStatus">
        <div class="title">
          <div class="left">Status</div>
          <div class="right">
            <span>Block Confirmed</span>
            <span class="completed">Completed</span>
            <span class="failed1">Failed</span>
            <span class="failed2">Failed</span>
          </div>
        </div>
        <div class="speed-progress"></div>
      </div>

      <div class="orderInfo">
        <div class="amountInfo-line">
          <div class="left">Order ID:</div>
          <div class="right">
            <div class="copyView">
              <div class="copyValue">12345678923ddavfseerh</div>
              <div class="icon"><img src="@/assets/images/copy_history.svg" alt=""></div>
            </div>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Order Time:</div>
          <div class="right">
            <span class="value">2022-06-10 15:40:03</span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Confirmed Time:</div>
          <div class="right">
            <span class="value">2022-06-10 15:40:03</span>
          </div>
        </div>
        <!-- Completed -->
        <div class="amountInfo-line">
          <div class="left">Transfer Time:</div>
          <div class="right">
            <span class="value">2022-06-10 15:40:03</span>
          </div>
        </div>
        <!-- Failed - 2 -->
        <div class="amountInfo-line">
          <div class="left">Refund Time:</div>
          <div class="right">
            <span class="value">2022-06-10 15:40:03</span>
          </div>
        </div>
      </div>

      <div class="orderInfo">
        <div class="amountInfo-line">
          <div class="left">Network:</div>
          <div class="right">
            <span class="value">Trc20</span>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Address:</div>
          <div class="right">
            <div class="copyView">
              <div class="copyValue">0dx2accsdvergbrvw</div>
              <div class="icon"><img src="@/assets/images/copy_history.svg" alt=""></div>
            </div>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">TxID:</div>
          <div class="right">
            <div class="copyView">
              <div class="copyValue">adeqdxsfcavbvergbrvw</div>
              <div class="icon"><img src="@/assets/images/copy_history.svg" alt=""></div>
            </div>
          </div>
        </div>
        <div class="amountInfo-line">
          <div class="left">Recipient Account:</div>
          <div class="right">
            <span class="value">Mastercard  **** 8111</span>
          </div>
        </div>
      </div>
    </div>

    <!-- failed - 1 -->
    <footer>
      <button @click="updateCardInfo">
        Update Information
        <span class="witchBank">Mastercard</span>
        <span class="bankCard">****8111</span>
        <img src="@/assets/images/right_icon_orange.svg" alt="">
      </button>
        <p @click="refund">Request Refund of USDT</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "tradeHistory-details",
  methods: {
    updateCardInfo(){
      this.$router.push(`/sell-formUserInfo`);
    },
    refund(){
      this.$router.push(`/Refund?currency=${'USDT'}`);
    }
  }
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
        .statusView{
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
        .completed{
          color: #0AB24D;
          div:first-child{
            background: #0AB24D;
          }
        }
        .failed1{
          color: #FF8D24;
          div:first-child{
            background: #FF8D24;
          }
        }
        .failed2{
          color: #1EC109;
          div:first-child{
            background: #1EC109;
          }
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
        .copyView{
          display: flex;
          align-items: center;
          cursor: pointer;
          .copyValue{
            font-family: 'SF Pro Display';
            font-style: normal;
            font-weight: 500;
            font-size: 0.13rem;
            color: #949EA4;
          }
          .icon{
            display: flex;
            align-items: center;
            margin-left: 0.12rem;
            img{
              width: 0.2rem;
            }
          }
        }
      }
    }

    .orderStatus{
      min-height: 0.25rem;
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
          .completed{
            font-family: 'SF Pro Display';
            font-style: normal;
            font-weight: 400;
            font-size: 0.13rem;
            color: #0AB24D;
          }
          .failed1{
            color: #FF8D24;
          }
          .failed2{
            color: #FF2F2F;
          }
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
    .orderInfo{
      width: 100%;
      min-height: 1.2rem;
      background: #F7F8FA;
      border-radius: 0.06rem;
      padding: 0.2rem 0.16rem;
      margin-top: 0.16rem;
      .amountInfo-line:first-child{
        margin-top: 0;
      }
      &:last-child{
        margin-top: 0.12rem;
      }
    }
  }
  footer{
    padding-top: 0.16rem;
    box-shadow: 0 0 0.35rem rgba(89, 153, 248, 0.1);
    button{
      width: 100%;
      height: 0.56rem;
      background: #FFEEDE;
      border: 1px solid #FFDAB8;
      border-radius: 0.28rem;
      font-family: 'SF Pro Display';
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      color: #FF8D24;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .witchBank{
        margin-left: 0.12rem;
        font-style: normal;
        font-weight: 400;
        font-size: 0.1rem;
        color: #FF8D24;
      }
      .bankCard{
        margin-left: 0.04rem;
        font-family: 'SF Pro Display';
        font-style: normal;
        font-weight: 400;
        font-size: 0.1rem;
        color: #FF8D24;
      }
      img{
        width: 0.16rem;
        margin-left: 0.08rem;
      }
    }
    p{
      min-height: 0.14rem;
      font-family: 'SF Pro Display';
      font-style: normal;
      font-weight: 400;
      font-size: 0.13rem;
      color: #0059DA;
      margin-top: 0.16rem;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
