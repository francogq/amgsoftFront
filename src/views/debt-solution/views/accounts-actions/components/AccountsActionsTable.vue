<template >
  <div>
    <b-card no-body class="mb-0 border-0 p-0">
      <filter-slot
        :filter="filter"
        :filter-principal="filterPrincipal"
        :total-rows="items.total"
        :paginate="paginate"
        :start-page="items.per_page"
        :to-page="items.to"
        @reload="myProvider"
        @onChangeCurrentPage="onChangeCurrentPage"
      >
        <b-table
          slot="table"
          ref="refUserListTable"
          class="position-relative font-small-3"
          primary-key="id"
          empty-text="No matching records found"
          select-mode="multi"
          responsive="sm"
          table-class="text-nowrap"
          sticky-header="68vh"
          small
          show-empty
          :fields="fields"
          :items="items.data"
          :busy.sync="isBusy"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>
          <!-- Column: CLIENTS Redirect Debt Solution Clients -->
          <template #cell(name_client)="data">
            <div class="text-left">
              <router-link
                :class="textLink"
                :to="`/${routeModule}/clients/${data.item.id}`"
                target="_blank"
              >
                {{ data.item.name_client }}
              </router-link>
              <p>{{ data.item.account_client }}</p>
            </div>
          </template>
          <!-- Column: Account -->
          <template #cell(name_bank)="data">
            <div class="text-left">
              <p class="mb-0">{{ data.item.name_bank }}</p>
              <p>#: {{ data.item.account_creditor }}</p>
            </div>
          </template>
          <!-- Column: Blance -->
          <template #cell(balance)="data">
            <div class="text-left">
              <p class="mb-0">$ {{ data.item.balance }}</p>
            </div>
          </template>
          <!-- Column: OFFER AMOUNT -->
          <template #cell(offer_amount)="data">
            <div>
              <p>$ {{ data.item.offer_amount }}</p>
            </div>
          </template>
          <!-- Column: Settlement Fee -->
          <template #cell(settlement_fee)="data">
            <div>
              <p>$ {{ data.item.settlement_fee }}</p>
            </div>
          </template>
          <!-- Column: Tracking -->
          <template #cell(tracking)="data">
            <div class="text-center">
              <b-button variant="outline" @click="openModalTracking(data.item)">
                <feather-icon
                  class="text-success"
                  v-b-tooltip.hover.right="'Tracking'"
                  icon="ListIcon"
                />
              </b-button>
            </div>
          </template>
          <!-- Column: STATUS -->
          <template #cell(status)="data">
            <div>
              <p v-if="data.item.status === 1" class=".text-warning">PENDING</p>
              <p v-if="data.item.status === 2" class="text-success">APPROVED</p>
              <p v-if="data.item.status === 3" class="text-danger">
                DISSAPROVED
              </p>
            </div>
          </template>
        </b-table>
      </filter-slot>
    </b-card>
    <modal-tracking
      v-if="modalTrackingState"
      :dataClient="dataClient"
      @hideModal="closeModalTrackings"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import DataFields from "./fields.data";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
import DataFilters from "./filters.data";
import AccountsActionsService from "../service/accountsactions.service";
import ModalTracking from "./ModalTracking.vue";
export default {
  components: {
    FilterSlot,
    ModalTracking,
  },
  data() {
    return {
      fields: DataFields.AccountsActionsFields,
      filter: DataFilters,
      isBusy: false,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Search...",
        model: null,
      },
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      items: [],
      modalTrackingState: false,
      dataClient: [],
      all: { id: 0, label: "All"},
      advisor: []
    };
  },
  computed: {
    ...mapState({
      usersServices: (state) => state["CrmGlobalStore"].S_OWNERS,
    }),
    routeModule() {
      return this.$route.meta.route;
    },
    moduleId() {
      return this.$route.meta.module;
    },
  },
  methods: {
    ...mapActions({
      A_GET_OWNERS: "CrmGlobalStore/A_GET_OWNERS",
    }),
    async getAdvisor() {
      let A_GET_ADVISOR = await this.A_GET_OWNERS({
        modul: this.moduleId,
        body: { roles: "[]", type: "0" },
      });
      
      A_GET_ADVISOR.data.forEach((item) => {
        this.advisor.push({
          id: item.id,
          label: item.user_name,
        });
      })
        this.filter[0].options = this.advisor
    },
    openModalTracking(data) {
      this.dataClient = data;
      this.modalTrackingState = true;
    },
    closeModalTrackings(data) {
      this.modalTrackingState = data;
    },
    async myProvider() {
      try {
        this.isBusy = true;
        this.items = await AccountsActionsService.GET_ACCOUNTS_ACTIONS({
          name_text: this.filterPrincipal.model,
          id_advisor:
            this.filter[0].model !== null
              ? this.filter[0].model
              : (this.filter[0].model = 0), // Realizar ternario
          order: "desc",
          orderby: 3,
          rresult:
            this.filter[1].model !== null
              ? this.filter[1].model
              : (this.filter[1].model = 0),
          sstatus:
            this.filter[2].model !== null
              ? this.filter[2].model
              : (this.filter[2].model = 0),
          perPage: this.paginate.perPage,
          page: this.paginate.currentPage,
        });
        setTimeout(() => {
          this.isBusy = false;
        }, 500);
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
    onChangeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.myProvider();
    },
  },
  async created() {
    await this.getAdvisor();
  }
};
</script>
<style lang="">
</style>