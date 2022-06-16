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
        <v-img :src="srcImage" />
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

    <!-- side bar menu item -->
    <v-list
      dense
      shaped
    >
      <template v-for="item in items">
        <v-list-item
          :key="item.title"
          color="primary"
          link
          :to="item.link"
          v-if="renderListAdmin(user.role, item.role)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <!-- /side bar menu item -->

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
              Keluar
              <v-icon> mdi-logout </v-icon>
            </div>
            <v-icon v-else>
              mdi-logout
            </v-icon>
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
    sourceImage: process.env.VUE_APP_IMAGE_BASE + 'storage/images/avatar/',
    items: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', link: { name: 'dashboard' }, role: ['admin', 'user'] },
      { title: 'Node', icon: 'mdi-access-point', link: { name: 'node' }, role: ['admin'] },
      { title: 'Sensor', icon: 'mdi-leak', link: { name: 'sensor' }, role: ['admin'] },
      // { title: 'Rakit Apung', icon: 'mdi-bed-outline', link: '#' },
      // { title: 'Tray', icon: 'mdi-tray', link: '#' },
      // { title: 'Plant', icon: 'mdi-sprout-outline', link: '#' },
      { title: 'Pengguna', icon: 'mdi-account-group-outline', link: { name: 'user' }, role: ['admin'] },
      { title: 'Akun saya', icon: 'mdi-account-outline', link: { name: 'account' }, role: ['admin', 'user'] },
      { title: 'Pengaturan', icon: 'mdi-cog-outline', link: { name: 'setting' }, role: ['admin'] }
    ]
  }),

  computed: {
    ...mapState('layout', ['isMobile', 'loadState']),
    ...mapState('auth', ['user']),
    srcImage () {
      return this.user.img_path ? this.sourceImage + this.user.img_path : `https://ui-avatars.com/api/?name=${this.user.name}&background=b0d388`
    },
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
    },
    renderListAdmin (userRole, itemRole) {
      return itemRole.includes(userRole)
    }
  }
}
</script>
