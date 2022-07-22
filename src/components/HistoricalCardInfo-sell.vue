<template>
  <div id="HistoricalCardInfo" @click="close($event)">
    <div class="content" ref="maskContent">
      <div class="cardView" v-for="(item,index) in cardInfoList" :key="index" :class="{'cardView-true': which===index}" @click="choiseCardInfo(item,index)">
        <div class="line1">
          <div class="line1-left">HSBC</div>
          <div class="line1-right"><span>****</span>{{ item.accountNumber.substring(item.accountNumber.length-4,item.accountNumber.length) }}</div>
        </div>
        <div class="line2">{{ item.name }}</div>
      </div>
      <button :disabled="disabled" @click.stop="confirmCard" ref="button_ref">Confirm</button>
    </div>
  </div>
</template>

<script>
import {AES_Decrypt} from "../utils/encryp";

export default {
  name: "HistoricalCardInfo-sell",
  data(){
    return{
      which: 0,
      cardInfo: {},
      cardInfoList: [],
    }
  },
  computed: {
    disabled(){
      if(JSON.stringify(this.cardInfo) !== '{}'){
        return false
      }else{
        return true
      }
    },
  },
  watch: {
    '$store.state.sellRouterParams.cardInfoList': {
      deep: true,
      immediate: true,
      handler(val){
        let cardInfoList = JSON.parse(JSON.stringify(val));
        this.cardInfo = val[0];
        cardInfoList.forEach((item,index)=>{
          cardInfoList[index].accountNumber = AES_Decrypt(item.accountNumber);
          cardInfoList[index].name = AES_Decrypt(item.name);
        })
        this.cardInfoList = cardInfoList;
      }
    }
  },
  methods: {
    choiseCardInfo(item,index){
      this.cardInfo = item;
      this.which = index;
    },
    close(event){
      if(!this.$refs.maskContent.contains(event.target)){
        this.$parent.historicalCardInfoSell_state = false;
      }
    },
    confirmCard(){
      this.$store.state.sellRouterParams.sellForm = this.cardInfo;
      this.$parent.historicalCardInfoSell_state = false;
    },
  }
}
</script>

<style lang="scss" scoped>
#HistoricalCardInfo{
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.15);
  .content{
    margin: 1.54rem auto;
    width: 3.45rem;
    background: #FFFFFF;
    border-radius: 0.18rem;
    padding: 0.32rem 0.16rem;
    .cardView{
      width: 100%;
      height: 0.83rem;
      background: #FFFFFF;
      border: 1px solid #EEEEEE;
      border-radius: 0.06rem;
      padding: 0 0.16rem;
      margin-top: 0.12rem;
      cursor: pointer;
      &:first-child{
        margin-top: 0;
      }
      .line1{
        display: flex;
        font-family: 'SFProDisplaybold',SFProDisplaybold;
        font-weight: 600;
        font-size: 0.16rem;
        text-align: center;
        color: #949EA4;
        margin-top: 0.2rem;
        .line1-right{
          margin-left: auto;
          font-family: 'SFProDisplaybold',SFProDisplaybold;
          font-weight: 600;
          font-size: 0.16rem;
          text-align: center;
          color: #949EA4;
          span{
            color: #C2C2C2;
          }
        }
      }
      .line2{
        font-family: 'SFProDisplaybold',SFProDisplaybold;
        font-weight: 400;
        font-size: 0.13rem;
        color: #949EA4;
        margin-top: 0.08rem;
      }
    }

    //选中样式
    .cardView-true{
      background: #FFF4DE;
      border: 1px solid #FBE3B6;
      .line1{
        color: #8A5B00;
        .line1-right{
          color: #8A5B00;
          span{
            color: #DDBD7E;
          }
        }
      }
      .line2{
        color: #8A5B00;
      }
    }
    button{
      margin-top: 0.24rem;
      width: 100%;
      height: 0.58rem;
      background: #0059DA;
      border-radius: 0.3rem;
      font-family: 'SFProDisplayMedium',SFProDisplayMedium;
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      text-align: center;
      line-height: 0.58rem;
      color: #FFFFFF;
      border: none;
      cursor: pointer;
      &:disabled{
        opacity: 0.25;
        cursor: no-drop;
      }
    }
  }
}
</style>
