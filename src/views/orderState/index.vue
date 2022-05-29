<template>
  <div class="order-container">
    <div class="timing">Please transfer ACH to the address within <span>45</span></div>
    <div class="order-state-title">Wait Crypto…</div>
    <div class="order-state">
      <div class="state">
        <div v-if="state===0">1</div>
        <div :class="state===2?'stateSuccessful':''" v-if="state===1||state===2"><img src="../../assets/images/icon4.png" alt=""></div>
        
      </div>
      <div class="state-content">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="state===0">2</div>
       <div :class="state===2?'stateSuccessful':''" v-if="state===1||state===2"><img src="../../assets/images/icon1.png" alt=""></div>
      </div>
      <div class="state-content">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="state===0">3</div>
        <div :class="state===2?'stateSuccessful':''" v-if="state===1||state===2"><img src="../../assets/images/icon2.png" alt=""></div>
      </div>
      <div class="state-content">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="state">
        <div v-if="state===0">4</div>
        <div :class="state===2?'stateSuccessful':''" v-if="state===1||state===2"><img src="../../assets/images/icon3.png" alt=""></div>
      </div>
    </div>
    <div class="order-state-content">
      <div>Pay Coins</div>
      <div>Confirm Order</div>
      <div>Make Payment</div>
      <div>Payment Result</div>
    </div>
    <div class="order-content">
        <div class="order-title">Order ID</div>
        <div class="order-con order-conId" @click="copy" data-clipboard-text="23hd8932bcxcbmiw3455ert76e4rre2345">
          <p>23hd8932bcxcbmiw3455ert76e4rre2345</p>
          <img src="../../assets/images/copy.png" alt="">
        </div>
        <div class="order-title">Network</div>
        <div class="order-con" @click="Network_show=true">
          <p>{{ Network }}</p>
          <img src="../../assets/images/rightIcon.png" alt="">
        </div>
        <div class="order-title">Address</div>
        <div class="order-con"  @click="copy" data-clipboard-text="23hd8932bcxcbmiw3455">
          <p>23hd8932bcxcbmiw3455</p>
          <div style="margin-top:.03rem">
            <img style="margin-right:.2rem" @click.stop="qrCode" src="../../assets/images/Qrcode.png" alt="">
            <img src="../../assets/images/copy.png"  alt="">
          </div>
        </div>
        <div v-if="state===3" class="order-title">Card</div>
        <div v-if="state===3" class="order-con">
          <div>
            <p>Taiwan Business Bank,Sydney Branch</p>
            <div style="display:flex;margin-top:.1rem">
              <p style="width:36%">John Tan</p>
              <p style="margin-left:.2rem">1234 **** **** 1234</p>
            </div>
          </div>
          <img src="" alt="">
        </div>

    </div>
    <van-popup v-model="show" round>
      <div class="qrcode" >
        <div  ref="qrCodeUrl"></div>
      </div>
      
    </van-popup>
    <van-popup v-model="Network_show" position="bottom" :style="{ height: '30%' }" >
        <div class="Network-content" v-for="item in Network_data" :key="item.id" @click="SetNetwork(item.name)">{{ item.name }}</div>
    </van-popup>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2';
export default{
  name:'orderState',
  data(){
    return {
      state:2,
      show:false,
      handleQrAddress:'23hd8932bcxcbmiw3455',
      Network:'Bitcoin',
      Network_data:[
        {id:0,name:'Bitcoin'},
        {id:1,name:'BTC'},
        {id:2,name:'CNY'}
      ],
      Network_show:false
      
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
        text: this.handleQrAddress,
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
    SetNetwork(text){
      this.Network_show=false
      this.Network = text
    },
    getNetworkList(){
      // let params = {
      //   coin:'CNY'
      // }
      // this.$axios.get(this.$api.get_networkList).then(res=>{
      //   if(res && res.data){
      //     this.Network_data = res.data
      //   }
      // })
    },
    getUserCard(){
      // let params = {
      //   "country":'CN',
      //   "fiatName":'USDT'
      // }
      // this.$axios.get(this.$api.get_userCard,params).then(res=>{
      //   console.log(res);
      // })
    },
    getCurrencyStatus(){
      // let parmas = {

      // }
      this.$axios.get(this.$api.get_PlayCurrencyStatus)
    }

  },
  mounted(){
    this.getNetworkList()
    this.getUserCard()
  }
}

</script>
<style lang="scss" scoped>
.order-container{
  padding: 0 .2rem 0;
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
  .Network-content:first-child{
    margin-top: .1rem;
  }
  .Network-content{
    // height: .4rem;
    padding: .1rem .2rem .1rem;
    box-sizing: border-box;
    font-size: .14rem;
    font-family:Jost-Bold, Jost ;
    border-bottom: 1px solid #EAEAEA;
  }
  .qrcode{
    width: 3rem;
    height: 3rem;
    background: #FFFFFF;
    
    padding: .5rem;
    box-sizing: border-box;
  }
}
</style>