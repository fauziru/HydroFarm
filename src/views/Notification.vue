<template>
  <div>
    <v-tabs-items
      v-model="tab"
      class="rounded-xl"
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
          section="all"
        />
      </v-tab-item>
      <v-tab-item>
        <notification-list
          v-if="tab === 2"
          section="all"
        />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import NotificationList from '../components/NotificationList.vue'

export default {
  components: {
    NotificationList
  },
  data: () => ({
    tabItem: [{ title: 'all' }, { title: 'sensor' }, { title: 'sensor' }]
  }),
  computed: {
    tab: {
      get () {
        return this.$store.state.layout.tab
      },
      set (value) {
        this.$store.commit('layout/setTab', value)
      }
    }
  },
  created () {
    console.log('created notification')
    this.$store.commit('layout/setTabs', this.tabItem)
    this.$store.commit('layout/setTab', true)
  },
  beforeDestroy () {
    this.$store.commit('layout/setTabs', null)
    this.$store.commit('layout/setTab', null)
  }
}
</script>
