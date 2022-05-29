<template>
  <div id="formAddress">
    <div class="content">
      <div class="agreementView">
        <div><input type="checkbox" v-model="agreement"></div>
        <div>Use the address l have</div>
      </div>
      <div class="formLine">
        <div class="formTitle">Country</div>
        <div class="formContent"><input type="text" v-model="sellForm.country"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">Address</div>
        <div class="formContent"><input type="text" v-model="sellForm.address"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">City</div>
        <div class="formContent"><input type="text" v-model="sellForm.city"></div>
      </div>
      <div class="formLine">
        <div class="formTitle">State</div>
        <div class="formContent"><input type="text" v-model="sellForm.state"></div>
      </div>
    </div>
    <button class="continue" :disabled="buttonState" @click="next">Continue</button>
  </div>
</template>

<script>
export default {
  name: "formAddress",
  data(){
    return{
      params: {
        firstname: "",
        lastname: "",
      },
      agreement: false,
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
      console.log(this.sellForm.country === ''||this.sellForm.address === ''||
          this.sellForm.city === '' || this.sellForm.state === '')
      if(this.sellForm.country === ''||this.sellForm.address === ''||
      this.sellForm.city === '' || this.sellForm.state === ''){
        return true;
      }else{
        return false;
      }
    }
  },
  activated(){
    if(sessionStorage.getItem("sellForm")){
      let oldSellFrom = JSON.parse(sessionStorage.getItem("sellForm"));
      this.sellForm = {...oldSellFrom,...this.sellForm};
    }
  },
  methods: {
    next(){
      sessionStorage.setItem("sellForm",JSON.stringify(this.sellForm));
      this.$router.push(`/sell-formBankInfo?goPath=${this.$route.query.goPath}`);
    }
  }
}
</script>

<style lang="scss" scoped>
#formAddress{
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
