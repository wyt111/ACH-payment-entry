import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from "./axios/axios";
import api from "./axios/api";

import rem_size from  './utils/rem_size.js';
rem_size();

//components
// 注册全局组件
import Button from './components/Button.vue'
Vue.component('Button', Button)

import { Popover,InfiniteScroll } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Popover);
Vue.use(InfiniteScroll);

import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
