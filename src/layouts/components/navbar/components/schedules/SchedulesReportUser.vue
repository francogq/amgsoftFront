<template>
  <div>
    <feather-icon icon="ClockIcon" size="19" />
    <b-tooltip
      triggers="hover"
      :target="`bookmark-pay-stub`"
      title="REPORT OF ATTENDANCE"
      :delay="{ show: 1000, hide: 50 }"
    />
    <b-modal
      v-model="modal"
      title="REPORT OF ATTENDANCE"
      size="xl"
      title-class="h3 text-white"
      hide-footer
      modal-class="modal-primary"
      id="modal-report-of-attendance"
    >
      <content-report></content-report>
    </b-modal>
  </div>
</template>
<script>
import contentReport from "./reports/ComponentReportUser.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      modal: false,
    };
  },
  components: {
    contentReport,
  },
  methods: {
    openModalReport() {
      if (this.$route.name == "amg-menu") {
        this.showToast(
          "info",
          "top-right",
          "Oops!",
          "XIcon",
          "ENTER YOUR MODULE"
        );
      } else if (this.currentUser.user_id == 1) {
        this.showToast("info", "top-right", "Oops!", "XIcon", "NO DATA FOUND");
      } else {
        this.modal = true;
      }
    },
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
};
</script>

<style>
</style>