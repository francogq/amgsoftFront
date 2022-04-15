<template>
  <div>
    <ValidationObserver ref="form">
      <b-row>
        <b-col md="12">
          <b-form-group
            label="Catcher"
            label-class="font-weight-bolder"
            label-cols="5"
            content-cols="7"
          >
            <b-form-input
              v-model.trim="contactInfo.catcher"
              type="text"
              disabled
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Program"
            label-class="font-weight-bolder"
            label-cols="5"
            content-cols="7"
          >
            <b-form-input
              v-model.trim="contactInfo.program"
              type="text"
              disabled
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Date"
            label-class="font-weight-bolder"
            label-cols="5"
            content-cols="7"
          >
            <b-form-input
              v-model="contactInfo.date"
              type="email"
              disabled
            ></b-form-input>
          </b-form-group>
          <b-form-group
            v-if="parent_source == 2"
            label="Contact Method"
            label-class="font-weight-bolder"
            label-cols="5"
            content-cols="7"
          >
            <b-form-input
              v-model.trim="contactInfo.contact_method"
              type="text"
              :class="['bg-white capitalize-sn']"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="Potential"
            label-class="font-weight-bolder"
            label-cols="5"
            content-cols="7"
          >
            <VueToggles
              class="mt-1 ml-2"
              height="27"
              width="70"
              checkedText="YES"
              uncheckedText="NO"
              checkedBg="#FF6045"
              uncheckedBg="lightgrey"
              :value="potential"
              @click="editReply(1)"
              fontWeight="bold"
            ></VueToggles>
          </b-form-group>
          <b-form-group
            label="Start Dialogue"
            label-class="font-weight-bolder"
            label-cols="5"
            content-cols="7"
          >
            <VueToggles
              class="mt-1 ml-2"
              height="27"
              width="70"
              checkedText="YES"
              uncheckedText="NO"
              checkedBg="#FF6045"
              uncheckedBg="lightgrey"
              :value="dialogue"
              @click="editReply(2)"
              fontWeight="bold"
            ></VueToggles>
          </b-form-group>
        </b-col>

        <b-modal
          id="modalReasonNoPotential"
          v-model="modalReasonNoPotential"
          size="md"
          title="Choose a Reason"
          centered
          @ok.prevent="confirmPotential"
          no-close-on-backdrop
          @hidden="closeModalReasonNotPotential"
        >
          <b-row>
            <b-col cols="11">
              <ValidationProvider rules="required" v-slot="{ errors }">
                <modal-reason-no-potential
                  ref="modalReasonNoPotential"
                  v-model="reasonId"
                ></modal-reason-no-potential>
                <div class="invalid-feedback" v-if="errors[0]">
                  Reason is {{ errors[0] }}
                </div>
              </ValidationProvider>
            </b-col>
            <b-col cols="1" class="p-0" v-if="isCeo || isSupervisor || isTeamLeader">
              <b-button size="sm" variant="primary" @click="addReason()">+</b-button>
            </b-col>

            <b-col cols="12">
              <template #modal-footer="{ ok, cancel }">
                <div style="display: flex; justify-content: end; align-items: center">
                  <b-button
                    variant="outline-danger"
                    class="mr-1"
                    @click="cancel(), (potential = !potential)"
                  >
                    Cancel
                  </b-button>
                  <b-button
                    variant="primary"
                    @click="ok()"
                    class="rounded btn-ui-green"
                  >
                    Confirm
                  </b-button>
                </div>
              </template>
            </b-col>
          </b-row>
        </b-modal>
      </b-row>
    </ValidationObserver>
    <modal-add-reason-not-potential 
      v-if="modalReason"
      :show="modalReason"
      @onClose="closeModalAddReasonNotPotential">

    </modal-add-reason-not-potential>
  </div>
</template>

<script>
// Components
import VueToggles from "vue-toggles";
import ModalReasonNoPotential from "./ModalReasonNotPotential.vue";
import ModalAddReasonNotPotential from "../../../create/components/ModalAddReasonNotPotential.vue";

// Services
import SNLeadsService from "@/views/social-network/services/leads";

export default {
  props: {
    contactInfo: {
      type: Object,
      default: () => ({
        catcher: "",
        potential: "",
        program: "",
        date: "",
        dialogue: "",
        contact_method: "",
        reason: "",
      }),
    },
    reply: {
      type: Object,
      default: () => ({}),
    },
    parent_source: {
      type: Number,
      default: () => 0,
    },
  },
  components: {
    VueToggles,
    ModalReasonNoPotential,
    "modal-add-reason-not-potential": ModalAddReasonNotPotential,
  },
  data() {
    return {
      dialogue: true,
      potential: true,
      modalReasonNoPotential: false,
      reasonId: null,
      modalReason: false,
    };
  },
  methods: {
    addReason(){
      this.modalReason = true
    },
    closeModalAddReasonNotPotential() {
      this.$refs.modalReasonNoPotential.getReasonsNoPotential();
      this.modalReason = false;
    },
    async editReply(type) {
      const confirm = await this.showGenericConfirmSwal({
        text: "Do you want to edit the information?",
      });

      if (confirm.value) {
        if (type == 1) {
          this.potential = !this.potential;
          if (!this.potential) {
            this.modalReasonNoPotential = true;
          } else {
            await this.updateChanges(type, this.contactInfo.potential);
            this.reply.potencial = this.potential ? "YES" : "NO";
          }
        } else {
          this.dialogue = !this.dialogue;
          this.contactInfo.dialogue = this.dialogue ? 1 : 2;
          await this.updateChanges(type, this.contactInfo.dialogue);
          this.reply.dialogue = this.dialogue ? "YES" : "NO";
        }
      }
    },
    confirmPotential() {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        } else {
          this.contactInfo.potential = this.potential ? 1 : 2;
          this.updateChanges(1, this.contactInfo.potential);
          this.reply.potencial = this.potential ? "YES" : "NO";
          this.modalReasonNoPotential = false;
        }
      });
    },
    async updateChanges(type, value) {
      try {
        let params = {
          type: type,
          value: value,
          id_reply: this.contactInfo.reply_id,
          reason_id: this.reasonId,
        };

        const response = await SNLeadsService.updatePotentialDialogById(params);

        if (response.status == 200) {
          this.showToast();
        }
      } catch (error) {
        throw error;
      }
    },
    closeModalReasonNotPotential() {
      this.modalReasonNoPotential = false;
    },
  },
  mounted() {
    this.dialogue = this.contactInfo.dialogue == "NO" ? false : true;
    this.potential = this.contactInfo.potential == "NO" ? false : true;
  },
};
</script>

<style scoped>
.w-pre {
  width: 40% !important;
}
.capitalize-sn {
  text-transform: capitalize;
}
</style>
