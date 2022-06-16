<template>
  <div>
    <v-card-title class="display-2 mb-3 justify-center px-2 px-md-15">
      404
    </v-card-title>
    <v-img
      :src="require('../assets/images/logoNotif.png')"
      class="my-3"
      contain
      height="120"
    />
    <v-card-text class="text-center">
      {{ title }}
    </v-card-text>
    <div class="text-center">
      <v-btn
        color="primary"
        outlined
        @click="backHandler"
      >
        kembali
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    backHandler () {
      this.$router.push({ name: 'dashboard' })
    }
  }
}
</script>
