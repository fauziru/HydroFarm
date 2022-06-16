<template>
  <div>
    <v-list three-line>
      <v-subheader
        v-if="!loadState"
        class="text-capitalize"
      >
        {{ titleCase(section) }}
        <v-spacer />
        <v-menu
          v-if="!isMobile"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <!-- button -->
            <v-btn
              class="primary--text"
              text
              depressed
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="readAll">
              <v-list-item-title>Tandai baca semua</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-bottom-sheet
          v-else
          v-model="bottomSheet"
          class="rounded-t-xl"
          overlay-color="lime lighten-5"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="grey darken-1"
              icon
              depressed
              small
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dense>
                mdi-dots-horizontal
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="readall">
              <v-list-item-title>Tandai baca semua</v-list-item-title>
            </v-list-item>
            <v-list-item @click="readall">
              <v-list-item-title>Matikan push notification</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-bottom-sheet>
      </v-subheader>
      <template v-for="(item, i) in notifications">
        <v-list-item
          :key="item.title"
          @click="read(item.data.link, item.id, item.read_at)"
          @scroll.native="infiniteLoad"
        >
          <v-badge
            :value="!item.read_at"
            color="red lighten-1"
            offset-x="22"
            offset-y="22"
            style="margin-left: -15px"
            dot
          >
            <v-list-item-avatar color="light-green lighten-5">
              <v-icon :color="item.type | typeNotif('color')">
                {{ item.type | typeNotif('icon') }}
              </v-icon>
            </v-list-item-avatar>
          </v-badge>

          <v-list-item-content>
            <v-list-item-title>
              {{ item.type | typeNotif('title') }}
            </v-list-item-title>
            <v-list-item-subtitle v-html="item.data.data" />
          </v-list-item-content>
          <v-list-item-action class="align-self-center">
            <v-list-item-action-text>
              {{ item.created_at | cD }}
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-divider
          :key="i"
          inset
        />
      </template>
      <div class="text-center mt-2">
        <Loader v-if="loadState" />
        <div v-if="!loadState && notifications.length === 0">
          <div class="text-center primary--text">
            Belum ada notifikasi
          </div>
          <v-img
            :src="require('../assets/images/logoNotif.png')"
            class="my-3"
            contain
            height="120"
          />
        </div>
      </div>
    </v-list>
    <div
      v-if="maxPage"
      class="text-center primary--text"
    >
      . . .
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Loader from '@/components/ProgressCircle.vue'

export default {
  components: {
    Loader
  },
  props: {
    section: {
      type: String,
      default: 'all'
    }
  },
  data: () => ({
    bottomSheet: false,
    notifications: [],
    page: 1,
    maxPage: false
  }),
  computed: {
    ...mapState('layout', ['loadState', 'isMobile'])
  },
  created () {
    this.getNotification()
    window.addEventListener('scroll', this.infiniteLoad)
  },
  beforeMount () {
    // console.log('to top')
    window.scrollTo(0, 0)
  },
  beforeDestroy () {
    // this.section = null
  },
  destroyed () {
    // console.log('component destryoed')
    window.removeEventListener('scroll', this.infiniteLoad)
  },
  methods: {
    ...mapActions('notification', ['readNotif', 'readAll']),
    async getNotification () {
      this.loadstate(true)
      const {
        data: {
          data: { data }
        }
      } = await this.axios.get(`notification/${this.section}/${this.page}`)
      this.page++
      if (data.length > 0) {
        this.notifications.push(...data)
      } else {
        // console.log('semua data sudah dimuat')
        this.maxPage = true
      }
      this.loadstate(false)
    },
    infiniteLoad () {
      // console.log('section inf load', this.section)
      let bottomOfWindow =
        Math.ceil(document.documentElement.scrollTop + window.innerHeight) >=
        document.documentElement.offsetHeight
      // console.log(bottomOfWindow, this.maxPage, this.loadState)
      // console.log(document.documentElement.scrollTop, window.innerHeight, document.documentElement.offsetHeight)
      if (bottomOfWindow && !this.maxPage && this.loadState === false) {
        // console.log('reach bottom', this.section)
        // console.log('update')
        document.documentElement.scrollTop -= 25
        this.getNotification()
      }
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    },
    read (link, id, stat) {
      if (!stat) {
        const index = this.notifications.findIndex(notif => notif.id === id)
        console.log('index notif', index)
        this.notifications[index] = Object.assign(this.notifications[index], { read_at: new Date().toISOString() })
        this.readNotif(id)
      }
      this.$router.push({ path: link })
    },
    readall () {
      this.bottomSheet = false
      this.readAll()
      this.notifications.map((notif) => !notif.read_at ? Object.assign(notif, { read_at: new Date().toISOString() }) : notif)
    },
    titleCase (sec) {
      const title = {
        'all': 'semua',
        'sensor': 'sensor',
        'activity': 'aktivitas'
      }
      return title[sec]
    }
  }
}
</script>

<style>
.v-bottom-sheet.v-dialog {
  border-radius: 25px !important;
}

.v-sheet.v-list {
  border-top-left-radius: 25px !important;
  border-top-right-radius: 25px !important;
}
</style>
