<template>
  <div>
    <b-modal
      v-model="modalUp"
      title-class="h2 text-white"
      size="xl"
      modal-class="modal-primary"
      ok-only
      @hidden="hideModal()"
      title="DETAIL OF COMMISSIONS"
    >
      <b-card-text>
        <ModalHeader :info="info" />
        <DetailsCrm :info="info" v-if="isCrm" />
        <DetailsAdm :info="info" v-if="isAdm" />
        <DetailsDepartments :info="info" v-if="isDepartment" />
      </b-card-text>
    </b-modal>
  </div>
</template>

<script>
import commissionsService from "@/views/commons/components/commissions/services/commissions.service";
import ModalHeader from "@/views/commons/components/commissions/modals/ModalHeader.vue";
import DetailsCrm from "@/views/commons/components/commissions/modals/modal-details/DetailsCrm.vue";
import DetailsAdm from "@/views/commons/components/commissions/modals/modal-details/DetailsAdm.vue";
import DetailsDepartments from "@/views/commons/components/commissions/modals/modal-details/DetailsDepartments.vue";
import { mapGetters } from "vuex";
export default {
  name: "ModalCommissionsDetails",
  components: {
    ModalHeader,
    DetailsCrm,
    DetailsAdm,
    DetailsDepartments,
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      modalUp: false,
    };
  },
  created() {},
  mounted() {
    this.modalUp = this.showModal;
  },
  computed: {
    isCeo() {
      return this.info.role_id == 1;
    },
    isSupervisor() {
      return this.info.role_id == 2;
    },
    isCrm() {
      return this.info.module == 2;
    },
    isAdm() {
      return this.info.module == 4;
    },
    isDepartment() {
      return this.info.module != 2 && this.info.module != 4;
    },
  },
  methods: {
    hideModal(status) {
      this.modalUp = false;
      this.$emit("hide-modal");
    },
  },
  watch: {},
};
</script>
