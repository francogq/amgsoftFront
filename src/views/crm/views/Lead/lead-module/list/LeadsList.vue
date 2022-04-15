<template>
  <div>
    <!-- Table Container Card -->
    <b-card no-body class="mb-0 border-0 p-0">
      <filter-slot
        :filter="filter"
        :filter-principal="filterPrincipal"
        :total-rows="S_LEADS.total"
        :paginate="paginate"
        :start-page="S_LEADS.fromPage"
        :to-page="S_LEADS.toPage"
        @reload="myProvider"
        @onChangeCurrentPage="onChangeCurrentPage"
        @onSelectChange="filterSelectChange"
      >
        <template #buttons>
          <b-button
            variant="success"
            class="ml-1"
            :disabled="!leadsSelecteds.length"
            @click="modalSmssOpen"
          >
            <feather-icon icon="MessageCircleIcon" class="mr-50" />Send SMS
          </b-button>
          <b-button
            v-if="[5].includes(currentUser.role_id)"
            variant="success"
            class="ml-1"
            :disabled="!leadsSelecteds.length"
            @click="addListSeller()"
          >
            <feather-icon icon="ListIcon" class="mr-50" />ADD LIST
          </b-button>
        </template>

        <template #table>
          <b-table
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
            :items="S_LEADS.items"
            :sort-desc.sync="isSortDirDesc"
            :busy.sync="isBusy"
            @row-selected="onRowSelected"
          >
            <!-- Head: Check -->
            <template #head(selected)>
              <b-form-checkbox v-model="selectAll" @input="selectedAll" />
            </template>

            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle mr-1" />
                <strong>Loading ...</strong>
              </div>
            </template>

            <!-- Column: Selected -->
            <template #cell(selected)="data">
              <b-form-group>
                <b-form-checkbox
                  v-model="data.item.selected"
                  @input="onSelectedRow(data.item)"
                />
              </b-form-group>
            </template>

            <!-- Column: Date Even -->
            <template #cell(date_even)="data">
              <b-badge
                v-if="data.item.date_even"
                pill
                variant="light-danger"
                class="text-capitalize"
              >
                <feather-icon
                  v-if="data.item.date_even"
                  icon="CalendarIcon"
                  size="18"
                  class="mr-50 text-danger"
                />
                <span class="align-text-top text-capitalize">{{
                  data.item.date_even | myGlobal
                }}</span>
              </b-badge>
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
                v-if="!data.item.editStatus"
                pill
                :variant="`light-${resolveUserStatusVariant(data.item.status)}`"
                class="text-capitalize"
              >
                {{ data.item.status }}
              </b-badge>

              <b-form-select
                v-else
                v-model="statusLeadUpdate"
                :options="G_STATUS_LEADS_S"
                class="mb-1 font-small-1"
                style="width: 80px !important"
                size="sm"
              />

              <div class="mt-07 text-right mr-1">
                <b-icon
                  v-if="!data.item.editStatus"
                  icon="pencil-fill"
                  class="cursor-pointer"
                  @click="activateUpdateLeadStatus(data.item)"
                />

                <template v-else>
                  <feather-icon
                    class="cursor-pointer"
                    icon="SaveIcon"
                    @click="updateStatusLead(data.item)"
                  />
                  <feather-icon
                    class="cursor-pointer"
                    icon="XSquareIcon"
                    @click="data.item.editStatus = false"
                  />
                </template>
              </div>
            </template>

            <!-- Column: Credit Report -->
            <template #cell(credit_report)="data">
              <strong
                :class="`text-${
                  data.item.credit_report == 1 ? 'danger' : 'success'
                }`"
              >
                {{ data.item.credit_report == 1 ? "NO" : "YES" }}
              </strong>
            </template>

            <!-- Column: Programs -->
            <template #cell(programs)="data">
              <div
                v-if="data.item.programs"
                class="d-flex flex-column"
                style="gap: 0.5rem"
              >
                <template
                  v-for="(program, key) in JSON.parse(data.item.programs)"
                >
                  <b-img
                    v-if="program.logo"
                    :key="key"
                    thumbnail
                    fluid
                    :src="baseUrl + program.logo"
                    style="width: 50px"
                  />
                  <b-img
                    v-else-if="!program.logo && program.value == 'Paragon'"
                    :src="baseImg + $options.filters.myPrograms(program.value)"
                    :key="key"
                    thumbnail
                    fluid
                    style="width: 50px"
                  ></b-img>
                  <span :key="key" v-else>{{ program.value }}</span>
                </template>
              </div>
            </template>

            <!-- Column: Created By -->
            <template #cell(created_by)="data">
              <small>{{ data.item.owner }}</small>
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
                @onRowProcess="onRowProcess"
                @modalSmsOpen="modalSmsOpen"
                @modalHistorySmsOpen="modalHistorySmsOpen"
              />
            </template>
          </b-table>
        </template>
      </filter-slot>
    </b-card>

    <!-- modal SEND SMS -->

    <modal-send-sms
      v-if="modalSms"
      :smss="leads_sms"
      :modul="currentUser.modul_id"
      :typesms="typesms"
      :sms="leads_sms_o"
      :name-leads="name_leads_arr"
      @hide="modalSmsClose"
    />

    <!-- modal HISTORY SMS -->
    <b-modal
      id="modal-history-sms"
      ok-only
      modal-class="modal-primary"
      title-class="text-white h4"
      centered
      size="lg"
      title="History of Sms"
      hide-footer
    >
      <modal-history-sms
        :id="historySms.id"
        :modul="currentUser.modul_id"
        :lead-name="historySms.leadName"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import vSelect from "vue-select";

import ActionsTable from "../../lead-table/ActionsTable.vue";
import dataFields from "@/views/crm/views/Lead/lead-table/fields.data";
import dataFilters from "@/views/crm/views/Lead/lead-table/filtersLead.data";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
import ModalHistorySms from "../../lead-sms/ModalHistorySms.vue";
import ModalSendSms from "../../lead-sms/ModalSendSms.vue";

export default {
  components: {
    vSelect,
    FilterSlot,
    ActionsTable,
    ModalSendSms,
    ModalHistorySms,
  },
  data() {
    return {
      isOnlyLead: false,
      type: 0,
      actionsOptions: ["returnToSocialNetwork", "sendSMS", "historySMS"],
      baseUrl: process.env.VUE_APP_BASE_URL_ASSETS,
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
      isBusy: false,
      fields: dataFields.leadFields,
      filter: dataFilters,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Search...",
        model: "",
      },
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      perPageOptions: [10, 25, 50, 100],
      sortBy: "id",
      isSortDirDesc: true,
      rowData: {},
      historySms: {
        leadName: "",
        id: null,
      },
      name_leads_arr: [],
      leads_sms: [],
      selectAll: false,
      typesms: null,
      leads_sms_o: [],

      leadsSelecteds: [],
      modalSms: false,

      statusLeadUpdate: null,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_STATUS_LEADS: "CrmLeadStore/G_STATUS_LEADS",
      G_STATUS_LEADS_S: "CrmLeadStore/G_STATUS_LEADS_S",
      G_OWNERS: "CrmGlobalStore/G_OWNERS",
      G_PROGRAMS: "CrmGlobalStore/G_PROGRAMS",
      G_SOURCE_NAMES: "CrmGlobalStore/G_SOURCE_NAMES",
      G_STATES: "CrmGlobalStore/G_STATES",
      G_CRS: "CrmGlobalStore/G_CRS",
      G_TYPE_DOCS: "CrmGlobalStore/G_TYPE_DOCS",
      G_UPDATE_TABLE_LEAD: "CrmLeadStore/G_UPDATE_TABLE_LEAD",
    }),
    ...mapState({
      S_LEADS: state => state.CrmLeadStore.S_LEADS,
      S_FILTER_DATA_LOADED: state => state.CrmLeadStore.S_FILTER_DATA_LOADED,
    }),
    routeModule() {
      return this.$route.meta.route;
    },
    moduleId() {
      return this.$route.meta.module;
    },
  },
  async created() {
    this.addPaddingTd();
  },
  methods: {
    ...mapActions({
      A_UPDATE_FIELDS_LEAD: "CrmLeadStore/A_UPDATE_FIELDS_LEAD",
      A_GET_LEADS: "CrmLeadStore/A_GET_LEADS",
      A_SET_FILTERS_LEADS: "CrmLeadStore/A_SET_FILTERS_LEADS",
      A_GET_OWNERS: "CrmGlobalStore/A_GET_OWNERS",
      A_SET_SELECTED_LEADS: "CrmLeadStore/A_SET_SELECTED_LEADS",
      A_DELETE_LEADS: "CrmLeadStore/A_DELETE_LEADS",
      A_PROCESS_LEADS: "CrmLeadStore/A_PROCESS_LEADS",
      A_ADD_SELLER_LIST: "CrmLeadStore/A_ADD_SELLER_LIST",
      A_SET_UPDATE_TABLE_LEAD: "CrmLeadStore/A_SET_UPDATE_TABLE_LEAD",
      A_GET_STATUS_LEADS: "CrmGlobalStore/A_GET_STATUS_LEADS",
    }),
    activateUpdateLeadStatus(lead) {
      lead.editStatus = true;
      this.statusLeadUpdate = { value: lead.status, id: lead.leadstatus_id };
    },
    async updateStatusLead(lead) {
      const confirm = await this.showConfirmSwal();

      if (confirm.value) {
        this.isPreloading(true);
        const response = await this.A_UPDATE_FIELDS_LEAD({
          id: this.currentUser.user_id,
          id_lead: lead.id,
          id_user: this.currentUser.user_id,
          typee: 9,
          street: null,
          city: null,
          state: null,
          zipcode: null,
          country: null,
          other_street: null,
          other_city: null,
          other_state: null,
          other_zipcode: null,
          other_country: null,
          phoneh: null,
          phonem: null,
          ssn: null,
          itin: null,
          other: null,
          statusLead: this.statusLeadUpdate.id,
        });
        this.isPreloading(false);
        if (this.isResponseSuccess(response)) {
          lead.editStatus = false;
          lead.status = this.statusLeadUpdate.value;
          lead.leadstatus_id = this.statusLeadUpdate.id;
          this.showGenericToast({});
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
    },
    async activeEditionStatusLead() {
      try {
        console.log(this.G_STATUS_LEADS);
        const response = await this.A_GET_STATUS_LEADS();

        console.log(response);
      } catch (error) {
        throw error;
      }
    },
    async filterSelectChange(type) {
      try {
        const index = this.filter.map((el) => el.typeEvent).indexOf(type);

        let status =
          this.filter[index].model == null ? "1" : this.filter[index].model;

        const response = await this.A_GET_OWNERS({
          modul: this.currentUser.modul_id,
          body: { roles: "[1,2,5]", type: status },
        });

        if (response.status == 200) {
          const owners = response.data.map((el) => ({
            label: el.user_name,
            value: el.id,
          }));

          this.filter[index - 1].options = owners;
          this.filter[index - 1].model = null;
        }
      } catch (error) {
        console.log("Something went wrong getOwners:", error);
        this.showToast({
          variant: "danger",
          title: "Oop!",
          icon: "AlertOctagonIcon",
          text: this.getInternalErrors(error),
        });
      }
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

        let filterPrograms =
          this.filter[8].model != null ? this.filter[8].model.toString() : "";
        let filterSourceName =
          this.filter[10].model != null ? this.filter[10].model.toString() : "";

        await this.A_GET_LEADS({
          assign_to: this.filter[5].model,
          status_catcher: this.filter[6].model,
          cr: this.filter[7].model,
          date_from: this.filter[0].model,
          date_to: this.filter[1].model,
          idrole: 1,
          iduser: 1,
          lead_status: this.filter[2].model,
          name_text: this.filterPrincipal.model,
          order: "desc",
          orderby: 10,
          program: filterPrograms,
          sourcename: filterSourceName,
          state_h: this.filter[9].model,
          typedoc: this.filter[11].model,
          user_owner: this.filter[3].model,
          status_owner: this.filter[4].model,
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
    setOptionsOnFilters() {
      this.filter[2].options = this.G_STATUS_LEADS;
      this.filter[3].options = this.G_OWNERS;

      this.filter[4].options = [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ];

      this.filter[5].options = this.G_OWNERS;

      this.filter[6].options = [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ];

      this.filter[7].options = this.G_CRS;
      this.filter[8].options = this.G_PROGRAMS;
      this.filter[9].options = this.G_STATES;
      this.filter[10].options = this.G_SOURCE_NAMES;
      this.filter[11].options = this.G_TYPE_DOCS;
    },
    onChangeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.myProvider();
    },
    setFilters() {
      this.A_SET_FILTERS_LEADS({
        from: this.filter[0].model,
        to: this.filter[1].model,
        statusLead: this.filter[2].model,
        owner: this.filter[3].model,
        assignTo: this.filter[5].model,
        cr: this.filter[7].model,
        program: this.filter[8].model,
        stAd: this.filter[9].model,
        sourceName: this.filter[10].model,
        typeDoc: this.filter[11].model,
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
    modalSmsOpen(item) {
      this.rowData = item;
      this.leads_sms = [];
      this.typesms = 1;
      this.leads_sms_o = [];
      this.leads_sms_o.push(item.id);
      this.name_leads_arr = [{ name: item.lead_name, id: item.id }];
      this.modalSms = true;
    },
    modalHistorySmsOpen(item) {
      this.historySms.id = item.id;
      this.historySms.leadName = item.lead_name;
      this.$bvModal.show("modal-history-sms");
    },
    modalSmssOpen() {
      this.typesms = 0;
      this.name_leads_arr = this.leadsSelecteds.map((el) => ({
        name: el.lead_name,
        id: el.id,
      }));
      this.leads_sms = this.leadsSelecteds.map((el) => el.id);
      this.modalSms = true;
    },
    modalSmsClose() {
      this.modalSms = false;
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
    if (![4].includes(this.currentUser.role_id) && !this.isOnlyLead) {
      this.fields.unshift({
        key: "selected",
        label: "",
        sortable: false,
      });
    }
    if ([1, 2].includes(this.currentUser.role_id) && this.type === 0)
      this.actionsOptions.push("delete");
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
    S_FILTER_DATA_LOADED(newVal){
      if (newVal) {
        this.setOptionsOnFilters();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.table-responsive > div {
  min-height: 15rem;
}

.mt-07 {
  margin-top: 7px;
}

.ml-07 {
  margin-left: 7px;
}
</style>