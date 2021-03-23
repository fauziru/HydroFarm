/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import './filters/filter'
import router from './router'
import store from './store'
import axios from './plugins/vueaxios'
import vuetify from './plugins/vuetify'
import vuelidate from './plugins/vuelidate'
import vueapexcharts from './plugins/vueapexcharts'
import './registerServiceWorker'
import Echo from 'laravel-echo'

window.Pusher = require('pusher-js')
// set echo and pusher
console.log('main', store.state.auth.access_token)
window.Echo = new Echo({
  authEndpoint: process.env.VUE_APP_API_ROOT + 'broadcasting/auth',
  broadcaster: 'pusher',
  key: process.env.VUE_APP_PUSHER_APP_KEY,
  cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
  disableStats: false,
  forceTLS: false,
  encrypted: false,
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        axios.post(process.env.VUE_APP_API_ROOT + 'api/v1/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name
        })
          .then(response => {
            callback(false, response.data)
          })
          .catch(error => {
            callback(true, error)
          })
      }
    }
  }
  //  wsPort: 6001,
  //  wssPort: 6001,
  //  enableTransport:['ws']
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  axios,
  vuelidate,
  vueapexcharts,
  render: h => h(App)
}).$mount('#app')
