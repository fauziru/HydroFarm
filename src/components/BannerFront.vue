<template>
  <v-banner
    color="white"
    :icon="icon"
    outlined
    rounded
    single-line
    style="margin-bottom: 12px"
  >
    {{ title }}
    <template v-slot:actions>
      <v-btn
        v-if="btnName !== ''"
        text
        color="secondary"
        @click="callback"
      >
        {{ btnName }}
      </v-btn>
    </template>
  </v-banner>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    btnName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    callback: {
      type: Function,
      default: () => {}
    }
  },
  created () {
    console.log('props baner front', this.btnName)
  }
}
</script>
