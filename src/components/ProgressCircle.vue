<template>
  <div :class="childClass">
    <v-progress-circular
      :width="3"
      color="primary"
      indeterminate
    />
  </div>
</template>
<script>
export default ({
  props: {
    childClass: {
      type: String,
      default: ''
    }
  }
})
</script>
