<template>
  <v-alert
    v-model="alertstate"
    border="left"
    dismissible
    elevation="1"
    :type="alert.type || 'error'"
    transition="fade-transition"
    class="ma-5"
    style="z-index: 9999; position: fixed;"
  >
    {{ alert.message }}
  </v-alert>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('layout', ['alert']),
    alertstate: {
      get () {
        return this.$store.state.layout.alert.state
      },
      set (value) {
        this.$store.commit('layout/setAlertState', value)
      }
    }
  }
}
</script>
