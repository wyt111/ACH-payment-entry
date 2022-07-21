<template>
  <div class="Language-container">
    <div class="Language_title" @click="$store.state.LanguageIsShow = false"><img src="../assets/images/goBack.png" alt="">{{ $t('nav.menu_language') }}</div>
    <div class="Language_line" v-for="item in languageList" :key="item.name" @click="choiseItem(item)">
      <div class="Language_line_left">
        <img :src="item.icon" alt="">
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
        {name: 'English(US)',value: 'en-US',icon: require('@/assets/images/slices/English(US).png'),state: true},
        {name: '繁體中文',value: 'zh-HK',icon: require('@/assets/images/slices/CHN.png'),state: false},
      ],
    }
  },
  methods:{
    choiseItem(item){
      this.$store.state.languageValue = item.value
      sessionStorage.setItem("language",item.value)
      i18n.locale = item.value
      this.$store.state.LanguageIsShow = false
    }
  }
}
</script>
<style lang="scss" scoped>

.Language-container{
  width: 95%;
  height: calc(100%);
  // height: 100%;
  background: #fff;
  position: absolute;
  // top: .65rem;
  padding-right: .1rem;
  .Language_title{
    width: 100%;
    display: flex;
    align-items: center;
    
    cursor: pointer;
    img{
      height: .17rem;
      margin-right: .1rem;
    }
    color:#063376;
    font-size: .18rem;
    font-weight: normal;
    font-family: SFProDisplaybold;
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
        font-size: .16rem;
        font-family: SFProDisplayRegular;
        font-weight: normal;
        color: #949EA4;
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
@media only screen and (min-width: 768px) {
.Language-container{
  width: 95%;
  height: 100%;
  // height: 100%;
  padding: .4rem .35rem 0 0;
  background: #fff;
  // position: right: ;;
  // top: .8rem;
  position: absolute;
  top: 0;
  // padding-right: .1rem;
  }
}
</style>
