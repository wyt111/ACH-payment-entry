<template>
  <div class="sellState-container">
    <div class="sellState_nav">
      <p>Order Status</p>
      <img @click="goSellOrder" src="@/assets/images/ShutDown.png" alt="">
    </div>
    <div class="sellState_content">
      <div class="sellState" >
          <img v-if="[0].includes(orderStateData.orderStatus)" src="@/assets/images/stateSell/icon1_no.png" alt="">
          <img v-else-if="[1].includes(orderStateData.orderStatus)"  src="@/assets/images/stateSell/icon1_In.png" alt="">
          <img v-else-if="[2,3,4,5,6,7].includes(orderStateData.orderStatus)" src="@/assets/images/stateSell/icon1_finish.png" alt="">
        <div class="sellState_right" >
          <p :style="{ color:orderStateData.orderStatus==0?'#949EA4':'' }">Crypto Sent</p>
          <p v-if="orderStateData.orderStatus!==0" style="color:#0059DA">Block confirmed ( {{ orderStateData.blockNumber?orderStateData.blockNumber:0 }} / {{ orderStateData.confirmedNum }} )</p>
        </div>
      </div>
      <img class="line" :src="[0,1].includes(orderStateData.orderStatus)?line.LineImg:line.LineImgActive" alt="">
    </div>
    <div class="sellState_content">
      <div class="sellState" >
          <img v-if="[0,1].includes(orderStateData.orderStatus)" src="@/assets/images/stateSell/icon2_no.png" alt="">
          <img v-else-if="[2].includes(orderStateData.orderStatus)" src="@/assets/images/stateSell/icon2_In.png" alt="">
          <img v-else-if="[2,3,4,5,6,7].includes(orderStateData.orderStatus)" src="@/assets/images/stateSell/icon2_fil.png" alt="">
        <div class="sellState_right" >
          <p :style="{ color:[0,1,2].includes(orderStateData.orderStatus)?'#949EA4':'' }">Confirm Order</p>
          <p v-if="[3,4,5,6,7].includes(orderStateData.orderStatus)" style="color:#0059DA">Your order has been confirmed</p>
        </div>
      </div>
      <img class="line" :src="[0,1,2].includes(orderStateData.orderStatus)?line.LineImg:line.LineImgActive" alt="">
    </div>
    <div class="sellState_content">
      <div class="sellState" >
          <img v-if="[0,1,2].includes(orderStateData.orderStatus)" src="@/assets/images/stateSell/icon3_no.png" alt="">
          <img  v-else-if="[3].includes(orderStateData.orderStatus)" src="@/assets/images/stateSell/icon3_In.png" alt="">
          <img v-else-if="[4,5,6,7].includes(orderStateData.orderStatus)" src="@/assets/images/stateSell/icon3_fil.png" alt="">
        <div class="sellState_right">
          <p :style="{ color:[0,1,2,3].includes(orderStateData.orderStatus)?'#949EA4':'' }">In Transfer</p>
          <p v-if="[4,5,6,7].includes(orderStateData.orderStatus)" style="color:#0059DA">Your fiat is in transfer</p>
        </div>
      </div>
      <img class="line" :src="[0,1,2,3].includes(orderStateData.orderStatus)?line.LineImg:line.LineImgActive" alt="">
    </div>
    <div class="sellState_content">
      <div class="sellState" >
          <img v-if="[0,1,2,3].includes(orderStateData.orderStatus)" src="@/assets/images/stateSell/icon4_no.png" alt="">
          <img v-else-if="orderStateData.orderStatus==4" src="@/assets/images/stateSell/icon4_In.png" alt="">
          <img v-else-if="orderStateData.orderStatus==5" src="@/assets/images/stateSell/icon4_fil.png" alt="">
          <img v-else-if="orderStateData.orderStatus==6 || orderStateData.orderStatus==7" src="@/assets/images/stateSell/icon4_error.png" alt="">
        <div class="sellState_right">
          <p :style="{ color:[0,1,2,3].includes(orderStateData.orderStatus)?'#949EA4':'' }">{{orderStateData.orderStatus==5?'Success':orderStateData.orderStatus==6?'Fail':'Result'}}</p>
        </div>
      </div>
      
    </div>
    <div class="sellState_bottom">
      <p>You may leave this page. Order updates will be sent to your email and can be checked in the order history.</p>
      <div class="button" @click="$router.push('/tradeHistory')">
        <p>Order History</p>
        <img src="@/assets/images/rightIconSell.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:'sellState',
  props:{
    orderStateData:{
      default:''
    },

  },
  data(){
    return{
  
      line: {
          LineImg:require('@/assets/images/stateSell/Line.png'),
          LineImgActive:require('@/assets/images/stateSell/LineActive.png'),
        },
      state:2
    }
  },
  methods:{
    goSellOrder(){
    
      this.$store.state.nextOrderState = 1
      this.$router.replace('/')
    }
  }
}
</script>
<style lang="scss" scoped>
.sellState-container{
  width: 100%;
  .sellState_nav{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: .4rem;
    p{
      font-size: .18rem;
      color: #063376;
    }
    img{
      height: .11rem;
      cursor: pointer;
    }
  }
  .sellState_content{
    width: 100%;
    // margin-top: .08rem;
    .sellState{
      width: 100%;
      display: flex;
       img{
         width: .4rem;
       height: .4rem;
       margin-right: .16rem;
       border: none;
       }
     .sellState_right{
       display: flex;
       flex-direction: column;
       justify-content: center;
       p:nth-of-type(1){
         color: #063376;
         font-size: .16rem;
         line-height: .18rem;
         margin-top: .02rem;
       }
       p:nth-of-type(2){
         font-size: .13rem;
         color: #063376;
         line-height: .13rem;
         margin-top: .08rem;
       }
     }
    }
    .line{
      height: .45rem;
      margin-left: .2rem;
      margin-top: .08rem;
    }
  }
  .sellState_bottom{
    width: 88%;
    position: absolute;
    bottom: .2rem;
    left: 6%;
    cursor: pointer;
    >p{
      font-style: normal;
      line-height: 18px;
      font-size: 13px;
      color: #C2C2C2;
    }
    .button{
      width: 100%;
      height: .58rem;
      border-radius: .3rem;
      background: #0059DA;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: .16rem;
      p{
        color: #fff;
        margin-right: .12rem;
      }
      img{
        height: .12rem;
      }
    }
  }
}
</style>