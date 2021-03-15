const state = () => ({
  isMobile: false,
  drawerSide: null,
  mini: false,
  loadState: false,
  alert: {
    type: "",
    message: "",
    state: false
  }
});

const mutations = {
  setIsmobile(state, bool) {
    state.isMobile = bool;
  },
  setDrawerside(state, bool) {
    state.drawerSide = bool;
  },
  setMini(state, bool) {
    state.mini = bool;
  },
  setLoadstate(state, bool) {
    state.loadState = bool;
  },
  setAlert(state, { type, message }) {
    state.alert.type = type;
    state.alert.message = message;
  },
  setAlertState(state, bool) {
    state.alert.state = bool;
  }
};

const actions = {
  // drawSide({ commit }, bool) {
  //   commit("setDrawerside", bool);
  // },
  mobileBreak({ commit }, bool) {
    commit("setIsmobile", bool);
    if (!bool) {
      commit("setDrawerside", true);
      console.log("desktop");
    }
  },
  draw({ commit, state }) {
    state.isMobile
      ? commit("setDrawerside", !state.drawSide)
      : commit("setMini", !state.mini);
  },
  alertFire({ commit }, item) {
    commit("setAlert", item);
    commit("setAlertState", true);
    setTimeout(() => {
      commit("setAlertState", false);
      commit("setAlert", { type: "", message: "" });
    }, 2000);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
