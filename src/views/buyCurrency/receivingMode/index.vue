<template>
  <div id="receiveCoins">
    <!-- select network -->
    <search v-if="searchViewState" :viewName="viewName" :allBasicData="networkList"/>
    <!-- Select acceptance method -->
    <div class="receiveCoins-view" v-show="!searchViewState">
      <div class="receiveCoins-content">
        <div class="promptInformation">
          <span v-if="supportCurrency">Please provide cryptocurrency address to receive your order</span>
          <span v-else>{{ $t('nav.buy_receivingMode_tips') }}</span>
        </div>
        <div class="collectionMethod" @click="checkMethods('address')">
          <div class="methods">
            <div class="methods_name">{{ $t('nav.buy_receivingMode_addressTitle') }} {{ routerParams.cryptoCurrency }} {{ $t('nav.buy_receivingMode_addressTips2') }}</div>
          </div>
          <div v-if="checkModel[0]==='address'">
            <div class="methods_myAddress">
              <div class="methods_input"><input type="text" v-model="buyParams.address" :placeholder="this.$t('nav.buy_receivingMode_addressPlaceholder')" @input="networkAddressChange" :disabled="addressDefault"></div>
              <div class="methods_errorText" v-if="walletAddress_state">{{ $t('nav.buy_receivingMode_addressTips1') }} {{ buyParams.cryptoCurrency }} {{ $t('nav.buy_receivingMode_addressTips2') }}</div>
            </div>
            <div class="methods_myAddress">
              <div class="methods_title">{{ $t('nav.Sellorder_Network') }}</div>
              <div class="methods_input network_input" @click="openSelect">
                <div class="selectNetwork">
                  <span v-if="buyParams.network!==''">{{ buyParams.network }}</span>
                  <span class="networkPlaceholder" v-else>{{ $t('nav.search_components_networkTitle') }}</span>
                </div>
                <span class="rightIcon"><img src="../../../assets/images/rightBlackIcon.png"></span>
              </div>
            </div>
          </div>
        </div>
        <!-- Expense information -->
        <includedDetails class="includedDetails_view" ref="includedDetails_ref" :network="buyParams.network"/>
      </div>
      <div class="continueBox" v-show="!searchViewState">
        <button class="continue" @click="transaction" :disabled="disabled" >
          {{ $t('nav.Continue') }}
          <img class="rightIcon" src="../../../assets/images/button-right-icon.png" alt="">
        </button>
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
      checkModel: ['address'],
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
      // if(this.checkModel[0]==='ach'||(this.checkModel[0]==='address'&&this.buyParams.network!==''&&this.buyParams.address!=='')){
      // console.log(this.checkModel,this.buyParams.network,this.buyParams.address)
      if(this.buyParams.network!=='' && this.buyParams.address!==''){ //this.checkModel[0]==='address' &&
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
    networkAddressChange(){
      if(this.checkModel[0] === 'address' && !new RegExp(this.networkRegular).test(this.buyParams.address)){
        this.walletAddress_state = true;
      }else{
        this.walletAddress_state = false;
      }
    },
    //Get address bar information
    routingInformation(){
      localStorage.getItem("email") ? this.email = AES_Decrypt(localStorage.getItem("email")) : this.email = '';
      this.routerParams = this.$store.state.buyRouterParams;
      //essential information
      this.buyParams.fiatCurrency = this.$store.state.buyRouterParams.payCommission.code;
      this.buyParams.cryptoCurrency = this.$store.state.buyRouterParams.cryptoCurrency;
      this.buyParams.amount = this.$store.state.buyRouterParams.amount;
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
        this.supportCurrency = false;
        // this.receivingMode();
        this.checkModel[0] = 'address'
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
      this.$store.state.placeOrderQuery = {};
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
      this.$store.state.buyRouterParams.depositType = buyParams.depositType;
      this.$store.state.buyRouterParams.receiveMethods = this.checkModel[0];
      this.$store.state.buyRouterParams.networkDefault = buyParams.network;
      this.$store.state.buyRouterParams.addressDefault = buyParams.address;
      this.$store.state.placeOrderQuery = buyParams;
      this.$router.push('/paymentMethod');
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
    font-size: 0.13rem;
    font-family: "GeoLight", GeoLight;
    font-weight: normal;
    color: #232323;
  }
  .collectionMethod:nth-of-type(1){
    margin-top: 0.1rem;
  }
  .collectionMethod{
    margin-top: 0.32rem;
    .methods{
      display: flex;
      align-items: center;
      .methods_name{
        font-size: 0.13rem;
        font-family: "GeoRegular", GeoRegular;
        font-weight: normal;
        color: #707070;
      }
    }
    .methods_myAddress{
      position: relative;
      div{
        display: flex;
        align-items: center;
      }
      .methods_input{
        height: 0.56rem;
        background: #FFFFFF;
        border-radius: 0.12rem;
        margin-top: 0.08rem;
        position: relative;
        input{
          width: 100%;
          height: 100%;
          border-radius: 0.12rem;
          font-size: 0.16rem;
          font-family: "GeoRegular", GeoRegular;
          background: #F3F4F5;
          border: none;
          outline: none;
          padding: 0 0.16rem;
          &::placeholder{
            color: #999999;
          }
        }
        .rightIcon{
          position: absolute;
          right: 0.21rem;
          display: flex;
          img{
            width: 0.24rem;
          }
        }
      }
      .selectNetwork{
        width: 100%;
        height: 0.56rem;
        border-radius: 0.12rem;
        font-size: 0.16rem;
        font-family: "GeoRegular", GeoRegular;
        background: #F3F4F5;
        padding: 0 0.16rem;
        .networkPlaceholder{
          color: #999999;
        }
      }
      .network_input{
        cursor: pointer;
        input{
          padding: 0 0.5rem 0 0.21rem;
        }
      }
      .methods_errorText{
        position: absolute;
        font-size: 0.13rem;
        font-family: "GeoLight", GeoLight;
        font-weight: 400;
        color: #E55643;
        margin: 0.08rem 0.2rem 0 0.16rem;
      }
      .methods_title{
        font-size: 0.13rem;
        font-family: "GeoRegular", GeoRegular;
        font-weight: normal;
        color: #707070;
        margin-top: 0.32rem;
      }
    }
  }

  .includedDetails_view{
    margin-top: 0.36rem;
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
    height: 0.58rem;
    background: #0059DA;
    border-radius: 0.29rem;
    font-size: 0.17rem;
    font-family: "GeoRegular", GeoRegular;
    font-weight: normal;
    color: #FFFFFF;
    margin-top: 0.16rem;
    cursor: pointer;
    border: none;
    position: relative;
    .rightIcon{
      width: 0.24rem;
      position: absolute;
      top: 0.17rem;
      right: 0.32rem;
    }
  }
  .continue:disabled{
    background: rgba(0, 89, 218, 0.5);
    cursor: no-drop;
  }
}
</style>
