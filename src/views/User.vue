<template>
  <div class="d-flex flex-column flex-grow-1">
    <router-view />
    <div
      class="col-xl-4 col-12"
      :style=" isMobile ? 'padding: 0px!important;' : ''"
    >
      <div class="d-flex align-center py-3">
        <div class="display-1">
          User
        </div>
        <v-spacer />
      </div>
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        sort-by="calories"
        class="elevation-1 rounded-xl"
      >
        <template v-slot:top>
          <v-toolbar
            rounded="xl"
            flat
          >
            <!-- next tambah filter -->
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Cari .."
              single-line
              hide-details
            />
            <v-spacer />
            <v-btn
              icon
              depressed
              @click="initialize"
            >
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:[`item.id`]="{ item }">
          <v-tooltip
            z-index="99"
            bottom
          >
            <template v-slot:activator="{ on, attrs }">
              <span
                class="caption"
                v-bind="attrs"
                v-on="on"
              >
                {{ `#${item.id}` | truncate(15, '...') }}
              </span>
            </template>
            <span>
              {{ item.id }}
            </span>
          </v-tooltip>
        </template>

        <template v-slot:[`item.img_path`]="{ item }">
          <v-avatar
            color="primary"
            size="60"
            class="border"
            :style="{ marginBlock: '4px'}"
          >
            <v-img :src="srcImage(item.img_path, item.name)" alt="Avatar User"/>
          </v-avatar>
        </template>

        <template v-slot:[`item.email_address`]="{ item }">
          <m-copied-label :text="item.email_address" />
        </template>

        <template v-slot:[`item.is_online`]="{ item }">
          <v-chip
            :color="item.is_online ? 'green' : 'red'"
            dark
          >
            {{ item.is_online ? 'online' : 'offline' }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-if="item.role !== 'admin'"
                v-bind="attrs"
                v-on="on"
                icon
                depressed
                link
                @click="changeToAdmin(item.id)"
              >
                <v-icon small>
                  mdi-account-plus
                </v-icon>
              </v-btn>
            </template>
            Jadikan Admin
          </v-tooltip>
        </template>

        <template v-slot:no-data>
          <Loader v-if="loadState" />
          <no-data
            v-else
            :reload-callback="initialize"
          />
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CopiedLabel from '@/components/CopiedLabel.vue'
import Loader from '@/components/ProgressCircle.vue'
import NoData from '../components/NoData.vue'

export default {
  components: {
    Loader,
    'm-copied-label': CopiedLabel,
    NoData
  },
  data: () => ({
    search: '',
    sourceImage: process.env.VUE_APP_IMAGE_BASE + 'storage/images/avatar/',
    headers: [
      { text: '#ID', value: 'id' },
      { text: 'Avatar', value: 'img_path' },
      { text: 'No. Hp', value: 'phone_number' },
      { text: 'Email', value: 'email_address' },
      { text: 'Nama', align: 'start', sortable: false, value: 'name' },
      { text: 'Role', value: 'role' },
      { text: 'Status', value: 'is_online' },
      { text: 'Terakhir dilihat', value: 'last_seen' },
      { text: '', value: 'actions', sortable: false }
    ],
    users: []
  }),
  computed: {
    ...mapState('layout', ['isMobile', 'loadState'])
  },

  created () {
    this.initialize()
  },

  mounted () {
    this.realtimeEventListener()
  },

  beforeDestroy () {
    this.removeRealtimeEventListener()
  },

  methods: {
    ...mapActions('layout', ['alertFire']),
    async initialize () {
      this.users = []
      this.loadstate(true)
      // add axios get
      try {
        const { data } = await this.axios.get('user')
        this.users = data.data
        console.log('data user', this.users)
        this.loadstate(false)
      } catch (error) {
        this.loadstate(false)
        console.log('error store data', error)
        this.alertFire({ type: 'error', message: 'Terjadi kesalahan pada server!' })
      }
    },
    async changeToAdmin (id) {
      try {
        this.loadstate(true)
        await this.axios.post(`user/upgrade-admin/${id}`)
        this.loadstate(false)
        this.alertFire({ type: 'success', message: 'Berhasil mengupgrade user menjadi admin!' })
      } catch (error) {
        console.log('error', error)
        this.loadstate(false)
      }
    },
    srcImage (imagePath, userName) {
      return imagePath ? this.sourceImage + imagePath : `https://ui-avatars.com/api/?name=${userName}&background=b0d388`
    },
    realtimeEventListener () {
      window.Echo.private('events').listen('UpdateUserStatus', (event) => {
        console.log('event update user status', event)
        const { data } = event
        this.users.map((user) => user.id === data.id ? Object.assign(user, data) : user)
      })
    },
    removeRealtimeEventListener () {
      window.Echo.private('events').stopListening('UpdateUserStatus')
    },
    loadstate (val) {
      this.$store.commit('layout/setLoadstate', val)
    }
  }
}
</script>
