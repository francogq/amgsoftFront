<template>
  <div class="m-1">
    <b-row>
      <b-col cols="6"></b-col>
      <b-col cols="6" class="d-flex justify-content-end">
        <div
          :class="
            client.st_balance == 1
              ? 'av-balance-border-blue'
              : 'av-balance-border-red'
          "
          class="row float-right mr-4"
        >
          <div
            :class="
              client.st_balance == 1
                ? 'av-balance-text-blue'
                : 'av-balance-text-red'
            "
            class="text-center"
          >
            Available Balance
          </div>
          <h2
            v-if="client.balance != null"
            :class="
              client.st_balance == 1
                ? 'av-balance-content-blue'
                : 'av-balance-content-red'
            "
          >
            {{ "$ " + client.balance }}
          </h2>
          <h2
            v-if="client.balance == null"
            :class="
              client.st_balance == 1
                ? 'av-balance-content-blue'
                : 'av-balance-content-red'
            "
          >
            $ 0
          </h2>
        </div>
      </b-col>
    </b-row>
    <b-card
      title="Client Information"
      class="border-3 border-table-radius px-0 box-shadow-info border-info info"
    >
      <!-- Content -->
      <b-row>
        <!-- First Content -->
        <b-col cols="6">
          <!-- Sub Content -->
          <b-row>
            <!-- First Sub Content -->
            <b-col cols="6">
              <div>
                <span>{{ client.account }}</span>
              </div>
              <div>
                <!-- Route To Lead Show -->
                <router-link
                  :to="{
                    name: statusRedirect,
                    params: { lead_id: client.lead_id, id: idClient },
                  }"
                  target="_blank"
                  >{{ client.client_name }}</router-link
                >
              </div>
              <div
                class="d-flex justify-content-between form-group-input"
                :class="statusDark"
              >
                <status-account :account="client" />
                <feather-icon
                  icon="ListIcon"
                  @click="openModalHistory"
                  class="cursor-pointer"
                  size="15"
                />
              </div>
              <b-input-group class="mr-1 mt-1">
                <b-input-group-prepend>
                  <b-button variant="secondary" disabled> CO-APP </b-button>
                </b-input-group-prepend>
                <div
                  class="form-group-input2 d-flex justify-content-between"
                  :class="statusDark"
                >
                  <div>
                    <span
                      name="start"
                      id="date"
                      class="cursor-pointer"
                      v-if="client.coapp_name != false"
                      @click="coApplicant(true)"
                      >{{ client.coapp_name }}</span
                    >
                    <span name="start" id="date" v-else>None</span>
                  </div>
                  <div>
                    <span
                      name="start"
                      v-if="client.coapp_name == false"
                      @click="coApplicant(false)"
                      class="cursor-pointer"
                      >ADD</span
                    >

                    <feather-icon
                      icon="ListIcon"
                      @click="openModalHistory"
                      class="cursor-pointer ml-1"
                      size="15"
                    />
                  </div>
                </div>
              </b-input-group>
            </b-col>
            <!-- Second Sub Content -->
            <b-col cols="6"></b-col>
          </b-row>
        </b-col>
        <!-- Second Content -->
        <b-col cols="6"></b-col>
      </b-row>
    </b-card>

    <modal-history
      v-if="modalHistory"
      :modalHistory="modalHistory"
      :nameProgram="client.program_name"
      :nameClient="client.client_name"
      :id="idClient"
      @closeModalHistory="closeModalHistory"
    />

    <modal-co-applicant
      v-if="modalApplicant"
      :modalApplicant="modalApplicant"
       :accountName="client.account"
      :nameProgram="client.program_name"
      :id_user="currentUser.user_id"
      :valoCo="valoCo"
      :nameClient="client.client_name"
      :id="idClient"
      @closeModalApplicant="closeModalApplicant"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// Import Services
import ClientDashboardService from "../services/clients.dashboard.services";
// Import Components
import StatusAccount from "../../stylescomponents/StatusAccount.vue";
import ModalHistory from "./modals/ModalHistory.vue";
import ModalCoApplicant from "./modals/ModalCoApplicant.vue";
export default {
  components: {
    StatusAccount,
    // Modals
    ModalHistory,
    ModalCoApplicant,
  },
  props: {
    idClient: {
      type: [Number, String],
    },
  },
  data() {
    return {
      client: {},
      created: "",
      balanceprops: "",
      advisor: null,
      status: null,
      date_start: "",
      status_welco: null,
      lead_status: null,
      cstreet: null,
      ccity: "",
      cstates_eeuu_slug: "",
      czipcode: null,
      selementCost: null,
      advisors: [],
      allscores: [],
      viewp: true,
      valoCo: null,
      //   modals
      modalHistory: false,
      modalApplicant: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    ...mapGetters({
      skin: "appConfig/skin",
    }),
    statusDark() {
      return this.skin == "dark" ? "dark" : "";
    },
    statusRedirect() {
      let router;
      switch (this.$route.meta.module) {
        case 2:
          router = "/crm/clients/edit/";
          break;
        case 6:
          router = "/creditexperts/clients/edit/";
          break;
        case 3:
          router = "/bussiness/clients/edit/";
          break;
        case 5:
          router = "/debtsolution/clients/edit/";
          break;
        case 7:
          router = "/boostcredit/clients/edit/";
          break;
        case 8:
          router = "/taxresearch/clients/edit/";
          break;
        case 10:
          router = "/claimdepartment/clients/edit/";
          break;
        default:
          router = "";
      }
      return router;
    },
  },
  methods: {
    //   OpenModals
    openModalHistory() {
      this.modalHistory = true;
    },
    coApplicant(valoCo) {
      this.valoCo = valoCo;
      this.modalApplicant = true;
    },
    // Close Modals
    closeModalHistory() {
      this.modalHistory = false;
    },
    closeModalApplicant() {
      this.modalApplicant = false;
    },
    searchAccount: async function () {
      try {
        this.addPreloader();
        const response = await ClientDashboardService.search({
          id: this.idClient,
        });
        this.client = response.data[0];
        this.created = this.client.creates;
        this.balanceprops = this.client.balance;
        this.advisor = this.client.advisor_id;
        this.status = this.client.status;
        this.date_start = this.client.start_date;
        this.status_welco = this.client.s_welcome;
        this.lead_status = this.client.status_l;
        this.cstreet = this.client.street;
        this.ccity = this.client.city;
        this.cstates_eeuu_slug = this.client.state_name;
        this.czipcode = this.client.zipcode;
        this.selementCost = this.client.selement_cost;
        if ((this.client.coappname = "")) {
          this.client.coappname = false;
        }
        var module = 0;
        switch (parseInt(this.status)) {
          case 1:
            this.status_name = "Active";
            break;
          case 2:
            this.status_name = "Hold";
            break;
          case 3:
            this.status_name = "Transition";
            break;
          case 4:
            this.status_name = "Canceled";
            break;
          case 5:
            this.status_name = "Loyal";
            break;
          case 6:
            this.status_name = "Closed";
            break;
        }

        switch (this.client.program_id) {
          case 1:
            module = 3;
            break;
          case 2:
            module = 7;
            break;
          case 3:
            module = 6;
            break;
          case 4:
            module = 5;
            break;
          case 5:
            module = 8;
            break;
          case 6:
            module = 10;
            break;
        }

        const data = await ClientDashboardService.userModule(module, {
          roles: "[2,3]",
          type: "1",
        });
        this.advisors = data.data;
        this.removePreloader();
      } catch (error) {
        console.log(error);
        this.removePreloader();
      }
    },
    scores: async function () {
      try {
        const data = await ClientDashboardService.allScore({
          id: this.client.lead_id,
        });
        if (response.status == 200) {
          this.allscores = response.data;
          this.viewp = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.searchAccount();
  },
};
</script>

<style scoped>
.form-group-input {
  padding: 0.438rem 1rem;
  background-clip: padding-box;
  border: 1px solid #d8d6de;
  border-radius: 0.357rem;
}
.form-group-input2 {
  padding: 0.438rem 1rem;
  /* background-color: #fff; */
  background-clip: padding-box;
  border: 1px solid #d8d6de;
  border-radius: 0.357rem;
  width: 65%;
}
</style>
