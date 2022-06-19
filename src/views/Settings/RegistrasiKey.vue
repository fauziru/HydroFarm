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
        Registrasi key adalah sebaris kode random berjumlah 32 digit yang digunakan sebagai validasi pendaftaran user baru, tekan tombol
        <span class="font-weight-bold">Genereate</span> untuk mengenerate kode baru, tekan tombol
        <span class="font-weight-bold">Copy</span> untuk menyalin kode
      </v-card-subtitle>
      <v-card-text>
        <v-form>
          <v-text-field
            id="regKey"
            v-model="registrasiKey"
            outlined
            :loading="loadState"
            label="Registrasi Key"
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
    registrasiKey: ''
  }),
  computed: {
    ...mapState('layout', ['isMobile', 'loadState'])
  },
  created () {
    this.initialize()
  },
  methods: {
    async initialize () {
      this.loadstate(true)
      try {
        const response = await this.axios.get('setting/registrasi_key')
        this.registrasiKey = response.data.data
        this.loadstate(false)
      } catch (error) {
        console.log('error', error)
        this.loadstate(false)
      }
    },
    async generate () {
      this.loadstate(true)
      try {
        const response = await this.axios.get('setting/generate/registrasi_key')
        this.registrasiKey = response.data.data
        this.loadstate(false)
        this.$store.dispatch('layout/alertFire', {
          type: 'success',
          message: 'Berhasil memperbarui key!'
        })
      } catch (error) {
        console.log('error', error)
        this.$store.dispatch('layout/alertFire', {
          type: 'success',
          message: 'Terjadi kesalahan pada server!'
        })
        this.loadstate(false)
      }
    },
    copy () {
      var range = document.createRange()
      range.selectNode(document.getElementById('regKey'))
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
