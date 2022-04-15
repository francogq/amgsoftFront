<template>
  <b-overlay :show="showOverlay" rounded="sm" :variant="variantOverlay">
    <slot name="content"></slot>
    <template #overlay>
      <div class="text-center">
        <b-icon icon="stopwatch" font-scale="4" animation="cylon" variant="primary"></b-icon>
        <p id="cancel-label" class="text-primary font-weight-bold h4">Please wait...</p>
      </div>
    </template>
  </b-overlay>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "OverlayWait",
  props: {
    showOverlay: {
      type: Boolean,
      default: false
    }
  },
  methods: {},
  computed: {
    ...mapGetters({
      skin: "appConfig/skin"
    }),
    variantOverlay() {
      return this.skin === "dark" ? "dark" : "light";
    }
  }
};
</script>

<style>
</style>