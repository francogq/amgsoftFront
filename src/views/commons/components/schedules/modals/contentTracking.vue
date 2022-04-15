<template>
  <b-container>
    <b-row>
      <b-table striped hover :items="tracking" :fields="fields"></b-table>
    </b-row>
  </b-container>
</template>
<script>
export default {
  props: {
    tracking: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      fields: [
        {
          key: "user_name",
          label: "USER",
        },
        {
          key: "created_at",
          label: "DATE",
        },
        {
          key: "description",
          label: "DESCRIPTION",
        },
        {
          key: "status",
          label: "ACTION",
        },
      ],
      items: [],
    };
  },
};
</script>