<template>
  <div id="configSell">
    <div class="configSell-content">
      <div class="bankCardInfo">
        <div class="bankCardInfo-title">{{ $t('nav.sell_configOrder_title') }}</div>
        <div class="bankCardInfo-view" @click="goCardForm">
          <div class="bankCardInfo-view-left">
            <div>{{ sellForm.name }}</div>
            <div class="name">{{ sellForm.accountNumber ? sellForm.accountNumber.substring(0,3) : '' }} **** **** {{ sellForm.accountNumber ? sellForm.accountNumber.substring(sellForm.accountNumber.length-4,sellForm.accountNumber.length) : '' }}</div>
          </div>
          <div class="bankCardInfo-view-right"><img src="../../../assets/images/rightBlackIcon.png" alt=""></div>
        </div>
      </div>
      <IncludedDetails-sell class="includedDetails-view"/>
    </div>
    <Button :buttonData="buttonData" :disabled="false" @click.native="submit">{{ $t('nav.Confirm') }}</Button>
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
          res.data.name ? oldSellForm.name = AES_Decrypt(res.data.name) : res.data.name;
          res.data.accountNumber ? oldSellForm.accountNumber = AES_Decrypt(res.data.accountNumber) : res.data.accountNumber;
          res.data.phone ? oldSellForm.phone = AES_Decrypt(res.data.contactNumber) : res.data.contactNumber;
          res.data.email ? oldSellForm.email = AES_Decrypt(res.data.email) : res.data.email;
          res.data.idNumber ? oldSellForm.idNumber = AES_Decrypt(res.data.idNumber) : '';
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
          cardNumber: this.$store.state.sellForm.accountNumber,
          swiftCode: this.$store.state.sellForm.swiftCode,
          bank: this.$store.state.sellForm.bankCode,
          cryptoCurrencyNetworkId: this.routerParams.currencyData.cryptoCurrencyNetworkId,
          fiatName: this.routerParams.payCommission.fiatCode,
          userCardId: this.$store.state.sellForm.id,
        };
        this.$axios.post(this.$api.post_sellConfirmOrder,params,'').then(res=>{
          this.buttonData.triggerNum = 0;
          if(res && res.returnCode === "0000"){
            this.$store.state.sellOrderId = res.data.id;
            this.$router.push({
              path:"/sellOrder",
              });
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
    font-size: 0.13rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
    color: #707070;
    margin-top: 0.28rem;
    .bankCardInfo-view{
      margin-top: 0.08rem;
      height: 0.76rem;
      background: #F3F4F5;
      border-radius: 0.1rem;
      display: flex;
      align-items: center;
      padding: 0 0.16rem;
      cursor: pointer;
      .bankCardInfo-view-left{
        div{
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        div:first-child{
          width: 2.6rem;
          min-height: 0.18rem;
          font-size: 0.16rem;
          font-family: "GeoRegular", GeoRegular;
          font-weight: normal;
          color: #232323;
        }
        .name{
          width: 2.6rem;
          min-width: 0.56rem;
          margin-top: 0.08rem;
          font-size: 0.13rem;
          font-family: "GeoRegular", GeoRegular;
          font-weight: normal;
          color: #999999;
        }
      }
      .bankCardInfo-view-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        img{
          width: 0.24rem;
        }
      }
    }
  }
  .includedDetails-view{
    margin-top: 0.4rem;
  }
}
</style>
