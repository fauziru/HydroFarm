<template>
  <v-bottom-navigation
    v-if="isMobile && this.$route.meta.bottomNav"
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
