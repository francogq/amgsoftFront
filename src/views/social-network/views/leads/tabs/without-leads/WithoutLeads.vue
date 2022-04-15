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
        @reload="getSocialNetworkLeadsPotential"
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
          :items="S_W_POTENTIAL_LEADS"
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
                :to="`/social-network/leads/new/dashboard/${data.item.lead_id}`"
                target="_blank"
                >{{ data.item.nickname
                    ? data.item.nickname
                    : data.item.not_nickname }}</router-link
              >
              <br />
              <small>{{ data.item.lead_name }}</small>
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

          <!-- Column: Created Date -->
          <template #cell(created_at)="data">
            <small>{{ data.item.created_at | myGlobalDay }}</small>
          </template>

          <template #cell(actions)="data">
            <div>
              <span v-if="data.item.status_potential == 2">
                <template
                  v-if="currentUser.role_id == 1 || currentUser.role_id == 2"
                >
                  <b-button
                    variant="success"
                    size="sm"
                    @click="confirmPotential(data.item.lead_id, 3)"
                    >Yes</b-button
                  >
                  <b-button
                    variant="danger"
                    size="sm"
                    class="ml-1"
                    @click="confirmPotential(data.item.lead_id, 4)"
                    >No</b-button
                  >
                </template>
                <b-badge v-else variant="secondary">PENDING</b-badge>
              </span>
              <b-badge
                variant="primary"
                v-if="
                  data.item.status_potential == 1 ||
                  data.item.status_potential == 3
                "
                >YES</b-badge
              >
            </div>
          </template>
        </b-table>
      </filter-slot>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import dataFilters from "./filters.data";
import Fields from "./fields.data";
import helpers from "@/views/social-network/helpers";
export default {
  components: {
    //
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
    };
  },
  computed: {
    ...mapState({
      S_W_POTENTIAL_LEADS: (state) => state.CrmLeadStore.S_W_POTENTIAL_LEADS,
    }),
    ...mapState("SocialNetworkLeadsStore", ["S_SELLERS_FILTERS"]),
    ...mapState("SocialNetworkGlobalStore", ["S_STATES"]),
    ...mapState("auth", ["currentUser"]),
  },
  created() {
    this.setOptionsOnFilters();
  },
  methods: {
    ...helpers,
    ...mapActions("SocialNetworkLeadsStore", [
      "A_SET_FILTERS",
      "A_GET_FILTER_SELLERS",
    ]),
    ...mapActions("SocialNetworkGlobalStore", ["A_GET_STATES"]),
    ...mapActions("CrmLeadStore", [
      "A_GET_W_POTENTIAL_LEADS",
      "A_UPDATE_STATUS_POTENTIAL_SN",
    ]),
    ...mapMutations("CrmLeadStore", ["M_SET_ACTIONS_STATUS_POTENTIAL"]),
    async getSocialNetworkLeadsPotential() {
      try {
        this.isBusy = true;
        this.setFilters();
        const response = await this.A_GET_W_POTENTIAL_LEADS({
          name_text: this.filterPrincipal.model,
          lead_status: null,
          cr: null,
          program: null,
          date_from: this.filters[0].model,
          date_to: this.filters[1].model,
          orderby: 10,
          order: "desc",
          user_owner: this.filters[2].model,
          type: 3,
          lead_situation: 2,
          state_h: this.filters[4].model,
          sourcename: this.filters[3].model,
          reason_not: null,
          subsource: null,
          potential: 2,
          perpage: this.paginate.perPage,
          page: this.paginate.currentPage,
        });
        this.totalLeads = response.total;
        this.fromPage = response.from;
        this.toPage = response.to;
        this.isBusy = false;
      } catch (error) {
        console.log(
          "Somtehing went wrong getSocialNetworkLeadsPotential",
          error
        );
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
      this.getSocialNetworkLeadsPotential();
    },
    setFilters() {
      this.A_SET_FILTERS({
        from: this.filters[0].model,
        to: this.filters[1].model,
      });
    },
    async confirmPotential(lead_id, status_potential) {
      const result = await this.showConfirmSwal(
        "Are you sure?",
        "You won't be able to revert this!",
        "question"
      );
      if (result.value) {
        const response = await this.A_UPDATE_STATUS_POTENTIAL_SN({
          lead_id: lead_id,
          status_potential: status_potential,
        });
        if (this.isResponseSuccess(response)) {
          if (status_potential == 3) {
            await this.M_SET_ACTIONS_STATUS_POTENTIAL({
              lead_id: lead_id,
              status_potential: status_potential,
            });
          }
          this.showToast();
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

    async setOptionsOnFilters() {
      await Promise.all([
        this.A_GET_FILTER_SELLERS({ moduleId: 15, roles: "[]" }),
        this.A_GET_STATES({ type: 1 }),
      ]);
      this.filters[2].options = this.S_SELLERS_FILTERS;
      this.filters[4].options = this.S_STATES;
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