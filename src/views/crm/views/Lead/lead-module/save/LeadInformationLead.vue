<template>
  <b-card>
    <template #header>
      <b-card-title>LEAD INFORMATION</b-card-title>
    </template>
    <b-row>
      <b-col md="6">
        <!-- Lead Owner -->
        <validation-provider
          v-slot="{ errors }"
          name="Lead Owner"
          rules="required"
        >
          <b-form-group
            label="Lead Owner"
            label-for="userId"
            :state="errors[0] ? false : null"
          >
            <v-select
              id="userId"
              v-model="userData.user_id"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="label"
              :options="G_SELLERS"
              :clearable="false"
              :reduce="(el) => el.id"
              :disabled="isClient"
            />
          </b-form-group>
        </validation-provider>
        <!-- Lead Status -->
        <validation-provider
          v-slot="{ errors }"
          name="Lead Status"
          rules="required"
        >
          <b-form-group
            label="Lead Status"
            label-for="leadStatusId"
            :state="errors[0] ? false : null"
          >
            <b-input-group>
              <v-select
                v-model="userData.leadstatus_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                label="label"
                :options="G_STATUS_LEADS"
                style="width: 1%; flex: 1 1 auto"
                :clearable="false"
                :reduce="(el) => el.id"
                :disabled="userData.id && disabled.leadstatus_id"
              />
              <template v-if="userData.id">
                <b-input-group-append
                  v-if="!disabled.leadstatus_id"
                  class="border-right"
                >
                  <b-button
                    variant="outline-primary"
                    class="btn-sm"
                    @click="onSubmitFields"
                  >
                    <feather-icon icon="SaveIcon" class="cursor-pointer" />
                  </b-button>
                </b-input-group-append>
                <b-input-group-append class="border-right">
                  <b-button
                    variant="outline-warning"
                    class="btn-sm"
                    @click="toggleElement('leadstatus_id')"
                  >
                    <feather-icon
                      v-if="disabled.leadstatus_id"
                      icon="Edit2Icon"
                      class="cursor-pointer"
                    />
                    <amg-icon
                      v-else
                      icon="Edit2SlashIcon"
                      class="cursor-pointer"
                    />
                  </b-button>
                </b-input-group-append>
                <b-input-group-append
                  class="cursor-pointer"
                  @click="onModalTrackingChangeOpen(9, 'STATUS(LEAD)')"
                >
                  <b-input-group-text>
                    <feather-icon icon="ListIcon" />
                  </b-input-group-text>
                </b-input-group-append>
              </template>
            </b-input-group>
          </b-form-group>
        </validation-provider>
      </b-col>
      <b-col md="6">
        <!-- Lead Source -->
        <validation-provider
          v-slot="{ errors }"
          name="Lead Source"
          rules="required"
        >
          <b-form-group
            label="Lead Source"
            label-for="sourceId"
            :state="errors[0] ? false : null"
          >
            <v-select
              v-model="userData.source_id"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="label"
              :options="G_SOURCE_LEADS"
              :reduce="(el) => el.id"
              :clearable="false"
              :disabled="isClient"
            />
          </b-form-group>
        </validation-provider>
        <!-- Source Name -->
        <validation-provider
          v-slot="{ errors }"
          name="Source Name"
          rules="required"
        >
          <b-form-group
            label="Source Name"
            label-for="sourceNameId"
            :state="errors[0] ? false : null"
          >
            <v-select
              v-model="userData.sourcesname_id"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="label"
              :options="G_SOURCE_NAMES"
              :reduce="(el) => el.id"
              :clearable="false"
              :disabled="isClient"
            />
          </b-form-group>
        </validation-provider>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

import { required, alphaNum, email } from "@validations";
import vSelect from "vue-select";

import formValidation from "@core/comp-functions/forms/form-validation";

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  model: {
    event: "update:is-add-new-user-sidebar-active",
  },
  props: {
    userData: {
      required: true,
    },
    typeEdit: {
      type: String,
      default: "lead",
    },
  },
  data() {
    return {
      alphaNum,
      blankUserData: new Object(),
      disabled: {
        leadstatus_id: true,
      },
      email,
      required,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_STATUS_LEADS: "CrmLeadStore/G_STATUS_LEADS",
      G_SELLERS: "CrmGlobalStore/G_SELLERS",
      G_SOURCE_LEADS: "CrmLeadStore/G_SOURCE_LEADS",
      G_SOURCE_NAMES: "CrmGlobalStore/G_SOURCE_NAMES",
    }),
    isClient() {
      return this.typeEdit === "client";
    },
  },
  created() {
    this.setDataBlank("userData");
  },
  setup(props, { emit }) {
    const { refFormObserver, getValidationState } = formValidation(() => {});

    return {
      refFormObserver,
      getValidationState,
    };
  },
  methods: {
    ...mapActions({
      A_UPDATE_FIELDS_LEAD: "CrmLeadStore/A_UPDATE_FIELDS_LEAD",
      A_GET_SELLERS: "CrmGlobalStore/A_GET_SELLERS",
    }),
    ...mapMutations({
      M_STATUS_LEADS_CLIENT: "CrmLeadStore/M_STATUS_LEADS_CLIENT",
    }),
    setDataBlank(key) {
      this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`] = {
        ...this[key],
      };
    },
    resetElement(key, subkey) {
      const object = this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`];
      this[key][subkey] = object[subkey];
    },
    capitalize(el) {
      const element = this.userData[el];
      this.userData[el] =
        element.substr(0, 1).toUpperCase() + element.substr(1);
    },
    toggleElement(key) {
      this.disabled[key] = !this.disabled[key];
      if (this.disabled[key]) this.resetElement("userData", key);
    },
    async onSubmitFields() {
      this.showConfirmSwal()
        .then(async (result) => {
          if (result.value) {
            this.isPreloading(true);
            const response = await this.A_UPDATE_FIELDS_LEAD({
              id: this.currentUser.user_id,
              id_lead: this.userData.id,
              id_user: this.currentUser.user_id,
              typee: 9,
              street: null,
              city: null,
              state: null,
              zipcode: null,
              country: null,
              other_street: null,
              other_city: null,
              other_state: null,
              other_zipcode: null,
              other_country: null,
              phoneh: null,
              phonem: null,
              ssn: null,
              itin: null,
              other: null,
              statusLead: this.userData.leadstatus_id,
            });
            this.isPreloading(false);
            if (this.isResponseSuccess(response)) {
              this.blankUserData.leadstatus_id = this.userData.leadstatus_id;
              this.toggleElement("leadstatus_id");
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
            } else {
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                `Something went wrong.${response.message}`
              );
            }
          }
        })
        .catch((error) => {
          console.log("spmething went wrong onSubmitFields: ", error);
          this.isPreloading(false);
          this.showErrorSwal();
        });
    },
    onModalTrackingChangeOpen(type, name) {
      this.$emit("onModalTrackingChangeOpen", {
        type,
        name,
        mapFunction: (el) => ({
          ...el,
          main_row: el.fields,
          main_row_hide: el.fields_secret,
          seeHideCell: false,
        }),
      });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
.sidebar-xl {
  width: 90rem;
}
</style>
