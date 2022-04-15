<template>
  <b-row>
    <b-col>
      <h5>Program</h5>
      <p class="rounded text-primary border-primary font-medium-1 text-center py-1s">
        {{ program }}
      </p>
    </b-col>
    <b-col>
      <h5>Client</h5>
      <p class="rounded text-primary border-primary font-medium-1 text-center py-1s">
        {{ client }}
      </p>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'ProgramClientHeader',
  props: {
    program: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.py-1s{
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
