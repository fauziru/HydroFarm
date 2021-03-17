import Vue from 'vue'
import Vuex, { createLogger } from 'vuex'
import auth from './auth'
import layout from './layout'
import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const debug = process.env.VUE_APP_NODE_ENV !== 'production'

const state = createPersistedState({
  key: 'authstate',
  paths: ['auth'],
  storage: {
    getItem: key => Cookies.get(key),
    setItem: (key, value) =>
      Cookies.set(key, value, { expires: 1, secure: !debug }),
    removeItem: key => Cookies.remove(key)
  }
})

export default new Vuex.Store({
  modules: {
    layout,
    auth
  },
  strict: debug,
  plugins: debug ? [createLogger(), state] : [state]
})
