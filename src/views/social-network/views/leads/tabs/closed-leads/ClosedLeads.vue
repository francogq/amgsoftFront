<template>
  <div>
    <!-- Table Container Card -->
    <b-card no-body class="mb-0">
      <filter-slot
        v-scrollbar
        :filter="filters"
        :filter-principal="filterPrincipal"
        :total-rows="totalLeads"
        :paginate="paginate"
        :start-page="fromPage"
        :to-page="toPage"
        :send-multiple-sms="false"
        @reload="getSocialNetworkLeadsClosed"
        @onChangeCurrentPage="onChangeCurrentPage"
      >
        <b-table
          slot="table"
          class="position-relative"
          ref="refUserListTable"
          primary-key="id"
          empty-text="No matching records found"
          select-mode="multi"
          responsive="sm"
          table-class="text-nowrap"
          sticky-header="50vh"
          small
          show-empty
          :sort-by.sync="sortBy"
          :fields="fields"
          :items="S_LEADS.items"
          :sort-desc.sync="isSortDirDesc"
          :busy.sync="isBusy"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>

          <template #cell(nickname)="data">
            <div style="white-space: pre-wrap">
              <router-link
                :class="textLink"
                :to="`/social-network/leads/new/dashboard/${data.item.id}`"
                target="_blank"
                >{{ data.item.nickname
                    ? data.item.nickname
                    : data.item.not_nickname }}</router-link
              >
              <br />
              {{ data.item.lead_name }}
            </div>
          </template>

          <template #cell(source)="data">
            <div>
              <b-img
                fluid
                :src="baseUrl + '/images/social-network/facebook.png'"
                style="width: 30px"
                v-if="data.item.sourcesname_id == 17"
              />
              <b-img
                fluid
                :src="baseUrl + '/images/social-network/google.png'"
                style="width: 30px"
                v-if="data.item.sourcesname_id == 32"
              />
            </div>
          </template>

          <template #cell(status)="data">
            <div>
              <b-badge
                :variant="`light-${resolveLeadSnStatusVariant(
                  data.item.status_sn_id
                )}`"
                class="text-capitalize w-100"
              >
                {{ data.item.status }}
              </b-badge>
            </div>
          </template>

          <template #cell(program)="data">
            <div>
              <b-img
                thumbnail
                fluid
                :src="baseUrl + data.item.logo"
                style="width: 50px"
                v-if="data.item.logo"
              />
                <b-badge variant="primary" v-else style="width: 40px">
                  CRM
                </b-badge>
            </div>
          </template>

          <template #cell(recomendations)="data">
            <div>
              <small
                v-for="(program, index) in JSON.parse(data.item.programs)"
                :key="index"
              >
                {{ program }} <br />
              </small>
            </div>
          </template>

          <!-- Column: Created Date -->
          <template #cell(owner)="data">
            <small>{{ data.item.owner }}</small>
            <br />
            <small>{{ data.item.created_at | myGlobalDay }}</small>
          </template>

          <!-- Column: Tracking -->
          <template #cell(tracking)="data">
            <div class="text-center">
              <feather-icon
                icon="ListIcon"
                size="15"
                class="text-primary cursor-pointer"
                @click="openModalTracking(data.item.id, data.item.nickname)"
              />
            </div>
          </template>

          <template #cell(actions)="data">
            <actions-table
              :id="data.item.id"
              @onProcessLead="onProcessLead"
              @onDeleteLead="deleteLead"
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
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import dataFilters from "./filters.data";
import Fields from "./fields.data";

// Components
import ModalTracking from "../../components/ModalTracking.vue";
import ActionsTable from "./components/ActionsTable.vue";
import helpers from "@/views/social-network/helpers";
export default {
  components: {
    "modal-tracking": ModalTracking,
    "actions-table": ActionsTable,
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL_ASSETS,
      filters: dataFilters,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Search...",
        model: "",
      },
      totalLeads: 0,
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      fromPage: 0,
      toPage: 0,
      sortBy: "id",
      fields: Fields,
      isSortDirDesc: true,
      isBusy: false,
      showModalTracking: false,
      nameLeadSelected: "",
      programs: [],
    };
  },
  computed: {
    ...mapState("SocialNetworkLeadsStore", [
      "S_LEADS",
      "S_LEADS_COUNT_CLOSED_COUNTER",
      "S_FAN_PAGE_PROGRAMS_FILTERS",
      "S_SELLERS_FILTERS",
    ]),
    ...mapState("auth", ["currentUser"]),
  },
  created() {
    this.setOptionsOnFilters();
  },
  methods: {
    ...helpers,
    ...mapActions("SocialNetworkLeadsStore", [
      "A_SET_FILTERS",
      "A_GET_NEW_LEADS",
      "A_GET_TRACKING_NEW_LEADS",
      "A_DELETE_LEAD",
      "A_GET_FAN_PAGE_PROGRAMS_FILTERS",
      "A_GET_FILTER_SELLERS",
    ]),
    ...mapActions("CrmLeadStore", ["A_PROCESS_LEADS"]),
    ...mapMutations("SocialNetworkLeadsStore", [
      "REMOVE_LEAD_DATA",
      "SET_DATA",
    ]),

    async getSocialNetworkLeadsClosed() {
      try {
        this.isBusy = true;
        this.setFilters();
        const response = await this.A_GET_NEW_LEADS({
          name_text: this.filterPrincipal.model,
          lead_status: null,
          cr: null,
          program: null,
          date_from: this.filters[0].model,
          date_to: this.filters[1].model,
          orderby: 10,
          order: "desc",
          user_owner: this.filters[4].model,
          iduser: this.currentUser.user_id,
          idrole: this.currentUser.role_id,
          user_catcher: null,
          fanpage: this.filters[2].model,
          type: 2,
          sourcename: this.filters[3].model,
          perpage: this.paginate.perPage,
          page: this.paginate.currentPage,
        });
        this.totalLeads = response.total;
        this.fromPage = response.from;
        this.toPage = response.to;
        this.isBusy = false;
      } catch (error) {
        console.log("Somtehing went wrong getSocialNetworkLeadsClosed", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
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

    onProcessLead(lead_id, status) {
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
              lead_id: lead_id,
              status: status,
              user_id,
              description: result.value,
            });
            if (this.isResponseSuccess(response)) {
              await this.REMOVE_LEAD_DATA({
                destination: "S_LEADS",
                id: lead_id,
              });
              this.SET_DATA({
                destination: "S_LEADS_COUNT_CLOSED_COUNTER",
                data: this.S_LEADS_COUNT_CLOSED_COUNTER - 1,
              });
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

    onChangeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.getSocialNetworkLeadsClosed();
    },
    setFilters() {
      this.A_SET_FILTERS({
        from: this.filters[0].model,
        to: this.filters[1].model,
      });
    },

    async setOptionsOnFilters() {
      await Promise.all([
        this.A_GET_FAN_PAGE_PROGRAMS_FILTERS(),
        this.A_GET_FILTER_SELLERS({ moduleId: 15, roles: "[]" }),
      ]);
      this.filters[2].options = this.S_FAN_PAGE_PROGRAMS_FILTERS;
      this.filters[4].options = this.S_SELLERS_FILTERS;
    },
    resolveLeadSnStatusVariant(status) {
      if (status === 2) return "success";
      if ([3, 4].includes(status)) return "primary";
      if (status === 5) return "secondary";
      if (status === 6) return "warning";
      if (status === 7) return "danger";
      return "primary";
    },
  },
  mounted() {
    if ([1, 2].includes(this.currentUser.role_id) && this.type === 0)
      this.actionsOptions.push("delete");
  },
};
</script>