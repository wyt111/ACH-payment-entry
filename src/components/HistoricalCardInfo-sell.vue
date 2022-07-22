<template>
  <div id="HistoricalCardInfo">
    <van-popup v-model="show" get-container="#App">
      <div class="content">
        <div class="cardView">
          <div class="line1">
            <div class="line1-left">HSBC</div>
            <div class="line1-right"><span>****</span>3683</div>
          </div>
          <div class="line2">Sharon Wang</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "HistoricalCardInfo-sell",
  data(){
    return{
      show: true,
    }
  }

}
</script>

<style lang="scss" scoped>
#HistoricalCardInfo{
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  //background: rgba(0, 0, 0, 0.15);
  .content{
    margin: 1.54rem auto;
    width: 3.45rem;
    height: 4.19rem;
    background: #FFFFFF;
    border-radius: 0.18rem;
    padding: 0.32rem 0.16rem;
    .cardView{
      width: 100%;
      height: 0.83rem;
      background: #FFF4DE;
      border: 1px solid #FBE3B6;
      border-radius: 0.06rem;
      .line1{
        display: flex;
        .right{
          margin-left: auto;
          font-family: 'SF Pro Display';
          font-style: normal;
          font-weight: 600;
          font-size: 0.16rem;
          text-align: center;
          color: #8A5B00;
        }
      }
    }
  }
}
</style>
<style>
/*ui - 遮罩层样式修改*/
.van-overlay{
  border-radius: 0 !important;
}
</style>
