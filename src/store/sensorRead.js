const state = () => ({
  sensorWidgetId: 1
})

const mutations = {
  setSensorWidgetId (state, id) {
    state.sensorWidgetId = id
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
