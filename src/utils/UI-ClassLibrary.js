import Vue from 'vue';

//注册全局组件 - components
import Button from '../components/Button.vue'
Vue.component('Button', Button)

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

