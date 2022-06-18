import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//axios请求
import axios from "./axios/axios";
import api from "./axios/api";

//rem适配
import rem_size from  './utils/rem_size.js';
rem_size();

//注册全局组件 - components
import Button from './components/Button.vue'
Vue.component('Button', Button)
//国际化
import i18n from './utils/i18n/index'

//ui - element
import { Popover,InfiniteScroll,Checkbox } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Popover);
Vue.use(InfiniteScroll);
Vue.use(Checkbox);

//ui - vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
