<template>
  <div id="formBankInfo_box">
    <Search viewName="bank" :allBasicData="bankList" routerFrom="payForm" v-if="searchViewState"/> <!--   -->
    <div id="formBankInfo" v-else>
      <div class="content">
        <div class="formLine">
          <div class="formTitle">Bank</div>
          <div class="formContent" @click="openSearch"><input type="tel" v-model="sellForm.bank" disabled="true"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">Swit Code</div>
          <div class="formContent"><input type="tel" v-model="sellForm.swiftCode" @input="sellForm.swiftCode = sellForm.swiftCode.replace(/[^\x00-\xff]/g, '')"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">Account No</div>
          <div class="formContent"><input type="tel" v-model="sellForm.cardNumber" @input="sellForm.cardNumber = sellForm.cardNumber.replace(/[^\x00-\xff]/g, '')"></div>
        </div>
      </div>
      <button class="continue" :disabled="buttonState" @click="next">Continue</button>
    </div>
  </div>
</template>

<script>
import Search from "../../../components/search";
import {AES_Decrypt, AES_Encrypt} from '../../../utils/encryp';

export default {
  name: "formBankInfo",
  components: { Search },
  data(){
    return{
      agreement: false,
      sellForm: {
        cardNumber: "",  //  传值需要加密处理
        worldBankId: "", // 选择银行id
        bank: "",
        swiftCode: "",
        userCardId: "", // //修改信用卡信息需要带上userCardId
        source: "1", // 来源 1=卖币添加 0=买币添加
      },
      bankList: [],
      searchViewState: false,
      name: 1,
    }
  },
  computed: {
    buttonState(){
      if(this.sellForm.bank !== '' && this.sellForm.swiftCode !== '' && this.sellForm.cardNumber !== ''){
        return false;
      }else{
        return true;
      }
    }
  },
  activated(){
    //合并解密参数
    if(this.$store.state.sellForm){
      let oldSellForm = {...this.sellForm,...this.$store.state.sellForm};
      oldSellForm.cardNumber = AES_Decrypt(oldSellForm.cardNumber);
      //清除所有null数据
      Object.keys(oldSellForm).forEach(item => {
        if (!oldSellForm[item] && oldSellForm[item] != 0) {
          delete oldSellForm[item]
        }
      })
      this.sellForm = oldSellForm;
    }
    this.queryBank();
  },
  methods: {
    openSearch(){
      this.searchViewState = true;
      this.$parent.$refs.viewTab.tabState = false;
    },
    queryBank(){
      this.$axios.get(this.$api.get_bank,'').then(res=>{
        if(res && res.returnCode === "0000"){
          this.bankList = res.data;
        }
      })
    },
    next(){
      //加密字段 浅拷贝数据避免影响原数据
      let params = JSON.parse(JSON.stringify(this.sellForm));
      params.cardNumber = AES_Encrypt(params.cardNumber);
      this.$axios.post(this.$api.post_saveCardInfo,params,'').then(res=>{
        if(res && res.returnCode === "0000"){
          //存储数据
          this.sellForm.cardNumber = AES_Encrypt(this.sellForm.cardNumber);
          this.$store.state.sellForm = this.sellForm;
          if(this.$store.state.cardInfoFromPath === 'configSell' || this.$store.state.cardInfoFromPath === 'configSell'){
            this.$router.replace(`/${this.$store.state.cardInfoFromPath}`);
            return;
          }
          this.$router.push(`/${this.$store.state.cardInfoFromPath}`);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#formBankInfo_box,#formBankInfo{
  height: 100%;
}
#formBankInfo{
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
    cursor: no-drop;
    border: none;
    &:disabled{
      background: rgba(68, 121, 217, 0.5);
    }
  }
}
</style>
