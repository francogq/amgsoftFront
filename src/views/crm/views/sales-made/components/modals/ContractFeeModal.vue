<template>
  <validation-observer ref="form">
    <b-modal
      footer-class="px-50"
      id="crm-sm-modal-contract-fee"
      v-model="ownControl"
      title-class="h3 text-white font-weight-bolder"
      :size="modalSize"
      modal-class="modal-primary"
      title="Contract Fee"
      scrollable
      :hide-footer="valorEdit"
      @hide="closeModal(false)"
    >
      <b-container class="ml-1 pr-3">
        <program-client-header
          :client="contractFee.clientName"
          :program="contractFee.programName"
          class="sticky-top"
        />
        <b-row>
          <b-col cols="12" md="6">
            <b-row>
              <b-col class="d-flex align-items-center">
                <span>Fee:</span>
              </b-col>
              <b-col class="d-flex align-items-center">
                <span>$</span>
                <money
                  v-model="fee"
                  class="form-control border-0 text-right"
                  v-bind="{ precision: 2 }"
                  disabled
                />
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="d-flex align-items-center">
                <span>Initial Payment:</span>
              </b-col>
              <b-col class="d-flex align-items-center justify-content-between">
                <span>$</span>
                <span
                  v-if="contractFee.initialPaymentStatus != 2"
                  class="text-danger"
                >
                  Pending
                </span>
                <money
                  v-else
                  v-model="initialPayment"
                  class="form-control border-0 text-right"
                  v-bind="{ precision: 2 }"
                  disabled
                />
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col class="d-flex align-items-center">
                <span>Per pay</span>
              </b-col>
              <b-col class="d-flex align-items-center">
                <span>$</span>
                <money
                  v-model="perPay"
                  class="form-control border-0 text-right"
                  v-bind="{ precision: 2 }"
                  disabled
                />
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col cols="6" class="d-flex align-items-center">
                <span>Monthly Payment:</span>
              </b-col>
              <b-col
                cols="1"
                class="d-flex align-items-center justify-content-center"
              >
                <span>$</span>
              </b-col>
              <b-col class="d-flex align-items-center justify-content-between">
                <validation-provider
                  v-slot="{ errors }"
                  name="monthlyAmount"
                  rules="required|validate-amount"
                >
                  <money
                    v-model="monthlyAmount"
                    class="form-control text-right"
                    :class="{
                      'border-danger rounded':
                        errors[0] && monthlyPaymentController,
                    }"
                    v-bind="{ precision: 2 }"
                    :disabled="
                      contractSale.program_id == 2 ||
                      contractSale.program_id == 4 ||
                      valorEdit
                    "
                    @change.native="monthlyPaymentController = true"
                  />
                </validation-provider>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <b-form-checkbox
                  v-model="charge"
                  :disabled="valorEdit"
                  @change="changeCharge"
                >
                  Charge
                </b-form-checkbox>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <p class="text-center">Finished in {{ months }} months</p>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12" md="6" class="mt-1">
            <b-row>
              <b-col>
                <p>Method of Payment :</p>
              </b-col>
              <b-col>
                <validation-provider
                  v-slot="{ errors }"
                  name="methodPayment"
                  rules="required"
                  @change="methodPaymentController = true"
                >
                  <b-form-radio-group
                    v-model="methodPayment"
                    :options="[
                      { text: 'Credit Card', value: 0 },
                      { text: 'Others', value: 1 },
                    ]"
                    :disabled="valorEdit"
                    :class="[
                      'radio-group',
                      {
                        ' border-danger rounded':
                          errors[0] && methodPaymentController,
                      },
                    ]"
                  />
                </validation-provider>
              </b-col>
            </b-row>
            <b-row v-if="methodPayment == 0" class="mt-1">
              <b-col>
                <p>Type :</p>
              </b-col>
              <b-col>
                <validation-provider
                  v-slot="{ errors }"
                  name="cardType"
                  rules="required"
                >
                  <b-form-radio-group
                    v-model="cardType"
                    :options="[
                      { text: 'Automatic', value: 0 },
                      { text: 'Manual', value: 1 },
                    ]"
                    :disabled="valorEdit"
                    :class="{ 'border-danger rounded': errors[0] }"
                  />
                </validation-provider>
              </b-col>
            </b-row>
            <b-row v-if="cardType == 0 && methodPayment == 0" class="mt-1">
              <b-col
                cols="4"
                class="d-flex align-items-center justify-content-start"
              >
                Start Date :
              </b-col>
              <b-col class="d-flex align-items-center justify-content-center">
                <validation-provider
                  v-slot="{ errors }"
                  name="dayCfee"
                  rules="required"
                >
                  <b-form-select
                    v-model="dayCFee"
                    :options="paymentDays"
                    text-field="day"
                    :class="{ 'border-danger rounded': errors[0] }"
                    value-field="day"
                    style="margin-right: 5px"
                    size="sm"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="monthCfee"
                  style="margin-right: 2px; margin-left: 2px"
                  rules="required"
                >
                  <b-form-select
                    v-model="monthCFee"
                    size="sm"
                    :class="{ 'border-danger rounded': errors[0] }"
                    style="margin-right: 5px"
                  >
                    <b-form-select-option value="1"> Jan </b-form-select-option>
                    <b-form-select-option value="2"> Feb </b-form-select-option>
                    <b-form-select-option value="3"> Mar </b-form-select-option>
                    <b-form-select-option value="4"> Apr </b-form-select-option>
                    <b-form-select-option value="5"> May </b-form-select-option>
                    <b-form-select-option value="6"> Jun </b-form-select-option>
                    <b-form-select-option value="7"> Jul </b-form-select-option>
                    <b-form-select-option value="8"> Aug </b-form-select-option>
                    <b-form-select-option value="9"> Sep </b-form-select-option>
                    <b-form-select-option value="10">
                      Oct
                    </b-form-select-option>
                    <b-form-select-option value="11">
                      Nov
                    </b-form-select-option>
                    <b-form-select-option value="12">
                      Dec
                    </b-form-select-option>
                  </b-form-select>
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="yearCfee"
                  rules="required"
                >
                  <b-form-select
                    v-model="yearCFee"
                    :options="years"
                    size="sm"
                    :class="{ 'border-danger rounded': errors[0] }"
                  />
                </validation-provider>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
      <b-row v-if="cardType == 0" class="mt-1">
        <b-col>
          <b-row>
            <b-col>
              <b-table :items="cards" :fields="fieldsT1" size="sm" responsive>
                <template v-slot:cell(select)="data">
                  <b-form-radio
                    v-model="cardId"
                    :value="data.item.id"
                    :disabled="valorEdit"
                    plain
                  />
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-container class="ml-1">
            <b-row class="d-flex align-items-center justify-content-end mt-1">
              <b-col class="d-flex align-items-center justify-content-end">
                <b-button
                  class="mr-1"
                  v-if="!valorEdit"
                  variant="success"
                  size="sm"
                  @click="addCardModal = true"
                >
                  <feather-icon icon="PlusIcon" />Add
                </b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
      <template #modal-footer>
        <b-row class="w-100 p-0">
          <b-col class="d-flex align-items-center justify-content-end p-0">
            <b-button
              variant="primary"
              size="sm"
              :disabled="!cardId && methodPayment === 0 && cardType === 0"
              @click="saveContract"
            >
              Submit
            </b-button>
          </b-col>
        </b-row>
      </template>
      <modal-card-create
        v-if="addCardModal"
        :if-modal-card="addCardModal"
        :idlead="contractFee.id"
        :session="currentUser.user_id"
        @new="addCard"
        @click="closedModalCar"
      />
    </b-modal>
  </validation-observer>
</template>

<script>
import { mapGetters } from "vuex";
import ModalCardCreate from "@/views/crm/views/payments/components/ModalCardCreate.vue";
import ProgramClientHeader from "@/views/crm/views/sales-made/components/modals/ProgramClientHeader.vue";

export default {
  name: "ContractFeeModal",
  components: {
    ProgramClientHeader,
    ModalCardCreate,
  },
  props: {
    modal: {
      type: Object,
      default: () => ({
        contract_fee: false,
      }),
    },
    contractFee: {
      type: Object,
      default: () => ({
        programName: "",
        clientName: "",
        saleId: null,
        id: null,
        initialPaymentStatus: null,
        editModal: false,
        statusSale: null,
      }),
    },
  },
  data() {
    return {
      ownControl: false,
      cards: [],
      methodPayment: "",
      cardType: "",
      charge: true,
      paymentDays: [],
      contractSale: {},
      fee: 0,
      initialPayment: 0,
      perPay: 0,
      monthlyAmount: "",
      months: 0,
      fieldsT1: [
        {
          label: "",
          key: "select",
        },
        {
          label: "Card Holder Name",
          key: "cardholdername",
          thStyle: { minWidth: "174px !important" },
        },
        {
          label: "Card Number",
          key: "cardnumber",
          thStyle: { minWidth: "195px !important" },
          formatter: (value) => `XXXX-XXXX-XXXX-${value}`,
        },
        {
          label: "Type",
          key: "type_card",
        },
        {
          label: "MM",
          key: "card_expi_month",
        },
        {
          label: "YY",
          key: "card_expi_year",
        },
        {
          label: "CVC",
          key: "cardsecuritycode",
          formatter: (value) => `XX${value}`,
        },
      ],
      cardId: -1,
      addCardModal: false,
      years: [],
      yearCFee: null,
      dayCFee: null,
      monthCFee: null,
      methodPaymentController: false,
      monthlyPaymentController: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    modalSize() {
      if (this.screenWidth > 992) return "lg";
      return "xlg";
    },
    valorEdit() {
      return (
        this.contractFee.editModal == false ||
        this.contractFee.statusSale == 2 ||
        this.contractFee.statusSale == 4 ||
        this.contractSale.st == 1
      );
    },
  },
  watch: {
    monthlyAmount(val) {
      if (val > 0) {
        this.months = Math.ceil(this.perPay / this.monthlyAmount);
      }
    },
    cardType(val) {
      if (val === 0) {
        this.yearCFee = this.$moment()._d.getFullYear();
        this.monthCFee = this.$moment()._d.getMonth() + 2;
        if (this.monthCFee === 13) {
          this.monthCFee = 1;
          this.yearCFee += 1;
        }
      } else {
        this.yearCFee = "";
        this.monthCFee = "";
      }
    },
  },
  async created() {
    this.addPreloader();
    try {
      await this.getCards();
      await this.getPaymentsDays();
      await this.getContractSales();
      this.perPay = this.fee - this.initialPayment;
      if (this.contractSale.program_id == 2) {
        this.monthlyAmount = this.fee;
        this.months = 0;
      } else if (this.monthlyAmount > 0) {
        this.months = Math.ceil(this.perPay / this.monthlyAmount);
        if (this.months < 1) this.months = 0;
      }
      this.cardId = this.contractSale.card_id;
      const add = parseInt(this.$moment().format("MM"), 10) === 12 ? 1 : 0;
      this.years = this.range(2020, new Date().getFullYear() + add);
      this.removePreloader();
      this.ownControl = true;
    } catch (error) {
      this.showErrorSwal(error);
      this.removePreloader();
    }
  },
  methods: {
    closeModal(reload = false) {
      this.ownControl = false;
      this.$emit("close");
      if (reload) {
        this.$emit("reload");
      }
    },

    async saveContract() {
      this.monthlyPaymentController = true;
      this.methodPaymentController = true;
      const result = await this.$refs.form.validate();
      if (result) {
        const params = {
          card_id: this.cardId,
          charge: this.charge,
          day_payment: this.dayCFee,
          initial_amount: this.contractSale.initial_amount
            ? this.contractSale.initial_amount.toString()
            : "",
          method_payment:
            this.methodPayment === 0 || this.methodPayment === 1
              ? this.methodPayment.toString()
              : "",
          month_cfee: this.monthCFee,
          monthly_amount: this.monthlyAmount
            ? this.monthlyAmount.toString()
            : "",
          months: this.months,
          sale_id: this.contractFee.saleId,
          type_payment:
            this.cardType === 0 || this.cardType === 1
              ? this.cardType.toString()
              : "",
          year_cfee: this.yearCFee ? this.yearCFee.toString() : "",
        };
        this.addPreloader();
        try {
          const response = await amgApi.post(
            "/sales-made/insert-contract",
            params
          );
          if (response.status === 200) {
            this.removePreloader();
            await this.showSuccessSwal("Contract save succesfully");
            this.closeModal(true);
          } else {
            this.removePreloader();
            await this.showErrorSwal();
            this.closeModal(false);
          }
        } catch (error) {
          this.removePreloader();
          await this.showErrorSwal();
          this.closeModal(false);
        }
      }
    },
    async getCards() {
      try {
        this.cards = await window.amgApi.post("/clients/search-cards-clients", {
          id: this.contractFee.id,
        });
        if (this.cards.status === 200) {
          this.cards = this.cards.data;
        } else {
          this.showErrorSwal();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getPaymentsDays() {
      try {
        this.paymentDays = await amgApi.get("/commons/get-payment-days");
        if (this.paymentDays.status === 200) {
          this.paymentDays = this.paymentDays.data;
        } else {
          this.showErrorSwal();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getContractSales() {
      try {
        const data = await amgApi.post("/sales-made/get-contract-sales", {
          id: this.contractFee.saleId,
        });
        if (data.status === 200) {
          [this.contractSale] = data.data;
          this.fee = parseFloat(this.contractSale.fee);
          this.initialPayment = parseFloat(this.contractSale.initial_amount);
          if (this.contractSale.program_id == 2) this.monthlyAmount = this.fee;
          else {
            this.monthlyAmount = parseFloat(this.contractSale.monthly_amount);
          }
          this.methodPayment = this.contractSale.method_payment;
          this.cardType = this.contractSale.type_payment;
          this.dayCFee = this.contractSale.day_payment;
          this.yearCFee = this.contractSale.year_payment;
          this.monthCFee = this.contractSale.month_payment;
        } else {
          this.showErrorSwal();
        }
      } catch (error) {
        console.error(error);
      }
    },
    addCard(cards) {
      this.cards = cards;
    },
    closedModalCar() {
      this.addCardModal = false;
    },
    async changeCharge(checked) {
      if (checked === false) {
        const response = await this.showConfirmSwal(
          "Desactivate Charge",
          "Are you sure to desactivate the charge?"
        );
        if (!response.isConfirmed) this.charge = !this.charge;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
input:disabled {
  background-color: transparent;
}
</style>
