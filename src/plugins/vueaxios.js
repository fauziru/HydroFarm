import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '../store'
import router from '../router'

Vue.use(VueAxios, axios)

axios.defaults.baseURL = process.env.VUE_APP_API_BASE

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // Check your token for validity, and if needed, refresh the token / force re-login etc.
    const token = store.state.auth.access_token
    console.log('on request axios', token)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(undefined, function (error) {
  console.log('on response error axios', error.response.status)
  const IGNORED_PATHS = ['/login', '/logout', '/refresh']
  return new Promise(() => {
    const isIgnored = IGNORED_PATHS.some(path =>
      error.config.url.includes(path)
    )
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config.__isRetryRequest &&
      !isIgnored
    ) {
      store.commit('auth/LOGOUT', true)
      router.push({ name: 'login' })
    }
    throw error
  })
})

export default axios
