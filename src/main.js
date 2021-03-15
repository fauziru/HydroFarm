import Vue from "vue";
import App from "./App.vue";
// import Axios from "axios";
import "./registerServiceWorker";
import "./filters/filter";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import vuelidate from "./plugins/vuelidate";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import Echo from "laravel-echo";

window.Pusher = require("pusher-js");
// set echo and pusher
window.Echo = new Echo({
  broadcaster: "pusher",
  key: process.env.VUE_APP_PUSHER_APP_KEY,
  cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
  disableStats: false,
  forceTLS: false,
  encrypted: false
  //  wsPort: 6001,
  //  wssPort: 6001,
  //  enableTransport:['ws']
});

// set axios
window.axios = require("axios");
window.axios.defaults.baseURL = process.env.VUE_APP_API_BASE;

window.axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    // Check your token for validity, and if needed, refresh the token / force re-login etc.
    const token = store.state.auth.access_token;
    if (token)
      window.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
window.axios.interceptors.response.use(undefined, function(error) {
  return new Promise(() => {
    if (
      error.status === 401 &&
      error.config &&
      !error.config.__isRetryRequest
    ) {
      store.dispatch("auth/logout");
    }
    throw error;
  });
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  vuelidate,
  render: h => h(App)
}).$mount("#app");
