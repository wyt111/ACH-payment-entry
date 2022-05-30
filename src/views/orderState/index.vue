<template>
  <div class="order-container">
    <div class="timing" v-if="playMoneyState===0">Please transfer ACH to the address within <span>45:00</span></div>
    <!-- <div class="timing" v-if="playMoneyState===1">Received {{ orderStateData.receivedSellVolume?orderStateData.receivedSellVolume:0 }} {{ orderStateData.cryptoCurrency }} {{ orderStateData.blockNumber }}/{{ orderStateData.confirmedNum }} confirmations <span style="color:#4479D9FF;margin-left:.3rem" >View</span></div> -->
    <div class="timing" v-if="[1,2,3,4,5].includes(playMoneyState)">You <span v-if="playMoneyState!==5" style="color:#000;font-weight:500">will </span>get {{ orderStateData.feeUnit }} {{ orderStateData.fiatAmount }} for {{ orderStateData.receivedSellVolume?orderStateData.receivedSellVolume:0 }} {{ orderStateData.cryptoCurrency }}</div>
    <div class="timing" v-if="playMoneyState===6"> <span>请点击您的卡信息进行修改</span></div>
    <div class="timing" v-if="playMoneyState===7">If you still want to sell crypto,Return to home page</div>
    <div class="order-state-title" v-if="playMoneyState===0">Wait Crypto…</div>
    <div class="order-state-title" v-if="playMoneyState===1">Order Confirming…</div>
    <div class="order-state-title" v-if="playMoneyState===2">Order Confirmed</div>
    <div class="order-state-title" v-if="playMoneyState===4 || playMoneyState===3">Payment Processing…</div>
    <div class="order-state-title" v-if="playMoneyState===5">Payment Success</div>
    <div class="order-state-title" v-if="playMoneyState===6">Payment Fail</div>
    <div class="order-state-title" v-if="playMoneyState===7">Order expired！</div>
    
    <div class="order-state">
      <div class="state">
        <!-- <div v-if="state===0">1</div> -->
        <div  v-if="playMoneyState===0"><img src="../../assets/images/icon4.png" alt=""></div>
        <div :class="[1,2,3,4,5,6].includes(playMoneyState)?'stateSuccessful':''" v-if="[1,2,3,4,5,6].includes(playMoneyState)"><img src="../../assets/images/icon4.png" alt=""></div>
        <div :class="[7].includes(playMoneyState)?'stateError':''" v-if="playMoneyState===7"><img src="../../assets/images/errorIcon.png" alt=""></div>
        
      </div>
      <div :class="[1,2,3,4,5,6].includes(playMoneyState)?'state-content success':'state-content'">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="[0,7].includes(playMoneyState)">2</div>
        <div  v-if="[1,2,3,4,5,6].includes(playMoneyState)" :class="[2,3,4,5,6].includes(playMoneyState)?'stateSuccessful':''"><img src="../../assets/images/icon1.png" alt=""></div>
      </div>
      <div :class="[2,3,4,5,6].includes(playMoneyState)?'state-content success':'state-content'">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="[0,1,7].includes(playMoneyState)">3</div>
        <div :class="[4,5,6].includes(playMoneyState)?'stateSuccessful':''" v-if="[2,3,4,5,6].includes(playMoneyState)"><img src="../../assets/images/icon2.png" alt=""></div>
      </div>
      <div :class="[4,5,6].includes(playMoneyState)?'state-content success':'state-content'">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="[0,1,2,3,7].includes(playMoneyState)">4</div>
        <div :class="playMoneyState===5?'stateSuccessful':''" v-if="[4,5].includes(playMoneyState)"><img src="../../assets/images/icon3.png" alt=""></div>
        <div :class="[6].includes(playMoneyState)?'stateError':''" v-if="playMoneyState===6"><img src="../../assets/images/errorIcon.png" alt=""></div>
      </div>
    </div>
    <div class="order-state-content">
      <div :style="{color:playMoneyState===0?'':'#000'}">Pay Coins</div>
      <div :style="{color:[0,1].includes(playMoneyState)?'':'#000'}">{{ playMoneyState===7?'':'Confirm Order' }}</div>
      <div :style="{color:[0,1,2,3].includes(playMoneyState)?'':'#000'}">{{ playMoneyState===7?'':'Make Payment' }}</div>
      <div :style="{color:[0,1,2,3,4].includes(playMoneyState)?'':'#000'}" v-if="[0,1,2,3,4,5,6].includes(playMoneyState)">{{ playMoneyState===6?'Fail':'Payment Result' }}</div>
    </div>
    <div class="order-content">
        <div class="order-title">Order ID</div>
        <div class="order-con order-conId" @click="copy" :data-clipboard-text="orderStateData.orderId">
          <p>{{ orderStateData.orderId }}</p>
          <img src="../../assets/images/copy.png" alt="">
        </div>
        <div class="order-title" v-if="[0,1,2,3].includes(playMoneyState)">Network</div>
        <div class="order-con" v-if="[0,1,2,3].includes(playMoneyState)" @click="Network_show=true">
          <p>{{ Network.networkName }}</p>
          <img src="../../assets/images/rightIcon.png" alt="">
        </div>
        <div class="order-title" v-if="[0,1,2,3].includes(playMoneyState)">Address</div>
        <div class="order-con" v-if="[0,1,2,3].includes(playMoneyState)"  @click="copy" :data-clipboard-text="orderStateData.address">
          <p>{{ orderStateData.address }}</p>
          <div style="margin-top:.03rem" v-if="playMoneyState===0">
            <img style="margin-right:.2rem" @click.stop="qrCode" src="../../assets/images/Qrcode.png" alt="">
            <img src="../../assets/images/copy.png"  alt="">
          </div>
        </div>
        <div v-if="[4,5,6].includes(playMoneyState)" class="order-title">Card</div>
        <div v-if="[4,5,6].includes(playMoneyState)"  class="order-con" @click="goBank(playMoneyState)">
          <div>
            <p style="width:100%">Taiwan Business Bank,Sydney Branch</p>
            <div style="display:flex;margin-top:.1rem">
              <p style="width:36%">John Tan</p>
               <p style="margin-left:.2rem">{{ orderStateData.cardNumber }}</p><!--1234 **** **** 1234 -->
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
    <van-popup v-model="show" round>
      <div class="qrcode" >
        <div  ref="qrCodeUrl"></div>
        <p>Scan QR Code</p>
      </div>
      
    </van-popup>
    <van-popup v-model="Network_show" position="bottom" :style="{ height: '30%' }" >
        <div class="Network-content" v-for="item in Network_data" :key="item.id" @click="SetNetwork(item)">{{ item.networkName }}</div>
    </van-popup>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2';
import {AES_Encrypt,AES_Decrypt} from '../../utils/encryp'
export default{
  name:'orderState',
  data(){
    return {
      state:0,
      playMoneyState:0,
      show:false,
      orderStateData:'',
      Network:'',
      Network_data:[],
      Network_show:false,
      timer:null,
      timeText:''
      
    }
  },
  methods:{
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
      this.Network_show=false
      this.Network = text
      let params = {
        id:'5',
        cryptoCurrencyNetworkId:text.id
      }
      this.$axios.post(this.$api.post_setNetwork,params).then(res=>{
        if(res && res.data){
          this.orderStateData = res.data
          this.$toast(res.returnMsg)
          clearInterval(this.timer)
          // setTimeout(()=>{
          //   this.timer = setInterval(()=>{
          //     this.getCurrencyStatus()
          //     this.playMoneyState>=7?this.playMoneyState=0:this.playMoneyState++
          //   },2000)
          // },2000)
        }
      })
    },
    //获取网络列表
    getNetworkList(){
      let params = {
        coin:'USDT'
      }
      this.$axios.get(this.$api.get_networkList,params).then(res=>{
        if(res && res.data){
          this.Network_data = res.data
          this.Network = this.Network_data[0]
        }
      })
    },
    //获取打币状态
    getCurrencyStatus(){
      let parmas = {
        id:'5'
      }
      this.$axios.get(this.$api.get_PlayCurrencyStatus,parmas).then(res=>{
        // console.log(res.data);
        if(res && res.data){
          this.orderStateData = res.data
          // this.playMoneyState = res.data.orderStatus
          this.playMoneyState = 7
         
        }
      })
    },
    //进入银行卡信息页
    goBank(state){
      if(state == 6){
        alert(true)
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
        
        this.timeValue = (value / 900) * 100;
        console.log(this.timeText);
        // this.timeValue > 100 ? this.timeValue = 100 : '';
      }
    },
  },
  mounted(){
    this.getNetworkList()
    this.getCurrencyStatus()
    this.turnMinute(7200000)
    
    // this.timer = setInterval(()=>{
    //   this.getCurrencyStatus()
    //   this.playMoneyState>=7?this.playMoneyState=0:this.playMoneyState++
    // },2000)
  },
  beforeDestroy(){
    clearInterval(this.timer)
  }
}

</script>
<style lang="scss" scoped>
.order-container{
  // padding: 0 .2rem 0;
  .timing{
    font-size: .16rem;
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
    // padding: 0 .1rem 0;
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
        text-align: center;
        line-height: .4rem;
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
      font-family: Jost-Bold, Jost;
      font-size: .12rem;
      color: #999999;
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
  .Network-content:first-child{
    margin-top: .1rem;
  }
  .Network-content{
    // height: .4rem;
    width: 90%;
    padding: .1rem .2rem .1rem;
    box-sizing: border-box;
    font-size: .14rem;
    font-family:Jost-Bold, Jost ;
    border-bottom: 1px solid #EAEAEA;
    margin: .1rem 5%;
  }
  .qrcode{
    width: 3rem;
    height: 3rem;
    background: #FFFFFF;
    
    padding: .5rem;
    box-sizing: border-box;
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
  }
}
</style>