<template>
  <div id="routerMenu">
    <div class="routerMenu_line" @click="goView('/')">
      <div class="lineIcon"><img src="../assets/images/menu/icon1.png"></div>
      <div class="lineName">Buy Crypto</div>
      <div class="lineRight">
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line">
      <div class="lineIcon"><img src="../assets/images/menu/icon2.png"></div>
      <div class="lineName">Sell Crypto</div>
      <div class="lineRight">
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="goView('/tradeHistory')">
      <div class="lineIcon"><img src="../assets/images/menu/icon3.png"></div>
      <div class="lineName">Trade History</div>
      <div class="lineRight">
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line">
      <div class="lineIcon"><img src="../assets/images/menu/icon4.png"></div>
      <div class="lineName">Terms of Service</div>
      <div class="lineRight">
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line">
      <div class="lineIcon"><img src="../assets/images/menu/icon5.png"></div>
      <div class="lineName">Privacy Policy</div>
      <div class="lineRight">
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
    <div class="routerMenu_line" @click="outLogin">
      <div class="lineIcon"><img src="../assets/images/menu/icon6.png"></div>
      <div class="lineName">Log Out</div>
      <div class="lineRight">
        <div class="email">zyfqqq123456@gmail.com</div>
        <div><img src="../assets/images/rightIcon.png"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "routerMenu",
  methods: {
    goView(name){
      this.$router.push(name)
      this.$parent.routerViewState = true;
      this.$parent.menuState = false;
    },
    outLogin(){

    }
  }
}
</script>

<style lang="scss" scoped>
#routerMenu{
  .routerMenu_line{
    display: flex;
    align-items: center;
    margin-top: 0.3rem;
    cursor: pointer;
    .lineIcon{
      display: flex;
      img{
        width: 0.25rem;
      }
    }
    .lineName{
      font-size: 0.16rem;
      font-family: Jost-Medium, Jost;
      font-weight: 500;
      color: #232323;
      margin-left: 0.2rem;
    }
    .lineRight{
      margin-left: auto;
      display: flex;
      align-items: center;
      .email{
        margin-right: 0.3rem;
        font-size: 0.14rem;
        font-family: Jost-Regular, Jost;
        font-weight: 400;
        color: #999999;;
      }
      div{
        display: flex;
      }
      img{
        width: 0.12rem;
      }
    }
    &:nth-of-type(1){
      margin-top: 0.2rem;
    }
  }
}
</style>
