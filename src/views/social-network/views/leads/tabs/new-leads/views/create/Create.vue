<template>
  <div>
    <header-slot></header-slot>

    <validation-observer ref="form">
      <card-catchment :lead="lead" />
      <card-basic-information :lead="lead" />
      <card-personal-information :lead="lead" v-if="lead.start_dialogue" />
      <card-more-information :lead="lead" v-if="lead.more_information" />
      <card-billing-information :lead="lead" v-if="lead.more_information" />
      <card-task :lead="lead" v-if="lead.start_dialogue" />

      <b-row class="justify-content-start">
        <b-button
          variant="danger"
          class="ml-1"
          :to="{ name: 'sn-list-new-leads' }"
        >
          <feather-icon icon="XIcon" size="16"></feather-icon>
          Cancel
        </b-button>
        <b-button variant="success" class="ml-1" @click="validateLead">
          <feather-icon icon="CheckIcon" size="16"></feather-icon>
          Create
        </b-button>
      </b-row>
    </validation-observer>
    <br />
    <br />
  </div>
</template>

<script>
// Components
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "@validations";

import CardCatchment from "./components/CardCatchment.vue";
import CardBasicInformation from "./components/CardBasicInformation.vue";
import CardPersonalInformation from "./components/CardPersonalInformation.vue";
import CardMoreInformation from "./components/CardMoreInformation.vue";
import CardBillingInformation from "./components/CardBillingInformation.vue";
import CardTask from "./components/CardTask.vue";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    "card-catchment": CardCatchment,
    "card-basic-information": CardBasicInformation,
    "card-personal-information": CardPersonalInformation,
    "card-more-information": CardMoreInformation,
    "card-billing-information": CardBillingInformation,
    "card-task": CardTask,
  },
  data() {
    return {
      name: "",
      required,
      email,
      lead: {
        id: "",
        source_id: "",
        program_id: null,
        super: "",
        created_by: "",
        user_creator: "",
        last_action: "",

        created_at: moment().format("YYYY-MM-DD"),
        created_hour: "",
        recovery: 0,
        images: [],
        files: [],
        more_info: false,
        ssn: "",
        itin: "",
        other: "",
        card_number: "",
        id_method: null,

        // Catchment
        catcher: "",
        state_h: null,
        user_id: "",
        program: [],
        sourcesname_id: 17,
        sub_source: null,
        google_ads: null,
        fanpage_id: "",
        flyer: null,
        flyer_selected: null,
        titleModalChoose: null,

        // Basic information
        nickname: "",
        language: "ES",
        start_dialogue: false,

        // Personal information
        first_name: "",
        last_name: "",
        mobile: null,
        zip_code: "",
        email: "",
        note: "",
        potential: true,
        more_information: false,
        reason_not_potential: null,

        // More information
        dob: "",
        state_lead: null,
        type_document: null,
        document: "",
        phone: null,
        street: "",
        city: "",
        state: null,

        // Billing information
        card_holder_name: "",
        card_exp_month: "",
        card_exp_year: "",
        card_security_code: "",
        street_card: "",
        city_card: "",
        state_card: "",
        zip_code_card: "",
        country_card: "United States",

        // Tasks
        attend: null,
        date: null,
        date_from: null,
        date_to: null,
        title: "",
        seller: "",
        subject: "CALL",
        assign: "",
        due_date: moment().format("YYYY-MM-DD"),
        hour: "",
        sms_status: 1,
        description: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    dialogue() {
      return this.lead.start_dialogue;
    },
  },
  watch: {
    "lead.potential"(newVal) {
      this.getReasonsNotPotential();
    },
  },
  methods: {
    ...mapActions({
      A_GET_SUB_SOURCES: "SocialNetworkLeadsStore/A_GET_SUB_SOURCES",
      A_GET_FAN_PAGE_PROGRAMS:
        "SocialNetworkLeadsStore/A_GET_FAN_PAGE_PROGRAMS",
      A_GET_REASONS_NOT_POTENTIAL:
        "SocialNetworkLeadsStore/A_GET_REASONS_NOT_POTENTIAL",
      A_GET_STATES: "StandarStore/A_GET_STATES",
      A_GET_SELLERS: "StandarStore/A_GET_SELLERS",
      A_GET_STATUS_LEAD: "StandarStore/A_GET_STATUS_LEAD",
      A_GET_STATES_EEUU: "StandarStore/A_GET_STATES_EEUU",
    }),
    getSubSources() {
      this.A_GET_SUB_SOURCES();
    },
    getFanPagePrograms() {
      this.A_GET_FAN_PAGE_PROGRAMS();
    },
    async getStatesAD() {
      try {
        await this.A_GET_STATES({
          type: 1,
        });
      } catch (error) {
        console.log("Something went wrong on getStatesAD: ", error);
        this.showErrorSwal(error);
      }
    },
    async getSellers() {
      try {
        await this.A_GET_SELLERS({
          modul: this.currentUser.modul_id,
          body: {
            roles: "[]",
            type: "1",
          },
        });
      } catch (error) {
        console.log("Something went wrong on getUsersCreatorOwner: ", error);
        throw error;
      }
    },
    async getStatusLead() {
      try {
        await this.A_GET_STATUS_LEAD();
      } catch (error) {
        console.log("Something went wrong on getStatusLead: ", error);
        throw error;
      }
    },
    async getStatesEEUU() {
      try {
        await this.A_GET_STATES_EEUU({});
      } catch (error) {
        console.log("Something went wrong on getStatesEEUU", error);
        throw error;
      }
    },
    async validateLead() {
      this.$refs.form.validate().then((success) => {
        if (success) {
          this.showSwalGeneric("Are you sure?", "", "question").then(
            async (result) => {
            }
          );
        }
      });
    },
    resetForm() {},
    async getReasonsNotPotential() {
      try {
        await this.A_GET_REASONS_NOT_POTENTIAL();
      } catch (error) {
        console.log("Somenthing went wrong on getReasonsNotPotential", error);
        throw error;
      }
    },
  },
  async created() {
    this.lead.user_id =
      this.lead.created_by =
      this.lead.user_creator =
      this.lead.catcher =
        this.currentUser.user_id;

    this.lead.super = this.currentUser.role_id;

    this.getSubSources();
    this.getFanPagePrograms();
    await this.getStatesAD();
    await this.getSellers();
    await this.getStatusLead();
    await this.getStatesEEUU();
  },
};
</script>

<style>
</style>