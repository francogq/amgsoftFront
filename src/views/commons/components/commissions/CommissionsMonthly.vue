<template>
  <div>
    <template v-if="isCrm">
      <div>
        <a
          @click="findCommissions('crm', info.month_pay )"
          class="name-class color-gray-m cursor-pointer"
          v-b-tooltip.hover
          :title="info.monthUser"
          v-if="info.month_pay != '0.00' "
        >$ {{ info.month_pay }}</a>
      </div>
      <template v-if="info.month_pay != '0.00' && !isSupervisor ">
        <b-form-input
          min="1"
          max="100"
          type="number"
          v-model="percentage"
          @keyup.native="maxPercentage()"
          :disabled="!editPercentage"
          class="d-inline-flex text-center w-input-percentage p-0 mt-2 font-fam"
        ></b-form-input>
        <buttons-edit
          v-if="isManagement"
          :editMode="editPercentage"
          @edit="editPercentageUser()"
          @cancel="cancelPercentageUser()"
          @update="updatePercentageUser()"
        ></buttons-edit>
      </template>
    </template>

    <template v-if="admCrm || isSupervisorCrm ">
      <div :class="{'mt-2':isCrm}" v-if="info.month_pay != '0.00'">
        <a
          @click="findCommissions( 'crm', info.month_pay)"
          class="name-class text-color-m cursor-pointer"
          v-b-tooltip.hover
          :title="info.monthUser"
        >
          $
          <span v-if="tab=='crm'">{{ info.to_pay }}</span>
          <span v-else>{{ info.month_pay }}</span>
        </a>
        <template v-if="isManagement">
          <b-button
            v-if="info.ps == null"
            variant="outline-warning"
            class="btn-icon button-size button-margin-l"
            v-b-tooltip.hover.bottom="'NOT PAID'"
            @click="payCommissions()"
          >
            <feather-icon icon="ClockIcon"></feather-icon>
          </b-button>

          <b-button
            v-if="info.ps == 1"
            variant="outline-success"
            class="btn-icon button-size button-margin-l"
            v-b-tooltip.hover.bottom="'PAID'"
            @click="payCommissions()"
          >
            <feather-icon icon="ClockIcon"></feather-icon>
          </b-button>

          <b-button
            v-if="info.ps == 2"
            variant="outline-danger"
            class="btn-icon button-size button-margin-l"
            v-b-tooltip.hover.bottom="'ANULL'"
            @click="payCommissions()"
          >
            <feather-icon icon="ClockIcon"></feather-icon>
          </b-button>
        </template>
      </div>
    </template>

    <template v-if="!admCrm && total">
      <div>
        <a
          v-if="payDepartment"
          @click="findCommissions('program')"
          class="name-class text-color-m cursor-pointer"
          v-b-tooltip.hover
          :title="`${info.monthUser}-ADD/CHANGE`"
        >$ {{payDepartment.toFixed(2)}}</a>
        <span v-else class="name-class text-color-m">$ 0.00</span>
      </div>
      <div class="margin-t-pay">
        <a
          v-if="payDepartmentCrm"
          @click="findCommissions('crm',payDepartmentCrm)"
          class="name-class text-color-m cursor-pointer"
          v-b-tooltip.hover
          :title="`${info.monthUser}-CRM`"
        >$ {{payDepartmentCrm.toFixed(2)}}</a>
        <span v-else class="name-class text-color-m">$ 0.00</span>
      </div>

      <div class="name-class margin-t-pay">
        <span v-b-tooltip.hover :title="`${info.monthUser}-TOTAL`">$ {{ total.toFixed(2) }}</span>

        <template v-if="isManagement">
          <b-button
            v-if="psDepartment == null"
            variant="outline-warning"
            class="btn-icon button-size button-margin-l"
            v-b-tooltip.hover.bottom="'NOT PAID'"
            @click="payCommissions()"
          >
            <feather-icon icon="ClockIcon"></feather-icon>
          </b-button>

          <b-button
            v-if="psDepartment == 1"
            variant="outline-success"
            class="btn-icon button-size button-margin-l"
            v-b-tooltip.hover.bottom="'PAID'"
            @click="payCommissions()"
          >
            <feather-icon icon="ClockIcon"></feather-icon>
          </b-button>

          <b-button
            v-if="psDepartment == 2"
            variant="outline-danger"
            class="btn-icon button-size button-margin-l"
            v-b-tooltip.hover.bottom="'ANULL'"
            @click="payCommissions()"
          >
            <feather-icon icon="ClockIcon"></feather-icon>
          </b-button>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ButtonsEdit from "@/views/commons/utilities/ButtonsEdit";
import moment from "moment";
export default {
  name: "CommissionsMonthly",
  components: { ButtonsEdit },
  emits: ["edit", "cancel", "update", "max"],
  props: {
    editPercentage: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: {
        ps: 1,
        to_pay: "0.00",
        percentage_pay: "0.00",
        month_pay: "0.00",
        monthUser: "",
        rol: null,
        monthYear: null
      }
    },
    halfYear: {
      type: Boolean
    },
    tab: {
      type: String,
      default: "crm"
    },
    isManagement: {
      type: Boolean,
      default: false
    },
    commissionsDepartments: {
      type: Array,
      default: () => []
    },
    month: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      percentage: null,
      returnPercentage: null,
      payDepartment: 0,
      payDepartmentCrm: 0,
      psDepartment: null
    };
  },
  created() {
    this.getCommissionsDepartments();
  },
  mounted() {
    this.percentage = this.info.percentage_pay;
  },
  computed: {
    isSupervisor() {
      return this.info.rol == 2;
    },
    admCrm() {
      return this.tab == "adm" || this.tab == "crm";
    },
    isCrm() {
      return this.tab == "crm";
    },
    isSupervisorCrm() {
      return this.tab === "supervisorCrm";
    },
    total() {
      return this.payDepartmentCrm + this.payDepartment;
    },
    buttonsDisabled() {
      //Disabled for months y the past
      let today = moment();
      let month = moment(this.info.monthYear);
      let difference = today.diff(month, "months");
      return difference > 1;
    }
  },
  methods: {
    //Percentage to 100
    maxPercentage() {
      if (Number(this.percentage) > 100) {
        this.percentage = "100.00";
      }
    },
    //Disable buttons

    //COMMISSIONS DEPARTMENT
    getCommissionsDepartments() {
      if (!this.admCrm) {
        this.commissionsDepartments.forEach(item => {
          //Status Pay
          if (item["ps_" + this.month]) {
            this.psDepartment = item["ps_" + this.month];
          }

          //Pay Crm o Department
          if (item.module_id == 2) {
            this.payDepartmentCrm = item[this.month];
          } else {
            this.payDepartment = item[this.month];
          }
        });
      }
    },

    //EMITS
    findCommissions(type, amountTotal = null) {
      this.$emit("find", { type, amountTotal });
    },
    payCommissions() {
      let eventPay = {
        ps: this.psDepartment,
        total: this.total
      };
      this.$emit("pay", eventPay);
    },
    editPercentageUser() {
      this.returnPercentage = JSON.parse(JSON.stringify(this.percentage));
      this.$emit("edit");
    },
    cancelPercentageUser() {
      this.percentage = this.returnPercentage;
      this.$emit("cancel");
    },
    updatePercentageUser() {
      this.$emit("update", this.percentage);
    }
  },
  watch: {
    halfYear() {
      this.percentage = this.info.percentage_pay;
      this.getCommissionsDepartments();
    },
    info(newInfo, oldInfo) {
      if (newInfo) {
        this.getCommissionsDepartments();
      }
    }
  }
};
</script>

<style scoped>
.button-size {
  height: 23px;
  padding: 3px;
}
.w-input-percentage {
  width: 4.1rem;
}
.border-top-dash {
  border-top: 1px solid #ff6045;
}
.border-left-dash {
  border-left: 1px dashed #ff6045;
}

.bg-button-orange {
  background: #ff7f00;
}
.bg-button-green {
  background: #1cc700;
}

.color-gray-m {
  color: #9f9da8 !important;
}

.text-color-m {
  color: #666371 !important;
}

.text-color-m:hover {
  color: #ff7f00 !important;
}
.font-fam {
  font-family: "Rubik";
  font-style: normal;
}
.name-class {
  font-size: 15px;
  line-height: 11px;
  font-weight: 600;
}

.margin-t-pay {
  margin-top: 29px;
}
</style>
