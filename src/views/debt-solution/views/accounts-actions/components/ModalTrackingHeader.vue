<template>
  <div class="w-100">
    <b-button-close style="transform: translate(-12px, 4px)" @click="close" />
    <b-container fluid>
      <b-row class="text-center bg-primary px-3 py-1">
        <h3 class="font-weight-bolder text-white">TRACKING</h3>
      </b-row>
      <b-row class="mt-1 px-2">
        <b-col>
          <h5>ACCOUNT</h5>
          <p
            class="
              rounded
              text-primary
              border-primary
              font-medium-1
              text-center
              py10
            "
          >
            {{ dataClient.account }}
          </p>
        </b-col>
        <b-col>
          <h5>CLIENT</h5>
          <p
            class="
              rounded
              text-primary
              border-primary
              font-medium-1
              text-center
              py10
            "
          >
            {{ dataClient.name_client }}
          </p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    dataClient: {
      type: Object,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style>
.py10 {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}
</style>
