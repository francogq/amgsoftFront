<template>
  <b-button
    variant="outline-danger"
    class="hover-close"
    @click="$emit('click')"
  >
    Cancel
  </b-button>
</template>

<script>
export default {
  name: 'ButtonCancel',
}
</script>

<style>
.hover-close{
  transition: 300ms;
}
.hover-close:hover{
  background-color: #FF3B19 !important;
  color: white !important;
}
</style>
