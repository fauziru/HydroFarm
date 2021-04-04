<template>
  <v-app-bar
    fixed
    :color="bg"
    height="56px"
    elevate-on-scroll
    :dark="dark"
    app
  >
    <v-btn
      v-if="this.$route.meta.backButton"
      icon
      depressed
      link
      @click="hasHistory() ? $router.go(-1) : $router.push('/')"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-app-bar-nav-icon
      v-else
      @click.stop="draw()"
    />
    <v-btn
      icon
      @click.stop="draw()"
    >
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        :src="require('../assets/logo.png')"
        transition="scale-transition"
        width="40"
      />
    </v-btn>
    <v-spacer />
    <v-toolbar-title
      class="text-capitalize mr-6"
      v-text="this.$route.name"
    />
    <!-- menu navbar -->
    <v-menu
      v-if="!isMobile"
      left
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="mr-1">
          <v-btn
            icon
            depressed
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-view-grid-outline</v-icon>
          </v-btn>
        </div>
      </template>

      <v-card class="d-flex flex-row flex-wrap">
        <div
          v-for="(item, index) in menuBar"
          :key="index"
          tile
          class="app-tile pa-3 text-center"
          :to="item.link"
          link
        >
          <v-icon color="primary">
            {{ item.icon }}
          </v-icon>
          <div class="font-weight-bold mt-1">
            {{ item.name }}
          </div>
          <div class="caption">
            {{ item.name }}
          </div>
        </div>
      </v-card>
    </v-menu>

    <!-- notification -->
    <v-menu
      v-if="notifUnread"
      nudge-left
      offset-y
      z-index="12"
    >
      <template v-slot:activator="{ on, attrs }">
        <div style="margin-right: -15px">
          <v-badge
            :content="notifUnread.length"
            :value="notifUnread.length"
            color="primary"
            offset-x="22"
            offset-y="22"
            bordered
          >
            <v-btn
              v-if="!isMobile"
              icon
              depressed
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>
                mdi-bell-outline
              </v-icon>
            </v-btn>
            <v-btn
              v-else
              :to="{ name: 'notification' }"
              icon
              depressed
              link
            >
              <v-icon>mdi-bell-outline</v-icon>
            </v-btn>
          </v-badge>
        </div>
      </template>

      <v-card>
        <v-list
          dense
          three-line
          :max-width="400"
        >
          <v-subheader class="pa-2 font-weight-bold">
            Notifikasi
            <v-spacer />
            <v-btn
              v-if="notifUnread.length > 10"
              :to="{ name: 'notification' }"
              color="primary"
              small
              @click="readAll()"
            >
              Lihat Semua
            </v-btn>
          </v-subheader>
          <!-- component notifi list -->
          <div v-if="notifUnread.length">
            <v-list-item
              v-for="(item, i) in notifUnread"
              :key="i"
              :to="item.data.link || { name: 'notification' }"
              link
              @click="readNotif(item.id)"
            >
              <v-list-item-avatar color="light-green lighten-4">
                <v-icon color="green">
                  {{ item.type | typeNotif('icon') }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Notifikasi</v-list-item-title>
                <v-list-item-subtitle
                  caption
                  v-html="item.data.data"
                />
              </v-list-item-content>
              <v-list-item-action class="align-self-center">
                <v-list-item-action-text>
                  {{ item.created_at | cD }}
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </div>
          <!-- if nothing -->
          <div v-else>
            <div class="text-center primary--text">
              Belum ada notifikasi terbaru
            </div>
            <v-img
              :src="require('../assets/images/logoNotif.png')"
              class="my-3"
              contain
              height="120"
            />
          </div>

          <div class="text-center py-2">
            <v-btn
              :to="{ name: 'notification' }"
              color="primary"
              small
            >
              Lihat Semua
            </v-btn>
          </div>
          <!-- end component notifi list -->
        </v-list>
      </v-card>
    </v-menu>
    <div class="text-center mr-1">
      <Loader v-if="!notifUnread" />
    </div>

    <template
      v-if="tabs"
      v-slot:extension
    >
      <v-tabs
        v-model="tab"
        fixed-tabs
      >
        <v-tabs-slider color="secondary" />
        <v-tab
          v-for="(item, index) in tabs"
          :key="index"
        >
          {{ item.title }}
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Loader from '@/components/ProgressCircle.vue'

export default {
  components: {
    Loader
  },
  data: () => ({
    bg: 'secondary',
    dark: true
  }),
  computed: {
    ...mapState('layout', ['isMobile', 'drawerSide', 'tabs', 'loadState']),
    ...mapState('notification', ['notifUnread']),
    tab: {
      get () {
        return this.$store.state.layout.tab
      },
      set (value) {
        this.$store.commit('layout/setTab', value)
      }
    },
    menuBar: {
      get () {
        return this.$store.state.layout.menuBar
      },
      set (value) { }
    }
  },
  created () {
    this.getUnreadnotif()
    window.addEventListener('scroll', this.changeColor)
  },
  mounted () {
    console.log('notif unread on navbar', this.notifUnread)
    this.listenEventNotification()
  },
  destroyed () {
    window.removeEventListener('scroll', this.changeColor)
  },
  methods: {
    ...mapActions('layout', ['draw', 'menuBar']),
    ...mapActions('notification', ['readNotif', 'getUnreadnotif', 'readAll']),
    changeColor () {
      var themeColor = document.querySelector('meta[name=theme-color]')
      if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
        this.bg = 'white'
        this.dark = false
        themeColor.setAttribute('content', '#ffffff')
      } else {
        this.bg = 'secondary'
        this.dark = true
        themeColor.setAttribute('content', '#29b6f6')
      }
    },
    hasHistory () {
      return window.history.length > 2
    },
    listenEventNotification () {
      window.Echo.private(`App.User.${this.$store.state.auth.id}`).notification(notification => {
        this.getUnreadnotif()
      })
    }
  }
}
</script>
