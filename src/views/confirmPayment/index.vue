<template>
  <div id="confirmPayment">
    <div class="formLine">
      <div class="formTitle">Country</div>
      <div class="formContent"><input type="text"></div>
    </div>
    <div class="formLine">
      <div class="formTitle">State</div>
      <div class="formContent"><input type="text"></div>
    </div>
    <div class="formLine">
      <div class="formTitle">City</div>
      <div class="formContent"><input type="text"></div>
    </div>
    <div class="formLine">
      <div class="formTitle">Postcode</div>
      <div class="formContent"><input type="text"></div>
    </div>
    <div class="formLine">
      <div class="formTitle">Address</div>
      <div class="formContent"><input type="text"></div>
    </div>
    <div class="formLine formLine_flex">
      <div class="formLine_flex_child">
        <div class="formTitle">Firet Name</div>
        <div class="formContent"><input type="text"></div>
      </div>
      <div class="formLine_flex_child">
        <div class="formTitle">Last Name</div>
        <div class="formContent"><input type="text"></div>
      </div>
    </div>
    <div class="formLine">
      <div class="formTitle">Phone</div>
      <div class="formContent"><input type="text"></div>
    </div>
    <div class="formLine">
      <div class="formTitle">Phone</div>
      <div class="formContent"><input type="text"></div>
    </div>
    <div class="formLine">
      <div class="formTitle">Email</div>
      <div class="formContent"><input type="text"></div>
    </div>
    <div class="formLine">
      <div class="formTitle">
        <div>Card Number</div>
        <div class="formTitle_logo">
          <img src="../../assets/images/visaText.png">
          <img src="../../assets/images/visaImage.png">
        </div>
      </div>
      <div class="formContent"><input type="text"></div>
    </div>
    <div class="formLine formLine_flex">
      <div class="formLine_flex_child">
        <div class="formTitle">Expiration Date</div>
        <div class="formContent"><input type="text" disabled><span class="rightIcon"><img src="../../assets/images/rightIcon.png"></span></div>
      </div>
      <div class="formLine_flex_child">
        <div class="formTitle">&nbsp;</div>
        <div class="formContent"><input type="text" disabled><span class="rightIcon"><img src="../../assets/images/rightIcon.png"></span></div>
      </div>
    </div>
    <div class="formLine">
      <div class="formTitle">Card CVV</div>
      <div class="formContent"><input type="text"></div>
    </div>

    <div class="continue">Confirm Payment</div>
  </div>
</template>

<script>
export default {
  name: "Confirm Payment"
}
</script>

<style lang="scss" scoped>
#confirmPayment{
  .formLine{
    margin-top: 0.2rem;
    .formTitle{
      font-size: 0.14rem;
      font-family: Jost-Medium, Jost;
      font-weight: 500;
      color: #232323;
      display: flex;
      align-items: flex-end;
      .formTitle_logo{
        margin-left: auto;
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
        font-family: Jost-Medium, Jost;
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
}
//input:focus{
//  border: 1px solid #4479D9 !important;
//}
</style>
