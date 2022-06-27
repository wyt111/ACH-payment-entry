import Vue from 'vue'
import Router from 'vue-router'
import Home from "../views/initialPage";

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
    component: Home,
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
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/emailCode/index.vue"),
    meta: {
      title: 'nav.routerName_email',
      keepAlive: true,
    }
  },
  //验证验证码的路由
  {
    path: "/verifyCode",
    name: 'verifyCode',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/emailCode/children/verifyCode"),
    meta: {
      title: 'nav.routerName_emailCode',
      keepAlive: true,
    }
  },
  //切换语言的路由
  {
    path: "/tradeHistory",
    name: 'tradeHistory',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/tradeHistory/index.vue"),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_Transactions',
      keepAlive: true,
    }
  },
    //买币路由
  {
    path: "/receivingMode",
    name: 'receivingMode',
    component: () => import(/* webpackChunkName: "about" */ "../views/buyCurrency/receivingMode/index.vue"),
    meta: {
      title: 'nav.routerName_receivingMode',
      keepAlive: true,
    }
  },
  {
    path: "/paymentMethod",
    name: 'paymentMethod',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/paymentMethod/index.vue"),
    meta: {
      title: 'nav.routerName_paymentMethod',
      keepAlive: true,
    }
  },
  {
    path: "/basisIdAuth",
    name: 'basisIdAuth',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/creditCard/basisIdAuth.vue"),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_basisIdAuth',
      keepAlive: true,
    },

  },
  {
    path: "/creditCardForm-address",
    name: 'creditCardForm-address',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/creditCard/payForm-address.vue"),
    meta: {
      requireAuth: true,
      // fromPage: 'basisIdAuth',
      title: 'nav.routerName_buyForm',
      keepAlive: true,
    }
  },
  {
    path: "/creditCardForm-cardInfo",
    name: 'creditCardForm-cardInfo',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/creditCard/payForm-cardInfo.vue"),
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
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/creditCard/configPayment.vue"),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_creditCardConfig',
      keepAlive: true,
    }
  },
  {
    path: "/otherWays-VA",
    name: 'otherWays-VA',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/otherWays/VAOPM"),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_buyPayment',
      keepAlive: false,
    }
  },
  {
    path: "/otherWayPay",
    name: 'otherWayPay',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/otherWays/indonesian.vue"),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_buyOtherWayPay',
      keepAlive: false,
    }
  },
  {
    path: "/paymentResult",
    name: 'paymentResult',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/paymentResult/index.vue"),
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
    component: () => import(/* webpackChunkName: "about" */ "../views/sellCurrency/cardInfo/testForm.vue"),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_sellForm',
      keepAlive: true,
    },
  },
  // {
  //   path: "/sell-formUserInfo",
  //   name: 'sell-formUserInfo',
  //   component: () => import(/* webpackChunkName: "about" */ "../views/sellCurrency/cardInfo/formUserInfo.vue"),
  //   meta: {
  //     requireAuth: true,
  //     title: 'Enter Information',
  //     keepAlive: true,
  //   },
  // },
  // {
  //   path: "/sell-formAddress",
  //   name: 'sell-formAddress',
  //   component: () =>
  //       import(/* webpackChunkName: "about" */ "../views/sellCurrency/cardInfo/formAddress.vue"),
  //   meta: {
  //     requireAuth: true,
  //     title: 'Enter personal address',
  //     keepAlive: true,
  //   }
  // },
  // {
  //   path: "/sell-formBankInfo",
  //   name: 'sell-formBankInfo',
  //   component: () =>
  //       import(/* webpackChunkName: "about" */ "../views/sellCurrency/cardInfo/formBankInfo.vue"),
  //   meta: {
  //     requireAuth: true,
  //     title: 'Enter card details',
  //     goPath: 'configSell',
  //     keepAlive: true,
  //   }
  // },
  {
    path: "/configSell",
    name: 'configSell',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/sellCurrency/configSell/index.vue"),
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
    component: () => import(/* webpackChunkName: "about" */ "../views/orderState/index.vue"),
    meta: {
      requireAuth: true,
      title: 'nav.routerName_sellOrder',
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
