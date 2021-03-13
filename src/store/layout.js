const state = () => ({
  isMobile: false,
  drawerSide: null,
  mini: false
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
  }
};

const actions = {
  // drawSide({ commit }, bool) {
  //   commit("setDrawerside", bool);
  // },
  mobileBreak({ commit }, bool) {
    commit("setIsmobile", bool);
    if(!bool){
      commit("setDrawerside", true);
      console.log("desktop");
    }
  },
  draw({ commit, state }) {
    if (state.isMobile) {
      commit("setDrawerside", !state.drawSide);
    } else {
      commit("setMini", !state.mini);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
