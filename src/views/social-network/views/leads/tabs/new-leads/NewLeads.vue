<template>
  <div>
    <!-- Table Container Card -->
    <b-card no-body class="mb-0">
      <filter-slot
        v-scrollbar
        :filter="filter"
        :filter-principal="filterPrincipal"
        :total-rows="S_LEADS.total"
        :paginate="paginate"
        :start-page="S_LEADS.fromPage"
        :to-page="S_LEADS.toPage"
        :send-multiple-sms="false"
        @reload="getSocialNetworkLeads"
        @onChangeCurrentPage="onChangeCurrentPage"
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
        </template>

        <b-table
          slot="table"
          ref="refUserListTable"
          class="position-relative font-small-3"
          primary-key="id"
          empty-text="No matching records found"
          select-mode="multi"
          responsive="sm"
          table-class="text-nowrap"
          sticky-header="73vh"
          small
          show-empty
          :sort-by.sync="sortBy"
          :fields="fields"
          :items="S_LEADS.items"
          :sort-desc.sync="isSortDirDesc"
          :busy.sync="S_BUSY_NEW_LEADS"
          @row-selected="onRowSelected"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>

          <template #head(selected)>
            <b-form-checkbox v-model="selectAll" @input="selectedAll" />
          </template>

          <!-- Column: Selected -->
          <template #cell(selected)="data">
            <b-form-group v-if="data.item.mobile">
              <b-form-checkbox
                v-model="data.item.selected"
                @input="onSelectedRow(data.item)"
              />
            </b-form-group>
          </template>

          <!-- Column: Name -->
          <template #cell(nickname)="data">
            <div style="white-space: pre-wrap">
              <router-link
                :class="textLink"
                :to="`/social-network/leads/new/dashboard/${data.item.id}`"
                target="_blank"
                >
                {{ data.item.nickname ? data.item.nickname : data.item.not_nickname }}
              </router-link>
              <br />
              <span>{{ data.item.lead_name }}</span>
            </div>
          </template>
          <template #cell(source)="data">
            <div>
              <div
                v-if="data.item.parent == 1"
                class="text-center d-flex flex-column align-items-center"
              >
                <b-img
                  fluid
                  :src="baseUrl + '/images/social-network/facebook.png'"
                  style="width: 30px"
                />
                <span class="mt-1">
                  {{ data.item.child }}
                </span>
              </div>
              <div
                v-if="data.item.parent == 2"
                class="text-center d-flex flex-column align-items-center"
              >
                <b-img
                  fluid
                  :src="baseUrl + '/images/social-network/google.png'"
                  style="width: 30px"
                />
                <span class="mt-1">
                  {{ String(data.item.contact_method).toUpperCase() }}
                </span>
              </div>
            </div>
          </template>

          <!-- Column: Fanpage -->
          <template #cell(fanpage)="data">
            <b-img
              thumbnail
              fluid
              :src="baseUrl + data.item.logo"
              style="width: 50px"
              v-if="data.item.logo"
            />
            <b-badge variant="primary" v-else style="width: 50px">
              CRM
            </b-badge>
          </template>

          <!-- Column: Task -->
          <template #cell(attend)="data">
            <div>
              <span
                class="text-capitalize text-success"
                v-if="data.item.attend == 2"
              >
                YES
                <feather-icon
                  icon="CheckCircleIcon"
                  size="15"
                  class="mr-50 text-success"
                />
              </span>
              <span
                class="text-capitalize text-success"
                v-else-if="data.item.attend == 1"
              >
                YES
              </span>
              <span
                class="text-capitalize text-danger"
                v-else-if="data.item.attend == null"
              >
                NO
              </span>
              <div v-if="data.item.seller_name != null">
                {{ data.item.seller_name }}
              </div>
              <div v-if="data.item.attend_date != null">
                {{ data.item.attend_date | myGlobalDay }}
              </div>
              <div
                v-if="
                  data.item.real_time != null && data.item.state_hour != 'CA'
                "
              >
                {{ data.item.real_time | myGlobalDay }}
                {{ data.item.state_hour }}
              </div>
            </div>
          </template>
          <template #cell(credit_report)="data">
            <span
              :class="
                data.item.credit_report == '1' ? 'text-danger' : 'text-success'
              "
            >
              {{ data.item.credit_report == "1" ? "NO" : "YES" }}
            </span>
          </template>
          <template #cell(sale_lead_status)="data">
            <b-badge
              :variant="data.item.sale_status == 1 ? 'info' : 'success'"
              class="w-100"
              v-if="data.item.sale_lead_status"
            >
              {{ data.item.sale_lead_status }}
            </b-badge> </template
          ><!-- Column: Created Date -->
          <template #cell(created_at)="data">
            <small>{{ data.item.created_at | myGlobalDay }}</small>
          </template>

          <!-- Column: Tracking -->
          <template #cell(tracking)="data">
            <div class="text-center">
              <feather-icon
                icon="ListIcon"
                size="15"
                class="text-primary cursor-pointer"
                @click="openModalTracking(data.item.id, (data.item.nickname
                    ? data.item.nickname
                    : data.item.not_nickname))"
              />
            </div>
          </template>

          <template #cell(actions)="data">
            <actions-table
              :id="data.item.id"
              :name="(data.item.nickname
                    ? data.item.nickname
                    : data.item.not_nickname)"
              :statusLead="data.item.status_sn_id"
              @onSendToRecovery="onProcessLead"
              @onSendToClosed="onProcessLead"
              @onDeleteLead="deleteLead"
              @onShowSmsList="openModalSmsList"
              @onSendSms="openModalSendSMS(data.item)"
            ></actions-table>
          </template>
        </b-table>
      </filter-slot>
    </b-card>

    <modal-tracking
      v-if="showModalTracking"
      :show="showModalTracking"
      :name="nameLeadSelected"
      @onClose="closeModalTracking"
    ></modal-tracking>

    <modal-sms-list
      v-if="showModalSmsList"
      :show="showModalSmsList"
      :name="nameLeadSelected"
      @onClose="closeModalSmsList"
    ></modal-sms-list>

    <modal-send-sms
      v-if="sendModalSms"
      :smss="leads_sms"
      :modul="currentUser.modul_id"
      :show="sendModalSms"
      :typesms="typesms"
      :sms="leads_sms_o"
      :name-leads="name_leads_arr"
      @hide="closeModalSendSms"
    >
    </modal-send-sms>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations} from "vuex";

import dataFields from "./fields.data";
import dataFilters from "./filters.data";
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";

// Components
import ModalTracking from "../../components/ModalTracking.vue";
import ActionsTable from "./components/ActionsTable.vue";
import ModalSmsList from "../../components/ModalSmsList.vue";
import ModalSendSms from "@/views/crm/views/Lead/lead-sms/ModalSendSms.vue";
import helpers from "@/views/social-network/helpers";
export default {
  components: {
    "filter-slot": FilterSlot,
    "modal-tracking": ModalTracking,
    "actions-table": ActionsTable,
    "modal-sms-list": ModalSmsList,
    "modal-send-sms": ModalSendSms,
  },
  data() {
    return {
      advanceSearch: false,
      baseUrl: process.env.VUE_APP_BASE_URL_ASSETS,

      isBusy: false,
      fields: dataFields,
      filter: dataFilters,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Search...",
        model: "",
      },
      totalLeads: 0,
      fromPage: 0,
      toPage: 0,
      paginate: {
        currentPage: 1,
        perPage: "50",
      },
      perPageOptions: [10, 25, 50, 100],
      sortBy: "id",
      isSortDirDesc: true,
      showModalTracking: false,
      nameLeadSelected: "",
      showModalSmsList: false,
      sendModalSms: false,
      rowData: [],
      typesms: null,
      leads_sms_o: [],
      name_leads_arr: [],
      selectAll: false,
      leadsSelecteds: [],
    };
  },
  computed: {
    ...mapGetters("CrmGlobalStore", ["G_PROGRAMS"]),
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_STATUS_LEADS: "CrmLeadStore/G_STATUS_LEADS",
      G_OWNERS: "CrmGlobalStore/G_OWNERS",
      // G_PROGRAMS: "CrmGlobalStore/G_PROGRAMS",
      G_SOURCE_NAMES: "CrmGlobalStore/G_SOURCE_NAMES",
      G_STATES: "CrmGlobalStore/G_STATES",
      G_CRS: "CrmGlobalStore/G_CRS",
      G_TYPE_DOCS: "CrmGlobalStore/G_TYPE_DOCS",
    }),
    ...mapState("SocialNetworkLeadsStore", ["S_BUSY_NEW_LEADS", "S_LEADS"]),
    ...mapState({
      S_LEADS: (state) => state.SocialNetworkLeadsStore.S_LEADS,
      S_STATES_LEADS: (state) => state.SocialNetworkLeadsStore.S_STATES_LEADS,
      S_LEAD_STATUS_SN: (state) =>
        state.SocialNetworkLeadsStore.S_LEAD_STATUS_SN,
      S_FAN_PAGE_PROGRAMS_FILTERS: (state) =>
        state.SocialNetworkLeadsStore.S_FAN_PAGE_PROGRAMS_FILTERS,
      S_SELLERS_FILTERS: (state) =>
        state.SocialNetworkLeadsStore.S_SELLERS_FILTERS,
      S_SUB_SOURCES_FILTERS: (state) =>
        state.SocialNetworkLeadsStore.S_SUB_SOURCES_FILTERS,
      sourceFilter() {
        return this.filter[5].model;
      },
    }),
    routeModule() {
      return this.$route.meta.route;
    },
    moduleId() {
      return this.$route.meta.module;
    },
  },
  created() {
    this.setOptionsOnFilters();
  },
  methods: {
    ...helpers,
    ...mapActions("SocialNetworkLeadsStore", [
      "A_DELETE_LEAD",
      "A_GET_STATE_LEAD",
      "A_GET_NEW_LEADS",
      "A_GET_TRACKING_NEW_LEADS",
      "A_GET_SMS_SENT_TO_NEW_LEADS",
      "A_GET_STATUS_LEAD",
      "A_GET_FAN_PAGE_PROGRAMS_FILTERS",
      "A_GET_FILTER_SELLERS",
      "A_GET_SUB_SOURCES_FILTERS",
    ]),
    ...mapActions("CrmLeadStore", [
      "A_SET_FILTERS_LEADS",
      "A_SET_SELECTED_LEADS",
      "A_PROCESS_LEADS"
    ]),
    ...mapMutations('SocialNetworkLeadsStore', ['REMOVE_LEAD_DATA']),
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

    onRowSelected() {
      this.A_SET_SELECTED_LEADS(this.leadsSelecteds);
    },

    modalSmssOpen() {
      this.typesms = 0;
      this.name_leads_arr = this.leadsSelecteds.map((el) => ({
        name: el.nickname,
        id: el.id,
      }));
      this.leads_sms = this.leadsSelecteds.map((el) => el.id);
      this.sendModalSms = true;
    },

    async openModalTracking(id, name) {
      await this.A_GET_TRACKING_NEW_LEADS({
        lead_id: id,
      });
      this.nameLeadSelected = name;
      this.showModalTracking = true;
    },
    closeModalTracking() {
      this.showModalTracking = false;
    },
    async openModalSendSMS(item) {
      this.rowData = item;
      this.leads_sms = [];
      this.typesms = 1;
      this.leads_sms_o = [];
      this.leads_sms_o.push(item.id);
      this.name_leads_arr = [{ name: item.nickname, id: item.id }];
      this.sendModalSms = true;
    },
    closeModalSendSms(value) {
      this.sendModalSms = value;
    },
    async deleteLead(id) {
      const result = await this.showConfirmSwal(
        "Are you sure?",
        "You won't be able to revert this!",
        "question"
      );
      if (result.value) {
        const { user_id } = this.currentUser;
        const response = await this.A_DELETE_LEAD({
          lead_id: id,
          user_id: user_id,
        });

        if (this.isResponseSuccess(response)) {
          this.showToast(
            "success",
            "top-right",
            "Deleted!",
            "CheckIcon",
            "Your file has been deleted."
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
    },
    async openModalSmsList(id, name) {
      await this.A_GET_SMS_SENT_TO_NEW_LEADS({
        id: id,
      });

      this.nameLeadSelected = name;
      this.showModalSmsList = true;
    },
    closeModalSmsList() {
      this.showModalSmsList = false;
    },
    async getSocialNetworkLeads() {
      try {
        const response = await this.A_GET_NEW_LEADS({
          cr: this.filter[2].model,
          date_from: this.filter[0].model,
          date_to: this.filter[1].model,
          lead_status: this.filter[3].model,
          name_text: this.filterPrincipal.model,
          sourcename: this.filter[5].model,
          task: this.filter[9].model,
          type_document: this.filter[11].model,
          order: "desc",
          orderby: 10,
          fanpage: this.filter[4].model,
          state_h: this.filter[10].model,
          type: 1,
          user_owner: this.filter[8].model,
          perpage: this.paginate.perPage,
          page: this.paginate.currentPage,
          subsource:
            this.filter[5].model == 1
              ? this.filter[6].model
              : this.filter[7].model,
        });
        this.totalLeads = response.total;
        this.fromPage = response.from;
        this.toPage = response.to;
      } catch (error) {
        console.log("Somtehing went wrong getSocialNetworkLeads", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },

    onProcessLead(lead_id, status) {
      this.showConfirmSwal(
          "Are you sure?",
          "You won't be able to revert this!",
          {
            input: "textarea",
            inputValidator: value => {
              if (!value) {
                return "You need to write something!";
              }
            }
          }
      )
          .then(async result => {
            if (result.value) {
              const { user_id, role_id } = this.currentUser;
              const response = await this.A_PROCESS_LEADS({
                lead_id: lead_id,
                status: status,
                user_id,
                description: result.value
              });
              if (this.isResponseSuccess(response)) {
                await this.REMOVE_LEAD_DATA({destination: "S_LEADS", id: lead_id})
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
          .catch(error => {
            console.log("Something went wrong onRowProcess:", error);
            this.showErrorSwal(error);
          });
    },
    
    async setOptionsOnFilters() {
      await Promise.all([
        this.A_GET_STATE_LEAD(),
        this.A_GET_STATUS_LEAD("leads"),
        this.A_GET_FAN_PAGE_PROGRAMS_FILTERS(),
        this.A_GET_FILTER_SELLERS({ moduleId: 15, roles: "[]" }),
      ]);
      // this.filter[2].options = this.G_STATUS_LEADS;
      this.filter[3].options = this.S_LEAD_STATUS_SN;
      this.filter[4].options = this.S_FAN_PAGE_PROGRAMS_FILTERS;

      // this.filter[5].options = this.G_CRS;
      this.filter[8].options = this.S_SELLERS_FILTERS;
      // this.filter[7].options = this.G_STATES;
      this.filter[10].options = this.S_STATES_LEADS;
      // this.filter[9].options = this.G_TYPE_DOCS;
    },
    onChangeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.getSocialNetworkLeads();
    },
  },
  mounted() {
    if ([1, 2].includes(this.currentUser.role_id) && this.type === 0)
      this.actionsOptions.push("delete");
  },
  watch: {
    async sourceFilter(newValue) {
      if (newValue == 1 || newValue == 2) {
        if (newValue == 1) {
          await this.A_GET_SUB_SOURCES_FILTERS(newValue);
          this.$set(this.filter[6], "options", this.S_SUB_SOURCES_FILTERS);
          this.filter[6].visible = true;
          this.filter[7].options = [];
          this.filter[7].visible = false;
          this.filter[7].model = null;
        } else if (newValue == 2) {
          await this.A_GET_SUB_SOURCES_FILTERS(newValue);
          this.$set(this.filter[7], "options", this.S_SUB_SOURCES_FILTERS);
          this.filter[7].visible = true;
          this.filter[6].options = [];
          this.filter[6].visible = false;
          this.filter[6].model = null;
        }
      } else {
        this.filter[6].visible = false;
        this.filter[6].options = [];
        this.filter[6].model = null;
        this.filter[7].options = [];
        this.filter[7].visible = false;
        this.filter[7].model = null;
      }
    },
  },
};
</script>
