<template>
  <div>
    <b-card no-body class="mb-1">
      <filter-slot
        :filter="filter"
        :filter-principal="filterPrincipal"
        :total-rows="totalRows"
        :no-visible-principal-filter="true"
        :paginate="paginate"
        :start-page="startPage"
        :to-page="toPage"
        :send-multiple-sms="false"
        @reload="$refs['refClientsList'].refresh()"
      >
        <template #buttons-filter>
          <ModalCreateRecoveryList :userCreateModal="userCreateModal" @closeModalRecovery="closeModalRecovery"/>
        </template>
        <b-table
          slot="table"
          no-provider-filtering
          ref="refClientsList"
          :items="getDateRecovery"
          :fields="arrayColumns"
          primary-key="id"
          table-class="text-nowrap"
          responsive="sm"
          show-empty
          sticky-header="50vh"
          :busy.sync="isBusy"
          :current-page="paginate.currentPage"
          :per-page="paginate.perPage"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1"></b-spinner>
              <strong>Loading ...</strong>
            </div>
          </template>
          <!-- COLUMN NAME LEAD -->

          <template #cell(user_name)="data">
            <div
              class="d-flex flex-column justify-content-start align-items-start"
            >
              <!-- Route To Lead Show -->
              <span @click="clickNameUSer(data.item.user_name, data.item.user_id, data.item.created_at)"
                    class="click-user-recovery-list"
                    :class="textLink"
              >
                {{ data.item.user_name }}
              </span>
            </div>
          </template>
          <!-- COLUMN CREATE DATE -->
          <template #cell(created_at)="data">
            <div
              class="d-flex flex-column justify-content-start align-items-start"
            >
              <span>{{ data.item.created_at | myGlobalDay }}</span>
            </div>
          </template>
          <!-- COLUMN LEAD CREATED AT -->
          <template #cell(t1)="data">
            <div
              class="d-flex align-items-center justify-content-center"
            >
              <span class="click-user-recovery-list" :class="textLink" @click="clickNameUSer(data.item.user_name, data.item.user_id, data.item.created_at)">{{ data.item.t1 }}</span>
            </div>
          </template>
          <!-- COLUMN DONE -->
          <template #cell(pending)="data">
            <div
              class="d-flex flex-column justify-content-center align-items-center"
            >
              <span>{{ data.item.pending }}</span>
            </div>
          </template>
          <template #cell(done)="data">
            <div
                class="d-flex flex-column justify-content-center align-items-center"
            >
              <span>{{ data.item.done }}</span>
            </div>
          </template>
          <template #cell(status)="data">
            <div
                class="d-flex flex-column justify-content-center align-items-center"
            >
              <b-badge class="w-75" variant="success" v-if="data.item.status">
                DONE
              </b-badge>
              <b-badge class="w-75" variant="danger" v-else>
                PENDING
              </b-badge>
            </div>
          </template>

          <template #custom-foot>
            <b-tr>
              <b-th v-if="(isCeo || isSupervisor || isTeamLeader)" class="">NAME USER</b-th>
              <b-th class="">DATE</b-th>
              <b-th class="text-center">{{ totalSum.total }}</b-th>
              <b-th class="text-center">{{ totalSum.pending }}</b-th>
              <b-th class="text-center">{{ totalSum.done }}</b-th>
              <b-th class="text-center">STATUS</b-th>
            </b-tr>
          </template>
        </b-table>
      </filter-slot>
    </b-card>
    <b-modal
        size="lg"
        :title="`RECOVERY LIST / ${userSelect ? userSelect.name : null} / ${userSelect ? `${userSelect.date.split('-')[1]}-${userSelect.date.split('-')[2]}-${userSelect.date.split('-')[0]}` : null}`"
        v-model="openModal"
        body-class="p-0"
        @hidden="closeModalRecovery"
    >
      <TableListLeadsByUser :user="userSelect"/>
    </b-modal>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"
// Import Filter
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue"
// Import Service
import RecoveryListService from "../service/recovery.list.service"
// Import Data
import fields from "../data/fields.recovery.list.data"
import filtersList from "../data/filters.recovery.list.data"
import TableListLeadsByUser from "@/views/social-network/views/recovery-list/components/TableListLeadsByUser";
import ModalCreateRecoveryList from "@/views/social-network/views/recovery-list/components/ModalCreateRecoveryList";
export default {
  components: {
    ModalCreateRecoveryList,
    TableListLeadsByUser,
    FilterSlot,
  },
  props: {
    programId: {
      type: [Number, String],
    },
    userId: {
      type: [Number, String],
    },

  },
  data() {
    return {
      filter: filtersList,
      arrayColumns: [],
      totalRows: 0,
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      startPage: null,
      toPage: null,
      isBusy: false,
      sortBy: "created_at",
      sortDesc: true,
      searchInput: "",
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: "",
      },
      countPendingTask: 0,
      countDoneTask: 0,
      data: [],
      openModal: false,
      userSelect: null,
      totalSum: {
        total: 0,
        pending: 0,
        done: 0
      },
      userCreateModal: []
    }
  },
  async mounted() {
    if((this.isCeo || this.isSupervisor || this.isTeamLeader)){
      this.arrayColumns = fields
    } else {
      this.arrayColumns = fields.filter(item => item.key != 'user_name')
    }

    const { data } = await RecoveryListService.getUserOfRecoveryList();
    this.userCreateModal = data;
    const owners = data.map(owner => {
      return {
        label: owner.fullName,
        value: owner.id,
      }
    }).filter(item => item.value === this.currentUser.user_id || this.isCeo || this.isSupervisor || this.isTeamLeader)
    owners.unshift({ label: "All", value: null },)
    this.filter[2].options = owners


  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_LANGUAGES: "CrmGlobalStore/G_LANGUAGES",
    }),
    statusUserRedirected() {
      return this.userId != null ? true : false
    },
    clientRoute(){
      return "/social-network/recovery-list/search-recovery-by-user"
    },
  },
  methods: {
    ...mapActions(
        'SocialNetworkLeadsStore',
        [
          'A_GET_OWNERS',
        ]
    ),
    clickNameUSer(name, id, date) {
      this.openModal = true;
      this.userSelect = {
        name, id, date
      };
    },
    async getDateRecovery(ctx) {
      const resp1 = await RecoveryListService.getRecoveryListByUser({
        perpage: ctx.perPage,
        npage: ctx.currentPage,
        user_id:  (this.isCeo || this.isSupervisor || this.isTeamLeader) ? this.filter[2].model : this.currentUser.user_id,
        date_in: null,
        date_from: this.filter[0].model,
        date_to: this.filter[1].model,
        status: null,
        program_id: null,
        rol_id: 11,
        update_status: null,
        id_list: null
      })
      const resp = resp1[0];

      this.paginate.currentPage = resp.current_page
      this.paginate.perPage = resp.per_page
      this.perPage = resp.per_page
      this.nextPage = this.startPage + 1
      this.endPage = resp.last_page
      this.totalRows = resp.total
      this.toPage = resp.to
      this.totalSum.total = 0;
      this.totalSum.pending = 0;
      this.totalSum.done = 0;

      resp.data.forEach(item => {
        this.totalSum.total = this.totalSum.total + parseInt(item.t1);
        this.totalSum.pending = this.totalSum.pending + parseInt(item.pending)
        this.totalSum.done = this.totalSum.done + parseInt(item.done)
      })
      return resp.data || []
    },
    closeModalRecovery() {
      this.$refs['refClientsList'].refresh()
    },
    onChangeCurrentPage(e) {
      this.paginate.currentPage = e;
      this.getDateRecovery();
    },
  },
  watch: {

  }
}
</script>

<style lang="scss">
.click-user-recovery-list{
  transition: .1s color ease-in-out;
  cursor: pointer;
  &:hover{
    font-weight: 600 !important;
  }
}
</style>