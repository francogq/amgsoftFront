<template>
  <b-button
    variant="outline-secondary"
    class="hover-save-edit"
    @click="$emit('click')"
  >
    Save & Complete
  </b-button>
</template>

<script>
export default {
  name: 'ButtonSaveAndComplete',
}
</script>

<style scoped>
.hover-save-edit{
  transition: 300ms;
}
.hover-save-edit:hover{
  background-color: #3764FF !important;
  border-color: #3764FF !important;
  color: white !important;
}
</style>
