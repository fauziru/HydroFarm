
import axios from '../plugins/vueaxios'

const NOTIF_MUTATIONS = {
  SET_UNREAD: 'SET_UNREAD',
  UPDATE_UNREAD: 'UPDATE_UNREAD'
}

const state = () => ({
  notifUnread: null,
  notifAll: null
})

const mutations = {
  [NOTIF_MUTATIONS.SET_UNREAD] (state, payload) {
    state.notifUnread = payload
  },
  [NOTIF_MUTATIONS.UPDATE_UNREAD] (state, notification) {
    state.notifUnread.unshift(notification)
  }
}

const actions = {
  readNotif ({ state, commit }, id) {
    axios.get(`notification/read/${id}`)
    commit(NOTIF_MUTATIONS.SET_UNREAD, state.notifUnread.filter(item => item.id !== id))
  },
  async getUnreadnotif ({ commit, state }) {
    const { data: { data } } = await axios.get('/notification/unread')
    commit(NOTIF_MUTATIONS.SET_UNREAD, data)
    console.log('notif unread', state.notifUnread)
  },
  readAll ({ commit }) {
    axios.get('notification/readall')
    commit(NOTIF_MUTATIONS.SET_UNREAD, [])
  },
  updateUnreadnotif ({ commit }, newNotification) {
    commit(NOTIF_MUTATIONS.UPDATE_UNREAD, newNotification)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
