<template>
  <div>
    <b-modal
      modal-class="modal-primary"
      v-model="modalUp"
      scrollable
      title-class="h3 text-white"
      size="xmd"
      title="Send SMS"
      @hidden="hideModal(false)"
    >
      <validation-observer ref="form">
        <!-- Form -->
        <b-form class="p-1">
          <b-form-group>
            <b-input-group prepend="Leads">
              <div class="form-control h-auto bg-transparent border-secondary sms-container">
                <template v-for="(item, index) in nameLeads">
                  <span :key="index">
                    <span
                      v-if="modul == 15"
                    >{{ item.nick }} ({{ item.name == item.nick ? '' : item.name }})</span>
                    <span v-else>{{ item.name }}</span>
                    <feather-icon
                      v-if="nameLeads.length > 1"
                      class="text-danger cursor-pointer"
                      icon="MinusCircleIcon"
                      @click="deleteAccount(item.id)"
                    />&nbsp;
                  </span>
                </template>
              </div>
            </b-input-group>
          </b-form-group>
          <!-- Add Quick SMS -->

          <b-form-group class="mt-2" label="Add Quick SMS" label-for="first-name" label-cols-md="2">
            <b-input-group>
              <v-select
                v-model="smsData.optionsms"
                style="flex: 1 1 auto;"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                label="title"
                :options="S_SMS_QUICKS"
                @input="onSelectSms()"
              />
              <b-input-group-append v-if="[ 1, 2 ].includes(userId) || modul == 15">
                <b-button variant="outline-info" @click="$bvModal.show('modal-quick-sms')">
                  <feather-icon icon="AlignJustifyIcon" class="cursor-pointer mr-1" />Manage Quick SMS
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <!-- Message -->
          <b-row class="mt-2">
            <b-col lg="8">
              <validation-provider v-slot="{errors}" name="Message" rules="required">
                <b-form-group label-for="message">
                  <b-form-textarea
                    id="message"
                    v-model="smsData.contmessage"
                    placeholder="Write new message"
                    rows="10"
                    maxlength="1000"
                    :state="errors[0] ? false : null"
                  />
                  <template #description>
                    <small tabindex="-1" class="form-text text-danger">Max: 1000 characters</small>
                  </template>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col lg="4" class="text-center">
              <b-form-checkbox
                v-model="smsImage.switch"
                @change="switchChange()"
                name="check-button"
                switch
              >
                <p
                  v-text="smsImage.switch? 'Image Send On' : 'Image Send Off'"
                  :class="smsImage.switch? 'text-primary':''"
                ></p>
              </b-form-checkbox>
              <b-form-group>
                <div class="image-upload">
                  <label for="file_input_1" class="label-image">
                    <div class="form-group" :class="smsImage.switch ? 'cursor-pointer' : ''">
                      <input
                        type="file"
                        id="file_input_1"
                        accept="image/*"
                        @change="getImage"
                        :disabled="!smsImage.switch"
                        hidden
                      />
                      <figure class="figure">
                        <img
                          class="image-message"
                          :src="imageShow"
                          :class="!smsImage.switch ?'image-disabled' : ''"
                        />
                      </figure>
                    </div>
                  </label>

                  <!-- INPUT_FILE FIN -->
                </div>
              </b-form-group>
            </b-col>
          </b-row>
          <!-- Form Actions -->
        </b-form>
        <!-- modal QUICK SMS -->
        <b-modal
          id="modal-quick-sms"
          title-class="h4 text-white"
          modal-class="modal-primary"
          centered
          size="lg"
          title="Quick Sms"
          hide-footer
        >
          <modal-quick-sms :modul="modul" :quicks="S_SMS_QUICKS" />
        </b-modal>
      </validation-observer>
      <template #modal-footer>
        <b-row class="w-100">
          <b-col lg="6">
            <b-form-group label="VARS" class="w-100">
              <b-row>
                <b-col sm="4">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text>@1</b-input-group-prepend>
                    <b-form-input placeholder="FIRST NAME" readonly />
                  </b-input-group>
                </b-col>
                <b-col sm="4">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text>@2</b-input-group-prepend>
                    <b-form-input placeholder="LAST NAME" readonly />
                  </b-input-group>
                </b-col>
                <b-col v-if="currentUser.modul_id == 15" sm="4">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text>@3</b-input-group-prepend>
                    <b-form-input placeholder="LAST NAME" readonly />
                  </b-input-group>
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>
          <b-col lg="6">
            <div class="d-flex justify-content-end mt-2">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="success"
                @click="onSubmit"
              >
                <template v-if="isLoading">
                  <b-spinner small />
                  <span>Loading...</span>
                </template>
                <span v-else>Send</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInvalidFeedback,
  BButton
} from "bootstrap-vue";
import { required } from "@validations";
import { ValidationProvider, ValidationObserver } from "vee-validate";

import formValidation from "@core/comp-functions/forms/form-validation";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

import ModalQuickSms from "./ModalQuickSms.vue";

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInvalidFeedback,
    BButton,
    vSelect,
    ModalQuickSms,

    // Form Validation
    ValidationProvider,
    ValidationObserver
  },
  directives: {
    Ripple
  },
  props: {
    smss: {
      type: Array,
      required: true
    },
    modul: {
      type: Number,
      required: true
    },
    typesms: {
      type: Number,
      required: true
    },
    sms: {
      type: Array,
      required: true
    },
    nameLeads: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token"
    }),
    ...mapState({
      S_SMS_QUICKS: state => state.CrmSmsStore.S_SMS_QUICKS
    }),
    imageShow() {
      return this.viewImage;
    }
  },
  data() {
    let smsData = {
      optionsms: "",
      contmessage: ""
    };
    const blankSmsData = {
      optionsms: "",
      contmessage: ""
    };
    const resetRowData = () => {
      smsData = JSON.parse(JSON.stringify(blankSmsData));
    };
    const { refFormObserver, getValidationState } = formValidation(
      resetRowData
    );

    return {
      refFormObserver,
      getValidationState,
      userId: null,
      roleId: null,
      required,
      smsData,
      isLoading: false,
      savenote: false,
      modalUp: false,
      viewImage: "/assets/images/icons/sms-img.png",
      smsImage: {
        img: "",
        switch: false
      }
    };
  },
  methods: {
    ...mapActions({
      A_GET_SMS_QUICKS: "CrmSmsStore/A_GET_SMS_QUICKS",
      A_SEND_MESSAGE_LEAD: "CrmSmsStore/A_SEND_MESSAGE_LEAD"
    }),
    async getAllQuicksSms() {
      try {
        await this.A_GET_SMS_QUICKS({
          modul: this.modul
        });
      } catch (error) {
        console.log("Something wnet wrong getAllQuicksSms:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    hideModal(state) {
      this.modalUp = false;
      this.$emit("hide", state);
    },
    switchChange() {
      if (!this.smsImage.switch) {
        this.viewImage = "/assets/images/icons/sms-img.png";
      }
    },
    getImage(e) {
      let file = e.target.files[0];
      this.smsImage.img = file;
      this.uploadImage(file);
    },
    uploadImage(file) {
      let reader = new FileReader();
      reader.onload = e => {
        this.viewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    deleteAccount(id) {
      for (let i = 0; i < this.nameLeads.length; i++) {
        if (this.nameLeads[i].id == id) {
          this.nameLeads.splice(i, 1);
        }
      }
      if (this.typesms == 0) {
        const index = this.smss.indexOf(id);
        if (index !== -1) this.smss.splice(index, 1);
      } else {
        const index = this.sms.indexOf(id);
        if (index !== -1) this.sms.splice(index, 1);
      }
    },
    onSelectSms() {
      const index = this.S_SMS_QUICKS.map(el => el.id).indexOf(
        this.smsData.optionsms ? this.smsData.optionsms.id : null
      );
      if (index !== -1) {
        const format = this.S_SMS_QUICKS[index].sms
          ? this.S_SMS_QUICKS[index].sms.replace(/<br \/>/g, "\n")
          : "";
        this.smsData.contmessage = format;
      } else {
        this.smsData.contmessage = "";
      }
    },
    async onSubmit() {
      const validation = await this.$refs.form.validate();
      if (validation) {
        const confirm = await this.showConfirmSwal();

        if (confirm.isConfirmed) {
          try {
            this.addPreloader();
            let formData = new FormData();
            formData.append("message", this.smsData.contmessage);
            formData.append("user", this.userId);
            formData.append("leads", this.typesms == 0 ? this.smss : this.sms);
            formData.append("savenote", this.savenote == true ? 1 : 0);
            formData.append("modul", this.modul);
            formData.append(
              "image",
              this.smsImage.switch == true ? this.smsImage.img : ""
            );
            const response = await this.A_SEND_MESSAGE_LEAD(formData);
            this.hideModal(false)
            this.removePreloader();
            this.showToast(
              "success",
              "top-right",
              "Success!",
              "CheckIcon",
              "Successful operation"
            );
          } catch (error) {
            this.removePreloader();
            this.showErrorSwal(error);
          }
        }
      }
    }
  },
  mounted() {
    this.modalUp = true;
  },
  created() {
    this.userId = this.currentUser.user_id;
    this.roleId = this.currentUser.role_id;
    this.getAllQuicksSms();
  }
};
</script>

<style scoped>
.sms-container {
  max-height: 9.5rem;
  overflow: auto;
}
.figure {
  width: 237px;
}
.btn-message {
  background: green;
  color: white;
  width: 31%;
  font-weight: bold;
}
.image-message {
  max-width: 14rem !important;
  min-width: 14rem !important;
  max-height: 14rem !important;
}
.image-disabled {
  filter: grayscale(100%);
}
</style>
