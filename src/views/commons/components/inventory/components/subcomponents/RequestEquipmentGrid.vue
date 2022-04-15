<template>
  <div>
    <filter-slot
      :filter="filter"
      :filter-principal="filterPrincipal"
      :no-visible-principal-filter="true"
      :total-rows="totalRows"
      :paginate="paginate"
      :start-page="startPage"
      :to-page="toPage"
      :send-multiple-sms="false"
      @reload="$refs['refClientsList'].refresh()"
    >
      <!-- Table -->
      <b-table
        small
        slot="table"
        no-provider-filtering
        :api-url="'/logistics/inventory/search-request-equipment'"
        ref="refClientsList"
        :items="myProvider"
        :fields="arrayColumns"
        primary-key="id"
        table-class="text-nowrap"
        responsive="sm"
        show-empty
        sticky-header="70vh"
        :sort-desc.sync="sortDesc"
        :current-page="paginate.currentPage"
        :per-page="paginate.perPage"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1"></b-spinner>
            <strong>Loading ...</strong>
          </div>
        </template>
        <!-- Column PROGRAMS TO INSTALL -->
        <template #cell(programs_to_install)="data">
          <div>
            <ul id="v-for-object" class="demo">
              <li v-for="value in data.item.programs_to_install" :key="value">{{ value }}</li>
            </ul>
          </div>
        </template>
        <!-- Column COMMENT -->
        <template #cell(commentary)="data">
          <div
            class="tdbreak"
            style="width:100px; overflow:hidden;text-overflow:ellipsis"
          >{{ data.item.commentary }}</div>
        </template>
        <!-- Column STATUS -->
        <template #cell(status)="data">
          <p
            :style="
              data.item.status == 'DELIVERED'
                ? 'color:#00CC00'
                : data.item.status == 'DISAPPROVED'
                ? 'color: #FF0000'
                : 'color: rgb(255 177 0)'
            "
          >{{ data.item.status }}</p>
        </template>
        <!-- Column CREATED BY -->
        <template #cell(created_at)="data">
          {{ data.item.created_by }}
          <br />
          {{ data.item.created_at | myGlobalDay }}
        </template>
        <!-- Column Button Tracking -->
        <template #cell(tracking)="data">
          <div>
            <b-button
              class="btn-sm"
              variant="light"
              @click="openModalTrackingRequest(data.item.id)"
            >
              <span>TRACKING</span>
            </b-button>
          </div>
        </template>
      </b-table>
    </filter-slot>
    <!-- Modal View Tracking Request -->
    <modal-view-tracking-request
      v-if="modalTrackingRequest"
      :modalTrackingRequest="modalTrackingRequest"
      :requestId="requestId"
      :global="global"
      @closeTrackingRequest="closeModalTrackingRequest"
    ></modal-view-tracking-request>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
import vSelect from "vue-select";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
// Import Modal
import ModalViewTrackingRequest from "../../modal/ModalViewTrackingRequest.vue";
// Import Data
import fields from '../../data/fields.requestequipment.data'
import filters from '../../data/filter.requestequipment.data'
export default {
  props: {
    global: {
      type: Object
    },
    module: {
      type: [Number, String]
    },
    statusEquipment: {
      type: [Number, String]
    }
  },
  components: {
    vSelect,
    ModalViewTrackingRequest,
    FilterSlot
  },
  data:function() {
    return {
      totalRows: 0,
      paginate: {
        currentPage: 1,
        perPage: 10
      },
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: ""
      },
      startPage: null,
      toPage: null,
      modalTrackingRequest: false,
      requestId: "",
      sortDesc: true,
      arrayColumns: fields,
      filter: filters,
    };
  },
  computed: {
    ...mapGetters("inventory-store", ["updateRequestEquip"]),
  },
  watch:{
    updateRequestEquip(newVal){
      if (newVal) {
        if(this.$refs.refClientsList === undefined){
          this.UpdateRequEquip();
        }else{
          this.$refs.refClientsList.refresh();
          this.UpdateRequEquip();
        }
        
      }
    }
  },
  methods: {
    ...mapActions("inventory-store", ["UPDATE_REQUEST_EQUIPMENT"]),
    UpdateRequEquip:function() {
      if (this.updateRequestEquip) {
        this.UPDATE_REQUEST_EQUIPMENT(false);
      }
    },
    myProvider:async function(ctx) {
      try{
        const data = await amgApi.post(`${ctx.apiUrl}?page=${ctx.currentPage}`, {
        from: this.filter[0].model == "" ? null : this.filter[0].model,
        to: this.filter[1].model == "" ? null : this.filter[1].model,
        perpage: ctx.perPage,
        order: ctx.sortBy == "" ? "created_at" : ctx.sortBy,
        orderby: ctx.sortDesc == 1 ? "desc" : "asc",
        module_id: this.module,
        statusRequest: null
        // statusRequest: this.filters[0].model,
      });

      const items = data.data.data;
        this.startPage = data.data.from;
        this.current_page = data.data.current_page;
        this.perpage = data.data.per_page;
        this.next_page = this.startPage + 1;
        this.end_page = data.data.last_page;
        this.totalRows = data.data.total;
        this.toPage = data.data.to;
        return items || [];

      }catch(error){
        console.log(error)
        this.showToast(
            "danger",
            "top-right",
            "Error",
            "XIcon",
            "Something went wrong!"
        );
        return [];
      }
    },
    openModalTrackingRequest:function(requestId) {
      this.requestId = requestId;
      this.modalTrackingRequest = true;
    },
    closeModalTrackingRequest:function() {
      this.modalTrackingRequest = false;
    }
  }
};
</script>


<style lang="scss" scoped>
.tdbreak {
  word-break: break-all;
  // width: 10em;
}
.per-page-selector {
  width: 90px;
}
.per-page-datepicker {
  width: 180px;
}
td.div {
  width: 100% !important;
}
@media (max-width: 1024) {
  .column-table {
    display: flex;
    flex-direction: column;
  }
  .button-top {
    margin-bottom: 22px;
  }
}

@media (max-width: 740px) {
  .per-page-datepicker {
    width: 110px;
  }
  .button-top {
    margin-bottom: 22px;
  }
}
.b-calendar-grid-caption {
  background: transparent !important;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-sweetalert.scss";
</style>

