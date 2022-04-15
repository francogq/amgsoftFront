<template>
  <b-card body-class="px-0">
    <b-card-title
      v-if="
        score.equifax === '' && score.experian === '' && score.transunion === ''
      "
    >
      <h4 class="ml-1">This Lead do not have credit report</h4>
    </b-card-title>

    <template #header>
      <b-card-title>Credit Report</b-card-title>
    </template>
    <b-card-body
      v-if="
        score.equifax !== '' && score.experian !== '' && score.transunion !== ''
      "
    >
      <b-row class="justify-content-center">
        <b-col v-if="score.transunion !== ''" cols="4" class="text-center">
          <p style="color: #0aafdb">TransUnion</p>
          <span
            class="show-lead-score-cr"
            style="border: 2px solid #0aafdb"
            :style="`color: ${colorScoreTransunion(score.transunion)};`"
          >
            <!-- {{ score.transunion }} -->
            <!-- {{2}} -->
            {{ transunionCharAt == "N" ? "-" : score.transunion }}
          </span>
        </b-col>
        <b-col v-if="score.experian !== ''" cols="4" class="text-center">
          <p style="color: #0566b7">Experian</p>
          <span
            class="show-lead-score-cr"
            style="border: 2px solid #0566b7"
            :style="`color: ${colorScoreTransunion(score.experian)};`"
          >{{ experianCharAt == "N" ? "-" : score.experian }}</span>
        </b-col>
        <b-col v-if="score.equifax !== ''" cols="4" class="text-center">
          <p style="color: #f31414">EQUIFAX</p>
          <span
            class="show-lead-score-cr"
            style="border: 2px solid #f31414"
            :style="`color: ${colorScoreTransunion(score.equifax)};`"
          >{{ equifaxCharAt == "N" ? "-" : score.equifax }}</span>
        </b-col>
      </b-row>
    </b-card-body>
    <b-tabs
      pills
      lazy
      nav-class="mb-0 mt-2 ml-1"
      active-nav-item-class="bg-primary box-shadow-info"
    >
      <b-tab :active="!isTabPendingActive" :title-link-class="bgTabsNavs">
        <template #title>
          <span>Obtained</span>
        </template>

        <card-lead-credit-report-obtained :lead="lead" :is-busy="isBusyCreditReportObtained" />
      </b-tab>
      <b-tab :active="isTabPendingActive" :title-link-class="bgTabsNavs">
        <template #title>
          <span>Pending</span>
          <div class="ml-50 number-circle">
            <span>{{ countData }}</span>
          </div>
        </template>

        <card-lead-credit-report-pending
          :modul="modul"
          :lead="lead"
          :is-busy="isBusyCreditReportPending"
        />
      </b-tab>
    </b-tabs>

    <template #footer>
      <div class="text-right">
        <b-button
          v-if="modul === 4"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="primary"
          @click="
            /* *INTEGRATE* resources\js\components\lead\showlead\ContentCreditReport.vue - line: 241 */
          "
        >
          <span>Add</span>
        </b-button>
        <b-button
          v-if="modul === 2"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="primary"
          @click="openModalRequestCr()"
        >
          <span>Request CR</span>
        </b-button>
        <b-button
          v-if="lead.typecredits"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="primary"
          @click="
            /* *INTEGRATE* resources\js\components\lead\showlead\ContentCreditReport.vue - line: 254 */
          "
        >Old Credentials</b-button>
      </div>
    </template>

    <!-- modal REQUEST CR CREATE -->
    <b-modal
      v-model="isModalRequestCR"
      ok-only
      title-class="h2 text-white"
      modal-class="modal-primary"
      centered
      size="lg"
      hide-footer
      @hidden="resetModalRequestCR"
    >
      <template #modal-header="{ close }">
        <h5 class="modal-title h2 text-white">Request CR</h5>

        <button type="button" aria-label="Close" class="close" @click="close">×</button>
      </template>
      <modal-request-cr
        :modul="modul"
        :lead="lead"
        :item="requestCr"
        @onSubmit="(isTabPendingActive = true), (isModalRequestCR = false), (keyModalRequestCR = Math.random())"
      />
    </b-modal>
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";

import CardLeadCreditReportObtained from "./CardLeadCreditReportObtained.vue";
import CardLeadCreditReportPending from "./CardLeadCreditReportPending.vue";
import ModalRequestCr from "./modal/ModalRequestCr.vue";

export default {
  components: {
    CardLeadCreditReportObtained,
    CardLeadCreditReportPending,
    ModalRequestCr
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token"
    }),
    transunionCharAt() {
      return this.score.transunion?.charAt(0);
    },
    experianCharAt() {
      return this.score.experian?.charAt(0);
    },
    equifaxCharAt() {
      return this.score.equifax?.charAt(0);
    }
  },
  created() {
    this.countCreditReportPendings();
    this.lead.score = JSON.parse(this.lead.score);
    if (this.lead.score && this.lead.score.length) {
      this.score.equifax = this.lead.score[0].equifax;
      this.score.experian = this.lead.score[0].experian;
      this.score.transunion = this.lead.score[0].transunion;
    }
  },
  directives: { Ripple },
  props: {
    modul: {
      type: Number,
      required: true
    },
    onlyRead: {
      type: Boolean,
      required: true
    },
    lead: {
      type: Object,
      required: true
    },
    isBusyCreditReportObtained: {
      type: Boolean,
      required: true
    },
    isBusyCreditReportPending: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      countData: 0,
      keyModalRequestCR: 0,
      score: {
        equifax: "",
        experian: "",
        transunion: ""
      },
      isTabPendingActive: false,
      requestCr: {
        type_card: null,
        send_cr: null,
        documents: new Object(),
        document: ""
      },
      isModalRequestCR: false
    };
  },
  methods: {
    ...mapActions({
      A_COUNT_CREDIT_REPORT_PENDINGS:
        "CrmCreditReportStore/A_COUNT_CREDIT_REPORT_PENDINGS",
      A_GET_LEAD_DOCUMENT: "CrmLeadStore/A_GET_LEAD_DOCUMENT"
    }),
    resetModalRequestCR() {
      this.requestCr = {
        type_card: null,
        send_cr: null,
        documents: new Object(),
        document: ""
      };
    },
    setDataBlank(key) {
      this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`] = {
        ...this[key]
      };
    },
    resetData(key) {
      this[key] = {
        ...this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`]
      };
    },
    colorScoreTransunion(score) {
      if (score <= 659) return "#ff0707";
      if (score >= 660 && score <= 699) return "#ffc107";
      if (score >= 700 && score <= 759) return "#bfff00";
      if (score >= 760 && score <= 850) return "#0dff34";
      return "#000";
    },
    async countCreditReportPendings() {
      try {
        const response = await this.A_COUNT_CREDIT_REPORT_PENDINGS({
          id: this.$route.params.id,
          modul: this.modul
        });
        if (this.isResponseSuccess(response)) {
          this.countData =
            response.data[0].countPending > 99
              ? "+99"
              : response.data[0].countPending;
        }
      } catch (error) {
        console.log("Something went wrong countCreditReportPendings", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async openModalRequestCr() {
      this.addPreloader();
      await this.getDocumentLead();
      this.isModalRequestCR = true;
      this.removePreloader();
    },
    async getDocumentLead() {
      try {
        const response = await this.A_GET_LEAD_DOCUMENT({
          lead_id: this.lead.id
        });
        if (this.isResponseSuccess(response)) {
          const documents = response.data[0];
          // eslint-disable-next-line no-nested-ternary
          this.requestCr.document = documents?.ssn
            ? 1
            : documents?.itin
            ? 2
            : documents?.other
            ? 3
            : null;
          this.requestCr.documents = response.data[0];
          this.requestCr.dob = response.data[0].dob;
        }
      } catch (error) {
        console.log("Something went wrong getDocumentLead", error);
      }
    }
  },
  setup() {}
};
</script>

<style lang="scss" scoped>
.show-lead-score-cr {
  font-size: 25px;
  font-weight: bold;
  border-radius: 30px;
  padding: 13px 7px;
}
.number-circle {
  width: 1rem;
  height: 1rem;
  text-align: center;
  border: 0.5px solid #fff;
  border-radius: 50%;
}
.number-circle {
  border: 0.5px solid #ff9f43;
  font-size: 8pt;
}
</style>
