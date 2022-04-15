<template>
  <amg-icon icon="MessengerIcon" size="19" />
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    redirectToMessenger() {
      window.open(
        `${process.env.VUE_APP_API_SINGLESINGON}/api/autologin?user_id=${this.currentUser.id_enc}&api_key=key_cur_prod_fnPqT5xQEi5Vcb9wKwbCf65c3BjVGyBB`,
        "_blank"
      );
    },
  },
};
</script>

<style></style>
