<template>
  <div class="d-flex flex-column flex-grow-1">
    <router-view />
    <div
      v-if="!this.$route.params.id"
      class="col-xl-4 col-12"
      :style=" isMobile ? 'padding: 0px!important;' : ''"
    >
      <div class="d-flex align-center py-3">
        <div class="display-1">
          Sensor
        </div>
        <v-spacer />
        <!-- add item -->
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <!-- <template v-slot:activator="{ on, attrs}">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              <div class="text-capitalize">
                Tambah Sensor
              </div>
            </v-btn>
          </template> -->
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form :disabled="loadState">
                  <v-row>
                    <v-text-field
                      v-model="editedItem.name_sensor"
                      outlined
                      :error-messages="nameErrors"
                      label="Sensor name"
                      @input="$v.editedItem.name_sensor.$touch"
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.batas.max"
                      outlined
                      :error-messages="batasErrors"
                      label="Batas Maksimal"
                      @input="$v.editedItem.batas.max.$touch"
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.batas.min"
                      outlined
                      :error-messages="batasErrors"
                      label="Batas Minimal"
                      @input="$v.editedItem.batas.min.$touch"
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
                @click="close('editNew')"
              >
                Batalkan
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                :disabled="loadState"
                @click="save"
              >
                Simpan
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- add item -->
      </div>
      <!-- tabel sensor -->
      <v-data-table
        :headers="headers"
        :items="sensors"
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
            <!-- delete dialog -->
            <v-dialog
              v-model="dialogDelete"
              max-width="500px"
            >
              <v-card>
                <v-card-title class="headline">
                  Ingin menghapus data ini?
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue darken-1"
                    text
                    :disabled="loadState"
                    @click="close('delete')"
                  >
                    Batalkan
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    :disabled="loadState"
                    @click="deleteItemConfirm"
                  >
                    OK
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- /delete dialog -->
          </v-toolbar>
        </template>

        <template v-slot:[`item.id`]="{ item, index }">
          <v-tooltip
            right
            close-delay="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on"
              >{{ index + 1 }}</span>
            </template>
            <m-copiedlabel :text="item.id" />
          </v-tooltip>
        </template>

        <template v-slot:[`item.batas`]="{ item }">
          {{ `max: ${item.batas.max}, min: ${item.batas.min}` }}
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="item.status ? 'green' : 'red'"
            dark
          >
            {{ item.status ? 'connected' : 'disconnected' }}
          </v-chip>
        </template>

        <template v-if="user.role === 'admin'" v-slot:[`item.actions`]="{ item }">
          <v-btn
            icon
            depressed
            link
            :to="item.link"
          >
            <v-icon small>
              mdi-dots-hexagon
            </v-icon>
          </v-btn>

          <v-btn
            icon
            depressed
          >
            <v-icon
              small
              @click="editItem(item, 'editNew')"
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <!-- <v-btn
            icon
            depressed
          >
            <v-icon
              small
              @click="editItem(item, 'delete')"
            >
              mdi-delete
            </v-icon>
          </v-btn> -->
        </template>

        <template v-slot:no-data>
          <Loader v-if="loadState" />
          <no-data
            v-else
            :reload-callback="initialize"
          />
        </template>
      </v-data-table>
      <!-- /tabel sensor -->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { required, minLength, maxValue } from 'vuelidate/lib/validators'
import CopiedLabel from '@/components/CopiedLabel.vue'
import Loader from '@/components/ProgressCircle.vue'
import NoData from '../components/NoData.vue'

export default {
  components: {
    Loader,
    'm-copiedlabel': CopiedLabel,
    NoData
  },
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'No.', value: 'id' },
      { text: 'Sensor', align: 'start', sortable: false, value: 'name_sensor' },
      { text: 'Batas', value: 'batas' },
      { text: 'Node', value: 'node' },
      { text: 'Status', value: 'status' },
      { text: 'Bacaan terakhir', value: 'last_read' },
      { text: '', value: 'actions', sortable: false }
    ],
    sensors: [],
    editedIndex: -1,
    editedItem: {
      name_sensor: '',
      batas: {
        max: 0,
        min: 0
      }
    },
    defaultItem: {
      name_sensor: '',
      batas: {
        max: 0,
        min: 0
      }
    }
  }),
  validations: {
    editedItem: {
      name_sensor: {
        required
      },
      batas: {
        max: {
          required,
          minLength: minLength(1),
          maxValue: maxValue(99999)
        },
        min: {
          required,
          minLength: minLength(1),
          maxValue: maxValue(99999)
        }
      }
    }
  },
  computed: {
    ...mapState('layout', ['isMobile', 'loadState']),
    ...mapState('auth', ['user']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    nameErrors () {
      const errors = []
      if (!this.$v.editedItem.name_sensor.$dirty) return errors
      !this.$v.editedItem.name_sensor.required && errors.push('nama sensor dibutuhkan!')
      return errors
    },
    batasErrors () {
      const errors = []
      if (!this.$v.editedItem.batas.max.$dirty || !this.$v.editedItem.batas.min.$dirty) {
        return errors
      }
      if (!this.$v.editedItem.batas.max.required || !this.$v.editedItem.batas.min.required) {
        errors.push('minimal batas dibutuhkan!')
      }
      if (!this.$v.editedItem.batas.max.minLength || !this.$v.editedItem.batas.min.minLength) {
        errors.push('Batas minimal dan maksimal tidak boleh kosong!')
      }
      if (!this.$v.editedItem.batas.max.maxValue || !this.$v.editedItem.batas.min.maxValue) {
        errors.push('Nilai minimal nutrisi tidak bisa lebih dari 9999!')
      }
      return errors
    }
  },

  watch: {
    dialog (val) {
      val || this.close('editNew')
    },
    dialogDelete (val) {
      val || this.close()
    }
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
      this.sensors = []
      this.loadstate(true)
      // add axios get
      try {
        const { data } = await this.axios.get('sensor')
        this.sensors = data.data
        console.log('data sensor', this.sensors)
        this.loadstate(false)
      } catch (error) {
        this.loadstate(false)
        console.log('error store data', error)
        this.alertFire({ type: 'error', message: 'Terjadi kesalahan pada server!' })
      }
    },
    editItem (item, mode) {
      this.editedIndex = this.sensors.indexOf(item)
      this.editedItem = Object.assign({}, item)
      mode === 'editNew'
        ? this.dialog = true
        : this.dialogDelete = true
    },
    deleteItemConfirm () {
      // add axios.delete
      this.loadstate(true)
      this.axios.delete(`sensor/${this.editedItem.id}`)
        .then(response => {
          console.log('delete item', response)
          this.sensors.splice(this.editedIndex, 1)
          this.loadstate(false)
          this.close()
        })
        .catch(error => {
          this.loadstate(false)
          console.log('error delete data', error)
          this.alertFire({ type: 'error', message: 'Terjadi kesalahan pada server!' })
        })
    },
    close (mode) {
      mode === 'editNew'
        ? this.dialog = false
        : this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.$v.$reset()
      })
    },
    save () {
      if (this.$v.editedItem.$invalid) {
        this.$store.dispatch('layout/alertFire', {
          type: 'error',
          message: 'Semua kolom harus diisi!'
        })
      } else {
        console.log('simpan', this.editedItem)
        this.loadstate(true)
        if (this.editedIndex > -1) {
          // save edit
          // add axios.put
          this.axios.put(`sensor/${this.editedItem.id}`, this.editedItem)
            .then(response => {
              // Object.assign(this.sensors[this.editedIndex], response.data.data)
              this.loadstate(false)
              this.close('editNew')
              this.$store.dispatch('layout/alertFire', {
                type: 'success',
                message: 'Berhasil menyimpan perubahan!'
              })
            })
            .catch(error => {
              console.log('error put data', error)
              this.alertFire({ type: 'error', message: 'Terjadi kesalahan pada server!' })
              this.loadstate(false)
            })
        }
      }
    },
    realtimeEventListener () {
      window.Echo.private('events')
        .listen('UpdateSensor', (event) => {
          console.log('event update sensor', event)
          const newSensor = event.data
          const indexSensor = this.sensors.findIndex(sensor => sensor.id === newSensor.id)
          indexSensor === -1 ? this.sensors.push(newSensor) : this.sensors.splice(indexSensor, 1, newSensor)
        })
    },
    removeRealtimeEventListener () {
      window.Echo.private('events')
        .stopListening('UpdateSensor')
    },
    loadstate (val) {
      this.$store.commit('layout/setLoadstate', val)
    }
  }
}
</script>
