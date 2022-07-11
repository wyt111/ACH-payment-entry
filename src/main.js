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
import 'element-ui/lib/theme-chalk/index.css';
import { Popover,InfiniteScroll,Checkbox } from 'element-ui';
Vue.use(Popover);
Vue.use(InfiniteScroll);
Vue.use(Checkbox);

//ui - vant
import 'vant/lib/index.css';
import { Icon,Loading,Field,Popup,List } from 'vant';
Vue.use(List);
Vue.use(Popup);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Loading);

//阿里云接口埋点
if(process.env.NODE_ENV !== 'development'){
  const BrowserLogger = require('alife-logger');
  const __bl = BrowserLogger.singleton({
    pid: process.env.VUE_APP_Aliyun_pid,
    imgUrl: 'https://arms-retcode.aliyuncs.com/r.png?',
    enableLinkTrace:true,
    behavior:true
  });
}

//fingerprint - 设备指纹 ｜ 设备唯一id
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load({
  apiKey: 'tj43GDmCqsLyYSJYmaMc'
})
// Get the visitor identifier when you need it.
fpPromise.then(fp => fp.get()).then(result => {
  window.localStorage.setItem("fingerprint_id",result.visitorId);
});

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
