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
      <!-- Form -->
      <ValidationObserver ref="form">
        <b-row style="margin: 0">
          <base-refund>
            <!-- Row Client -->
            <template #client>
              <b-form-input disabled v-model="dataVoid.client_name" />
            </template>
            <!-- Row Transaction ID -->
            <template #transaction>
              <b-form-input disabled v-model="dataVoid.idtransaction" />
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
          <!-- Input Text Tarea Comment -->
          <div class="col-lg-12 mt-1">
            <ValidationProvider
              name="comment"
              rules="required"
              v-slot="{ errors }"
            >
              <div class="form-group row">
                <span>Comment</span>
                <b-textarea
                  class="input-form"
                  v-model="comment"
                  style="height: 140px"
                  :class="{ 'border-danger': errors[0] }"
                ></b-textarea>
              </div>
            </ValidationProvider>
          </div>
          <!-- Button Submit -->
          <div class="col-lg-12">
            <div
              class="
                d-flex
                flex-column
                justify-content-center
                align-items-center
              "
            >
              <b-button
                variant="success"
                v-if="isCeo == 1 || (isSupervisor == 2 && modul == 4)"
                @click="sendVoid"
              >
                Submit
              </b-button>
            </div>
          </div>
        </b-row>
      </ValidationObserver>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
//Import Base Refund
import BaseRefund from "../BaseComponent/BaseRefund.vue";
// Import Services
import PaymentService from "../service/payments.service";
export default {
  props: {
    modalRefund: {
      type: Boolean,
    },
    global: {
      type: Object,
    },
    dataVoid: {
      type: Object,
    },
    modul: {
      type: [Number, String],
    },
  },
  components: {
    BaseRefund,
  },
  data: function () {
    return {
      mutableIfModal: this.modalRefund,
      comment: "",
    };
  },
  computed: {
    statusAmount: function () {
      return "$ " + this.dataVoid.amount;
    },
    statusDate: function () {
      return this.dataVoid.settlement_date
        ? moment(this.dataVoid.settlement_date).format("MM/DD/YYYY")
        : "-";
    },
    statusTitle: function () {
      return this.dataVoid.type == 1
        ? "VOID"
        : this.dataVoid.type == 2
        ? "REFUND"
        : "";
    },
    ...mapGetters({
      currentUser: "auth/currentUser",
      isSupervisor: "auth/isSupervisor",
      isCeo: "auth/isCeo",
    }),
  },
  methods: {
    closeModal: function () {
      this.$emit("close", false);
    },
    updateGrid: function () {
      this.$emit("updateGrid", false);
    },
    //Send two types of refund
    sendVoid: function () {
      this.$refs.form.validate().then(async (success) => {
        if (!success) {
          return;
        } else {
          if (this.dataVoid.type == 1) {
            //Void
            const confirm = await this.showConfirmSwal(
              "Are you sure?",
              "You won't be able to revert this!"
            );
            if (confirm.isConfirmed) {
              try {
                //Request Void Transaction
                this.addPreloader();
                let params = {
                  idtransaction: this.dataVoid.idtransaction,
                  idmerchant: this.dataVoid.idmerchant,
                  comment: this.comment,
                  iduser: this.currentUser.user_id,
                };

                const data = await PaymentService.voidTransaction(params);
                this.removePreloader();
                if (data.status == 200) {
                  if (data.data.code == 1) {
                    this.closeModal();
                    this.updateGrid();
                    this.$swal.fire({
                      icon: "success",
                      title: "OPERATION SUCCESSFULLY",
                    });
                  } else {
                    this.$swal.fire({
                      icon: "warning",
                      title: data.data.message,
                    });
                    this.closeModal();
                    this.updateGrid();
                  }
                } else {
                  this.$swal.fire({
                    icon: "warning",
                    title: data.data.message,
                  });
                  this.closeModal();
                  this.updateGrid();
                }
              } catch (error) {
                this.removePreloader();
                this.showErrorSwal(error);
              }
            }
          } else {
            // Request Refund Transaction
            const confirm = await this.showConfirmSwal(
              "Are you sure?",
              "You won't be able to revert this!"
            );
            if (confirm.isConfirmed) {
              try {
                this.addPreloader();
                const data = await PaymentService.refundTransaction({
                  idtransaction: this.dataVoid.idtransaction,
                  idmerchant: this.dataVoid.idmerchant,
                  comment: this.comment,
                  iduser: this.currentUser.user_id,
                  amount: this.dataVoid.amount,
                });
                this.removePreloader();
                if (data.status == 200) {
                  if (data.data.code == 1) {
                    this.closeModal();
                    this.$swal.fire({
                      icon: "success",
                      title: "OPERATION SUCCESSFULLY",
                    });
                    this.updateGrid();
                  } else {
                    this.$swal.fire({
                      icon: "warning",
                      title: data.data.message,
                    });
                    this.closeModal();
                    this.updateGrid();
                  }
                } else {
                  this.$swal.fire({
                    icon: "warning",
                    title: data.data.message,
                  });
                  this.closeModal();
                  this.updateGrid();
                }
              } catch (error) {
                this.removePreloader();
                this.showErrorSwal(error);
              }
            }
          }
        }
      });
    },
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