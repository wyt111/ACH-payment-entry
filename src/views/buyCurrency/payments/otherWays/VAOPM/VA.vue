<template>
  <!-- choise bank -->
  <div id="VABox">
    <div class="payAmountInfo-title">{{ $t('nav.buy_configPayIDR_va_title') }}</div>
    <div class="payAmountInfo-box" v-if="bankState">
      <div class="payAmountInfo-box-line" v-for="(item,index) in bankCardList" :key="index" @click="choiseBankCard(item,index)">
        <div class="logo"><img :src='require(`@/assets/images/bankCard/${item.bankLogo}`)'></div>
        <div class="name">{{ item.bankCardName }} <span>- {{ item.bankCardFullName }}</span></div>
        <div class="option" @click="choiseCheck(item,index)">
<!--          <input type="checkbox" v-model="item.check" :value="item.check" @click="bankCardList[index].check=false">-->
          <el-checkbox v-model="item.check" :value="item.check"></el-checkbox>
        </div>
      </div>
    </div>
    <!-- Display data after selecting bank card -->
    <div v-else>
      <div class="payAmountInfo-box">{{ payExplain.bankCardName }}</div>
      <div class="payAmountInfo-title" v-if="codeState">{{ $t('nav.buy_configPayIDR_va_codeTitle') }}</div>
      <div class="payAmountInfo-box paymentCode" v-if="codeState" @click="copy" :data-clipboard-text="payCode">
        <p>{{ payCode }}</p>
        <p class="copyIcon"><img src="../../../../../assets/images/copyIcon.png"></p>
      </div>
      <div class="helpView" v-for="(value,key) in payExplain.allHelpTips" :key="key">
        <div class="helpView-title" @click.stop="lookMore(value,key)">
          <p>How to pay at the {{ value.helpTitle }}</p>
          <p><img src="@/assets/images/rightBlackIcon.png" :class="{'iconCSS3': value.openState,'iconCSS3-back': !value.openState}"></p>
        </div>
        <div class="helpView-line" v-for="(item,index) in value.helpInfo" :key="index" v-show="value.openState">
          <div class="headline"><div class="serialNumber"></div><div>{{ item.text }}</div></div>
          <div class="subtitle" v-for="(itemChild,indexChild) in item.children" :key="indexChild">{{ itemChild.number }} {{ itemChild.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import allBankCards from '@/assets/json/bankCardInfo';
import { timeDown } from "@/utils/index";

export default {
  name: "VA",
  data(){
    return{
      bankState: true,
      bankCardList: [],

      routerParams: {},

      payExplain: [],

      paymentCountDown: null,
      paymentCountDownNum: 900,
      paymentCountDownMinute: "15:00",
      paystateTimeOut: null,

      payCode: '',

      codeState: false,
    }
  },

  mounted(){
    this.receiveinfo();
  },
  methods:{
    receiveinfo(){
      this.routerParams = this.$store.state.buyRouterParams
      //Selected Receive local data
      if(sessionStorage.getItem("indonesiaPayment")){
        this.payExplain = JSON.parse(sessionStorage.getItem("indonesiaPayment"));
        this.payCode = this.payExplain.payCode;
        this.$parent.payCode = this.payExplain.payCode;
        this.bankState = false;
        this.codeState = true;
        this.paymentCountDownNum = this.payExplain.paymentCountDownNum;
        this.$parent.paymentCountDownMinute = this.payExplain.paymentCountDownMinute;
        this.$parent.startPayment = true;
        this.refreshPaystate();
        return;
      }
      //No choice Initialization data
      this.initializationData();
    },

    //Help information add drop-down status add Fetch data
    initializationData(){
      let newData = allBankCards.filter((item,index) => {
        allBankCards[index].check = false;
        return item.allHelpTips.filter(value => {
          return value.openState = false
        })
      })
      this.bankCardList = newData;
    },

    //Select bank cards
    choiseBankCard(item,index){
      this.payExplain = item;
      this.bankCardList.filter(item=>{return item.check=false});
      this.bankCardList[index].check = true;
      this.payExplain = item;
      //修改父组件数据
      this.$parent.payExplain = item;
    },

    //Store data to prevent page refresh
    storeData(){
      this.payExplain.payCode = this.payCode;
      this.payExplain.paymentCountDownNum = this.paymentCountDownNum;
      this.payExplain.paymentCountDownMinute = this.$parent.paymentCountDownMinute;
      sessionStorage.setItem("indonesiaPayment",JSON.stringify(this.payExplain));
    },
    refreshPaystate(){
      //15 minutes order countdown
      this.paymentCountDown = setInterval(()=>{
        //order overtime
        if(this.paymentCountDownNum === 0){
          this.$router.replace(`/paymentResult?customParam=${this.$store.state.buyRouterParams.orderNo}`);
        }
        this.$parent.paymentCountDownMinute = timeDown(this.paymentCountDownNum);
        this.paymentCountDownNum -= 1;
        //Real time storage countdown
        this.storeData();
      },1000);

      //Refresh payment status
      this.requestStatus();
      this.paystateTimeOut = setInterval(()=>{
        this.requestStatus();
      },1000);
    },

    //order status
    requestStatus(){
      let params = {
        "orderNo": this.$store.state.buyRouterParams.orderNo
      }
      this.$axios.get(this.$api.get_payResult,params).then(res=>{
        if(res && res.returnCode === '0000' && res.data.orderStatus > 2 && res.data.orderStatus <= 6){
          this.$router.replace(`/paymentResult?customParam=${this.$store.state.buyRouterParams.orderNo}`);
        }
      })
    },

    choiseCheck(item,index){
      this.bankCardList[index].check = false;
    },

    //Expand data
    lookMore(value,key){
      if(this.payExplain.allHelpTips[key].openState === false){
        this.payExplain.allHelpTips[key].openState = true;
        return;
      }
      if(this.payExplain.allHelpTips[key].openState === true){
        this.payExplain.allHelpTips[key].openState = false;
      }
    },

    VAPay(){
      //place an order
      this.bankState = false;
      var params = {
        orderNo: this.$store.state.buyRouterParams.orderNo,
        payBankCode: this.payExplain.bankCode,
        lastname: "11111"
      }
      this.$axios.post(this.$api.post_indonesiaBuy,params,'submitToken').then(res=>{
        if(res && res.returnCode === '0000'){
          this.$parent.startPayment = true;
          this.refreshPaystate();
          this.codeState = true;
          this.payCode = res.data.webUrl;
          this.$parent.payCode = res.data.webUrl;
          this.storeData();
        }
      })
    },
    copy(){
      let clipboard = new Clipboard('.paymentCode');
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
    }
  },
  destroyed() {
    clearInterval(this.paystateTimeOut);
    clearInterval(this.paymentCountDown);
    sessionStorage.removeItem("indonesiaPayment");
  }
}
</script>

<style lang="scss" scoped>
.payAmountInfo-title{
  font-size: 0.13rem;
  font-family: "GeoRegular", GeoRegular;
  font-weight: normal;
  color: #707070;
  margin-top: 0.32rem;
}
.payAmountInfo-box{
  margin-top: 0.08rem;
  min-height: 0.56rem;
  background: #F3F4F5;
  border-radius: 0.12rem;
  font-size: 0.16rem;
  font-family: "GeoDemibold", GeoDemibold;
  font-weight: normal;
  color: #232323;
  line-height: 0.6rem;
  padding: 0 0.16rem;
  .payAmountInfo-box-line{
    height: 0.56rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #E9E9E9;
    cursor: pointer;
    &:last-child{
      border-bottom: none;
    }
    .logo{
      display: flex;
      img{
        width: 0.64rem;
        max-height: 0.2rem;
      }
    }
    .name{
      font-size: 0.16rem;
      font-family: "GeoDemibold", GeoDemibold;
      font-weight: normal;
      color: #232323;
      margin-left: 0.2rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      padding-right: 0.37rem;
      span{
        font-family: "GeoRegular",GeoRegular;
        color: #666666;
      }
    }
    .option{
      margin-left: auto;
    }
  }
}

.paymentCode{
  font-size: 0.21rem;
  font-family: "GeoRegular", GeoRegular;
  font-weight: normal;
  color: #232323;
  display: flex;
  cursor: pointer;
  p:nth-of-type(1){
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }
  .copyIcon{
    display: flex;
    align-items: center;
    margin-left: auto;
    img{
      width: 0.14rem;
    }
  }
}

.helpView{
  cursor: pointer;
  min-height: 0.56rem;
  background: #F3F4F5;
  border-radius: 0.12rem;
  font-size: 0.13rem;
  font-family: "GeoLight", GeoLight;
  font-weight: normal;
  color: #707070;
  padding: 0 0.16rem;
  margin-top: 0.16rem;
  .helpView-title{
    display: flex;
    align-items: center;
    height: 0.56rem;
    p:last-child{
      margin-left: auto;
      img{
        width: 0.24rem;
      }
    }
  }
  .helpView-line{
    margin-top: 0.08rem;
    &:last-child{
      padding-bottom: 0.2rem;
    }
    .headline{
      display: flex;
      align-items: flex-start;
      font-size: 0.15rem;
      font-family: "GeoLight", GeoLight;
      color: #666666;
      position: relative;
      .serialNumber::after{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 0.06rem;
        height: 0.06rem;
        background: #666666;
        border-radius: 50%;
        margin-right: 0.1rem;
        margin-top: 0.05rem;
      }
      div:last-child{
        max-width: 3rem;
        padding-left: 0.15rem;
      }
    }
    .subtitle{
      margin-left: 0.15rem;
      margin-top: 0.07rem;
    }
  }
  .iconCSS3{
    transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    /* Internet Explorer 9*/
    -moz-transform: rotate(90deg);
    /* Firefox */
    -webkit-transform: rotate(90deg);
    /* Safari and Chrome */
    -o-transform: rotate(90deg);
    transition-duration: 0.3s;
  }
  .iconCSS3-back{
    transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    /* Internet Explorer 9*/
    -moz-transform: rotate(0deg);
    /* Firefox */
    -webkit-transform: rotate(0deg);
    /* Safari and Chrome */
    -o-transform: rotate(0deg);
    transition-duration: 0.3s;
  }
}

//element-ui复选框
#VABox ::v-deep .el-checkbox__inner:hover{
  border-color: #232323 !important;
  border-radius: 3px;
}
#VABox ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: #0059DA;
  border: 1px solid #0059DA;
  border-radius: 0.05rem;
}
#VABox ::v-deep .el-checkbox__inner{
  border: 1px solid #232323;
  border-radius: 3px;
}
</style>
