<template>
  <div>
    <b-modal
      v-model="modalUp"
      title-class="h2"
      size="lg"
      title="Loan Tracking"
      hide-footer
      modal-class="modal-primary"
      @hidden="hideModal(false)"
    >
      <div class="table-responsive">
        <b-table
          :items="loanPays"
          :fields="arrayColumns"
          primary-key="id"
          table-class="text-nowrap"
          responsive="sm"
          hide-footer
          show-empty
          small
          striped
          sticky-header="50vh"
          thead-class="text-center"
          tbody-class="text-center"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>

          <template #cell(due_date)="data">
            <div>
              <span>{{data.value | myGlobal}}</span>
            </div>
          </template>

          <template #cell(bank_code)="data">
            <div>
              <span>{{data.value != 'null' ? data.value : '-'}}</span>
            </div>
          </template>

          <template #cell(file)="data">
            <div v-if="data.value">
              <b-link :href="data.value" download>
                <b-icon icon="folder-fill" variant="warning" font-scale="1.5" />
              </b-link>
            </div>
          </template>

          <template #cell(pay_status)="data">
            <div>
              <b-badge
                :variant="data.value == 1? 'primary' : data.value == 2? 'success' : 'danger'"
                class="restart-font-size text-uppercase"
              >{{ data.value == 1 ? 'PENDING' : data.value == 2 ? 'APPROVED' : data.value == 3 ? 'REJECTED' : 'ANULLED' }}</b-badge>
            </div>
          </template>

          <template #cell(due_status)="data">
            <div>
              <b-badge
                :variant="data.value == 1 ? 'primary' : 'success'"
                class="restart-font-size text-uppercase"
              >{{ data.value == 1 ? 'PENDING' : 'PAID' }}</b-badge>
            </div>
          </template>

          <template #cell(created_at)="data">
            <div>
              <span>{{data.value | myGlobal}}</span>
            </div>
          </template>

          <template #cell(id_pay)="data">
            <div v-if="isManagement">
              <template v-if="data.item.pay_status == 1">
                <b-button
                  @click="changeStatusPay(data.value,2)"
                  variant="success"
                  class="reset-radius btn-sm button-little-size"
                >
                  <feather-icon icon="XCircleIcon" />
                </b-button>
                <b-button
                  @click="changeStatusPay(data.value,3)"
                  variant="danger"
                  class="reset-radius btn-sm button-little-size"
                >
                  <feather-icon icon="XCircleIcon" />
                </b-button>
              </template>
              <template v-else>
                <b-badge variant="info" class="restart-font-size badge-finish">Finish</b-badge>
              </template>
            </div>
            <div v-else>
              <template v-if="data.item.pay_status == 1">
                <b-button
                  @click="changeStatusPay(data.value,4)"
                  variant="danger"
                  class="reset-radius btn-sm button-little-size"
                >
                  <feather-icon icon="XCircleIcon" />
                </b-button>
              </template>
              <template v-else>
                <b-badge variant="info" class="restart-font-size badge-Finish">FINISH</b-badge>
              </template>
            </div>
          </template>
        </b-table>
      </div>
    </b-modal>
  </div>
</template>

<script>
import loansService from "@/views/commons/components/loans/services/loans.service";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "ModalRevisionPayment",
  props: {
    info: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  created() {
    this.getPays();
  },
  mounted() {},
  data() {
    return {
      modalUp: false,
      loanPays: [],
      arrayColumns: [
        {
          key: "due",
          label: "DUE"
        },
        {
          key: "due_date",
          label: "DUE DATE"
        },
        {
          key: "amount",
          label: "PAID"
        },
        {
          key: "bank_code",
          label: "TYPE"
        },
        {
          key: "file",
          label: "ATTACHMENT"
        },
        {
          key: "due_status",
          label: "DUE STATUS"
        },
        {
          key: "created_at",
          label: "PAID DATE"
        },
        {
          key: "pay_status",
          label: "PAY STATUS"
        },
        {
          key: "id_pay",
          label: "ACTIONS"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      bigWindow: "app/bigWindow",
      currentUser: "auth/currentUser",
      moduleId: "auth/moduleId",
      userSession: "auth/userSession",
      isCeo: "auth/isCeo"
    }),
    isManagement() {
      return this.moduleId == 16 || this.isCeo;
    }
  },
  methods: {
    hideModal(status) {
      this.modalUp = false;
      this.$emit("hide", status);
    },
    async getPays() {
      try {
        const params = {
          id_loan: this.info.idLoan
        };
        const response = await loansService.getPayListLoan(params);
        this.loanPays = response;
        this.modalUp = true;
        this.removePreloader();
      } catch (error) {
        this.removePreloader();
        this.showErrorSwal();
      }
    },
    async changeStatusPay(id, status) {
      const result = await this.showConfirmSwal(
        null,
        "You want to change the status of this payment?"
      );
      if (result.isConfirmed) {
        try {
          this.addPreloader();
          const params = {
            id_pay: id,
            status: status
          };
          const response = await loansService.changeStatusPayLoan(params);
          this.hideModal(true);
          this.removePreloader();
          this.showSuccessSwal();
        } catch (error) {
          this.hideModal(false);
          this.removePreloader();
          this.showErrorSwal();
        }
      }
    }
  }
};
</script>

<style scoped>
.reset-radius {
  border-radius: 5px !important;
}
.badge-finish {
  background-color: #607d8b;
}
</style>