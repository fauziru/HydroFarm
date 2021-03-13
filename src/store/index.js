import Vue from "vue";
import Vuex, { createLogger } from "vuex";
import auth from "./auth";
import layout from "./layout";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  state: {
    tes: false
  },
  modules: {
    layout,
    auth
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
