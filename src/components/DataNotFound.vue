<template>
  <div>
    <div
      class="text-center primary--text"
      :class="isMobile ? 'headline' : 'display-2'"
    >
      Belum ada data!
    </div>
    <v-img
      :src="require('../assets/Login/Loginbg.png')"
      class="mx-auto py-3"
      contain
      height="300"
      width="300"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('layout', ['isMobile'])
  }
}
</script>
