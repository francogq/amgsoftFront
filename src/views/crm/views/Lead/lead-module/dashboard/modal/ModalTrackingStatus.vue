<template>
  <div>
    <b-form-group label="LEAD" label-cols-md="2">
      <b-form-input v-model="lead.lead_name" readonly />
    </b-form-group>
    <b-table
      show-empty
      sticky-header
      responsive
      :fields="[ { key: 'status' }, { key: 'plataform', label: 'provider' }, { key: 'created_by' }, { key: 'note' } ]"
      :items="S_TRAKING_STATUS_LEADS"
      :busy="isBusy"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>

      <template #cell(plataform)="data">
        <img :src="data.item.plataform_ico" :title="data.item.plataform_name" />
      </template>

      <template #cell(created_by)="data">
        {{ data.item.created_name }}
        <div v-if="data.item.created_at != null">{{ data.item.created_at | myGlobalWithHour }}</div>
      </template>
    </b-table>
    <paginate-table
      :currentPage="paginate.currentPage"
      :total-rows="paginate.totalRows"
      :per-page="paginate.perPage"
      :from-page="paginate.fromPage"
      :to-page="paginate.toPage"
      @onChangeCurrentPage="onChangeCurrentPage"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";

import PaginateTable from "@/views/crm/views/Lead/lead-table/PaginateTable.vue";

export default {
  components: {
    PaginateTable
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token"
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
    ...mapState({
      S_TRAKING_STATUS_LEADS: event => event.CrmLeadStore.S_TRAKING_STATUS_LEADS
    })
  },
  created() {
    this.getTrackingStatus();
  },
  data() {
    return {
      historyTasks: [],
      isBusy: false,
      paginate: {
        currentPage: 1,
        fromPage: 0,
        perPage: 10,
        toPage: 0,
        totalRows: 0
      }
    };
  },
  directives: { Ripple },
  methods: {
    ...mapActions({
      A_GET_TRAKING_STATUS_LEADS: "CrmLeadStore/A_GET_TRAKING_STATUS_LEADS"
    }),
    async getTrackingStatus() {
      try {
        this.isBusy = true;
        const response = await this.A_GET_TRAKING_STATUS_LEADS({
          score_id: this.idScore
        });
        this.isBusy = false;
      } catch (error) {
        console.log("Something went wrong getHistoryTasks", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    onChangeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.getHistoryTasks();
    }
  },
  mounted() {},
  props: {
    modul: {
      type: Number,
      required: true
    },
    lead: {
      type: Object,
      required: true
    },
    idScore: {
      type: Number,
      required: true
    }
  },
  setup() {}
};
</script>
