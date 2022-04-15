<template>
  <validation-observer ref="form">
    <b-modal
      v-model="modal.revission"
      :title="title"
      title-class="h3 text-white font-weight-bolder"
      size="lg"
      modal-class="modal-primary"
    >
      <b-container fluid>
        <program-client-header
          :client="revission.nameClient"
          :program="revission.nameProgram"
          class="sticky-top"
        />
        <b-row>
          <validation-provider
            v-slot="{ errors }"
            name="typeOfAgreement"
            rules="required"
            class="w-100"
          >
            <h3 class="mt-2">Observation</h3>
            <b-form-textarea
              id="textarea-1"
              v-model="observation"
              placeholder="Enter observation..."
              rows="5"
              max-rows="6"
              :class="{ 'border-danger': errors[0] }"
            />
          </validation-provider>
        </b-row>
        <b-row v-if="revission.type === 2" class="mt-1">
          <b-form-checkbox v-model="sendSms" switch> Send sms </b-form-checkbox>
        </b-row>
      </b-container>
      <template #modal-footer>
        <b-button
          :disabled="disabledButton"
          :variant="revission.type === 3 ? 'danger' : 'success'"
          @click="revision"
          >{{ buttonText }}</b-button
        >
      </template>
    </b-modal>
  </validation-observer>
</template>

<script>
import ProgramClientHeader from "@/views/crm/views/sales-made/components/modals/ProgramClientHeader";

export default {
  name: "RevissionModal",
  components: { ProgramClientHeader },
  props: {
    modal: {
      required: true,
      type: Object,
    },
    revission: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      advisor: [],
      advisorId: null,
      sendSms: false,
      observation: "",
      disabledButton:
        this.revission.type === 4 && this.revission.initialPayment == 1,
    };
  },
  computed: {
    title() {
      if (this.revission.type === 2) return "Send to revission";
      if (this.revission.type === 3) return "Disapprove";
      if (this.revission.type === 4) return "Approve";
      if (this.revission.type === 5) return "Send to supervisor";
      if (this.revission.type === 6) return "Send to ceo";
      if (this.revission.type === 7) return "Return";
      return "";
    },
    buttonText() {
      if (this.revission.type === 2 || this.revission.type === 6) return "Send";
      if (this.revission.type === 3) return "Disapprove";
      if (this.revission.type === 4) return "Approve";
      if (this.revission.type === 5) return "Send to supervisor";
      if (this.revission.type === 7) return "Return";
      return "";
    },
  },
  async created() {
    try {
      let module = 0;
      if (this.revission.idProgram == 1) module = 3;
      else if (this.revission.idProgram == 2) module = 7;
      else if (this.revission.idProgram == 3) module = 6;
      else if (this.revission.idProgram == 4) module = 5;
      else if (this.revission.idProgram == 5) module = 8;
      else if (this.revission.idProgram == 6) module = 10;
      else if (this.revission.idProgram == 7) module = 11;
      else if (this.revission.idProgram == 8) module = 14;
      else module = 12;
      const response = await amgApi.post(`/commons/user-modulep/${module}`, {
        // eslint-disable-next-line no-nested-ternary
        roles: module === 12 ? "[8]" : module === 11 ? "[1,2,8]" : "[1,2,3]",
        type: "1",
      });
      if (response.status === 200) this.advisor = response.data;
      if (this.revission.type === 2) this.sendSms = true;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async revision() {
      const response = await this.$refs.form.validate();
      if (this.revission.type !== 4) {
        if (response) {
          await this.send();
        }
      } else if (this.advisorId === null) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "Please select an advisor"
        );
      } else if (response) {
        this.sendAutorize();
      }
    },
    async send() {
      try {
        this.disabledButton = true;
        this.$store.commit("app/SET_LOADING", true);
        const response = await amgApi.post("/sales-made/revision-sale", {
          sale_id: this.revission.idsales,
          state: this.revission.type,
          observation: this.observation,
          user_id: this.revission.user_id,
          client: this.revission.nameClient,
          advisor_id: this.advisor_id,
          namesession: this.revission.sessioName,
          leadid: this.revission.leadid,
          program: this.revission.nameProgram,
          programid: this.revission.programid,
          firstprogram: null,
          firstacccout: null,
          firstprogramname: null,
          sendSms: this.sendSms,
          modul: this.revission.modul,
          sellerName: this.revission.sellerName,
          language: this.revission.language,
          last_name: this.revission.last_name,
        });
        if (response.status === 200) {
          if (this.revission.type == 5) {
            this.$emit("removeFromTable", this.revission.idsales);
          }
          this.$emit("response", true);
          this.$emit("click", false);
        }
        this.$store.commit("app/SET_LOADING", false);
      } catch (error) {
        this.disabledButton = false;
        this.showToast("danger", "top-right", "Error", "XIcon", error);
        this.$store.commit("app/SET_LOADING", false);
      }
    },
  },
};
</script>

<style scoped>
</style>
