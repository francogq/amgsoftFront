<template>
  <component
      :is="modalData.programs.programSelected"
      v-if="modal.programs"
      :modal-services="modal.programs"
      :sales-client="modalData.programs.salesClient"
      :type-modal="modalData.programs.typeModal"
      @closeModal="hideModalProgram"
  />
</template>

<script>
export default {
  name: "GeneralServicesComponent"
}
</script>

<style scoped>

</style>