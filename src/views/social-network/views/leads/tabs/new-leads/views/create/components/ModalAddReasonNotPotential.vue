<template>
  <div>
    <b-modal
      modal
      title="Add Reason"
      v-model="mutableShow"
      size="lg"
      modal-class="modal-primary"
      hide-footer
      body-class="mb-2"
      @hidden="close"
      title-tag="h3"
    >
      <b-container>
        <validation-observer ref="form">
          <b-row class="mt-2 mb-1">
            <b-col md="10">
              <validation-provider
                #default="{ errors }"
                name="Reason"
                rules="required"
              >
                <b-input-group :state="errors[0] ? false : null">
                  <b-input-group-prepend
                    is-text
                    :class="errors.length > 0 ? 'required' : ''"
                  >
                    Reason
                  </b-input-group-prepend>
                  <b-form-input
                    v-model="form.reason"
                    placeholder="Type here..."
                    class="reason"
                    :state="errors.length > 0 ? false : null"
                  />
                </b-input-group>
                <small class="text-danger" v-if="errors.length > 0">
                  This field {{ errors[0] }}
                </small>
              </validation-provider>
            </b-col>
            <b-col md="2">
              <b-button variant="primary" @click="saveReason"> Save </b-button>
            </b-col>
          </b-row>
        </validation-observer>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "@validations";

// Components
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    "standar-form-group": StandarFormGroup,
  },
  props: {
    show: {
      type: Boolean,
    },
  },
  data() {
    return {
      mutableShow: this.show,

      form: {
        reason: "",
      },

      // Validations
      required,
      email,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    ...mapActions({
      A_POST_SAVE_REASON_NOT_POTENTIAL:
        "SocialNetworkLeadsStore/A_POST_SAVE_REASON_NOT_POTENTIAL",
      A_GET_REASONS_NOT_POTENTIAL:
        "SocialNetworkLeadsStore/A_GET_REASONS_NOT_POTENTIAL",
    }),
    close() {
      this.$emit("onClose");
    },
    async saveReason() {
      try {
        this.$refs.form.validate().then(async (success) => {
          if (success) {
            this.addPreloader();

            const response = await this.A_POST_SAVE_REASON_NOT_POTENTIAL({
              reason: this.form.reason,
              user: this.currentUser.user_id,
            });

            if (response.status == 200) {
              await this.A_GET_REASONS_NOT_POTENTIAL();

              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );

              this.close();
            } else {
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                `Something went wrong. ${response.message}`
              );
            }
            this.removePreloader();
          }
        });
      } catch (error) {
        this.removePreloader();
        console.log("Something went wrong with saveReason: ", error);
        throw error;
      }
    },
  },
};
</script>

<style lang="scss">
.required {
  border: solid 1px red;
  border-radius: 5px 0px 0px 5px;
  outline: none !important;

  div {
    color: red !important;
  }
}
</style>