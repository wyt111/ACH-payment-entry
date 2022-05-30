<template>
  <div id="formBankInfo_box">
    <Search viewName="bank" :allBasicData="bankList" routerFrom="payForm" v-if="searchViewState"/> <!--   -->
    <div id="formBankInfo" v-else>
      <div class="content">
        <div class="formLine">
          <div class="formTitle">Bank</div>
          <div class="formContent" @click="openSearch"><input type="tel" v-model="bankInfo.bankName" disabled="true"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">Swit Code</div>
          <div class="formContent"><input type="tel" v-model="bankInfo.bankCode"></div>
        </div>
        <div class="formLine">
          <div class="formTitle">Account No</div>
          <div class="formContent"><input type="tel" v-model="sellForm.cardNumber"></div>
        </div>
      </div>
      <button class="continue" :disabled="buttonState" @click="next">Continue</button>
    </div>
  </div>
</template>

<script>
import Search from "../../../components/search";
import { AES_Encrypt } from '../../../utils/encryp';

export default {
  name: "formBankInfo",
  components: { Search },
  data(){
    return{
      bankInfo: {
        bankName: "",
        bankCode: "",
      },
      agreement: false,
      sellForm: {
        cardNumber: "",  //  传值需要加密处理
        worldBankId: "", // 选择银行id
        userCardId: "90", // //修改信用卡信息需要带上userCardId
        source: "1", // 来源 1=卖币添加 0=买币添加
      },
      bankList: [],
      searchViewState: false,
      name: 1,
    }
  },
  computed: {
    buttonState(){
      if(this.bankInfo.bankName !== '' && this.bankInfo.bankCode !== '' && this.sellForm.cardNumber !== ''){
        return false;
      }else{
        return true;
      }
    }
  },
  activated(){
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
      //合并参数
      if(this.$store.state.sellForm){
        this.sellForm = {...this.sellForm,...this.$store.state.sellForm};
      }
      //加密参数
      this.sellForm.firstname = AES_Encrypt(this.sellForm.firstname);
      this.sellForm.lastname = AES_Encrypt(this.sellForm.lastname);
      this.sellForm.cardNumber = AES_Encrypt(this.sellForm.cardNumber);
      this.sellForm.phone = AES_Encrypt(this.sellForm.phone);
      this.sellForm.email = AES_Encrypt(this.sellForm.email);
      this.sellForm.idNumber = AES_Encrypt(this.sellForm.idNumber);
      //存储数据
      this.$store.state.sellForm = this.sellForm;
      this.$store.state.bankInfo = this.bankInfo;
      this.$axios.post(this.$api.post_saveCardInfo,this.sellForm,'').then(res=>{
        if(res && res.returnCode === "0000"){
          this.$router.push(`/${this.$route.query.goPath}`);
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
