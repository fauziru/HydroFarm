<template>
  <div :class="isMobile ? '' : 'px-2'">
    <v-tabs-items
      v-model="tab"
      class="rounded-xl elevation-1"
    >
      <v-tab-item>
        <notification-list
          v-if="tab === 0"
          section="all"
        />
      </v-tab-item>
      <v-tab-item>
        <notification-list
          v-if="tab === 1"
          section="sensor"
        />
      </v-tab-item>
      <v-tab-item>
        <notification-list
          v-if="tab === 2"
          section="activity"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NotificationList from '../components/NotificationList.vue'

export default {
  components: {
    NotificationList
  },
  data: () => ({
    tabItem: [{ title: 'semua' }, { title: 'sensor' }, { title: 'aktivitas' }]
  }),
  computed: {
    tab: {
      get () {
        return this.$store.state.layout.tab
      },
      set (value) {
        this.$store.commit('layout/setTab', value)
      }
    },
    ...mapState('layout', ['isMobile'])
  },
  created () {
    this.$store.commit('layout/SET_TAB', { tab: this.$route.meta.activity ? 2 : 0, tabs: this.tabItem })
  },
  beforeDestroy () {
    this.$store.commit('layout/SET_TAB', { tab: null, tabs: null })
  }
}
</script>
