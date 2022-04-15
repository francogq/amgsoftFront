<template>
  <b-form-group label-class="font-weight-bolder font-small-5" :label="labelTitle">
    <b-alert variant="transparent" show>
      <div class="alert-body alert-body text-primary border-primary rounded text-center">
        <span>{{ title }}</span>
      </div>
    </b-alert>
  </b-form-group>
</template>

<script>
export default {
  name: "TitlesModal",
  props: {
    title: {
      type: String,
      default: ""
    },
    labelTitle: {
      type: String,
      default: "Title"
    }
  }
};
</script>

<style >
</style>
