const LAYOUT_MUTATIONS = {
  SET_TAB: 'SET_TAB'
}
const state = () => ({
  isOffline: false,
  isMobile: false,
  drawerSide: null,
  mini: false,
  loadState: false,
  alert: {
    type: '',
    message: '',
    state: false
  },
  tabs: '',
  tab: null,
  menuBar: [
    {
      name: 'Dashboard',
      icon: 'mdi-view-dashboard',
      link: { name: 'dashboard' },
      role: ['admin', 'user']
    },
    {
      name: 'Aktifitas',
      icon: 'mdi-history',
      link: { name: 'activity' },
      role: ['admin', 'user']
    }
    // {
    //   name: 'Pengaturan',
    //   icon: 'mdi-cog',
    //   link: { name: 'setting' },
    //   role: ['admin']
    // }
  ]
})

const mutations = {
  [LAYOUT_MUTATIONS.SET_TAB] (state, { tab, tabs }) {
    console.log('Change tab', state.tab)
    state.tab = tab
    state.tabs = tabs
  },
  setTab (state, bool) {
    state.tab = bool
  },
  setIsmobile (state, bool) {
    state.isMobile = bool
  },
  setDrawerside (state, bool) {
    state.drawerSide = bool
  },
  setMini (state, bool) {
    state.mini = bool
  },
  setLoadstate (state, bool) {
    state.loadState = bool
  },
  setAlert (state, { type, message }) {
    state.alert.type = type
    state.alert.message = message
  },
  setAlertState (state, bool) {
    state.alert.state = bool
  },
  setOffline (state, bool) {
    state.isOffline = bool
  }
}

const actions = {
  mobileBreak ({ commit }, bool) {
    commit('setIsmobile', bool)
    if (!bool) {
      commit('setDrawerside', true)
      console.log('desktop')
    }
  },

  draw ({ commit, state }) {
    state.isMobile
      ? commit('setDrawerside', !state.drawSide)
      : commit('setMini', !state.mini)
  },

  async alertFire ({ commit }, item) {
    await commit('setAlert', item)
    commit('setAlertState', true)
    setTimeout(async () => {
      await commit('setAlertState', false)
      commit('setAlert', { type: '', message: '' })
    }, 2000)
  },

  renderLayout ({ commit }, payload) {
    commit('setLayout', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
