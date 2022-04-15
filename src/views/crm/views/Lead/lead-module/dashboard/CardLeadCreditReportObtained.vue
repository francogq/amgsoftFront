<template>
  <div>
    <b-card-body class="px-0">
      <b-table
        show-empty
        sticky-header="17vh"
        striped
        responsive="sm"
        :fields="fieldsEvent"
        :items="S_CREDIT_REPORTS"
        :busy="busy"
        class="mb-0"
        small
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1" />
            <strong>Loading ...</strong>
          </div>
        </template>

        <template #cell(provider)="data">
          <div
            v-b-tooltip.hover.top="data.item.plataform_name"
            style="width: 20px;height: 20px;background-position: center;background-repeat: no-repeat;background-size: contain;"
            :style="{ backgroundImage: `url(${ baseUrl + data.item.plataform_icon })` }"
          />
        </template>

        <template #cell(date)="data">{{ data.item.date | myGlobal }}</template>

        <template #cell(cr)="data">
          <span
            v-if="currentUser.modul_id === 4 && data.item.state == 0 && data.item.plataform_type == 'Source'"
            class="text-danger"
            @click="/* *INTEGRATE* resources\js\components\lead\showlead\ContentCreditReport.vue - on: processhtml(data.item.id) */"
          >Process</span>
          <!-- <router-link
            v-if="data.item.state == 1"
            :to="{ name: 'report-lead', params: { modul: currentUser.modul_id, global: { idfile: data.item.id, idlead: data.item.lead_id } } }"
            variant="flat-success"
            class="button-little-size rounded-circle"
            target="_blanck"
          >
            <amg-icon
              icon="FileChartIcon"
              size="18"
            />
            
          </router-link>-->
          <router-link
            v-if="data.item.state == 1"
            :to="{ 
                name: 'report-lead',
                params: {idfile:data.item.id,idlead:data.item.lead_id,
                  modul: 2,
                  global: {
                    idfile: data.item.score_id,
                    idlead: data.item.lead_id,
                  },
                },
              }"
            target="_blank"
          >
            <amg-icon icon="FileChartIcon" size="18" />
          </router-link>
        </template>
        <template #cell(pdf)="data">
          <a
            v-if="data.item.route_pdf"
            :href="data.item.route_pdf"
            class="button-little-size rounded-circle text-important"
            target="_blanck"
          >
            <amg-icon icon="FilePdfIcon" size="18" />
          </a>
        </template>
        <template #cell(ad)="data">
          <b-button
            variant="flat-info"
            class="button-little-size rounded-circle"
            @click="data.item.nlr/* *INTEGRATE* resources\js\components\lead\showlead\ContentCreditReport.vue - on: openModalAD(data.item.nlr, data.item.lead_name) */"
          >
            <feather-icon icon="EyeIcon" size="18" />
          </b-button>
        </template>
        <template #cell(marked)="data">
          <a
            v-if="data.item.marked_pdf"
            :href="data.item.marked_pdf"
            class="button-little-size rounded-circle text-important"
            target="_blanck"
          >
            <amg-icon icon="FilePdfIcon" size="18" />
          </a>
        </template>
      </b-table>
    </b-card-body>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {},
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token"
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
    ...mapState({
      S_CREDIT_REPORTS: event => event.CrmCreditReportStore.S_CREDIT_REPORTS
    })
  },
  async created() {
    this.busy = true;
    await this.A_GET_CREDIT_REPORTS({
      id: this.lead.id
    });
    this.busy = false;
  },
  directives: {},
  data() {
    return {
      fieldsEvent: new Array(),
      moduleName: "",
      busy: false
    };
  },
  methods: {
    ...mapActions({
      /* A_GET_TEMPLATES: 'CrmTemplateStore/A_GET_TEMPLATES' */
    }),

    ...mapActions({
      /* A_GET_TEMPLATES: 'CrmTemplateStore/A_GET_TEMPLATES' */
      A_GET_CREDIT_REPORTS: "CrmCreditReportStore/A_GET_CREDIT_REPORTS",
      A_COUNT_CREDIT_REPORT_PENDINGS:
        "CrmCreditReportStore/A_COUNT_CREDIT_REPORT_PENDINGS"
    })
  },
  mounted() {
    this.moduleName = this.getModuleName(this.currentUser.modul_id);
    this.fieldsEvent = [
      { key: "provider" },
      { key: "date" },
      { key: "transunion", label: "TU" },
      { key: "experian", label: "EX" },
      { key: "equifax", label: "EQ" },
      { key: "cr" },
      { key: "pdf" },
      this.currentUser.modul_id === 4 ? { key: "ad" } : null,
      { key: "marked" }
    ];
  },
  props: {
    lead: {
      type: Object,
      required: true
    },
    isBusy: {
      type: Boolean,
      required: true
    }
  },
  setup() {}
};
</script>
