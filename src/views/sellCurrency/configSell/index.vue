<template>
  <div id="configSell">
    <div class="configSell-content">
      <div class="bankCardInfo">
        <div class="bankCardInfo-title">Bank Card</div>
        <div class="bankCardInfo-view">
          <div class="bankCardInfo-view-left">
            <div>{{ bankInfo.bankName }}</div>
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
      bankInfo: {},
    }
  },
  mounted(){
    this.reveiveInfo();
  },
  methods: {
    reveiveInfo(){
      this.sellForm = this.$store.state.sellForm;
      this.bankInfo = this.$store.state.bankInfo;
      this.routerParams = this.$store.state.routerParams;
      this.sellForm.firstname = AES_Decrypt(this.sellForm.firstname);
      this.sellForm.lastname = AES_Decrypt(this.sellForm.lastname);
      this.sellForm.cardNumber = AES_Decrypt(this.sellForm.cardNumber);
      this.sellForm.phone = AES_Decrypt(this.sellForm.phone);
      this.sellForm.email = AES_Decrypt(this.sellForm.email);
      this.sellForm.idNumber = AES_Decrypt(this.sellForm.idNumber);
    },
    submit(){
      if(this.buttonData.triggerNum === 1){
        let params = {
          cryptoCurrency: this.routerParams.cryptoCurrency,
          sellVolume: this.routerParams.amount,
          worldId: this.routerParams.positionData.worldId,
          symbol: this.routerParams.payCommission.symbol,
          cardNumber: this.$store.state.sellForm.cardNumber,
          swiftCode: this.bankInfo.bankCode,
          bank: this.bankInfo.bankName,
          cryptoCurrencyNetworkId: this.routerParams.currencyData.cryptoCurrencyNetworkId,
          fiatName: this.routerParams.payCommission.code
        };
        this.$axios.post(this.$api.post_sellConfirmOrder,params,'').then(res=>{
          this.buttonData.triggerNum = 0;
          if(res && res.returnCode === "0000"){

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
