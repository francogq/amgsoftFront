<template>
  <b-card body-class="px-0" >
    <template #header>
      <b-card-title class="card-title-cr"> Credit Report </b-card-title>
    </template>
    <template #footer>
      <div class="text-right">
        <b-button
          variant="primary"
          class="float-right mt-2"
          @click="openModalRequestCreditReport"
        >
          <feather-icon icon="PlusIcon" class="mr-50"></feather-icon>
          REQUEST CR
        </b-button>
      </div>
    </template>
    <b-row class="mt-1 mb-3">
        <b-col v-if="scoreTransunion !== ''" cols="4" class="text-center">
          <p style="color: #0aafdb">TransUnion</p>
          <span
            class="show-lead-score-cr"
            style="border: 2px solid #0aafdb"
            :style="`color: ${colorScoreTransunion(scoreTransunion)};`"
          >
            {{ transunionCharAt == "N" ? "-" : scoreTransunion}}
          </span>
        </b-col>

        <b-col v-if="scoreExperian !== ''" cols="4" class="text-center">
          <p style="color: #0566b7">Experian</p>
          <span
            class="show-lead-score-cr"
            style="border: 2px solid #0566b7"
            :style="`color: ${colorScoreTransunion(scoreExperian)};`"
          >{{ experianCharAt == "N" ? "-" : scoreExperian }}</span>
        </b-col>

        <b-col v-if="scoreEquifax !== ''" cols="4" class="text-center">
          <p style="color: #f31414">EQUIFAX</p>
          <span
            class="show-lead-score-cr"
            style="border: 2px solid #f31414"
            :style="`color: ${colorScoreTransunion(scoreEquifax)};`"
          >{{ equifaxCharAt == "N" ? "-" : scoreEquifax }}</span>
        </b-col>
    </b-row>
    <b-row>
      <b-col sm="12" md="12" lg="12" xl="12">
        <b-tabs
          pills
          active-nav-item-class="bg-orange-tab"
          class="override-tab ml-2"
        >
          <b-tab
            :active="tab == 1"
            title-item-class="text-center w-auto"
            title-link-class="bg-default-tab"
            @click="(tab = 1), getReports()"
          >
            <template #title>Obtained</template>
          </b-tab>
          <b-tab
            :active="tab == 2"
            title-item-class="text-center w-auto"
            title-link-class="bg-default-tab"
            @click="(tab = 2), getReports()"
          >
            <template #title>
              Pending
              <b-badge variant="danger" pill v-if="countData != 0">
                {{ countData }}
              </b-badge>
            </template>
          </b-tab>
        </b-tabs>
      </b-col>
      <b-col sm="12" md="12" lg="12" xl="12">
        <b-table
          v-if="tab == 1"
          small
          :fields="tableObtained.fields"
          :items="reports"
          sticky-header="180px"
        >
          <template #cell(provider)="data">
            <div
              v-b-tooltip.hover.top="data.item.plataform_name"
              style="
                width: 20px;
                height: 20px;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
              "
              :style="{
                backgroundImage: `url(${baseUrl + data.item.plataform_icon})`,
              }"
            />
          </template>

          <template #cell(date)="data">
            <span v-if="data.item.date != null">
              {{ data.item.date | myGlobal }}
            </span>
          </template>

          <template #cell(cr)="data">
            <a
              v-if="data.item.state == 1"
              :href="
                '/socialnetwork/ncr/reportLead/' +
                data.item.lead_id +
                '/' +
                data.item.id
              "
              target="_blank"
              style="cursor: pointer"
            >
              <feather-icon icon="FileIcon"></feather-icon>
            </a>
          </template>
          <template #cell(pdf)="data">
            <a
              :href="data.item.route_pdf"
              v-if="data.item.route_pdf"
              target="_blank"
            >
              <img
                src="/assets/images/extensions/pdf.png"
                width="23px"
                alt=""
              />
            </a>
          </template>
        </b-table>

        <b-table
          v-if="tab == 2"
          small
          :fields="tablePending.fields"
          :items="pendings"
          sticky-header="180px"
        >
          <template #cell(request_by)="data">
            <div>{{ data.item.seller_name }}</div>
            <div>{{ data.item.date | myGlobalDay }}</div>
          </template>
          <template #cell(tracking)="data">
            <b-button
              variant="flat-primary"
              class="btn-icon"
              @click="
                openModalTrackingStatus(data.item.score_id, data.item.lead_name)
              "
            >
              <feather-icon icon="ListIcon"></feather-icon>
            </b-button>
          </template>

          <template #cell(action)="data">
            <span
              v-if="data.item.status_id == 3"
              @click="changeStatus(data.item.score_id, 4)"
              style="cursor: pointer"
            >
              Validate Information
              <span
                class="ml-1"
                v-if="data.item.status_id == 3 && data.item.attemps_count < 3"
                @click="changeStatus(data.item.score_id, 5)"
                style="cursor: pointer"
              >
                | Other Source (DI)
              </span>
              <span
                class="ml-1"
                v-if="data.item.status_id == 6"
                @click="changeStatus(data.item.score_id, 7)"
                style="cursor: pointer"
              >
                Information Was Correct
              </span>
              <span
                class="ml-1"
                v-if="data.item.status_id == 6 && data.item.attemps_count < 3"
                @click="changeStatus(data.item.score_id, 8)"
                style="cursor: pointer"
              >
                | Other Source (II)
              </span>
            </span>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <modal-request-credit-report
      v-if="showModalRequestCreditReport"
      :lead_id="lead.id"
      :modul="15"
      @onClose="closeModalRequestCreditReport"
    ></modal-request-credit-report>

    <modal-tracking-status
      v-if="showModalTrackingStatus"
      :score_id="score_id"
      :lead_name="lead_name"
      @onClose="closeModalTrackingStatus"
    ></modal-tracking-status>
  </b-card>
</template>

<script>
// Components
import ModalRequestCreditReport from "./ModalRequestCreditReport.vue";
import ModalTrackingStatus from "./ModalTrackingStatus.vue";

// Services
import SNLeadsService from "@/views/social-network/services/leads";

export default {
  props: {
    lead: {
      type: Object,
    },
  },
  components: {
    ModalRequestCreditReport,
    ModalTrackingStatus,
  },
  data() {
    return {
      tableObtained: {
        fields: [
          { key: "provider", label: "Provider" },
          { key: "date", label: "Date" },
          { key: "transunion", label: "TU" },
          { key: "experian", label: "EX" },
          { key: "equifax", label: "EQ" },
          { key: "cr", label: "CR" },
          { key: "pdf", label: "PDF" },
        ],
      },

      tablePending: {
        fields: [
          { key: "request_by", label: "Request By" },
          { key: "status", label: "Status" },
          { key: "tracking", label: "Tracking" },
          { key: "action", label: "Action" },
        ],
      },

      reports: [],
      pendings: [],
      countData: 0,
      tab: 1,
      modalTrackingStatus: false,
      lead_name: "",
      score_id: "",
      scoreEquifax: "...",
      scoreTransunion: "...",
      scoreExperian: "...",

      // Modals
      showModalRequestCreditReport: false,
      showModalTrackingStatus: false,
    };
  },
  computed: {
    modul() {
      return this.global.layout.modul_id;
    },
    isOverSize() {
      return (
        (this.tab == 1 && this.reports.length >= 2) ||
        (this.tab == 2 && this.pendings.length >= 2)
      );
    },
    leadIdParam() {
      return this.$route.params.id;
    },
    transunionCharAt() {
      return this.scoreTransunion?.charAt(0);
    },
    experianCharAt() {
      return this.scoreExperian?.charAt(0);
    },
    equifaxCharAt() {
      return this.scoreEquifax?.charAt(0);
    }
  },
  methods: {
    openModalRequestCreditReport() {
      this.showModalRequestCreditReport = true;
    },
    closeModalRequestCreditReport() {
      this.showModalRequestCreditReport = false;
      this.getReports();
    },
    openModalTrackingStatus(id, lead_name) {
      this.score_id = id;
      this.lead_name = lead_name;

      this.showModalTrackingStatus = true;
    },
    closeModalTrackingStatus() {
      this.showModalTrackingStatus = false;
    },
    async changeStatus(score_id, status_id) {
      const confirm = await this.showConfirmSwal();

      if (confirm.value) {
        const response = await SNLeadsService.changeCreditReportStatus({
          user_id: this.global.layout.id,
          score_id: score_id,
          status_id: status_id,
          text: result.value,
        });

        if (response.status == 200) {
          this.getReports();
          this.removePreloader();
          this.showToast();
        }
      }
    },
    async getReports() {
      try {
        if (this.tab == 1) {
          const response = await SNLeadsService.getCreditReports({
            id: this.leadIdParam,
          });

          if (response.status == 200) {
            this.reports = response.data;
            this.countPendingTab();
          }
        } else {
          const response = await SNLeadsService.getPendingCreditReport({
            id: this.leadIdParam,
            modul: 15,
          });

          if (response.status == 200) {
            this.pendings = response.data;

            this.pendings.map((item) => {
              item.attemps_count =
                item.attemps == null ? "" : JSON.parse(item.attemps).length;
            });
            this.countPendingTab();
          }
        }
      } catch (error) {
        throw error;
      }
    },
    async countPendingTab() {
      try {
        const response = await SNLeadsService.getCountPendingReports({
          id: this.leadIdParam,
          modul: 15,
        });

        if (response.status == 200) {
          this.countData =
            response.data[0].countPending > 99
              ? "+99"
              : response.data[0].countPending;
        }
      } catch (error) {
        throw error;
      }
    },
    async getScore() {
      try {
        const response = await SNLeadsService.getCreditReportScore({
          id: this.leadIdParam,
        });

        if (response.status == 200) {
          this.scoreEquifax = response.data.equifax;
          this.scoreTransunion = response.data.transunion;
          this.scoreExperian = response.data.experian;
        }
      } catch (error) {
        throw error;
      }
    },
    colorScoreTransunion(score) {
      if (score <= 659) return "#ff0707";
      if (score >= 660 && score <= 699) return "#ffc107";
      if (score >= 700 && score <= 759) return "#bfff00";
      if (score >= 760 && score <= 850) return "#0dff34";
      return "#000";
    },
  },
  async created() {
    await this.getScore();
    await this.getReports();
  },
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
  .card-title-cr {
    width: 100%;
    font-weight: 600 !important;
  }
</style>
