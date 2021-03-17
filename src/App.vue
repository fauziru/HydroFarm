<template>
  <v-app>
    <!-- sidebar -->
    <v-progress-linear
      v-if="loadState"
      height="10"
      indeterminate
      color="primary"
      reverse
      fixed
      style="z-index: 10"
    />
    <Alert />
    <Sidebar v-if="isLoggedin" />
    <Navbar v-if="isLoggedin" />
    <v-main>
      <v-sheet
        color="grey lighten-4"
        style="min-height: 94vh"
      >
        <div
          class="bg-wave"
          style="height: 360px"
        />
        <v-container
          v-if="isLoggedin"
          style="margin-top: -360px"
          fluid
        >
          <router-view />
        </v-container>
        <Guest
          v-if="!isLoggedin"
          style="margin-top: -360px"
        />
      </v-sheet>
    </v-main>

    <Bottombar v-if="isLoggedin" />
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Bottombar from './layouts/bottombar.vue'
import Sidebar from './layouts/drawer.vue'
import Guest from './layouts/guest.vue'
import Navbar from './layouts/navbar.vue'
import Alert from './components/Alert.vue'

export default {
  name: 'App',

  components: {
    Navbar,
    Bottombar,
    Sidebar,
    Guest,
    Alert
  },

  data: () => ({
    //
  }),

  computed: {
    ...mapState('auth', ['isLoggedin']),
    ...mapState('layout', ['loadState'])
  },

  beforeDestroy () {
    if (typeof window === 'undefined') {
      return window.removeEventListener('resize', this.onResize, {
        passive: true
      })
    }
  },

  created () {
    console.log('intialize app')
  },

  mounted () {
    console.log('app loadState', this.loadState)
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  methods: {
    ...mapActions('layout', ['mobileBreak']),
    onResize () {
      this.mobileBreak(window.innerWidth < 1264)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Quicksand', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.bg-wave {
  background-image: url('~@/assets/images/wave.svg');
}
</style>
