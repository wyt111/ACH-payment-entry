<!-- search Public organization -->
<template>
  <div id="search">
    <div class="searchHeader">
      <div class="searchHeader_view1">
        <div class="text">{{ viewName === 'country' ? 'Select Country' : 'Select Crypto' }}</div>
        <div class="icon"><img src="../../../assets/images/closeIcon.png" @click="closeView"></div>
      </div>
      <div class="searchHeader_view2">
        <input type="text" placeholder="Search here…">
        <div class="searchIcon"><img src="../../../assets/images/searchIcon.svg"></div>
      </div>
    </div>
    <div class="search_core">
      <!-- country content -->
      <ul v-if="viewName === 'country'">
        <li>
          <p class="seach_li_img"><img src="../../../assets/logo.png"></p>
          <p class="seach_li_text">Australia</p>
          <p class="seach_li_rightIcon"><img src="../../../assets/images/rightIcon.png"></p>
        </li>
      </ul>
      <!-- currency content -->
      <ul v-else-if="viewName === 'currency'">
        <div class="screen_title">Popular</div>
        <li>
          <p class="seach_li_img"><img src="../../../assets/logo.png"></p>
          <p class="seach_li_text currencyCopywriting">ACH <span class="seach_li_allText"> - Alchemy Pay</span></p>
          <p class="seach_li_rightIcon"><img src="../../../assets/images/rightIcon.png"></p>
        </li>
        <div class="screen_title">All</div>
        <li>
          <p class="seach_li_img"><img src="../../../assets/logo.png"></p>
          <p class="seach_li_text currencyCopywriting">ACH <span class="seach_li_allText"> - Alchemy Pay</span></p>
          <p class="seach_li_rightIcon"><img src="../../../assets/images/rightIcon.png"></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "search",
  props: ['viewName','cryptoCurrencyResponse','worldList','payWayList'],
  data(){
    return{
      searchList: {}
    }
  },
  mounted(){
    console.log(this.cryptoCurrencyResponse,this.worldList,this.payWayList)
  },
  methods: {
    closeView(){
      this.$parent.searchState = true;
    }
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
