<template>
  <div>
    <b-modal
        v-model="modalUp"
        title-class="h2 text-white "
        size="lg"
        :title="requestTitle"
        :hide-footer="hideFooter"
        modal-class="modal-primary "
        scrollable
        @hidden="hideModal(false)"
    >
      <div>
        <div style="margin: 0px 8px" v-if="isLoadData">
          <div v-if="!isDataComplete" class="text-center">
            <div class="text-center mb-5">
              <p class="badge-loan font-weight-bold" style="color: #ec660b">
                The request cannot be continued... Contact with your supervisor.
              </p>
            </div>
            <b-img-lazy
                src="/assets/images/icons/not-found.png"
                style="width: 60%"
                class="mb-2"
            ></b-img-lazy>
          </div>
          <div v-else>
            <div class="text-center mb-2">
              <p class="badge-loan font-weight-bold text-primary">
                Loan Autorization
              </p>
            </div>
            <ValidationObserver ref="form">
              <b-row>
                <b-col lg="6" xs="12">
                  <b-row>
                    <b-col lg="12">
                      <b-form-group class>
                        <b-input-group>
                          <b-input-group-prepend class="w-35">
                            <b-input-group-text class="w-100">
                              <span>Full Name</span>
                            </b-input-group-text>
                          </b-input-group-prepend>
                          <b-form-input
                              v-model="userData.userName"
                              type="text"
                              disabled
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="6" xs="12">
                  <b-row>
                    <b-col lg="12">
                      <b-form-group class>
                        <b-input-group>
                          <b-input-group-prepend class="w-35">
                            <b-input-group-text class="w-100">
                              <span>Rol</span>
                            </b-input-group-text>
                          </b-input-group-prepend>
                          <b-form-input
                              v-model="userData.roleName"
                              type="text"
                              disabled
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="6" xs="12">
                  <b-row>
                    <b-col lg="12">
                      <b-form-group class>
                        <b-input-group>
                          <b-input-group-prepend class="w-35">
                            <b-input-group-text class="w-100">
                              <span>Department</span>
                            </b-input-group-text>
                          </b-input-group-prepend>
                          <b-form-input
                              v-model="userData.moduleName"
                              type="text"
                              disabled
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="6" xs="12">
                  <b-row>
                    <b-col lg="12">
                      <b-form-group class>
                        <b-input-group>
                          <b-input-group-prepend class="w-35">
                            <b-input-group-text class="w-100">
                              <span>Supervisor</span>
                            </b-input-group-text>
                          </b-input-group-prepend>
                          <b-form-input
                              v-model="userData.superName"
                              type="text"
                              disabled
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="6" xs="12">
                  <b-row>
                    <b-col lg="12">
                      <ValidationProvider
                          name="amount"
                          rules="required|validate-amount"
                          v-slot="{ errors }"
                      >
                        <b-form-group class>
                          <b-input-group>
                            <b-input-group-prepend class="w-35">
                              <b-input-group-text
                                  class="w-100"
                                  :class="
                                  isLoanActive ? '' : 'bg-primary text-light'
                                "
                              >
                                <span>Amount</span>
                              </b-input-group-text>
                            </b-input-group-prepend>
                            <money
                                v-model="loan.amount"
                                v-bind="vMoney"
                                class="form-control"
                                :disabled="isLoanActive"
                                :class="{
                                'border-danger':
                                  (errors[0] && vmoneyValidate) ||
                                  (isOverProvision && !isSupervisorLoan),
                              }"
                            ></money>
                            <span
                                v-if="isOverProvision && !isSupervisorLoan"
                                class="text-danger"
                            >The amount is over the middle provision.</span
                            >
                          </b-input-group>
                        </b-form-group>
                      </ValidationProvider>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="6" xs="12">
                  <b-row>
                    <b-col lg="12">
                      <b-form-group class>
                        <b-input-group>
                          <b-input-group-prepend class="w-35">
                            <b-input-group-text class="w-100">
                              <span>Pay Day</span>
                            </b-input-group-text>
                          </b-input-group-prepend>
                          <b-form-input
                              value="25th"
                              type="text"
                              disabled
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="12" xs="12">
                  <b-form-group class>
                    <b-input-group>
                      <b-input-group-prepend class="w-35">
                        <b-input-group-text
                            class="w-100"
                            :class="isLoanActive ? '' : 'bg-primary text-light'"
                        >
                          <span>Interest</span>
                        </b-input-group-text>
                      </b-input-group-prepend>
                      <b-form-checkbox
                          v-model="selectedInterest"
                          class="pl-1 form-control bg-transparent"
                          :disabled="isLoanActive"
                          switch
                      >
                        Selected Interest
                        <b
                        >(Interest:
                          {{
                            selectedInterest
                                ? "0%"
                                : `${userData.interest_real}%`
                          }})</b
                        >
                      </b-form-checkbox>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="12">
                  <ValidationProvider
                      name="amount"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <b-form-group>
                      <b-input-group>
                        <b-input-group-prepend class="w-35">
                          <b-input-group-text
                              class="w-100"
                              :class="isLoanActive ? '' : 'bg-primary text-light'"
                          >
                            <span>Monthly Payment</span>
                          </b-input-group-text>
                        </b-input-group-prepend>
                        <b-radio-group
                            v-model="loan.payment"
                            class="form-control text-center bg-transparent"
                            :style="bigWindow ? '' : 'height: 4rem;'"
                            :class="{ 'border-danger': errors[0] }"
                        >
                          <b-form-radio
                              value="20"
                              :disabled="loan.amount < 20 || isLoanActive"
                          >$20.00</b-form-radio
                          >
                          <b-form-radio
                              value="40"
                              :disabled="loan.amount < 40 || isLoanActive"
                          >$40.00</b-form-radio
                          >
                          <b-form-radio
                              value="60"
                              :disabled="loan.amount < 60 || isLoanActive"
                          >$60.00</b-form-radio
                          >
                          <b-form-radio
                              value="80"
                              :disabled="loan.amount < 80 || isLoanActive"
                          >$80.00</b-form-radio
                          >
                          <b-form-radio
                              value="100"
                              :disabled="loan.amount < 100 || isLoanActive"
                          >$100.00</b-form-radio
                          >
                        </b-radio-group>
                      </b-input-group>
                    </b-form-group>
                  </ValidationProvider>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="6" xs="12">
                  <b-row>
                    <b-col lg="12">
                      <b-form-group class>
                        <b-input-group>
                          <b-input-group-prepend class="w-35">
                            <b-input-group-text class="w-100">
                              <span>Salary</span>
                            </b-input-group-text>
                          </b-input-group-prepend>
                          <money
                              v-model="userData.salary"
                              v-bind="vMoney"
                              class="form-control"
                              disabled
                          ></money>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="6" xs="12">
                  <b-row>
                    <b-col lg="12">
                      <b-form-group class>
                        <b-input-group>
                          <b-input-group-prepend class="w-35">
                            <b-input-group-text class="w-100">
                              <span>Provision</span>
                            </b-input-group-text>
                          </b-input-group-prepend>
                          <money
                              v-model="userData.provision"
                              v-bind="vMoney"
                              class="form-control"
                              disabled
                          ></money>
                        </b-input-group>
                      </b-form-group>
                      <span
                          v-if="userData.currency_provision == 2"
                          style="color: blue"
                      >His provision was converted to a dollar</span
                      >
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="12">
                  <b-row class="class-inline px-1">
                    <b-col
                        lg="5"
                        class="
                        class-campo-icon
                        add-class-campo-icon
                        border-title-text
                      "
                        :class="isLoanActive ? '' : 'bg-primary  text-light'"
                    >
                      <span>Motive</span>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="12">
                  <ValidationProvider
                      name="description"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <div class="form-group mt-0">
                      <textarea
                          v-model="loan.motive"
                          class="textarea-style form-control bg-transparent"
                          style="border-radius: 0px 10px 10px 10px"
                          :class="{ 'border-danger': errors[0] }"
                          :disabled="isLoanActive"
                      ></textarea>
                    </div>
                  </ValidationProvider>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="12">
                  <b-row class="class-inline px-1">
                    <b-col
                        lg="5"
                        class="
                        class-campo-icon
                        add-class-campo-icon
                        border-title-text
                      "
                    >
                      <span>Observation</span>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="12">
                  <div class="form-group mt-0">
                    <div
                        class="textarea-style bg-transparent"
                        style="border-radius: 0px 10px 10px 10px"
                        disabled
                    >
                      <ul>
                        <li>
                          The Loan have a rate {{ userData.interest_real }}%
                        </li>
                        <li>
                          If there is no payment on the 25th, a daily charge of
                          $ 1 is generated
                        </li>
                      </ul>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </ValidationObserver>
          </div>
        </div>
      </div>

      <template #modal-footer>
        <b-row v-if="!isLoanActive">
          <b-col lg="12" style="text-align: center">
            <b-button variant="success" @click="sendLoan" :disabled="noSend"
            >Send Loan</b-button
            >
          </b-col>
        </b-row>
        <b-row
            v-if="
            isNotUserLoan &&
            (isShowSupervisor || isShowRrhh || isShowManagement)
          "
        >
          <b-col lg="12" style="text-align: center">
            <b-button
                variant="success"
                :disabled="noSend"
                class="mr-1"
                @click="changeStatus(1)"
            >Accept Loan</b-button
            >
            <b-button
                variant="outline-danger"
                :disabled="noSend"
                @click="changeStatus(2)"
            >Decline Loan</b-button
            >
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <b-modal
        title="MOTIVE"
        modal
        v-model="showCommentModal"
        centered
        modal-class="modal-danger"
    >
      <ValidationObserver ref="comment">
        <div class="form-group mt-0">
          <ValidationProvider
              name="comment"
              rules="required"
              v-slot="{ errors }"
          >
            <textarea
                v-model="acceptOrDeny.comment"
                class="textarea-style form-control"
                style="border-radius: 0px 10px 10px 10px"
                :class="{ 'border-danger': errors[0] }"
            ></textarea>
          </ValidationProvider>
        </div>
      </ValidationObserver>
      <template #modal-footer>
        <b-button variant="success" @click="sendComment">Send</b-button>
        <b-button
            variant="outline-danger"
            @click="showCommentModal = !showCommentModal"
        >Cancel</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<script>
import loansService from "@/views/commons/components/loans/services/loans.service";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "ModalRequestLoan",
  props: {
    info: {
      type: Object,
      required: true,
      default: () => ({
        show: false,
        idLoan: null,
        tab: null,
      }),
    },
  },
  created() {
    this.getInitialData();
  },
  mounted() {},
  data() {
    return {
      loan: {
        id_user: null,
        id_module: null,
        amount: 0,
        payment: null,
        motive: "",
        process: null,
        exchange: null,
        day_payment: 25,
        salary: null,
        interest: null,
      },
      selectedInterest: false,
      userData: null,
      isLoadData: false,
      vmoneyValidate: false,
      noSend: false,
      acceptOrDeny: {
        comment: "",
        status: null,
      },
      showCommentModal: false,
      dolar: {
        compra: 0,
        venta: 0,
      },
      vMoney: {
        decimal: ".",
        thousands: ",",
        prefix: "$",
        precision: 2,
        masked: false,
      },
      modalUp: false,
      module: this.$route.meta.module,
    };
  },
  computed: {
    ...mapGetters({
      bigWindow: "app/bigWindow",
      currentUser: "auth/currentUser",
      moduleId: "auth/moduleId",
      userSession: "auth/userSession",
      isSupervisor: "auth/isSupervisor",
      isCeo: "auth/isCeo",
    }),
    requestTitle() {
      return this.info.idLoan ? "Show Loan Request" : "Request New Loan";
    },
    isDataComplete() {
      return (
          this.userData &&
          this.userData.provision &&
          this.userData.userName &&
          this.userData.salary
      );
    },
    hideFooter() {
      return (
          !(
              !this.isLoanActive ||
              (this.isNotUserLoan &&
                  (this.isShowSupervisor || this.isShowRrhh || this.isShowManagement))
          ) || !this.isDataComplete
      );
    },
    isOverProvision() {
      return Number(this.loan.amount) > Number(this.userData.provision) / 2;
    },
    isLoanActive() {
      return this.info.idLoan != null;
    },
    isNotUserLoan() {
      return this.info.idLoan != null && this.loan.id_user != this.userSession;
    },
    isShowSupervisor() {
      return (
          (this.isSupervisor && this.loan.process == 1) ||
          (this.isCeo && this.loan.process == 1)
      );
    },
    cIsLoanActive() {
      return this.isLoanActive;
    },
    isSupervisorLoan() {
      return this.isSupervisor || this.isLoanActive;
    },

    isShowManagement() {
      return (
          (this.moduleId == 16 && this.loan.process == 2) ||
          (this.isCeo && this.loan.process == 2 && this.moduleId == 16)
      );
    },
    prefixSalary() {
      return this.userData.currency == 1 ? "$" : "S/.";
    },
  },
  methods: {
    hideModal(status) {
      this.info.idLoan = null;
      this.modalUp = false;
      this.$emit("hide", status);
    },

    //Open Initial Info Modal
    ifLoanActiveSelection() {
      if (this.isLoanActive) {
        this.loadDataLoan();
      } else {
        this.isLoadData = true;
        this.removePreloader();
        this.modalUp = true;
      }
    },
    async getInitialData() {
      let userData = await this.getUserData(this.currentUser.user_id);
      this.ifLoanActiveSelection();
    },
    async getUserData(userId) {
      try {
        this.addPreloader();
        const params = {
          id_user: userId,
          id_module: this.module,
        };
        let response = await loansService.getUserData(params);
        this.userData = response[0];
        this.userData.userName = response[0].userName;
        this.userData.superName = response[0].superName;
        this.userData.moduleName = response[0].moduleName;
        this.userData.roleName = response[0].roleName;
        this.userData.interest_real = response[0].interest_real;
      } catch (error) {
        this.showErrorSwal();
        this.removePreloader();
      }
    },
    async loadDataLoan() {
      try {
        let response = await loansService.getDataLoan(this.info.idLoan);
        this.loan = response[0];
        this.userData.currency = this.loan.currency;
        this.userData.currency_provision = this.loan.currency_provision;
        this.userData.exchange = this.loan.exchange;
        this.selectedInterest = Number(this.loan.interest) <= 0;
        this.userData.provision = this.loan.provision;
        this.userData.salary = this.loan.salary;
        this.loan.payment = parseInt(this.loan.payment);
        let user = await this.getUserData(this.loan.id_user);
        this.isLoadData = true;

        //Open Modal when request is finished
        this.modalUp = true;
        this.removePreloader();
      } catch (error) {
        this.showErrorSwal();
        this.removePreloader();
      }
    },

    //Send Request Loan
    async sendLoan() {
      this.vmoneyValidate = true;
      const validate = await this.$refs.form.validate();

      if (validate && !this.isOverProvision && !this.cIsLoanActive) {
        //Swal Comfirm
        const result = await this.showConfirmSwal();
        if (result.isConfirmed) {
          try {
            this.addPreloader();
            this.noSend = true;
            this.loan.interest = this.selectedInterest
                ? 0
                : this.userData.interest_real;
            const params = {
              id_user: this.userSession,
              id_module: this.moduleId,
              motive: this.loan.motive,
              amount: this.loan.amount,
              pay_day: 25,
              payment: this.loan.payment,
              exchange: this.loan.exchange,
              interest: this.loan.interest,
            };
            let response = await loansService.insertLoan(params);
            this.removePreloader();
            this.showSuccessSwal("Loan sent");
            this.hideModal(true);
          } catch (error) {
            this.noSend = false;
            this.hideModal(false);
            this.showErrorSwal("Loan not sent");
            this.removePreloader();
          }
        }
      }
    },

    //ACTIONS SUPERVISOR AND MANAGEMENT

    async changeStatus(status) {
      this.acceptOrDeny.status = status;

      const result = await this.showConfirmSwal();
      if (result.isConfirmed) {
        if (status == 2) {
          this.showCommentModal = true;
        } else {
          this.sendStatus();
        }
      }
    },
    sendComment() {
      const validate = this.$refs.comment.validate();
      if (validate) {
        this.sendStatus();
      }
    },
    async sendStatus() {
      let role_id = this.isShowSupervisor ? 2 : 3;
      const params = {
        id_loan: this.info.idLoan,
        id_user: this.userSession,
        motive: this.acceptOrDeny.comment,
        id_module: this.moduleId,
        status: this.acceptOrDeny.status,
        process: this.acceptOrDeny.status == 1 ? role_id : 2,
        rol: this.isShowSupervisor ? 2 : 4, // se cambio el 4 por el 3 que indicaba rrhh
      };

      if (this.acceptOrDeny.status == 1) {
        this.insertStatus(params);
        return;
      }
      if (this.acceptOrDeny.status == 2) {
        const confirm = await this.showConfirmSwal();
        if (confirm.isConfirmed) {
          this.insertStatus(params);
        }
      }
    },
    async insertStatus(params) {
      try {
        this.addPreloader();
        let response = await loansService.insertStatusLoan(params);
        this.showCommentModal = false;
        this.loan.process = params.rol;
        this.removePreloader();
        this.showSuccessSwal("Save");
        this.hideModal(true);
      } catch (error) {
        this.removePreloader();
        this.showErrorSwal();
      }
    },
  },
};
</script>

<style scoped>
.w-35 {
  width: 35% !important;
}
.badge-loan {
  font-size: 20px;
  margin-bottom: 0px;
  color: #ab9220;
}

.custom-radio
.custom-control-input:disabled:checked
~ .custom-control-label::before {
  background-color: rgb(99 99 99);
}
.add-class-campo-icon {
  text-align: left;
  padding: 5px 2px 5px 9px;
}
.mr4px {
  margin-right: 4px;
}
.bg-transparent {
  background-color: transparent !important;
}

.border-title-text {
  border-radius: 10px 10px 0px 0px;
  border: 1px solid #d8d6de;
}
margin-l-5 {
  margin-left: 5px !important;
}
</style>