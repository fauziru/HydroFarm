<template>
  <div
    class="mx-auto col-12 col-md-6"
    :style="isMobile ? 'padding: 0px!important;' : ''"
  >
    <v-card
      rounded="xl"
      class="elevation-1 pa-1"
    >
      <v-card-subtitle>
        Layout sensor adalah gambar tampak atas dari sebuah lokasi yang nantinya akan membantu user untuk merepresentasikan letak sensor yang sesungguhnya, tekan tombol
        <span class="font-weight-bold">Upload baru</span> untuk memunculkan form user agar dapat mengisikan nama dan gambar layout. Opsi lainnya adalah <span class="font-weight-bold">Pilih Layout</span> untuk
        melihat kembali layout yang pernah diupload
      </v-card-subtitle>
      <v-card-text>
        <v-radio-group
          v-model="radioGroup"
          :disabled="loadState"
          :row="isMobile"
        >
          <v-radio
            v-for="n in radioRender"
            :key="n.id"
            :label="`${n.name}`"
            :value="n.id"
          />
        </v-radio-group>
        <upload-baru
          v-if="radioGroup === 0"
          :add-layout-callback="addLayoutState"
        />
        <pilih-layout
          v-if="radioGroup === 1"
          :data="dataLayout"
          :delete-layout-callback="deleteLayoutState"
        />
        <!-- form -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PilihLayout from './PilihLayout.vue'
import UploadBaru from './UploadBaru.vue'

export default {
  components: {
    PilihLayout,
    UploadBaru
  },
  data: () => ({
    radioRender: [{id: 0, name: 'Upload Baru'}, {id: 1, name: 'Pilih Layout'}],
    radioGroup: 0,
    dataLayout: {}
  }),
  computed: {
    ...mapState('layout', ['isMobile', 'loadState'])
  },
  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      try {
        this.loadstate(true)
        const response = await this.axios.get('layout')
        this.dataLayout = response.data.data
        console.log('response', response)
        this.loadstate(false)
      } catch (error) {
        console.log('error', error)
        this.loadstate(false)
      }
    },
    addLayoutState (layout) {
      this.dataLayout.layouts.push(layout)
      this.dataLayout.selectedLayouts = layout.id
    },
    deleteLayoutState (idLayout) {
      this.dataLayout.layouts = this.dataLayout.layouts.filter((item) => item.id !== idLayout)
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    }
  }
}
</script>
