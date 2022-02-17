<template>
  <div id="buyCrypto">
    <div class="selectCountry" @click="openSearch('country')">
      <div class="selectCountry_left">
        <div><img src="@/assets/logo.png"></div>
        <div>Hong Kong</div>
      </div>
      <div class="selectCountry_right"><img src="@/assets/images/rightIcon.png"></div>
    </div>

    <div class="form_title methods_title">Payment Method</div>
    <div class="methods_select">Visa/Master</div>

    <div class="form_title pay_title">You Pay</div>
    <div class="methods_select">
      <input class="pay_input" type="number" placeholder="0.00">
      <span class="pay_company">USD</span>
    </div>
    <div class="warning_text" v-if="warningTextState">The minimum transaction amount is $30.00.</div>

    <div class="form_title get_title">You Get</div>
    <div class="methods_select">
      <input class="pay_input get_input" type="number" placeholder="0.00">
      <div class="get_company" @click="openSearch('currency')">
        <div class="getImg"><img src="@/assets/logo.png"></div>
        <div class="getText">ACH</div>
        <div class="rightIcon"><img src="@/assets/images/rightIcon.png"></div>
      </div>
    </div>

    <div class="calculationProcess">
      <div class="calculationProcess_line">
        <div class="line_name">Remaining time</div>
        <div class="line_number">
          <div class="line_number_icon"><img src="@/assets/images/countDownIcon.svg"></div>
          <div class="line_number_red">15S</div>
        </div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">ACH Price</div>
        <div class="line_number">$238</div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">Ramp fee</div>
        <div class="line_number">$10</div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">Network Fee</div>
        <div class="line_number">$10</div>
      </div>
      <div class="calculationProcess_line">
        <div class="line_name">Total</div>
        <div class="line_number">$30.00</div>
      </div>
    </div>

    <div class="continue">Continue</div>

  </div>
</template>

<script>

export default {
  name: "buyCrypto",
  data(){
    return{
      warningTextState: false,

    }
  },
  methods: {
    openSearch(view){
      this.$parent.openSearch(view);
    },
    submitForm(){
      buyCryptoInfo().then(res=>{

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.selectCountry{
  display: flex;
  align-items: center;
  height: 0.6rem;
  background: #F3F4F5;
  border-radius: 10px;
  padding: 0 0.2rem;
  cursor: pointer;
  .selectCountry_left{
    display: flex;
    align-items: center;
    font-size: 0.16rem;
    font-family: Jost-Bold, Jost;
    font-weight: bold;
    color: #232323;
    div{
      display: flex;
    }
    div:nth-of-type(2){
      margin-left: 0.1rem;
    }
    img{
      width: 0.3rem;
    }
  }
  .selectCountry_right{
    margin-left: auto;
    display: flex;
    img{
      width: 0.12rem;
    }
  }
}

.form_title{
  font-size: 0.14rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #232323;
  padding-bottom: 0.1rem;
}

.methods_title{
  margin-top: 0.2rem;
}
.methods_select{
  min-height: 0.6rem;
  background: #F3F4F5;
  border-radius: 10px;
  font-size: 0.16rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #232323;
  line-height: 0.6rem;
  padding: 0 0.2rem;
  cursor: pointer;
  position: relative;
}

.pay_title{
  margin-top: 0.4rem;
}
.pay_input{
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: #F3F4F5;
  font-size: 0.16rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #232323;
  padding: 0 0.6rem 0 0;
}
.pay_company{
  position: absolute;
  right: 0.2rem;
}
.warning_text{
  font-size: 0.14rem;
  font-family: Jost-Regular, Jost;
  font-weight: 400;
  color: #FF0000;
  margin: 0.1rem 0.2rem 0 0.2rem;
}

.get_title{
  margin-top: 0.2rem;
}
.get_input{
  padding: 0 1.5rem 0 0;
}
.get_company{
  position: absolute;
  top: 0;
  right: 0.2rem;
  display: flex;
  align-items: center;
  div{display: flex}
  .getImg{
    margin-right: 0.1rem;
    img{
      width: 0.3rem;
    }
  }
  .getText{
    display: flex;
    font-size: 0.16rem;
    font-family: Jost-Medium, Jost;
    font-weight: 500;
    color: #232323;
    margin-right: 0.2rem;
  }
  .rightIcon{
    img{
      width: 0.12rem;
    }
  }
}

.continue{
  width: 100%;
  height: 0.6rem;
  background: rgba(68, 121, 217, 0.5);
  border-radius: 4px;
  text-align: center;
  line-height: 0.6rem;
  font-size: 0.18rem;
  font-family: Jost-Medium, Jost;
  font-weight: 500;
  color: #FAFAFA;
  margin-top: 0.4rem;
  cursor: no-drop;
}

.calculationProcess{
  padding: 0 0.2rem;
  .calculationProcess_line{
    display: flex;
    align-items: center;
    margin-top: 0.2rem;
    .line_name{
      font-size: 0.14rem;
      font-family: Jost-Regular, Jost;
      font-weight: 400;
      color: #232323;
    }
    .line_number{
      margin-left: auto;
      font-size: 0.14rem;
      font-family: Jost-Medium, Jost;
      font-weight: 500;
      color: #232323;
      display: flex;
      align-items: center;
      .line_number_icon{
        margin-right: 0.05rem;
        img{
          width: 0.12rem;
        }
      }
      .line_number_red{
        font-size: 0.14rem;
        font-family: Jost-Medium, Jost;
        font-weight: 500;
        color: #FF0000;
      }
    }
  }
}

</style>
