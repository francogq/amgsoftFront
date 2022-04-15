<template>
  <div>
    <!-- Table Container Card -->
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
          :sort-by.sync="sortBy"
          :fields="fields"
          :items="items.data"
          :sort-desc.sync="isSortDirDesc"
          :busy.sync="isBusy"
          @row-selected="onRowSelected"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>
          <!-- Column: Name -->
          <template #cell(lead_name)="data">
            <div style="white-space: pre-wrap">
              <router-link
                :class="textLink"
                :to="`/${routeModule}/leads/${data.item.id}`"
                target="_blank"
                >{{ data.item.lead_name }}</router-link
              >
            </div>
          </template>

          <!-- Column: Status -->
          <template #cell(status)="data">
            <b-badge
              pill
              :variant="`light-${resolveUserStatusVariant(data.item.status)}`"
              class="text-capitalize"
              >{{ data.item.status }}</b-badge
            >
          </template>

          <!-- Column: Credit Report -->
          <template #cell(credit_report)="data">
            <strong
              :class="`text-${
                data.item.credit_report == 1 ? 'danger' : 'success'
              }`"
              >{{ data.item.credit_report == 1 ? "NO" : "YES" }}</strong
            >
          </template>

          <!-- Column: Programs -->
          <template #cell(programs)="data">
            <div
              v-if="data.item.programs"
              class="d-flex flex-column"
              style="gap: 0.5rem"
            >
              <template v-for="(item, key) in JSON.parse(data.item.programs)">
                <span :key="key">{{ item }}</span>
              </template>
            </div>
          </template>

          <!-- Column: Created By -->
          <template #cell(created_by)="data">
            <!-- <small>{{ data.item.owner }}</small> -->
            <br />
            <small>{{ data.item.created_at | myDateGlobalWithHour }}</small>
          </template>

          <!-- Column: Assign To -->
          <template #cell(assign_to)="data">
            <small>{{ data.item.assign_to }}</small>
            <br />
            <small v-if="data.item.assign_date">{{
              data.item.assign_date | myDateGlobal
            }}</small>
          </template>

          <!-- Column: Actions -->
          <template #cell(actions)="data">
            <actions-table
              :options="actionsOptions"
              :row-data="data.item"
              @onRowDelete="onRowDelete"
              @onRowEdit="onRowEdit"
              @onRowProcess="onRowProcess"
              @modalAddService="modalAddService"
            />
          </template>
        </b-table>
      </filter-slot>
    </b-card>
    <modal-add-programs
      v-if="modalAddProgramsState"
      :sales-client="salesClient"
      :currentUser="currentUser"
      :module="moduleId"
      @hideModal="closeModalAddPrograms"
      @changeProgram="openModalProgram"
      @leadEvent="leadEvent"
    />
    <!-- Dynamic Component -->
    <component
      :is="modalData.programs.programSelected"
      v-if="modal.programs"
      :type-modal="modalData.programs.typeModal"
      :sales-client="modalData.programs.salesClient"
      :programs-all="programs"
      :users-services="owner"
      :header-s="headerS"
      @closeModal="hideModalProgram"
      @changeProgram="openModalProgram"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import ActionsTable from "@/views/crm/views/Lead/lead-table/ActionsTable.vue";
import dataFields from "./fields.data";
import dataFilters from "./dataFilters.data";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
import BusinessModal from "@/views/crm/views/sales-made/components/modals/services/BuisnessModal.vue";
import CreditExpertsModal from "@/views/crm/views/sales-made/components/modals/services/CreditExpertsModal.vue";
import BoostCreditModal from "@/views/crm/views/sales-made/components/modals/services/BoostCreditModal.vue";
import GeneralSupportModal from "@/views/crm/views/sales-made/components/modals/services/GeneralSupportModal.vue";
import KeyBookModal from "@/views/crm/views/sales-made/components/modals/services/KeyBookModal.vue";
import ParagonModal from "@/views/crm/views/sales-made/components/modals/services/ParagonModal.vue";
import SpecialistModal from "@/views/crm/views/sales-made/components/modals/services/SpecialistModal.vue";
import TaxResearchModal from "@/views/crm/views/sales-made/components/modals/services/TaxResearchModal.vue";
import DebtSolutionModal from "@/views/crm/views/sales-made/components/modals/services/DebtSolutionModal.vue";
import LeadService from "../../service/lead.service";
import ModalAddPrograms from "./ModalAddService.vue";
export default {
  components: {
    FilterSlot,
    ActionsTable,
    BusinessModal,
    CreditExpertsModal,
    BoostCreditModal,
    GeneralSupportModal,
    KeyBookModal,
    ParagonModal,
    SpecialistModal,
    TaxResearchModal,
    DebtSolutionModal,

    ModalAddPrograms,
  },
  data() {
    return {
      isOnlyLead: false,
      type: 0,
      actionsOptions: [],
      baseUrl: process.env.VUE_APP_BASE_URL_ASSETS,
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
      isBusy: false,
      fields: dataFields.leadFields,
      filter: dataFilters,
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
      perPageOptions: [10, 25, 50, 100],
      sortBy: "id",
      isSortDirDesc: true,
      rowData: {},
      name_leads_arr: [],
      selectAll: false,
      leadsSelecteds: [],
      modal: {
        programs: false,
      },

      modalData: {
        programs: {
          programSelected: "",
          typeModal: 0,
          salesClient: [],
        },
      },
      dataModal: "",
      modalAddProgramsState: false,
      items: [],
      owner: [],
      prueba: [],
      programsAll: [],
      usersServices: [],
      headerS: {},
      dataEvent: [],
      event: [],
    };
  },
  computed: {
    ...mapState({
      programs: (state) => state["CrmGlobalStore"].S_PROGRAMS,
      S_LEADS: (state) => state.CrmLeadStore.S_LEADS,
    }),
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_STATUS_LEADS: "CrmLeadStore/G_STATUS_LEADS",
      G_SOURCE_NAMES: "CrmGlobalStore/G_SOURCE_NAMES",
      G_UPDATE_TABLE_LEAD: "CrmLeadStore/G_UPDATE_TABLE_LEAD",
    }),
    routeModule() {
      return this.$route.meta.route;
    },
    moduleId() {
      return this.$route.meta.module;
    },
  },
  async created() {
    this.programsAll = this.programs;
    this.addPaddingTd();
    await this.getOwners(), await this.myProvider();
    await this.setOptionsOnFilters();
  },
  methods: {
    ...mapActions({
      A_GET_LEADS: "CrmLeadStore/A_GET_LEADS",
      A_SET_FILTERS_LEADS: "CrmLeadStore/A_SET_FILTERS_LEADS",
      A_SET_SELECTED_LEADS: "CrmLeadStore/A_SET_SELECTED_LEADS",
      A_DELETE_LEADS: "CrmLeadStore/A_DELETE_LEADS",
      A_PROCESS_LEADS: "CrmLeadStore/A_PROCESS_LEADS",
      A_ADD_SELLER_LIST: "CrmLeadStore/A_ADD_SELLER_LIST",
      A_SET_UPDATE_TABLE_LEAD: "CrmLeadStore/A_SET_UPDATE_TABLE_LEAD",
      A_GET_OWNERS: "CrmGlobalStore/A_GET_OWNERS",
    }),
    async getOwners() {
      let A_GET_OWNERS = await this.A_GET_OWNERS({
        modul: this.moduleId,
        body: { roles: "[]", type: "0" },
      });
      A_GET_OWNERS.data.forEach((item) => {
        this.owner.push({ id: item.id, user_name: item.user_name });
      });
    },
    resolveUserStatusVariant(status) {
      if (status === "Pending") return "warning";
      if (status === "Active") return "success";
      if (status === "Inactive") return "secondary";
      if (status === "Not Contacted") return "danger";
      return "primary";
    },
    selectedAll() {
      if (this.selectAll)
        this.S_LEADS.items.forEach((item) => (item.selected = true));
      else this.S_LEADS.items.forEach((item) => (item.selected = false));
      this.onRowSelected();
    },
    onSelectedRow(data) {
      const index = this.leadsSelecteds.findIndex(
        (select) => select.id === data.id
      );
      if (data.selected === true && index === -1)
        this.leadsSelecteds.push(data);
      else if (data.selected === false && index !== -1)
        this.leadsSelecteds.splice(index, 1);
      this.onRowSelected();
    },
    async myProvider() {
      try {
        this.setFilters();
        this.isBusy = true;
        this.items = await LeadService.A_GET_LEADS({
          name_text: this.filterPrincipal.model,
          lead_status: this.filter[2].model,
          cr: this.filter[4].model,
          date_from: this.filter[0].model,
          date_to: this.filter[1].model,
          orderby: 10,
          order: "desc",
          user_owner: this.filter[3].model,
          sourcename: this.filter[5].model,
          module_id: this.moduleId,
          userid: 1,
          roleid: 1,
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
    async setOptionsOnFilters() {
      this.filter[2].options = this.G_STATUS_LEADS;
      this.filter[3].options = this.owner;
      this.filter[5].options = this.G_SOURCE_NAMES;
    },
    onChangeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.myProvider();
    },
    setFilters() {
      this.A_SET_FILTERS_LEADS({
        from: this.filter[0],
        to: this.filter[1],
        statusLead: this.filter[2],
        owner: this.filter[3],
        cr: this.filter[4],
        sourceName: this.filter[5],
        perPage: this.paginate.perPage,
        currentPage: this.paginate.currentPage,
      });
    },
    onRowSelected() {
      this.A_SET_SELECTED_LEADS(this.leadsSelecteds);
    },
    async onRowDelete(id) {
      const confirm = await this.showConfirmSwal();
      if (confirm.isConfirmed) {
        this.addPreloader();
        try {
          const { user_id } = this.currentUser;
          const response = await this.A_DELETE_LEADS({
            lead_id: id,
            user_id: user_id,
          });
          if (this.isResponseSuccess(response)) {
            this.removePreloader();
            this.showToast(
              "success",
              "top-right",
              "Deleted!",
              "CheckIcon",
              "The Lead has been deleted."
            );
          }
        } catch (error) {
          this.removePreloader();
          this.showErrorSwal(error);
        }
      }
    },
    async onRowEdit(id) {
      console.log(id);
    },
    leadEvent(data) {
      if (data) {
        this.dataEvent.push({ event_id: data.id }, { module: this.moduleId });
      }
    },

    modalAddService(data) {
      this.modalAddProgramsState = true;
      this.salesClient = data;
    },
    openModalProgram(data) {
      this.headerS = data;
      if (data) {
        this.modalData.programs.salesClient = {
          ...this.salesClient,
          ...data,
          ...this.dataEvent[0],
          ...this.dataEvent[1],
        };
        console.log(this.modalData.programs.salesClient, "salesClient");
        switch (data.program.name) {
          case "Business":
            this.modalData.programs.programSelected = "business-modal";
            break;
          case "Boost Credit":
            this.modalData.programs.programSelected = "boost-credit-modal";
            break;
          case "Credit Experts":
            this.modalData.programs.programSelected = "credit-experts-modal";
            break;
          case "Debt Solution":
            this.modalData.programs.programSelected = "debt-solution-modal";
            break;
          case "Tax Research":
            this.modalData.programs.programSelected = "tax-research-modal";
            break;
          case "General Support":
            this.modalData.programs.programSelected = "general-support-modal";
            break;
          case "Specialist":
            this.modalData.programs.programSelected = "specialist-modal";
            break;
          case "KeyBook":
            this.modalData.programs.programSelected = "key-book-modal";
            break;
          case "Paragon":
            this.modalData.programs.programSelected = "paragon-modal";
            break;
          default:
            break;
        }
        this.modalAddProgramsState = false;
        if (this.modalData.programs.programSelected !== "") {
          this.modalData.programs.typeModal = 6;
          this.modal.programs = true;
        }
      }
    },

    closeModalAddPrograms(stado) {
      this.modalAddProgramsState = stado;
    },
    async hideModalProgram(refresh) {
      //redirect to Sales Made
      this.modalData.programs.programSelected = "";
      this.modal.programs = false;
      this.removePreloader();
    },
    onRowProcess(id) {
      this.showConfirmSwal(
        "Are you sure?",
        "You won't be able to revert this!",
        {
          input: "textarea",
          inputValidator: (value) => {
            if (!value) {
              return "You need to write something!";
            }
          },
        }
      )
        .then(async (result) => {
          if (result.value) {
            const { user_id, role_id } = this.currentUser;
            const response = await this.A_PROCESS_LEADS({
              lead_id: id,
              status: 3,
              user_id,
              description: result.value,
            });
            if (this.isResponseSuccess(response)) {
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
            } else {
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                `Something went wrong.${response.message}`
              );
            }
          }
        })
        .catch((error) => {
          console.log("Something went wrong onRowProcess:", error);
          this.showErrorSwal(error);
        });
    },
    async addListSeller() {
      const confirm = await this.showConfirmSwal(
        "Are you sure?",
        "You are going to add this leads to your List"
      );
      if (confirm.isConfirmed) {
        this.addPreloader();
        //filter just the owner of the lead
        const leadList = this.leadsSelecteds.map((el) => el.id);
        try {
          const params = {
            user_id: this.currentUser.user_id,
            list_lead: leadList,
            module_id: this.moduleId,
          };
          const response = await this.A_ADD_SELLER_LIST(params);
          this.removePreloader();
          this.showToast(
            "success",
            "top-right",
            "Success!",
            "CheckIcon",
            "Leads were added to your list"
          );
        } catch (error) {
          this.removePreloader();
          this.showErrorSwal(error);
        }
      }
    },
    resetQuickData(item) {
      this.quickData = item;
    },
    updateTableLead: function () {
      if (this.G_UPDATE_TABLE_LEAD) {
        this.A_SET_UPDATE_TABLE_LEAD(false);
      }
    },
  },
  mounted() {
    this.programsAll = this.programs;
    this.leadEvent();

    if (![4].includes(this.currentUser.role_id) && !this.isOnlyLead) {
      this.fields.unshift({
        key: "selected",
        label: "",
        sortable: false,
      });
    }
    if ([1, 2].includes(this.currentUser.role_id) && this.type === 0)
      this.actionsOptions.push("delete");
    this.actionsOptions.push("addService"); // Add Service
  },
  watch: {
    G_UPDATE_TABLE_LEAD(newVal) {
      if (newVal) {
        if (this.$refs.refUserListTable === undefined) {
          this.myProvider();
        } else {
          this.$refs.refUserListTable.refresh();
          this.myProvider();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.table-responsive > div {
  min-height: 15rem;
}
</style>