<template>
  <validation-observer #default="{ handleSubmit }" ref="refFormSendSms">
    <!-- Form -->
    <b-form class="p-2" @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="resetForm">
      <!-- Title -->
      <validation-provider #default="validationContext" name="Title" rules="required">
        <b-form-group label="Title" label-for="title" label-cols-md="2">
          <b-form-input
            id="title"
            v-model="quickData.title"
            :state="getValidationState(validationContext)"
            trim
          />

          <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>
      <!-- Message -->
      <validation-provider #default="validationContext" name="Message" rules="required">
        <b-form-group label="body" label-for="message" label-cols-md="2">
          <b-form-textarea
            id="message"
            placeholder="Write new Quick"
            rows="3"
            v-model="quickData.sms"
            maxlength="1000"
            :state="getValidationState(validationContext)"
          />
          <template #description>
            <small tabindex="-1" class="form-text text-danger">Max: 1000 characters</small>
          </template>

          <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <!-- VARS -->
      <b-form-group label="VARS" class="w-100">
        <b-row>
          <b-col sm="3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text>@1</b-input-group-prepend>
              <b-form-input placeholder="FIRST NAME" readonly />
            </b-input-group>
          </b-col>
          <b-col sm="3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text>@2</b-input-group-prepend>
              <b-form-input placeholder="LAST NAME" readonly />
            </b-input-group>
          </b-col>
        </b-row>
      </b-form-group>

      <!-- Form Actions -->
      <div class="d-flex justify-content-center mt-2">
        <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="success" type="submit">
          <template v-if="isLoading">
            <b-spinner small />
            <span>Loading...</span>
          </template>
          <span v-else>Save</span>
        </b-button>
      </div>
    </b-form>
  </validation-observer>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInvalidFeedback,
  BButton
} from "bootstrap-vue";
import { required } from "@validations";
import { ValidationProvider, ValidationObserver } from "vee-validate";

import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

import formValidation from "@core/comp-functions/forms/form-validation";

export default {
  components: {
    BForm,
    BFormGroup,
    BFormInvalidFeedback,
    BButton,

    // Form Validation
    ValidationProvider,
    ValidationObserver
  },
  directives: {
    Ripple
  },
  props: {
    modul: {
      type: Number,
      required: true
    },
    quickData: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token"
    })
  },
  data() {
    const resetRowData = () => {};
    const { getValidationState } = formValidation(resetRowData);
    return {
      getValidationState,
      userId: null,
      roleId: null,
      required,
      isLoading: false,
      edited: false,
      blankQuickData: {}
    };
  },
  methods: {
    ...mapActions({
      A_SET_SMS_QUICK: "CrmSmsStore/A_SET_SMS_QUICK"
    }),
    async onSubmit() {
      try {
        this.isLoading = true;
        const response = await this.A_SET_SMS_QUICK({
          ...this.quickData,
          user_id: this.userId,
          modul: this.modul
        });
        if (this.isResponseSuccess(response)) {
          this.showToast(
            "success",
            "top-right",
            "Success!",
            "CheckIcon",
            "Successful operation"
          );
          this.edited = true;
          this.$bvModal.hide("modal-quick-sms-save");
        } else
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            "Something went wrong"
          );
        this.isLoading = false;
      } catch (error) {
        console.log("Something went wrong onSubmit", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    }
  },
  created() {
    this.userId = this.currentUser.user_id;
    this.roleId = this.currentUser.role_id;
    this.quickData.sms = this.quickData.sms
      .replace(/\n/g, "<br />")
      .replace(/<br \/>/g, "\n");
    this.blankQuickData = JSON.parse(JSON.stringify(this.quickData));
  },
  mounted() {
    this.$root.$on("bv::modal::hidden", (bvEvent, modalId) => {
      if (modalId === "modal-quick-sms-save" && !this.edited) {
        this.quickData.sms = this.blankQuickData.sms;
        this.quickData.title = this.blankQuickData.title;
      }
    });
  }
};
</script>
