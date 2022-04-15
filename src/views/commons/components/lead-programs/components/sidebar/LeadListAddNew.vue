<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-xl"
    shadow
    backdrop
    right
    title="Create Lead"
    header-class="text-primary"
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default>
      <!-- BODY -->
      <validation-observer ref="refFormObserver">
        <!-- Form -->
        <b-form class="p-2">
          <basic-information-lead
            ref="refBasicInformationLead"
            :user-data="userData"
            :type-form="newLead"
          />
          <lead-information-lead :user-data="userData" />
          <billing-information-lead :user-data="userData" />
        </b-form>
      </validation-observer>
    </template>

    <template #footer>
      <b-row class="px-3 py-2">
        <b-col lg="6">
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="button"
            variant="info"
            @click="
              resetuserData();
              $refs.refFormObserver.reset();
            "
            >Reset</b-button
          >
        </b-col>
        <b-col lg="6">
          <div class="d-flex justify-content-end">
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
              <span v-else>Save</span>
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="
                resetuserData();
                $refs.refFormObserver.reset();
                $emit('update:is-add-new-user-sidebar-active', false);
              "
              >Cancel</b-button
            >
          </div>
        </b-col>
      </b-row>
    </template>
  </b-sidebar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

import formValidation from "@core/comp-functions/forms/form-validation";
import countries from "@/@fake-db/data/other/countries";

import BasicInformationLead from "@/views/crm/views/Lead/lead-module/save/BasicInformationLead.vue";
import BillingInformationLead from "@/views/crm/views/Lead/lead-module/save/BillingInformationLead.vue";
import LeadInformationLead from "@/views/crm/views/Lead/lead-module/save/LeadInformationLead.vue";

export default {
  components: {
    BasicInformationLead,
    LeadInformationLead,
    BillingInformationLead,
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
  directives: {
    Ripple,
  },
  model: {
    prop: "isAddNewUserSidebarActive",
    event: "update:is-add-new-user-sidebar-active",
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    const resetRowData = () => {};
    const { getValidationState, resetForm } = formValidation(resetRowData);
    return {
      getValidationState,
      resetForm,
      blankUserData: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        programs: [],
        dob: "",
        language: "",
        stateLead: null,
        social: "",
        ssn: "",
        itin: "",
        other: "",
        phone: "",
        mobile: "",
        other: "",
        address: {
          prename: "main",
          streetReal: "",
          street: "",
          city: "",
          state: "CA",
          zipcode: "",
          country: "United States",
        },
        origin_country: 146,
        another_address: "",
        otherAddress: {
          prename: "origin",
          streetReal: "",
          street: "",
          city: "",
          state: "",
          zipcode: "",
          country: "United States",
        },
        user_id: null,
        source_id: "",
        leadstatus_id: "",
        sourcesname_id: "",
        cardNumber1: "",
        cardNumber2: "",
        cardNumber3: "",
        cardNumber4: "",
        cardExpiMonth: "",
        cardExpiYear: "",
        cardHoldername: "",
        cardSecurityCode: "",
        cardAddress: {
          prename: "card",
          streetReal: "",
          street: "",
          city: "",
          state: "",
          zipcode: "",
          country: "United States",
        },
        programId: null,
        work: "",
        creditReport: true,
        payment: "0",
        ammount: "",
        description: "",
        cardNumber: "",
        typeCredit: "0",
        dateOnline: "",
        plataform: null,
        usernameOnline: "",
        passwordonline: "",
        memberNumberOnline: "",
      },
      userData: {},
      required,
      alphaNum,
      email,
      countries,
      isLoading: false,
      newLead: "newLead",
    };
  },
  created() {
    this.resetuserData();
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_STATE_LEADS: "CrmLeadStore/G_STATE_LEADS",
      G_STATUS_LEADS: "CrmLeadStore/G_STATUS_LEADS",
      G_SOURCE_NAMES: "CrmGlobalStore/G_SOURCE_NAMES",
      G_SELLERS: "CrmGlobalStore/G_SELLERS",
    }),
  },
  methods: {
    ...mapActions({
      A_SET_LEADS: "CrmLeadStore/A_SET_LEADS",
    }),
    resetuserData() {
      this.blankUserData.user_id = this.currentUser.user_id;
      this.userData = JSON.parse(JSON.stringify(this.blankUserData));
    },
    getSelectValue(element, state) {
      if (element && state && this[state] && this[state].length) {
        const index = this[state].map((el) => el.id).indexOf(element);
        if (index !== -1) return this[state][index];
      }
      return new Object();
    },
    async onSubmit() {
      try {
        if (await this.$refs.refFormObserver.validate()) {
          this.isLoading = true;
          let route = "";
          switch (this.currentUser.modul_id) {
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
          route = "lead-show";
          if (
            ![
              this.userData.cardNumber1,
              this.userData.cardNumber2,
              this.userData.cardNumber3,
              this.userData.cardNumber4,
            ].includes("")
          ) {
            this.userData.cardNumber = `${this.userData.cardNumber1}-${this.userData.cardNumber2}-${this.userData.cardNumber3}-${this.userData.cardNumber4}`;
          }
          // VALIDATION ITIN & SSN
          const val = this.userData.social.substr(0, 1);
          if (val == 9) {
            this.userData.itin = this.userData.social;
          } else {
            this.userData.ssn = this.userData.social;
          }
          const { role_id } = this.currentUser;
          this.userData.programs =
            this.$refs.refBasicInformationLead.returnProgramlist();
          const {
            email,
            user_id,
            first_name,
            last_name,
            middle_name,
            source_id,
            sourcesname_id,
            programId,
            phone,
            mobile,
            work,
            creditReport,
            payment,
            ammount,
            programs,
            leadstatus_id,
            address,
            description,
            cardExpiMonth,
            cardExpiYear,
            ssn,
            cardHoldername,
            cardNumber,
            cardSecurityCode,
            dob,
            cardAddress,
            typeCredit,
            dateOnline,
            plataform,
            usernameOnline,
            passwordonline,
            memberNumberOnline,
            language,
            itin,
            other,
            state_lead,
            another_address,
            otherAddress,
            origin_country,
          } = this.userData;
          const body = {
            id: "",
            email,
            user_id,
            first_name,
            last_name,
            middle_name,
            source_id,
            sourcesname_id,
            program_id: programId,
            phone,
            mobile,
            work,
            credit_report: creditReport,
            payment,
            ammount,
            program: programs.map((el) => ({
              id: el.id,
              value: el.label,
              name: el.label,
            })),
            leadstatus_id,
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            zipcode: address.zipcode,
            description,
            card_expi_month: cardExpiMonth,
            card_expi_year: cardExpiYear,
            ssn,
            cardholdername: cardHoldername,
            cardnumber: cardNumber,
            cardsecuritycode: cardSecurityCode,
            dob,
            super: role_id,
            created_by: user_id,
            usercreator: user_id,
            datecreator: this.$moment(dob, "YYYY-MM-DDTHH:mm:ss").format(
              "YYYY-MM-DD"
            ),
            streetcard: cardAddress.street,
            citycard: cardAddress.city,
            zipcodecard: cardAddress.zipcode,
            statecard: cardAddress.state,
            countrycard: cardAddress.country,
            type_credit: typeCredit,
            dateonline: dateOnline,
            plataform,
            usernameonline: usernameOnline,
            passwordonline,
            membernumberonline: memberNumberOnline,
            language,
            itin,
            other,
            state_lead,
            another_address,
            otherstreet: otherAddress.street,
            othercity: otherAddress.city,
            otherstate: otherAddress.state,
            othercountry: otherAddress.country,
            otherzipcode: otherAddress.zipcode,
            originCountry: origin_country,
            lead_name: `${first_name} ${last_name}`, // fot table leads
            state_hour: this.getSelectValue(state_lead, "G_STATE_LEADS").label, // fot table leads
            status: this.getSelectValue(leadstatus_id, "G_STATUS_LEADS").label, // fot table leads
            source_name: this.getSelectValue(sourcesname_id, "G_SOURCE_NAMES")
              .label, // fot table leads
            owner: this.getSelectValue(user_id, "G_SELLERS").label, // fot table leads
          };
          const response = await this.A_SET_LEADS(body);
          if (response && (response.status == 200 || response.status == 201)) {
            this.isLoading = false;
            this.$refs.refFormObserver.reset();
            this.$emit("update:is-add-new-user-sidebar-active", false);
            this.resetuserData();
            this.$router.resolve({name: "debtsolution-leads"});
            // let routeData = this.$router.resolve({
            //   name: "lead-show",
            //   params: { id: response.data.id },
            // });
            // window.open(routeData.href, "_blank");
            /* this.$router.push({ name: route, params: { id: response.data.id } }) */
            this.$emit("saveLead");
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
              "Something went wrong."
            );
          }
        }
      } catch (error) {
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