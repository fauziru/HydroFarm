import Vue from 'vue'
import VueRouter from 'vue-router'
import SignIn from '../views/SignIn.vue'
import Store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: SignIn,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true, bottomNav: true }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/Account.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/activity',
    name: 'activity',
    component: () => import('../views/Activity.vue'),
    meta: { requiresAuth: true, bottomNav: true }
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: () => import('../views/Schedule.vue'),
    meta: { requiresAuth: true, bottomNav: true }
  },
  {
    path: '/notification',
    name: 'notification',
    component: () => import('../views/Notification.vue'),
    meta: { requiresAuth: true, backButton: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  console.log('login dulu', Store.state.auth.isLoggedin)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!Store.state.auth.isLoggedin) {
      next({
        name: 'login'
      })
    } else {
      next()
    }
  } else {
    if (Store.state.auth.isLoggedin) {
      next({
        name: 'dashboard'
      })
    } else {
      next()
    }
  }
})

export default router
