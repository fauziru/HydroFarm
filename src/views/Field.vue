<template>
  <div class="d-flex flex-column flex-grow-1">
    <!-- <img :src="sourceImage + 'public/images/layoutExample.jpg'"/> -->
    <!-- <div
      class="info"
      style="height: 15%"
    >
      <span>Center: {{ center }}</span>
      <span>Bounds: {{ bounds }}</span>
      <v-icon>mdi-wifi-marker</v-icon>
    </div> -->
    <router-view />
    <div v-if="!this.$route.params.id">
      <v-spacer />
      <!-- add or edit item -->
      <v-dialog
        v-model="dialogNewNode"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{ editedItemTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-form :disabled="loadState">
                <!-- {{ $v }} -->
                <v-row v-if="editMode">
                  <v-select
                    v-model="editedIndex"
                    :items="nodes"
                    outlined
                    :filled="editedIndex !== -1"
                    item-value="id"
                    item-text="name_node"
                    prepend-icon="mdi-leak"
                    label="Pilih node ..."
                  />
                </v-row>
                <v-row>
                  <v-text-field
                    v-if="!editMode"
                    v-model="editedItem.name_node"
                    outlined
                    label="Name"
                    :error-messages="nameErrors"
                    @input="$v.editedItem.name_node.$touch"
                  />
                </v-row>
                <v-container
                  v-if="!editMode"
                  fluid
                >
                  <p>Pilih sensor:</p>
                  <v-checkbox
                    v-for="sensor in daftarSensors"
                    :key="sensor"
                    v-model="editedItem.sensors"
                    :label="daftarSensor(sensor)"
                    :value="sensor"
                  />
                </v-container>
                <v-row>
                  <v-text-field
                    v-model="editedItem.lat"
                    outlined
                    label="Latitude"
                    :error-messages="latErrors"
                    @input="$v.editedItem.lat.$touch"
                  />
                </v-row>
                <v-row>
                  <v-text-field
                    v-model="editedItem.lng"
                    outlined
                    :error-messages="lngErrors"
                    label="Longitude"
                    @input="$v.editedItem.lng.$touch"
                  />
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              :disabled="loadState"
              @click="close('dialogNewNode')"
            >
              Batalkan
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :disabled="loadState"
              @click="save"
            >
              {{ loadState ? 'Menyimpan...' : 'Simpan' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- add or edit item -->
      <!-- banner -->
      <banner-front
        v-if="!layout && !loadState"
        title="Layout belum tersedia"
        icon="mdi-map-search"
        btn-name="upload"
        :callback="linkToLayout"
      />
      <banner-front
        v-if="nodes.length === 0 && !loadState"
        title="Node belum tersedia"
        icon="mdi-leak"
        :callback="linkToLayout"
      />
      <!-- /banner -->
      <!-- layout -->
      <l-map
        class="map"
        :style="{ cursor: computedCursor, height: computedHeight, 'z-index': 1 }"
        :crs="crs"
        :center="center"
        @click="addOrEditNode"
      >
        <l-image-overlay
          id="imageLayout"
          :url="sourceImage"
          :bounds="bounds"
        />
        <!-- <l-marker v-for="star in stars" :lat-lng="star" :key="star.name">
          <l-popup :content="star.name" />
        </l-marker> -->
        <!-- custom marker -->
        <l-marker
          v-for="node in nodes"
          ref="marker"
          :key="node.id"
          :lat-lng="node"
          @click="openDashboard(node.id, node.link)"
        >
          <!-- tooltip -->
          <l-tooltip>
            <v-card
              elevation="5"
              width="200px"
            >
              <v-card-text>
                <div>
                  <!-- Nilai terakhir -->
                  <span class="mr-1">·</span>
                  {{ colormsgNodeIcon(node.status, node.konektivitas).msg }}
                </div>
                <!-- nama node -->
                <p class="text-h4 text--primary">
                  {{ node.name_node }}
                </p>
                <!-- last read value -->
                <v-alert
                  v-for="(item, i) in node.last_reads"
                  :key="i"
                  border="right"
                  color="primary"
                  dense
                  shaped
                  icon="mdi-broadcast"
                  type="success"
                >
                  {{ `${item[Object.keys(item)[0]]} ${log(Object.keys(item)[0])}` }}
                </v-alert>
              </v-card-text>
            </v-card>
          </l-tooltip>
          <!-- /tooltip -->
          <!-- icon -->
          <l-icon :icon-anchor="[10, 0]">
            <v-icon
              ref="icon"
              :color="colormsgNodeIcon(node.status, node.konektivitas).color"
              aria-label="Open Node"
              @click="openDashboard()"
            >
              mdi-wifi-marker
            </v-icon>
          </l-icon>
          <!-- /icon -->
        </l-marker>
        <!-- /custom marker -->

        <!-- control map -->
        <l-control
          :position="'bottomleft'"
          class="custom-control-watermark"
        >
          Greenhouse Layout
        </l-control>
        <l-control v-if="user.role === 'admin'" :position="'topright'">
          <v-switch
            v-model="addNewMode"
            :label="`Tambah baru: ${addNewMode ? 'Aktif' : 'Mati'}`"
            inset
            @change="addMode()"
          />
          <v-switch
            v-model="editMode"
            :label="`Edit: ${editMode ? 'Aktif' : 'Mati'}`"
            inset
            @change="editModeFn()"
          />
        </l-control>
        <!-- /control map -->
      </l-map>
      <!-- /layout -->
      <!-- group statistik -->
      <div :style="{display: computedflex}">
        <!-- Informasi-sensor-online -->
        <div class="col-md-6 col-xl-4 col-12">
          <v-card
            class="d-flex flex-grow-1 h-full elevation-1"
            color="white"
            rounded="xl"
            min-height="140"
          >
            <div
              v-if="sensorOnline.online === null"
              class="text-center my-auto mx-auto"
            >
              <Loader />
            </div>
            <div
              v-else
              class="d-flex flex-column flex-grow-1"
              style="position: relative"
            >
              <v-card-title>
                Sensor Online
                <v-spacer />
                <v-btn
                  icon
                  depressed
                  x-small
                  aria-label="Reload"
                  @click="initializeSensorOnline()"
                >
                  <v-icon>
                    mdi-reload
                  </v-icon>
                </v-btn>
              </v-card-title>
              <div>
                <div class="px-4 pb-4">
                  <div class="d-flex align-center">
                    <div class="display-1">
                      {{ `${sensorOnline.online} dari ${sensorOnline.total}` }}
                    </div>
                    <v-spacer />
                    <v-hover v-slot="{ hover }">
                      <router-link
                        :to="{ name: 'sensor' }"
                        style="text-decoration: none"
                      >
                        <v-icon
                          :color="hover ? 'primary' : 'secondary'"
                          :class="{ 'on-hover': hover }"
                          :large="!hover"
                          :x-large="hover"
                        >
                          mdi-leak
                        </v-icon>
                      </router-link>
                    </v-hover>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </div>
        <!-- /Informasi-sensor-online -->
        <!-- Informasi-jumlah-user -->
        <div class="col-md-6 col-xl-4 col-12">
          <v-card
            class="d-flex flex-grow-1 h-full elevation-1"
            color="white"
            rounded="xl"
            min-height="140"
          >
            <div
              v-if="userTerdaftar === null"
              class="text-center my-auto mx-auto"
            >
              <Loader />
            </div>
            <div
              v-else
              class="d-flex flex-column flex-grow-1"
              style="position: relative"
            >
              <v-card-title>
                Jumlah User Terdaftar
                <v-spacer />
                <v-btn
                  icon
                  depressed
                  x-small
                  aria-label="Reload"
                  @click="initializeUserTerdaftar()"
                >
                  <v-icon>
                    mdi-reload
                  </v-icon>
                </v-btn>
              </v-card-title>
              <div>
                <div class="px-4 pb-4">
                  <div class="d-flex align-center">
                    <div class="display-1">
                      {{ userTerdaftar }}
                    </div>
                    <v-spacer />
                    <v-hover v-slot="{ hover }">
                      <router-link
                        :to="{ name: 'user' }"
                        style="text-decoration: none"
                      >
                        <v-icon
                          :color="hover ? 'primary' : 'secondary'"
                          :class="{ 'on-hover': hover }"
                          :large="!hover"
                          :x-large="hover"
                        >
                          mdi-account-group-outline
                        </v-icon>
                      </router-link>
                    </v-hover>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </div>
        <!-- /Informasi-jumlah-user -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { LMap, LImageOverlay, LMarker, LIcon, LTooltip, LControl } from 'vue2-leaflet'
import { required, maxValue } from 'vuelidate/lib/validators'
import Loader from '@/components/ProgressCircle.vue'
import L from 'leaflet'
import BannerFront from '../components/BannerFront.vue'

export default {
  components: {
    'l-map': LMap,
    'l-image-overlay': LImageOverlay,
    'l-marker': LMarker,
    // 'l-popup': LPopup,
    'l-icon': LIcon,
    'l-tooltip': LTooltip,
    'l-control': LControl,
    Loader,
    BannerFront
  },
  data: () => ({
    daftarSensors: ['tds', 'tds_t', 'temp,hum', 'light', 'height'],
    lastReads: [
      { tipe: 'RH', key: 'hum', sufix: ' %' },
      { tipe: 'Temp', key: 'tds_t', sufix: ' °C' },
      { tipe: 'Temp', key: 'temp', sufix: ' °C' },
      { tipe: 'TDS', key: 'tds', sufix: ' ppm' },
      { tipe: 'Lux', key: 'light', sufix: ' lux' },
      { tipe: 'Height', key: 'height', sufix: ' cm' }
    ],
    sensorOnline: {
      online: null,
      total: null
    },
    userTerdaftar: 0,
    editedItem: {
      name_node: '',
      sensors: [],
      lat: 0,
      lng: 0
    },
    defaultItem: {
      name_node: '',
      sensors: [],
      lat: 0,
      lng: 0
    },
    layout: null,
    nodes: [],
    addNewMode: false,
    editMode: false,
    cursor: 'move',
    dialogNewNode: false,
    editedIndex: -1,
    center: [484.787029, 493.194159],
    bounds: [
      [0, 0],
      [1000, 1000] // y, x
    ],
    sourceImage: '',
    crs: L.CRS.Simple
  }),
  validations: {
    editedItem: {
      name_node: {
        required
      },
      lat: {
        required,
        maxValue: maxValue(1000)
      },
      lng: {
        required,
        maxValue: maxValue(1000)
      },
      sensors: {
        required
      }
    }
  },
  computed: {
    ...mapState('layout', ['isMobile', 'loadState']),
    ...mapState('auth', ['user']),
    editedItemTitle () {
      return !this.editMode ? 'Node Baru' : 'Node Ubah'
    },
    computedCursor () {
      return this.cursor
    },
    computedHeight () {
      return this.isMobile ? '78vh' : '78vh'
    },
    computedflex () {
      return this.isMobile ? '' : 'flex'
    },
    nodeOptions () {
      console.log('nodes options')
      return this.nodes.map((node) => node.name_layout)
    },
    // computedMargin () {
    //   return this.isMobile ?? '-10px'
    // },
    nameErrors () {
      const errors = []
      if (!this.$v.editedItem.name_node.$dirty) return errors
      !this.$v.editedItem.name_node.required && errors.push('nama node dibutuhkan!')
      return errors
    },
    latErrors () {
      const errors = []
      if (!this.$v.editedItem.lat.$dirty) return errors
      !this.$v.editedItem.lat.required && errors.push('koordinat dibutuhkan!')
      return errors
    },
    lngErrors () {
      const errors = []
      if (!this.$v.editedItem.lng.$dirty) return errors
      !this.$v.editedItem.lng.required && errors.push('koordinat dibutuhkan!')
      return errors
    },
    sensorsError () {
      const errors = []
      if (!this.$v.editedItem.sensors.$dirty) return errors
      !this.$v.editedItem.sensors.required && errors.push('harus ada sensor yang dipilih!')
      return errors
    }
  },
  watch: {
    // call again the method if the route changes
    // '$route': 'initialize'
    $route (to, from) {
      this.initialize()
      this.initializeSensorOnline()
      this.initializeUserTerdaftar()
    }
  },
  created () {
    if (!this.$route.params.id) {
      this.initialize()
      this.initializeSensorOnline()
      this.initializeUserTerdaftar()
    }
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    })
    this.realtimeEventListener()
  },
  updated () {
    this.changeCursor()
    if (this.editMode && this.editedIndex !== -1) {
      const node = this.nodes.filter((node) => this.editedIndex === node.id)[0]
      this.editedItem = Object.assign(this.editedItem, { sensors: node.last_reads, name_node: node.name_node })
    }
  },
  beforeDestroy () {
    this.removeRealtimeEventListener()
  },
  methods: {
    async initialize () {
      this.loadstate(true)
      // add axios get
      try {
        const { data } = await this.axios.get('node')
        if (data.data.layoutUrl) {
          this.sourceImage = process.env.VUE_APP_IMAGE_BASE + 'storage/images/layout/' + data.data.layoutUrl
          this.layout = data.data.layoutUrl
        }
        this.nodes = data.data.nodes
        console.log('data sensor', this.nodes)
        this.loadstate(false)
      } catch (error) {
        this.loadstate(false)
        console.log('error store data', error)
        this.alert('Terjadi kesalahan pada server!', 'error')
      }
    },
    initializeSensorOnline () {
      this.sensorOnline.online = null
      this.axios.get('sensor/connect-status')
        .then(response => {
          const data = response.data.data
          this.sensorOnline.online = data.online
          this.sensorOnline.total = data.from
        })
    },
    initializeUserTerdaftar () {
      this.userTerdaftar = null
      this.axios.get('user/get/count')
        .then(response => { this.userTerdaftar = response.data.data })
    },
    close (dialog) {
      this[dialog] = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.$v.$reset()
      })
    },
    async saveLayout () {
      try {
        this.loadstate(true)
        this.editedItem.sensors = this.splitDoubleRead(this.editedItem.sensors)
        await this.axios.post('node', this.editedItem)
        this.loadstate(false)
        this.close('dialogNewNode')
        this.alert('Berhasil menambahkan node baru!', 'success')
      } catch (error) {
        console.log('error store data', error)
        this.alert('Terjadi kesalahan pada server!', 'error')
        this.loadstate(false)
      }
    },
    async updateLayout () {
      try {
        this.loadstate(true)
        await this.axios.put(`node/${this.editedIndex}`, this.editedItem)
        this.close('dialogNewNode')
        this.alert('Berhasil memperbarui node!', 'success')
        this.loadstate(false)
      } catch (error) {
        this.alert('Terjadi kesalahan pada server!', 'error')
        this.loadstate(false)
      }
      this.editedItem = Object.assign(this.editedItem, this.defaultItem)
      this.editedIndex = -1
    },
    save () {
      if (this.$v.editedItem.$invalid) {
        this.alert('Semua kolom harus diisi!', 'error')
      } else {
        // console.log(this.editedItem, 'tes')
        if (!this.editMode) {
          this.saveLayout()
        } else {
          this.updateLayout()
        }
      }
    },
    openDashboard (id, link) {
      // alert(id)
      // console.log('marker clicked')
      this.$router.push({path: link})
    },
    addOrEditNode (event) {
      if (this.addNewMode || this.editMode) {
        this.editedItem.lat = event.latlng.lat
        this.editedItem.lng = event.latlng.lng
        this.dialogNewNode = true
      }
    },
    changeCursor () {
      this.cursor = this.addNewMode || this.editMode ? 'crosshair' : 'move'
    },
    addMode () {
      this.editMode = false
    },
    editModeFn () {
      this.addNewMode = false
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    },
    colormsgNodeIcon (status, konektivitas) {
      if (konektivitas === 0) {
        return { color: 'black', msg: 'Node tidak menyala!' }
      } else {
        if (status === 0) {
          return { color: 'yellow', msg: 'Node perlu diperhatikan!' }
        } else {
          return { color: 'secondary', msg: 'Node Aktif' }
        }
      }
    },
    switchSensorTipe (tipe, on) {
      if (tipe === '' || !tipe) return 'Nan'
      const rtnTitle = {
        'tds': {
          'title': 'Sensor Tds (Kadar Nutrisi)',
          'suffix': ' ppm'
        },
        'tds_t': {
          'title': 'Sensor Dallas (Suhu nutrisi)',
          'suffix': ' °C'
        },
        'light': {
          'title': 'Sensor BH1750 (Intensitas Cahaya)',
          'suffix': ' lux'
        },
        'temp': {
          'title': 'Sensor DHT22 (Suhu Lingkungan)',
          'suffix': ' °C'
        },
        'hum': {
          'title': 'Sensor DHT22 (Kelembaban Lingkungan)',
          'suffix': ' %'
        },
        'height': {
          'title': 'Sensor VL530XV2 (Permukaan Air)',
          'suffix': ' cm'
        }
      }
      // console.log('Type On', tipe, on, rtnTitle[tipe])
      return rtnTitle[tipe][on]
    },
    daftarSensor (tipe) {
      if (tipe === '' || !tipe) return 'Nan'
      const rtnTitle = {
        'tds': {
          'title': 'Sensor Tds (Kadar Nutrisi)'
        },
        'tds_t': {
          'title': 'Sensor Dallas (Suhu nutrisi)'
        },
        'light': {
          'title': 'Sensor BH1750 (Intensitas Cahaya)'
        },
        'temp,hum': {
          'title': 'Sensor DHT22 (Suhu Lingkungan) & (Kelembaban Lingkungan)'
        },
        'height': {
          'title': 'Sensor VL530XV2 (Permukaan Air)'
        }
      }
      return rtnTitle[tipe]['title']
    },
    splitDoubleRead (sensors) {
      let tempArr = []
      sensors.forEach(sensor => {
        tempArr = [...tempArr, ...sensor.split(',')]
      })
      return tempArr
    },
    alert (message, type) {
      this.$store.dispatch('layout/alertFire', {
        type: type,
        message: message
      })
    },
    log (tes) {
      if (tes !== '') {
        let tesS = this.switchSensorTipe(tes, 'suffix')
        // console.log('tes ti', tes, typeof (tes), 'suffix', tesS)
        return tesS
      } else {
        return 'Nan'
      }
    },
    linkToLayout () {
      this.$router.push({path: '/setting/layout'})
    },
    updateBounds () {
      const image = document.getElementsByClassName('leaflet-image-layer')[0]
      console.log('image size', image.naturalHeight, image.naturalWidth)
      this.bounds[1] = [image.naturalHeight, image.naturalWidth]
    },
    realtimeEventListener () {
      window.Echo.private('events')
        .listen('UpdateLayout', (event) => {
          const { data } = event
          this.sourceImage = process.env.VUE_APP_IMAGE_BASE + 'storage/images/layout/' + data
        })
        .listen('UpdateNode', (event) => {
          const newNode = event.data
          const indexNode = this.nodes.findIndex(node => node.id === newNode.id)
          indexNode === -1 ? this.nodes.push(newNode) : this.nodes.splice(indexNode, 1, newNode)
        })
        .listen('DeleteNode', (event) => {
          const newNode = event.data
          const indexNode = this.nodes.findIndex(node => node.id === newNode.id)
          if (indexNode !== -1) this.nodes.splice(indexNode, 1)
        })
    },
    removeRealtimeEventListener () {
      window.Echo.private('events')
        .stopListening('UpdateLayout')
        .stopListening('UpdateNode')
        .stopListening('DeleteNode')
    }
  }
}
</script>

<style scoped>
.map {
  /* height: 700px; */
  border-radius: 8px;
  box-shadow: 0 3px 10px -2px rgb(85 85 85 / 8%), 0 2px 20px 0 rgb(85 85 85 / 6%), 0 1px 30px 0 rgb(85 85 85 / 3%) !important;
}
.leaflet-clickable {
  cursor: crosshair !important;
}
.custom-control-watermark {
  font-size: 200%;
  font-weight: bolder;
  color: #aaa;
  text-shadow: #555;
}
</style>
