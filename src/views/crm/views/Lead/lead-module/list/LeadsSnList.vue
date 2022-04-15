<template>
  <div>
    <!-- Table Container Card -->
    <b-card no-body class="mb-0">
      <filter-slot
        :filter="filter"
        :filter-principal="filterPrincipal"
        :total-rows="totalLeads"
        :paginate="paginate"
        :start-page="fromPage"
        :to-page="toPage"
        :send-multiple-sms="false"
        @reload="myProvider"
        @onChangeCurrentPage="onChangeCurrentPage"
      >
        <b-table
          slot="table"
          ref="refUserListTable"
          class="position-relative font-small-3"
          empty-text="No matching records found"
          primary-key="id"
          responsive="sm"
          table-class="text-nowrap"
          sticky-header="73vh"
          show-empty
          :fields="fields"
          :items="items"
          :sort-by.sync="sortBy"
          :sort-desc.sync="isSortDirDesc"
          :busy.sync="isBusy"
          small
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>

          <!-- Column: Nickname -->
          <template #cell(nickname)="data">
            <router-link
              :class="textLink"
              :to="`/${routeModule}/leads/${data.item.id}`"
              target="_blank"
            >{{ data.item.nickname }}</router-link>
            <br />
            <span>{{ data.item.lead_name }}</span>
          </template>

          <!-- Column: Status -->
          <template #cell(status)="data">
            <b-badge
              pill
              :variant="`light-${resolveLeadSnStatusVariant(data.item.status_sn_id)}`"
              class="text-capitalize"
            >{{ data.item.status }}</b-badge>
          </template>

          <!-- Column: Fanpage -->
          <template #cell(fanpage)="data">
            <b-img thumbnail fluid :src="baseUrl + data.item.logo" style="width: 50px" />
          </template>

          <!-- Column: Recomendations -->
          <template #cell(programs)="data">
            <template v-for="(program, key) in JSON.parse(data.item.programs)">
              <span :key="key">{{ program }}</span>
              <br :key="JSON.parse(data.item.programs).length + key" />
            </template>
          </template>

          <!-- Column: Appointment -->
          <template #cell(appointment)="data">
            <strong v-if="data.item.attend == 2" class="text-success">
              <feather-icon icon="CheckCircleIcon" size="18" class="mr-50 text-danger" />YES
            </strong>
            <strong v-else-if="data.item.attend == 1" class="text-success">YES</strong>
            <strong v-else class="text-danger">NO</strong>
            <br />
            <span v-if="data.item.seller_name != null">{{ data.item.seller_name }}</span>
            <br />
            <span v-if="data.item.attend_date != null">{{ data.item.attend_date }}</span>
          </template>

          <!-- Column: Created Date -->
          <template #cell(created_date)="data">
            <small>{{ data.item.created_at | myDateGlobalWithHour }}</small>
          </template>
        </b-table>
      </filter-slot>
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { BTable, BPagination } from "bootstrap-vue";

import vSelect from "vue-select";

import dataFields from "@/views/crm/views/Lead/lead-table/fields.data";
import dataFilters from "@/views/crm/views/Lead/lead-table/filtersLeadSn.data";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
import FiltersTable from "../../lead-table/FiltersTable.vue";
import PaginateTable from "@/views/crm/views/Lead/lead-table/PaginateTable.vue";

export default {
  components: {
    BTable,
    BPagination,

    vSelect,
    FilterSlot,
    FiltersTable,
    PaginateTable
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_OWNERS: "CrmGlobalStore/G_OWNERS",
      G_STATES: "CrmGlobalStore/G_STATES"
    }),
    routeModule() {
      return this.$route.meta.route;
    }
  },
  data() {
    return {
      advanceSearch: false,
      baseUrl: process.env.VUE_APP_BASE_URL_ASSETS,

      isBusy: false,
      fields: dataFields.leadSnFields,
      filter: dataFilters,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Search...",
        model: ""
      },
      items: [],
      totalLeads: 0,
      fromPage: 0,
      toPage: 0,
      paginate: {
        currentPage: 1,
        perPage: 10
      },
      perPageOptions: [10, 25, 50, 100],
      sortBy: "id",
      isSortDirDesc: true
    };
  },
  created() {
    this.addPaddingTd();
    this.setOptionsOnFilters();
  },
  methods: {
    ...mapActions({
      A_GET_SN_LEADS: "CrmLeadStore/A_GET_SN_LEADS"
    }),
    resolveLeadSnStatusVariant(status) {
      if (status === 2) return "success";
      if ([3, 4].includes(status)) return "primary";
      if (status === 5) return "secondary";
      if (status === 6) return "warning";
      if (status === 7) return "danger";
      return "primary";
    },
    async myProvider() {
      try {
        this.isBusy = true;
        const response = await this.A_GET_SN_LEADS({
          cr: null,
          date_from: this.filter[0].model,
          date_to: this.filter[1].model,
          lead_status: null,
          name_text: this.filterPrincipal.model,
          order: "desc",
          orderby: 10,
          program: null,
          state_h: this.filter[3].model,
          type: 3,
          user_owner: this.filter[2].model,
          perpage: this.paginate.perPage,
          page: this.paginate.currentPage
        });
        this.totalLeads = response.total;
        this.fromPage = response.from;
        this.toPage = response.to;
        this.items = response.data;
        this.isBusy = false;
      } catch (error) {
        console.log("Somtehing went wrong myProvider", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    setOptionsOnFilters() {
      this.filter[2].options = this.G_OWNERS;
      this.filter[3].options = this.G_STATES;
    },
    onChangeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.myProvider();
    }
  }
};
</script>
