<template>
  <div>
    <filter-slot
      :filter="filterStatus"
      :filter-principal="filterPrincipal"
      :total-rows="totalRows"
      :paginate="paginate"
      :start-page="startPage"
      :to-page="toPage"
      :send-multiple-sms="false"
      @reload="$refs['refClientsList'].refresh()"
    >
      <b-table
        small
        slot="table"
        no-provider-filtering
        :api-url="clientRoute"
        ref="refClientsList"
        :items="myProvider"
        :fields="fields"
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
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1"></b-spinner>
            <strong>Loading ...</strong>
          </div>
        </template>
        <!-- Column NAME -->
        <template #cell(lead_name)="data">
          <div
            class="d-flex flex-column justify-content-start align-items-start"
          >
            <!-- Route To Lead Show -->
            <router-link
              :class="textLink"
              :to="{
                name: 'lead-show',
                params: { id: data.item.lead_id },
              }"
              target="_blank"
              >{{ data.item.lead_name }}</router-link
            >
          </div>
        </template>
        <!-- Column AMOUNT -->
        <template #cell(amount)="data">
          <div class="inline" style="position: relative">
            <span
              v-if="data.item.type_t != 39 && data.item.type_t != 40"
              class="mr-1"
              >$ {{ data.item.amount }}</span
            >
            <span
              v-if="data.item.type_t == 39 || data.item.type_t == 40"
              class="mr-1"
              >$ ({{ data.item.amount }})</span
            >
            <!-- Getting Void Refund Info -->
            <feather-icon
              icon="EyeIcon"
              style="cursor: pointer; position: absolute; left: 70px"
              v-if="data.item.type_t == 39 || data.item.type_t == 40"
              class="text-primary"
              @click="getVoidRefund(data.item.transaction_id)"
            ></feather-icon>
            <!-- Img Void -->
            <img
              :src="assetsImg + '/images/icons/void.ico'"
              style="
                cursor: pointer;
                color: red;
                position: absolute;
                left: 70px;
              "
              title="Void"
              @click="
                voidAuthorize(
                  data.item.transaction_id,
                  data.item.merchant,
                  data.item.amount,
                  data.item.lead_name,
                  data.item.settlement_date,
                  1
                )
              "
              v-if="
                data.item.type_t != 39 &&
                data.item.type_t != 40 &&
                data.item.void == 1 &&
                data.item.w_card == 1 &&
                currentUser.role_id == 1 &&
                data.item.result == 'Approved'
              "
            />
            <!-- Img Refund -->
            <img
              :src="assetsImg + '/images/icons/refund.ico'"
              style="
                cursor: pointer;
                color: green;
                position: absolute;
                left: 70px;
              "
              title="Refund"
              v-if="
                data.item.type_t != 39 &&
                data.item.type_t != 40 &&
                data.item.void == 0 &&
                data.item.refund == 1 &&
                data.item.w_card == 1 &&
                currentUser.role_id == 1 &&
                data.item.result == 'Approved'
              "
              @click="
                voidAuthorize(
                  data.item.transaction_id,
                  data.item.merchant,
                  data.item.amount,
                  data.item.lead_name,
                  data.item.settlement_date,
                  2
                )
              "
            />
          </div>
        </template>
        <!-- Column CHARGE -->
        <template #cell(charge)="data">
          <div
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <b-icon
              v-if="data.item.charge == 0"
              icon="check-circle-fill"
              variant="success"
            ></b-icon>
            <feather-icon
              v-if="data.item.charge == 1 || data.item.charge == null"
              icon="XCircleIcon"
              class="text-danger"
            />
          </div>
        </template>
        <!-- Column RESULT -->
        <template #cell(result)="data">
          <div
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <b-icon
              v-if="data.item.result == 'Approved'"
              icon="check-circle-fill"
              variant="success"
            ></b-icon>
            <feather-icon
              v-if="data.item.result == 'Unverified'"
              icon="ClockIcon"
              class="text-warning"
            />
            <feather-icon
              v-if="
                data.item.result != 'Approved' &&
                data.item.result != 'Unverified'
              "
              icon="XCircleIcon"
              class="text-danger"
            />
          </div>
        </template>
        <!-- Column CREATED BY -->
        <template #cell(user_name)="data">
          <div
            class="d-flex flex-column justify-content-start align-items-start"
          >
            <span>
              {{ data.item.user_name }} -
              {{ data.item.created_at | myGlobalDay }}
            </span>
          </div>
        </template>
      </b-table>
      <!-- Total Amount Footer -->
      <template #footer>
        <b-col
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <div
            class="bg-info"
            style="
              padding: 5px;
              border-radius: 30px;
              padding-left: 15px;
              padding-right: 15px;
            "
          >
            <span class="text-nowrap" style="color: #fff">
              Total Amount
              {{ totalAmount == 0 ? "$" + totalAmount : totalAmount }}
            </span>
          </div>
        </b-col>
      </template>
    </filter-slot>
    <!-- Modal Refund  -->
    <modal-refund
      v-if="modalRefund"
      :modalRefund="modalRefund"
      :modul="$route.meta.module"
      :dataVoid="this.dataVoid"
      :global="this.currentUser"
      @close="closeModalRefund"
      @updateGrid="updateGrid"
    ></modal-refund>
    <!-- Modal Void Refund Info -->
    <modal-void-refund-info
      v-if="modalVoidRefund"
      :modalVoidRefund="modalVoidRefund"
      :idtransaction="idtransaction"
      @closeInfo="closeModalVoidRefundInfo"
    ></modal-void-refund-info>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import vSelect from "vue-select";
// Filters
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
// Import Service
import PaymentService from "../service/payments.service";
// Import Modals
import ModalRefund from "@/views/crm/views/payments/components/ModalRefund.vue";
import ModalVoidRefundInfo from "@/views/crm/views/payments/components/ModalVoidRefundInfo.vue";
// Import Data
import filters from "../data/filters.payments.data";
import fields from "../data/fields.payments.data";

export default {
  components: {
    vSelect,
    FilterSlot,
    ModalRefund,
    ModalVoidRefundInfo,
  },
  data: function () {
    return {
      modalRefund: false,
      assetsImg: process.env.VUE_APP_BASE_URL_ASSETS,
      totalRows: 0,
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      totalAmount: 0,
      sortBy: "created_at",
      sortDesc: true,
      //fields data
      arrayColumns: fields,
      startPage: null,
      endPage: "",
      nextPage: "",
      toPage: null,
      isBusy: false,
      perPageOptions: [10, 25, 50, 100],
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: "",
      },
      //data filters
      filter: filters,
      dataVoid: [],
      modalVoidRefund: false,
      idtransaction: null,
    };
  },
  mounted: function () {
    this.getAllUsers();
    this.addPaddingTd();
  },
  computed: {
    clientRoute: function () {
      return "/crm/payment/get-all-lead-payments";
    },
    fields: function () {
      return this.arrayColumns.filter((column) => column.visible);
    },
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    //filter status by Type of User
    filterStatus: function () {
      if (this.currentUser.user_id == 1 || this.currentUser.user_id == 2) {
        return this.filter;
      } else {
        let newFilter = [...this.filter];
        newFilter.splice(2, 1);
        return newFilter;
      }
    },
  },
  methods: {
    //open modal refund
    voidAuthorize: function (
      idtransaction,
      idmerchant,
      amount,
      client_name,
      settlement_date,
      type
    ) {
      this.dataVoid = {
        idtransaction,
        idmerchant,
        amount,
        client_name,
        settlement_date,
        type,
      };
      this.modalRefund = true;
    },
    closeModalRefund: function () {
      this.modalRefund = false;
    },
    getVoidRefund: function (idtransaction) {
      this.idtransaction = idtransaction;
      this.modalVoidRefund = true;
    },
    closeModalVoidRefundInfo: function () {
      this.modalVoidRefund = false;
    },
    myProvider: async function (ctx) {
      try {
        let params = {
          perPage: ctx.perPage,
          text: this.filterPrincipal.model,
          from: this.filter[3].model,
          to: this.filter[4].model,
          result: this.filter[1].model,
          type: this.filter[0].model,
          user:
            this.currentUser.user_id == 1 || this.currentUser.user_id == 2
              ? this.filter[2].model
              : this.currentUser.user_id,
        };
        const data = await amgApi.post(
          `${ctx.apiUrl}?page=${ctx.currentPage}`,
          params
        );
        const items = data.data.data;
        let value = 0;
        if (items) {
          items.forEach((element) => {
            value += parseFloat(element.amount);
          });
          const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          });

          this.totalAmount = formatter.format(value);
        } else {
          this.totalAmount = 0.0;
        }
        this.startPage = data.data.from;
        this.paginate.currentPage = data.data.current_page;
        this.paginate.perPage = data.data.per_page;
        this.nextPage = this.startPage + 1;
        this.endPage = data.data.last_page;
        this.totalRows = data.data.total;
        this.toPage = data.data.to;
        return items || [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    getAllUsers: async function () {
      try {
        const data = await PaymentService.getAllUsers({
          roles: "[1,2,5]",
          type: "0",
        });
        let firstOption = {
          value: "All",
          id: 0,
        };
        let newData = data;
        newData.unshift(firstOption);
        this.filter[2].options = newData;
      } catch (error) {
        console.error(error);
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "Something went wrong with users!"
        );
      }
    },
    updateGrid: function () {
      this.$refs.refClientsList.refresh();
    },
  },
};
</script>

<style lang="scss" scoped>
.select-lead-name:hover {
  text-decoration-line: underline;
}
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
