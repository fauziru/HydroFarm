<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <span
        :id="text"
        v-bind="attrs"
        v-on="on"
        @click.stop.prevent="copyToClipboard"
      >
        {{ text }}
      </span>
    </template>
    <span>{{ copyStatus ? 'Telah disalin' : 'Salin' }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    copyStatus: false
  }),
  methods: {
    copyToClipboard () {
      var range = document.createRange()
      range.selectNode(document.getElementById(this.text))
      window.getSelection().removeAllRanges() // clear current selection
      window.getSelection().addRange(range) // to select text
      document.execCommand('copy')
      this.copyStatus = true
      window.getSelection().removeAllRanges() // to deselect
      this.$store.dispatch('layout/alertFire', {
        type: 'success',
        message: 'Teks berhasil disalin!'
      })
      setTimeout(() => {
        this.copyStatus = false
      }, 1000)
    }
  }
}
</script>
