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
            v-model="registrasiKey"
            outlined
            label="Registrasi Key"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          text
        >
          copy
          <v-icon right>
            mdi-content-copy
          </v-icon>
        </v-btn>
        <v-btn
          color="primary"
          text
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
    registrasiKey: 'mock'
  }),
  computed: {
    ...mapState('layout', ['isMobile'])
  },
  methods: {
    tes () {
      console.log('tes')
    }
  }
}
</script>
