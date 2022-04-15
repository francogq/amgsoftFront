<template>
  <div>
    <validation-observer #default="{ handleSubmit }" ref="refFormSendSms">
      <!-- Form -->
      <b-form
        class="p-2"
        @submit.prevent="handleSubmit(onSubmit)"
        @reset.prevent="resetForm"
      >
        <!-- Subject -->
        <validation-provider
          #default="validationContext"
          name="Subject"
          rules="required"
        >
          <b-form-group label="Subject" label-for="subject" label-cols-md="2">
            <b-form-input
              id="subject"
              v-model="subject"
              :state="getValidationState(validationContext)"
              trim
            />

            <b-form-invalid-feedback>{{
              validationContext.errors[0]
            }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
        <!-- Message -->
        <validation-provider
          #default="validationContext"
          name="Message"
          rules="required"
        >
          <b-form-group label="body" label-for="message" label-cols-md="2">
            <b-form-textarea
              id="message"
              placeholder="Write new Quick"
              rows="3"
              v-model="content"
              maxlength="1000"
              :state="getValidationState(validationContext)"
            />
            <template #description>
              <small tabindex="-1" class="form-text text-danger"
                >Max: 1000 characters</small
              >
            </template>

            <b-form-invalid-feedback>{{
              validationContext.errors[0]
            }}</b-form-invalid-feedback>
          </b-form-group>
        </validation-provider>
        <b-form-group label="VARS" class="w-100">
          <b-row>
            <b-col sm="2" class="pb-1">
              <b-input-group size="sm">
                <b-input-group-prepend is-text>@1</b-input-group-prepend>
                <b-form-input placeholder="FIRST NAME" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="pb-1">
              <b-input-group size="sm">
                <b-input-group-prepend is-text>@2</b-input-group-prepend>
                <b-form-input placeholder="LAST NAME" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="pb-1">
              <b-input-group size="sm">
                <b-input-group-prepend is-text>@3</b-input-group-prepend>
                <b-form-input placeholder="ADVISOR NAME" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="pb-1">
              <b-input-group size="sm">
                <b-input-group-prepend is-text>@4</b-input-group-prepend>
                <b-form-input placeholder="PHONE ADVISOR" readonly />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="pb-1">
              <b-input-group size="sm">
                <b-input-group-prepend is-text>@5</b-input-group-prepend>
                <b-form-input placeholder="PROGRAM NAME" readonly />
              </b-input-group>
            </b-col>
          </b-row>
        </b-form-group>
        <!-- Form Actions -->
        <div class="d-flex justify-content-center mt-2">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            type="submit"
          >
            <template v-if="isLoading">
              <b-spinner small />
              <span>Loading...</span>
            </template>
            <span v-else>Save</span>
          </b-button>
        </div>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInvalidFeedback,
  BButton,
} from "bootstrap-vue";
import { required } from "@validations";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import Ripple from "vue-ripple-directive";
import formValidation from "@core/comp-functions/forms/form-validation";
// Import Services
import ClientService from "../../services/clients.services"

export default {
  components: {
    BForm,
    BFormGroup,
    BFormInvalidFeedback,
    BButton,
    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  props: {
    quick: {
      type: Object,
    },
    type: {
      type: [Number, String],
    },
    modul: {
      type: [Number, String],
    },
  },
  data() {
    const resetRowData = () => {};
    const { getValidationState } = formValidation(resetRowData);
    return {
      getValidationState,
      id:this.quick.id,
      subject: this.quick.subject,
      content: "",
      required,
      isLoading: false,
      edited: false,
      blankQuickData: {},
    };
  },
  mounted() {
    this.content = this.quick.content.replace(/<br \/>/g, "\n");
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    })
  },
  methods: {
      ...mapActions("clients-store", ["SET_QUICKS"]),
    async onSubmit() {
      try {
        this.isLoading = true;
        const data = await ClientService.saveQuickEmail({
            id: this.id,
            subject: this.subject,
            content: this.content,
            user_id : this.currentUser.user_id,
            modul: this.modul
        })
        await this.SET_QUICKS({
          modul: this.modul,
        });
        this.$bvModal.hide("modal-quick-email-save");
        this.showToast(
            "success",
            "top-right",
            "Success!",
            "CheckIcon",
            "Successful operation"
          )       
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
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
};
</script>
