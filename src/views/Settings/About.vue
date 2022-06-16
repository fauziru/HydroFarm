<template>
  <div
    class="mx-auto col-12 col-md-6"
    :style="isMobile ? 'padding: 0px!important;' : ''"
  >
    <v-card
      rounded="xl"
      class="elevation-1 pa-1"
    >
      <div class="text-center">
        <v-avatar
          class="mt-5"
          size="100"
        >
          <v-img
            :src="require('../../assets/logo.png')"
          />
        </v-avatar>
        <v-card-subtitle>
          {{ version }}
        </v-card-subtitle>
      </div>

      <v-list
        subheader
        three-line
      >
        <v-subheader>Dhydro Web Apps</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Tentang</v-list-item-title>
            <v-list-item-subtitle>Dhydro merupakan sistem monitoring lingkungan hidroponik dengan konsep IoT</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list
        flat
        subheader
        three-line
      >
        <v-subheader>License</v-subheader>

        <v-list-item-group
          multiple
          active-class=""
        >
          <template v-for="ln in licenses">
            <v-list-item :key="ln.name" @click="goToLink(ln.link)">
              <v-list-item-content>
                <v-list-item-title>{{ ln.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ ln.body }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    licenses: [
      {name: 'Laravel', body: 'Laravel adalah PHP full-stack framework progresive untuk mengembangkan sebuah web applikasi secara utuh', link: 'https://github.com/laravel/laravel'},
      {name: 'Vue', body: 'Vue adalah javascript framework yang progresive dan bersifat open source untuk membangun sebuah user interface', link: 'https://vuejs.org/about/faq.html#what-license-does-vue-use'},
      {name: 'Vuetify', body: 'Vuetify adalah framework css yang dibangun dengan ekosistem vue', link: 'https://vuetifyjs.com/en/about/meet-the-team/#company'},
      {name: 'Mosquitto', body: 'Mosquitto adalah server broker pesan dengan protocol MQTT dan websockets', link: 'https://mosquitto.org/'},
      {name: 'Leaflet js', body: 'Leaflet adalah library js untuk membuat sebuah map interaktif', link: 'https://github.com/Leaflet/Leaflet/blob/main/LICENSE'},
      {name: 'Apexchart js', body: 'Apexchart merupakan sebuah libbrary javascript untuk menampilkan visualisasi data dalam bentuk grafik apapun', link: 'https://apexcharts.com/about-us/'},
      {name: 'Pusher js', body: 'Pusher js merupakan sebuah libbrary javascript untuk melakukan komunikasi menggunakan prtokol websocket', link: 'https://github.com/pusher/pusher-js/blob/master/LICENCE'}
    ]
  }),
  computed: {
    ...mapState('layout', ['isMobile']),
    ...mapState('meta', ['version'])
  },
  methods: {
    goToLink (link) {
      window.open(link, '_blank').focus()
    }
  }
}
</script>
