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
      :changeColumnsByClient="true"
      @reload="$refs['refClientsList'].refresh()"
      @onSelectChange="changeTypePayment"
    >
      <template #buttons>
        <!-- Button Sms -->
        <b-button variant="success" class="ml-1" :disabled="lengthClients" @click="openModalSendSms">
          <feather-icon icon="MessageCircleIcon" class="mr-50" />Send SMS
        </b-button>
        <!-- Button Send Email -->
        <b-button variant="success" class="ml-1" :disabled="lengthClients" @click="openModalSendEmail" >
          <feather-icon icon="MessageCircleIcon" class="mr-50" />Send Email
        </b-button>
        <!-- Button refresh -->
        <b-button
          variant="success"
          class="ml-1"
          :disabled="pnttime"
          @click="contador"
        >
          <feather-icon icon="MessageCircleIcon" class="mr-50" />{{
            pnttime == false
              ? "Refresh"
              : tiempominutos + ":" + tiemposegundos + " sec"
          }}
        </b-button>
      </template>
      <!-- Table -->
      <b-table
        small
        slot="table"
        no-provider-filtering
        :api-url="'/clients/clientsds'"
        ref="refClientsList"
        :items="myProvider"
        :fields="fieldsStatus"
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
        <!-- Selected Title -->
        <template #head(selected)>
          <b-form-checkbox v-model="selectAll" @input="selectedAll" />
        </template>
        <!-- Selected -->
        <template v-slot:cell(selected)="data">
          <b-form-group>
            <b-form-checkbox
              v-model="clientsSms"
              :value="{id: JSON.parse(data.item.accounts)[0].account_id, name: data.item.lead_name}"
              :name="JSON.parse(data.item.accounts)[0].account_id"
              class="mt-1"

            />
          </b-form-group>
        </template>
        <!-- Column NAME -->
        <template #cell(lead_name)="data">
          <router-link
              class
              :to="{
                name: 'debt-solution-dashboard',
                params: { idClient: JSON.parse(data.item.accounts)[0].account_id },
              }"
              target="_blank"
            >{{ data.item.lead_name }}</router-link>
            <div>
              <span style="font-weight: 100;">{{data.item.mobile}}</span>
            </div>
        </template>
        <!-- Column ACCOUNT -->
        <template #cell(account)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                <a 
                  v-if="$route.meta.module == 4"
                  :href="
                    '/administration/clients/account/' + account.account_id
                  "
                  >{{ account.account }}</a
                >
                <span  v-else>{{
                  account.account
                }}</span>
              </li>
            </ul>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                <status-account :account="account"></status-account>
              </li>
            </ul>
          </div>
        </template>
        <!-- Column PROGRAM -->
        <template
          v-if="$route.meta.module == 2 || $route.meta.module == 4"
          #cell(program)="data"
        >
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                {{ account.program }}
              </li>
            </ul>
          </div>
        </template>
        <!-- Column AVAILABLE BALANCE -->
        <template
          v-if="
            ($route.meta.module != 2 && $route.meta.module != 6) ||
            ($route.meta.module == 6 && currentUser.role_id != 4)
          "
          #cell(available_balance)="data"
        >
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
                :style="account.total_balance > 0 ? 'color:blue' : 'color:red'"
              >
                {{
                  account.total_balance == null
                    ? "-"
                    : "$ " + account.total_balance_f
                }}
              </li>
            </ul>
          </div>
        </template>
        <!-- Column Total Debt -->
        <template
          v-if="
            ($route.meta.module != 2 && $route.meta.module != 6) ||
            ($route.meta.module == 6 && currentUser.role_id != 4)
          "
          #cell(total_debt)="data"
        >
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                 {{account.total_accounts!= null ?'$ ' +account.total_accounts : '' }}
              </li>
            </ul>
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
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                $ {{ account.monthly_amount }}
              </li>
            </ul>
          </div>
        </template>
        <!-- Column LP -->
        <template
          v-if="
            ($route.meta.module != 2 && $route.meta.module != 6) ||
            ($route.meta.module == 6 && currentUser.role_id != 4)
          "
          #cell(last_payment)="data"
        >
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none; position: relative"
              >
                <span style="margin-left: 15px">
                  {{ account.last_payment == "-" ? "" : account.last_payment }}
                  <b-img
                    :src="assetsImg + '/images/icons/lastpayment-out.ico'"
                    v-if="account.state_lp == 1"
                    style="
                      position: absolute;
                      left: 0;
                      top: 50%;
                      transform: translate(0, -50%);
                    "
                  />
                  <b-img
                    :src="assetsImg + '/images/icons/lastpayment-in.ico'"
                    v-else
                    style="
                      position: absolute;
                      left: 0;
                      top: 50%;
                      transform: translate(0, -50%);
                    "
                  />
                </span>
              </li>
            </ul>
          </div>
        </template>
        <!-- Column PT -->
        <template
          v-if="
            ($route.meta.module != 2 && $route.meta.module != 6) ||
            ($route.meta.module == 6 && currentUser.role_id != 4)
          "
          #cell(status_payment)="data"
        >
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                <status-payment :account="account" />
              </li>
            </ul>
          </div>
        </template>
        <!-- Column ADVISOR -->
        <template
          v-if="currentUser.role_id != 3 || $route.meta.module == 2"
          #cell(state_advisor)="data"
        >
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                style="list-style: none"
              >
                <div>
                  <feather-icon
                    :title="
                      account.state_advisor == 1
                        ? 'Active'
                        : account.state_advisor == 2
                        ? 'Busy'
                        : account.state_advisor == 3
                        ? 'Away'
                        : 'Offline'
                    "
                    id="icon"
                    icon="CircleIcon"
                    size="13"
                    :style="
                      account.state_advisor == 1
                        ? 'background:green'
                        : account.state_advisor == 2
                        ? 'background:orange'
                        : account.state_advisor == 3
                        ? 'background:red'
                        : 'background:#ccc'
                    "
                  />
                  {{ account.advisor_name }}
                </div>
              </li>
            </ul>
          </div>
        </template>
        <!-- Column LN -->
        <template
          v-if="
            ($route.meta.module != 2 &&
              $route.meta.module != 4 &&
              $route.meta.module != 6) ||
            ($route.meta.module == 6 && currentUser.role_id != 4)
          "
          #cell(s_note)="data"
        >
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px; list-style: none">
              <li
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                class="li-created-at-account"
                :style="
                  account.s_note <= 1
                    ? ''
                    : account.s_note <= 2
                    ? 'color: #FF8000'
                    : 'color:#FF0000'
                "
              >
                {{ account.last_note }}
              </li>
            </ul>
          </div>
        </template>
        <!-- Column CREATION DATE -->
        <template #cell(created_at)="data">
          <div>
            <ul style="padding-left: 0px; margin-bottom: 0px">
              <li
                style="list-style: none"
                v-for="(account, index) in JSON.parse(data.item.accounts)"
                :key="index"
                class="li-created-at-account"
              >
                {{ account.created_at | myGlobal }}
              </li>
            </ul>
          </div>
        </template>
        <!-- Column SERVICES -->
        <template
          v-if="
            currentUser.role_id == 1 ||
            currentUser.role_id == 2 ||
            currentUser.role_id == 3
          "
          #cell(service)="data"
        >
          <actions-table
                :options="actionsOptions"
                :row-data="data.item"
                @onRowDelete="onRowDelete"
                @onRowEdit="onRowEdit"
                @onRowProcess="onRowProcess"
                @modalChangeService="modalChangeService"
                @modalAddService="modalAddService"/>
        </template>
      </b-table>
    </filter-slot>
    <!-- Modal send sms -->
    <modal-send-sms
      v-if="modalSendSms"
      :modalSendSms="modalSendSms"
      :nameLeads="clientsSms"
      :typesms="0"
      @closeModal="closeSendSms" />
    <!-- Modal Send Email -->
    <modal-send-email
        v-if="modalSendEmail"
        :modalSendEmail="modalSendEmail"
        :nameLeads="clientsSms"
        :typesms="0"
        @closeModal="closeSendSms"/>
    <!-- Modal Add and Change Services -->
    <modal-add-service
      v-if="modalOpenAddService"
      :modalOpenAddService="modalOpenAddService"
      :detailsClient="detailsClient"
      :typeModal="typeModal"
      @hideModal="closeModalService"
      @changeProgram="openModalProgram"
      />
      <!-- Component Commons -->
      <component
      :is="modalData.programs.programSelected"
      v-if="modal.programs"
      :type-modal="modalData.programs.typeModal"
      :sales-client="saleClientP"
      :programs-all="programsAll"
      :users-services="usersServices"
      @closeModal="hideModalProgram"
      @changeProgram="openModalProgram"
      />
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions } from "vuex";
// Filters
import FilterSlot from "@/views/crm/views/sales-made/components/slots/FilterSlot.vue";
// Import Service
import ClientService from "../services/clients.services";
// Import Data
import filters from "../data/filters.clients.data";
// Import Components
import StatusAccount from "../stylescomponents/StatusAccount.vue";
import StatusPayment from "../stylescomponents/StatusPayment.vue";
import ModalSendSms from "../modals/ModalSendSms.vue"
import ModalSendEmail from "../modals/ModalSendEmail.vue"
// Import Column Actions
import ActionsTable from "@/views/crm/views/Lead/lead-table/ActionsTable.vue";
import ModalAddService from "../modals/ModalAddService.vue"
// Componenrts
import BusinessModal from "@/views/crm/views/sales-made/components/modals/services/BuisnessModal.vue";
import CreditExpertsModal from "@/views/crm/views/sales-made/components/modals/services/CreditExpertsModal.vue";
import BoostCreditModal from "@/views/crm/views/sales-made/components/modals/services/BoostCreditModal.vue";
import GeneralSupportModal from "@/views/crm/views/sales-made/components/modals/services/GeneralSupportModal.vue";
import KeyBookModal from "@/views/crm/views/sales-made/components/modals/services/KeyBookModal.vue";
import ParagonModal from "@/views/crm/views/sales-made/components/modals/services/ParagonModal.vue";
import SpecialistModal from "@/views/crm/views/sales-made/components/modals/services/SpecialistModal.vue";
import TaxResearchModal from "@/views/crm/views/sales-made/components/modals/services/TaxResearchModal.vue";
import DebtSolutionModal from "@/views/crm/views/sales-made/components/modals/services/DebtSolutionModal.vue";
// import ModalAddPrograms from "./ModalAddService.vue";

export default {
  components: {
    FilterSlot,
    StatusAccount,
    StatusPayment,
    ModalSendSms,
    ModalSendEmail,
    ModalAddService,
    // Components Actions
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
  },
  data() {
    return {
      modalData: {
        programs: {
          programSelected: "",
          typeModal: 0,
          salesClient: {},
        }
      },
      modal: {
        programs: false,
      },
      modalOpenAddService:false,
      typeModal:null,
      clients: null,
      clientsSms: [],
      selectAll: 0, // total
      allClients: [], // lista de listas
      arrayCurrentPage: [],
      filters: filters,
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
      tiemposegundos: 59,
      tiempominutos: 1,
      time1: true,
      pnttime: false,
      advisor: "",
      modalSendSms: false,
      modalSendEmail:false,
      actionsOptions: [],
      detailsClient:{},
      saleClientP:{},
      programsAll:[],
      usersServices:[],
    };
  },
  computed: {

    ...mapGetters({
      skin: "appConfig/skin",
    }),
    classAdd(){
      // return this.s
    },
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    fieldsStatus: function () {
      this.fields = [
        {
          key: "selected",
          label: "",
          sortable: false,
        },
        {
          key: "lead_name",
          label: "Name",
          sortable: true,
          visible: true,
        },
        {
          key: "account",
          label: "Account",
          sortable: true,
          visible: true,
        },
        this.$route.meta.module == 2 || this.$route.meta.module == 4
          ? {
              key: "program",
              label: "Program",
              sortable: true,
              visible: true,
            }
          : null,
        (this.$route.meta.module != 2 && this.$route.meta.module != 6) ||
        (this.$route.meta.module == 6 && this.currentUser.role_id != 4)
          ? {
              key: "available_balance",
              label: "Available Balance",
              sortable: true,
              visible: true,
            }
          : null,
        {
          key: "total_debt",
          label: "Total Debt",
          visible: true,
        },
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
              key: "status_payment",
              label: "PT",
              sortable: true,
              visible: true,
            }
          : null,
        this.currentUser.role_id != 3 || this.$route.meta.module == 2
          ? {
              key: "state_advisor",
              label: "Advisor",
              visible: true,
            }
          : null,
        (this.$route.meta.module != 2 &&
          this.$route.meta.module != 4 &&
          this.$route.meta.module != 6) ||
        (this.$route.meta.module == 6 && this.currentUser.role_id != 4)
          ? {
              key: "s_note",
              label: "LN",
              sortable: true,
              visible: true,
            }
          : null,
        {
          key: "created_at",
          label: "Creation Date",
          sortable: true,
          visible: true,
        },
        this.currentUser.role_id == 1 ||
        this.currentUser.role_id == 2 ||
        this.currentUser.role_id == 3
          ? {
              key: "service",
              label: "Services",
              visible: true,
            }
          : null,
      ];
      return this.fields;
    },
    lengthClients() {
      return this.clientsSms.length == 0 ? true : false;
    },
  },
  async mounted(){
    this.actionsOptions.push("addService");
    this.actionsOptions.push("changeService");
  },
  methods: {
    openModalSendSms(){
      this.modalSendSms = true
    },
    openModalSendEmail(){
      this.modalSendEmail = true
    },
    closeSendSms(){
      this.modalSendSms = false
      this.modalSendEmail = false
    },
    isAdvisor(){
      if(this.currentUser.role_id == 3){
        filters.splice(2, 1)
      }
    },
    changeTypePayment(type) {
      if (type == "paymentType") {
        let {filOne, filTwo} = this.currentUser.role_id != 3? {filOne:4,filTwo:5} : {filOne:3,filTwo:4}
        if (filters[filOne].model == 1) {
          filters[filTwo].visible = true
        }else{
          filters[filTwo].model = null
          filters[filTwo].visible = false
        }
      }
    },
    contador: async function () {
      try {
        this.pnttime = true;
        this.updateReloj();
        // setTimeout(() => {
        //   this.pnttime = false;
        // }, 1000 * this.tiemposegundos + 60000 * this.tiempominutos);
        await ClientService.generateRefresh()
      } catch (error) {
        console.log(error);
      }
    },
    updateReloj() {
      this.tiemposegundos = this.tiemposegundos;
      this.tiempominutos = this.tiempominutos;
      if (this.tiempominutos == 0 && this.tiemposegundos == 0) {
        this.$refs.refClientsList.refresh();
        this.pnttime = false;
        this.tiemposegundos = 59;
        this.tiempominutos = 1;
      } else {
        //Restamos un segundo al tiempo restante
        if (this.tiemposegundos == 0) {
          this.tiemposegundos = 59;
          if (this.tiempominutos != 0) {
            this.tiempominutos -= 1;
          }
        }
        this.tiemposegundos -= 1;
        // Ejecutamos nuevamente la función al pasar 1000 milisegundos (1 segundo)
        setTimeout(() => {
          this.updateReloj();
        }, 1000);
      }
    },
    selectedAll: function () {
      if (this.selectAll == 1) {
        let nameCl = [];
        this.clients.map((dato) => {
          nameCl.push({id:JSON.parse(dato.accounts)[0].account_id,name:dato.lead_name});
        });
        let value = this.allClients.find(
          (element) => element.currentPage == this.paginate.currentPage
        );
        if (!value) {
          this.allClients.push({
            currentPage: this.paginate.currentPage,
            array: nameCl,
          });
        }
      }
      if (this.selectAll == 0) {
        let value = this.allClients.find(
          (element) => element.currentPage == this.paginate.currentPage
        );
        if (value) {
          let index = this.allClients.indexOf(value);
          this.allClients.splice(index, 1);
        }
      }
      this.clientsSms = [];
      for (let i = 0; i < this.allClients.length; i++) {
        // let obj = this.allClients[i].array
        // let reduceId = obj.map((data)=> data.id)
        this.clientsSms = [...this.clientsSms, ...this.allClients[i].array];
      }
    },
    myProvider: async function (ctx) {
      let sortBy = 5;
      let sortDirection = "desc";
      if (ctx.sortBy === "lead_name") {
        sortBy = 2;
        if (ctx.sortDesc) sortDirection = "desc";
        else sortDirection = "asc";
      } else if (ctx.sortBy === "account") {
        sortBy = 5;
        if (ctx.sortDesc) sortDirection = "desc";
        else sortDirection = "asc";
      } else if (ctx.sortBy === "available_balance") {
        sortBy = 50;
        if (ctx.sortDesc) sortDirection = "desc";
        else sortDirection = "asc";
      } else if (ctx.sortBy === "monthly_amount") {
        sortBy = 43;
        if (ctx.sortDesc) sortDirection = "desc";
        else sortDirection = "asc";
      } else if (ctx.sortBy === "last_payment") {
        sortBy = 44;
        if (ctx.sortDesc) sortDirection = "desc";
        else sortDirection = "asc";
      } else if (ctx.sortBy === "status_payment") {
        sortBy = 48;
        if (ctx.sortDesc) sortDirection = "desc";
        else sortDirection = "asc";
      } else if (ctx.sortBy === "s_note") {
        sortBy = 45;
        if (ctx.sortDesc) sortDirection = "desc";
        else sortDirection = "asc";
      } else if (ctx.sortBy === "created_at") {
        sortBy = 5;
        if (ctx.sortDesc) sortDirection = "desc";
        else sortDirection = "asc";
      }
      try {
        let module = 0;
        switch (parseInt(this.$route.meta.module)) {
          case 2:
            module = this.program;
            break;
          case 4:
            module = this.program;
            break;
          case 3:
            module = 1;
            break;
          case 7:
            module = 2;
            break;
          case 6:
            module = 3;
            break;
          case 5:
            module = 4;
            break;
          case 8:
            module = 5;
            break;
          case 10:
            module = 6;
            break;
        }
        if (
          parseInt(this.$route.meta.module) != 2 &&
          parseInt(this.$route.meta.module) != 4
        ) {
          if (this.currentUser.role_id == 1 || this.currentUser.role_id == 2) {
            this.advisor = filters[2].model;
          } else {
            this.advisor = this.currentUser.user_id;
          }
        } else {
          this.advisor = filters[2].model;
        }
        let params = {
          perPage: ctx.perPage,
          text: this.filterPrincipal.model,
          from: filters[0].model,
          to: filters[1].model,
          program: module,
          orderby: sortBy,
          order: sortDirection,
          status: filters[3].model,
          advisor: this.advisor,
          type: filters[4].model,
          day: filters[5]?.model,
          rol_id: this.currentUser.role_id,
        };
        const data = await amgApi.post(
          `${ctx.apiUrl}?page=${ctx.currentPage}`,
          params
        );
        const items = data.data.data;
        this.clients = items;
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
    usersPrograms: async function () {
      try {
        let params = {
          idmodule: this.$route.meta.module,
          iduser: this.currentUser.user_id,
          idrole: this.currentUser.role_id,
        };
        if(this.currentUser.role_id != 3){
          const data = await ClientService.usersPrograms(params);
          filters[2].label = "Advisor";
          filters[2].selectText = "user_name";
          filters[2].options = data;
        }

      } catch (error) {
        console.log(error);
      }
    },
    searchPrograms:async function(lead_id) {
      try{
        const response = await ClientService.searchClientPayment({id: lead_id})
        if (response.status == 200) {
            let programs = response.data;
            const data = await ClientService.programs()
            this.programsAll = data.data;
            programs.sort(function (a, b) {
                return a.program_id - b.program_id;
              });
              for (var i = 0; i < this.programsAll.length; i++) {
                for (var y = 0; y < programs.length; y++) {
                  if (this.programsAll[i].id == programs[y].program_id) {
                    this.programsAll.splice(i, 1);
                  }
                }
              }
            var sper = this.currentUser.sale_permission
            var spn = [];
            if (sper.length != this.programsAll.length) {
                sper.map((spe) => {
                  this.programsAll.map((pro) => {
                    if (spe.id == pro.id) {
                      spn.push(pro);
                    }
                  });
                });
                this.programsAll = spn;
              }
          }
      }catch(error){
          console.log(error)
        }
    },
    usersAllPrograms:async function(){
      try{
        const data = await ClientService.usersAllPrograms({id: this.$route.meta.module})
        this.usersServices = data.data
        this.usersServices.unshift({id: 1, user_name: "CEO"})
      }catch(error){
        console.log(error)
      }
    },
    onRowDelete(id){

    },
    onRowEdit:async function(data){


    },
    modalChangeService:async function(data){
      const result = await this.showConfirmSwal(
            "Are you sure change service?",
          )
          if (result.value) {
            this.modalGeneralService(data,4)
          }
    },
    onRowProcess(id){

    },
    modalAddService:async function(data){
      const result = await this.showConfirmSwal(
            "Are sure want to add new service?",
          )
          if (result.value) {
            this.modalGeneralService(data,3)
          }

    },
    modalGeneralService(data,type){
      this.detailsClient = data
      this.typeModal = type
      this.modalOpenAddService = true;
    },
    closeModalService(){
      this.modalOpenAddService = false
    },
    openModalProgram:function(data){
      this.searchPrograms(this.detailsClient.lead_id)
      let obj = {
          account_id: JSON.parse(this.detailsClient.accounts)[0].account_id,
          client:this.detailsClient.accounts.lead_name,
          program: JSON.parse(this.detailsClient.accounts)[0].program,
          program_id: JSON.parse(this.detailsClient.accounts)[0].program_id,
          event_id: null,
      }
      this.saleClientP = {...this.detailsClient,...obj, ...data}
      if(data) {
       switch (data.program.name) {
         case 'Business':
           this.modalData.programs.programSelected = "business-modal";
           break;
         case 'Boost Credit':
           this.modalData.programs.programSelected = "boost-credit-modal";
           break;
         case 'Credit Experts':
           this.modalData.programs.programSelected = "credit-experts-modal";
           break;
         case 'Debt Solution':
           this.modalData.programs.programSelected = "debt-solution-modal";
           break;
         case 'Tax Research':
           this.modalData.programs.programSelected = "tax-research-modal";
           break;
         case 'General Support':
           this.modalData.programs.programSelected = "general-support-modal";
           break;
         case 'Specialist':
           this.modalData.programs.programSelected = "specialist-modal";
           break;
         case 'KeyBook':
           this.modalData.programs.programSelected = "key-book-modal";
           break;
         case 'Paragon':
           this.modalData.programs.programSelected = "paragon-modal";
           break;
         default:
           break;
       }

        this.modalOpenAddService = false
        if (this.modalData.programs.programSelected !== "") {

         this.modalData.programs.typeModal = this.typeModal;
         this.modalData.programs.salesClient = data;
         this.modal.programs = true;
       }
       }


    },
    async hideModalProgram(refresh) {
      if (refresh) {
        // await this.updateRow();
        this.showToast(
              "success",
              "top-right",
              "Success!",
              "CheckIcon",
              "Successful operation"
            );
      }

      this.modalData.programs.programSelected = "";
      this.modal.programs = false;
      this.removePreloader();
    },
  },
  created() {
    this.usersPrograms()
    this.isAdvisor()
    this.usersAllPrograms()
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
