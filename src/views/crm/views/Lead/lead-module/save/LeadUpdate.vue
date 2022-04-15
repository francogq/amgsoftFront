<template>
  <div>
    <b-sidebar
      id="add-new-user-sidebar"
      :visible="isAddNewUserSidebarActive"
      bg-variant="white"
      sidebar-class="sidebar-xl"
      shadow
      backdrop
      right
      title="Edit Lead"
      header-class="text-primary"
      @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
    >
      <template #default>
        <!-- BODY -->
        <validation-observer ref="refFormObserver">
          <!-- Form -->
          <div class="p-2">
            <basic-information-lead
              ref="refBasicInformationLead"
              :user-data="lead"
              :blank-user-fields="blankUserFields"
              :type-form="editLead"
              @onModalTrackingChangeOpen="onModalTrackingChangeOpen"
            />
            <lead-information-lead
              :user-data="lead"
              :type-edit="typeEdit"
              @onModalTrackingChangeOpen="onModalTrackingChangeOpen"
            />

            <card-lead-credit-card
              :modul="modul"
              :only-read="false"
              :lead="lead"
              title="CREDIT CARDS"
            />
          </div>
        </validation-observer>
      </template>

      <template #footer>
        <div class="d-flex justify-content-end px-3 py-2">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-2"
            @click="onSubmit"
          >
            <template v-if="isLoading">
              <b-spinner small />
              <span>Loading...</span>
            </template>
            <span v-else>Update</span>
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="button"
            variant="outline-secondary"
            @click="$refs.refFormObserver.reset(); $emit('update:is-add-new-user-sidebar-active', false)"
          >Cancel</b-button>
        </div>
      </template>
    </b-sidebar>

    <!-- modal Tracking Change -->
    <b-modal
      id="modal-tracking-change"
      ok-only
      modal-class="modal-primary"
      centered
      size="lg"
      :title="`Tracking Change ${ titleTrackingChange }`"
      hide-footer
    >
      <tracking-change-component
        :lead="lead"
        :items="itemsTrackingChange"
        :name="titleTrackingChange"
        :is-busy="isBusyTrackingChange"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

import { required, alphaNum, email } from "@validations";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

import formValidation from "@core/comp-functions/forms/form-validation";
import countries from "@/@fake-db/data/other/countries";

import TrackingChangeComponent from "@/views/crm/views/Lead/lead-module/save/TrackingChangeComponent.vue";
import BasicInformationLead from "./BasicInformationLead.vue";
import BillingInformationLead from "./BillingInformationLead.vue";
import CardLeadCreditCard from "../dashboard/CardLeadCreditCard.vue";
import LeadInformationLead from "./LeadInformationLead.vue";

export default {
  components: {
    BasicInformationLead,
    BillingInformationLead,
    CardLeadCreditCard,
    LeadInformationLead,
    TrackingChangeComponent,
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver
  },
  directives: {
    Ripple
  },
  model: {
    prop: "isAddNewUserSidebarActive",
    event: "update:is-add-new-user-sidebar-active"
  },
  props: {
    modul: {
      type: Number,
      required: true
    },
    lead: {
      type: Object,
      required: true
    },
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true
    },
    typeEdit: {
      type: String,
      default: "lead"
    }
  },
  data() {
    const resetRowData = () => {};
    const { getValidationState, resetForm } = formValidation(resetRowData);
    return {
      getValidationState,
      resetForm,
      blankUserFields: {
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
        statusLead: null
      },
      userData: {},
      required,
      alphaNum,
      email,
      countries,
      isLoading: false,
      itemsTrackingChange: [],
      isBusyTrackingChange: false,
      titleTrackingChange: "",
      editLead: "editLead"
    };
  },
  created() {
    this.lead.programs = this.lead.program
      ? this.lead.program.map(el => ({ id: el.id, label: el.name }))
      : [];
    this.lead.state_lead = this.lead.status_l;
    this.lead.address = {
      id: this.lead.id,
      prename: "main",
      streetReal: this.lead.street,
      street: this.lead.street,
      city: this.lead.city,
      state: this.lead.states_eeuu_slug,
      zipcode: this.lead.zipcode,
      country: this.lead.country
    };
    this.lead.otherAddress = {
      id: this.lead.id,
      prename: "origin",
      streetReal: this.lead.other_street,
      street: this.lead.other_street,
      city: this.lead.other_city,
      state: this.lead.other_states_eeuu_slug,
      zipcode: this.lead.other_zipcode,
      country: this.lead.other_country
    };
    this.lead.dateonline = "";
    this.lead.passwordonline = "";
    this.lead.membernumberonline = "";
    this.lead.plataform =
      this.lead.credit && this.lead.credit.length
        ? this.lead.credit[0].plataform_id
        : null;
    this.lead.usernameonline =
      this.lead.credit && this.lead.credit.length
        ? this.lead.credit[0].username
        : null;
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token"
    })
  },
  methods: {
    ...mapActions({
      A_SET_LEADS: "CrmLeadStore/A_SET_LEADS",
      A_GET_LEAD: "CrmLeadStore/A_GET_LEAD",
      A_GET_ALL_TRAKING_FIELDS_LEAD:
        "CrmLeadStore/A_GET_ALL_TRAKING_FIELDS_LEAD",
      A_UPDATE_LEAD: "CrmLeadStore/A_UPDATE_LEAD"
    }),
    ...mapMutations({
      M_KEY_UPDATE_DETAILS_LEAD: "CrmLeadStore/M_KEY_UPDATE_DETAILS_LEAD"
    }),
    getSelectValue(element) {
      if (typeof element === "string") return element || "";
      return element ? element.value : "";
    },
    async onSubmit() {
      try {
        if (await this.$refs.refFormObserver.validate()) {
          this.isLoading = true;
          let route = "";
          // eslint-disable-next-line default-case
          switch (this.modul) {
            case 2:
              route = "show/";
              break;
            case 3:
              route = "/bussiness/leads";
              break;
            case 4:
              route = "/administration/leads";
              break;
            case 5:
              route = "/debtsolution/leads";
              break;
            case 6:
              route = "/creditexperts/leads";
              break;
            case 7:
              route = "/boostcredit/leads";
              break;
            case 8:
              route = "/taxresearch/leads";
              break;
            case 10:
              route = "/claimdepartment/leads";
              break;
            case 11:
              route = "/specialists/leads";
              break;
          }
          this.lead.programs = this.$refs.refBasicInformationLead.returnProgramlist(); // return programs because doesnt work good with v-select in the sidebar
          const body = {
            ...this.lead,
            datecreator: this.$moment(this.lead.created_at).format(
              "YYYY-MM-DD"
            ),
            mobile_count: 0,
            modul: this.modul,
            creatorname: this.lead.creator_name,
            type: 0,
            originCountry: this.lead.origin_country,
            otherstreet: this.lead.otherAddress.street,
            othercity: this.lead.otherAddress.city,
            otherstate: this.lead.otherAddress.state,
            othercountry: this.lead.otherAddress.country,
            otherzipcode: this.lead.otherAddress.zipcode,
            street: this.lead.address.street,
            city: this.lead.address.city,
            state: this.lead.address.state,
            country: this.lead.address.country,
            zipcode: this.lead.address.zipcode,
            super: this.currentUser.role_id,
            type_credit: this.lead.type_credit_report,
            usercreator: this.lead.created_by,
            programs: this.lead.programs.map(el => ({
              id: el.id,
              name: el.label
            }))
          };
          this.addPreloader();
          await this.A_UPDATE_LEAD({ id: this.lead.id, body });
          await this.A_GET_LEAD({ id: this.lead.id, body });
          this.M_KEY_UPDATE_DETAILS_LEAD();
          this.removePreloader();

          this.isLoading = false;
          this.$refs.refFormObserver.reset();
          this.showToast(
            "success",
            "top-right",
            "Success!",
            "CheckIcon",
            "Successful operation"
          );
          this.$emit("update-lead", this.lead);
        }
      } catch (error) {
        this.removePreloader();
        console.log("spmething went wrong onSubmit: ", error);
        this.isLoading = false;
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async onModalTrackingChangeOpen(attribute) {
      try {
        this.titleTrackingChange = attribute.name;
        this.$bvModal.show("modal-tracking-change");
        this.isBusyTrackingChange = true;
        const response = await this.A_GET_ALL_TRAKING_FIELDS_LEAD({
          id_lead: this.lead.id,
          typee: attribute.type,
          id_module: this.modul
        });
        if (this.isResponseSuccess(response)) {
          this.itemsTrackingChange = response.data.map(attribute.mapFunction);
        } else {
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            "Something went wrong."
          );
        }
        this.isBusyTrackingChange = false;
      } catch (error) {
        console.log("spmething went wrong onModalTrackingChangeOpen: ", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isBusyTrackingChange = false;
      }
    }
  },
  mounted() {
    this.blankUserFields.id = this.currentUser.user_id;
    this.blankUserFields.id_lead = this.lead.id;
    this.blankUserFields.id_user = this.currentUser.user_id;
  }
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
  width: 90rem !important;
}
.b-sidebar-header {
  flex-direction: row-reverse !important;
  justify-content: space-between !important;
  .close {
    margin-right: revert !important;
  }
}
</style>
