<template>
  <div>
    <v-app-bar
      v-if="isMobile && this.$route.meta.bottomNav"
      bottom
      app
    >
      <v-bottom-navigation
        fixed
        color="primary"
        grow
        shift
      >
        <v-btn
          v-for="(item, index) in menuBar"
          :key="index"
          :to="item.link"
        >
          <span>{{ item.name }}</span>
          <v-icon large>
            {{ item.icon }}
          </v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-app-bar>

    <v-fab-transition>
      <v-btn
        v-if="false"
        color="secondary"
        elevation="2"
        fixed
        fab
        small
        right
        bottom
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('layout', ['isMobile', 'drawerSide', 'menuBar'])
  },
  methods: {}
}
</script>
