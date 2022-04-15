<template>
  <b-row class="card-group">
    <lead-update
      v-if="Object.keys(S_LEAD_EDIT).length"
      :modul="modul"
      :lead="S_LEAD_EDIT"
      :is-add-new-user-sidebar-active.sync="isAddUpdateUserSidebarActive"
    />
    <b-col cols="12" lg="6">
      <card-lead-client
        v-if="Object.keys(S_LEAD).length"
        :key="S_KEY_UPDATE_DETAILS_LEAD"
        :modul="modul"
        :only-read="onlyRead"
        :lead="S_LEAD"
        @onEditLead="openEditLead()"
        @reloadLead="getLead"
      />
    </b-col>
    <b-col cols="12" lg="6">
      <card-lead-credit-report
        v-if="Object.keys(S_LEAD).length"
        :modul="modul"
        :only-read="onlyRead"
        :lead="S_LEAD"
        :is-busy-credit-report-obtained="isBusyCreditReportObtained"
        :is-busy-credit-report-pending="isBusyCreditReportPending"
      />
    </b-col>
    <b-col cols="12" lg="6">
      <card-lead-appointment
        v-if="Object.keys(S_LEAD).length"
        :modul="modul"
        :only-read="onlyRead"
        :is-busy="isBusyAppointment"
        :lead="S_LEAD"
      />
    </b-col>
    <b-col cols="12" lg="6">
      <card-lead-task
        v-if="Object.keys(S_LEAD).length"
        :modul="modul"
        :only-read="onlyRead"
        :lead="S_LEAD"
      />
    </b-col>
    <b-col v-if="modul !== 15" cols="12" lg="6">
      <card-lead-credit-card
        v-if="Object.keys(S_LEAD).length"
        :modul="modul"
        :only-read="onlyRead"
        :lead="S_LEAD"
        @reloadLead="getLead"
      />
    </b-col>
    <b-col v-if="modul !== 15" cols="12" lg="6">
      <card-lead-call
        v-if="Object.keys(S_LEAD).length"
        :modul="modul"
        :only-read="onlyRead"
        :lead="S_LEAD"
        :is-busy="isBusyCall"
        @onReloadCall="getCalls"
      />
    </b-col>
    <b-col cols="12" lg="6">
      <card-lead-notes
        v-if="Object.keys(S_LEAD).length"
        :modul="modul"
        :only-read="onlyRead"
        :lead="S_LEAD"
      />
    </b-col>
    <b-col cols="12" lg="6">
      <card-lead-files
        v-if="Object.keys(S_LEAD).length"
        :modul="modul"
        :lead="S_LEAD"
      />
    </b-col>
    <b-col v-if="modul !== 15" cols="12">
      <card-lead-payment
        v-if="Object.keys(S_LEAD).length"
        :modul="modul"
        :only-read="onlyRead"
        :lead="S_LEAD"
      />
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import CardLeadAppointment from "./CardLeadAppointment.vue";
import CardLeadCall from "./CardLeadCall.vue";
import CardLeadClient from "./CardLeadClient.vue";
import CardLeadCreditCard from "./CardLeadCreditCard.vue";
import CardLeadCreditReport from "./CardLeadCreditReport.vue";
import CardLeadFiles from "./CardLeadFiles.vue";
import CardLeadNotes from "./CardLeadNotes.vue";
import CardLeadPayment from "./CardLeadPayment.vue";
import CardLeadTask from "./CardLeadTask.vue";
import LeadUpdate from "../save/LeadUpdate.vue";

export default {
  components: {
    CardLeadAppointment,
    CardLeadCall,
    CardLeadClient,
    CardLeadCreditCard,
    CardLeadCreditReport,
    CardLeadFiles,
    CardLeadNotes,
    CardLeadPayment,
    CardLeadTask,
    LeadUpdate,
  },
  props: {},
  data() {
    return {
      isAddUpdateUserSidebarActive: false,
      isBusyAppointment: false,
      isBusyCall: false,
      isBusyCreditReportObtained: false,
      isBusyCreditReportPending: false,
      editSidebar: "first",
    };
  },
  created() {
    this.getSellers();
    this.getLead();
    this.getCreditReports();
    this.getCreditReportPendings();
    this.getEvents();
    this.getCalls(10);
    this.getPrograms();
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
    }),
    ...mapState({
      S_LEAD: (state) => state.CrmLeadStore.S_LEAD,
      S_LEAD_EDIT: (state) => state.CrmLeadStore.S_LEAD_EDIT,
      S_KEY_UPDATE_DETAILS_LEAD: (state) =>
        state.CrmLeadStore.S_KEY_UPDATE_DETAILS_LEAD,
    }),
    onlyRead() {
      return this.modul === 18;
    },
    modul() {
      return this.$route.meta.module;
    },
  },
  watch: {},
  methods: {
    ...mapActions({
      A_GET_LEAD: "CrmLeadStore/A_GET_LEAD",
      A_GET_LEAD_EDIT: "CrmLeadStore/A_GET_LEAD_EDIT",
      A_GET_OWNERS: "CrmGlobalStore/A_GET_OWNERS",
      A_GET_EVENTS: "CrmEventStore/A_GET_EVENTS",
      A_GET_PROGRAMS: "CrmGlobalStore/A_GET_PROGRAMS",
      A_GET_CREDIT_REPORTS: "CrmCreditReportStore/A_GET_CREDIT_REPORTS",
      A_GET_CREDIT_REPORT_PENDINGS:
        "CrmCreditReportStore/A_GET_CREDIT_REPORT_PENDINGS",
      A_GET_CALLS: "CrmCallStore/A_GET_CALLS",
      A_GET_STATE_LEADS: "CrmLeadStore/A_GET_STATE_LEADS",
      A_GET_STATUS_LEADS: "CrmLeadStore/A_GET_STATUS_LEADS",
      A_GET_SOURCE_LEADS: "CrmLeadStore/A_GET_SOURCE_LEADS",
      A_GET_SOURCE_NAMES: "CrmGlobalStore/A_GET_SOURCE_NAMES",
      A_GET_STATES: "CrmGlobalStore/A_GET_STATES",
      A_GET_EEUU_STATES: "CrmGlobalStore/A_GET_EEUU_STATES",
      A_GET_COUNTRIES: "CrmGlobalStore/A_GET_COUNTRIES",
      A_GET_SELLERS: "CrmGlobalStore/A_GET_SELLERS",
    }),
    async openEditLead() {
      // await all promises
      if (this.editSidebar === "first") {
        this.addPreloader();
        await Promise.all([
          this.getLeadEdit(),
          this.getPrograms(),
          this.getStateLeads(),
          this.getStatusLeads(),
          this.getSourceLeads(),
          this.getSourceNames(),
          this.getStates(),
          this.getEeuuStates(),
          this.getCountries(),
          this.getOwners(),
        ]);
        this.removePreloader();
        this.editSidebar = "second";
      }

      this.isAddUpdateUserSidebarActive = true;
    },
    async getLead() {
      try {
        this.isPreloading(true);
        await this.A_GET_LEAD({ id: this.$route.params.id });
        this.isPreloading(false);
      } catch (error) {
        console.log("Something went wrong getLead", error);
        this.showErrorSwal();
        this.isPreloading(false);
      }
    },
    async getLeadEdit() {
      try {
        await this.A_GET_LEAD_EDIT({ id: this.$route.params.id });
      } catch (error) {
        console.log("Something went wrong getLeadEdit", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getCreditReports() {
      try {
        this.isBusyCreditReportObtained = true;
        await this.A_GET_CREDIT_REPORTS({ id: this.$route.params.id });
        this.isBusyCreditReportObtained = false;
      } catch (error) {
        console.log("Something went wrong getCreditReports", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isBusyCreditReportObtained = false;
      }
    },
    async getCreditReportPendings() {
      try {
        this.isBusyCreditReportPending = true;
        await this.A_GET_CREDIT_REPORT_PENDINGS({
          id: this.$route.params.id,
          modul: this.modul,
        });
        this.isBusyCreditReportPending = false;
      } catch (error) {
        console.log("Something went wrong getCreditReportPendings", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isBusyCreditReportPending = false;
      }
    },
    async getEvents() {
      try {
        this.isBusyAppointment = true;
        await this.A_GET_EVENTS({ idLead: this.$route.params.id });
        this.isBusyAppointment = false;
      } catch (error) {
        console.log("Something went wrong getEvents", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isBusyAppointment = false;
      }
    },
    async getOwners() {
      try {
        const roles = [2, 4].includes(this.modul) ? "[1,2,5]" : "[1,2,3,5]";
        await this.A_GET_OWNERS({
          modul: this.modul,
          body: { roles, type: "1" },
        });
      } catch (error) {
        console.log("Something went wrong getOwners:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getPrograms() {
      try {
        await this.A_GET_PROGRAMS();
      } catch (error) {
        console.log("Something went wrong getPrograms", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getCalls(limit) {
      try {
        this.isBusyCall = true;
        await this.A_GET_CALLS({
          lead_id: this.$route.params.id,
          limit,
        });
        this.isBusyCall = false;
      } catch (error) {
        console.log("Something went wrong getCalls", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isBusyCall = false;
      }
    },

    async getStateLeads() {
      try {
        await this.A_GET_STATE_LEADS();
      } catch (error) {
        console.log("Something went wrong getStateLeads:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getStatusLeads() {
      try {
        await this.A_GET_STATUS_LEADS();
      } catch (error) {
        console.log("Something went wrong getStatusLeads:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getSourceLeads() {
      try {
        await this.A_GET_SOURCE_LEADS();
      } catch (error) {
        console.log("Something went wrong getSourceLeads:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getSourceNames() {
      try {
        await this.A_GET_SOURCE_NAMES();
      } catch (error) {
        console.log("Something went wrong getSourceNames:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getStates() {
      try {
        await this.A_GET_STATES({ type: 1 });
      } catch (error) {
        console.log("Something went wrong getStates:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getEeuuStates() {
      try {
        await this.A_GET_EEUU_STATES();
      } catch (error) {
        console.log("Something went wrong getEeuuStates:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getCountries() {
      try {
        await this.A_GET_COUNTRIES();
      } catch (error) {
        console.log("Something went wrong getCountries:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getSellers() {
      try {
        await this.A_GET_SELLERS({
          modul: this.currentUser.modul_id,
          body: { roles: "[]", type: "1" },
        });
      } catch (error) {
        console.log("Something went wrong getSellers:", error);
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
.card-group > div > .card {
  height: calc(100% - 2rem);
  min-height: 350px;
  > .card-header {
    border-bottom: 1px solid rgb(80 85 99 / 50%);
    margin-bottom: 1.5rem;
    .card-title {
      font-weight: bold;
    }
  }
}
</style>
