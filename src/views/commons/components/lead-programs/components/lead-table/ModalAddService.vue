<template>
  <div>
    <b-modal
      v-model="modalUp"
      modal
      size="lg"
      header-class="p-0"
      no-close-on-backdrop
      header-bg-variant="transparent border-bottom border-bottom-2"
      modal-class="modal-primary"
      title="ADD SALE"
      title-class="h2 text-white"
      hide-footer
      @hidden="hideModal"
    >
      <!-- HEADER START -->
      <template v-slot:modal-header>
        <modal-service-header
          :type-modal="typeModal"
          :programs-all="programsAll"
          :users-services="usersServices"
          :sales="salesClient"
          @close="hideModal(false)"
          @changeProgram="changeProgram"
        />
      </template>
    </b-modal>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import ModalServiceHeader from "@/views/crm/views/sales-made/components/modals/services/ModalServiceHeader.vue";
import ButtonCancel from "@/views/commons/utilities/ButtonCancel";
import ButtonSave from "@/views/commons/utilities/ButtonSave";
import LeadService from "../../service/lead.service";
export default {
  components: {
    ButtonSave,
    ButtonCancel,
    ModalServiceHeader,
  },
  props: {
    salesClient: {
      type: Object,
    },
    currentUser: {
      type: Object,
    },
    module: {
      type: Number,
    },
  },
  data() {
    return {
      modalUp: true,
      typeModal: 6,
    };
  },
  computed: {
    ...mapState({
      programsAll: (state) => state["CrmGlobalStore"].S_PROGRAMS,
      usersServices: (state) => state["CrmGlobalStore"].S_OWNERS,
    }),
  },
  methods: {
    ...mapActions({
      A_GET_PROGRAMS: "CrmGlobalStore/A_GET_PROGRAMS",
      A_GET_OWNERS: "CrmGlobalStore/A_GET_OWNERS",
    }),
    async getPrograms() {
      try {
        await this.A_GET_PROGRAMS();
      } catch (error) {
        console.log("Something went wrong getPrograms", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getOwners() {
      await this.A_GET_OWNERS({
        modul: this.module,
        body: { roles: "[]", type: "0" },
      });
    },
    hideModal() {
      this.modalUp = false;
      this.$emit("hideModal", false);
    },
    changeProgram(data) {
      this.$emit("changeProgram", data);
    },
    async createLeadEvent() {
      const data = await LeadService.createLeadEvent({
        user_id: this.currentUser.user_id,
        lead_id: this.salesClient.id,
      });
      if (data) {
        this.$emit("leadEvent", data);
      }
    },
  },
  async created() {
    await this.getOwners(), await this.getPrograms();
  },
  mounted() {
    this.changeProgram();
    this.createLeadEvent();
  },
};
</script>
<style scoped>
</style>
