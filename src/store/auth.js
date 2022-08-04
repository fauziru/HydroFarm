/* eslint-disable */
import axios from '../plugins/vueaxios'
import router from '../router'

const AUTH_MUTATIONS = {
  SET_USER: 'SET_USER',
  SET_PAYLOAD: 'SET_PAYLOAD',
  LOGOUT: 'LOGOUT',
  SET_IMAGE_PROFILE: 'SET_IMAGE_PROFILE',
  UPDATE_USER: 'UPDATE_USER'
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
    state.user = null
  },

  // update image
  [AUTH_MUTATIONS.SET_IMAGE_PROFILE] (state, image_path) {
    state.user.img_path = image_path
  },

  // update partial
  [AUTH_MUTATIONS.UPDATE_USER] (state, userUpdate) {
    state.user = Object.assign(state.user, userUpdate)
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
      setTimeout(() => {
        window.location.reload()
      }, 500)
      console.log('login attempt')
    } catch (error) {
      console.log('error login', error)
      dispatch(
        'layout/alertFire',
        { type: 'error', message: error.response.data.message },
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
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      throw error
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
  },

  async details ({ commit, state }) {
   const { data } = await axios.get(`/user/${state.id}`)
   console.log('get details', data.data)
   commit(AUTH_MUTATIONS.UPDATE_USER, data.data)
  },

  updateAvatar ({ commit }, image_path) {
    commit(AUTH_MUTATIONS.SET_IMAGE_PROFILE, image_path)
  },

  updateUser ({ commit }, user) {
    console.log('vuex auth')
    commit(AUTH_MUTATIONS.UPDATE_USER, {name: user.name_user, address: user.adress, phone_number: user.phone})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
