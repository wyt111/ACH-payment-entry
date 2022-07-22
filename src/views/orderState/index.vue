<template>
  <div class="order-container" >
    <!-- {{ $store.state.nextOrderState }} -->
    <sendCrypto v-if="[0,1,7].includes(orderStateData.orderStatus) && $store.state.nextOrderState ===1 " :orderStateData="orderStateData"/>
   
    <sellState v-else :orderStateData="orderStateData"/>
     
  </div>

</template>
<script>

import {AES_Decrypt} from '../../utils/encryp'
// import IncludedDetailsSell from '../../components/IncludedDetailsSell'
import sendCrypto from './children/sendCrypto.vue'
import  sellState from './children/sellState'
export default{
  name:'orderState',
  components:{
    sendCrypto,
    sellState
    // IncludedDetailsSell
  },
  data(){
    return {
      NetworkCheck:require('../../assets/images/cardCheckIcon.png'),
      playMoneyState:0,
      show:false,
      orderStateData:{},
      Network:'',
      network1:'',
      Network_data:[],
      Network_show:false,
      Network_show1:false,
      timer:null,
      timeText:'',
      cardUserName:'',
      accountNumberCode:'',
      nextOrderState:1,
      feeInfo:'',
      

    }
  },
  methods:{
    //保留小数点两位或者6位
    // getToFixed(firstVal,lastVal){
    //   let decimalDigits = 0;
    //   let resultValue = firstVal - lastVal;
    //   resultValue >= 1 ? decimalDigits = 2 : decimalDigits = 6;
    //   let price = resultValue.toFixed(decimalDigits);
    //   isNaN(resultValue) || price <= 0 ? price = 0 : '';
    //   return price;

    // },

    // Network_isShow(){
    //   if(this.playMoneyState==3 || this.playMoneyState==2){
    //     this.Network_show = false
    //     this.Network_show1 = false
    //     return false
    //   }else{
    //     let _chiletWidth = document.documentElement.clientWidth
    //     if(_chiletWidth<750){
    //       this.Network_show = true
    //     }else{
    //       this.Network_show1 = !this.Network_show1
    //     }
    //   }
    // },
    //设置网络
    // SetNetwork(text){
    //   let _chiletWidth = document.documentElement.clientWidth

    //   if(_chiletWidth<750){
    //     this.Network_show = false
    //   }else{
    //     this.Network_show1 = false
    //   }

    //   if(this.Network.id === text.id){
    //     return false
    //   }

    //   let params = {
    //     // id:'15',
    //     id:this.$store.state.sellOrderId,
    //     cryptoCurrencyNetworkId:text.id
    //   }
    //   this.$axios.post(this.$api.post_sellConfirmOrder,params).then(res=>{
    //     if(res && res.data){
    //       this.orderStateData = res.data
    //       // this.$toast(res.returnMsg)
    //       this.Network = text
    //       return
    //     }
    //     this.$toast({
    //       duration: 3000,
    //       message: 'error'
    //     });
    //   })
    //   window.clearInterval(this.timer);
    //   this.timer = null;
    //   setTimeout(()=>{
    //         this.timer = setInterval(()=>{
    //           this.getCurrencyStatus()
    //           },1000)
    //       },2000)
    // },
    //获取网络列表
    // async  getNetworkList(){
    //   let params = {
    //     coin:this.$store.state.orderStatus.cryptoCurrency
    //   }
    //   let res  = await this.$axios.get(this.$api.get_networkList,params)
    //   if(res.returnCode == '0000' && res.data){
    //     this.Network_data = res.data
    //     this.$store.state.Sellorder_Network = res.data
    //     res.data.forEach(item => {
    //         if(item.network==this.orderStateData.cryptoCurrencyNetwork){
    //           this.Network = item
    //         }
    //       });
    //   }

    // },
    //获取买币状态
    getCurrencyStatus(){
      let sellOrderId = sessionStorage.getItem('sellOrderId')
      // console.log(this.$store.state.sellOrderId);
      let parmas = {
        // id:'140'
        id:this.$store.state.sellOrderId?this.$store.state.sellOrderId:sellOrderId
      }
      // console.log(parmas);
      this.$axios.get(this.$api.get_PlayCurrencyStatus,parmas).then(res=>{
        if(res && res.data){
          // res.data.orderStatus = 6
          // res.data.expirationTime=0
          this.orderStateData = res.data
          this.$store.state.orderStatus = res.data
          this.playMoneyState = res.data.orderStatus
          this.network1 = res.data.networkName
          if(this.orderStateData.orderStatus==2 && this.$store.state.nextOrderState == 1){
            this.$store.state.nextOrderState = 2
          }
          if(this.playMoneyState==7){
            window.clearInterval(this.timer);
            this.timer = null;
            return
          }
          if(this.playMoneyState==5){
            window.clearInterval(this.timer);
            this.timer = null;
            //  this.$store.replaceState({})
          }
          if(res.data.expirationTime<=0 || this.playMoneyState=== 7){
          //   // this.playMoneyState = 7
            this.orderStateData.orderStatus = 7
            this.$store.state.nextOrderState = 1
            // sessionStorage.setItem('feeParams',JSON.stringify(this.$store.state.feeParams))
            // sessionStorage.setItem('homeTabstate',JSON.stringify(this.$store.state.homeTabstate))
            // sessionStorage.setItem('cancelTokenArr',JSON.stringify(this.$store.state.cancelTokenArr))
            window.clearInterval(this.timer);
            this.timer = null;
            // this.$store.replaceState({})
            // this.$store.state.feeParams =  JSON.parse(sessionStorage.getItem('feeParams'))
            // this.$store.state.homeTabstate =  JSON.parse(sessionStorage.getItem('homeTabstate'))
            // this.$store.state.cancelTokenArr =  JSON.parse(sessionStorage.getItem('cancelTokenArr'))

            
            return
          }

          // if(res.data.orderStatus>0 &&(this.playMoneyState == 0||this.playMoneyState == 1) ){
          //   this.turnMinute(res.data.expirationTime)
          //   return
          // }else{
          //   this.turnMinute = null
          //   return false
          // }

        }
        // this.playMoneyState = 4
      })
    },
    //进入银行卡信息页
    // goBank(state,orderData){
    //   if(state == 6){
    //     let params = {
    //       id:orderData.userCardId,
    //     }
    //     this.$axios.get(this.$api.get_userSellCardInfo,params).then(res=>{
    //       if(res && res.returnCode =='0000'){
    //         this.$store.state.sellForm = res.data
    //         this.$store.state.sellForm.sellOrderId = orderData.id
    //         this.$store.state.cardInfoFromPath = 'sellOrder'
    //         this.$router.push('/sell-formUserInfo')
    //       }
    //     })

    //   }else{
    //     this.$toast(this.$t('nav.SellOrder_modified'))
    //     return
    //   }
    // },
    //Calculate minutes and seconds
    // turnMinute(value){
    //   if(value >= 0){
    //     var second = value;
    //     var minute=0;
    //     minute = parseInt(second/60);
    //     second%=60;
    //     // if(minute>60) {
    //     //   minute%=60;
    //     // }
    //     second = second>9?second:"0"+second;
    //     minute = minute>9?minute:"0"+minute;
    //     this.timeText = minute+":"+second;
    //     // console.log(this.timeText);
    //   }
    // },
   
    //解密了一些数据
    AES(value){
      if(value){
        return AES_Decrypt(value)
      }else{
        return value
      }

    }
  },

  watch:{

    //监听支付状态的变化请求卡信息
    // playMoneyState(newVal){
    //   if(newVal!==1||newVal!==2||newVal!==3){
    //     let params = {
    //       id:this.orderStateData.userCardId,
    //     }
    //     this.$axios.get(this.$api.get_userSellCardInfo,params).then(res=>{
    //       if(res.returnCode && res.data){
    //         // console.log(res.data);
    //         this.cardUserName = res.data
    //         this.accountNumberCode = this.AES(res.data.accountNumber)
    //       }
    //     })

    //   }
    // }
  },

  activated (){
    this.$route.query.id?sessionStorage.setItem('sellOrderId',this.$route.query.id):''
    this.$store.state.emailFromPath = 'sellOrder'
    this.getCurrencyStatus()
    this.timer = setInterval(()=>{
      this.getCurrencyStatus()
    },1000)
  




  },
  deactivated (){
    window.clearInterval(this.timer);
    this.timer = null;
    this.Network_show = false
    this.Network_show1 = false
    // this.$store.replaceState({})
  },
  mounted(){
    this.$route.query.id?sessionStorage.setItem('sellOrderId',this.$route.query.id):''
  }
}

</script>
<style lang="scss" scoped>


.order-container{
  // padding: 0 .2rem .3rem;
  // padding-bottom: .2rem;

  .timing{
    font-family: GeoLight;
    font-weight: 500;
    color: #232323;
    line-height: .23rem;
    font-size: .13rem;
    span{
      color: #E55643FF ;
      font-weight: 600;
      font-family: GeoLight;
    }
  }
  .order-state-title{
    font-size: .13rem;
    font-family: GeoRegular;
    // font-weight: 600;
    color: #707070;
    line-height: .23rem;
    margin: .1rem 0 .1rem 0;

  }
  .order-state{
    // padding: 0 .1rem 0;
    margin-top: .25rem;
    display: flex;
    justify-content: space-around;
    // align-items: center;
    font-family: GeoDemibold;
    font-size: .16rem;
    box-sizing: border-box;
    .state{
      div{
        width: .4rem;
        height: .4rem;
        border-radius: 50%;
        background: #EAEAEA;
        color: #ffffff;
        // text-align: center;
        // line-height: .4rem;
        // padding-top: .09rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

    }
    .state-content{
      display: flex;
      div{
        width: .06rem;
        height: .06rem;
        background: #EAEAEA;
        margin-left: .06rem;
        margin-top: .18rem;
        border-radius: 50%;
      }
      div:nth-of-type(4){
        margin-right: .09rem;
      }
    }
  }
  .order-state-content{
    display: flex;
    justify-content: space-between;
    margin-top: .1rem;
    div{
      width: 20%;
      font-family: GeoRegular;
      font-size: .13rem;
      color: #999999;
      line-height: .18rem;
      text-align: center;
    }
     div:nth-of-type(1){
       width: 18%;
       text-align: left;
      // margin-left: .1rem;
    }
    div:nth-of-type(2){
      margin-left: 0rem;
    }
    
     div:nth-of-type(4){
      //  width: 17%;
      text-align: right;
      margin-right: .05rem;
    }
  }
  .order-content{
    font-size: .13rem;
    font-family: GeoRegular;
    .order-title{
      margin: .32rem 0 .08rem 0;
      color: #707070;
    }
    .order-con{
      width: 100%;
      min-height: .5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: .19rem .2rem .19rem;
      background: #F3F4F5;
      border-radius: .12rem;
      p{
        width: 80%;
        font-size: .16rem;
        white-space: nowrap;
        overflow: hidden;
        font-family: GeoRegular;
        text-overflow: ellipsis;
        color:#232323;
      }
      img{
        height: .14rem;
      }
    }
  }
  .stateSuccessful{
    text-align: center;
    padding-top: .03rem;
     background: #02AF38 !important;
  }
  .stateLoading{
    text-align: center;
    padding-top: .03rem;
     background: #707070FF !important;
  }
  .stateError{
    text-align: center;
    padding-top: .03rem;
     background: #FF0000 !important;
  }
  .success{
    div{
      background:#02AF38 !important;
    }
  }
  // .Network-content:first-child{
  //   margin-top: .1rem;
  // }
  .Network-content{
    // height: .4rem;
    width: 90%;
    padding: .1rem .2rem .1rem;
    box-sizing: border-box;
    font-size: .14rem;
    font-family:GeoRegular ;
    border-bottom: 1px solid #EAEAEA;
    margin: .1rem 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
      img{
        height: .18rem;
      }
  }
  .qrcode{
    width: 3.4rem;
    height: 2.5rem;
    background: #FFFFFF;
    padding-top: .44rem;
    box-sizing: border-box;
    position: relative;
    .qrCodeUrl{
      width: 140px;
      height: 140px;
      margin: 0 auto 0;
      
    }
    p{
      width: 100%;
      font-size: .14rem;
      font-family:GeoLight ;
      text-align: center;
      margin-top: .08rem;
      font-weight: 500;
      color: #232323;
    }
  }
  .ContinueButton{
    width: 90%;
    height: .58rem;
    background: #4479D9FF;
    font-size: .18rem;
    font-weight: 500;
    color: #FAFAFA;
    font-family: GeoRegular;
    border-radius: .29rem;
    text-align: center;
    line-height: .55rem;
    position: absolute;
    left: 5%;
    bottom: .5rem;
    cursor: pointer;
    img{
      width: .24rem;
      position: absolute;
      right: .16rem;
      top: .17rem;
    }
  }
  .Network-title{
    padding: .2rem 0 0 0;
    font-family: GeoDemibold;
    font-size: .16rem;
    text-align: center;
  }
  .network-content{
    width: 100%;
    max-height: 180px;
    background: #F3F4F5;
    border-radius: .1rem;
    margin-top: .1rem;
    overflow-y: scroll;
    div{
      cursor: pointer;
      padding: .2rem;
      display: flex;
      justify-content: space-between;
      img{
        // width: .15rem;
        height: .15rem;
      }
    }
  }
  // .payCions{
  //   position: absolute;
  //   left: .2rem;
  // }
  .fade-enter-active {
    transition: all 0.3s ease-in;
}

.fade-leave-active {
    transition: all 0.3s ease-out;
}

.fade-enter,
.fade-leave-to {
    max-height: 0;
}
.order-state_title{
  font-size: .13rem;
  font-family: GeoRegular;
  font-weight: 500;
  margin: .32rem 0 .05rem 0;
  color: #707070;

}
.order-state_content{
    width: 100%;
    min-height: .5rem;
    background: #F3F4F5FF;
    font-size: 16px;
    font-family: Jost-Bold, Jost;
    font-weight: 500;
    color: #232323;
    padding: .1rem .1rem .1rem .2rem;
    border-radius: .1rem;
  }
  .popup_center{
    top: 1.86rem;
    left: 50%;
    transform: translate(-50%,0);
  }
::v-deep .van-overlay{
  width: 100%;
  height: 100%;
  border-radius: 0;
    background: rgb(0 0 0 / 66%) !important;
    z-index: 9999;
  }
}
</style>
