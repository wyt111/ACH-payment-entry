<template>
  <div id="paymentMethod">
    <div class="paymentMethod-content">
      <!-- 历史支付的方式 -->
      <div class="payMethodsUl" v-if="savedCard.length !== 0">
        <div class="title">Saved payment methods</div>
        <div class="payMethodsLi" :class="{'cardCheck': cardCheck === index}" v-for="(item,index) in savedCard" :key="index" @click="choiseSavedCard(item,index)">
          <div class="payMethodsLi-left">
            <div class="cardIcon">
              <img v-if="item.payWayCode === '10003' || '10001'" src="../../../assets/images/10001-icon.png">
              <img v-if="item.payWayCode === 10004" src="../../../assets/images/10004-icon.png">
              <img v-if="item.payWayCode === 10005" src="../../../assets/images/10005-icon.png">
              <img v-if="item.payWayCode === 10006" src="../../../assets/images/10006-icon.png">
              <img v-if="item.payWayCode === 10008" src="../../../assets/images/10008-icon.png">
            </div>
            <div class="cardInfo">
              <p>{{ item.payWayName }} <span>Ending {{ item.cardNumber.substring(item.cardNumber.length-4) }}</span></p>
              <p>Instant</p>
            </div>
          </div>
          <div class="payMethodsLi-right" v-if="cardCheck === index"><img src="../../../assets/images/cardCheckIcon.png"></div>
        </div>
      </div>
      <!-- 选择新的支付方式 -->
      <div class="payMethodsUl">
        <div class="title">Add a new payment method</div>
        <div class="payMethodsLi" :class="{'cardCheck': paymethodCheck === index}" v-for="(item,index) in paymethodList" :key="index" @click="choisePayMethods(item,index)">
          <div class="payMethodsLi-left">
            <div class="cardIcon">
              <img v-if="item.payWayCode === '10004'" src="../../../assets/images/10004-icon.png">
              <img v-else-if="item.payWayCode === '10005'" src="../../../assets/images/10005-icon.png">
              <img v-else-if="item.payWayCode === '10006'" src="../../../assets/images/10006-icon.png">
              <img v-else-if="item.payWayCode === '10008'" src="../../../assets/images/10008-icon.png">
              <img v-else-if="item.payWayCode === '10003' || '10001'" src="../../../assets/images/10001-icon.png">
            </div>
            <div class="cardInfo">
              <p>{{ item.payWayName }}</p>
              <p>Instant</p>
            </div>
          </div>
          <div class="payMethodsLi-right">
            <img src="../../../assets/images/addCardIcon.png" v-if="paymethodCheck==='' || paymethodCheck !== index">
            <img src="../../../assets/images/cardCheckIcon.png" v-else>
          </div>
        </div>
      </div>
      <IncludedDetails class="IncludedDetails" :showState="false" :titleStatus="true"/>
    </div>
    <button class="continue" :disabled="disabled" @click="confirm">Continue</button>
  </div>
</template>

<script>
import IncludedDetails from "@/components/IncludedDetails.vue";
import {querySubmitToken} from "../../../utils/publicRequest";
import { AES_Decrypt,AES_Encrypt } from "../../../utils/encryp";

export default {
  name: "paymentMethod",
  components: { IncludedDetails },
  data(){
    return{
      routerParams: {},
      buyParams: {},

      cardCheck: '',
      savedCard: [],

      paymethodCheck: '',
      paymethodList: [],

      //全部历史交易记录
      userPayment: {},

      payMethod: {},
    }
  },
  computed: {
    disabled(){
      if(JSON.stringify(this.payMethod) === '{}' && this.paymethodCheck === ''){
        return true;
      }else{
        return false;
      }
    }
  },
  // beforeRouteEnter(to,from,next){
  //   next(vm => {
  //     if(to.path === '/paymentMethod' && from.path === '/receivingMode'){
  //       console.log(vm)
  //       vm.InitializationData();
  //     }
  //   })
  // },
  mounted(){
    // this.InitializationData();
  },
  activated() {
    this.InitializationData();
    // console.log(this.paymethodList,'---this.paymethodList')
  },
  methods: {
    async InitializationData(){
      this.routerParams = JSON.parse(this.$route.query.routerParams);
      this.cardCheck = '';
      this.savedCard = [];
      this.paymethodCheck = '';
      this.paymethodList = [];
      this.payMethod = {};
      await this.queryPayMethods();
    },
    async queryPayMethods(){
      // let _this = this;
      await this.$axios.get(this.$api.get_payMethods + this.routerParams.payCommission.code,'').then(res=>{
        if(res){
          //存储货币支持的支付方式
          this.$nextTick(()=>{
            this.paymethodList = res.data.fiatPayment;
            this.userPayment = res.data.userPayment;
            this.savedCard = [];
            //处理历史交易方式 - 匹配货币支持的支付方式,添加payWayCode、payWayName
            Object.keys(res.data.userPayment).forEach(item=>{
              res.data.userPayment[item].forEach((item2,index2)=>{
                res.data.userPayment[item][index2].cardNumber = AES_Decrypt(item2.cardNumber);
                console.log(res.data.userPayment[item][index2].cardNumber,"-----AES_Decrypt(item2.cardNumber)")
                this.paymethodList.forEach(item3=>{
                  if(item === item3.payWayCode){
                    res.data.userPayment[item][index2].payWayCode = item3.payWayCode;
                    res.data.userPayment[item][index2].payWayName = item3.payWayName;
                    this.savedCard.push(item2);
                  }
                })
              })
            });
            //只有10001放开历史卡信息功能 - 筛选10001信息
            this.savedCard = this.savedCard.filter(item=>{
              return item.payWayCode === '10001';
            })
            //只有信用卡开放历史卡信息功能
            this.savedCard.length !== 0 ? this.choiseSavedCard(this.savedCard[0],0) : '';
            this.$forceUpdate();
          })
        }
      })
    },

    //选择历史支付方式
    choiseSavedCard(item,index){
      this.cardCheck = index;
      this.paymethodCheck = "";
      this.payMethod = item;
    },

    //选择支付方式
    choisePayMethods(item,index){
      this.paymethodCheck = index;
      this.cardCheck = "";
      this.payMethod = item;
    },

    //确认支付方式
    async confirm(){
      let submitToken = await querySubmitToken();
      if(submitToken === true){
        //确认下单 获取订单id
        this.buyParams = JSON.parse(this.$route.query.placeOrderQuery);
        this.buyParams.payWayCode = this.payMethod.payWayCode;
        this.$axios.post(this.$api.post_buy,this.buyParams,'submitToken').then(res=>{
          if(res && res.returnMsg === 'SUCCESS'){
            let oldRouterQuery = JSON.parse(this.$route.query.routerParams);
            let newRouterQuery = {
              orderNo: res.data.orderNo,
              kyc: res.data.kyc,
              userCardId: res.data.userCardId,
              submitForm: res.data,
              payWayCode: this.payMethod.payWayCode,
              payWayName: this.payMethod.payWayName,
            };
            newRouterQuery = {...newRouterQuery,...oldRouterQuery};
            this.routerParams = newRouterQuery;
            this.JumpRouter();
          }
        })
      }
    },

    //根据支付方式 控制跳转路径
    JumpRouter(){
      //选择历史支付
      if(this.cardCheck !== '' && this.payMethod.payWayCode === '10001'){
        this.payMethod.cardNumber = AES_Encrypt(this.payMethod.cardNumber);
        this.$router.push(`/creditCardConfig?routerParams=${JSON.stringify(this.routerParams)}&submitForm=${JSON.stringify(this.payMethod)}&configPaymentFrom=userPayment`);
        return;
      }
      if(this.cardCheck !== '' && (this.payMethod.payWayCode === '10003' || '10008')){
        this.$router.push(`/otherWays-VA?routerParams=${JSON.stringify(this.routerParams)}&payMethod=${JSON.stringify(this.payMethod)}`);
        return;
      }
      if(this.cardCheck !== '' && (this.payMethod.payWayCode === '10004' || '10005' || '10006')){
        this.$router.push(`/otherWayPay?routerParams=${JSON.stringify(this.routerParams)}&payMethod=${JSON.stringify(this.payMethod)}`);
        return;
      }

      //选择新填写支付方式
      if(this.paymethodCheck !== '' && this.payMethod.payWayCode === '10001'){ //USD
        // this.$router.push(`/creditCardForm-address?routerParams=${JSON.stringify(this.routerParams)}`);
        this.$router.push(`/creditCardForm-cardInfo?routerParams=${JSON.stringify(this.routerParams)}`);
        return;
      }
      if(this.paymethodCheck !== ''  && this.payMethod.payWayCode !== '10001'){ //IDR | 10008
        if(this.payMethod.payWayCode === '10003' || this.payMethod.payWayCode === '10008'){
          // sessionStorage.removeItem("indonesiaPayment")
          this.$router.push(`/otherWays-VA?routerParams=${JSON.stringify(this.routerParams)}`);
          return;
        }
        if(this.payMethod.payWayCode === '10004' || this.payMethod.payWayCode === '10005' || this.payMethod.payWayCode === '10006'){ //QRIS DANA OVO
          this.$router.push(`/otherWayPay?routerParams=${JSON.stringify(this.routerParams)}`);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#paymentMethod{
  display: flex;
  flex-direction: column;
  .paymentMethod-content{
    flex: 1;
    overflow: auto;
    .payMethodsUl{
      margin-top: 0.2rem;
      .title{
        font-size: 0.14rem;
        font-weight: 500;
        color: #232323;
      }
      .payMethodsLi{
        min-height: 0.6rem;
        background: #FFFFFF;
        border-radius: 0.1rem;
        border: 1px solid #C7C7C7;
        display: flex;
        align-items: center;
        padding: 0 0.21rem;
        margin-top: 0.1rem;
        cursor: pointer;
        .payMethodsLi-left{
          display: flex;
          justify-content: center;
          align-items: center;
          .cardIcon{
            display: flex;
            min-width: 0.24rem;
            img{
              width: 0.24rem;
            }
          }
          .cardInfo{
            font-size: 0.16rem;
            font-weight: 500;
            color: #232323;
            margin-left: 0.2rem;
            span{
              font-size: 0.15rem;
              font-weight: 500;
              color: #999999;
              margin-left: 0.1rem;
            }
            p:last-child{
              font-size: 0.14rem;
              font-weight: 400;
              color: #999999;
            }
          }
        }
        .payMethodsLi-right{
          margin-left: auto;
          display: flex;
          img{
            width: 0.14rem;
          }
        }
      }
      .cardCheck{
        border: 1px solid #4479D9;
      }
      &:nth-of-type(2){
        margin-bottom: 0.4rem;
      }
    }
  }
  .continue{
    margin-top: 0.15rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 0.6rem;
    background: #4479D9;
    border-radius: 4px;
    font-size: 0.18rem;
    font-weight: 500;
    font-family: 'Jost', sans-serif;
    color: #FAFAFA;
    border: none;
    cursor: pointer;
    i{
      font-size: 0.24rem;
      position: absolute;
      right: 0.4rem;
    }
  }
  .continue:disabled{
    background: rgba(68, 121, 217, 0.5) !important;
  }
}
.IncludedDetails{
  margin-top: 0.4rem;
}
</style>
