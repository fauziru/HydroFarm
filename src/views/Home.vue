<template>
  <v-layout fill-height>
    <div class="d-flex flex-grow-1 flex-column">
      <div
        class="col-xl-4 col-12"
        :style=" isMobile ? 'padding: 0px!important;' : ''"
      >
        <!-- widget sensor -->
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
              <v-menu
                v-if="!isMobile"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <!-- button -->
                  <v-btn
                    class="primary--text"
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-leak</v-icon>
                    <div class="ml-1">
                      Sensor
                    </div>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in optionsSensor"
                    :key="index"
                    @click="changeWidget(item.id)"
                  >
                    <v-list-item-title>{{ item.name_sensor }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-bottom-sheet
                v-else
                scrollable
                v-model="bottomSheet"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="grey darken-1"
                    icon
                    depressed
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-leak</v-icon>
                  </v-btn>
                </template>
                <v-card class="rounded-t-xl">
                  <v-card-text style="height: 250px;">
                    <v-list>
                      <v-subheader>Pilih sensor</v-subheader>
                      <v-list-item
                        v-for="(item, index) in optionsSensor"
                        :key="index"
                        @click="changeWidget(item.id)"
                      >
                        <v-list-item-title>{{ item.name_sensor }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-bottom-sheet>
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
        <!-- /widget sensor -->
      </div>
    </div>
  </v-layout>
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
    bottomSheet: false,
    optionsSensor: [],
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
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
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
    ...mapState('layout', ['isMobile', 'loadState']),
    lastRead: {
      get () {
        return this.series[0].data.slice(0).splice(-1, 1).toString()
      }
    },
    defaultSensorWidget: {
      get () {
        return this.$store.state.readsensor.sensorWidgetId
      },
      set (value) {
        this.$store.commit('readsensor/setSensorWidgetId', value)
      }
    }
  },
  created () {
    this.initialize()
  },
  mounted () {
  },
  destroyed () {
    console.log('dashboard component destroyed')
    window.Echo.leave(`read.sensor.${this.defaultSensorWidget}`)
  },
  methods: {
    initialize () {
      this.loadstate(true)
      this.axios.get('sensor/option')
        .then(response => {
          this.optionsSensor = response.data.data
        })
      this.axios.get(`sensor-nutrisi/widget/${this.defaultSensorWidget}`)
        .then(response => {
          const data = response.data.data
          console.log('widget data', data)
          this.series[0].data = data.series_data
          this.sensorData = data.sensor_data
          this.chartOptions.xaxis.categories = data.categories_data
          console.log('sensor data', this.sensorData)
          this.listenRealDataSensor()
          this.loadstate(false)
        })
    },
    changeWidget (id) {
      console.log('change to id', id)
      window.Echo.leave(`read.sensor.${this.defaultSensorWidget}`)
      this.defaultSensorWidget = id
      this.series[0].data = []
      this.sensorData = {}
      this.chartOptions.xaxis.categories = []
      this.bottomSheet = false
      this.initialize()
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    },
    listenRealDataSensor () {
      console.log('real.data', this.defaultSensorWidget)
      window.Echo.private(`read.sensor.${this.defaultSensorWidget}`).listen('RealtimeDataSensor', read => {
        console.log('real data', read)
        // remove first array
        this.series[0].data.shift()
        this.chartOptions.xaxis.categories.shift()
        // add newest data of read sensor
        this.series[0].data.push(read.data.read_nutrisi)
        this.chartOptions.xaxis.categories.push(read.data.created_at)
        // this.$refs.chart.updateSeries([{ data: read.data.read_nutrisi }])
        this.$refs.chart.updateSeries([{
          data: this.series[0].data
        }])
      })
    }
  }
}
</script>
