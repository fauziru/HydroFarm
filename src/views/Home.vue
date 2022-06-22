<template>
  <div>
    <v-layout
      fill-height
      :class="isMobile ? '' : 'px-2'"
    >
      <!-- {{ $router.params.id }} -->
      <!-- sensor grafik group -->
      <div class="d-flex flex-grow-1 flex-column">
        <div
          v-if="node.sensors.length > 0 && !isLoad"
          class="row flex-grow-0 row --dense"
        >
          <!-- params: sensor height tipe fullwidth read -->
          <grafik-sensor
            v-for="(sensor, i) in node.sensors"
            :key="i"
            :sensor="sensor"
            :height="350"
            :tipe="sensor.tipe"
            :nodeid="node.id"
            :fullwidth="sensor.tipe === 'tds'"
          />
        </div>
        <Loader
          v-if="isLoad"
          child-class="text-center my-auto"
        />
      </div>
      <!-- sensor grafik group -->
    </v-layout>
    <div v-if="notFound">
      <v-card
        class="h-full elevation-1"
        color="white"
        rounded="xl"
        min-height="380"
      >
        <not-found title="Node tidak dapat ditemukan" />
      </v-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex'
import GrafikSensor from '@/components/GrafikSensor'
import Loader from '@/components/ProgressCircle.vue'
import NotFound from '../components/NotFound.vue'

export default {
  components: {
    GrafikSensor,
    Loader,
    NotFound
  },
  data: () => ({
    node: {
      id: '',
      sensors: []
    },
    notFound: false,
    isLoad: false
  }),
  computed: {
    ...mapState('layout', ['isMobile'])
  },
  watch: {
    // call again the method if the route changes
    // '$route': 'initialize'
    $route (to, from) {
      this.initialize()
    }
  },
  created () {
    this.initialize()
  },
  updated () {
    console.log('not found', this.notFound)
  },
  methods: {
    async initialize () {
      try {
        this.loadstate(true)
        const response = await this.axios.get(`node/${this.$route.params.id}`)
        console.log('respoinse fetch node', response)
        this.node.sensors = response.data.data.sensors
        this.node.id = response.data.data.id
        this.loadstate(false)
      } catch (error) {
        console.log('error fetch detail node', error)
        const { response } = error
        this.loadstate(false)
        if (response.status === 404) this.notFound = true
        // this.$store.dispatch('layout/alertFire', {
        //   type: 'error',
        //   message: 'Terjadi kesalahan pada server!'
        // })
      }
    },
    loadstate (state) {
      this.isLoad = state
    }
  }
}
</script>
