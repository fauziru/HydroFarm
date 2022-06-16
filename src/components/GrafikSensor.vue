<template>
  <div :class="`col-xl-4 col-12 ${fullWidth}`">
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
        <!-- header -->
        <v-card-title v-if="!loadState">
          {{ sensor.name_sensor }} &mdash;
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                class="caption"
                v-bind="attrs"
                v-on="on"
              >
                {{ sensor.last_read_time }}
              </span>
            </template>
            <span>{{ sensor.last_read_time | cD }}</span>
          </v-tooltip>
          <v-spacer />
          <v-btn
            depressed
            x-small
            color="secondary"
            link
            :href="`/sensor/${sensor.id}`"
          >
            Lihat Detail
          </v-btn>
        </v-card-title>
        <!-- /header -->
        <!-- body -->
        <!-- grafik -->
        <div v-if="series[0].data.length > 0 && !loadState">
          <div class="px-4 pb-4">
            <div class="d-flex align-center">
              <div class="text-h4 primary--text">
                <!-- mock -->
                {{ `${series[0].data.slice(-1)[0].y} ${sensorTipeCondition(sensor.tipe).satuan}` }}
              </div>
              <v-spacer />
              <div class="d-flex flex-column text-right">
                <div class="font-weight-bold">
                  <!-- threshold -->
                  <span>
                    <span class="warning--text">
                      <v-icon color="warning">{{ sensorTipeCondition(sensor.tipe).icon }}</v-icon>
                      <!-- mock -->
                      {{ `batas atas: ${sensor.batas.max} ${sensorTipeCondition(sensor.tipe).satuan}` }}
                    </span>
                    <span class="warning--text">
                      <v-icon color="warning">{{ sensorTipeCondition(sensor.tipe).icon }}</v-icon>
                      <!-- mock -->
                      {{ `batas bawah: ${sensor.batas.min} ${sensorTipeCondition(sensor.tipe).satuan}` }}
                    </span>
                  </span>
                </div>
                <div class="caption">
                  batas notifikasi
                </div>
              </div>
            </div>
          </div>
          <div style="min-height: 120px;">
            <div id="chart">
              <apexchart
                ref="realChart"
                type="area"
                :height="height"
                :options="chartOptions"
                :series="series"
              />
            </div>
          </div>
        </div>
        <!-- Loader -->
        <Loader
          v-else-if="loadState"
          child-class="text-center my-auto"
        />
        <!-- if nothing -->
        <if-nothing v-else />
        <!-- /body -->
      </div>
    </v-card>
    <!-- /widget sensor -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import VueApexCharts from 'vue-apexcharts'
import DataNotFound from '@/components/DataNotFound.vue'
import Loader from '@/components/ProgressCircle.vue'

export default {
  components: {
    // apexchart: VueApexCharts,
    'if-nothing': DataNotFound,
    Loader
  },
  props: {
    sensor: {
      type: Object,
      default: () => {}
    },
    height: {
      type: Number,
      default: 350
    },
    tipe: {
      type: String,
      default: 'nan'
    },
    fullwidth: {
      type: Boolean,
      default: false
    },
    read: {
      type: Array,
      default: () => []
    },
    nodeid: {
      type: String,
      default: ''
    }
  },
  data: (instance) => ({
    series: [{
      name: instance.sensorTipeCondition(instance.sensor.tipe).seriesName,
      data: []
    }],
    chartOptions: {
      chart: {
        height: 350,
        type: 'area',
        animations: {
          enabled: false
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: [instance.sensorTipeCondition(instance.sensor.tipe).color],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        // categories: [],
        labels: {
          datetimeUTC: true
        }
      },
      tooltip: {
        x: {
          format: 'yy/MM/dd HH:mm:ss'
        }
      }
    }
  }),
  mqtt: {
    'node/+/+' (data, topic) {
      console.log('topic', topic.split('/'), this.sensor)
      if (topic.split('/')[1] === this.nodeid && topic.split('/')[2] === this.tipe) {
        // console.log('topic:', 'template/12345')
        // console.log(data, 'Data from mqtt')
        var enc = new TextDecoder('utf-8')
        var arr = new Uint8Array(data)
        // console.log(enc.decode(arr), 'After convert')
        this.updateData(enc.decode(arr))
      }
    }
  },
  computed: {
    ...mapState('layout', ['isMobile', 'loadState']),
    fullWidth () {
      return this.fullwidth ? '' : 'col-md-6'
    }
  },
  created () {
    this.initialize()
  },
  mounted () {
    this.$mqtt.subscribe(`node/${this.nodeid}/${this.tipe}`)
  },
  methods: {
    async initialize () {
      // console.log('series data', this.series)
      // const data = await this.sensor.data_set.series_data
      this.loadstate(false)
    },
    sensorTipeCondition (tipe) {
      const condition = {
        'light': {
          seriesName: 'Cahaya (lux)',
          satuan: ' lux',
          color: '#F18805',
          icon: ''
        },
        'tds': {
          seriesName: 'Nutrisi (ppm)',
          satuan: ' ppm',
          color: '#7cb342',
          icon: 'mdi-dots-hexagon'
        },
        'tds_t': {
          seriesName: 'Suhu larutan (°C)',
          satuan: ' °C',
          color: '#7B9E89',
          icon: ''
        },
        'temp': {
          seriesName: 'Suhu lingkungan (°C)',
          satuan: ' °C',
          color: '#385F71',
          icon: ''
        },
        'hum': {
          seriesName: 'Kelembaban (%)',
          satuan: ' %',
          color: '#385F71',
          icon: ''
        },
        'height': {
          seriesName: 'Jarak (cm)',
          satuan: ' cm',
          color: '#325E70',
          icon: ''
        }
      }
      return condition[tipe]
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    },
    updateData (value) {
      // console.log('data to update', this.series[0].data)
      const tempData = this.series[0].data
      tempData.push({x: new Date().toISOString(), y: value})
      if (tempData.length > 10) {
        tempData.shift()
      }
      this.series = [{
        name: this.sensorTipeCondition(this.sensor.tipe).seriesName,
        data: tempData
      }]
      // const lengthData = this.$data.series[0].data.length
      // const lengthX = this.chartOptions.xaxis.categories.length
      // this.series[0].data.unshift(value)
      // this.chartOptions.xaxis.categories.unshift(new Date().toISOString())
    }
  }
}
</script>

<style>
</style>
