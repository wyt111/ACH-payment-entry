<template>
  <div id="formUserInfo">
    <div class="content">
<!--      <div class="agreementView">-->
<!--        <div><input type="checkbox" v-model="agreement"></div>-->
<!--        <div>Use the information l have</div>-->
<!--      </div>-->
      <div class="formLine formLine_flex">
        <div class="formLine_flex_child">
          <div class="formTitle">First Name</div>
          <div class="formContent"><input type="text" v-model="sellForm.firstname" maxlength="50" @input="sellForm.firstname = sellForm.firstname.replace(/[^\x00-\xff]/g, '')"></div>
        </div>
        <div class="formLine_flex_child">
          <div class="formTitle">Last Name</div>
          <div class="formContent"><input type="text" v-model="sellForm.lastname" maxlength="50" @input="sellForm.lastname = sellForm.lastname.replace(/[^\x00-\xff]/g, '')"></div>
        </div>
      </div>
      <div class="formLine">
        <div class="formTitle">Phone</div>
        <div class="formContent">
          <van-field class="number_input" type="digit" v-model="sellForm.phone"/>
        </div>
      </div>
      <div class="formLine">
        <div class="formTitle">Email</div>
        <div class="formContent"><input type="email" v-model="sellForm.email" @input="sellForm.email = sellForm.email.replace(/[^\x00-\xff]/g, '')"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">ID Type</div>
        <div class="formContent">
          <div class="radio" :class="{'radioClass': sellForm.idType === 1}" @click="sellForm.idType=1">ID Card</div>
          <div class="radio" :class="{'radioClass': sellForm.idType === 2}" @click="sellForm.idType=2">Passport</div>
        </div>
      </div>
      <div class="formLine">
        <div class="formTitle">ID Number</div>
        <div class="formContent"><input type="email" v-model="sellForm.idNumber" @input="sellForm.idNumber = sellForm.idNumber.replace(/[^\x00-\xff]/g, '')"></div>
      </div>
    </div>
    <button class="continue" :disabled="buttonState" @click="next">Continue</button>
  </div>
</template>

<script>
import {AES_Decrypt, AES_Encrypt} from "../../../utils/encryp";

export default {
  name: "formUserInfo",
  data(){
    return{
      agreement: false,
      sellForm: {
        firstname: "", // 传值需要加密处理
        lastname: "",   //  传值需要加密处理
        phone: "",  //  传值需要加密处理
        email: "", // 传值需要加密处理
        idType: "", // 证件类型  1=ID Card 、2=Passport
        idNumber: "", // 证件号码 传值需要加密处理
        source: "1", // 来源 1=卖币添加 0=买币添加
      }
    }
  },
  //首页进入卖币卡表单页面清空缓存
  beforeRouteEnter(to,from,next){
    next(vm => {
      if(to.path === '/sell-formUserInfo' && from.path === '/' && vm.$store.state.cardInfoFromPath !== 'sellOrder'){
        vm.sellForm = {
          firstname: "",
          lastname: "",
          phone: "",
          email: "",
          idType: "",
          idNumber: "",
          source: "1",
        };
      }
    });
  },
  computed: {
    buttonState(){
      if(this.sellForm.firstname === ''||this.sellForm.lastname === ''||
          this.sellForm.phone === '' || this.sellForm.email === ''||
          this.sellForm.idType === ''||this.sellForm.idNumber === ''){
        return true;
      }else{
        return false;
      }
    }
  },
  activated() {
    //合并解密参数
    if (this.$store.state.sellForm) {
      this.sellForm = this.$store.state.sellForm;
      this.sellForm.firstname = AES_Decrypt(this.sellForm.firstname);
      this.sellForm.lastname = AES_Decrypt(this.sellForm.lastname);
      this.sellForm.phone = AES_Decrypt(this.sellForm.phone);
      this.sellForm.email = AES_Decrypt(this.sellForm.email);
      this.sellForm.idNumber = AES_Decrypt(this.sellForm.idNumber);
    }
    //首页进入卖币卡表单页面赋值默认值
    if(this.$store.state.cardInfoFromPath === 'configSell'){
      this.sellForm.email = AES_Decrypt(localStorage.getItem("email"));
    }
  },
  methods: {
    next(){
      //email verification
      if(!new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$").test(this.sellForm.email)){
        this.$toast("not a valid email.");
        return;
      }

      //需要加密字段
      let newForm = JSON.parse(JSON.stringify(this.sellForm));
      newForm.firstname = AES_Encrypt(newForm.firstname);
      newForm.lastname = AES_Encrypt(newForm.lastname);
      newForm.phone = AES_Encrypt(newForm.phone);
      newForm.email = AES_Encrypt(newForm.email);
      newForm.idNumber = AES_Encrypt(newForm.idNumber);
      this.$store.state.sellForm = newForm;
      this.$router.push('/sell-formAddress');
    }
  }
}
</script>

<style lang="scss" scoped>
  #formUserInfo{
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
        .radioClass{
          background: #4479D9;
          color: #FAFAFA;
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
      border: none;
      cursor: pointer;
      &:disabled{
        background: rgba(68, 121, 217, 0.5);
        cursor: no-drop;
      }
    }
  }


  //数字输入框
  .van-cell{
    padding: 0 !important;
  }
  .number_input ::v-deep .van-field__control{
    width: 100%;
    min-height: 0.6rem;
    background: #F3F4F5;
    border-radius: 10px;
    font-size: 0.16rem;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    border: none;
    outline: none;
    padding: 0 0.2rem;
    &::placeholder{
      color: #999999 !important;
    }
  }
</style>
