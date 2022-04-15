<template>
  <div>
    <b-modal
      v-model="modalUp"
      title-class="h2 text-white"
      size="lg"
      title="Loan Register Pay"
      modal-class="modal-primary"
      @hidden="hideModal(false)"
    >
      <div style="margin: 0px 5px;">
        <b-row>
          <b-col md="4">
            <b-row>
              <b-col md="12">
                <b-form-group class="mt-1">
                  <b-input-group>
                    <b-input-group-prepend class="w-60">
                      <b-input-group-text
                        class="w-100 bg-success bg-lighten-2 text-white font-weight-bolder"
                      >
                        <span>Monthly Payment</span>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <money
                      id="input-1"
                      v-bind="maskMoney"
                      v-model="loan.amount_payable"
                      class="form-control"
                      disabled
                    ></money>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col md="4">
            <b-row>
              <b-col md="12">
                <b-form-group class="mt-1">
                  <b-input-group>
                    <b-input-group-prepend class="w-60">
                      <b-input-group-text
                        class="w-100 badge-name-group font-weight-bolder"
                        :style="isPendingApprove ? 'background-color:#d0a62a' :''"
                      >
                        <span>For Approval</span>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <money
                      id="input-1"
                      v-bind="maskMoney"
                      v-model="loan.for_approval"
                      disabled
                      class="form-control"
                    ></money>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col md="4">
            <b-row>
              <b-col md="12">
                <b-form-group class="mt-1">
                  <b-input-group>
                    <b-input-group-prepend class="w-60">
                      <b-input-group-text class="w-100 badge-name-group font-weight-bolder">
                        <span>Balance</span>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <money
                      id="input-1"
                      v-bind="maskMoney"
                      disabled
                      v-model="loan.balance"
                      class="form-control"
                    ></money>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-form class="mt-1">
          <ValidationObserver ref="form">
            <b-row>
              <b-col md="6" xs="12">
                <ValidationProvider rules="required|validate-amount" v-slot="{errors}">
                  <b-form-group
                    label="AMOUNT:"
                    label-for="input-1"
                    description="Enter the amount to be paid"
                    label-class="font-weight-bolder"
                  >
                    <money
                      id="input-1"
                      v-model="pay.amount"
                      v-bind="maskMoney"
                      class="form-control"
                      :class="{'border border-danger':(errors[0] && vmoneyValidate) || isOverPay || isPendingApprove}"
                    ></money>
                    <div v-if="isOverPay" class="text-danger">The amount is over the balance</div>
                    <div
                      v-if="isPendingApprove"
                      class="text-danger"
                      style="color:#d0a62a !important"
                    >You have an amount pending for approval.</div>
                  </b-form-group>
                </ValidationProvider>
              </b-col>
              <b-col md="6" xs="12">
                <ValidationProvider rules="required" v-slot="{errors}">
                  <b-form-group
                    label="TYPE PAYMENT:"
                    label-class="font-weight-bolder"
                    label-for="input-3"
                    description="Select the type of payment"
                  >
                    <b-form-select
                      class="select-icon-none"
                      id="input-3"
                      v-model="pay.type"
                      :options="banks"
                      :class="{'border border-danger':errors[0]}"
                      required
                    ></b-form-select>
                  </b-form-group>
                </ValidationProvider>
              </b-col>
              <b-col md="6" xs="12" v-if="pay.type == 1">
                <ValidationProvider rules="required" v-slot="{errors}">
                  <b-form-group
                    label="OPERATION CODE:"
                    label-class="font-weight-bolder"
                    label-for="input-2"
                    description="Enter the operation code"
                  >
                    <b-form-input
                      placeholder="XXXXXXX"
                      id="input-2"
                      v-model="pay.operation_code"
                      :class="{'border border-danger':errors[0]}"
                      required
                    ></b-form-input>
                  </b-form-group>
                </ValidationProvider>
              </b-col>
              <b-col md="6" xs="12" v-if="pay.type == 1">
                <b-form-group
                  label="ADD IMAGE:"
                  label-class="font-weight-bolder"
                  label-for="input-5"
                  :description="files.length > 0? '':'Add the image of the operation'"
                >
                  <b-button variant="primary" @click="showModalFiles = !showModalFiles">
                    {{files.length > 0 ? 'SHOW FILE' : 'ADD FILE'}}
                    <i class="fas fa-image ml-2"></i>
                  </b-button>
                  <span class="ml-2">{{files.length > 0 ? files[0].name.substr(0, 10) : ''}}</span>
                </b-form-group>
              </b-col>
              <b-col md="12" xs="12">
                <ValidationProvider rules="required" v-slot="{errors}">
                  <b-form-group
                    label="COMMENT:"
                    label-class="font-weight-bolder"
                    label-for="input-4"
                    description="Enter the comment"
                  >
                    <b-form-textarea
                      :class="{'border border-danger':errors[0]}"
                      id="input-4"
                      rows="3"
                      required
                      v-model="pay.comment"
                    ></b-form-textarea>
                  </b-form-group>
                </ValidationProvider>
              </b-col>
            </b-row>
          </ValidationObserver>
        </b-form>
        <b-modal
          v-model="showModalFiles"
          title="Upload File"
          modal-class="modal-primary"
          size="sm"
          button-size="sm"
          ok-title="Ok"
        >
          <DragAndDrop single image v-model="files" :filesArray="files" />
        </b-modal>
      </div>
      <template #modal-footer>
        <b-button variant="success" @click="addPay">Send Payment</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import loansService from "@/views/commons/components/loans/services/loans.service";
import DragAndDrop from "@/views/commons/utilities/DragAndDrop.vue";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "ModalNewPay",
  components: {
    DragAndDrop
  },
  props: {
    info: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      modalUp: false,
      showModalFiles: false,
      amount: 0,
      loan: {
        amount: 0,
        amount_payable: 0,
        for_approval: 0,
        balance: 0
      },
      pay: {
        type: null,
        amount: 0,
        operation_code: null,
        comment: null
      },
      banks: [
        { text: "Select One", value: null, disabled: true },
        { text: "BANK", value: 1 },
        { text: "OTHER", value: 2 }
      ],
      files: [],
      images: [],
      maskMoney: {
        decimal: ".",
        thousands: ",",
        prefix: "$",
        precision: 2,
        masked: false
      },
      vmoneyValidate: false
    };
  },
  created() {
    this.getCharge();
  },
  computed: {
    isOverPay() {
      return this.pay.amount > this.loan.balance;
    },
    isPendingApprove() {
      return (
        this.loan.balance - this.loan.for_approval - this.pay.amount < 0 &&
        this.loan.for_approval > 0
      );
    }
  },
  methods: {
    //charge
    async getCharge() {
      try {
        const params = { id_due: this.info.idDue };
        const response = await loansService.getDue(params);
        this.loan.amount = response[0].due_payment;
        this.loan.amount_payable =
          Number(response[0].due_payment) - Number(response[0].due_accumulated);
        this.loan.for_approval = response[0].for_approval;
        this.loan.balance = response[0].balance;
        this.modalUp = true;
        this.removePreloader();
      } catch (error) {
        this.showErrorSwal();
        this.removePreloader();
      }
    },
    //addpay
    async addPay() {
      this.vmoneyValidate = true;
      const validate = await this.$refs.form.validate();
      if (validate && !this.isOverPay && !this.isPendingApprove) {
        //Swal Comfirm
        const result = await this.showConfirmSwal();
        if (result.isConfirmed) {
          try {
            this.addPreloader();

            //Params
            const formdata = new FormData();
            if (this.files[0]) {
              formdata.append("file", this.files[0], this.files[0].name);
            }
            formdata.append("operation_code", this.pay.operation_code);
            formdata.append("id_due", this.info.idDue);
            formdata.append("amount", this.pay.amount);
            formdata.append("comment", this.pay.comment);
            //Send Payment
            const response = await loansService.insertPay(formdata);

            this.removePreloader();
            this.showSuccessSwal("Payment has been sent");
            this.hideModal(true);
          } catch (error) {
            this.hideModal();
            this.showErrorSwal("Loan not sent");
            this.removePreloader("Payment has not been sent");
          }
        }
      }
    },
    hideModal(status) {
      this.modalUp = false;
      this.$emit("hide", status);
    }
  },
  mounted() {}
};
</script>

<style  scoped>
.w-60 {
  width: 60% !important;
}

* {
  font-size: 0.8rem !important;
}
</style>


