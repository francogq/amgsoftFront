<template>
  <div>
    <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
      <!-- Form -->
      <b-form
        class="pt-2"
        @submit.prevent="handleSubmit(onSubmit)"
        @reset.prevent="resetForm"
      >
        <b-row>
          <b-col cols="12" class="text-center">
            <b-img-lazy class="mb-1" src="/assets/images/icons/sale.png" />
            <p class="font-weight-bolder text-primary">Was the sale made?</p>
          </b-col>
          <b-col cols="12">
            <validation-provider
              #default="validationContext"
              name="Program"
              rules="required"
            >
              <b-form-group
                label="Program"
                label-for="program"
                :state="getValidationState(validationContext)"
              >
                <v-select
                  v-model="data.program"
                  input-id="program"
                  label="label"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="G_PROGRAMS"
                  :multiple="true"
                  :reduce="(val) => val.id"
                  placeholder="Select Program"
                />
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
          </b-col>
        </b-row>
        <!-- Form Actions -->
        <div class="d-flex justify-content-center mt-2">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mr-2"
            type="submit"
            :disabled="isLoading"
            @click="data.done = 1"
          >
            <template v-if="isLoading">
              <b-spinner small />
              <span>Loading...</span>
            </template>
            <template v-else>
              <feather-icon icon="CheckIcon" class="mr-50" />
              <span>Yes</span>
            </template>
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="info"
            type="submit"
            :disabled="isLoading"
            @click="data.done = 0"
          >
            <template v-if="isLoading">
              <b-spinner small />
              <span>Loading...</span>
            </template>
            <template v-else>
              <feather-icon icon="WatchIcon" class="mr-50" />
              <span>Pending</span>
            </template>
          </b-button>
        </div>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import formValidation from "@core/comp-functions/forms/form-validation";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

export default {
  components: {
    vSelect,
  },
  props: {
    modul: {
      type: Number,
      required: true,
    },
    onlyRead: {
      type: Boolean,
      required: true,
    },
    event: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { refFormObserver, getValidationState } = formValidation(() => {});

    return {
      refFormObserver,
      getValidationState,
    };
  },
  data() {
    return {
      isLoading: false,
      data: {
        program: null,
        done: null,
      },
    };
  },
  mounted() {},
  created() {},
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_PROGRAMS: "CrmGlobalStore/G_PROGRAMS",
    }),
  },
  methods: {
    ...mapActions({
      A_ATTEND_EVENT: "CrmEventStore/A_ATTEND_EVENT",
    }),
    onSubmit() {
      this.isLoading = true;
      this.showConfirmSwal(
        "Attending appointment?",
        "You won't be able to revert this!"
      )
        .then(async (result) => {
          if (result.value) {
            this.data.program.map(async (item) => {
              const response = await this.A_ATTEND_EVENT({
                id: this.event.id,
                program: item,
                done: this.data.done,
                module: this.modul,
              });

              if (this.isResponseSuccess(response)) {
                /* *INTEGRATE* resources\js\components\modal\ModaEventEdit.vue - method: doneAttend */
              }
            });

            this.$router.push({
              name: "sales-made-crm-new-client",
              query: { done: this.data.done === 1 ? 1 : 2 },
            });
          }

          this.isLoading = false;
        })
        .catch((error) => {
          console.log("Something went wrong onSubmit", error);
          this.showToast(
            "danger",
            "top-right",
            "Oop!",
            "AlertOctagonIcon",
            this.getInternalErrors(error)
          );
        });
    },
  },
  directives: {
    Ripple,
  },
};
</script>
