<template>
  <div class="Language-container">
    <div class="Language_title" @click="$store.state.LanguageIsShow = false"><img src="../assets/images/backIcon.png" alt="">Language</div>
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
     this.$store.state.LanguageIsShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
.Language-container{
  width: 95%;
  height: calc(100% - .8rem);
  // height: 100%;
  background: #fff;
  // position: right: ;;
  // top: .8rem;
  position: absolute;
  top: .8rem;
  z-index: 20;
  padding-right: .1rem;
  .Language_title{
    width: 100%;
    display: flex;
    align-items: center;
    img{
      height: .17rem;
      margin-right: .1rem;
    }
    font-size: .21rem;
    font-family: GeoDemibold;
    font-weight: normal;
    color: #232323;
  }
  .Language_line{
    width: 100%;
    height: .4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: .28rem;
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