<template>
  <div id="configSell">
    <div class="configSell-content">
      <div class="bankCardInfo">
        <div class="bankCardInfo-title">Bank Card</div>
        <div class="bankCardInfo-view">
          <div class="bankCardInfo-view-left">
            <div>Taiwan Business Bank,Sydney Branch</div>
            <div>John Tan <span>1234 **** **** 1234</span></div>
          </div>
          <div class="bankCardInfo-view-right"><img src="../../../assets/images/rightIcon.png" alt=""></div>
        </div>
      </div>
      <IncludedDetails class="includedDetails-view" :showState="true" :titleStatus="false"/>
    </div>
    <Button :buttonData="buttonData" :disabled="false" @click.native="submit">Confirm</Button>
  </div>
</template>

<script>
import IncludedDetails from '../../../components/IncludedDetails';
import Button from '../../../components/Button';

export default {
  name: "index",
  components: { IncludedDetails, Button },
  data(){
    return{
      //按钮状态
      buttonData: {
        loading: false,
        triggerNum: 0,
        customName: true,
      },
    }
  },
  methods: {
    submit(){
      if(this.buttonData.triggerNum === 1){

      }
    }
  }
}
</script>

<style lang="scss" scoped>
#configSell{
  display: flex;
  flex-direction: column;
  .configSell-content{
    flex: 1;
    overflow: auto;
  }
  .bankCardInfo{
    font-size: 0.14rem;
    font-weight: 500;
    color: #232323;
    margin-top: 0.2rem;
    .bankCardInfo-view{
      margin-top: 0.1rem;
      min-height: 1rem;
      background: #F3F4F5;
      border-radius: 0.1rem;
      display: flex;
      padding: 0.21rem 0.2rem;
      cursor: pointer;
      .bankCardInfo-view-left{
        font-size: 0.16rem;
        font-weight: bold;
        color: #232323;
        div:last-child{
          margin-top: 0.1rem;
          font-size: 0.16rem;
          font-weight: 400;
          color: #999999;
          span{
            margin-left: 0.4rem;
          }
        }
      }
      .bankCardInfo-view-right{
        margin-left: auto;
        display: flex;
        align-items: center;
        img{
          width: 0.12rem;
        }
      }
    }
  }
  .includedDetails-view{
    margin-top: 0.4rem;
  }
}
</style>
