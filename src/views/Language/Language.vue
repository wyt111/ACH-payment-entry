<template>
  <div class="Language-container">
    <div class="Language_line">
      <div class="Language_line_left">
        <img src="@/assets/images/slices/English(US).png" alt="">
        <p>English(US)</p>
      </div>
      <img src="@/assets/images/slices/right_icon.png" alt="">
    </div>
    
  </div>
</template>
<script>
export default {
  name:'Language'
}
</script>
<style lang="scss" scoped>
.Language-container{
  .Language_line{
    width: 100%;
    height: .4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .Language_line_left{
      display: flex;
      align-items: center;
      p{
        font-size: 16px;
        font-family: GeoRegular;
        font-weight: normal;
        color: #232323;
        margin-left: .1rem;
      }
      img{
        width: .36rem;
        height: .36rem;
      }
    }
    >img{
      height: .25rem;
    }
  }
}
</style>