import Vue from "vue";
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: 'EN-US',
    messages: {
        'EN-US': require('./language/EN'),
    }
})
export default i18n;

