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

        <template v-slot:[`item.email_address`]="{ item }">
          <m-copied-label :text="item.email_address" />
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="item.status ? 'green' : 'red'"
            dark
          >
            {{ item.status ? 'online' : 'offline' }}
          </v-chip>
        </template>

        <template v-slot:no-data>
          <Loader v-if="loadState" />
          <v-btn
            v-else
            color="primary"
            @click="initialize"
          >
            Reset
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CopiedLabel from '@/components/CopiedLabel.vue'
import Loader from '@/components/ProgressCircle.vue'

export default {
  components: {
    Loader,
    'm-copied-label': CopiedLabel
  },
  data: () => ({
    search: '',
    headers: [
      { text: '#ID', value: 'id' },
      { text: 'Email', value: 'email_address' },
      { text: 'Nama', align: 'start', sortable: false, value: 'name' },
      { text: 'Role', value: 'role' },
      { text: 'Status', value: 'status' },
      { text: 'Last Seen', value: 'last_seen' }
    ],
    users: []
  }),
  computed: {
    ...mapState('layout', ['isMobile', 'loadState'])
  },

  created () {
    this.initialize()
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

    loadstate (val) {
      this.$store.commit('layout/setLoadstate', val)
    }
  }
}
</script>
