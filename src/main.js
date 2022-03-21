import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/rem_size.js';

import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

import { AES_Decrypt, AES_Encrypt } from '@/utils/encryp.js';

import axios from "./axios/axios";
import api from "./axios/api";

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.prototype.$encrypt = AES_Encrypt;
Vue.prototype.$decrypt = AES_Decrypt;

// localStorage.setItem("token",'OoxuqjMfT5w1s3Y6EPGhLzn0xiHyrWOjcOQtW7KDoywIMdLDK0BOg8+L6DrGeg0wAGxTpNpWhMCc1JGbOfKBjQ==');
// localStorage.setItem("sign",'nUScnFlw9F/xfrMug41xSNNEEsOCh9tBxn3L+V4AXm8=');
// localStorage.setItem("email",'1003934654@qq.com');

localStorage.setItem("baseUrl",'http://testbuy.alchemypay.cc');
// localStorage.setItem("baseUrl",'http://192.168.110.75:8082');

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
