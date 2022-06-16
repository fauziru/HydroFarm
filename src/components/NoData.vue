<template>
  <v-container>
    <p>Belum ada data.</p>
    <v-btn
      icon
      x-large
      color="primary"
      @click="reloadCallback"
    >
      <v-icon>mdi-reload</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
export default {
  props: {
    reloadCallback: {
      type: Function,
      default: () => {}
    }
  }
}
</script>
