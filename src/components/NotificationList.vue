<template>
  <div>
    <v-list three-line>
      <v-subheader
        v-if="!loadState"
        class="text-capitalize"
        v-text="section"
      />
      <template v-for="(item, i) in notifications">
        <v-list-item
          :key="item.title"
          :to="item.data.link"
          link
          @click="readNotif(item.id)"
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
    notifications: [],
    page: 1,
    maxPage: false
  }),
  computed: {
    ...mapState('layout', ['loadState'])
  },
  created () {
    this.getNotification()
    window.addEventListener('scroll', this.infiniteLoad)
  },
  beforeMount () {
    console.log('to top')
    window.scrollTo(0, 0)
  },
  beforeDestroy () {
    // this.section = null
  },
  destroyed () {
    console.log('component destryoed')
    window.removeEventListener('scroll', this.infiniteLoad)
  },
  methods: {
    ...mapActions('notification', ['readNotif']),
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
        console.log('semua data sudah dimuat')
        this.maxPage = true
      }
      this.loadstate(false)
    },
    infiniteLoad () {
      console.log('section', this.section)
      let bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight
      if (bottomOfWindow && !this.maxPage && this.loadState === false) {
        console.log('reach bottom', this.section)
        console.log('update')
        this.getNotification()
      }
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    }
  }
}
</script>
