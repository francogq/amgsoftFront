<template>
  <div>
    <filter-slot
        :filter="filter"
        :filter-principal="filterPrincipal"
        :total-rows="totalRows"
        :no-visible-principal-filter="true"
        :paginate="paginate"
        :start-page="startPage"
        :to-page="toPage"
        :send-multiple-sms="false"
        @reload="$refs['refRecoveryByUser'].refresh()"
    >
      <template #buttons-filter>
        <div v-if="!(isCeo || isSupervisor || isTeamLeader)" class="d-flex align-items-center justify-content-between pl-2 pr-2">
          <b-button href="" class="botton-replay" v-if="btnRecoverySend" variant="success" @click="replay">SEND TO REVISSION</b-button>
        </div>
      </template>
      <b-table
          slot="table"
          no-provider-filtering
          :items="getDataRecoveryByUser"
          :fields="arrayColumns"
          ref="refRecoveryByUser"
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

        <template #cell(fullNameLead)="data">
          <div
              class="text-left"
          >
            <a :href="`/social-network/leads/new/dashboard/${data.item.id}`" target="_blank" class=" click-user-recovery-list" :class="textLink">{{ data.item.fullNameLead }}</a>
          </div>
        </template>

        <template #cell(created_at)="data">
          <div
              class="text-left"
          >
            <span>{{ data.item.created_at | myGlobalDay }}</span>
          </div>
        </template>

        <template #cell(program)="data">
          <div
              class="text-left"
          >
            <span>{{ data.item.program }}</span>
          </div>
        </template>

        <template #cell(status)="data">
          <StatusTableRecoveryListItem :item="data.item" :doneLeads="doneLeads" :totalStatus="totalStatus" :user="user" @updateStatusDone="updateStatusDone"/>
        </template>


        <template #custom-foot>
          <b-tr>
            <b-th class=""></b-th>
            <b-th class="text-center"></b-th>
            <b-th class="text-center"></b-th>
            <b-th class="text-center">TOTAL: {{ doneLeads }}</b-th>

          </b-tr>
        </template>
      </b-table>
    </filter-slot>
  </div>
</template>

<script>
import filtersList from "../data/filters-modal.recovery.list.data";
import RecoveryListService from "@/views/social-network/views/recovery-list/service/recovery.list.service";
import {mapActions, mapGetters} from "vuex";
import StatusTableRecoveryListItem
  from "@/views/social-network/views/recovery-list/components/StatusTableRecoveryListItem";

export default {
  name: 'TableListLeadsByUser',
  components: {StatusTableRecoveryListItem},
  data() {
    return {
      filter: filtersList,
      arrayColumns: [
        {
          key: "fullNameLead",
          label: "Lead",
          visible: true,
          class: 'text-left'
        },
        {
          key: "created_at",
          label: "Date",
          visible: true,
          class: 'text-left'
        },
        {
          key: "program",
          label: "Program",
          visible: true,
          class: 'text-left'
        },
        {
          key: "status",
          label: "Status",
          visible: true,
          class: 'text-center'
        },
      ],
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: "",
      },
      totalRows: 0,
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      startPage: null,
      toPage: null,
      isBusy: false,
      data: [],
      totalStatus: 0,
      doneLeads: 0,
      btnRecoverySend: false
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  async created() {
    await this.programsAll()
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_LANGUAGES: "CrmGlobalStore/G_LANGUAGES",
    }),
  },
  methods: {
    ...mapActions(
        'SocialNetworkLeadsStore',
        [
          'A_GET_PROGRAMS',
        ]
    ),
    linkLead(id) {
      this.$router.push(`/social-network/leads/new/dashboard/${id}`);
    },
    async getDataRecoveryByUser(ctx) {

      const from = this.filter[0].model ? this.filter[0].model.split('-') : null;
      const to = this.filter[1].model ? this.filter[1].model.split('-') : null;

      const resp1 = await RecoveryListService.getRecoveryListByUser({
        perpage: ctx.perPage,
        npage: ctx.currentPage,
        user_id: this.user.id,
        date_in: this.user.date,
        date_from: from ? `${from[0]}-${from[2]}-${from[1]}` : null,
        date_to: to ? `${to[0]}-${to[2]}-${to[1]}` : null,
        status: this.filter[2].model,
        program_id: this.filter[3].model,
        rol_id: 10,
        update_status: null,
        id_list: null
      })
      //this.doneLeads = resp1[1];
      this.doneLeads = resp1[1].status;
      this.totalStatus = resp1[1].count;
      const resp = resp1[0]
      this.data = resp.data;

      this.paginate.currentPage = resp.current_page
      this.paginate.perPage = resp.per_page
      this.perPage = resp.per_page
      this.nextPage = this.startPage + 1
      this.endPage = resp.last_page
      this.totalRows = resp.total
      this.toPage = resp.to

      //this.totalStatus = sum
      return resp.data;
    },
    async programsAll() {
      const data = (await this.A_GET_PROGRAMS()).map(item => {
        return {
          label: item.name,
          value: item.id
        }
      });
      data.unshift({ value: null, label: "All" })
      this.filter[3].options = data;
    },
    async onChangeStatus (lead) {
      let recovery_status = true;
      lead.status == 0 ? recovery_status = true : recovery_status = false;
      //recovery_status ? this.totalStatus++ : this.totalStatus--;
      const resp = await RecoveryListService.getRecoveryListByUser({
        perpage: 50,
        npage: 1,
        user_id: this.user.id,
        date_in: this.user.date,
        date_from: null,
        date_to: null,
        status: recovery_status,
        program_id: null,
        rol_id: 10,
        update_status: 1,
        id_list: lead.id
      })
      this.doneLeads = resp[1].status + 1;
      this.totalStatus = resp[1].count;
      //this.totalStatus, this.doneLeads

    },
    async replay() {

      const confirm = await this.showConfirmSwal(
          "Send to Team Leader",
          "You won't be able to revert this!"
      )
      if (confirm.isConfirmed) {
        try {
          let params = {
            id_user: this.currentUser.user_id,
            fullname: `${this.currentUser.first_name} ${this.currentUser.last_name}`,
            idProgram: this.data[0].programId,
            breakFreeList: this.data[0].updated_at
          }
          const data = await RecoveryListService.sendForPusher(params)
          this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Message sent successfully to Team Leader "
          )
        } catch (error) {
          this.showToast(
              "danger",
              "top-right",
              "Error",
              "XIcon",
              "Something went wrong with your message!"
          )
        }
      }
    },
    updateStatusDone({done, status}) {
      this.doneLeads = done;
      this.totalStatus = status;
    }
  },
  watch: {
    //
    doneLeads () {
      this.btnRecoverySend = this.totalRows === this.doneLeads;
    }
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
.botton-replay{
  width: 180px;
}
</style>