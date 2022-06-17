<template>
  <div id="formAddress">
    <Search v-show="searchViewState" viewName="country-sellForm" :allBasicData="allBasicData" routerFrom="payForm"/>
    <div class="formAddress-view" v-show="!searchViewState">
      <div class="content">
<!--        <div class="agreementView">-->
<!--          <div><input type="checkbox" v-model="agreement"></div>-->
<!--          <div>Use the address l have</div>-->
<!--        </div>-->
        <div class="formLine">
          <div class="formTitle">Country</div>
          <div class="formContent" @click="openSearch"><input type="text" v-model="countryName" disabled="true"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">Address</div>
          <div class="formContent"><input type="text" v-model="sellForm.address" @input="sellForm.address = sellForm.address.replace(/[^\x00-\xff]/g, '')"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">City</div>
          <div class="formContent"><input type="text" v-model="sellForm.city" @input="sellForm.city = sellForm.city.replace(/[^\x00-\xff]/g, '')"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">State</div>
          <div class="formContent"><input type="text" v-model="sellForm.state" @input="sellForm.state = sellForm.state.replace(/[^\x00-\xff]/g, '')"></div>
        </div>
      </div>
      <button class="continue" :disabled="buttonState" @click="next">Continue</button>
    </div>
  </div>
</template>

<script>
import Search from '../../../components/search';

export default {
  name: "formAddress",
  components: { Search },
  data(){
    return{
      searchViewState: false,
      allBasicData: {},

      agreement: false,
      countryName: "",
      sellForm: {
        country: "",
        city: "",
        state: "",
        address: "",
        source: "1", // 来源 1=卖币添加 0=买币添加
      }
    }
  },
  computed: {
    buttonState(){
      if(this.sellForm.country === ''||this.sellForm.address === ''||
      this.sellForm.city === '' || this.sellForm.state === ''){
        return true;
      }else{
        return false;
      }
    }
  },
  //首页进入卖币卡表单页面清空缓存
  beforeRouteEnter(to,from,next){
    next(vm => {
      if(to.path === '/sell-formAddress' && from.path === '/sell-formUserInfo'){
        vm.countryName = "";
        vm.sellForm = {
          country: "",
          city: "",
          state: "",
          address: "",
          source: "1",
        };
      }
    });
  },
  activated(){
    this.allBasicData = JSON.parse(localStorage.getItem("allBasicData"));
    //合并参数
    if(this.$store.state.sellForm){
      this.sellForm = this.$store.state.sellForm;
      this.countryName = this.$store.state.sellForm.enCommonName;
    }
    //首页进入卖币卡表单页面赋值默认值
    if(this.$store.state.cardInfoFromPath === 'configSell'){
      this.sellForm.country = this.$store.state.sellRouterParams.positionData.alpha2;
      this.countryName = this.$store.state.sellRouterParams.positionData.positionValue;
    }
  },
  methods: {
    openSearch(){
      this.searchViewState = true;
      this.$parent.$refs.viewTab.tabState = false;
    },
    next(){
      this.$store.state.sellForm = this.sellForm;
      this.$router.push('/sell-formBankInfo');
    }
  }
}
</script>

<style lang="scss" scoped>
#formAddress,.formAddress-view{
  width: 100%;
  height: 100%;
}
.formAddress-view{
  display: flex;
  flex-direction: column;
  .content{
    flex: 1;
    overflow: auto;
  }
  .agreementView{
    font-size: 0.16rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #232323;
    display: flex;
    align-items: center;
    input{
      cursor: pointer;
    }
    div:last-child{
      margin-top: -0.03rem;
      margin-left: 0.1rem;
    }
  }
  .formLine{
    margin-top: 0.2rem;
    .formTitle{
      font-size: 0.14rem;
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      color: #232323;
      display: flex;
      align-items: flex-end;
      .formTitle_logo{
        margin-left: auto;
        color: darkgray;
        img{
          width: 0.4rem;
        }
      }
    }
    .formContent{
      display: flex;
      margin-top: 0.12rem;
      position: relative;
      input{
        width: 100%;
        height: 0.6rem;
        background: #F3F4F5;
        border-radius: 10px;
        font-size: 0.16rem;
        font-family: 'Jost', sans-serif;
        font-weight: 500;
        border: none;
        outline: none;
        padding: 0 0.2rem;
      }
      .rightIcon{
        display: flex;
        position: absolute;
        top: 0.23rem;
        right: 0.2rem;
        img{
          width: 0.12rem;
        }
      }
      .radio{
        width: 100%;
        background: #F3F4F5;
        font-size: 0.16rem;
        font-family: 'Jost', sans-serif;
        font-weight: 500;
        color: #232323;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        border-radius: 10px;
        cursor: pointer;
        &:last-child{
          margin-left: 0.2rem;
        }
      }
    }
  }
  .formLine_flex{
    display: flex;
    .formLine_flex_child:nth-of-type(1){
      padding-right: 0.1rem;
    }
    .formLine_flex_child:nth-of-type(2){
      padding-left: 0.1rem;
    }
  }

  .continue{
    width: 100%;
    height: 0.6rem;
    background: #4479D9;
    border-radius: 4px;
    text-align: center;
    line-height: 0.6rem;
    font-size: 0.18rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    color: #FAFAFA;
    margin: 0.1rem 0 0 0;
    cursor: pointer;
    border: none;
    &:disabled{
      background: rgba(68, 121, 217, 0.5);
      cursor: no-drop;
    }
  }
}
</style>
