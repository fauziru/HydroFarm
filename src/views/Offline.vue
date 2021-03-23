<template>
  <div class="text-center">
    <h1>
      Anda sedang offline
    </h1>
    <v-img
      :src="require('../assets/Login/Loginbg.png')"
      class="my-3 mx-auto"
      contain
      width="387"
    />
    <v-btn
      color="primary"
      outlined
      @click="backOnline"
    >
      Coba Lagi
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    backOnline () {
      this.$router.push({ name: 'dashboard' })
    }
  }
}
</script>
