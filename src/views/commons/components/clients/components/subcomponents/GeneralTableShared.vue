<template>
  <div>
    <filter-slot
      :filter="filters"
      :filter-principal="filterPrincipal"
      :total-rows="totalRows"
      :paginate="paginate"
      :start-page="startPage"
      :to-page="toPage"
      :send-multiple-sms="false"
      @reload="$refs['refClientsList'].refresh()"
      @onSelectChange="changeTypePayment"
    >
      <b-table
        small
        slot="table"
        no-provider-filtering
        :api-url="clientRoute"
        ref="refClientsList"
        :items="myProvider"
        :fields="fieldsByTab"
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
        <!-- Column SHARED USERS -->
        <template #cell(users_comp)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px; list-style: none">
              <li
                v-for="(item, index) in JSON.parse(data.item.users_comp)"
                :key="index"
              >
                {{ item.user_name }}
              </li>
            </ul>
          </div>
        </template>
        <!-- Column STATUS -->
        <template #cell(status)="data">
          <div>
            <status-account :account="data.item" />
          </div>
        </template>
        <!-- Column Fee & Charge -->
        <template
          v-if="
            ($route.meta.module != 2 && $route.meta.module != 6) ||
            ($route.meta.module == 6 && currentUser.role_id != 4)
          "
          #cell(charges)="data"
        >
          <div>
            <span v-if="$route.meta.module != 2"
              >$ {{ data.item.charges }}</span
            >
          </div>
        </template>
        <!-- Column MP -->
        <template
          v-if="
            ($route.meta.module != 2 && $route.meta.module != 6) ||
            ($route.meta.module == 6 && currentUser.role_id != 4)
          "
          #cell(monthly_amount)="data"
        >
          <div>
            <span v-if="$route.meta.module != 2"
              >$ {{ data.item.monthly_amount }}</span
            >
          </div>
        </template>
        <!-- Column LP -->
        <template
          v-if="
            (this.$route.meta.module != 2 && this.$route.meta.module != 6) ||
            (this.$route.meta.module == 6 && this.currentUser.role_id != 4)
          "
          #cell(last_payment)="data"
        >
          <div v-if="$route.meta.module != 2">
            <span style="margin-left: 15px">
              <b-img :src="assetsImg + '/images/icons/lastpayment-out.ico'" />
              {{ data.item.last_payment == "-" ? "" : data.item.last_payment }}
            </span>
          </div>
        </template>
        <!-- Column PT -->
        <template
          v-if="
            ($route.meta.module != 2 && $route.meta.module != 6) ||
            ($route.meta.module == 6 && currentUser.role_id != 4)
          "
          #cell(type_payment)="data"
        >
          <div v-if="$route.meta.module != 2">
            <status-payment :account="data.item" />
          </div>
        </template>
        <!-- Column ADVISOR -->
        <template #cell(advisor_name)="data">
          <div>
            <feather-icon
              id="icon"
              icon="CircleIcon"
              size="13"
              :style="
                data.item.state_advisor == 1
                  ? 'background:green'
                  : data.item.state_advisor == 2
                  ? 'background:orange'
                  : data.item.state_advisor == 3
                  ? 'background:red'
                  : 'background:#ccc'
              "
            />
            {{ data.item.advisor_name }}
          </div>
        </template>
        <!-- Column -->
        <template #cell(created_at)="data">
          <div>
            <span>{{data.item.created_at | myGlobal }}</span>
          </div>
        </template>
      </b-table>
    </filter-slot>
  </div>
</template>

<script>
import { mapActions,mapGetters } from "vuex";
// Import Services
import ClientService from "../../services/clients.services";
// Filters
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
// Import Components
import StatusAccount from "../../stylescomponents/StatusAccount.vue";
import StatusPayment from "../../stylescomponents/StatusPayment.vue";
// Import Data
import fieldsPrograms from "../../data/filters.programs.data"
export default {
  components: {
    FilterSlot,
    StatusAccount,
    StatusPayment,
  },
  props: {
    typeShared: {
      type: [Number, String],
    },
  },
  data() {
    return {
      filters: fieldsPrograms,
      fields: [],
      assetsImg: process.env.VUE_APP_BASE_URL_ASSETS,
      totalRows: 0,
      paginate: {
        currentPage: 1,
        perPage: 10,
      },
      totalAmount: 0,
      sortBy: "",
      sortDesc: true,
      startPage: null,
      endPage: "",
      nextPage: "",
      toPage: null,
      isBusy: false,
      filterPrincipal: {
        type: "input",
        inputType: "text",
        placeholder: "Client...",
        model: "",
      },
      program_va: "",
      program: null,
      programs:[],
      users:[],
      advisor:null,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    clientRoute(){
      return this.typeShared == 1? '/clients/clients-share' : '/clients/clients-share-other'
    },
    ...mapGetters("clients-store", ["Programs","ShareTo"]),
    fieldsStatus: function () {
      this.fields = [
        {
          key: "lead_name",
          label: "Name",
          visible: true,
        },
        {
          key: "users_comp",
          label: "Shared Users",
          visible: true,
        },
        {
          key: "mobile",
          label: "Mobile",
          visible: true,
        },
        {
          key: "account",
          label: "Account",
          sortable: true,
          visible: true,
        },
        {
          key: "program",
          label: "Program",
          visible: true,
        },
        {
          key: "status",
          label: "Status",
          visible: true,
        },
        (this.$route.meta.module != 2 && this.$route.meta.module != 6) ||
        (this.$route.meta.module == 6 && this.currentUser.role_id != 4)
          ? {
              key: "charges",
              label: "Fee & Cgarges",
              sortable: true,
              visible: true,
            }
          : null,
        (this.$route.meta.module != 2 && this.$route.meta.module != 6) ||
        (this.$route.meta.module == 6 && this.currentUser.role_id != 4)
          ? {
              key: "monthly_amount",
              label: "MP",
              sortable: true,
              visible: true,
            }
          : null,
        (this.$route.meta.module != 2 && this.$route.meta.module != 6) ||
        (this.$route.meta.module == 6 && this.currentUser.role_id != 4)
          ? {
              key: "last_payment",
              label: "LP",
              sortable: true,
              visible: true,
            }
          : null,
        (this.$route.meta.module != 2 && this.$route.meta.module != 6) ||
        (this.$route.meta.module == 6 && this.currentUser.role_id != 4)
          ? {
              key: "type_payment",
              label: "PT",
              sortable: true,
              visible: true,
            }
          : null,
        {
          key: "advisor_name",
          label: "Advisor",
          visible: true,
        },
        {
          key: "created_at",
          label: "Creation Date",
          sortable: true,
          visible: true,
        },
      ];
      return this.fields;
    },
    fieldsByTab(){
      if (this.typeShared == 1) {
        return this.fieldsStatus;
      } else {
        let newFilter = [...this.fieldsStatus];
        newFilter.splice(1, 1);
        return newFilter;
      }
    },
    programStatus() {
      switch (parseInt(this.$route.meta.module)) {
        case 3:
          this.program_va = 1;
          break;
        case 6:
          this.program_va = 3;
          break;
        case 7:
          this.program_va = 2;
          break;
        case 5:
          this.program_va = 4;
          break;
        case 8:
          this.program_va = 5;
          break;
        case 10:
          this.program_va = 6;
          break;
        case 11:
          this.program_va = 7;
          break;
      }
      return this.program_va;
    },
  },
  methods: {
    ...mapActions("clients-store", [
      "SET_PROGRAMS",
      "SET_SHARETO",
    ]),
    changeTypePayment(type) {
      if (type == "paymentType") {
        if (fieldsPrograms[4].model == 1) {
          fieldsPrograms[5].visible = true
        }else{
          fieldsPrograms[5].model = null
          fieldsPrograms[5].visible = false
        }
      }
    },
    myProvider: async function (ctx) {
        let sortBy = 5;
        let sortDirection = "desc";
        if (ctx.sortBy === "account") {
          sortBy = 4
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        } else if (ctx.sortBy === "charges") {
          sortBy = 42;
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        }else if (ctx.sortBy === "monthly_amount") {
          sortBy = 43;
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        }else if (ctx.sortBy === "last_payment") {
          sortBy = 44;
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        }else if (ctx.sortBy === "type_payment") {
          sortBy = 48;
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        }else if (ctx.sortBy === "created_at") {
          sortBy = 5;
          if (ctx.sortDesc) sortDirection = "desc";
          else sortDirection = "asc";
        }
      try {  
          if (parseInt(this.$route.meta.module) != 2 && parseInt(this.$route.meta.module) != 4) {
            if (
              this.currentUser.role_id == 1 ||
              this.currentUser.role_id == 2
            ) {
                this.advisor = this.advisor;
              } else {
                this.advisor = this.currentUser.user_id;
              }
          } else {
            this.advisor = this.advisor;
          }

        let params = {
          perPage: ctx.perPage,
          text: this.filterPrincipal.model,
          from: fieldsPrograms[0].model,
          to: fieldsPrograms[1].model,
          program: this.program == null ? this.programStatus : this.program,
          orderby: sortBy,
          order: sortDirection,
          status: fieldsPrograms[3].model,
          advisor: this.advisor,
          type: fieldsPrograms[4].model,
          day: fieldsPrograms[5]?.model,
          rol_id: this.currentUser.role_id,
          session: this.currentUser.user_id,
          modul: this.$route.meta.module,
          user: fieldsPrograms[2].model,
        }

        let params2 = {
          perPage: ctx.perPage,
          text: this.filterPrincipal.model,
          from: fieldsPrograms[0].model,
          to: fieldsPrograms[1].model,
          program: fieldsPrograms[2].model,
          orderby: sortBy,
          order: sortDirection,
          status: fieldsPrograms[3].model,
          advisor: this.advisor,
          type: fieldsPrograms[4].model,
          day: fieldsPrograms[5]?.model,
          rol_id: this.currentUser.role_id,
          session: this.currentUser.user_id,
          modul: this.$route.meta.module
        }
        const data = await amgApi.post(
          `${ctx.apiUrl}?page=${ctx.currentPage}`,
          this.typeShared == 1? params : params2
        );
        const items = data.data.data;
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
    changeFilter(){
      if(this.typeShared == 1){
        if(this.currentUser.role_id != 3){
          fieldsPrograms[2].label = 'Shared To'
          fieldsPrograms[2].selectText = 'user_name'
          this.allUserSupervisers()
        }
        
      }else{
        
        fieldsPrograms[2].label = 'Programs'
        fieldsPrograms[2].selectText = 'value'
        this.allPrograms()
      }
    },
    allPrograms:async function (){
      try{
        if(this.Programs == null){
          const data = await ClientService.programs()
          this.programs = data.data
          this.SET_PROGRAMS(this.programs)
        }else{
          this.programs = this.Programs
        }
        fieldsPrograms[2].options = this.programs
      }catch(error){
        console.log(error)
      }
    },

    allUserSupervisers:async function(){
      try{
        if(this.ShareTo == null){
          let params = {
            module: this.$route.meta.module
          }
          const data = await ClientService.usersSuperviser(params)
          this.users = data.data
          this.SET_SHARETO(this.users)
          
        }else{
          this.users = this.ShareTo
        }
        fieldsPrograms[2].options = this.users
        fieldsPrograms[2].options = this.users
      }catch(error){
        console.log(error)
      }
    },
  
  },
  created() {
    this.changeFilter()
  },
};
</script>

<style scoped>
#icon {
  border-radius: 50%;
  margin-bottom: 2px;
  margin-right: 5px;
}
</style>
