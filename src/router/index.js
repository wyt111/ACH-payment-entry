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
    component: Home,
    meta: {
      title: 'Home'
    }
  },
  {
    path: "/emailCode",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/emailCode/index.vue"),
    meta: {
      title: 'Enter Email Address'
    }
  },
  {
    path: "/tradeHistory",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/tradeHistory/index.vue"),
    meta: {
      requireAuth: true,
      title: 'Trade History'
    }
  },
    //买币路由
  {
    path: "/receivingMode",
    name: '',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/receivingMode/index.vue"),
    meta: {
      title: 'Receive coins'
    }
  },
  {
    path: "/paymentMethod",
    name: '',
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/paymentMethod/index.vue"),
    meta: {
      title: 'Choose payment method'
    }
  },
  {
    path: "/basisIdAuth",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/creditCard/basisIdAuth.vue"),
    meta: {
      requireAuth: true,
      title: 'basis-Id-Auth'
    },

  },
  {
    path: "/creditCardForm-address",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/creditCard/payForm-address.vue"),
    meta: {
      requireAuth: true,
      fromPage: 'basisIdAuth',
      title: 'Enter card billing address'
    }
  },
  {
    path: "/creditCardForm-cardInfo",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/creditCard/payForm-cardInfo.vue"),
    meta: {
      requireAuth: true,
      fromPage: 'basisIdAuth',
      title: 'Enter card details'
    }
  },
  {
    path: "/creditCardConfig",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/creditCard/configPayment.vue"),
    meta: {
      requireAuth: true,
      title: 'Confirm Payment'
    }
  },
  {
    path: "/otherWays-VA",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/otherWays/VAOPM"),
    meta: {
      requireAuth: true,
      title: 'Payment'
    }
  },
  {
    path: "/otherWayPay",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/payments/otherWays/indonesian.vue"),
    meta: {
      requireAuth: true,
      title: 'Confirm Payment'
    }
  },
  {
    path: "/paymentResult",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/buyCurrency/paymentResult/index.vue"),
    meta: {
      requireAuth: true,
      title: 'Payment Result'
    }
  },
    //卖币路由
  {
    path: "/sell-formUserInfo",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/sellCurrency/cardInfo/formUserInfo.vue"),
    meta: {
      requireAuth: true,
      title: 'Enter Information'
    }
  },
  {
    path: "/sell-formAddress",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/sellCurrency/cardInfo/formAddress.vue"),
    meta: {
      requireAuth: true,
      title: 'Enter card billing address'
    }
  },
  {
    path: "/sell-formBankInfo",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/sellCurrency/cardInfo/formBankInfo.vue"),
    meta: {
      requireAuth: true,
      title: 'Enter card details',
      goPath: 'configSell',
    }
  },
  {
    path: "/configSell",
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/sellCurrency/configSell/index.vue"),
    meta: {
      requireAuth: true,
      title: 'Confirm'
    }
  },
  {
    path: "/sellOrder",
    name: "order",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/orderState/index.vue"),
    meta: {requireAuth: true,title: 'Order'}
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
