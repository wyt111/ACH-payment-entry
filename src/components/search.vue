<!-- search Public organization -->
<template>
  <div id="search">
    <div class="searchHeader">
      <div class="searchHeader_view1">
        <div class="text">{{ viewTitle }}</div>
        <div class="icon"><img src="../assets/images/closeIcon.png" @click="closeView"></div>
      </div>
      <div class="searchHeader_view2" v-if="viewName !== 'network'"> <!--  && viewName !== 'payCurrency' -->
        <input type="text" placeholder="Search here…" v-model="searchText" @input="searchBankData">
        <div class="searchIcon"><img src="../assets/images/searchIcon.svg"></div>
      </div>
    </div>
    <div class="search_core">
      <!-- country content -->
      <ul v-if="viewName === 'country' || viewName === 'country-sellForm'">
        <li v-for="(item,index) in searchText==='' ? countryList : searchData" :key="index" @click="choiseItem('country',item)">
          <p class="seach_li_img"><img :src="item.flag"></p>
          <p class="seach_li_text">{{ item.enCommonName }}</p>
          <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
        </li>
      </ul>

      <!-- currency content -->
      <ul v-else-if="viewName === 'currency'">
        <div v-if="searchText===''">
          <div class="screen_title">Popular</div>
          <li v-for="(item,index) in popularList" :key="index" @click="choiseItem('currency',item)">
            <p class="seach_li_img"><img :src="item.logoUrl"></p>
            <p class="seach_li_text currencyCopywriting">{{ item.name }} <span class="seach_li_allText"> - {{ item.fullName }}</span></p>
            <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
          </li>
          <div class="screen_title">All</div>
          <li :class="{'allCurrencyLi': index===0}" v-for="(item,index) in cryptoCurrencyVOList" :key="'all_'+index" @click="choiseItem('currency',item)">
            <p class="seach_li_img"><img :src="item.logoUrl"></p>
            <p class="seach_li_text currencyCopywriting">{{ item.name }} <span class="seach_li_allText"> - {{ item.fullName }}</span></p>
            <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
          </li>
        </div>
        <div v-else>
          <li v-for="(item,index) in searchData" :key="'search_'+index" @click="choiseItem('currency',item)">
            <p class="seach_li_img"><img :src="item.logoUrl"></p>
            <p class="seach_li_text currencyCopywriting">{{ item.name }} <span class="seach_li_allText"> - {{ item.fullName }}</span></p>
            <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
          </li>
        </div>
      </ul>

      <!-- network content -->
      <ul v-else-if="viewName === 'network'">
        <li v-for="(item,index) in basicData" :key="index" @click="choiseItem('network',item)">
          <p class="seach_li_text currencyCopywriting">{{ item.network }} - <span class="seach_li_allText">{{ item.networkName }}</span></p>
          <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
        </li>
      </ul>

      <!-- country payCurrency -->
      <ul v-else-if="viewName === 'payCurrency' || viewName === 'payCurrency-sell'">
        <li class="payCurrencyLi" v-for="(item,index) in searchText==='' ? basicData : searchData" :key="index" @click="choiseItem('payCurrency',item)">
          <p class="seach_li_text currencyCopywriting">
            <img :src="item.flag">
            <span class="allName">{{ item.enCommonName }} -</span>
            <span class="abbreviationName" v-if="viewName === 'payCurrency'"> {{ item.code }}</span>
            <span class="abbreviationName" v-if="viewName === 'payCurrency-sell'">{{ item.fiatCode }}</span>
          </p>
          <p class="seach_li_rightIcon">
            <img src="../assets/images/rightIcon.png">
          </p>
        </li>
      </ul>

      <!-- 买币 currency -->
      <ul v-else-if="viewName === 'currency-sell'">
        <div v-if="searchText===''">
          <!-- <div class="screen_title">Popular</div>
          <li v-for="(item,index) in popularList" :key="index" @click="choiseItem('currency-sell',item)">
            <p class="seach_li_img"><img :src="item.logoUrl"></p>
            <p class="seach_li_text currencyCopywriting">{{ item.name }} <span class="seach_li_allText"> - {{ item.fullName }}</span></p>
            <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
          </li> -->
          <div class="screen_title">All</div>
          <li :class="{'allCurrencyLi': index===0}" v-for="(item,index) in cryptoCurrencyVOList" :key="'all_'+index" @click="choiseItem('currency-sell',item)">
            <p class="seach_li_img"><img :src="item.logoUrl"></p>
            <p class="seach_li_text currencyCopywriting">{{ item.name }} <span class="seach_li_allText"> - {{ item.fullName }}</span></p>
            <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
          </li>
        </div>
        <div v-else>
          <li v-for="(item,index) in searchData" :key="'search_'+index" @click="choiseItem('currency-sell',item)">
            <p class="seach_li_img"><img :src="item.logoUrl"></p>
            <p class="seach_li_text currencyCopywriting">{{ item.name }} <span class="seach_li_allText"> - {{ item.fullName }}</span></p>
            <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
          </li>
        </div>
      </ul>

      <!-- bank -->
<!--      <ul v-else-if="viewName === 'bank'">-->
<!--        <li v-for="(item,index) in searchText==='' ? basicData : searchData" :key="index" @click="choiseItem('bank',item)">-->
<!--          <p class="seach_li_text currencyCopywriting">{{ item.bank }}</p>-->
<!--          <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>-->
<!--        </li>-->
<!--      </ul>-->

      <ul class="infinite-list" v-infinite-scroll="bankListload" infinite-scroll-delay="300" :infinite-scroll-distance="300" style="overflow:auto" v-else-if="viewName === 'bank'">
        <li v-for="(item,index) in basicData" :key="index" class="infinite-list-item" @click="choiseItem('bank',item)">
          <p class="seach_li_text currencyCopywriting">{{ item.bank }}</p>
          <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>

export default {
  name: "search",
  props: ['viewName','allBasicData','choiseItemData','routerFrom'],
  data(){
    return{
      viewTitle: "",

      //Search for data
      searchText: "",

      //all data(all / network)
      basicData: {},

      //all country data
      countryList: [],

      //Recommended digital currency list
      popularList: [],
      //Support digital currency list
      cryptoCurrencyVOList: [],

      //银行列表请求参数
      bankListloadState: true,
      bankQuery: {
        bank: "",
        pageIndex: 1,
        pageSize: 20,
      },
    }
  },
  computed: {
    //Fuzzy search
    searchData(){
      //country - card form
      if(this.searchText && (this.viewName === 'country' || this.viewName === 'country-sellForm')) {
        let resultArray_country1 = [],resultArray_country2 = [],resultArray_country3 = [],resultArray_country4 = [],all_resultArray_country = [];
        resultArray_country1 = this.countryList.filter((value) => {
          return value.enCommonName.includes(this.searchText)
        })
        resultArray_country2 = this.countryList.filter((value) => {
          return value.enCommonName.includes(this.searchText.charAt(0).toUpperCase() + this.searchText.slice(1))
        })
        resultArray_country3 = this.countryList.filter((value) => {
          return value.alpha2.includes(this.searchText)
        })
        resultArray_country4 = this.countryList.filter((value) => {
          return value.alpha2.includes(this.searchText.toUpperCase())
        })
        all_resultArray_country = all_resultArray_country.concat(resultArray_country1).concat(resultArray_country2).concat(resultArray_country3).concat(resultArray_country4);
        all_resultArray_country = [...new Set(all_resultArray_country)];
        return all_resultArray_country;
      }
      if(this.searchText && (this.viewName === 'payCurrency' || this.viewName === 'payCurrency-sell')) { //country
        let resultArray_country1 = [],resultArray_country2 = [],resultArray_country3 = [],resultArray_country4 = [],all_resultArray_country = [];
        resultArray_country1 = this.basicData.filter((value) => {
          return value.enCommonName.includes(this.searchText)
        })
        resultArray_country2 = this.basicData.filter((value) => {
          return value.enCommonName.includes(this.searchText.charAt(0).toUpperCase() + this.searchText.slice(1))
        })
        resultArray_country3 = this.basicData.filter((value) => {
          return value.alpha2.includes(this.searchText)
        })
        resultArray_country4 = this.basicData.filter((value) => {
          return value.alpha2.includes(this.searchText.toUpperCase())
        })
        all_resultArray_country = all_resultArray_country.concat(resultArray_country1).concat(resultArray_country2).concat(resultArray_country3).concat(resultArray_country4);
        all_resultArray_country = [...new Set(all_resultArray_country)];
        return all_resultArray_country;
      }
      if(this.searchText && this.viewName === 'currency'){
        let resultArray1 = [],resultArray2 = [],resultArray3 = [],resultArray4 = [],all_resultArray = [];
        //Match full name
        resultArray1 = this.cryptoCurrencyVOList.filter((value) => {
          return value.fullName.includes(this.searchText)
        })
        //Match full name - Initial to capital
        resultArray2 = this.cryptoCurrencyVOList.filter((value) => {
          // let text =
          return value.fullName.includes(this.searchText.replace(/^\S/, s => s['toUpperCase']()))
        })
        //Matching abbreviations - Capitalize
        resultArray3 = this.cryptoCurrencyVOList.filter((value) => {
          return value.name.includes(this.searchText.toUpperCase())
        })
        //Matching abbreviations
        resultArray4 = this.cryptoCurrencyVOList.filter((value) => {
          return value.name.includes(this.searchText)
        })
        all_resultArray = all_resultArray.concat(resultArray1).concat(resultArray2).concat(resultArray3).concat(resultArray4);
        all_resultArray = [...new Set(all_resultArray)];
        return all_resultArray;
      }
      //所有支持卖的币
      if(this.searchText && this.viewName === 'currency-sell'){
        let resultArray1 = [],resultArray2 = [],resultArray3 = [],resultArray4 = [],all_resultArray = [];
        //Match full name
        resultArray1 = this.cryptoCurrencyVOList.filter((value) => {
          return value.fullName.includes(this.searchText)
        })
        //Match full name - Initial to capital
        resultArray2 = this.cryptoCurrencyVOList.filter((value) => {
          // let text =
          return value.fullName.includes(this.searchText.replace(/^\S/, s => s['toUpperCase']()))
        })
        //Matching abbreviations - Capitalize
        resultArray3 = this.cryptoCurrencyVOList.filter((value) => {
          return value.name.includes(this.searchText.toUpperCase())
        })
        //Matching abbreviations
        resultArray4 = this.cryptoCurrencyVOList.filter((value) => {
          return value.name.includes(this.searchText)
        })
        all_resultArray = all_resultArray.concat(resultArray1).concat(resultArray2).concat(resultArray3).concat(resultArray4);
        all_resultArray = [...new Set(all_resultArray)];
        return all_resultArray;
      }
      //搜索银行
      // if(this.searchText && this.viewName === 'bank'){
      //   let resultArray1 = [],resultArray2 = [],resultArray3 = [],resultArray4 = [],all_resultArray = [];
      //   //Match full name
      //   resultArray1 = this.basicData.filter((value) => {
      //     return value.bank.includes(this.searchText)
      //   })
      //   //Match full name - Initial to capital
      //   resultArray2 = this.basicData.filter((value) => {
      //     // let text =
      //     return value.bank.includes(this.searchText.replace(/^\S/, s => s['toUpperCase']()))
      //   })
      //   //Matching abbreviations - Capitalize
      //   resultArray3 = this.basicData.filter((value) => {
      //     return value.bank.includes(this.searchText.toUpperCase())
      //   })
      //   resultArray4 = this.basicData.filter((value) => {
      //     return value.bank.includes(this.searchText.toLowerCase())
      //   })
      //   all_resultArray = all_resultArray.concat(resultArray1).concat(resultArray2).concat(resultArray3).concat(resultArray4);
      //   all_resultArray = [...new Set(all_resultArray)];
      //   return all_resultArray;
      // }
    }
  },
  watch: {
    allBasicData: {
      immediate: true,
      deep: true,
      handler() {
        this.initializationData();
      },
    }
  },
  mounted(){
    this.customComponentTitle();
  },
  methods: {
    //Judge title name
    customComponentTitle(){
      if(this.viewName === 'country' || this.viewName === 'country-sellForm' || this.viewName === 'payCurrency' || this.viewName === 'payCurrency-sell'){
        this.viewTitle = 'Select Country';
        return;
      }
      if(this.viewName === 'currency' || this.viewName === 'currency-sell'){
        this.viewTitle = 'Select Crypto';
        return;
      }
      if(this.viewName === 'network'){
        this.viewTitle = 'Select Network';
        return;
      }
      if(this.viewName === 'bank'){
        this.viewTitle = 'Select Bank';
        return;
      }
    },

    //Get and call component path, processing data
    initializationData(){
      if(this.viewName === 'country' || this.viewName === 'country-sellForm') {
        this.basicData = this.allBasicData;
        this.$nextTick(()=>{
          this.countryList = this.basicData.worldList;
        })
        return;
      }
      if(this.viewName === 'currency'){
        this.basicData = this.allBasicData;
        this.$nextTick(()=>{
          this.popularList = this.basicData.cryptoCurrencyResponse.popularList.filter(item=>{return item.purchaseSupported === 1});
          this.cryptoCurrencyVOList = this.basicData.cryptoCurrencyResponse.cryptoCurrencyList.filter(item=>{return item.purchaseSupported === 1});
        })
        return;
      }
      if(this.viewName === 'network'){
        this.basicData = [];
        this.basicData = this.allBasicData;
        return;
      }
      if(this.viewName === 'payCurrency'){
        this.basicData = [];
        let newWorldList = [];
        this.allBasicData.worldList.forEach(item=>{
          if(item.fiatList){
            item.fiatList.forEach(item2=>{
              let fiat = {
                code: item2.code,
              }
              fiat = {...fiat,...item};
              newWorldList.push(fiat);
            })
          }
        });
        this.basicData = newWorldList;
        return;
      }
      if(this.viewName === 'payCurrency-sell'){
        this.basicData = [];
        this.basicData = this.allBasicData.worldList.filter(item=>{return item.sellEnable === 1});
        return;
      }
      if(this.viewName === 'currency-sell'){
        this.basicData = this.allBasicData;
        this.$nextTick(()=>{
          this.popularList = this.basicData.cryptoCurrencyResponse.popularList.filter(item=>{ return item.isSell === 1 });
          this.cryptoCurrencyVOList = this.basicData.cryptoCurrencyResponse.cryptoCurrencyList.filter(item=>{ return item.isSell === 1 });
        })
        return;
      }
      if(this.viewName === 'bank'){
        this.basicData = this.allBasicData.result;
      }
    },

    //close component
    closeView(){
      if(( this.viewName === 'country' || this.viewName === 'bank' || this.viewName === 'country-sellForm')&& this.routerFrom !== 'home'){
        this.$parent.$parent.$refs.viewTab.tabState = true;
        this.$parent.searchViewState = false;
        return;
      }
      if(this.viewName === 'country' || this.viewName === 'currency' || this.viewName === 'currency-sell' || this.viewName === 'payCurrency-sell' || this.viewName === 'payCurrency') {
        this.$parent.searchState = true;
        return;
      }
      if(this.viewName === 'network'){
        this.$parent.$parent.$refs.viewTab.tabState = true;
        this.$parent.searchViewState = false;
        return;
      }
    },

    //银行列表、搜索
    searchBankData(){
      if(this.viewName === "bank"){
        this.bankQuery.bank = this.searchText;
        this.bankQuery.pageIndex = 1;
        this.basicData = [];
        this.requestBank();
      }
    },
    bankListload(){
      if(this.bankListloadState === true && this.bankQuery.bank === ''){
        this.bankQuery.pageIndex += 1;
        this.requestBank();
      }
    },
    requestBank(){
      this.$axios.get(this.$api.get_bank,this.bankQuery).then(res=> {
        if (res && res.returnCode === "0000") {
          if(this.bankQuery.pageIndex * this.bankQuery.pageSize > res.total){
            this.bankListloadState = false;
          }else{
            this.bankListloadState = true;
            this.basicData = this.basicData.concat(res.data.result);
          }
        }
      })
    },

    //Select data
    choiseItem(type,item){
      setTimeout(()=>{
        if(type === 'country' && this.routerFrom === 'home'){
          this.$parent.$refs.buyCrypto_ref.positionData.positionImg = item.flag;
          this.$parent.$refs.buyCrypto_ref.positionData.positionValue = item.enCommonName;
          //pay methods
          this.$parent.$refs.buyCrypto_ref.handlePayWayList(item);
          this.$parent.searchState = true;
          return;
        }
        if(type === 'country' && this.routerFrom !== 'home'){
          if(this.viewName === 'country-sellForm'){ //卖币表单选择国家
            this.$parent.sellForm.country = item.alpha2;
            this.$parent.countryName = item.enCommonName;
          }else { //买币表单选择国家
            this.$parent.params.country = item.alpha2;
            this.$parent.countryAbbreviation = item.enCommonName;
          }
          this.$parent.$parent.$refs.viewTab.tabState = true;
          this.$parent.searchViewState = false;
          return;
        }
        if(type === 'currency'){
          this.$parent.$refs.buyCrypto_ref.currencyData.icon = item.logoUrl;
          this.$parent.$refs.buyCrypto_ref.currencyData.name = item.name;
          this.$parent.$refs.buyCrypto_ref.currencyData.networkFee = item.networkFee;
          this.$parent.$refs.buyCrypto_ref.currencyData.price = item.price;
          this.$parent.$refs.buyCrypto_ref.currencyData.serviceFee = item.serviceFee;
          this.$store.state.buyRouterParams.cryptoCurrency = item.name;
          this.$parent.$refs.buyCrypto_ref.payinfo();
          this.$parent.searchState = true;
          return;
        }
        if(type === 'network'){
          this.$parent.buyParams.network = item.network;
          this.$parent.networkRegular = item.addressRegex;
          this.$parent.$parent.$refs.viewTab.tabState = true;
          this.$parent.searchViewState = false;
          if(!new RegExp(this.$parent.networkRegular).test(this.$parent.buyParams.address)){
            this.$parent.walletAddress_state = true;
          }else{
            this.$parent.walletAddress_state = false;
          }
          return;
        }
        if(this.viewName === 'currency-sell'){ //卖币
          this.$parent.$refs.sellCrypto_ref.currencyData.icon = item.logoUrl;
          this.$parent.$refs.sellCrypto_ref.currencyData.name = item.name;
          this.$parent.$refs.sellCrypto_ref.currencyData.maxSell = item.maxSell;
          this.$parent.$refs.sellCrypto_ref.currencyData.minSell = item.minSell;
          this.$parent.$refs.sellCrypto_ref.currencyData.cryptoCurrencyNetworkId = item.cryptoCurrencyNetworkId;
          this.$parent.$refs.sellCrypto_ref.currencyData.symbol = item.symbol;
          this.$store.state.feeParams.symbol = item.name;
          this.$parent.$refs.sellCrypto_ref.amountControl();
          this.$parent.searchState = true;
          return;
        }
        //country payCurrency
        if(type === 'payCurrency'){
          if(this.viewName === 'payCurrency'){ //买币
            this.$parent.$refs.buyCrypto_ref.handlePayWayList(item,2);
            // this.$parent.$refs.buyCrypto_ref.amountControl();
          }else if(this.viewName === 'payCurrency-sell'){ //卖币
            this.$parent.$refs.sellCrypto_ref.handlePayWayList(item,2);
            this.$parent.$refs.sellCrypto_ref.amountControl();
          }
          this.$parent.searchState = true;
          return;
        }
        if(type === 'bank'){
          this.$parent.sellForm.bank = item.bank;
          // this.$parent.sellForm.swiftCode = item.swiftCode;
          this.$parent.sellForm.worldBankId = item.id;
          this.$parent.$parent.$refs.viewTab.tabState = true;
          this.$parent.searchViewState = false;
          return;
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
#search{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .search_core{
    flex: 1;
    overflow: auto;
    .screen_title{
      font-size: 0.14rem;
      font-family: "GeoDemibold", GeoDemibold;
      color: #232323;
      margin-top: 0.24rem;
      &:first-child{
        margin-top: 0;
      }
    }
    .allCurrencyLi{
      margin-top: 0.16rem !important;
    }
    ul{
      height: 100%;
      .payCurrencyLi:first-child{
        margin-top: 0;
      }
      li{
        display: flex;
        align-items: center;
        margin-top: 0.24rem;
        cursor: pointer;
        .seach_li_img{
          display: flex;
          img{
            width: 0.36rem;
            border-radius: 50%;
            background: #E0E0E0;
          }
        }
        .seach_li_text{
          font-size: 0.16rem;
          font-family: "GeoDemibold", GeoDemibold;
          font-weight: 400;
          color: #232323;
          display: flex;
          align-items: center;
          .seach_li_allText{
            font-family: "GeoLight",GeoLight;
            margin-left: 0.04rem;
          }
          .allName{
            font-size: 0.16rem;
            font-family: "GeoDemibold", GeoDemibold;
            font-weight: normal;
            color: #232323;
          }
          .abbreviationName{
            font-family: "GeoLight",GeoLight;
            margin-left: 0.03rem;
          }
          img{
            width: 0.36rem;
            height: 0.36rem;
            border-radius: 50%;
            margin-right: 0.08rem;
            background: #E0E0E0;
          }
        }
        .currencyCopywriting{
          margin-left: 0.05rem;
        }
        .seach_li_rightIcon{
          display: flex;
          align-items: center;
          margin-left: auto;
          font-size: 0.16rem;
          font-weight: 400;
          color: #232323;
          img{
            height: 0.22rem;
            margin-left: 0.21rem;
          }
        }
      }
      li:nth-of-type(1){
        margin-top: 0.16rem;
      }
    }
  }
}
.searchHeader{
  padding-bottom: 0.24rem;
  .searchHeader_view1{
    font-size: 0.21rem;
    font-family: "GeoDemibold", GeoDemibold;
    color: #232323;
    display: flex;
    align-items: center;
    .icon{
      display: flex;
      margin-left: auto;
      cursor: pointer;
      img{
        width: 0.24rem;
      }
    }
  }
  .searchHeader_view2{
    width: 100%;
    height: 0.6rem;
    background: #F3F4F5;
    border-radius: 10px;
    border: 1px solid #4479D9;
    display: flex;
    margin-top: 0.16rem;
    position: relative;
    input{
      width: 100%;
      height: 100%;
      font-size: 0.16rem;
      font-family: "GeoRegular", GeoRegular;
      font-weight: normal;
      padding: 0 0.47rem;
      background: #F3F4F5;
      border-radius: 10px;
      outline: none;
      border: none;
    }
    .searchIcon{
      display: flex;
      position: absolute;
      left: 0.2rem;
      top: 0.21rem;
      img{
        width: 0.16rem;
      }
    }
  }
}
</style>
