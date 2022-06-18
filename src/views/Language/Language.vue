<template>
  <div class="Language-container">
    <div class="Language_line" v-for="item in languageList" :key="item.name" @click="choiseItem(item)">
      <div class="Language_line_left">
        <img src="@/assets/images/slices/English(US).png" alt="">
        <p>{{ item.name }}</p>
      </div>
      <img src="@/assets/images/slices/right_icon.png" alt="">
    </div>
    
  </div>
</template>
<script>
import i18n from "@/utils/i18n";
export default {
  name:'Language',
  data(){
    return {
      languageList: [
        {name: 'English(US)',value: 'EN-US',state: true},
      ],
    }
  },
  methods:{
    choiseItem(item){
      this.$store.state.languageValue = item.value
     i18n.locale = item.value
     this.$router.go(-1)
    }
  }
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
    margin-top: .2rem;
    cursor: pointer;
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