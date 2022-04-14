<template>
  <div id="receiveCoins">
    <!-- select network -->
    <search v-if="searchViewState" :viewName="viewName" :allBasicData="networkList"/>
    <!-- Select acceptance method -->
    <div ref="receiveCoins_ref" v-show="!searchViewState">
      <div class="promptInformation">
        <span v-if="supportCurrency">You can receive to an address you own or deposit to Alchemy Pay Wallet.</span>
        <span v-else>You can receive to an address you own.</span>
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
          <div class="methods_name">Receive to an address you own</div>
          <div class="methods_check" v-if="supportCurrency"><input type="checkbox" v-model="checkModel" value="address"></div>
        </div>
        <div v-if="checkModel[0]==='address'">
          <div class="methods_myAddress">
            <div class="methods_input"><input type="text" v-model="buyParams.address" placeholder="Wallet Address…"></div>
            <div class="methods_errorText" v-if="walletAddress_state">Not a valid {{ buyParams.cryptoCurrency }} address.</div>
          </div>
          <div class="methods_myAddress">
            <div class="methods_title">Network</div>
            <div class="methods_input network_input" @click="openSelect">
              <input type="text" placeholder="Select Network" v-model="buyParams.network" disabled>
              <span class="rightIcon"><img src="../../assets/images/rightIcon.png"></span>
            </div>
          </div>
        </div>
      </div>
      <!-- Expense information -->
      <includedDetails :network="buyParams.network"/>
      <div class="continue" @click="transaction" :class="{'continue_state': checkModel[0]==='ach'||(checkModel[0]==='address'&&buyParams.network!==''&&buyParams.address!=='')}">Continue</div>
    </div>
  </div>
</template>

<script>
import includedDetails from "../../components/includedDetails";
import search from "../../components/search";

/**
 * searchViewState - Control search selection network components (viewName: The component needs to determine which entrance to enter,allBasicData: Network Data).
 * receiveCoins_ref - Used to search and modify parent component network information.
 * supportCurrency - Judge whether it can be received (by true: Not selectable,by flase).
 */
export default {
  name: "Receive coins",
  components: { includedDetails, search },
  data(){
    return{
      email: "",
      checkModel: [],
      //ach支持的币种可以选择
      supportCurrency: true,
      //select network
      networkList: [],
      buyParams: {
        cryptoCurrency: "",
        address: "",
        network: "",
        fiatCurrency: "",
        amount: 0,
        depositType: 1,
        payWayCode: 10001 //支付方式
      },
      networkRegular: '',
      walletAddress_state: false,
      searchViewState: false,
      viewName: '',
    }
  },
  mounted() {
    this.routingInformation();
    this.queryNetwork();
  },
  methods: {
    //Get address bar information
    routingInformation(){
      localStorage.getItem("email") ? this.email = localStorage.getItem("email") : this.email = '';
      let query = JSON.parse(this.$route.query.routerParams);
      //essential information
      this.buyParams.payWayCode = query.payWayCode;
      this.buyParams.fiatCurrency = query.payCommission.currency;
      this.buyParams.cryptoCurrency = query.cryptoCurrency;
      this.buyParams.amount = query.amount;
      this.receivingMode();
    },

    //Get network list
    queryNetwork(){
      let params = {
        coin: this.buyParams.cryptoCurrency
      }
      this.$axios.get(this.$api.get_network,params).then(res=>{
        if(res && res.returnCode === "0000"){
          this.networkList = res.data.networkList;
        }
      })
    },

    //Get the grounding method that can be used (request submit token)
    receivingMode(){
      let newParams = {
        "coin": this.buyParams.cryptoCurrency,
        "email": localStorage.getItem("email")
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
      this.$parent.$refs.viewTab.tabState = false;
      this.searchViewState = true;
      this.viewName = 'network';
    },

    //Confirm acceptance method
    transaction(){
      if(this.checkModel[0] === 'address' && (this.buyParams.address === '' || this.buyParams.network === '')){
        return;
      }
      if(this.checkModel[0] === 'address' && !new RegExp(this.networkRegular).test(this.buyParams.address)){
        this.walletAddress_state = true;
        return;
      }
      this.walletAddress_state = false;
      if(this.checkModel[0] === 'ach'){
        this.buyParams.depositType = 1;
        this.buyParams.address = localStorage.getItem("email");
        this.buyParams.network = "";
      }else{
        this.buyParams.depositType = 2;
      }
      this.$axios.post(this.$api.post_buy,this.buyParams,'submitToken').then(res=>{
        if(res && res.returnMsg === 'SUCCESS'){
          this.generateRouterQuery(res);
        }
      })
    },

    //Determine the route to jump to the next page
    generateRouterQuery(res){
      /**
       * payMethod !== '10001'(International card) All belong to Indonesian payment,No authentication required
       */
      let ordParams = JSON.parse(this.$route.query.routerParams);
      let newParams = {
        depositType: this.buyParams.depositType,
        orderNo: res.data.orderNo,
      }
      Object.assign(newParams, ordParams);
      if(newParams.payWayCode === '10001'){
        this.$axios.post(this.$api.post_getCardInfo,'','').then(value=>{
          if (value && value.returnCode === "0000") {
            if (value.data != null) {
              //Judge whether the user has filled in the information - 10 is Filled in
              this.$axios.get(this.$api.get_isbasisIdAuth,"").then(result=> {
                if (result && result.returnCode === '0000') {
                  if (result.data.status === 10){
                    this.$router.push(`/internationalCardConfigPag?routerParams=${JSON.stringify(newParams)}&submitForm=${JSON.stringify(value.data)}`);
                  }else{
                    this.$router.push(`/basisIdAuth?routerParams=${JSON.stringify(newParams)}&submitForm=${JSON.stringify(value.data)}`);
                  }
                }
              })
            }else{
              this.$router.push(`/internationalCardPay?routerParams=${JSON.stringify(newParams)}`);
            }
          }
        })
        return;
      }
      //go to Indonesian payment
      if(newParams.payWayCode === '10003'){
        this.$router.push(`/indonesianPayment?routerParams=${JSON.stringify(newParams)}`);
        return;
      }
      if(newParams.payWayCode === '10004' || newParams.payWayCode === '10005' || newParams.payWayCode === '10006'){ //QRIS DANA OVO
        this.$router.push(`/indonesianConfirm?routerParams=${JSON.stringify(newParams)}`);
        return;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#receiveCoins{
  margin-bottom: 0.95rem;
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

  .continue{
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 0 0 0.2rem 0;
    width: 100%;
    height: 0.6rem;
    background: rgba(68, 121, 217, 0.5);
    border-radius: 4px;
    text-align: center;
    line-height: 0.6rem;
    font-size: 0.18rem;
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #FAFAFA;
    cursor: no-drop;
  }
  .continue_state{
    background: #4479D9;
    cursor: pointer;
  }
}
</style>
