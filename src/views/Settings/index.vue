<template>
  <div
    class="col-xl-4 col-12"
    :style=" isMobile ? 'padding: 0px!important;' : ''"
  >
    <v-list
      class="rounded-xl elevation-1"
      three-line
    >
      <v-subheader>Key</v-subheader>
      <v-spacer />
      <template v-for="(item, i) in setting">
        <v-list-item
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-avatar color="light-green lighten-5">
            <v-icon color="primary">
              {{ item.icon }}
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.subtitle }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action class="align-self-center">
            <v-btn
              text
              depressed
              icon
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="i" />
      </template>
      <div class="mt-2" />
    </v-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    setting: [
      { title: 'Registrasi Key', subtitle: 'Key registrasi untuk pendaftaran user baru', icon: 'mdi-key', link: { name: 'registrasi key' } },
      { title: 'API Key', subtitle: 'Key API untuk membatasi hak akses penggunaan API', icon: 'mdi-key', link: { name: 'api key' } }
    ]
  }),
  computed: {
    ...mapState('layout', ['isMobile'])
  }
}
</script>
