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
        @reload="getSocialNetworkLeads"
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

          <template #cell(lead_name)="data">
            <div style="white-space: pre-wrap;">
              <router-link :to="{ name: 'sn-dashboard-old-lead' }">
                {{ data.item.lead_name }}
              </router-link>
              <br />
              <small>{{ data.item.nickname }}</small>
            </div>
          </template>

          <template #cell(state_hour)="data">
            <div>
              {{
                data.item.state_hour != "CA" && data.item.state_hour != "TX"
                  ? "UNK"
                  : data.item.state_hour
              }}
            </div>
          </template>

          <template #cell(last_action)="data">
            <div>
              <small
                :class="
                  data.item.n_last_action == 1
                    ? 'text-success'
                    : data.item.n_last_action == 3
                    ? 'text-warning'
                    : 'text-danger'
                "
              >
                {{ data.item.last_action }}
              </small>
            </div>
          </template>

          <template #cell(status)="data">
            <div>
              <b-badge
                pill
                :variant="data.item.status | variant"
                class="text-capitalize"
              >
                {{ data.item.status }}
              </b-badge>
            </div>
          </template>

          <template #cell(program)="data">
            <div>
              <b-img
                :src="data.item.program_name | renderProgramLogo"
                style="height: 40px"
              />
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
              <span class="text-capitalize text-success" v-if="data.item.attend == 2"> YES 
                <feather-icon
                  icon="CheckCircleIcon"
                  size="15"
                  class="mr-50 text-success"
                />
              </span>
              <span class="text-capitalize text-success" v-else-if="data.item.attend == 1"> YES </span>
              <span class="text-capitalize text-danger" v-else-if="data.item.attend == null"> NO </span>
              <div v-if="data.item.seller_name != null"> {{ data.item.seller_name }} </div>
              <div v-if="data.item.attend_date != null"> {{ data.item.attend_date | myGlobalDay }} </div>
              <div v-if="data.item.real_time != null && data.item.state_hour != 'CA'"> {{ data.item.real_time | myGlobalDay }} {{ data.item.state_hour }}</div>
            </div>
          </template>

          <!-- Column: Created Date -->
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
                  @click="openModalTracking(data.item.id, data.item.nickname)"
                />
            </div>
          </template>

          <template #cell(actions)="data">
            <actions-table
              :id="data.item.id"
              :name="data.item.nickname"
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

export default {
  components: {
    "modal-tracking": ModalTracking,
    "actions-table": ActionsTable,
  },
  data() {
    return{
      filters: dataFilters,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Search...",
        model: ""
      },
      totalLeads: 0,
      paginate: {
        currentPage: 1,
        perPage: 10
      },
      fromPage: 0,
      toPage: 0,
      sortBy: "id",
      fields: Fields,
      isSortDirDesc: true,
      isBusy: false,
      showModalTracking: false,
      nameLeadSelected: "",
    }
    
  },
  computed: {
    ...mapState({
      S_LEADS: (state) => state.SocialNetworkLeadsStore.S_LEADS,
    }),
    ...mapState('auth',['currentUser']),
  },
  created() {
    this.getSocialNetworkLeads();
  },
  methods: {
    ...mapActions('SocialNetworkLeadsStore', ['A_GET_OLD_LEADS', 'A_SET_FILTERS', 'A_GET_TRACKING_NEW_LEADS', 'A_DELETE_LEAD']),
    async getSocialNetworkLeads() {
      try {
        this.isBusy = true;
        this.setFilters();
        const response = await this.A_GET_OLD_LEADS({
          name_text: null,
          lead_status: null,
          cr: null,
          program: null,
          date_from: this.filters[0].model,
          date_to: this.filters[1].model,
          orderby: 10,
          order: "desc",
          user_owner: null,
          iduser: 1,
          idrole: 1,
          type: 1,
          last_action: null,
          fanpage: null,
          state_h: null,
          sourcename: null,
          subsource: null,
          type_document: null,
          perpage: this.paginate.perPage,
          page: this.paginate.currentPage
        });
        this.totalLeads = response.total;
        this.fromPage = response.from;
        this.toPage = response.to;
        this.isBusy = false;
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
    onChangeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.getSocialNetworkLeads();
    },
    setFilters() {
      this.A_SET_FILTERS({
        from: this.filters[0].model,
        to: this.filters[1].model,
      });
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
    async deleteLead(id) {
      const result = await this.showConfirmSwal(
        "Are you sure?",
        "You won't be able to revert this!",
        "question"
      )
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
  },
  mounted() {
    if ([1, 2].includes(this.currentUser.role_id) && this.type === 0)
      this.actionsOptions.push("delete");
  }
}
</script>