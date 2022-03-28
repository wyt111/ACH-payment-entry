<!-- search Public organization -->
<template>
  <div id="search">
    <div class="searchHeader">
      <div class="searchHeader_view1">
        <div class="text">{{ viewTitle }}</div>
        <div class="icon"><img src="../assets/images/closeIcon.png" @click="closeView"></div>
      </div>
      <div class="searchHeader_view2" v-if="viewName !== 'network'">
        <input type="text" placeholder="Search here…" v-model="searchText">
        <div class="searchIcon"><img src="../assets/images/searchIcon.svg"></div>
      </div>
    </div>
    <div class="search_core">
      <!-- country content -->
      <ul v-if="viewName === 'country'">
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
          <li v-for="(item,index) in cryptoCurrencyVOList" :key="index" @click="choiseItem('currency',item)">
            <p class="seach_li_img"><img :src="item.logoUrl"></p>
            <p class="seach_li_text currencyCopywriting">{{ item.name }} <span class="seach_li_allText"> - {{ item.fullName }}</span></p>
            <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
          </li>
        </div>
        <div v-else>
          <li v-for="(item,index) in searchData" :key="index" @click="choiseItem('currency',item)">
            <p class="seach_li_img"><img :src="item.logoUrl"></p>
            <p class="seach_li_text currencyCopywriting">{{ item.name }} <span class="seach_li_allText"> - {{ item.fullName }}</span></p>
            <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
          </li>
        </div>
      </ul>
      <ul v-else-if="viewName === 'network'">
        <li v-for="(item,index) in basicData" :key="index" @click="choiseItem('network',item)">
          <p class="seach_li_text currencyCopywriting">{{ item.network }} - <span class="seach_li_allText">{{ item.networkName }}</span></p>
          <p class="seach_li_rightIcon"><img src="../assets/images/rightIcon.png"></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: "search",
  props: ['viewName','allBasicData'],
  data(){
    return{
      viewTitle: "",

      //Search for data
      searchText: "",

      //all data
      basicData: {},

      //all country data
      countryList: [],

      //Recommended digital currency list
      popularList: [],
      //Support digital currency list
      cryptoCurrencyVOList: [],
    }
  },
  computed: {
    //Fuzzy search
    searchData(){
      if(this.searchText && this.viewName === 'country') {
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
      if(this.viewName === 'country'){
        this.viewTitle = 'Select Country';
        return;
      }
      if(this.viewName === 'currency'){
        this.viewTitle = 'Select Crypto';
        return;
      }
      if(this.viewName === 'network'){
        this.viewTitle = 'Select Network';
        return;
      }
    },

    //close component
    closeView(){
      if(this.viewName === 'country' || this.viewName === 'currency') {
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
        if(type === 'country'){
          this.$parent.$refs.buyCrypto_ref.positionData.positionImg = item.flag;
          this.$parent.$refs.buyCrypto_ref.positionData.positionValue = item.enCommonName;
          //pay methods
          if(item.payWayList.length===1){
            this.$parent.$refs.buyCrypto_ref.payType = [];
            this.$parent.$refs.buyCrypto_ref.payType.push(this.basicData.payWayList[0]);
            this.$parent.$refs.buyCrypto_ref.paymentMethod = this.$parent.$refs.buyCrypto_ref.payType[0].payWayName;
            this.$parent.$refs.buyCrypto_ref.paymentMethodCode = this.$parent.$refs.buyCrypto_ref.payType[0].payWayCode;
          }else{
            this.$parent.$refs.buyCrypto_ref.payType = this.basicData.payWayList;
          }
          this.$parent.searchState = true;
        }else if(type === 'currency'){
          this.$parent.$refs.buyCrypto_ref.currencyData.icon = item.logoUrl;
          this.$parent.$refs.buyCrypto_ref.currencyData.name = item.name;
          this.$parent.$refs.buyCrypto_ref.currencyData.networkFee = item.networkFee;
          this.$parent.$refs.buyCrypto_ref.currencyData.price = item.price;
          this.$parent.$refs.buyCrypto_ref.currencyData.serviceFee = item.serviceFee;
          this.$parent.$refs.buyCrypto_ref.payinfo();
          this.$parent.searchState = true;
        }else if(type === 'network'){
          this.$parent.buyParams.network = item.network;
          this.$parent.networkRegular = item.addressRegex;
          this.$parent.$parent.$refs.viewTab.tabState = true;
          this.$parent.searchViewState = false;
        }
      })
    },

    //Get and call component path, processing data
    initializationData(){
      if(this.viewName === 'country') {
        this.basicData = this.allBasicData;
        this.$nextTick(()=>{
          this.countryList = this.basicData.worldList;
        })
      }else if(this.viewName === 'currency'){
        this.basicData = this.allBasicData;
        this.$nextTick(()=>{
          this.popularList = this.basicData.cryptoCurrencyResponse.popularList;
          this.cryptoCurrencyVOList = this.basicData.cryptoCurrencyResponse.cryptoCurrencyList;
        })
      }else if(this.viewName === 'network'){
        this.basicData = [];
        this.basicData = this.allBasicData;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
html,body,#search{
  width: 100%;
  height: 100%;
}
#search{
  display: flex;
  flex-direction: column;
  .search_core{
    flex: 1;
    overflow: auto;
    margin-top: 0.15rem;
    .screen_title{
      font-size: 0.14rem;
      font-family: Jost-Regular, Jost;
      font-weight: 400;
      color: #232323;
      margin-top: 0.1rem;
    }
    ul{
      li{
        display: flex;
        align-items: center;
        height: 0.55rem;
        cursor: pointer;
        .seach_li_img{
          display: flex;
          img{
            width: 0.3rem;
          }
        }
        .seach_li_text{
          font-size: 0.16rem;
          font-family: Jost-Regular, Jost;
          font-weight: 400;
          color: #232323;
          margin-left: 0.2rem;
          .seach_li_allText{
            color: #666666;
            font-weight: 500;
          }
        }
        .currencyCopywriting{
          margin-left: 0.1rem;
        }
        .seach_li_rightIcon{
          display: flex;
          margin-left: auto;
          img{
            width: 0.12rem;
          }
        }
      }
    }
  }
}
.searchHeader{
  .searchHeader_view1{
    font-size: 0.2rem;
    font-family: Jost-Bold, Jost;
    font-weight: bold;
    color: #232323;
    display: flex;
    align-items: center;
    .icon{
      display: flex;
      margin-left: auto;
      cursor: pointer;
      img{
        width: 0.2rem;
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
    margin-top: 0.2rem;
    position: relative;
    input{
      width: 100%;
      height: 100%;
      font-size: 0.16rem;
      font-family: Jost-Regular, Jost;
      font-weight: 400;
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
