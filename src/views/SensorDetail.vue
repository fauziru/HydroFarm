<template>
  <!-- <v-card class="elevation-1 rounded-xl">
    <v-card-title>
      {{  this.$route.params.id }}
    </v-card-title>
  </v-card> -->
  <v-card
    class="d-flex flex-grow-1 h-full elevation-1"
    color="white"
    rounded="xl"
    min-height="380"
  >
    <div
      class="d-flex flex-column flex-grow-1"
      style="position: relative;"
    >
      <v-card-title v-if="!loadState">
        <div>
          <!-- mock -->
          Sensor {{ sensorData.name_sensor }} &mdash;
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                class="caption"
                v-bind="attrs"
                v-on="on"
              >
                {{ sensorData.last_read }}
              </span>
            </template>
            <span>{{ sensorData.last_read | cD }}</span>
          </v-tooltip>
          <!-- <span class="caption">
                  {{ sensorData.last_read }}
                </span> -->
        </div>
        <v-spacer />
        <!-- menu -->
      </v-card-title>
      <div v-if="series[0].data.length > 0 && !loadState">
        <div class="px-4 pb-4">
          <div class="d-flex align-center">
            <div class="text-h4 primary--text">
              <!-- mock -->
              {{ lastRead }} ppm
            </div>
            <v-spacer />
            <div class="d-flex flex-column text-right">
              <div class="font-weight-bold">
                <span>
                  <span class="warning--text">
                    <v-icon color="warning">mdi-dots-hexagon</v-icon>
                    <!-- mock -->
                    {{ sensorData.min_nutrisi }}ppm
                  </span>
                </span>
              </div>
              <div class="caption">
                Minimal Nutrisi
              </div>
            </div>
          </div>
        </div>
        <div style="min-height: 120px;">
          <div id="chart">
            <apexchart
              ref="chart"
              type="area"
              height="350"
              :options="chartOptions"
              :series="series"
            />
          </div>
        </div>
      </div>
      <!-- if nothing -->
      <div
        v-else-if="loadState"
        class="text-center my-auto"
      >
        <Loader />
      </div>
      <if-nothing v-else />
    </div>
  </v-card>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
import DataNotFound from '@/components/DataNotFound.vue'
import Loader from '@/components/ProgressCircle.vue'

export default {
  components: {
    apexchart: VueApexCharts,
    'if-nothing': DataNotFound,
    Loader
  },

  data: () => ({
    sensorData: {},
    series: [{
      name: 'Nutrisi (ppm)',
      data: []
    }],
    chartOptions: {
      chart: {
        height: 350,
        type: 'area',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        }
      },
      colors: ['#7cb342'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: [],
        labels: {
          datetimeUTC: false
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm:ss'
        }
      }
    }
  }),

  computed: {
    ...mapState('layout', ['isMobile', 'loadState'])
  },

  watch: {
    // call again the method if the route changes
    '$route': 'initialize'
  },

  created () {
    this.initialize()
  },

  destroyed () {
    console.log('destroy childresn sensor component')
  },

  methods: {
    initialize () {
      this.loadstate(true)
      // ganti jadi detail
      this.axios.get(`sensor-nutrisi/detail/${this.$route.params.id}`)
        .then(response => {
          const data = response.data.data
          console.log('widget data', data)
          this.series[0].data = data.series_data
          this.sensorData = data.sensor_data
          this.chartOptions.xaxis.categories = data.categories_data
          console.log('sensor data', this.sensorData)
          this.loadstate(false)
        })
        .catch(error => {
          console.log('error sensor detail', error)
        })
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    }
  }
}
</script>
