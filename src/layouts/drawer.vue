<template>
  <v-navigation-drawer
    v-model="drawerside"
    fixed
    :mini-variant.sync="mini"
    overlay-color="lime lighten-5"
    :temporary="isMobile"
    color="bgGrey"
    class="elevation-1"
    app
  >
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img :src="user.img_path || `https://ui-avatars.com/api/?name=${user.name}`" />
      </v-list-item-avatar>

      <v-list-item-title>{{ user.email_address }}</v-list-item-title>

      <v-btn
        icon
        @click.stop="draw()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider />

    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        color="primary"
        link
        :to="item.link"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          color="primary"
          block
          dark
          :disabled="loadState"
          @click="logout"
        >
          <div v-if="!loadState">
            <div v-if="!mini">
              Logout
              <v-icon> mdi-logout </v-icon>
            </div>
            <v-icon v-else> mdi-logout </v-icon>
          </div>
          <Loader v-else />
        </v-btn>
      </div>
    </template>
    <!-- <v-navigation-drawer-border color="primary"></v-navigation-drawer-border> -->
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
import Loader from '@/components/ProgressCircle.vue'

export default {
  components: {
    Loader
  },
  data: () => ({
    items: [
      { title: 'Sensor', icon: 'mdi-leak', link: { name: 'sensor' } },
      { title: 'Rakit Apung', icon: 'mdi-bed-outline', link: '#' },
      { title: 'Tray', icon: 'mdi-tray', link: '#' },
      { title: 'Plant', icon: 'mdi-sprout-outline', link: '#' },
      { title: 'Users', icon: 'mdi-account-group-outline', link: { name: 'user' } },
      { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', link: { name: 'dashboard' } },
      { title: 'My Account', icon: 'mdi-account-outline', link: { name: 'account' } },
      { title: 'Settings', icon: 'mdi-cog-outline', link: '#' }
    ]
  }),

  computed: {
    ...mapState('layout', ['isMobile', 'loadState']),
    ...mapState('auth', ['user']),
    drawerside: {
      get () {
        return this.$store.state.layout.drawerSide
      },
      set (value) {
        this.$store.commit('layout/setDrawerside', value)
      }
    },
    mini: {
      get () {
        return this.$store.state.layout.mini
      },
      set (value) {
        this.$store.commit('layout/setMini', value)
      }
    }
  },
  methods: {
    draw () {
      if (this.isMobile) {
        this.drawerside = !this.drawerside
      } else {
        this.mini = !this.mini
      }
    },
    logout () {
      this.$store.commit('layout/setLoadstate', true)
      this.$store
        .dispatch('auth/logout')
        .then(() => this.$store.commit('layout/setLoadstate', false))
    }
  }
}
</script>
