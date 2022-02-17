<!--  supportCurrency === true Not selectable  -->
<template>
  <div id="receiveCoins">
    <div class="promptInformation">
      <span v-if="supportCurrency">You can receive to an address you own or deposit to Alchemy Pay Wallet.</span>
      <span v-else>You can receive to an address you own.</span>
    </div>
    <div class="collectionMethod" v-if="supportCurrency">
      <div class="methods">
        <div class="methods_name">Deposit to Alchemy Pay Wallet</div>
        <div class="methods_check"><input type="checkbox" v-model="checkModel" value="ach"></div>
      </div>
      <div v-if="checkModel[0]==='ach'">
        <div class="methods_tips">Since you have registered Alchemy Pay Wallet, the coins will be deposited into your account.</div>
        <div class="methods_account">Account: <span>zyfqqq123456@gmail.com</span></div>
      </div>
    </div>
    <div class="collectionMethod">
      <div class="methods">
        <div class="methods_name">Receive to an address you own</div>
        <div class="methods_check" v-if="supportCurrency"><input type="checkbox" v-model="checkModel" value="address"></div>
      </div>
      <div v-if="checkModel[0]==='address'">
        <div class="methods_myAddress">
          <div class="methods_input"><input type="text" placeholder="Wallet Address…"></div>
<!--          <div class="methods_errorText">Not a valid ACH address.</div>-->
        </div>
        <div class="methods_myAddress">
          <div class="methods_title">Network</div>
          <div class="methods_input network_input">
            <input type="text" placeholder="Select Network" disabled>
            <span class="rightIcon"><img src="../../assets/images/rightIcon.png"></span>
          </div>
        </div>
      </div>
    </div>
    <includedDetails/>
  </div>
</template>

<script>
import includedDetails from "../emailCode/childrens/includedDetails";
export default {
  name: "Receive coins",
  components: { includedDetails },
  data(){
    return{
      checkModel: [],
      //ach支持的币种可以选择
      supportCurrency: true,
    }
  },
  watch: {
    checkModel(){
      if(this.checkModel[0] === 'ach' && this.checkModel.length === 1){
        this.checkModel[0] = 'ach';
        this.checkModel = [...new Set(this.checkModel)];
        return
      }
      if(this.checkModel[0] === 'address' && this.checkModel.length === 1){
        this.checkModel[0] = 'address';
        this.checkModel = [...new Set(this.checkModel)];
        return
      }
      if(this.checkModel[0] === 'address' && this.checkModel.length > 1){
        this.checkModel[0] = 'ach';
        this.checkModel = [...new Set(this.checkModel)];
        return
      }
      if(this.checkModel[0] === 'ach' && this.checkModel.length > 1){
        this.checkModel[0] = 'address';
        this.checkModel = [...new Set(this.checkModel)];
        return
      }
    },
  },
  mounted() {
    this.supportCurrency === false ? this.checkModel[0] = 'address' : '';
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
#receiveCoins{
  .promptInformation{
    font-size: 0.14rem;
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #232323;
    line-height: 0.24rem;
  }
  .collectionMethod:nth-of-type(1){
    margin-top: 0.1rem;
  }
  .collectionMethod{
    margin-top: 0.2rem;
    background: #F3F4F5;
    border-radius: 10px;
    padding: 0.2rem;
    .methods{
      display: flex;
      align-items: center;
      .methods_name{
        font-size: 0.16rem;
        font-family: Jost-Medium, Jost;
        font-weight: 500;
        color: #232323;
      }
      .methods_check{
        display: flex;
        margin-left: auto;
        input{
          cursor: pointer;
        }
      }
    }
    .methods_myAddress{
      div{
        display: flex;
        align-items: center;
      }
      .methods_input{
        height: 0.6rem;
        background: #FFFFFF;
        border-radius: 10px;
        margin-top: 0.2rem;
        position: relative;
        input{
          width: 100%;
          height: 100%;
          background: #FFFFFF;
          border-radius: 10px;
          font-size: 0.16rem;
          font-family: Jost-Regular, Jost;
          border: none;
          outline: none;
          padding: 0 0.21rem;
          border: 1px solid #232323;
        }
        input:focus{
          border: 1px solid #4479D9;
        }
        .rightIcon{
          position: absolute;
          right: 0.21rem;
          display: flex;
          img{
            width: 0.12rem;
          }
        }
      }
      .network_input input{
        padding: 0 0.5rem 0 0.21rem;
      }
      .methods_errorText{
        font-size: 0.14rem;
        font-family: Jost-Regular, Jost;
        font-weight: 400;
        color: #FF0000;
        margin: 0.1rem 0 0 0.2rem;
      }
      .methods_title{
        font-size: 0.16rem;
        font-family: Jost-Medium, Jost;
        font-weight: 500;
        color: #232323;
        margin-top: 0.2rem;
      }
    }
    .methods_tips{
      font-size: 0.154rem;
      font-family: Jost-Regular, Jost;
      font-weight: 400;
      color: #999999;
      line-height: 0.24rem;
      margin-top: 0.1rem;
    }
    .methods_account{
      font-size: 0.16rem;
      font-family: Jost-Regular, Jost;
      font-weight: 400;
      color: #999999;
      line-height: 0.24rem;
      margin-top: 0.1rem;
      span{
        color: #4479D9;
      }
    }
  }
}
</style>
