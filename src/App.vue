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
    <!-- navbar -->
    <!-- <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar> -->
    <Navbar v-if="isLoggedin" />
    <v-main>
      <v-sheet
        color="grey lighten-4"
        style="min-height: 100vh"
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
