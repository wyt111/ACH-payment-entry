<template>
  <div class="sendCrypto-container">
    <div class="sendCrypto_nav">
      <div class="sendCrypto_nav_left" @click="$router.replace('/')">
        <img src="@/assets/images/goBack.png" alt="">
        <p>Sell {{orderStateData.cryptoCurrency}}</p>
      </div>
          <div class="sendCrypto_nav_right" >
            <img class="menu" src="@/assets/images/rightMeun.png" v-if="this.$parent.$parent.routerViewState" @click="openMenu">
          </div>
      </div>
    <div v-if="[0,1].includes(orderStateData.orderStatus)">
      <div>
        <div class="sendCrypto_title">
      <p>{{ $t('nav.Sellorder_You') }} {{ $t('nav.Sellorder_will') }} {{ $t('nav.Sellorder_get') }}  <span> {{ orderStateData.feeUnit }} {{ getToFixed(orderStateData.fiatAmount,orderStateData.fee) }}</span>  {{ $t('nav.Sellorder_for') }} <span>  {{ orderStateData.sellVolume?orderStateData.sellVolume:0 }} {{ orderStateData.cryptoCurrency }} </span> </p>
      <p>{{ timerNumber }} s</p>
      
    </div>
    <div class="sendCrypto_title" style="margin-top:.16rem">
      <p>{{ $t('nav.home_buyFee_rampFee') }} </p>
      <p style="color:#063376">{{ orderStateData.feeUnit }} {{ feeInfo.rampFee }}</p>
    </div>
    <div class="sendCrypto_title" style="margin-top:.16rem">
      <p >{{ $t('nav.Sellorder_Id') }}</p>
      <p style="cursor: pointer;" class="order-con" @click="copy" :data-clipboard-text="orderStateData.orderId">
        <span style="width:2rem;overflow:hidden;font-style: normal;text-overflow: ellipsis;text-align:right">{{ orderStateData.orderId }}</span>
        <img style="height:.2rem;margin-left:.08rem;flex:1" src="@/assets/images/copySell.png" alt="">
      </p>
    </div>
    <div class="sendCrypto_qrcode">
      <p>{{ $t('nav.Sellorder_transfer') }} {{orderStateData.cryptoCurrency}} {{ $t('nav.Sellorder_within') }} <span>{{ turnMinute(orderStateData.expirationTime) }}</span></p>
      <div ref="qrCodeUrl" class="qrCodeUrl" style="width:1.4rem;height:1.4rem;"></div>
    </div>
    <div class="sendCrypto_content" style=" align-items: center;">
      <div class="title">{{ $t('nav.Sellorder_Address') }} (ACH)</div>
      <div class="content order-con" @click="copy" :data-clipboard-text="orderStateData.address">
        <p style="max-width:2.5rem;white-space: normal;overflow:hidden;overflow:hidden;font-style: normal;text-overflow: ellipsis; ">{{ orderStateData.address }}</p>
        <img src="@/assets/images/copySell.png" alt="">
      </div>
    </div>
    <div class="sendCrypto_content">
      <div class="title">{{  $t('nav.Sellorder_Network') }}</div>
      <div class="content" @click="Network_show = true">
        <p>{{ orderStateData.networkName }}</p>
        <img style="height:.15rem" src="@/assets/images/SelectNetwork.png" alt="">
      </div>
    </div>
    <div class="sendCrypto_bottom_title">{{ $t('nav.sell_Order_network_selected') }}</div>
      </div>
      <div class="sendCrypto_button" @click="transferredShow=true">
      <div>
          {{ $t('nav.Sell_Order_haveSent') }} {{orderStateData.cryptoCurrency}}
          <img src="@/assets/images/rightIconSell.png" alt="">
      </div>
    </div>
    </div>
    
    <div v-else-if="orderStateData.orderStatus == 7 || orderStateData.expirationTime == 0" class="sendCrypto_timeError">
      <div class="sendCrypto_title" style="margin-top:.42rem">
      <p >{{ $t('nav.Sellorder_Id') }}</p>
      <p style="cursor: pointer;" class="order-con" @click="copy" :data-clipboard-text="orderStateData.orderId">
        <span style="width:2rem;overflow:hidden;font-style: normal;text-overflow: ellipsis;text-align:right">{{ orderStateData.orderId }}</span>
        <img style="height:.2rem;margin-left:.08rem;flex:1" src="@/assets/images/copySell.png" alt="">
      </p>
    </div>
    <div class="sendCrypto_content1">
      <img src="@/assets/images/SellOrderTime.svg" alt="">
      <p>Take a timeout! The address has been invalidated, please go back to the homepage to re-operate. If you insist on transferring digital currency to the current address, any loss will be borne by you!</p>
    </div>
    <div class="sendCrypto_button" @click="$router.replace('/')">
      <div>
          Back to Home page
          <img src="@/assets/images/rightIconSell.png" alt="">
      </div>
    </div>
    </div>
    
    <div v-else></div>
    <div class="sendCrypto_confing" v-show="transferredShow" >
      <div class="content">
        <p style="height:.5rem">{{ $t('nav.Sell_Order_transferred') }}</p>
        <div>
          <p @click.stop="confirmSell">{{ $t('nav.Confirm') }}</p>
          <p @click.stop="transferredShow = false">Not Yet</p>
        </div>
      </div>
    </div>

   <div class="sendCrypto_bottom" v-show="Network_show" @click.stop="Network_show = false">
     
   </div>
   <div :class="!Network_show?'sendCrypto_bottomContent':'sendCrypto_bottomContent sendCrypto_bottomContentActive'" >
       <div class="Network-title">{{ $t('nav.Sellorder_Network') }} <img @click="Network_show = false" src="@/assets/images/ShutDown.png" alt=""></div>
       <div class="Network-content" v-for="item in Sellorder_NetworkList?Sellorder_NetworkList:''" :key="item.id" @click="networkSelect(item)">{{ item.networkName }} <img :src="item.networkName==orderStateData.networkName?NetworkCheck:''" alt=""></div>
     </div>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2';
export default {
  
  name:'sendCrypto',
  props:{
    orderStateData:{
      default:''
    }
  },
  data(){
    return{
      transferredShow:false,
      Network_show:false,
      timeText:'',
      Sellorder_NetworkList:'',
      NetworkCheck:require('@/assets/images/cardCheckIcon.png'),
      feeInfo:'',
      timerNumber:15,
      timeOut:null
    }
  },
  mounted(){
    // this.$parent.routerViewState = true 
    setTimeout(() => {
      if(this.orderStateData.orderStatus == 7 || this.orderStateData.expirationTime == 0){
        return false
      }
      this.getNetworkList()
    }, 1000);
    this.queryFee()
    if(this.orderStateData.orderStatus === 7 ||  this.orderStateData.expirationTime <=0){
      return
    }
    if(this.timerNumber >= 0 ){
        clearInterval(this.timeOut)
       this.timeOut =  setInterval(()=>{
          this.timerNumber--
          if(this.timerNumber< 0 && [0,1].includes(this.orderStateData.orderStatus)){
            this.queryFee()
            this.timerNumber = 15
          }else if(this.orderStateData.orderStatus === 7 ||  this.orderStateData.expirationTime <=0){
            clearInterval(this.timeOut)
          }
        },1000)
      }
     
    
  },
  activated(){
  
    //网络列表延迟请求
    setTimeout(() => {
    
      this.getNetworkList()
    }, 1000);
    this.queryFee()
    if(this.orderStateData.orderStatus === 7 ||  this.orderStateData.expirationTime <=0){
      return
    }
    if(this.timerNumber > 0 ){
        clearInterval(this.timeOut)
       this.timeOut =  setInterval(()=>{
          this.timerNumber--
          if(this.timerNumber< 0 && [0,1].includes(this.orderStateData.orderStatus)){
            this.queryFee()
            this.timerNumber = 15
          }else if(this.orderStateData.orderStatus === 7 ||  this.orderStateData.expirationTime <=0){
            clearInterval(this.timeOut)
            return
          }
        },1000)
      }
  },
  deactivated(){
    this.timerNumber = 15
    clearInterval(this.timeOut)
  },
  destroyed(){
    clearInterval(this.timeOut)
    
  },
  methods:{
    //确认切换
    confirmSell(){
      this.$store.state.nextOrderState = 2
    },
    //复制
    copy(){
        let clipboard = new Clipboard('.order-con');
      clipboard.on('success', () => {
        this.$toast({
          duration: 3000,
          message: this.$t('nav.copyTips')
        });
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        clipboard.destroy()
      })
    },
    //二维码
    generateQRcode(){
      // console.log(this.orderStateData.orderStatus);
    if(this.orderStateData.orderStatus==1 || this.orderStateData.orderStatus==0){
       this.$refs.qrCodeUrl.innerHTML = "";
      new QRCode(this.$refs.qrCodeUrl, {
        text: this.orderStateData.address,
        width: '140',
        height: '140',
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      return
    }
      
    },
    //获取网络列表
     async  getNetworkList(){
     
      let params = {
        coin:this.$store.state.orderStatus.cryptoCurrency
      }
      let res  = await this.$axios.get(this.$api.get_networkList,params)
      if(res.data && res.returnCode === '0000')
      this.Sellorder_NetworkList =  res.data
     },
     //Calculate minutes and seconds
    turnMinute(value){
      if(value >= 0){
        var num = value;
        return '0'.repeat(2 - String(Math.floor(num / 3600)).length) + Math.floor(num / 3600) + ':' + '0'.repeat(2 - String(Math.floor((num%3600) / 60)).length) + Math.floor((num%3600) / 60) + ':' + '0'.repeat(2 - String(Math.floor((num%3600) % 60)).length) + Math.floor((num%3600) % 60)
        
      }
    },
    //确认网络
    networkSelect(val){
      if(this.orderStateData.networkName===val.networkName){
        this.Network_show = false
        return false
      }
       let params = {
        // id:'15',
        id:this.$store.state.sellOrderId,
        cryptoCurrencyNetworkId:val.id
      }
      this.Network_show = false
      this.$axios.post(this.$api.post_sellConfirmOrder,params).then(res=>{
        if(res && res.data){
          this.Network_show = false
        }
      })
    } ,
    //保留小数点两位或者6位
    getToFixed(firstVal,lastVal){
      let decimalDigits = 0;
      let resultValue = firstVal - lastVal;
      resultValue >= 1 ? decimalDigits = 2 : decimalDigits = 6;
      let price = resultValue.toFixed(decimalDigits);
      isNaN(resultValue) || price <= 0 ? price = 0 : '';
      return price;

    },
     //费率刷新
    queryFee(){
      // console.log(this.$store.state.feeParams);
       this.$axios.get(this.$api.get_inquiryFeeSell,this.$store.state.feeParams).then(res=>{
         if(res && res.returnCode === "0000"){
          this.feeInfo = res.data;
          this.feeInfo.rampFee = (this.$store.state.sellRouterParams.amount * this.feeInfo.price * this.feeInfo.percentageFee + this.feeInfo.fixedFee) * this.feeInfo.rate;
           let decimalDigits = 0;
            let resultValue = this.feeInfo.rampFee;
            resultValue >= 1 ? decimalDigits = 2 : decimalDigits = 6;
            let rampFee = resultValue.toFixed(decimalDigits);
            isNaN(resultValue) || rampFee <= 0 ? rampFee = 0 : '';
            this.feeInfo.rampFee = rampFee
         }
       })
    },
    //打开菜单栏
    openMenu(){
      this.$parent.$parent.routerViewState === true ? this.$parent.$parent.routerViewState = false : this.$parent.$parent.routerViewState = true;
    }
  
  },
  watch:{
    'orderStateData.address':{
      immediate:true,
      deep:true,
      handler(newVal,oldVal){
        if(newVal !== oldVal){
          this.$nextTick(()=>{
            this.generateQRcode()
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.sendCrypto-container{
  width: 100%;

  // padding-bottom: .6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: .3rem 0 .6rem 0;
 .sendCrypto_timeError{
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: column;
   .sendCrypto_content1{
     width: 100%;
     text-align: center;
     margin-top: .2rem;
     border-top: 1px solid #EEEEEE;
     >img{
       height: 1.58rem;
       margin: .8rem 0 .2rem;
     }
     p{
       text-align: justify;
       font-style: normal;
       font-size: .13rem;
       line-height: .18rem;
       color: #949EA4;
     }
   }
 }
 .sendCrypto_nav{
   width: 100%;
   padding: .15rem .22rem .15rem .22rem;
   display: flex;
   justify-content: space-between;
   align-items: center;
   position: absolute;
   background: #FFFFFF;
   top: .22rem;
   left: 0;
   img{
       width: .19rem;
       cursor: pointer;
     }
   .sendCrypto_nav_left{
     display: flex;
     cursor: pointer;
     img{
       width: .12rem;
       height: .2rem;
       
     }
     p{
       margin-left: .15rem;
       font-size: .18rem;
       color: #063376;
       font-family: "GeoDemibold", GeoDemibold;
     }
   }
 }

  .sendCrypto_title{
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-between;
    font-size: .13rem;
    color: #949EA4;
    margin-top: .35rem;
    p:first-child{
      
      font-style: normal;
      span{
        color: #063376;
        margin: 0 .04rem 0;
      }
    }
    p:last-child{
      display: flex;
      align-items: center;
      font-size: .13rem;
      font-style: normal;
      img{
        height: .14rem;
      }
    }
  }
  .sendCrypto_qrcode{
    width: 100%;
    margin-top: .24rem;
    background: #F7F8FA;
    border-radius: .06rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: .3rem;
    p{
      font-size: .13rem;
      color: #949EA4;
      margin: .2rem auto .16rem;
      span{
        color: #FF2C2C;
      }
    }
  }
  .sendCrypto_content{
    width: 100%;
    cursor: pointer;
    margin-top: .24rem;
    .title{
      font-size: .13rem;
      font-style: normal;
      color: #949EA4;
    }
    .content{
      width: 100%;
      height: .56rem;
      background: #F7F8FA;
      font-size: .16rem;
      color: #949EA4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .08rem;
      padding: 0 .16rem 0 .16rem;
      border-radius: .06rem;
      img{
        height: .2rem;
      }
    }
  }
  .sendCrypto_bottom_title{
    font-size: .13rem;
    color: #C2C2C2;
    font-style: normal;
    line-height: .18rem;
    margin-top: .08rem;
  }
  .sendCrypto_button{
    width: 90%;
    height: .65rem;
    background: #FFFFFF;
    padding-top: .07rem;
    div{
      width: 100%;
      height: .58rem;
       background: #0059DA;
      color: #FFFFFF;
      border-radius: .3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
   
    position: absolute;
    bottom: .2rem;
    left: 5%;
    img{
      height: .12rem;
      margin-left: .12rem;
    }
  }
  .sendCrypto_confing{
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.15);
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .content{
      width: 3.45rem;
      height: 1.95rem;
      background: #FFFFFF;
      border-radius: .18rem;
      padding: .32rem .16rem;
      >p{
        text-align: center;
        color: #949EA4;
        font-size: .16rem;
        line-height: .24rem;
      }
      >div{
        display: flex;
        margin-top: .3rem;
        p:first-child{
          width: 1.5rem;
          height: .5rem;
          background: #0059DA;
          border-radius: .25rem;
          color: #FFFFFF;
          line-height: .5rem;
          text-align: center;
          margin-right: .1rem;
          cursor: pointer;
        }
        p:last-child{
          width: 1.5rem;
          height: .5rem;
          color: #063376;
          text-align: center;
          line-height: .5rem;
          background: #FFFFFF;
          border: 1px solid #EEEEEE;
          border-radius: .25rem;
          cursor: pointer;
        }
      }
    }
  }
  .sendCrypto_bottom{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.15);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
  }
  .sendCrypto_bottomContent{
    width: 100%;
    min-height: 5rem;
    background: #FFFFFF;
    padding:  0 .3rem .3rem .3rem;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translate(0,5rem);
    border-radius: .2rem .2rem 0 0 ;
    box-shadow: 0px -8px 20px rgba(0, 89, 218, 0.08);
    z-index: 2;
    transition: .5s ;
    .Network-title{
      font-size: .18rem;
      color: #063376;
      text-align: center;
      margin: .3rem 0 .3rem;
      position: relative;
      img{
        width: .12rem;
        position: absolute;
        right: .0rem;
        top: .05rem;
        cursor: pointer;
      }
    }
    .Network-content{
      width: 100%;
      height: .35rem;
      border-bottom: 1px solid #F4F4F4;
      margin-bottom: .16rem;
      color: #949EA4;
      font-size: .16rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      img{
        height: .15rem;
      }
    }
  }
  .sendCrypto_bottomContentActive{
    transform: translate(0,0rem) !important;
    transition: .5s;
  }
 
}
</style>