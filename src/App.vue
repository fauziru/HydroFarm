<template>
  <div>
    <v-app v-if="!isMaintenance">
      <!-- sidebar -->
      <v-progress-linear
        v-if="loadState"
        height="10"
        indeterminate
        color="primary"
        reverse
        fixed
        style="z-index: 14"
      />
      <Alert />
      <!-- alert offline -->
      <v-alert
        v-if="isOffline"
        border="left"
        elevation="1"
        type="error"
        transition="fade-transition"
        class="ma-5"
        style="z-index: 9999; position: fixed;"
      >
        Tidak ada jaringan !!
      </v-alert>
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
            <!-- ask notif -->
            <banner-front
              v-if="isAskForNotifPermission"
              title="Nyalakan notifikasi"
              icon="mdi-bell"
              btn-name="Ok!"
              :callback="requestNotificationPermission"
            />
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
    <v-app v-else>
      <maintenance />
    </v-app>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Bottombar from './layouts/bottombar.vue'
import Sidebar from './layouts/drawer.vue'
import Guest from './layouts/guest.vue'
import Navbar from './layouts/navbar.vue'
import Alert from './components/Alert.vue'
import BannerFront from './components/BannerFront.vue'
import Maintenance from './components/Maintenance.vue'

export default {
  name: 'App',

  components: {
    Navbar,
    Bottombar,
    Sidebar,
    Guest,
    Alert,
    BannerFront,
    Maintenance
  },

  data: () => ({
    //
    isOffline: false,
    isAskForNotifPermission: false
  }),

  // mqtt: {
  //   'sensor/#' (data) {
  //     // console.log(data, 'Data from mqtt')
  //     var enc = new TextDecoder('utf-8')
  //     var arr = new Uint8Array(data)
  //     console.log(enc.decode(arr), 'After convert')
  //   }
  // },

  computed: {
    ...mapState('auth', ['isLoggedin', 'user']),
    ...mapState('layout', ['loadState']),
    ...mapState('meta', ['isMaintenance'])
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
    navigator.serviceWorker.register('/service-worker.js')
    // navigator.serviceWorker.getRegistration().then((sw) => {
    //   console.log('sw', sw)
    // })
    // cek offlineStatus
    const isOffline = JSON.parse(localStorage.getItem('offlineState'))
    if (isOffline !== null) {
      console.log('Status offline', isOffline, typeof isOffline)
      this.isOffline = isOffline
    }
    // ask notification permission
    // if (this.isLoggedin && (window.Notification.permission !== 'granted' || !this.user.is_subscribe)) {
    //   this.isAskForNotifPermission = true
    // }
    this.getMeta()
  },
  updated () {
    // console.log('notif permission', this.isLoggedin, window.Notification.permission, this.user)
    if (this.isLoggedin && (window.Notification.permission !== 'granted' || !this.user.is_subscribe)) {
      // console.log('notif ask true', this.isLoggedin, window.Notification.permission, this.user)
      this.isAskForNotifPermission = true
    } else {
      this.isAskForNotifPermission = false
    }
  },
  mounted () {
    console.log('app loadState', this.loadState)
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
    // this.$mqtt.subscribe('sensor/#')
  },
  methods: {
    ...mapActions('layout', ['mobileBreak']),
    ...mapActions('meta', ['getMeta']),
    onResize () {
      this.mobileBreak(window.innerWidth < 1264)
    },
    urlB64ToUint8Array (base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
      // eslint-disable-next-line
      const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
      const rawData = atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    },
    async requestNotificationPermission () {
      try {
        // cek permission notification dari user
        const permission = await window.Notification.requestPermission()
        // jika tidak diberikan maka lempar error
        if (permission !== 'granted') {
          throw new Error('Permission not granted for Notification')
        }
        this.isAskForNotifPermission = false
        const applicationServerKey = this.urlB64ToUint8Array(process.env.VUE_APP_VAPID_KEY)
        const options = { applicationServerKey, userVisibleOnly: true }
        const reg = await navigator.serviceWorker.getRegistration()
        console.log('swrequest', reg)
        const subscribe = await reg.pushManager.subscribe(options)
        console.log('subscribe', subscribe)
        const response = await this.axios.post('notification/subscribe', subscribe)
        this.$store.dispatch('layout/alertFire', {
          type: 'success',
          message: 'Berhasil subscribe notifikasi!'
        })
        console.log('response', response)
      } catch (error) {
        console.log('error', error)
      }
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
.v-application .elevation-1 {
  box-shadow: 0 3px 10px -2px rgb(85 85 85 / 8%), 0 2px 20px 0 rgb(85 85 85 / 6%), 0 1px 30px 0 rgb(85 85 85 / 3%) !important;
}
.v-navigation-drawer {
  z-index: 13 !important;
}
.v-app-bar {
  z-index: 12 !important;
}
#app .v-bottom-navigation .v-btn {
  height: inherit !important;
}
/* custom scrollbar */
/* width */
::-webkit-scrollbar {
  width: 10px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #f5f5f5;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #29b6f6;
  border-radius: 10px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #3990b8;
}
</style>
