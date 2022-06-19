<template>
  <div class="order-container" >
    <div class="timing" v-if="[0,1].includes(playMoneyState)" style="white-space:nowrap;">Please transfer {{orderStateData.cryptoCurrency}} to the address within <span>{{ timeText }}</span></div>
    <!-- <div class="timing" v-if="playMoneyState===1">Received {{ orderStateData.receivedSellVolume?orderStateData.receivedSellVolume:0 }} {{ orderStateData.cryptoCurrency }} {{ orderStateData.blockNumber }}/{{ orderStateData.confirmedNum }} confirmations <span style="color:#4479D9FF;margin-left:.3rem" >View</span></div> -->
    <div class="timing" v-if="[2,3,4,5].includes(playMoneyState)">You <span v-if="playMoneyState!==5" style="color:#000;font-weight:500">will </span>get {{ orderStateData.feeUnit }} {{ Math.round((orderStateData.fiatAmount-orderStateData.fee) * 100) / 100 }} for {{ orderStateData.sellVolume?orderStateData.sellVolume:0 }} {{ orderStateData.cryptoCurrency }}</div>
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
        <div  v-if="[1,0].includes(playMoneyState)" style="background:#959595FF"><img src="../../assets/images/icon4.png" alt=""></div>
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
        <div  v-if="[2,3,4,5,6].includes(playMoneyState)" :class="[3,4,5,6].includes(playMoneyState)?'stateSuccessful':'stateLoading'"><img src="../../assets/images/icon1.png" alt=""></div>
      </div>
      <div :class="[3,4,5,6].includes(playMoneyState)?'state-content success':'state-content'">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="[0,1,2,7].includes(playMoneyState)">3</div>
        <div :class="[4,5,6].includes(playMoneyState)?'stateSuccessful':'stateLoading'" v-if="[3,4,5,6].includes(playMoneyState)"><img src="../../assets/images/icon2.png" alt=""></div>
      </div>
      <div :class="[4,5,6].includes(playMoneyState)?'state-content success':'state-content'">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="[0,1,2,3,4,7].includes(playMoneyState)" :style="{background:playMoneyState===4?'#959595FF':''}">4</div>
        <div :class="playMoneyState===5?'stateSuccessful':''" v-if="[5].includes(playMoneyState)"><img src="../../assets/images/icon3.png" alt=""></div>
        <div :class="[6].includes(playMoneyState)?'stateError':''" v-if="playMoneyState===6"><img src="../../assets/images/errorIcon.png" alt=""></div>
      </div>
    </div>
    <div class="order-state-content">
      <div :class="playMoneyState===7?'payCions':''" :style="{color:[0,1].includes(playMoneyState)?'':'#000',}">Pay Coins</div>
      <div :style="{color:[0,1,2].includes(playMoneyState)?'':'#000'}">{{ playMoneyState===7?'':'Confirm Order' }}</div>
      <div :style="{color:[0,1,2,3].includes(playMoneyState)?'':'#000'}">{{ playMoneyState===7?'':'Make Payment' }}</div>
      <div :style="{color:[0,1,2,3,4,].includes(playMoneyState)?'':'#000',width:playMoneyState==6?'.69rem':'',}" v-if="[0,1,2,3,4,5,6].includes(playMoneyState)">{{playMoneyState==5?'success':playMoneyState==6?'fail':'Result' }}</div>
    </div>
    <div class="order-content">
        <div class="order-title">Order ID</div>
        <div class="order-con order-conId" style="cursor: pointer;" @click="copy" :data-clipboard-text="orderStateData.orderId">
          <p>{{ orderStateData.orderId }}</p>
          <img src="../../assets/images/copy.png" alt="">
        </div>
        <div class="order-title" v-if="[0,1,2,3].includes(playMoneyState)">Network</div>
        <div class="order-con" style="cursor: pointer;" v-if="[0,1,2,3].includes(playMoneyState)" @click="Network_isShow">
          <p>{{ Network?Network.networkName: network1}}</p>
          <img v-if="[0,1].includes(playMoneyState)" style="height:.24rem" src="../../assets/images/rightBlackIcon.png" alt="">
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
            <!-- <p style="width:100%">{{ orderStateData.bank }}</p> -->
            <div style="display:flex;margin-top:.1rem">
              <!-- <p style="width:36%">{{ AES(orderStateData.firstname) }} {{ AES(orderStateData.lastname) }}</p> -->
               <p style="margin-left:.2rem;overflow: none;width:100%">{{ AES(orderStateData.cardNumber).slice(0,4) }} **** **** {{AES(orderStateData.cardNumber).slice(AES(orderStateData.cardNumber).length-4,AES(orderStateData.cardNumber).length) }}</p><!--1234 **** **** 1234 -->
            </div>
          </div>
          <img style="height:.24rem" src="../../assets/images/rightBlackIcon.png" alt="">
        </div>
        <div class="order-state_title" v-if="playMoneyState===6">Fail Reason</div>
        <div class="order-state_content" v-if="playMoneyState===6" >
          {{ orderStateData.errorMsg }}
        </div>

    </div>
    <div class="ContinueButton" v-if="playMoneyState===7" @click="$router.replace('/')">Continue to sell crypto <img src="../../assets/images/slices/rightIcon.png" alt=""></div>
    <IncludedDetailsSell :orderState="[3,4,5,6].includes(playMoneyState)?orderStateData:null" style="margin-top:.4rem" v-if="playMoneyState!==7" :time-down-state="[0,1,2].includes(playMoneyState)?true:false"/>
    <van-popup class="popup_center" v-model="show" round>
      <div class="qrcode" >
        <div  ref="qrCodeUrl" class="qrCodeUrl"></div>
        <p>Scan QR Code</p>
      </div>
    </van-popup>
    <van-popup v-model="Network_show" position="bottom" round :style="{ height: '30%' }">
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
      network1:'',
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
        width: 140,
        height: 140,
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
      this.$axios.post(this.$api.post_sellConfirmOrder,params).then(res=>{
        if(res && res.data){
          this.orderStateData = res.data
          // this.$toast(res.returnMsg)
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
    async  getNetworkList(){
      let params = {
        coin:this.$store.state.orderStatus.cryptoCurrency
      }
      let res  = await this.$axios.get(this.$api.get_networkList,params)
      if(res.returnCode == '0000' && res.data){
        this.Network_data = res.data
        res.data.forEach(item => {
            if(item.network==this.orderStateData.cryptoCurrencyNetwork){
              this.Network = item
            }
          });
      }

    },
    //获取买币状态
    getCurrencyStatus(){
      let sellOrderId = sessionStorage.getItem('sellOrderId')
      let parmas = {
        // id:'426'
        id:this.$store.state.sellOrderId?this.$store.state.sellOrderId:sellOrderId
      }
      this.$axios.get(this.$api.get_PlayCurrencyStatus,parmas).then(res=>{
        if(res && res.data){
          this.orderStateData = res.data
          this.$store.state.orderStatus = res.data
          this.playMoneyState = res.data.orderStatus
          this.network1 = res.data.networkName
          this.playMoneyState = 6
          if(this.playMoneyState==7){
            // sessionStorage.setItem('feeParams',JSON.stringify(this.$store.state.feeParams))
            // sessionStorage.setItem('homeTabstate',JSON.stringify(this.$store.state.homeTabstate))
            // sessionStorage.setItem('cancelTokenArr',JSON.stringify(this.$store.state.cancelTokenArr))
            // clearInterval(this.timer)
            // this.$store.replaceState({})
            // this.$store.state.feeParams =  JSON.parse(sessionStorage.getItem('feeParams'))
            // this.$store.state.homeTabstate =  JSON.parse(sessionStorage.getItem('homeTabstate'))
            // this.$store.state.cancelTokenArr =  JSON.parse(sessionStorage.getItem('cancelTokenArr'))
            return
          }
          if(this.playMoneyState==5){
            clearInterval(this.timer)
            //  this.$store.replaceState({})
          }
          if(res.data.expirationTime<=0 && this.playMoneyState=== 7){
            this.playMoneyState = 7
            sessionStorage.setItem('feeParams',JSON.stringify(this.$store.state.feeParams))
            sessionStorage.setItem('homeTabstate',JSON.stringify(this.$store.state.homeTabstate))
            sessionStorage.setItem('cancelTokenArr',JSON.stringify(this.$store.state.cancelTokenArr))
            clearInterval(this.timer)
            this.$store.replaceState({})
            this.$store.state.feeParams =  JSON.parse(sessionStorage.getItem('feeParams'))
            this.$store.state.homeTabstate =  JSON.parse(sessionStorage.getItem('homeTabstate'))
            this.$store.state.cancelTokenArr =  JSON.parse(sessionStorage.getItem('cancelTokenArr'))
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
        // this.playMoneyState = 4
      })
    },
    //进入银行卡信息页
    goBank(state,orderData){
      if(state == 6){
        let params = {
          id:orderData.userCardId,
        }
        this.$axios.get(this.$api.get_userSellCardInfo,params).then(res=>{
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
    this.$route.query.id?sessionStorage.setItem('sellOrderId',this.$route.query.id):''
    this.$store.state.emailFromPath = 'sellOrder'
    this.getCurrencyStatus()
    this.timer = setInterval(()=>{
      this.getCurrencyStatus()
    },1000)

      setTimeout(()=>{
      if(this.playMoneyState == 7)
      this.getNetworkList = null
      else if(this.$store.state.orderStatus.cryptoCurrency)
      this.getNetworkList()
      else
      this.getNetworkList()
    },1200)




  },
  deactivated (){
    clearInterval(this.timer)
    this.Network_show = false
    this.Network_show1 = false
    // this.$store.replaceState({})
  }
}

</script>
<style lang="scss" scoped>


.order-container{
  // padding: 0 .2rem .3rem;
  padding-bottom: .2rem;

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
    padding: 0 .1rem 0;
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
    justify-content: space-between;
    margin-top: .1rem;
    div{
      width: 10%;
      font-family: GeoRegular;
      font-size: .13rem;
      color: #999999;
      line-height: .18rem;
    }
     div:nth-of-type(1){
      margin-left: .18rem;
    }
    div:nth-of-type(2){
      margin-left: 0rem;
    }
    div:nth-of-type(3){
      padding-left: .1rem;
    }
     div:nth-of-type(4){
       width: 18%;
      text-align: center;
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
      border-radius: 10px;
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
    font-size: .13rem;
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
      width: 1.4rem;
      margin: 0 auto 0;
      // position: absolute;
      // left: 50%;
      // top: .44rem;
      // transform: translate(-50%,0);
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
    padding: .1rem 0 .1rem .2rem;
    border-radius: .1rem;
  }
  .popup_center{
    top: 1.86rem;
    left: 50%;
    transform: translate(-50%,0);
  }
}
</style>
