<template>
  <div class="d-flex flex-column flex-grow-1">
    <router-view />
    <div
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
          <template v-slot:activator="{ on, attrs}">
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
          </template>
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
                      v-model="editedItem.min_nutrisi"
                      outlined
                      :error-messages="minnutrErrors"
                      label="Min. Nutrisi"
                      @input="$v.editedItem.min_nutrisi.$touch"
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
          </v-toolbar>
        </template>

        <template v-slot:[`item.id`]="{ item }">
          <m-copied-label :text="item.id | toString" />
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="item.status ? 'green' : 'red'"
            dark
          >
            {{ item.status ? 'connected' : 'disconnected' }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
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
          <v-btn
            icon
            depressed
          >
            <v-icon
              small
              @click="editItem(item, 'delete')"
            >
              mdi-delete
            </v-icon>
          </v-btn>
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
import { required, minLength, maxValue } from 'vuelidate/lib/validators'
import CopiedLabel from '@/components/CopiedLabel.vue'
import Loader from '@/components/ProgressCircle.vue'

export default {
  components: {
    Loader,
    'm-copied-label': CopiedLabel
  },
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: '#ID', value: 'id' },
      { text: 'Sensor', align: 'start', sortable: false, value: 'name_sensor' },
      { text: 'Min. Nutrisi', value: 'min_nutrisi' },
      { text: 'Status', value: 'status' },
      { text: 'Last Read', value: 'last_read' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    sensors: [],
    editedIndex: -1,
    editedItem: {
      name_sensor: '',
      min_nutrisi: 0
    },
    defaultItem: {
      name_sensor: '',
      min_nutrisi: 0
    }
  }),
  validations: {
    editedItem: {
      name_sensor: {
        required
      },
      min_nutrisi: {
        required,
        minLength: minLength(3),
        maxValue: maxValue(9999)
      }
    }
  },
  computed: {
    ...mapState('layout', ['isMobile', 'loadState']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    nameErrors () {
      const errors = []
      if (!this.$v.editedItem.name_sensor.$dirty) return errors
      !this.$v.editedItem.name_sensor.required && errors.push('nama sensor dibutuhkan!')
      return errors
    },
    minnutrErrors () {
      const errors = []
      if (!this.$v.editedItem.min_nutrisi.$dirty) return errors
      !this.$v.editedItem.min_nutrisi.required && errors.push('minimal nutrisi dibutuhkan!')
      !this.$v.editedItem.min_nutrisi.minLength &&
        errors.push('Nutrisi minimal harus 3 digit!')
      !this.$v.editedItem.min_nutrisi.maxValue &&
        errors.push('Nilai minimal nutrisi tidak bisa lebih dari 9999!')
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
              Object.assign(this.sensors[this.editedIndex], response.data.data)
              this.loadstate(false)
              this.close('editNew')
            })
            .catch(error => {
              console.log('error put data', error)
              this.alertFire({ type: 'error', message: 'Terjadi kesalahan pada server!' })
              this.loadstate(false)
            })
        } else {
          // save baru
          // add axios.post
          this.axios.post('sensor', this.editedItem)
            .then(response => {
              this.sensors.push(response.data.data)
              this.loadstate(false)
              this.close('editNew')
            })
            .catch(error => {
              console.log('error store data', error)
              this.alertFire({ type: 'error', message: 'Terjadi kesalahan pada server!' })
              this.loadstate(false)
            })
        }
      }
    },

    loadstate (val) {
      this.$store.commit('layout/setLoadstate', val)
    }
  }
}
</script>
