import axios from '../plugins/vueaxios'

const META_MUTATIONS = {
  SET_META: 'SET_META'
}

const state = () => ({
  isMaintenance: false,
  version: '-'
})

const mutations = {
  // store the logged in user in the state
  [META_MUTATIONS.SET_META] (state, meta) {
    state.isMaintenance = meta.isMaintenance
    state.version = meta.version
  }
}

const actions = {
  async getMeta ({ commit, dispatch }) {
    try {
      // commit('layout/setLoadstate', true, { root: true })
      const response = await axios.get(`meta?secret=${process.env.VUE_APP_API_SECRET_KEY}`)
      console.log('meta', response)
      commit(META_MUTATIONS.SET_META, response.data.data)
      // commit('layout/setLoadstate', false, { root: true })
    } catch (error) {
      console.log('error get meta', error)
      // commit('layout/setLoadstate', false, { root: true })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
