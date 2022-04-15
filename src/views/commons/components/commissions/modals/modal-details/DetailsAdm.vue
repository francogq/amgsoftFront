<template>
  <div>
    <b-table
      :items="commissionsUser"
      :fields="fields"
      class="mt-2"
      responsive
      striped
      no-border-collapse
      sticky-header="50vh"
      :busy="isBusy"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template #cell(request_from_id)="data">
        <span>{{data.value == 2 || data.value == 15? 'Lead' :'Client'}}</span>
      </template>
      <template #cell(created_at)="data">
        <span>{{data.value | myGlobal}}</span>
      </template>
      <template #cell(request_date)="data">
        <span>{{data.value | myGlobal}}</span>
      </template>
    </b-table>
    <b-row>
      <template v-if="isSupervisor || isAdministrator">
        <b-col lg="6" :class="[textRightBig]">
          <div class="font-weight-bolder">SUM:</div>
        </b-col>
        <b-col lg="6" :class="[textLeftBig]">
          <div>$ {{ this.total_amount }}</div>
        </b-col>
      </template>

      <template v-if="isAdministrator">
        <b-col lg="6" :class="[textRightBig]">
          <div class="font-weight-bolder">DISCOUNT:</div>
        </b-col>
        <b-col lg="6" :class="[textLeftBig]">
          <div>$ {{ discount }}</div>
        </b-col>
      </template>

      <template v-if="isSupervisor">
        <b-col lg="6" :class="[textRightBig]">
          <div class="font-weight-bolder">20% OF COMMISSIONS</div>
        </b-col>
        <b-col lg="6" :class="[textLeftBig]">
          <div>$ {{ total_department }}</div>
        </b-col>
      </template>

      <b-col lg="6" :class="[textRightBig]">
        <div class="font-weight-bolder">TOTAL:</div>
      </b-col>
      <b-col lg="6" :class="[textLeftBig]">
        <div>$ {{ total }}</div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import commissionsService from "@/views/commons/components/commissions/services/commissions.service";
import { mapGetters } from "vuex";
export default {
  name: "DetailsAdm",
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      modalUp: false,
      showOverlay: false,
      commissionsUser: [],
      fields: [],
      isBusy: true,
      total_amount: "",
      discount: "",
      total: "",
      total_commission: "",
      total_department: "",
      total_programs: ""
    };
  },
  created() {
    this.searchCommissions();
  },
  mounted() {},
  computed: {
    ...mapGetters({
      bigWindow: "app/bigWindow"
    }),
    textRightBig() {
      return this.bigWindow ? "text-right" : "text-center";
    },
    textLeftBig() {
      return this.bigWindow ? "text-left" : "text-center mb-1";
    },
    isSupervisor() {
      return this.info.role_id == 2;
    },
    isAdministrator() {
      return this.info.role_id == 6;
    }
  },
  methods: {
    async searchCommissions() {
      this.getFields();
      let response = await commissionsService.searchCommissionsUserAdm(
        this.info
      );
      if (response.length > 0) {
        this.filterCommissions(response);
        this.total_amount = response[0].total_amount;
        this.discount = response[0].discount;
        this.total = response[0].total;
        this.total_department = response[0].commission_department;
        this.total_commission = response[0].commission_bond;
        this.total_programs = response[0].amount_programs;
      }
      this.isBusy = false;
    },
    getFields() {
      this.fields = [
        {
          key: "lead",
          label: "Client"
        },
        {
          key: "value",
          label: "Program"
        },
        {
          key: "type",
          label: "Type"
        },
        {
          key: "commission",
          label: "Amount"
        },
        {
          key: "created_at",
          label: "Created Date"
        },
        {
          key: "request_from",
          label: "Request From"
        },
        {
          key: "request_from_id",
          label: "Origin"
        },
        {
          key: "request_by",
          label: "Request By"
        },
        {
          key: "request_date",
          label: "Request Date"
        }
      ];
    },
    filterCommissions(commissions) {
      //Get Commissions, Just for User
      this.commissionsUser = commissions.filter(commission => {
        return commission.user_id == this.info.user;
      });
    }
  },
  watch: {}
};
</script>

<style>
</style>