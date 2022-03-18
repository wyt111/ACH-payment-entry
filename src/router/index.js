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
    name: "Home",
    component: Home,
  },
  {
    path: "/emailCode",
    name: "Enter Email Address",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/emailCode/index.vue"),
  },
  {
    path: "/receiveCoins",
    name: "Receive coins",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/receiveCoins/index.vue"),
    // meta: {requireAuth: true}
  },
  {
    path: "/basisIdAuth",
    name: "basis-Id-Auth",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/receiveCoins/internationalCardPay/basisIdAuth.vue"),
    meta: {requireAuth: true}
  },
  {
    path: "/internationalCardPay",
    name: "International-card-payment",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/receiveCoins/internationalCardPay/index.vue"),
    meta: {requireAuth: true}
  },
  {
    path: "/indonesianPayment",
    name: "Indonesian payment",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/receiveCoins/indonesianPayment/index.vue"),
    meta: {requireAuth: true}
  },
  {
    path: "/paymentReSult",
    name: "Payment ReSult",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/paymentResult/index.vue"),
    meta: {requireAuth: true}
  },
  {
    path: "/tradeHistory",
    name: "Trade History",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
        import(/* webpackChunkName: "about" */ "../views/tradeHistory/index.vue"),
    meta: {requireAuth: true}
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
