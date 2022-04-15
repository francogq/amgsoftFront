<template>
  <div>
    <b-modal
      modal
      :title="statusTitle"
      v-model="mutableIfModal"
      size="lg"
      modal-class="modal-primary"
      title-tag="h3"
      hide-footer
      body-class="mb-2"
      @hidden="closeModal"
      :no-close-on-backdrop="true"
      centered
    >
      <b-row style="margin: 0">
        <base-refund>
        <!-- Row Client -->
          <template #client>
            <b-form-input disabled v-model="dataVoidRefund.client_name" />
          </template>
          <!-- Row Transaction ID -->
          <template #transaction>
            <b-form-input disabled v-model="dataVoidRefund.transaction_id" />
          </template>
          <!-- Row Amount -->
          <template #amount>
            <b-form-input disabled v-model="statusAmount"></b-form-input>
          </template>
          <!-- Row Date -->
          <template #date>
            <b-form-input disabled v-model="statusDate"></b-form-input>
          </template>
        </base-refund>
        <!-- Row Done by -->
        <div class="col-lg-8 col-12 col-xl-8 col-md-8 pb-1">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon3">Done by</span>
            </div>
            <b-form-input disabled v-model="statusDone"></b-form-input>
          </div>
        </div>
        <!-- Text Tarea Comment -->
        <div class="col-lg-12 mt-1">
          <div class="form-group row">
            <span>Comment</span>
            <b-textarea
              disabled
              class="input-form"
              v-model="dataVoidRefund.comment"
              style="height: 140px"
            ></b-textarea>
          </div>
        </div>
      </b-row>
    </b-modal>
  </div>
</template>


<script>
import moment from "moment";
//Import Base Refund
import BaseRefund from "../BaseComponent/BaseRefund.vue";
// Import Services
import PaymentService from "../service/payments.service";
export default {
  props: {
    modalVoidRefund: {
      type: Boolean,
    },
    idtransaction: {
      type: [Number, String],
    },
  },
  components: {
    BaseRefund,
  },
  data: function () {
    return {
      mutableIfModal: this.modalVoidRefund,
      dataVoidRefund: [],
    };
  },
  computed: {
    statusAmount: function () {
      return "$ " + this.dataVoidRefund.amount;
    },
    statusDate: function () {
      return moment(this.dataVoidRefund.settlement_date).format("MM/DD/YYYY");
    },
    statusDone: function () {
      return (
        this.dataVoidRefund.updated_by +
        " | " +
        moment(this.dataVoidRefund.updated_at).format("MM/DD/YYYY hh:mm A")
      );
    },
    statusTitle: function () {
      return this.dataVoidRefund.type_transaction == 39
        ? "VOID"
        : this.dataVoidRefund.type_transaction == 40
        ? "REFUND"
        : "";
    },
  },
  methods: {
    closeModal: function () {
      this.$emit("closeInfo", false);
    },
    //Getting Information of Refund
    getVoidRefund: async function (idtransaction) {
      try {
        this.addPreloader();
        const data = await PaymentService.getVoidRefund({
          idtransaction: idtransaction,
        });
        this.dataVoidRefund = data[0];
        this.removePreloader();
      } catch (error) {
        console.error(error);
        this.showToast(
          "success",
          "top-right",
          "Success",
          "CheckIcon",
          "Glossary Deleted"
        );
        this.removePreloader();
      }
    },
  },
  created: function () {
    this.getVoidRefund(this.idtransaction);
  },
};
</script>

<style scoped>
.input-group > .input-group-prepend {
  flex: 0 0 40%;
}
.input-group .input-group-text {
  width: 100%;
}
</style>
