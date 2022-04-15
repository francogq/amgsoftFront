<template>
  <div>
    <b-tabs
      pills
      lazy
      active-nav-item-class="bg-important border-0 shadow-none"
    >
      <b-tab title="Pending">
       
      </b-tab>
      <b-tab title="Done">
       
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
export default {
  props: {
    tab: {
      type: String,
      default: 1,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>