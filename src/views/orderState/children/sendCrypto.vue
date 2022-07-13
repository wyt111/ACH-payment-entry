<template>
  <div class="sendCrypto-container">
    <div>
      <div class="sendCrypto_title">
      <p>You get <span> 300.00 USD </span>  for <span> 123.00 USDT </span> </p>
      <p>
        <img src="@/assets/images/SellTime.png" alt="">
        15s
      </p>
    </div>
    <div class="sendCrypto_title" style="margin-top:.16rem">
      <p>Ramp fee </p>
      <p style="color:#063376">$ 0.81</p>
    </div>
    <div class="sendCrypto_title" style="margin-top:.16rem">
      <p >Order ID </p>
      <p style="cursor: pointer;" class="order-con" @click="copy" data-clipboard-text="d7bHJKBY2n2BIBwbd2739BN2911">
        <span style="width:2rem;overflow:hidden;font-style: normal;text-overflow: ellipsis;">d7bHJKBY2n2BIBwbd2739BN2911</span>
        <img style="height:.2rem;margin-left:.08rem;flex:1" src="@/assets/images/copySell.png" alt="">
      </p>
    </div>
    <div class="sendCrypto_qrcode">
      <p>Please transfer ETH to the address within <span>2:00:00</span></p>
      <div ref="qrCodeUrl" class="qrCodeUrl" style="width:1.4rem;height:1.4rem;"></div>
    </div>
    <div class="sendCrypto_content">
      <div class="title">Address (ACH)</div>
      <div class="content order-con" @click="copy" data-clipboard-text="23hd8932bc3455ert76e4rre2345">
        <p style="width:2.5rem;overflow:hidden;font-style: normal;text-overflow: ellipsis;">23hd8932bc3455ert76e4rre2345</p>
        <img src="@/assets/images/copySell.png" alt="">
      </div>
    </div>
    <div class="sendCrypto_content">
      <div class="title">Network</div>
      <div class="content" @click="Network_show = true">
        <p>Ethereum</p>
        <img style="height:.15rem" src="@/assets/images/SelectNetwork.png" alt="">
      </div>
    </div>
    <div class="sendCrypto_bottom_title">Please ensure the network selected is correct to avoid loss of assets.</div>
    </div>
    <div class="sendCrypto_button" @click="transferredShow=true">
      I have sent the USDT
      <img src="@/assets/images/rightIconSell.png" alt="">
    </div>
    <div class="sendCrypto_confing" v-show="transferredShow" >
      <div class="content">
        <p>I have transferred the crypto to the indicated address and network.</p>
        <div>
          <p @click.stop="confirmSell">Confirm</p>
          <p @click.stop="transferredShow = false">Not Yet</p>
        </div>
      </div>
    </div>
   <div class="sendCrypto_bottom" v-show="Network_show" @click.stop="Network_show = false">
     
   </div>
   <div :class="!Network_show?'sendCrypto_bottomContent':'sendCrypto_bottomContent sendCrypto_bottomContentActive'" >
       <div class="Network-title">{{ $t('nav.Sellorder_Network') }} <img @click="Network_show = false" src="@/assets/images/ShutDown.png" alt=""></div>
       <div class="Network-content">Ethereum (ERC20)</div>
       <div class="Network-content">Ethereum (ERC20)</div>
       <div class="Network-content">Ethereum (ERC20)</div>
     </div>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2';
export default {
  
  name:'sendCrypto',
  data(){
    return{
      transferredShow:false,
      Network_show:false,
    }
  },
  mounted(){
    this.generateQRcode()
    console.log(this.$route.meta.title = 'nav.SellOrder_title');
  },
  activated(){
    console.log(this.$route.meta.title = 'nav.SellOrder_title');
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
       this.$refs.qrCodeUrl.innerHTML = "";
      new QRCode(this.$refs.qrCodeUrl, {
        text: 'd7bHJKBY2n2BIBwbd2739BN2911',
        width: '140',
        height: '140',
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    }
 
  
  }
}
</script>
<style lang="scss" scoped>

.sendCrypto-container{
  width: 100%;
  padding-bottom: .6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // position: relative;
  

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
    height: 2.12rem;
    margin-top: .24rem;
    background: #F7F8FA;
    border-radius: .06rem;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    height: .58rem;
    background: #0059DA;
    color: #FFFFFF;
    border-radius: .3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
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
    border-radius: .3rem .3rem 0 0 ;
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
    }
  }
  .sendCrypto_bottomContentActive{
    transform: translate(0,0rem) !important;
    transition: .5s;
  }
 
}
</style>