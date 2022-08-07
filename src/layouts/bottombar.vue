<template>
  <v-bottom-navigation
    v-if="isMobile && this.$route.meta.bottomNav"
    :grow="true"
    shift
    fixed
    color="primary"
    app
  >
    <template v-for="(item, index) in menuBar">
      <v-btn
        v-if="renderListAdmin(user.role, item.role)"
        :key="index"
        :to="item.link"
      >
        <span>{{ item.name }}</span>
        <v-icon large>
          {{ item.icon }}
        </v-icon>
      </v-btn>
    </template>
    <v-btn
      :to="{ name: 'about' }"
    >
      <span>about</span>
      <v-icon large>
        mdi-information-outline
      </v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('layout', ['isMobile', 'drawerSide', 'menuBar']),
    ...mapState('auth', ['user'])
  },
  methods: {
    renderListAdmin (userRole, itemRole) {
      return itemRole.includes(userRole)
    }
  }
}
</script>
<style scoped>
.theme--light.v-bottom-navigation {
  background-color: #f5f5f5;
}
</style>
