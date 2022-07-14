import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/",
    name: 'home',
    component: resolve => require(['../views/initialPage'], resolve),
    redirectTo: '/',
    meta: {
      title: 'Home',
      keepAlive: true,
    }
  },
  //邮箱填写路由
  {
    path: "/emailCode",
    name: 'emailCode',
    component: resolve => require(['../views/emailCode/index.vue'], resolve),
    meta: {
      title: ' ',
      keepAlive: true,
    }
  },
  //验证验证码的路由
  {
    path: "/verifyCode",
    name: 'verifyCode',
    component: resolve => require(['../views/emailCode/children/verifyCode.vue'], resolve),
    meta: {
      title: ' ',
      keepAlive: true,
    }
  },
  //交易历史列表
  {
    path: "/tradeHistory",
    name: 'tradeHistory',
    component: resolve => require(['../views/tradeHistory/index.vue'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_Transactions',
      keepAlive: true,
    }
  },
  //交易历史详情
  {
    path: "/tradeHistory-details",
    name: 'tradeHistory-details',
    component: resolve => require(['../views/tradeHistory/details.vue'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_Transactions_details',
      keepAlive: true,
    }
  },
  {
    path: "/Refund",
    name: 'Refund',
    component: resolve => require(['../views/tradeHistory/refund.vue'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_Refund',
      keepAlive: true,
    }
  },
    //买币路由
  {
    path: "/receivingMode",
    name: 'receivingMode',
    component: resolve => require(['../views/buyCurrency/receivingMode/index.vue'], resolve),
    meta: {
      title: 'nav.routerName_receivingMode',
      keepAlive: true,
    }
  },
  {
    path: "/paymentMethod",
    name: 'paymentMethod',
    component: resolve => require(['../views/buyCurrency/paymentMethod/index.vue'], resolve),
    meta: {
      title: 'nav.routerName_paymentMethod',
      keepAlive: true,
    }
  },
  {
    path: "/basisIdAuth",
    name: 'basisIdAuth',
    component: resolve => require(['../views/buyCurrency/payments/creditCard/basisIdAuth.vue'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_basisIdAuth',
      keepAlive: true,
    },

  },
  {
    path: "/creditCardForm-cardInfo",
    name: 'creditCardForm-cardInfo',
    component: resolve => require(['../views/buyCurrency/payments/creditCard/payForm-cardInfo.vue'], resolve),
    meta: {
      requireAuth: true,
      // fromPage: 'basisIdAuth',
      title: 'nav.routerName_buyForm',
      keepAlive: true,
    }
  },
  {
    path: "/creditCardConfig",
    name: 'creditCardConfig',
    component: resolve => require(['../views/buyCurrency/payments/creditCard/configPayment.vue'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_creditCardConfig',
      keepAlive: true,
    }
  },
  {
    path: "/otherWays-VA",
    name: 'otherWays-VA',
    component: resolve => require(['../views/buyCurrency/payments/otherWays/VAOPM'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_buyPayment',
      keepAlive: false,
    }
  },
  {
    path: "/otherWayPay",
    name: 'otherWayPay',
    component: resolve => require(['../views/buyCurrency/payments/otherWays/indonesian.vue'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_buyOtherWayPay',
      keepAlive: false,
    }
  },
  {
    path: "/paymentResult",
    name: 'paymentResult',
    component: resolve => require(['../views/buyCurrency/paymentResult/index.vue'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_paymentResult',
      keepAlive: true,
    }
  },
    //卖币路由
  {
    path: "/sell-formUserInfo",
    name: 'testForm',
    component: resolve => require(['../views/sellCurrency/cardInfo'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_sellForm',
      keepAlive: true,
    },
  },
  {
    path: "/configSell",
    name: 'configSell',
    component: resolve => require(['../views/sellCurrency/configSell/index.vue'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_configSell',
      keepAlive: true,
    }
  },
  {
    path: "/sellOrder",
    name: "sellOrder",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: resolve => require(['../views/orderState/index.vue'], resolve),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_sellOrder',
      title1:'',
      keepAlive: true,
    }
  },
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
