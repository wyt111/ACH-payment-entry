<template>
  <div id="receiveCoins">
    <!-- select network -->
    <search v-if="searchViewState" :viewName="viewName" :allBasicData="networkList"/>
    <!-- Select acceptance method -->
    <div class="receiveCoins-view" v-show="!searchViewState" ref="includedDetails_ref">
      <div class="receiveCoins-content">
        <div class="promptInformation">
          <span v-if="supportCurrency">Please provide cryptocurrency address to receive your order</span>
          <span v-else>Enter your wallet address.</span>
        </div>
        <div class="collectionMethod" v-if="supportCurrency" @click="checkMethods('ach')">
          <div class="methods">
            <div class="methods_name">Deposit to Alchemy Pay Wallet</div>
            <div class="methods_check"><input type="checkbox" v-model="checkModel" value="ach"></div>
          </div>
          <div v-if="checkModel[0]==='ach'">
            <div class="methods_tips">Since you have registered Alchemy Pay Wallet, the coins will be deposited into your account.</div>
            <div class="methods_account">Account: <span>{{ email }}</span></div>
          </div>
        </div>
        <div class="collectionMethod" @click="checkMethods('address')">
          <div class="methods">
            <div class="methods_name">Your {{ routerParams.cryptoCurrency }} address</div>
            <div class="methods_check" v-if="supportCurrency"><input type="checkbox" v-model="checkModel" value="address"></div>
          </div>
          <div v-if="checkModel[0]==='address'">
            <div class="methods_myAddress">
              <div class="methods_input"><input type="text" v-model="buyParams.address" placeholder="Wallet Address…" @blur="networkAddressBlur" :disabled="addressDefault"></div>
              <div class="methods_errorText" v-if="walletAddress_state">Not a valid {{ buyParams.cryptoCurrency }} address.</div>
            </div>
            <div class="methods_myAddress">
              <div class="methods_title">Network</div>
              <div class="methods_input network_input" @click="openSelect">
                <input type="text" placeholder="Select Network" v-model="buyParams.network" disabled>
                <span class="rightIcon"><img src="../../../assets/images/rightIcon.png"></span>
              </div>
            </div>
          </div>
        </div>
        <!-- Expense information -->
        <includedDetails class="includedDetails_view" :network="buyParams.network"/>
      </div>
      <div class="continueBox" v-show="!searchViewState">
        <button class="continue" @click="transaction" :disabled="disabled">Continue</button>
      </div>
    </div>
  </div>
</template>

<script>
import { AES_Decrypt, AES_Encrypt } from '@/utils/encryp.js';
import includedDetails from "../../../components/IncludedDetails";
import search from "../../../components/search";

/**
 * searchViewState - Control search selection network components (viewName: The component needs to determine which entrance to enter,allBasicData: Network Data).
 * receiveCoins_ref - Used to search and modify parent component network information.
 * supportCurrency - Judge whether it can be received (by true: Not selectable,by flase).
 */
export default {
  name: "",
  components: { includedDetails, search },
  data(){
    return{
      routerParams: {},
      email: "",
      checkModel: [],
      //ach支持的币种可以选择
      supportCurrency: true,
      //select network
      networkList: [],
      networkDefault: false,
      addressDefault: false,
      buyParams: {
        cryptoCurrency: "",
        address: "",
        network: "",
        fiatCurrency: "",
        amount: 0,
        depositType: 1,
        payWayCode: '' //支付方式
      },
      networkRegular: '',
      walletAddress_state: false,
      searchViewState: false,
      viewName: '',
    }
  },
  computed: {
    disabled(){
      if(this.checkModel[0]==='ach'||(this.checkModel[0]==='address'&&this.buyParams.network!==''&&this.buyParams.address!=='')){
        return false
      }else{
        return true
      }
    }
  },
  beforeRouteEnter(to,from,next) {
    next(vm => {
      if (from.path === '/' && to.path === '/receivingMode') {
        vm.buyParams = {
          cryptoCurrency: "",
          address: "",
          network: "",
          fiatCurrency: "",
          amount: 0,
          depositType: 1,
          payWayCode: '' //支付方式
        };
        vm.checkModel = [];
        vm.networkRegular = '';
        vm.walletAddress_state = false;
      }
    })
  },
  activated() {
    this.routingInformation();
  },
  methods: {
    networkAddressBlur(){
      if(this.checkModel[0] === 'address' && !new RegExp(this.networkRegular).test(this.buyParams.address)){
        this.walletAddress_state = true;
      }else{
        this.walletAddress_state = false;
      }
    },
    //Get address bar information
    routingInformation(){
      localStorage.getItem("email") ? this.email = AES_Decrypt(localStorage.getItem("email")) : this.email = '';
      this.routerParams = JSON.parse(this.$route.query.routerParams);
      let query = JSON.parse(this.$route.query.routerParams);
      //essential information
      this.buyParams.fiatCurrency = query.payCommission.code;
      this.buyParams.cryptoCurrency = query.cryptoCurrency;
      this.buyParams.amount = query.amount;
      this.verifyMerchantInfo();
    },

    verifyMerchantInfo(){
      let merchantInfo = JSON.parse(sessionStorage.getItem("accessMerchantInfo"));
      //network
      if(merchantInfo !== "{}" && merchantInfo.networkDefault === true){
        this.networkDefault = false;
      }else if(merchantInfo !== "{}" && merchantInfo.networkDefault === false || merchantInfo.networkDefault === undefined){
        this.networkDefault = true;
      }

      //address
      if(merchantInfo !== "{}" && merchantInfo.addressDefault === false || merchantInfo.addressDefault === undefined){
        this.addressDefault = false;
      }else if(merchantInfo !== "{}" && merchantInfo.addressDefault === true){
        this.addressDefault = true;
        this.buyParams.address = merchantInfo.address;
      }

      this.queryNetwork();
      if(this.networkDefault === false || this.addressDefault === true){
        this.supportCurrency = false;
        this.supportCurrency === false ? this.checkModel[0] = 'address' : '';
      }else {
        this.supportCurrency = true;
        this.receivingMode();
      }
    },

    //Get network list
    queryNetwork(){
      let params = {
        coin: this.buyParams.cryptoCurrency
      }
      this.$axios.get(this.$api.get_network,params).then(res=>{
        if(res && res.returnCode === "0000") {
          this.networkList = res.data.networkList;
          let merchantInfo = JSON.parse(sessionStorage.getItem("accessMerchantInfo"));
          if(merchantInfo !== "{}" && (merchantInfo.networkDefault === true || merchantInfo.networkDefault === undefined)){
            this.buyParams.network = this.networkList.filter(item=>{return merchantInfo.network === item.network})[0].network;
            this.checkModel[0] = 'address';
          }
        }
      })
    },

    //Get the grounding method that can be used (request submit token)
    receivingMode(){
      let newParams = {
        "coin": this.buyParams.cryptoCurrency,
        "email": AES_Encrypt(localStorage.getItem("email"))
      }
      this.$axios.post(this.$api.post_coinSupportedWallet, newParams,'').then(res=> {
        if (res && res.returnCode === "0000") {
          // Support acceptance method
          this.supportCurrency = res.data.isSupportCoin === 1 ? true : false;
          this.supportCurrency === false ? this.checkModel[0] = 'address' : '';
        }
      })
    },

    //Select acceptance method
    checkMethods(value){
      if(value === 'ach'){
        this.buyParams.network = "";
      }
      if(this.checkModel.length === 0){
        this.checkModel.push(value);
        return;
      }
      if(value !== this.checkModel[0]){
        this.checkModel[0] = value;
        this.checkModel = [...new Set(this.checkModel)];
      }
    },

    //Displays the selected network view
    openSelect(){
      if(this.networkDefault === true){
        this.$parent.$refs.viewTab.tabState = false;
        this.searchViewState = true;
        this.viewName = 'network';
      }
    },

    //跳转选择支付方式页 整理下单接口和routerParams路由信息
    transaction(){
      let buyParams = JSON.parse(JSON.stringify(this.buyParams));
      //下单接口参数
      if(this.checkModel[0] === 'address' && (buyParams.address === '' || buyParams.network === '')){
        return;
      }
      if(this.checkModel[0] === 'address' && !new RegExp(this.networkRegular).test(buyParams.address)){
        this.walletAddress_state = true;
        return;
      }
      this.walletAddress_state = false;
      if(this.checkModel[0] === 'ach'){
        buyParams.depositType = 1;
        buyParams.address = AES_Decrypt(localStorage.getItem("email"));
        buyParams.network = "";
      }else{
        buyParams.depositType = 2;
      }

      //商户接入字段 下单接口参数
      let merchantInfo = JSON.parse(sessionStorage.getItem("accessMerchantInfo"));
      if(merchantInfo.merchantParam_state === true){
        buyParams.merchantParam = merchantInfo.merchantParam;
      }

      //跳转选择支付方式 支付方式页调取下单接口
      let ordParams = JSON.parse(this.$route.query.routerParams);
      let newParams = {
        depositType: buyParams.depositType,
        receiveMethods: this.checkModel[0],
        networkDefault: buyParams.network,
        addressDefault: buyParams.address
      }
      this.checkModel[0] === 'ach' ? (delete newParams.network,delete newParams.address) : '';
      Object.assign(newParams, ordParams);
      this.$router.push(`/paymentMethod?routerParams=${JSON.stringify(newParams)}&placeOrderQuery=${JSON.stringify(buyParams)}`);
    },
  }
}
</script>

<style lang="scss" scoped>
#receiveCoins{
  .receiveCoins-view{
    height: 100%;
    display: flex;
    flex-direction: column;
    .receiveCoins-content{
      flex: 1;
      overflow: auto;
    }
  }
  .promptInformation{
    font-size: 0.14rem;
    font-family: 'Jost', sans-serif;
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
        font-family: 'Jost', sans-serif;
        font-weight: 500;
        color: #232323;
      }
      .methods_check{
        display: flex;
        margin-left: auto;
        input{
          width: 0.13rem;
          height: 0.13rem;
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
          font-family: "Jost", sans-serif;
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
        font-family: "Jost", sans-serif;
        font-weight: 400;
        color: #FF0000;
        margin: 0.1rem 0 0 0.2rem;
      }
      .methods_title{
        font-size: 0.16rem;
        font-family: 'Jost', sans-serif;
        font-weight: 500;
        color: #232323;
        margin-top: 0.2rem;
      }
    }
    .methods_tips{
      font-size: 0.154rem;
      font-family: "Jost", sans-serif;
      font-weight: 400;
      color: #999999;
      line-height: 0.24rem;
      margin-top: 0.1rem;
    }
    .methods_account{
      font-size: 0.16rem;
      font-family: "Jost", sans-serif;
      font-weight: 400;
      color: #999999;
      line-height: 0.24rem;
      margin-top: 0.1rem;
      span{
        color: #4479D9;
      }
    }
  }

  .includedDetails_view{
    margin-bottom: 0.2rem;
  }

  .continueBox{
    width: 100%;
    background: white;
    border-radius: 25px;
    z-index: 2020;
    display: flex;
  }
  .continue{
    width: 100%;
    height: 0.6rem;
    margin-top: 0.1rem;
    border-radius: 4px;
    background: #4479D9;
    text-align: center;
    line-height: 0.6rem;
    font-size: 0.18rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #FAFAFA;
    cursor: pointer;
    border: none;
  }
  .continue:disabled{
    background: rgba(68, 121, 217, 0.5);
    cursor: no-drop;
  }
}
</style>
