<template>
  <div>
    <b-modal
      v-model="modalUp"
      title-class="h2"
      size="lg"
      title="COMMISSION PAYMENT"
      modal-class="modal-primary"
      :footer-class="showEdit || showAnull? 'justify-content-between':''"
      centered
      @hidden="hideModal(false, null)"
    >
      <b-card-text>
        <ModalHeader :info="info" />
        <ValidationObserver ref="form">
          <PaymentBody :info="info" :disabled-payment="disabledPayment" :payment="payment" />
        </ValidationObserver>
      </b-card-text>

      <template #modal-footer>
        <!-- PAY OR ANNUL BY -->
        <div v-if="showEdit || showAnull">
          <label class="font-weight-bolder">{{anullApprove}} &nbsp;</label>
          <span>{{anullApproveName}}</span>
          <span v-if="info.paid_state == 2">({{payment.anullDate | myGlobal }})</span>
        </div>

        <!-- buttons -->
        <div>
          <b-button
            v-if="true"
            size="sm"
            variant="gradient-success"
            @click="approveCommissions()"
          >{{saveUpdate}}</b-button>
          <b-button v-if="showEdit" size="sm" variant="gradient-info" @click="editPayment()">EDIT</b-button>
          <b-button
            v-if="true"
            size="sm"
            variant="gradient-danger ml-1"
            @click="anullPayment()"
          >ANULL</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import moment from "moment";
import commissionsService from "@/views/commons/components/commissions/services/commissions.service";
import ModalHeader from "@/views/commons/components/commissions/modals/ModalHeader.vue";
import PaymentBody from "@/views/commons/components/commissions/modals/modal-payment/PaymentBody.vue";
export default {
  name: "ModalCommissionsPayment",
  components: {
    ModalHeader,
    PaymentBody
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      modalUp: false,
      disabledPayment: false,
      isPaid: null,
      approveBy: null,
      payment: {
        methoPayment: 2,
        datePayment: moment().format("MM-DD-YYYY"),
        numberPayment: null,
        observation: "",
        approveName: null,
        anullName: null,
        anullDate: null,
        loading: null
      }
    };
  },
  created() {
    this.searchCommission();
  },
  mounted() {
    this.modalUp = this.showModal;
    this.isPaid = this.info.paid_state;

    //Disabled if is paid
    this.disabledPayment =
      this.info.paid_state == 1 || this.info.paid_state == 2;
  },
  computed: {
    ...mapGetters({
      loading: "app/loading",
      currentUser: "auth/currentUser"
    }),
    anullApprove() {
      if (this.info.paid_state == 1) {
        return "Approved by:   ";
      } else if (this.info.paid_state == 2) {
        return "Anulled by:   ";
      }
    },
    anullApproveName() {
      if (this.info.paid_state == 1) {
        return this.payment.approveName;
      } else if (this.info.paid_state == 2) {
        return this.payment.anullName;
      }
    },
    amountToShow() {
      return this.info.tab == "crm" ? this.info.amountToPay : this.info.amount;
    },
    isCeo() {
      return this.info.role_id == 1;
    },
    isSupervisor() {
      return this.info.role_id == 2;
    },
    isCrm() {
      return this.info.module == 2;
    },
    isAdm() {
      return this.info.module == 4;
    },
    isDepartment() {
      return this.info.module != 2 && this.info.module != 4;
    },
    saveUpdate() {
      return this.info.paid_state ? "UPDATE" : "SAVE";
    },
    showEdit() {
      return this.isPaid == 1 || this.isPaid == 2;
    },
    showAnull() {
      return this.isPaid == 3;
    },
    showSave() {
      return this.isPaid == null || this.isPaid == 3;
    }
  },
  methods: {
    ...mapMutations({
      setLoading: "app/SET_LOADING"
    }),
    hideModal(status = false, payment, user, ps_month) {
      this.modalUp = false;
      this.$emit("hide-modal", status, payment, user, ps_month);
    },

    async searchCommission() {
      if (this.info.paid_state) {
        //start preloader
        this.setLoading(true);
        try {
          const params = {
            user_id: this.info.user_id,
            year: this.info.year,
            month: this.info.month
          };
          let response = await commissionsService.searchCommissionsApprove(
            params
          );
          this.payment.methoPayment = response[0].paid_type;
          this.payment.observation = response[0].observation;
          this.payment.datePayment = moment(response[0].payment_date).format(
            "MM-DD-YYYY"
          );
          this.payment.numberPayment = response[0].num_operation;
          this.payment.approveName = response[0].approve_name;
          this.payment.anullName = response[0].annulled_name;
          this.payment.anullDate = response[0].annulled_at;
          this.setLoading(false);
        } catch (error) {
          this.showErrorSwal();
          this.setLoading(false);
        }
      }
    },
    async approveCommissions() {
      const validate = await this.$refs.form.validate();
      if (validate) {
        const result = await this.showConfirmSwal(
          "Are you sure?",
          "Are you sure of pay this commission?",
          "warning"
        );
        if (result.isConfirmed) {
          try {
            //start preloader
            this.setLoading(true);
            const params = {
              user_id: this.info.user_id,
              year: this.info.year,
              month: this.info.month,
              method: this.payment.methoPayment,
              observation: this.payment.observation,
              approve_by: this.currentUser.user_id,
              approve_date: moment(this.payment.datePayment).format(
                "MM/DD/YYYY"
              ),
              module: this.info.module,
              num_operation: this.payment.numberPayment,
              amount_paid: this.amountToShow
            };
            let response = await commissionsService.approveCommissions(params);
            this.hideModal(true, 1, this.info.user_id, this.info.ps_month);
          } catch (error) {
            this.showErrorSwal();
            this.setLoading(false);
            this.hideModal(false, null);
          }
        }
      }
    },
    editPayment() {
      this.disabledPayment = false;
      this.isPaid = 3;
    },

    async anullPayment() {
      const result = await this.showConfirmSwal(
        "Are you sure?",
        "Are you sure of anull this commission?",
        "warning"
      );
      if (result.isConfirmed) {
        try {
          //start preloader
          this.setLoading(true);
          const params = {
            user_id: this.info.user_id,
            year: this.info.year,
            month: this.info.month,
            method: this.payment.methoPayment,
            observation: this.payment.observation,
            num_operation: this.operationNumber,
            anulled_by: this.currentUser.user_id,
            module: this.info.module
          };
          let response = await commissionsService.anullComissions(params);
          this.hideModal(true, 2, this.info.user_id, this.info.ps_month);
        } catch (error) {
          this.showErrorSwal();
          this.setLoading(false);
          this.hideModal(false, null);
        }
      }
    }
  },
  watch: {}
};
</script>
