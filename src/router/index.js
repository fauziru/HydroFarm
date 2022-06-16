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
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: () => import('../views/Home.vue'),
  //   meta: { requiresAuth: true, bottomNav: true }
  // },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/Account.vue'),
    meta: { requiresAuth: true, backButton: true }
  },
  {
    path: '/activity',
    name: 'activity',
    component: () => import('../views/Notification.vue'),
    meta: { requiresAuth: true, bottomNav: true, activity: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Field.vue'),
    meta: { requiresAuth: true, bottomNav: true },
    children: [{
      path: ':id',
      name: 'node detail',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true, backButton: true }
    }]
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
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../views/Settings/index.vue'),
    meta: { requiresAuth: true, backButton: true, bottomNav: true, requiresAdmin: true }
  },
  {
    path: '/setting/layout',
    name: 'layout sensor',
    component: () => import('../views/Settings/LayoutSensor/index.vue'),
    meta: { requiresAuth: true, backButton: true, requiresAdmin: true }
  },
  {
    path: '/setting/registrasikey',
    name: 'registrasi key',
    component: () => import('../views/Settings/RegistrasiKey.vue'),
    meta: { requiresAuth: true, backButton: true, requiresAdmin: true }
  },
  {
    path: '/setting/apikey',
    name: 'api key',
    component: () => import('../views/Settings/APIKey.vue'),
    meta: { requiresAuth: true, backButton: true, requiresAdmin: true }
  },
  {
    path: '/setting/about',
    name: 'about',
    component: () => import('../views/Settings/About.vue'),
    meta: { requiresAuth: true, backButton: true, requiresAdmin: true }
  },
  {
    path: '/sensor',
    name: 'sensor',
    component: () => import('../views/Sensor.vue'),
    meta: { requiresAuth: true, backButton: true },
    children: [{
      path: ':id',
      name: 'sensor detail',
      component: () => import('../views/SensorDetail.vue'),
      meta: { requiresAuth: true, backButton: true }
    }]
  },
  {
    path: '/node',
    name: 'node',
    component: () => import('../views/Node.vue'),
    meta: { requiresAuth: true, backButton: true, requiresAdmin: true }
    // children: [{
    //   path: ':id',
    //   name: 'sensor detail',
    //   component: () => import('../views/SensorDetail.vue'),
    //   meta: { requiresAuth: true, backButton: true, requiresAdmin: true }
    // }]
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/User.vue'),
    meta: { requiresAuth: true, backButton: true, requiresAdmin: true }
    // children: [{
    //   path: ':id',
    //   name: 'user detail',
    //   component: () => import('../views/UserDetail.vue'),
    //   meta: { requiresAuth: true, backButton: true }
    // }]
  },
  {
    path: '/offline',
    name: 'offline',
    component: () => import('../views/Offline.vue'),
    meta: { requiresAuth: true, isOffline: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // middlware offline
  console.log('is offline middleware', Store.state.layout.isOffline)
  if (to.matched.some(record => record.meta.isOffline)) {
    if (Store.state.layout.isOffline) {
      console.log('go to offline page')
      next()
    } else {
      // back
      console.log('back')
      next({ name: 'dashboard' })
    }
  }
  // middleware auth
  console.log('login middleware', Store.state.auth.isLoggedin)
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
  // middleware admin
  if (to.matched.some(record => record.meta.requiresAdmin) && Store.state.auth.user) {
    console.log('admin middleware', Store.state.auth.user.role)
    if (Store.state.auth.user.role !== 'admin') {
      console.log('u are not admin')
      Store.dispatch('layout/alertFire', {
        type: 'error',
        message: 'Akses dibatasi, anda bukan admin!'
      })
      next({
        name: 'dashboard'
      })
    } else {
      next()
    }
  }
})

export default router
