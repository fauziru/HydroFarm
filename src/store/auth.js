/* eslint-disable */
import axios from '../plugins/vueaxios'
import router from '../router'

const AUTH_MUTATIONS = {
  SET_USER: 'SET_USER',
  SET_PAYLOAD: 'SET_PAYLOAD',
  LOGOUT: 'LOGOUT'
}

const state = () => ({
  isLoggedin: false,
  access_token: null, // JWT access token
  refresh_token: null, // JWT refresh token
  id: null, // user id
  email_address: null, // user email address
  expiresin: null, // expire time token
  user: null
})

const mutations = {
  // store the logged in user in the state
  [AUTH_MUTATIONS.SET_USER] (state, user) {
    state.id = user.id
    state.email_address = user.email_address
    state.user = user
    state.isLoggedin = true
  },

  // store new or updated token fields in the state
  [AUTH_MUTATIONS.SET_PAYLOAD] (
    state,
    { access_token, expires_in, refresh_token = null }
  ) {
    state.access_token = access_token
    state.expiresin = expires_in
    // refresh token is optional, only set it if present
    if (refresh_token) {
      state.refresh_token = refresh_token
    }
  },

  // clear our the state, essentially logging out the user
  [AUTH_MUTATIONS.LOGOUT] (state, force = null) {
    state.id = null
    state.email_address = null
    state.access_token = null
    state.refresh_token = null
    state.expires_in = null
    state.isLoggedin = false
  }
}

const actions = {
  async login ({ commit, dispatch }, dataauth) {
    try {
      const {
        data: { user, payload }
      } = await axios.post('/login', dataauth)
      commit(AUTH_MUTATIONS.SET_USER, user)
      commit(AUTH_MUTATIONS.SET_PAYLOAD, payload)
      router.push({ name: 'dashboard' })
      dispatch(
        'layout/alertFire',
        { type: 'success', message: 'Login sukses!' },
        { root: true }
      )
      console.log('login attempt')
    } catch (response) {
      // console.log('error login', {response})
      dispatch(
        'layout/alertFire',
        { type: 'error', message: response.response.data.message },
        { root: true }
      )
    }
  },

  async register ({ commit, dispatch }, dataauth) {
    try {
      const { data: { user, payload } } = await axios.post('/register', dataauth)
      commit(AUTH_MUTATIONS.SET_USER, user)
      commit(AUTH_MUTATIONS.SET_PAYLOAD, payload)
      router.push({ name: 'dashboard' })
      dispatch(
        'layout/alertFire',
        { type: 'success', message: 'Registrasi sukses!' },
        { root: true }
      )
    } catch (response) {
      dispatch(
        'layout/alertFire',
        { type: 'error', message: response.response.data.message.email[0] },
        { root: true }
      )
    }
  },

  async refresh ({ commit, state }) {
    const { refresh_token } = state.refresh_token
    console.log('refresh token store auth', state.refresh_token)

    const {
      data: { payload }
    } = await axios.post('/refresh', { refresh_token })
    commit(AUTH_MUTATIONS.SET_PAYLOAD, payload)
  },

  async logout ({ commit }) {
    await axios.get('/logout')
    commit(AUTH_MUTATIONS.LOGOUT)
    router.push({ name: 'login' })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
