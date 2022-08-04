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
          Node
        </div>
        <v-spacer />
        <!-- add and edit item -->
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
                      v-model="editedItem.name_node"
                      outlined
                      :error-messages="nameErrors"
                      label="Sensor name"
                      @input="$v.editedItem.name_node.$touch"
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.lat"
                      outlined
                      :error-messages="batasErrors"
                      label="Posisi X"
                      @input="$v.editedItem.lat.$touch"
                    />
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.lng"
                      outlined
                      :error-messages="batasErrors"
                      label="Posisi Y"
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
        <!-- add and item -->
      </div>
      <!-- tabel node -->
      <v-data-table
        :headers="headers"
        :items="nodes"
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
                @click.stop.prevent="copy(item.id)"
              >{{ index + 1 }}</span>
            </template>
            <span :id="item.id">{{ item.id }}</span>
            <!-- <m-copiedlabel :text="item.id" /> -->
          </v-tooltip>
        </template>

        <template v-slot:[`item.last_reads`]="{ item }">
          {{ `${item.last_reads.length}` }}
        </template>

        <template v-slot:[`item.konektivitas`]="{ item }">
          <v-chip
            :color="item.konektivitas ? 'green' : 'red'"
            dark
          >
            {{ item.konektivitas ? 'connected' : 'disconnected' }}
          </v-chip>
        </template>

        <!-- action button -->
        <template v-if="user.role === 'admin'" v-slot:[`item.actions`]="{ item }">
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
        <!-- <template v-slot:[`item.actions`]="{ item }">
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
        </template> -->

        <template v-slot:no-data>
          <Loader v-if="loadState" />
          <no-data
            v-else
            :reload-callback="initialize"
          />
        </template>
      </v-data-table>
      <!-- /tabel node -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { required, minLength, maxValue } from 'vuelidate/lib/validators'
// import CopiedLabel from '@/components/CopiedLabel.vue'
import Loader from '@/components/ProgressCircle.vue'
import NoData from '../components/NoData.vue'

export default {
  components: {
    Loader,
    NoData
    // 'm-copiedlabel': CopiedLabel
  },
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'No.', value: 'id' },
      { text: 'Node', align: 'start', sortable: false, value: 'name_node' },
      { text: 'Latitude', value: 'lat' },
      { text: 'Longitude', value: 'lng' },
      { text: 'Jumlah Sensor', value: 'last_reads' },
      { text: 'Konektivitas', value: 'konektivitas' },
      { text: '', value: 'actions', sortable: false }
    //   { text: 'Node', value: 'node' },
    //   { text: 'Bacaan terakhir', value: 'last_read' },
    ],
    nodes: [],
    editedIndex: -1,
    editedItem: {
      name_node: '',
      lat: 0,
      lng: 0
    },
    defaultItem: {
      name_node: '',
      lat: 0,
      lng: 0
    }
  }),
  validations: {
    editedItem: {
      name_node: {
        required
      },
      lat: {
        required,
        minLength: minLength(0),
        maxValue: maxValue(9999)
      },
      lng: {
        required,
        minLength: minLength(0),
        maxValue: maxValue(9999)
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
      if (!this.$v.editedItem.name_node.$dirty) return errors
      !this.$v.editedItem.name_node.required && errors.push('nama node dibutuhkan!')
      return errors
    },
    batasErrors () {
      const errors = []
      if (!this.$v.editedItem.lat.$dirty || !this.$v.editedItem.lng.$dirty) {
        return errors
      }
      if (!this.$v.editedItem.lat.required || !this.$v.editedItem.lng.required) {
        errors.push('koordinat dibutuhkan!')
      }
      if (!this.$v.editedItem.lat.minLength || !this.$v.editedItem.lng.minLength) {
        errors.push('koordinat tidak boleh kosong!')
      }
      if (!this.$v.editedItem.lat.maxValue || !this.$v.editedItem.lng.maxValue) {
        errors.push('Nilai koordinat tidak bisa lebih dari 9999!')
      }
      return errors
    }
  },

  mqtt: {
    'events/UpdateNode' (val) {
      const enc = new TextDecoder('utf-8')
      const arr = new Uint8Array(val)
      const newNode = JSON.parse(enc.decode(arr))
      const indexNode = this.nodes.findIndex(node => node.id === newNode.id)
      indexNode === -1 ? this.nodes.push(newNode) : this.nodes.splice(indexNode, 1, newNode)
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

  methods: {
    async initialize () {
      this.nodes = []
      this.loadstate(true)
      // add axios get
      try {
        const { data } = await this.axios.get('node')
        this.nodes = data.data.nodes
        console.log('data node', this.nodes)
        this.loadstate(false)
      } catch (error) {
        this.loadstate(false)
        console.log('error store data', error)
        this.alert('Terjadi kesalahan pada server!', 'error')
      }
    },

    editItem (item, mode) {
      this.editedIndex = this.nodes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      mode === 'editNew'
        ? this.dialog = true
        : this.dialogDelete = true
    },

    deleteItemConfirm () {
      // add axios.delete
      this.loadstate(true)
      this.axios.delete(`node/${this.editedItem.id}`)
        .then(response => {
          this.alert('Berhasil menghapus node!', 'success')
          console.log('delete item', response)
          this.nodes.splice(this.editedIndex, 1)
          this.loadstate(false)
          this.close()
        })
        .catch(error => {
          this.loadstate(false)
          console.log('error delete data', error)
          this.alert('Terjadi kesalahan pada server!', 'error')
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
        this.alert('Semua kolom harus diisi!', 'error')
      } else {
        console.log('simpan', this.editedItem)
        this.loadstate(true)
        if (this.editedIndex > -1) {
          // save edit
          // add axios.put
          this.axios.put(`node/${this.editedItem.id}`, this.editedItem)
            .then(response => {
              Object.assign(this.nodes[this.editedIndex], response.data.data)
              this.loadstate(false)
              this.close('editNew')
            })
            .catch(error => {
              console.log('error put data', error)
              this.alert('Terjadi kesalahan pada server!', 'error')
              this.loadstate(false)
            })
        } else {
          // save baru
          // add axios.post
          this.axios.post('node', this.editedItem)
            .then(response => {
              this.nodes.push(response.data.data)
              this.loadstate(false)
              this.close('editNew')
            })
            .catch(error => {
              console.log('error store data', error)
              this.alert('Terjadi kesalahan pada server!', 'error')
              this.loadstate(false)
            })
        }
      }
    },
    copy (id) {
      var range = document.createRange()
      console.log('range', range)
      range.selectNode(document.getElementById(id))
      window.getSelection().removeAllRanges() // clear current selection
      window.getSelection().addRange(range) // to select text
      document.execCommand('copy')
      window.getSelection().removeAllRanges() // to deselect
      this.alert('Teks berhasil disalin!', 'success')
    },
    alert (message, type) {
      this.$store.dispatch('layout/alertFire', {
        type: type,
        message: message
      })
    },
    loadstate (val) {
      this.$store.commit('layout/setLoadstate', val)
    },
    realtimeEventListener () {
      this.$mqtt.subscribe(`events/UpdateNode`)
    }
  }
}
</script>
