<!-- search Public organization -->
<template>
  <div id="search">
    <div class="searchHeader">
      <div class="searchHeader_view1">
        <div class="text">{{ viewTitle }}</div>
        <div class="icon"><img src="../assets/images/closeIcon.png" @click="closeView"></div>
      </div>
      <div class="searchHeader_view2" v-if="viewName !== 'network'">
        <input type="text" :placeholder="$t('nav.search_components_placeHolder')" v-model="searchText">
        <div class="searchIcon"><img src="https://alchemywalletdownload.oss-cn-hongkong.aliyuncs.com/alchemypay/crypto-images/searchIcon.svg"></div>
      </div>
    </div>
    <div class="search_core">
      <!-- 选择国家和法币  -->
      <ul v-if="viewName === 'payCurrency' || viewName === 'payCurrency-sell'">
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

      <!-- 买币选择加密货币 -->
      <ul v-if="viewName === 'currency'">
        <div v-if="searchText===''">
          <div class="screen_title" v-if="popularList.length > 0">{{ $t('nav.search_components_Popular') }}</div>
          <li v-for="(item,index) in popularList" :key="index" @click="choiseItem('currency',item)">
            <p class="seach_li_img"><img :src="item.logoUrl"></p>
            <p class="seach_li_text currencyCopywriting">{{ item.name }} <span class="seach_li_allText"> - {{ item.fullName }}</span></p>
            <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
          </li>
          <div class="screen_title">{{ $t('nav.search_components_All') }}</div>
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

      <!-- 选择网络 -->
      <ul v-else-if="viewName === 'network'">
        <li v-for="(item,index) in basicData" :key="index" @click="choiseItem('network',item)">
          <p class="seach_li_text currencyCopywriting">{{ item.network }} - <span class="seach_li_allText">{{ item.networkName }}</span></p>
          <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
        </li>
      </ul>

      <!-- 卖币选择加密货币 -->
      <ul v-else-if="viewName === 'currency-sell'">
        <div v-if="searchText===''">
          <!-- <div class="screen_title">Popular</div>
          <li v-for="(item,index) in popularList" :key="index" @click="choiseItem('currency-sell',item)">
            <p class="seach_li_img"><img :src="item.logoUrl"></p>
            <p class="seach_li_text currencyCopywriting">{{ item.name }} <span class="seach_li_allText"> - {{ item.fullName }}</span></p>
            <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
          </li> -->
          <div class="screen_title">{{ $t('nav.search_components_All') }}</div>
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
    </div>
  </div>
</template>

<script>
/**
 * 搜索、选择列表组件
 */

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

      //Recommended digital currency list
      popularList: [],
      //Support digital currency list
      cryptoCurrencyVOList: [],

      //国家法币
      countryLegalCurrency: [],
      queryCountryListQuery: {
        pageIndex: 1,
        pageSize: 10,
        state: 1,
        enCommonName: "",
      }
    }
  },
  computed: {
    //Fuzzy search
    searchData(){
      //选择国家和法币
      if(this.searchText && (this.viewName === 'payCurrency' || this.viewName === 'payCurrency-sell')) { //country
        let resultArray_country1 = [],resultArray_country2 = [],resultArray_country3 = [],resultArray_country4 = [],all_resultArray_country = [];
        //根据国家名称筛选
        resultArray_country1 = this.basicData.filter((value,index) => {
          if(value.enCommonName.includes(this.searchText)){
            this.basicData[index].indexOfNum = value.enCommonName.indexOf(this.searchText);
            return value;
          }
        })
        resultArray_country2 = this.basicData.filter((value,index) => {
          if(value.enCommonName.includes(this.searchText.charAt(0).toUpperCase() + this.searchText.slice(1))){
            this.basicData[index].indexOfNum = value.enCommonName.indexOf(this.searchText.charAt(0).toUpperCase() + this.searchText.slice(1));
            return value;
          }
        })
        //根据国家简称筛选
        resultArray_country3 = this.basicData.filter((value,index) => {
          if(value.alpha2.includes(this.searchText)){
            this.basicData[index].indexOfNum = value.alpha2.indexOf(this.searchText);
            return value;
          }
        })
        resultArray_country4 = this.basicData.filter((value,index) => {
          if(value.alpha2.includes(this.searchText.toUpperCase())){
            this.basicData[index].indexOfNum = value.alpha2.indexOf(this.searchText.toUpperCase());
            return value;
          }
        })
        all_resultArray_country = all_resultArray_country.concat(resultArray_country4).concat(resultArray_country3).concat(resultArray_country2).concat(resultArray_country1);
        all_resultArray_country = [...new Set(all_resultArray_country)];
        all_resultArray_country.sort((a,b)=>{return a.indexOfNum-b.indexOfNum});
        return all_resultArray_country;
      }

      //买币选择加密货币
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

      //卖币选择加密货币
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
      if(this.viewName === 'payCurrency' || this.viewName === 'payCurrency-sell'){
        this.viewTitle = this.$t('nav.search_components_countryTitle');
        return;
      }
      if(this.viewName === 'currency' || this.viewName === 'currency-sell'){
        this.viewTitle = this.$t('nav.search_components_cryptoTitle');
        return;
      }
      if(this.viewName === 'network'){
        this.viewTitle = this.$t('nav.search_components_networkTitle');
        return;
      }
    },

    //Get and call component path, processing data
    initializationData(){
      if(this.viewName === 'currency'){
        this.basicData = this.allBasicData;
        this.$nextTick(()=>{
          let popularList = this.basicData.cryptoCurrencyResponse.popularList;
          popularList !== null && popularList.length > 0 ? this.popularList = popularList.filter(item=>{return item.purchaseSupported === 1}) : '';
          console.log()
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
        if(this.allBasicData.worldList){
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
        }
        this.basicData = newWorldList;
        // this.queryCountryList();
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
    },

    //close component
    closeView(){
      if(this.viewName === 'currency' || this.viewName === 'currency-sell' || this.viewName === 'payCurrency-sell' || this.viewName === 'payCurrency') {
        this.$parent.searchState = true;
        return;
      }
      if(this.viewName === 'network'){
        this.$parent.$parent.$refs.viewTab.tabState = true;
        this.$parent.searchViewState = false;
        return;
      }
    },

    //Select data
    choiseItem(type,item){
      setTimeout(()=>{
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
          this.$nextTick(()=>{
            this.$parent.buyParams.network = item.network;
            this.$store.state.buyRouterParams.network = item.network;
            console.log(this.$store.state.buyRouterParams.network)
            this.$parent.networkRegular = item.addressRegex;
            this.$parent.$parent.$refs.viewTab.tabState = true;
            this.$parent.searchViewState = false;
            if(!new RegExp(this.$parent.networkRegular).test(this.$parent.buyParams.address)){
              this.$parent.walletAddress_state = true;
            }else{
              this.$parent.walletAddress_state = false;
            }
          })
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
