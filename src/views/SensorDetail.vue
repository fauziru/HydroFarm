<template>
  <!-- <v-card class="elevation-1 rounded-xl">
    <v-card-title>
      {{  this.$route.params.id }}
    </v-card-title>
  </v-card> -->
  <div
    class="col-xl-4 col-12"
    :style=" isMobile ? 'padding: 0px!important;' : ''"
  >
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
            {{ sensorData.name_sensor }} &mdash;
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
          <!-- filter dialog -->
          <v-dialog
            v-model="dialog"
            :fullscreen="isMobile ? true : false "
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                icon
                depressed
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-filter-outline</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-toolbar
                dark
                color="primary"
              >
                <v-btn
                  icon
                  dark
                  @click="dialog = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Filters</v-toolbar-title>
                <v-spacer />
                <v-toolbar-items>
                  <v-btn
                    v-if="radioGroup > 0"
                    dark
                    text
                    @click="resetFilter"
                  >
                    Reset
                  </v-btn>
                  <v-btn
                    dark
                    text
                    @click="filtered"
                  >
                    Terapkan
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-list
                three-line
                subheader
              >
                <v-subheader>Waktu</v-subheader>
                <v-radio-group v-model="radioGroup">
                  <v-list-item
                    v-for="(item, index) in filterWaktu"
                    :key="index"
                  >
                    <v-list-item-action>
                      <v-radio :value="index" />
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-radio-group>
                <v-list-item>
                  <v-dialog
                    ref="dialog"
                    v-model="datepickerModal"
                    :return-value.sync="filterDate"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="filterDate"
                        label="Tanggal"
                        prepend-icon="mdi-calendar"
                        outlined
                        readonly
                        :error-messages="dateErrors"
                        :disabled="radioGroup !== 3"
                        v-bind="attrs"
                        v-on="on"
                        @input="$v.filterDate.$touch"
                      />
                    </template>
                    <v-date-picker
                      v-model="filterDate"
                      range
                      scrollable
                    >
                      <v-spacer />
                      <v-btn
                        text
                        color="primary"
                        @click="datepickerModal = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(filterDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-list-item>
              </v-list>
            </v-card>
          </v-dialog>
          <!-- /filter dialog -->
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
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
import { required } from 'vuelidate/lib/validators'
import DataNotFound from '@/components/DataNotFound.vue'
import Loader from '@/components/ProgressCircle.vue'

export default {
  components: {
    apexchart: VueApexCharts,
    'if-nothing': DataNotFound,
    Loader
  },

  data: () => ({
    radioGroup: 0,
    dialog: false,
    datepickerModal: false,
    filterWaktu: [
      { title: 'Hari ini', subtitle: 'Menampilkan semua data pada hari ini', endpoint: 'today' },
      { title: 'Minggu ini', subtitle: 'Menampilkan semua data pada minggu ini', endpoint: 'this-week' },
      { title: 'Bulan ini', subtitle: 'Menampilkan semua data pada bulan ini', endpoint: 'this-month' },
      { title: 'Pilih tanggal', subtitle: 'Menampilkan semua data pada tanggal yang dipilih', endpoint: 'date' }
    ],
    filterDate: null,
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

  validations: {
    filterDate: {
      required
    }
  },

  computed: {
    ...mapState('layout', ['isMobile', 'loadState']),
    lastRead: {
      get () {
        return this.series[0].data.slice(0).splice(-1, 1).toString()
      }
    },
    dateErrors () {
      const errors = []
      if (!this.$v.filterDate.$dirty) return errors
      !this.$v.filterDate.required && errors.push('tanggal dibutuhkan!')
      return errors
    }
  },

  watch: {
    // call again the method if the route changes
    // '$route': 'initialize'
    $route (to, from) {
      this.resetFilter()
      this.initialize()
    }
  },

  created () {
    this.initialize()
  },

  destroyed () {
    console.log('destroy childresn sensor component')
  },

  methods: {
    initialize (endpoint = 'today') {
      this.loadstate(true)

      const apiEndpoint = endpoint === 'date'
        ? `${this.$route.params.id}/${endpoint}/${this.filterDate[0]}/${this.filterDate[1]}`
        : `${this.$route.params.id}/${endpoint}`

      this.axios.get(`sensor-nutrisi/detail/${apiEndpoint}`)
        .then(response => {
          const data = response.data.data
          console.log('detail read data', data)
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
    },
    filtered () {
      if (this.radioGroup === 3 && this.$v.filterDate.$invalid) {
        this.$store.dispatch('layout/alertFire', {
          type: 'error',
          message: 'Tanggal harus diisi!'
        })
      } else {
        console.log('filtered endpoint', this.filterWaktu[this.radioGroup].endpoint)
        this.dialog = false
        this.initialize(this.filterWaktu[this.radioGroup].endpoint)
      }
    },
    resetFilter () {
      this.radioGroup = 0
      this.filterDate = null
    }
  }
}
</script>
