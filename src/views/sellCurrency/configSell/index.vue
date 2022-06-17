<template>
  <div id="configSell">
    <div class="configSell-content">
      <div class="bankCardInfo">
        <div class="bankCardInfo-title">Bank Card</div>
        <div class="bankCardInfo-view" @click="goCardForm">
          <div class="bankCardInfo-view-left">
            <div>{{ sellForm.bank }}</div>
            <div>{{ sellForm.firstname }} {{ sellForm.lastname }} <span>{{ sellForm.cardNumber ? sellForm.cardNumber.substring(0,3) : '' }} **** **** {{ sellForm.cardNumber ? sellForm.cardNumber.substring(sellForm.cardNumber.length-4,sellForm.cardNumber.length) : '' }}</span></div>
          </div>
          <div class="bankCardInfo-view-right"><img src="../../../assets/images/rightIcon.png" alt=""></div>
        </div>
      </div>
      <IncludedDetails-sell class="includedDetails-view"/>
    </div>
    <Button :buttonData="buttonData" :disabled="false" @click.native="submit">Confirm</Button>
  </div>
</template>

<script>
import IncludedDetailsSell from '../../../components/IncludedDetailsSell';
import Button from '../../../components/Button';
import { AES_Decrypt } from "../../../utils/encryp";

export default {
  name: "index",
  components: { IncludedDetailsSell, Button },
  data(){
    return{
      //按钮状态
      buttonData: {
        loading: false,
        triggerNum: 0,
        customName: true,
      },

      routerParams: {},
      sellForm: {},
    }
  },
  activated(){
    this.buttonData = {
      loading: false,
      triggerNum: 0,
      customName: true,
    };
    this.reveiveInfo();
  },
  methods: {
    reveiveInfo(){
      this.routerParams = this.$store.state.sellRouterParams;
      this.queryCardInfo();
    },
    queryCardInfo(){
      let params = {
        country: this.$store.state.sellRouterParams.positionData.alpha2,
        fiatName: this.$store.state.sellRouterParams.positionData.fiatCode,
      };
      this.$axios.get(this.$api.get_userSellCardInfo,params).then(res=>{
        if(res && res.returnCode === "0000" && res.data !== null){
          this.$store.state.sellForm = Object.assign({},res.data);
          let oldSellForm = new Object();
          oldSellForm.firstname = AES_Decrypt(res.data.firstname);
          oldSellForm.lastname = AES_Decrypt(res.data.lastname);
          oldSellForm.cardNumber = AES_Decrypt(res.data.cardNumber);
          oldSellForm.phone = AES_Decrypt(res.data.phone);
          oldSellForm.email = AES_Decrypt(res.data.email);
          oldSellForm.idNumber = AES_Decrypt(res.data.idNumber);
          this.sellForm = Object.assign(res.data,oldSellForm);
        }
      })
    },

    goCardForm(){
      this.$store.state.cardInfoFromPath = "configSell";
      this.$router.push("/sell-formUserInfo");
    },

    submit(){
      if(this.buttonData.triggerNum === 1){
        let params = {
          cryptoCurrency: this.routerParams.cryptoCurrency,
          sellVolume: this.routerParams.amount,
          worldId: this.routerParams.positionData.worldId,
          symbol: this.routerParams.payCommission.symbol,
          cardNumber: this.$store.state.sellForm.cardNumber,
          swiftCode: this.$store.state.sellForm.swiftCode,
          bank: this.$store.state.sellForm.bank,
          cryptoCurrencyNetworkId: this.routerParams.currencyData.cryptoCurrencyNetworkId,
          fiatName: this.routerParams.payCommission.fiatCode
        };
        this.$axios.post(this.$api.post_sellConfirmOrder,params,'').then(res=>{
          this.buttonData.triggerNum = 0;
          if(res && res.returnCode === "0000"){
            this.$store.state.sellOrderId = res.data.id;
            this.$router.push("/sellOrder");
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#configSell{
  display: flex;
  flex-direction: column;
  .configSell-content{
    flex: 1;
    overflow: auto;
  }
  .bankCardInfo{
    font-size: 0.14rem;
    font-weight: 500;
    color: #232323;
    margin-top: 0.2rem;
    .bankCardInfo-view{
      margin-top: 0.1rem;
      min-height: 1rem;
      background: #F3F4F5;
      border-radius: 0.1rem;
      display: flex;
      padding: 0.21rem 0.2rem;
      cursor: pointer;
      .bankCardInfo-view-left{
        font-size: 0.16rem;
        font-weight: bold;
        color: #232323;
        div:last-child{
          margin-top: 0.1rem;
          font-size: 0.16rem;
          font-weight: 400;
          color: #999999;
          span{
            margin-left: 0.4rem;
          }
        }
      }
      .bankCardInfo-view-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        img{
          width: 0.12rem;
        }
      }
    }
  }
  .includedDetails-view{
    margin-top: 0.4rem;
  }
}
</style>
