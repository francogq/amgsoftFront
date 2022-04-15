<template>
  <b-button
    variant="outline-secondary"
    :disabled="disabled"
    @click="$emit('click')"
  >
    Export to PDF
  </b-button>
</template>

<script>
export default {
  name: 'ButtonExportPdf',
  props: {
    disabled: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
}
</script>

<style scoped>

</style>
