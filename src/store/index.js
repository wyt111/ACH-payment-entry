import Vue from 'vue'
import Vuex from 'vuex'
// import getters from './getters'
Vue.use(Vuex)

//
// // https://webpack.js.org/guides/dependency-management/#requirecontext
// const modulesFiles = require.context('./modules', true, /\.js$/)
//
// // you do not need `import app from './modules/app'`
// // it will auto require all vuex module from modules file
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   // set './app.js' => 'app'
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})
//
const store = new Vuex.Store({
  // modules,
  // getters
    state: {
        emailFromPath: '',
        cardInfoFromPath: '',
        //返回首页状态
        homeTabstate: 'buyCrypto', //sellCrypto buyCrypto

        buyRouterParams: {},
        sellRouterParams: {},

        feeParams: {},
        sellOrderId: '',

        cancelTokenArr: [],
        //多语言
        languageValue:'EN-US',
        LanguageIsShow:false,
        isLogin:false
    },
    mutations: {
        pushToken (state, payload) {
            state.cancelTokenArr.push(payload.cancelToken)
        },
        clearToken ({ cancelTokenArr }) {
            cancelTokenArr.forEach(item => {
                if(item){
                    item('路由跳转取消请求')
                }
            })
            cancelTokenArr = []
        },
        emptyToken (state, payload) {
            state.cancelTokenArr = []
        }
    }
})

export default store
