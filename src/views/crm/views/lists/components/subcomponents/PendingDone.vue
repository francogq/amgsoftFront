<template>
  <div class="border-top-info border-3 box-shadow-3 rounded-bottom">
    <filter-slot
      :filter="filter"
      :filter-principal="filterPrincipal"
      :total-rows="totalRows"
      :paginate="paginate"
      :start-page="startPage"
      :to-page="toPage"
      :send-multiple-sms="false"
      @reload="$refs['refClientsList'].refresh()"
    >
    <!-- Table -->
      <b-table
        slot="table"
        no-provider-filtering
        :api-url="clientRoute"
        ref="refClientsList"
        :items="myProvider"
        :fields="visibleFields"
        primary-key="id"
        table-class="text-nowrap"
        responsive="sm"
        show-empty
        sticky-header="70vh"
        :busy="isBusy"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :current-page="paginate.currentPage"
        :per-page="paginate.perPage"
        :filter="searchInput"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1"></b-spinner>
            <strong>Loading ...</strong>
          </div>
        </template>
        <!-- Column CR -->
        <template #cell(credit_report)="data">
          <div class="d-flex flex-column justify-content-start align-items-start">
            <span v-if="data.item.credit_report =='1'" class="text-danger">NO</span>
            <span v-else class="text-blue">YES</span>
          </div>
        </template>
        <!-- Column CREATED -->
        <template #cell(created_at)="data">
          <div class="d-flex flex-column justify-content-start align-items-start">
            <span>{{data.item.created_at | myGlobalDay}}</span>
          </div>
        </template>
        <!-- Column ACTIONS -->
        <template #cell(action)="data">
          <!-- Button Modal Done -->
          <div
            class="d-flex flex-column justify-content-start align-items-start"
            v-if="changeStatus"
          >
            <b-button
              v-if="data.item.status == 'pending'"
              variant="success"
              class="mr-1 reset-radius btn-sm"
              @click="modalChange(data.item)"
            >
              DONE
              <feather-icon icon="FileIcon"></feather-icon>
            </b-button>
          </div>
          <!-- Button Modal Comment -->
          <div class="d-flex flex-column justify-content-start align-items-start" v-else>
            <b-button
              v-if="data.item.status == 'done'"
              variant="success"
              class="mr-1 reset-radius btn-sm"
              @click="modalChange(data.item)"
            >
              COMMENT
              <feather-icon icon="FileIcon"></feather-icon>
            </b-button>
          </div>
        </template>
      </b-table>
    </filter-slot>
    <!-- Modal General Pending Or Done -->
    <modal-general
      v-if="modalChanging"
      :ifModalCard="modalChanging"
      :objectLead="objectLead"
      @close="closeModalCreateCard"
      @update="update"
    ></modal-general>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { mapGetters } from "vuex";
// Import Modal
import ModalGeneral from "./ModalGeneral.vue";
// Import Filter
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
// Import Data
import ColumnFields from '../../data/fields.pendingdone.data'
import filters from '../../data/filter.pendingdone.data'
export default {
  components: {
    vSelect,
    ModalGeneral,
    FilterSlot
  },
  props: {
    status: {
      type: [Number, String]
    }
  },
  data:function() {
    return {
      totalRows: 0,
      paginate: {
        currentPage: 1,
        perPage: 10
      },
      objectLead: null,
      sortBy: "created_at",
      sortDesc: true,
      searchInput: "",
      startPage: null,
      endPage: "",
      nextPage: "",
      toPage: null,
      isBusy: false,
      //data fields
      arrayColumns: ColumnFields,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: ""
      },
      //data filter
      filter: filters,
      modalChanging: false
    };
  },
  computed: {
    // IF It's at Pending or Done Tab
    changeStatus:function() {
      return this.status == "1" ? true : false;
    },
    clientRoute:function() {
      return "/commons/list-users/get-list-of-user";
    },
    visibleFields:function() {
      return this.arrayColumns.filter(column => column.visible);
    },
    ...mapGetters({
      currentUser: "auth/currentUser"
    })
  },
  methods: {
    update:function() {
      this.modalChanging = false;
      this.resetSearch();
    },
    closeModalCreateCard:function() {
      this.modalChanging = false;
    },
    modalChange:function(Lead) {
      this.objectLead = Lead;
      if (this.modalChanging == false) {
        this.modalChanging = true;
      } else {
        this.modalChanging = false;
      }
    },
    resetSearch:function() {
      this.searchInput = "";
      this.$refs.refClientsList.refresh();
    },
    myProvider: async function(ctx) {
      try{
        const data = await amgApi.post(`${ctx.apiUrl}?page=${ctx.currentPage}`, {
        perPage: ctx.perPage,
        page: ctx.currentPage,
        leadname: this.filterPrincipal.model,
        startdate: this.filter[0].model,
        enddate: this.filter[1].model,
        status: this.status == 1 ? 1 : 2,
        user_id: this.currentUser.user_id
      });
        const items = data.data.data;
        this.startPage = data.data.from;
        this.currentPage = data.data.current_page;
        this.perPage = data.data.per_page;
        this.nextPage = this.startPage + 1;
        this.endPage = data.data.last_page;
        this.totalRows = data.data.total;
        this.toPage = data.data.to;
        return items || [];

      }catch(error){
        console.error(error)
        return []

      }
      
    }
  }
};
</script>



<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
td.div {
  width: 100% !important;
}
@media (max-width: 960px) {
  .column-table {
    display: flex;
    flex-direction: column;
  }
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-sweetalert.scss";
</style>
