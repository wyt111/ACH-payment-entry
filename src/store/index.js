import Vue from 'vue'
import Vuex from 'vuex'
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
        emailFromPath: '', //登陆后前往页面地址
        cardInfoFromPath: '', //填写卡信息后返回页面地址
        //返回首页状态
        homeTabstate: 'buyCrypto', //sellCrypto buyCrypto
        tableState: false, //有参数 隐藏买币或者卖币

        //语言
        language: '',

        //买币页面参数
        buyRouterParams: {
            amount: 0,
            getAmount: 0,
            cryptoCurrency: '',
            exchangeRate: 0,
            payCommission: {
                symbol: '',
                code: '',
            },
            network: '',
            networkDefault: '',
            addressDefault: '',
            feeRate: '',
            fixedFee: '',
        },
        //卖币页面参数
        sellRouterParams: {
            amount: '',
            payCommission: {
                fiatCode: '',
            },
            currencyData: {
                name: '',
            }
        },

        feeParams: {}, //卖币费用请求参数
        sellOrderId: '',

        cancelTokenArr: [], //ajax请求队列

        //多语言
        languageValue:'en-US', // EN-US ZH-TW
        LanguageIsShow:false,
        menuState:false,
        isLogin:false,

        //移动端点击logo返回首页
        goHomeState: true,
    },
    mutations: {
        //结束所有请求进程
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
        emptyToken (state) {
            state.cancelTokenArr = []
        },
    }
})

export default store
