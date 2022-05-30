<template>
  <div id="formUserInfo">
    <div class="content">
      <div class="agreementView">
        <div><input type="checkbox" v-model="agreement"></div>
        <div>Use the information l have</div>
      </div>
      <div class="formLine formLine_flex">
        <div class="formLine_flex_child">
          <div class="formTitle">First Name</div>
          <div class="formContent"><input type="text" v-model="sellForm.firstname" maxlength="50"></div>
        </div>
        <div class="formLine_flex_child">
          <div class="formTitle">Last Name</div>
          <div class="formContent"><input type="text" v-model="sellForm.lastname" maxlength="50"></div>
        </div>
      </div>
      <div class="formLine">
        <div class="formTitle">Phone</div>
        <div class="formContent"><input type="email" v-model="sellForm.phone"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">Email</div>
        <div class="formContent"><input type="email" v-model="sellForm.email"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">Idtype</div>
        <div class="formContent">
          <div class="radio" :class="{'radioClass': sellForm.idType === 1}" @click="sellForm.idType=1">ID Card</div>
          <div class="radio" :class="{'radioClass': sellForm.idType === 2}" @click="sellForm.idType=2">Passport</div>
        </div>
      </div>
      <div class="formLine">
        <div class="formTitle">Idnumber</div>
        <div class="formContent"><input type="email" v-model="sellForm.idNumber"></div>
      </div>
    </div>
    <button class="continue" :disabled="buttonState" @click="next">Continue</button>
  </div>
</template>

<script>
export default {
  name: "formUserInfo",
  data(){
    return{
      params: {
        firstname: "",
        lastname: "",
      },
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
  activated(){
    if(this.$store.state.sellForm){
      this.sellForm = {...this.$store.state.sellForm,...this.sellForm};
    }
  },
  methods: {
    next(){
      this.$store.state.sellForm = this.sellForm;
      this.$router.push(`/sell-formAddress?goPath=${this.$route.query.goPath}`);
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
      cursor: no-drop;
      border: none;
      &:disabled{
        background: rgba(68, 121, 217, 0.5);
      }
    }
  }
</style>
