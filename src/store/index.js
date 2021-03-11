import Vue from "vue";
import Vuex, { createLogger } from "vuex";
import layout from "./layout";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    layout
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
