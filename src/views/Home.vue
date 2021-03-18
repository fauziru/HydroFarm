<template>
  <v-layout fill-height>
    <div class="d-flex flex-grow-1 flex-column">
      <div
        class="col-xl-4 col-12"
        :style=" isMobile ? 'padding: 0px!important;' : ''"
      >
        <!-- widget sensor -->
        <v-card
          class="d-flex flex-grow-1 h-full"
          color="white"
          rounded="xl"
          min-height="380"
          elevation="0"
        >
          <div
            class="d-flex flex-column flex-grow-1"
            style="position: relative;"
          >
            <v-card-title>
              <div>
                Sensor Nutrisi 1
              </div>
              <v-spacer />
              <v-btn
                class="primary--text"
                text
              >
                Sensor
              </v-btn>
            </v-card-title>
            <div class="px-4 pb-4">
              <div class="d-flex align-center">
                <div class="text-h4 primary--text">
                  <!-- mock -->
                  985 ppm
                </div>
                <v-spacer />
                <div class="d-flex flex-column text-right">
                  <div class="font-weight-bold">
                    <span>
                      <span class="warning--text">
                        <v-icon color="warning">mdi-waves</v-icon>
                        <!-- mock -->
                        900ppm
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
                  type="area"
                  height="350"
                  :options="chartOptions"
                  :series="series"
                />
              </div>
            </div>
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

export default {
  components: {
    apexchart: VueApexCharts
  },
  data: () => ({
    series: [
      {
        name: 'Nutris (ppm)',
        data: [31, 40, 28, 51, 42, 109, 100]
      }
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: 'area'
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
        categories: [
          '2018-09-19T00:00:00.000Z',
          '2018-09-19T01:30:00.000Z',
          '2018-09-19T02:30:00.000Z',
          '2018-09-19T03:30:00.000Z',
          '2018-09-19T04:30:00.000Z',
          '2018-09-19T05:30:00.000Z',
          '2018-09-19T06:30:00.000Z'
        ]
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        }
      }
    }
  }),
  computed: {
    ...mapState('layout', ['isMobile'])
  }
}
</script>
