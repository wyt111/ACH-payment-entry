<template>
  <div id="indonesianPayment">
    <iframe :src="webUrl" loading="lazy" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: "Indonesian payment",
  data(){
    return{
      webUrl: "",
      timeDown: null,
    }
  },
  mounted() {
    this.webUrl = JSON.parse(this.$route.query.routerParams).webUrl;
    this.orderStatus();
    this.timeDown = setInterval(()=>{
      this.orderStatus();
    },1000)
  },
  destroyed(){
    clearInterval(this.timeDown);
  },
  methods: {
    orderStatus(){
      let params = {
        "orderNo": JSON.parse(this.$route.query.routerParams).orderNo
      }
      this.$axios.get(this.$api.get_payResult,params).then(res=> {
        if (res.data.orderStatus && res.data.orderStatus !== 0) {
          // Clear create order token
          localStorage.removeItem("submit-token");
          // this.$router.push(`/paymentReSult?routerParams=${this.$route.query.routerParams}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
html,body,#indonesianPayment,iframe{
  width: 100%;
  height: 100%;
}
</style>
