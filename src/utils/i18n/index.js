/**
 * 项目工程多语言配置
 */
import Vue from "vue";
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: sessionStorage.getItem("language") || 'EN-US',
    messages: {
        'en-US': require('./language/en-US'),
        'zh-HK': require('./language/zh-HK'),
    },
    silentTranslationWarn: true,
})
export default i18n;

