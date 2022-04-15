<template>
  <div :class="isTabsBorder">
    <filter-slot
      :filter="filters"
      :filter-principal="filterPrincipal"
      :total-rows="totalData"
      :paginate="paginate"
      :start-page="startPage"
      :to-page="toPage"
      :send-multiple-sms="false"
      @reload="$refs.refLoansList.refresh()"
    >
      <template #table>
        <b-table
          ref="refLoansList"
          class="position-relative"
          :items="search"
          :has-provider="true"
          :fields="arrayColumns"
          primary-key="id"
          table-class="text-nowrap"
          responsive="sm"
          show-empty
          small
          hover
          no-border-collapse
          sticky-header="65vh"
          :busy="isBusy"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="paginate.currentPage"
          :per-page="paginate.perPage"
          :filter="searchInput"
          no-provider-filtering
          thead-class="text-center"
          tbody-class="text-center"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>

          <template #cell(amount_loan)="data">
            <div>
              <span style="color: #4141af">$ {{ data.value }}</span>
            </div>
          </template>

          <template #cell(balance)="data">
            <div>
              <span style="color: #4141af">$ {{ data.value }}</span>
            </div>
          </template>

          <template #cell(due_payment)="data">
            <div>
              <b
                :class="
                  data.item.status_loan == 4
                    ? 'text-dark'
                    : data.item.due_date > dateNow
                    ? 'text-success '
                    : 'text-danger'
                "
                >{{ data.item.due_id ? "$" + data.item.due_payment : "-" }}</b
              >
            </div>
          </template>

          <template #cell(due_date)="data">
            <div v-if="data.item.due_id">
              <span>{{ data.item.due_date | myGlobal }}</span>
              <b-icon
                v-if="isManagement && data.item.due == 1"
                icon="pencil-square"
                variant="success cursor-pointer ml2"
                font-scale="1"
                @click="editDatePay(data.item)"
              />
              <b-icon
                v-if="
                  isManagement && data.item.due == 1 && data.item.is_tracking
                "
                icon="pencil-square"
                variant="secondary cursor-pointer ml2"
                font-scale="1"
                @click="openTrackingPayDay(data.item.id_loan)"
              />
            </div>
            <div v-else>
              <span>-</span>
            </div>
          </template>

          <template #cell(payment_time)="data">
            <div>
              {{ data.item.payment_time }}
              {{
                data.item.payment_time > 1
                  ? "Dues"
                  : data.item.payment_time == 0
                  ? "-"
                  : "Due"
              }}
            </div>
          </template>

          <template #cell(due_id)="data">
            <div>
              {{
                data.item.due_id
                  ? changeOrdinal(data.item.due) + " Due"
                  : "Finished"
              }}
            </div>
          </template>

          <template #cell(created_at)="data">
            <div>{{ data.value | myGlobal }}</div>
          </template>

          <template #cell(process)="data">
            <div class="font-weight-bolder">{{ data.value }}</div>
          </template>

          <template #cell(status)="data">
            <b-badge
              class="fs100 w-100"
              :variant="
                data.item.status_loan == 4
                  ? 'dark'
                  : data.item.status_tracking == 2
                  ? 'danger'
                  : data.item.rol_tracking == 4 &&
                    data.item.status_tracking == 1
                  ? 'success'
                  : 'warning'
              "
              >{{ data.value }}</b-badge
            >
          </template>

          <template #cell(id_loan)="data">
            <b-button
              v-b-tooltip.hover
              size="sm"
              title="tracking"
              variant="dark button-little-size"
              @click="openTrackingLoan(data.item.id_loan)"
            >
              <b-icon icon="stoplights" />
            </b-button>
          </template>

          <template #cell(status_loan)="data">
            <b-button
              v-b-tooltip.hover
              size="sm"
              title="INFO OF LOAN"
              class="button-little-size ml6"
              variant="gradient-info"
              @click="openModalLoanId(data.item.id_loan)"
            >
              <b-icon icon="info-circle-fill" />
            </b-button>
            <b-button
              v-if="tab == 1 && data.item.status_loan == 3"
              v-b-tooltip.hover
              size="sm"
              title="ADD NEW PAY"
              class="button-little-size ml6"
              variant="gradient-success"
              @click="openModalPay(data.item.id_loan, data.item.due_id)"
            >
              <b-icon icon="wallet-fill" />
            </b-button>
            <span
              v-if="
                (tab == 1 || isManagement) &&
                [3, 4].includes(data.item.status_loan)
              "
              style="position: relative"
            >
              <b-button
                v-b-tooltip.hover
                size="sm"
                title="REVISION PAYMENT"
                class="button-little-size ml6"
                variant="gradient-warning"
                @click="openModalRevision(data.item.id_loan)"
              >
                <feather-icon
                  icon="FileTextIcon"
                  size="16"
                  :badge="
                    data.item.counter > 0
                      ? data.item.counter > 9
                        ? '9+'
                        : data.item.counter
                      : ''
                  "
                  badge-classes="badge-danger badge-glow"
                />
              </b-button>
            </span>
            <b-button
              v-if="
                (tab == 1 || isManagement) &&
                [3, 4].includes(data.item.status_loan)
              "
              v-b-tooltip.hover
              size="sm"
              title="INVOICE"
              class="button-little-size ml6"
              variant="gradient-secondary"
              @click="openModalInvoice(data.item.id_loan)"
            >
              <b-icon icon="file-earmark-spreadsheet" />
            </b-button>
          </template>
        </b-table>
      </template>
    </filter-slot>

    <ModalTrackingLoan
      v-if="modalsInfo.tracking"
      :info="modalsInfo"
      @hide="closeModals"
    />
    <ModalNewPay
      v-if="modalsInfo.newPay"
      :info="modalsInfo"
      @hide="closeModals"
    />
    <ModalRevisionPayment
      v-if="modalsInfo.revisionPay"
      :info="modalsInfo"
      @hide="closeModals"
    />
    <ModalInvoice
      v-if="modalsInfo.invoice"
      :info="modalsInfo"
      @hide="closeModals"
    />
  </div>
</template>

<script>
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import { mapGetters, mapMutations } from "vuex";
import moment from "moment";
import ModalTrackingLoan from "./modals/ModalTrackingLoan.vue";
import ModalNewPay from "./modals/ModalNewPay.vue";
import ModalRevisionPayment from "./modals/ModalRevisionPayment.vue";
import ModalInvoice from "./modals/ModalInvoice.vue";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
import loansService from "@/views/commons/components/loans/services/loans.service";

export default {
  name: "LoansTable",
  directives: {
    Ripple,
  },
  components: {
    vSelect,
    AppCollapse,
    AppCollapseItem,
    ModalTrackingLoan,
    ModalNewPay,
    ModalRevisionPayment,
    ModalInvoice,
    FilterSlot,
  },
  props: {
    tab: {
      type: Number,
      default: null,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      modalsInfo: {
        tracking: false,
        newPay: false,
        revisionPay: false,
        invoice: false,
        idLoan: null,
        dueId: null,
      },
      module: this.$route.meta.module,
      loans: [],
      advance: false,
      user_session: null,
      startdate: "",
      enddate: "",
      start_page: "",
      next_page: "",
      last_page: "",
      total_data: "",
      nameUser: "",
      showModalDate: false,
      modalTracking: false,
      modalTrackingPayDay: false,
      idLoan: null,
      idDue: null,
      status_search: "",
      isNoRefresh: false,
      formatDate: {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      },
      loanSelected: [],
      dateNow: moment().format("YYYY-MM-DD"),
      sortBy: "created_at",
      sortDesc: true,
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      arrayColumns: [
        {
          key: "username",
          label: "User",
          tdClass: "font-weight-bolder py-1",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "amount_loan",
          label: "Amount Loan",
          tdClass: "font-weight-bolder",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "balance",
          label: "Balance Loan",
          tdClass: "font-weight-bolder",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "due_payment",
          label: "Monthly Payment",
          tdClass: "font-weight-bolder",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "due_date",
          label: "Pay day",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "payment_time",
          label: "Dues",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "due_id",
          label: "Current Due",
          tdClass: "text-center",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "created_at",
          label: "Creation Date",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "process",
          label: "Status Location",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "status",
          label: "Status",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "id_loan",
          label: "Tracking",
          thClass: "font-weight-bolder py-1",
        },
        {
          key: "status_loan",
          label: "Actions",
          thClass: "font-weight-bolder py-1",
        },
      ],
      searchInput: "",
      orderby: "",
      order: "",
      startPage: null,
      endPage: null,
      totalData: null,
      perPage: 10,
      nextPage: "",
      currentPage: 1,
      toPage: null,
      isBusy: false,
      perPageOptions: [10, 25, 50, 100],
      isClientsTab: false,
      fromToObject: {
        from: null,
        to: null,
      },
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Search User...",
        model: "",
      },
      filters: [
        {
          type: "datepicker",
          cols: 6,
          margin: true,
          showLabel: true,
          label: "From",
          placeholder: "Date",
          class: "font-small-3",
          model: null,
          locale: "en",
          dateFormatOptions: {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          },
        },
        {
          type: "datepicker",
          cols: 6,
          margin: true,
          showLabel: true,
          label: "To",
          placeholder: "Date",
          class: "font-small-3",
          model: null,
          locale: "en",
          dateFormatOptions: {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          },
        },
        {
          type: "select",
          cols: 12,
          margin: true,
          showLabel: true,
          label: "Status",
          placeholder: "",
          class: "font-small-3",
          model: null,
          options: [
            { value: 0, label: "All" },
            { value: 1, label: "Pending" },
            { value: 4, label: "Disapproved" },
            { value: 6, label: "Approved" },
            { value: 2, label: "Finished" },
          ],
          reduce: "value",
          selectText: "label",
        },
      ],
      programs: [],
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      skin: "appConfig/skin",
      loading: "commissions-store/loading",
      researchLoans: "loans-store/researchLoans",
      modalRequest: "loans-store/modalRequest",
    }),
    isManagement() {
      return this.module === 16;
    },
    isTabsBorder() {
      return this.tab === 2 || this.tab === 3
        ? "border-top-info border-3 box-shadow-3 rounded-bottom"
        : "";
    },
  },
  methods: {
    ...mapMutations({
      setLoading: "app/SET_LOADING",
    }),

    // Searching Table
    async search(ctx) {
      try {
        this.isBusy = true;
        const params = {
          page: ctx.currentPage,
          type: this.tab,
          nameUser: this.filterPrincipal.model,
          user_id: this.currentUser.user_id,
          role_id: this.currentUser.role_id,
          id_module: this.module,
          startdate: this.filters[0].model,
          enddate: this.filters[1].model,
          status: this.status,
          status_search: this.filters[2].model,
          perPage: this.paginate.perPage,
        };
        const response = await loansService.getLoans(params);
        this.loans = response.data;
        this.startPage = response.from;
        this.paginate.currentPage = response.current_page;
        this.paginate.perPage = response.per_page;
        this.nextPage = this.startPage + 1;
        this.endPage = response.last_page;
        this.totalData = response.total;
        this.toPage = response.to;
        this.isBusy = false;
        return this.loans;
      } catch (error) {
        this.showErrorSwal();
        this.isBusy = false;
        return [];
      }
    },
    resetSearch() {
      this.searchInput = "";
      this.$refs.refLoansList.refresh();
    },

    // Methods to Edit
    openTrackingPayDay(id) {},
    updateDate() {
      swal
        .fire({
          title: "Are you sure?",
          text: "You want to update this date?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        })
        .then((result) => {
          if (result.value) {
            this.addPreloader();
            axios
              .post("/api/loans/update-date-first-due", {
                id_loan: this.loanSelected.id_loan,
                due_date: this.loanSelected.due_date,
                user_id: this.global.layout.id,
              })
              .then((response) => {
                this.removePreloader();
                this.showModalDate = false;
                this.reloadSearch();
                swal.fire("Success!", response.data.message, "success");
              })
              .catch((error) => {
                this.removePreloader();
                swal.fire("Error!", "Something went wrong!", "error");
              });
          }
        });
    },
    editDatePay(loan) {
      this.loanSelected = JSON.parse(JSON.stringify(loan));
      this.showModalDate = true;
    },
    changeOrdinal(number) {
      const s = ["th", "st", "nd", "rd"];
      const v = number % 100;
      return number + (s[(v - 20) % 10] || s[v] || s[0]);
    },

    openModalPays(id) {
      this.idLoan = id;
      this.showModalLoanPays = true;
    },

    // OPEN MODALS
    openModalLoanId(id) {
      this.modalRequest.idLoan = id;
      this.modalRequest.show = true;
    },
    openModalPay(id, due) {
      this.modalsInfo.idLoan = id;
      this.modalsInfo.idDue = due;
      this.modalsInfo.newPay = true;
      this.addPreloader();
    },
    openModalInvoice(id) {
      this.addPreloader();
      this.modalsInfo.idLoan = id;
      this.modalsInfo.invoice = true;
    },
    openTrackingLoan(id) {
      this.addPreloader();
      this.modalsInfo.idLoan = id;
      this.modalsInfo.tracking = true;
    },
    openModalRevision(id) {
      this.addPreloader();
      this.modalsInfo.idLoan = id;
      this.modalsInfo.revisionPay = true;
    },
    // CLOSE MODALS
    closeModals(status) {
      // Close Modals
      this.modalsInfo.newPay = false;
      this.modalsInfo.tracking = false;
      this.modalsInfo.revisionPay = false;
      this.modalsInfo.invoice = false;

      // Clean Info
      this.modalsInfo.idLoan = null;
      this.modalsInfo.idDue = null;

      // Research
      if (status) {
        this.$store.commit("loans-store/ADD_ONE_RESEARCH");
        this.$store.dispatch("loans-store/loadCounterTab");
      }
    },
  },
  watch: {
    researchLoans(newValue) {
      if (newValue) {
        this.resetSearch();
      }
    },
  },
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
.ml2 {
  margin-left: 2px;
}
.ml6 {
  margin-left: 7px;
}
.fs100 {
  font-size: 100%;
}
.span-counter {
  position: absolute;
  left: 15px;
  background: red;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  bottom: 7px;
  color: white;
  font-weight: 900;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-sweetalert.scss";
</style>
