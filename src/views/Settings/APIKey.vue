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
        API key adalah sebaris kode random berjumlah 32 digit yang digunakan sebagai validasi penggunaan API oleh sensor, tekan tombol
        <span class="font-weight-bold">Genereate</span> untuk mengenerate kode baru, tekan tombol
        <span class="font-weight-bold">Copy</span> untuk menyalin kode
      </v-card-subtitle>
      <v-card-text>
        <v-form>
          <v-text-field
            id="apiKey"
            v-model="apiKey"
            :loading="loadState"
            outlined
            label="Api Key"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          text
          @click.stop.prevent="copy"
        >
          copy
          <v-icon right>
            mdi-content-copy
          </v-icon>
        </v-btn>
        <v-btn
          color="primary"
          text
          @click.stop.prevent="generate"
        >
          Generate
          <v-icon right>
            mdi-reload
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    apiKey: ''
  }),
  computed: {
    ...mapState('layout', ['isMobile', 'loadState'])
  },
  created () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.loadstate(true)
      this.axios.get('setting/api_key')
        .then(response => {
          // console.log('key repsonse', response.data.data)
          this.apiKey = response.data.data
          this.loadstate(false)
        })
    },
    generate () {
      this.loadstate(true)
      this.axios.get('setting/generate/api_key')
        .then(response => {
          // console.log('key repsonse', response.data.data)
          this.apiKey = response.data.data
          this.loadstate(false)
          this.$store.dispatch('layout/alertFire', {
            type: 'success',
            message: 'Berhasil memperbarui key!'
          })
        })
    },
    copy () {
      var range = document.createRange()
      range.selectNode(document.getElementById('apiKey'))
      window.getSelection().removeAllRanges() // clear current selection
      window.getSelection().addRange(range) // to select text
      document.execCommand('copy')
      window.getSelection().removeAllRanges() // to deselect
      this.$store.dispatch('layout/alertFire', {
        type: 'success',
        message: 'Teks berhasil disalin!'
      })
    },
    loadstate (state) {
      this.$store.commit('layout/setLoadstate', state)
    }
  }
}
</script>
