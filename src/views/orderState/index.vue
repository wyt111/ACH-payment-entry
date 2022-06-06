<template>
  <div class="order-container">
    <div class="timing" v-if="[0,1].includes(playMoneyState)" style="white-space:nowrap;">Please transfer {{orderStateData.cryptoCurrency}} to the address within <span>{{ timeText }}</span></div>
    <!-- <div class="timing" v-if="playMoneyState===1">Received {{ orderStateData.receivedSellVolume?orderStateData.receivedSellVolume:0 }} {{ orderStateData.cryptoCurrency }} {{ orderStateData.blockNumber }}/{{ orderStateData.confirmedNum }} confirmations <span style="color:#4479D9FF;margin-left:.3rem" >View</span></div> -->
    <div class="timing" v-if="[2,3,4,5].includes(playMoneyState)">You <span v-if="playMoneyState!==5" style="color:#000;font-weight:500">will </span>get {{ orderStateData.feeUnit }} {{ orderStateData.fiatAmount-orderStateData.fee?orderStateData.fee.toFixed(6):0 }} for {{ orderStateData.sellVolume?orderStateData.sellVolume:0 }} {{ orderStateData.cryptoCurrency }}</div>
    <div class="timing" v-if="playMoneyState===6"> <span>Please modify your card details</span></div>
    <div class="timing" v-if="playMoneyState===7">If you still want to sell crypto,Return to home page</div>
    <div class="order-state-title" v-if="playMoneyState===1 || playMoneyState===0">Wait Crypto…</div>
    <div class="order-state-title" v-if="playMoneyState===2">Order Confirming…</div>
    <div class="order-state-title" v-if="playMoneyState===3">Order Confirmed</div>
    <div class="order-state-title" v-if="playMoneyState===4">Payment Processing…</div>
    <div class="order-state-title" v-if="playMoneyState===5">Payment Success</div>
    <div class="order-state-title" v-if="playMoneyState===6">Payment Fail</div>
    <div class="order-state-title" v-if="playMoneyState===7">Order expired！</div>

    <div class="order-state">
      <div class="state">
        <!-- <div v-if="state===0">1</div> -->
        <div  v-if="[1,0].includes(playMoneyState)"><img src="../../assets/images/icon4.png" alt=""></div>
        <div :class="[2,3,4,5,6].includes(playMoneyState)?'stateSuccessful':''" v-if="[2,3,4,5,6].includes(playMoneyState)"><img src="../../assets/images/icon4.png" alt=""></div>
        <div :class="[7].includes(playMoneyState)?'stateError':''" v-if="playMoneyState===7"><img src="../../assets/images/errorIcon.png" alt=""></div>

      </div>
      <div :class="[2,3,4,5,6].includes(playMoneyState)?'state-content success':'state-content'">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="[0,1,7].includes(playMoneyState)">2</div>
        <div  v-if="[2,3,4,5,6].includes(playMoneyState)" :class="[3,4,5,6].includes(playMoneyState)?'stateSuccessful':''"><img src="../../assets/images/icon1.png" alt=""></div>
      </div>
      <div :class="[3,4,5,6].includes(playMoneyState)?'state-content success':'state-content'">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="[0,1,2,7].includes(playMoneyState)">3</div>
        <div :class="[4,5,6].includes(playMoneyState)?'stateSuccessful':''" v-if="[3,4,5,6].includes(playMoneyState)"><img src="../../assets/images/icon2.png" alt=""></div>
      </div>
      <div :class="[4,5,6].includes(playMoneyState)?'state-content success':'state-content'">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="[0,1,2,3,4,7].includes(playMoneyState)">4</div>
        <div :class="playMoneyState===5?'stateSuccessful':''" v-if="[5].includes(playMoneyState)"><img src="../../assets/images/icon3.png" alt=""></div>
        <div :class="[6].includes(playMoneyState)?'stateError':''" v-if="playMoneyState===6"><img src="../../assets/images/errorIcon.png" alt=""></div>
      </div>
    </div>
    <div class="order-state-content">
      <div :class="playMoneyState===7?'payCions':''" :style="{color:[0,1].includes(playMoneyState)?'':'#000',}">Pay Coins</div>
      <div :style="{color:[0,1,2].includes(playMoneyState)?'':'#000'}">{{ playMoneyState===7?'':'Confirm Order' }}</div>
      <div :style="{color:[0,1,2,3].includes(playMoneyState)?'':'#000'}">{{ playMoneyState===7?'':'Make Payment' }}</div>
      <div :style="{color:[0,1,2,3,4,].includes(playMoneyState)?'':'#000',margin:playMoneyState==6?'0 .1rem 0 .1rem':''}" v-if="[0,1,2,3,4,5,6].includes(playMoneyState)">{{playMoneyState==5?'success':playMoneyState==6?'fail':'Payment Result' }}</div>
    </div>
    <div class="order-content">
        <div class="order-title">Order ID</div>
        <div class="order-con order-conId" style="cursor: pointer;" @click="copy" :data-clipboard-text="orderStateData.orderId">
          <p>{{ orderStateData.orderId }}</p>
          <img src="../../assets/images/copy.png" alt="">
        </div>
        <div class="order-title" v-if="[0,1,2,3].includes(playMoneyState)">Network</div>
        <div class="order-con" style="cursor: pointer;" v-if="[0,1,2,3].includes(playMoneyState)" @click="Network_isShow">
          <p>{{ Network.networkName }}</p>
          <img src="../../assets/images/rightIcon.png" alt="">
        </div>
        <transition name="fade">
        <div class="network-content" v-show="Network_show1">
          <div v-for="item in Network_data" :key="item.id" @click="SetNetwork(item)">
            <p>{{ item.networkName }}</p>
            <img :src="item.network===orderStateData.cryptoCurrencyNetwork?NetworkCheck:''" style="border:none" alt="">
          </div>
        </div>
        </transition>
        <div class="order-title" v-if="[0,1,2,3].includes(playMoneyState)">Address</div>
        <div class="order-con" v-if="[0,1,2,3].includes(playMoneyState)" style="cursor: pointer;"  @click="copy" :data-clipboard-text="orderStateData.address">
          <p>{{ orderStateData.address }}</p>
          <div style="margin-top:.03rem" v-if="playMoneyState===0||playMoneyState===1">
            <img style="margin-right:.2rem" @click.stop="qrCode" src="../../assets/images/Qrcode.png" alt="">
            <img src="../../assets/images/copy.png"  alt="">
          </div>
        </div>
        <div v-if="[4,5,6].includes(playMoneyState)" class="order-title">Card</div>
        <div v-if="[4,5,6].includes(playMoneyState)"  class="order-con" @click="goBank(playMoneyState,orderStateData)">
          <div style="width:80%">
            <p style="width:100%">{{ orderStateData.bank }}</p>
            <div style="display:flex;margin-top:.1rem">
              <p style="width:36%">{{ AES(orderStateData.firstname) }} {{ AES(orderStateData.lastname) }}</p>
               <p style="margin-left:.2rem;overflow: none;width:100%">{{ AES(orderStateData.cardNumber).slice(0,4) }} **** **** {{AES(orderStateData.cardNumber).slice(AES(orderStateData.cardNumber).length-4,AES(orderStateData.cardNumber).length) }}</p><!--1234 **** **** 1234 -->
            </div>
          </div>
          <img src="../../assets/images/rightIcon.png" alt="">
        </div>
        <div class="order-title" v-if="playMoneyState===6">Fail Reason</div>
        <div class="order-con order-conId" v-if="playMoneyState===6" >
          <p>To find your bank account.</p>
        </div>

    </div>
    <div class="ContinueButton" v-if="playMoneyState===7" @click="$router.replace('/')">Continue to sell crypto</div>
    <IncludedDetailsSell style="margin-top:.4rem" v-if="playMoneyState!==7" :time-down-state="[0,1,].includes(playMoneyState)?true:false"/>
    <van-popup v-model="show" round>
      <div class="qrcode" >
        <div  ref="qrCodeUrl" class="qrCodeUrl"></div>
        <p>Scan QR Code</p>
      </div>
    </van-popup>
    <van-popup v-model="Network_show" position="bottom" round :style="{ height: '30%' }" >
        <div class="Network-title">Network</div>
        <div class="Network-content" v-for="item in Network_data" :key="item.id" @click="SetNetwork(item)"><p>{{ item.networkName }}</p><img :src="item.network===orderStateData.cryptoCurrencyNetwork?NetworkCheck:''" alt=""></div>
    </van-popup>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2';
import {AES_Decrypt} from '../../utils/encryp'
import IncludedDetailsSell from '../../components/IncludedDetailsSell'
export default{
  name:'orderState',
  components:{
    IncludedDetailsSell
  },
  data(){
    return {
      NetworkCheck:require('../../assets/images/cardCheckIcon.png'),
      playMoneyState:0,
      show:false,
      orderStateData:{},
      Network:'',
      Network_data:[],
      Network_show:false,
      Network_show1:false,
      timer:null,
      timeText:'',

    }
  },
  methods:{
    Network_isShow(){
      if(this.playMoneyState==3 || this.playMoneyState==2){
        this.Network_show = false
        this.Network_show1 = false
        return false
      }else{
        let _chiletWidth = document.documentElement.clientWidth
        if(_chiletWidth<750){
          this.Network_show = true
        }else{
          this.Network_show1 = !this.Network_show1
        }
      }
    },

    copy(){
        let clipboard = new Clipboard('.order-con');
      clipboard.on('success', () => {
        this.$toast('copy success');
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        clipboard.destroy()
      })
    },
     generateQRcode(){
       this.$refs.qrCodeUrl.innerHTML = "";
      new QRCode(this.$refs.qrCodeUrl, {
        text: this.orderStateData.address,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    },
    qrCode(){
      this.show = true
      setTimeout(()=>{
        this.generateQRcode()
      },500)

    },
    //设置网络
    SetNetwork(text){
      let _chiletWidth = document.documentElement.clientWidth

      if(_chiletWidth<750){
        this.Network_show = false
      }else{
        this.Network_show1 = false
      }

      if(this.Network.id === text.id){
        return false
      }

      let params = {
        // id:'15',
        id:this.$store.state.sellOrderId,
        cryptoCurrencyNetworkId:text.id
      }
      this.$axios.post(this.$api.post_setNetwork,params).then(res=>{
        if(res && res.data){
          this.orderStateData = res.data
          this.$toast(res.returnMsg)
          this.Network = text
          return
        }
        this.$toast('error')
      })
      clearInterval( this.timer)
      setTimeout(()=>{
            this.timer = setInterval(()=>{
              this.getCurrencyStatus()
              },1000)
          },2000)
    },
    //获取网络列表
    getNetworkList(){
      let params = {
        coin:this.$store.state.orderStatus.cryptoCurrency
      }
      this.$axios.get(this.$api.get_networkList,params).then(res=>{
        if(res && res.data){
          this.Network_data = res.data
          //获取选中的网络
          res.data.forEach(item => {
            if(item.network==this.orderStateData.cryptoCurrencyNetwork){
              this.Network = item
            }
          });
        }
      })
    },
    //获取买币状态
    getCurrencyStatus(){
      // console.log(this.$store.state.sellOrderId);
      let parmas = {
        // id:'15'
        id:this.$store.state.sellOrderId
      }
      this.$axios.get(this.$api.get_PlayCurrencyStatus,parmas).then(res=>{
        if(res && res.data){
          this.orderStateData = res.data
          this.$store.state.orderStatus = res.data
          this.playMoneyState = res.data.orderStatus

          if(this.playMoneyState==7){
            sessionStorage.setItem('feeParams',JSON.stringify(this.$store.state.feeParams))
            sessionStorage.setItem('homeTabstate',JSON.stringify(this.$store.state.homeTabstate))
            clearInterval(this.timer)
            this.$store.replaceState({})
            this.$store.state.feeParams =  JSON.parse(sessionStorage.getItem('feeParams'))
            this.$store.state.homeTabstate =  JSON.parse(sessionStorage.getItem('homeTabstate'))
            return
          }

          if(res.data.expirationTime<=0 ||(res.data.expirationTime<=0 && this.playMoneyState!= 7)){
            this.playMoneyState = 7
            sessionStorage.setItem('feeParams',JSON.stringify(this.$store.state.feeParams))
            sessionStorage.setItem('homeTabstate',JSON.stringify(this.$store.state.homeTabstate))
            clearInterval(this.timer)
            this.$store.replaceState({})
            this.$store.state.feeParams =  JSON.parse(sessionStorage.getItem('feeParams'))
            this.$store.state.homeTabstate =  JSON.parse(sessionStorage.getItem('homeTabstate'))

            return
          }
          if(res.data.orderStatus>0 &&(this.playMoneyState == 0||this.playMoneyState == 1) ){
            this.turnMinute(res.data.expirationTime)
            return
          }else{
            this.turnMinute = null
            return false
          }

        }
      })
    },
    //进入银行卡信息页
    goBank(state,orderData){
      if(state == 6){
        let params = {
          id:orderData.userCardId,
        }
        this.$axios.get(this.$api.get_userCard,params).then(res=>{
          if(res && res.returnCode =='0000'){
            this.$store.state.sellForm = res.data
            this.$store.state.sellForm.sellOrderId = orderData.id
            this.$store.state.cardInfoFromPath = 'sellOrder'
            this.$router.push('/sell-formUserInfo')
          }
        })

      }else{
        this.$toast('Cant modify')
      }
    },
    //Calculate minutes and seconds
    turnMinute(value){
      if(value >= 0){
        var second = value;
        var minute=0;
        minute = parseInt(second/60);
        second%=60;
        // if(minute>60) {
        //   minute%=60;
        // }
        second = second>9?second:"0"+second;
        minute = minute>9?minute:"0"+minute;
        this.timeText = minute+":"+second;
        // console.log(this.timeText);
      }
    },
    //解密了一些数据
    AES(value){
      if(value){
        return AES_Decrypt(value)
      }else{
        return value
      }

    }
  },

  activated (){
    this.getCurrencyStatus()
    this.timer = setInterval(()=>{
      this.getCurrencyStatus()
    },1000)

    setTimeout(()=>{
      if(this.playMoneyState == 7)
      this.getNetworkList = null
      else
      this.getNetworkList()
    },1000)
  },
  deactivated (){
    clearInterval(this.timer)
    // this.$store.replaceState({})
  }
}

</script>
<style lang="scss" scoped>


.order-container{
  // padding: 0 .2rem .3rem;
  padding-bottom: .2rem;

  .timing{
    font-size: .15rem;
    font-family: Jost-Bold, Jost;
    font-weight: 500;
    color: #232323;
    line-height: .23rem;
    span{
      color: #FF0000 ;
      font-weight: 600;
    }
  }
  .order-state-title{
    font-size: .16rem;
    font-family: Jost-Bold, Jost;
    font-weight: 600;
    color: #232323;
    line-height: .23rem;
    margin: .1rem 0 .1rem 0;
  }
  .order-state{
    padding: 0 .1rem 0;
    display: flex;
    justify-content: space-between;
    // align-items: center;
    font-size: .18rem;
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
        margin-left: .05rem;
        margin-top: .18rem;
        border-radius: 50%;
      }
      div:nth-of-type(4){
        margin-right: .07rem;
      }
    }
  }
  .order-state-content{
    display: flex;
    justify-content: space-around;
    margin-top: .1rem;
    div{
      // width: 24%;
      font-family: Jost-Bold, Jost;
      font-size: .12rem;
      color: #999999;
    }
    div:last-child{
      text-align: center;
    }
  }
  .order-content{
    font-size: .14rem;
    font-family: Jost-Bold, Jost;
    .order-title{
      margin: .2rem 0 .1rem 0;
    }
    .order-con{
      width: 100%;
      min-height: .5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .19rem .2rem .18rem;
      background: #F3F4F5;
      border-radius: 10px;
      p{
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis
      }
      img{
        height: .16rem;
      }
    }
  }
  .stateSuccessful{
    text-align: center;
    padding-top: .03rem;
     background: #02AF38 !important;
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
    font-family:Jost-Bold, Jost ;
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
    width: 3rem;
    height: 3rem;
    background: #FFFFFF;
    padding-top: .35rem;
    box-sizing: border-box;
    .qrCodeUrl{
      width: 2rem;
      margin: 0 auto 0;
    }
    p{
      font-size: .14rem;
      font-family:Jost-Bold, Jost ;
      text-align: center;
      margin-top: .1rem;
      font-weight: 500;
      color: #232323;
    }
  }
  .ContinueButton{
    width: 90%;
    height: .55rem;
    background: #4479D9FF;
    font-size: .18rem;
    font-weight: 500;
    color: #FAFAFA;
    font-family: Jost-Bold, Jost;
    border-radius: .04rem;
    text-align: center;
    line-height: .55rem;
    position: absolute;
    left: 5%;
    bottom: .5rem;
    cursor: pointer;
  }
  .Network-title{
    padding: .2rem 0 0 0;
    font-family: Jost-Bold, Jost;
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
  .payCions{
    position: absolute;
    left: .2rem;
  }
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
}
</style>
