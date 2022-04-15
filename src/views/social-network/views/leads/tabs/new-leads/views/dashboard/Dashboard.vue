<template>
  <div>
    <header-slot>
      <b-row slot="actions" class="justify-content-end">
        <lead-create-social color_btn="primary" />
        <b-button
          variant="success"
          class="mr-1"
          @click="openModalSendSms(lead)"
        >
          <feather-icon
            icon="MessageCircleIcon"
            size="15"
            class="mr-50 text-white"
          />
          SEND SMS
        </b-button>
        <b-button
          variant="outline-secondary"
          class="btn-icon mr-1"
          @click="openModalHistorySms"
        >
          <feather-icon icon="ListIcon" size="18" />
        </b-button>
      </b-row>
    </header-slot>

    <b-row class="card-group">
      <b-col md="12">
        <card-personal-information
          :modul="modul"
          :lead="lead"
          :personalInfo="personalInfo"
          :personalAddress="personalAddress"
          :personalMobile="personalMobile"
          :requiredFieldsForCreateCrmTask="requiredFieldsForCreateCrmTask"
          :dataAlreadyLoaded="dataAlreadyLoaded"
        />
      </b-col>
      <b-col md="12">
        <card-address
          :personalAddress="personalAddress"
          :requiredFieldsForCreateCrmTask="requiredFieldsForCreateCrmTask"
          @cancel-edit-address="cancelEditAddress"
        />
      </b-col>
      <b-col md="6">
        <card-credit-report :lead="lead" />
      </b-col>
      <b-col md="6">
        <card-lead-cards :lead="lead" :cardsLead="cardsLead" :modul="modul" />
      </b-col>
      <b-col md="12">
        <card-contact-information
          :catcher="currentUser.user_id"
          :lead="lead"
          :personalInfo="personalInfo"
          :requiredFieldsForCreateCrmTask="requiredFieldsForCreateCrmTask"
          :modul="modul"
        />
      </b-col>
    </b-row>

    <modal-send-sms
      v-if="showModalSendSms"
      :smss="leads_sms"
      :modul="currentUser.modul_id"
      :typesms="typesms"
      :sms="leads_sms_o"
      :name-leads="name_leads_arr"
      @hide="closeModalSendSms"
    />

    <b-modal
      id="modal-history-sms"
      ok-only
      modal-class="modal-primary"
      title-class="text-white h4"
      centered
      size="lg"
      title="History of Sms"
      hide-footer
    >
      <modal-history-sms
        :id="historySms.id"
        :modul="currentUser.modul_id"
        :lead-name="historySms.leadName"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// Components
import CardPersonalInformation from "./components/personal-information/CardPersonalInformation.vue";
import CardAddress from "./components/address/CardAddress.vue";
import CardCreditReport from "./components/credit-report/CardCreditReport.vue";
import CardLeadCards from "./components/cards/CardLeadCards.vue";
import CardContactInformation from "./components/contact-information/CardContactInformation.vue";
import ModalSendSms from "@/views/crm/views/Lead/lead-sms/ModalSendSms.vue";
import ModalHistorySms from "@/views/crm/views/Lead/lead-sms/ModalHistorySms.vue";
import LeadCreateSocial from "@/views/social-network/views/leads/components/lead-create/LeadCreateSocial";

// Services
import SNLeadsService from "@/views/social-network/services/leads";

export default {
  components: {
    CardPersonalInformation,
    CardAddress,
    CardCreditReport,
    CardLeadCards,
    CardContactInformation,
    ModalSendSms,
    ModalHistorySms,
    LeadCreateSocial,
  },
  data() {
    return {
      personalInfo: {},
      personalAddress: {},
      cardsLead: {},
      personalMobile: {},
      requiredFieldsForCreateCrmTask: {
        first_name: null,
        last_name: null,
        mobile: null,
        state: null,
      },
      lead: {},
      user: null,

      historySms: {
        leadName: "",
        id: null,
      },

      leads_sms: [],
      typesms: 1,
      leads_sms_o: [],
      name_leads_arr: [],

      // Modals
      showModalSendSms: false,
      dataAlreadyLoaded: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    modul() {
      return this.$route.meta.module;
    },
  },
  methods: {
    openModalSendSms(item) {
      this.rowData = item;
      this.leads_sms = [];
      this.typesms = 1;
      this.leads_sms_o = [];
      this.leads_sms_o.push(item.id);
      this.name_leads_arr = [{ name: item.lead_name, id: item.id }];
      this.showModalSendSms = true;
    },
    cancelEditAddress(originalAddress) {
      this.personalAddress = originalAddress;
    },
    closeModalSendSms() {
      this.showModalSendSms = false;
    },
    openModalHistorySms() {
      this.historySms.id = this.lead.id;
      this.historySms.leadName = this.lead.lead_name;
      this.$bvModal.show("modal-history-sms");
    },
    closeModalHistorySms() {},
    async getLead() {
      try {
        this.addPreloader();
        let idParam = this.$route.params.id;

        const response = await SNLeadsService.getLead(idParam);

        if (response.status == 200) {
          this.lead = response.data[0];
        }

        this.removePreloader();
      } catch (error) {
        this.removePreloader();
        throw error;
      }
    },
    async getPersonalInformation() {
      this.user = this.currentUser;

      let document = this.lead.type_document_sn
        ? this.lead.type_document_sn
        : this.lead.ssn
        ? 1
        : this.lead.itin
        ? 2
        : this.lead.other
        ? 3
        : null;

      let numberDocument =
        document == 1
          ? this.lead.ssn
          : document == 2
          ? this.lead.itin
          : document == 3
          ? this.lead.other
          : null;

      let numberDocumentEnc =
        document == 1
          ? this.lead.ssn_enc
          : document == 2
          ? this.lead.itin_enc
          : document == 3
          ? this.lead.other_enc
          : null;

      // Personal information
      this.personalInfo = {
        id_lead: this.lead.id,
        valueStatus: this.lead.valuestatuslead,
        nickname: this.lead.nickname,
        name: this.lead.lfirst_name,
        status: this.lead.status_l,
        last_name: this.lead.last_name,
        stateAd: this.lead.state,
        document: document,
        numberDocument: numberDocument,
        numberDocumentEnc: numberDocumentEnc,
        ssn: this.lead.ssn,
        itin: this.lead.itin,
        other: this.lead.other,
        dob: this.lead.dob,
        origin_country: this.lead.origin_country,
        email: this.lead.email,
        language: this.lead.language ? this.lead.language.toUpperCase() : null,
        id_user: this.user.user_id,
      };

      // Personal mobile
      this.personalMobile = {
        id_lead: this.lead.id,
        phonem: this.lead.mobile,
        id_user: this.user.user_id,
        typee: 3,
        module_id: this.currentUser.modul_id,
      };

      // Required field for create task in CRM
      this.requiredFieldsForCreateCrmTask.first_name = this.personalInfo.name;
      this.requiredFieldsForCreateCrmTask.last_name =
        this.personalInfo.last_name;
      this.requiredFieldsForCreateCrmTask.mobile = this.personalMobile.phonem;

      // Personal address
      this.personalAddress = {
        id_lead: this.lead.id,
        street: this.lead.street,
        city: this.lead.city,
        zipcode: this.lead.zipcode,
        state: this.lead.state_slug,
        country: this.lead.country ? this.lead.country : "United States",
        id_user: this.user.user_id,
        typee: 1,
      };
      this.dataAlreadyLoaded = true;
    },
    getCardsLead() {
      this.cardsLead = {
        lead_id: this.lead.id,
        user_id: this.user.user_id,
        rol: this.user.role_id,
      };
    },
  },
  async created() {
    await this.getLead();
    await this.getPersonalInformation();
    this.getCardsLead();
  },
};
</script>

<style lang="scss" scoped>
.card-group > div > .card > .card-header {
  border-bottom: none !important;
  margin-bottom: 0px !important;
}
</style>