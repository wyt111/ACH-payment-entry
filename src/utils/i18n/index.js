import Vue from "vue";
import VueI18n from 'vue-i18n'
import store from '../../store/index';

console.log(store.state.languageValue)

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: sessionStorage.getItem("language") ? sessionStorage.getItem("language") : 'EN-US',
    messages: {
        'EN-US': require('./language/EN'),
        'ZH-TW': require('./language/ZH-TW'),
    }
})
export default i18n;

