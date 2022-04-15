<template>
  <b-modal
    id="crm-sm-modal-initial-payment"
    v-model="ownControl"
    title-class="h3 text-white font-weight-bolder"
    :size="modalSize"
    title="Initial Payment"
    scrollable
    modal-class="modal-primary"
    @hide="hideModal"
  >
    <b-container class="ml-1 pr-3">
      <program-client-header
        :client="initial_payment.nameClient"
        :program="initial_payment.nameProgram"
        class="sticky-top mt-1"
        :class="{
          'bg-background-dark': skin === 'dark',
          'bg-white': skin !== 'dark',
        }"
      />
      <b-row>
        <b-col sm="6" cols="12">
          <label>Amount</label>
          <b-input-group prepend="$">
            <money
              v-model="amount"
              class="form-control"
              v-bind="{ decimal: '.', thousands: ',', precision: 2 }"
              :disabled="amount_camp"
            />
          </b-input-group>
        </b-col>
        <b-col sm="6" cols="12">
          <label class="mt-1">Method of Payment</label>
          <b-form-radio-group
            v-model="method"
            :options="[
              { text: 'Credit Card', value: 'credit-card' },
              { text: 'Others', value: 'others' },
            ]"
            class="d-flex"
            :disabled="valorEdit"
          >
            <b-checkbox
              v-if="method === 'credit-card'"
              v-model="charge"
              :disabled="valorEdit"
              >Charge</b-checkbox
            >
          </b-form-radio-group>
        </b-col>
      </b-row>
    </b-container>
    <div
      v-if="
        (method === 'credit-card' &&
          listCards.length === 0 &&
          initial_payment.id_transaction != null) ||
        (method === 'credit-card' && this.initial_payment.programid == 2)
      "
      class="mt-3 margin-0"
    >
      <b-table
        small
        :fields="fieldsT1"
        :items="initial_payment.allcards"
        responsive
      >
        <template v-slot:cell(select)="data">
          <b-form-radio
            :ref="'campo' + data.item.id"
            v-model="cardId"
            :value="data.item.id"
            :disabled="valorEdit"
            plain
          />
        </template>
        <template v-slot:cell(actions)="data">
          <b-button
            :disabled="
              (initial_payment.role_id == 1 || initial_payment.role_id == 2) &&
              initial_payment.modul == 2
                ? false
                : true
            "
            class="btn-icon ml-1"
            variant="flat-danger"
            size="sm"
            @click="deleteCard(data.item.id)"
          >
            <feather-icon icon="Trash2Icon" />
          </b-button>
        </template>
      </b-table>
    </div>
    <div
      v-if="
        method === 'credit-card' &&
        initial_payment.cfeestatus == 0 &&
        initial_payment.programid != 2
      "
      class="mt-1 margin-0"
    >
      <b-table
        small
        :fields="fieldsT2"
        :items="initial_payment.allcards"
        responsive
      >
        <template v-slot:cell(amount)="data">
          <b-input-group style="min-width: 130px !important">
            <money
              :ref="'campo' + data.item.id"
              v-model="data.item.model"
              class="form-control form-control-sm"
              v-bind="{
                decimal: '.',
                thousands: ',',
                precision: 2,
                prefix: '$  ',
              }"
              :disabled="initial_payment.cfeestatus == 0 ? false : true"
            />
            <b-input-group-append>
              <b-button
                class="btn-icon"
                variant="success"
                :disabled="initial_payment.cfeestatus == 0 ? false : true"
                size="sm"
                @click="savePayment(data.item.id, 'campo' + data.item.id)"
              >
                <feather-icon icon="CreditCardIcon" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </template>
        <template v-slot:cell(sms)="data">
          <b-form-checkbox :ref="'sms' + data.item.id" :checked="true" />
        </template>
        <template v-slot:cell(actions)="data">
          <b-button
            :disabled="
              (initial_payment.role_id == 1 || initial_payment.role_id == 2) &&
              initial_payment.modul == 2
                ? false
                : true
            "
            class="btn-icon"
            variant="flat-danger"
            size="sm"
            @click="deleteCard(data.item.id)"
          >
            <feather-icon icon="Trash2Icon" />
          </b-button>
        </template>
      </b-table>
    </div>
    <b-container class="pl-2 pr-2 margin-0">
      <b-row
        v-if="method === 'credit-card' && initial_payment.cfeestatus == 0"
        class="align-items-center justify-content-between"
      >
        <b-col class="text-left">
          <b-form-checkbox
            ref="smsgeneral"
            :class="{
              'hide-visible': !(
                (method === 'credit-card' &&
                  listCards.length === 0 &&
                  initial_payment.idtransaction != null) ||
                (method === 'credit-card' && initial_payment.programid == 2)
              ),
            }"
          >
            Send SMS
          </b-form-checkbox>
        </b-col>
        <b-col class="text-right">
          <b-button variant="success" size="sm" @click="createCard">
            <feather-icon icon="PlusIcon" class="mr-50" />
            Add
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <div
      v-if="method === 'credit-card' && listCards.length > 0"
      class="mt-3 margin-0"
    >
      <b-table :fields="fieldsT3" :items="listCards" small responsive />
    </div>
    <b-row
      v-if="
        valorEdit &&
        method_payment == 1 &&
        initial_payment.valorInitalPaymetn == 2
      "
    >
      <b-col>
        <v-select
          v-model="initial_payment.payments.type_payment"
          :options="typesOption"
          :disabled="valorEdit"
        />
      </b-col>
      <b-col v-if="initial_payment.payments.type_payment == 5">
        <b-form-input
          v-model="initial_payment.payments.specify"
          :disabled="valorEdit"
        />
      </b-col>
    </b-row>
    <template #modal-footer>
      <b-row class="d-flex align-items-center justify-content-end w-100">
        <b-button
          v-if="
            (valorEdit != true && amount_camp == false) ||
            (valorEdit != true && initial_payment.programid == 2)
          "
          variant="primary"
          :disabled="
            (initial_payment.allcards.length === 0 &&
              method === 'credit-card') ||
            (!cardId && method === 'credit-card')
          "
          @click="savePayment"
        >
          Submit
        </b-button>
      </b-row>
    </template>
    <delete-card-modal
      v-if="deletecardmodal"
      :if-modal-card="deletecardmodal"
      :card_id="cardId"
      :lead_id="initial_payment.payments.lead_id"
      :session="initial_payment.sessionId"
      @click="deletecardmodal = false"
      @new="addCard"
    />
    <modal-card-create
      v-if="createmodal"
      :if-modal-card="createmodal"
      :idlead="initial_payment.payments.lead_id"
      :session="initial_payment.sessionId"
      @new="addCard"
      @click="closedModalCar"
    />
  </b-modal>
</template>

<script>
import vSelect from "vue-select";
import CrmService from "@/views/crm/services/crm.service";
import ModalCardCreate from "@/views/crm/views/payments/components/ModalCardCreate.vue";
import DeleteCardModal from "@/views/crm/views/sales-made/components/modals/DeleteCardModal.vue";
import ProgramClientHeader from "@/views/crm/views/sales-made/components/modals/ProgramClientHeader.vue";
import { mapGetters } from "vuex";

export default {
  name: "InitialPaymentModal",
  components: {
    ProgramClientHeader,
    DeleteCardModal,
    ModalCardCreate,
    vSelect,
  },
  props: {
    modal: {
      type: Object,
      required: true,
    },
    initial_payment: {
      type: Object,
      required: true,
      default: () => ({
        payments: null,
        nameProgram: null,
        nameClient: null,
        type: null,
        editmodal: null,
        statusSale: null,
        sessionId: null,
        valorInitalPaymetn: null,
        feeprops: null,
        modul: null,
        cfeestatus: null,
        idtransaction: null,
        programid: null,
        allcards: null,
        role_id: null,
      }),
    },
  },
  data() {
    return {
      method: "",
      deletecardmodal: false,
      amount: this.initial_payment.payments.amount
        ? this.initial_payment.payments.amount
        : 0,
      charge: true,
      listCards: [],
      cardId: "",
      typesOption: [
        {
          label: "Cash",
          code: 1,
        },
        {
          label: "Check",
          code: 2,
        },
        {
          label: "Money Order",
          code: 3,
        },
        {
          label: "Cashier Check",
          code: 4,
        },
        {
          label: "Others",
          code: 5,
        },
      ],
      createmodal: false,
      fieldsT1: [
        {
          label: "",
          key: "select",
        },
        {
          label: "Card Holder Name",
          key: "cardholdername",
          thStyle: { minWidth: "140px !important" },
        },
        {
          label: "Card Number",
          key: "cardnumber",
          formatter: (value) => `XXXX-XXXX-XXXX-${value}`,
          thStyle: { minWidth: "160px !important" },
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
        {
          label: "Actions",
          key: "actions",
        },
      ],
      fieldsT2: [
        {
          label: "Amount",
          key: "amount",
        },
        {
          label: "SMS",
          key: "sms",
        },
        {
          label: "Card Holder Name",
          key: "cardholdername",
          thStyle: { minWidth: "135px !important" },
        },
        {
          label: "Card Number",
          key: "cardnumber",
          formatter: (value) => `XXXX-XXXX-XXXX-${value}`,
          thStyle: { minWidth: "152px !important" },
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
        {
          label: "Actions",
          key: "actions",
        },
      ],
      fieldsT3: [
        {
          label: "Transaction ID",
          key: "transaction_id",
          thStyle: { minWidth: "120px !important" },
        },
        {
          label: "Amount",
          key: "amount",
          formatter: (value) => `$ ${value}`,
          thStyle: { minWidth: "90px !important" },
        },
        {
          label: "Credit Card",
          key: "card_number",
          thStyle: { minWidth: "110px !important" },
        },
        {
          label: "User",
          key: "user",
          thStyle: { minWidth: "100px !important" },
        },
        {
          label: "Date",
          key: "settlement_date",
          formatter: (value) => this.$options.filters.myGlobalDay(value),
          thStyle: { minWidth: "160px !important" },
        },
      ],
      notApiCards: false,
      reloadTable: false,
      ownControl: false,
      amount2: 0,
    };
  },
  computed: {
    ...mapGetters({
      skin: "appConfig/skin",
    }),
    modalSize() {
      if (this.screenWidth > 992) return "lg";
      return "xlg";
    },
    valorEdit() {
      return (
        this.initial_payment.type == 1 ||
        this.initial_payment.editmodal == false ||
        this.initial_payment.statusSale == 2 ||
        this.initial_payment.statusSale == 4 ||
        this.initial_payment.valorInitalPaymetn != 1
      );
    },
    amount_camp() {
      return this.method === "credit-card" || this.method === "";
    },
    method_payment() {
      return this.method === "credit-card" ? 0 : 1;
    },
  },
  async mounted() {
    this.method =
      this.initial_payment.payments.type_payment == null ||
      this.initial_payment.payments.type_payment == 0
        ? "credit-card"
        : "others";
    await this.getListCards();
    // eslint-disable-next-line no-return-assign
    this.initial_payment.allcards.map((val) => (val.model = 0));
    this.ownControl = true;
    this.removePreloader();
  },
  methods: {
    createCard() {
      this.createmodal = true;
    },
    closedModalCar() {
      this.createmodal = false;
    },
    deleteCard(id) {
      this.cardId = id;
      this.deletecardmodal = true;
    },
    async getListCards() {
      try {
        this.listCards = await CrmService.getListCards({
          sale_id: this.initial_payment.payments.sale_id,
        });
      } catch (error) {
        this.showToast("danger", "top-right", "Error", "XIcon", error);
        this.modal.initial_payment = false;
      }
    },
    openModalCreateCard() {
      this.modalCard = true;
    },
    closeModalCreateCard() {
      this.modalCard = false;
    },
    addCard(cards) {
      this.initial_payment.allcards = cards;
    },
    async savePayment(cardId, ref) {
      let refCard = ref;
      if (this.initial_payment.programid != 2) {
        this.cardId = cardId;
      } else {
        refCard = "campo1";
      }
      if (this.method_payment == 0 && this.initial_payment.programid != 2) {
        this.amount2 = this.$refs[refCard].$el.value;
        this.amount2 = this.amount2.replace(this.$refs[refCard].prefix, "");
      } else {
        this.amount2 = this.amount;
      }
      if (this.amount2 == null) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "Invalid amount value"
        );
      } else if (this.method_payment == null) {
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "Method payment invalid"
        );
      } else if (this.method_payment == 0 || this.method_payment == 1) {
        await this.sendValidatePayment(this.method_payment, refCard, cardId);
      }
    },
    async sendValidatePayment(type, refCard, cardId) {
      try {
        let sms = null;
        if (this.method_payment == 0) {
          if (this.initial_payment.programid != 2) {
            sms = this.$refs[`sms${cardId}`].isChecked;
          } else {
            sms = this.$refs.smsgeneral.isChecked;
          }
        }
        if (type == 0) {
          const result = await this.showConfirmSwal();
          if (result.value) {
            this.addPreloader();
            this.sendMessage = true;
            const response = await amgApi.post(
              "/note/first-note/save-initial",
              {
                amount: this.amount2.toString(),
                idcard: this.cardId,
                method_payment: this.method_payment.toString(),
                specify: this.initial_payment.payments.specify,
                sale_id: this.initial_payment.payments.sale_id,
                user_id: this.initial_payment.sessionId,
                program_id: this.initial_payment.payments.program_id,
                // modul: this.initial_payment.modul,
                charge: this.charge == true ? 0 : 1,
                sendsms: sms === true ? 1 : 0,
                min_ip: this.initial_payment.payments.min_ip,
              }
            );
            if (response.status === 200) {
              this.removePreloader();
              if (response.data.transaction.responseCode === "1") {
                const res = await this.showSuccessSwal();
                if (res.value) {
                  this.amount = response.data.data;
                  if (response.data.alert_min_initial) {
                    this.showToast(
                      "warning",
                      "top-right",
                      "Warning",
                      "XIcon",
                      "The minimum amount for this program is $" +
                        this.initial_payment.payments.min_ip
                    );
                  }
                  if (this.initial_payment.programid != 2)
                    this.$refs[refCard].$el.value = "$ 0.00";
                  await this.getListCards();
                  this.reloadTable = true;
                  if (this.initial_payment.programid == 2) {
                    this.hideModal();
                  }
                }
              } else {
                const errorsAuthorize = response.data.transaction.errors.error;
                this.showErrorSwal(this.getAuthorizeErrors(errorsAuthorize));
              }
            } else {
              this.removePreloader();
            }
          } else {
            this.removePreloader();
          }
        } else {
          const result = await this.showConfirmSwal();
          if (result.value) {
            this.sendMessage = true;
            this.addPreloader();
            const response = await amgApi.post(
              "/note/first-note/save-initial-others",
              {
                amount: this.amount.toString(),
                idcard: this.cardId,
                method_payment: this.method_payment.toString(),
                specify: this.initial_payment.payments.specify,
                sale_id: this.initial_payment.payments.sale_id,
                user_id: this.initial_payment.sessionId,
                program_id: this.initial_payment.payments.program_id,
              }
            );
            if (response.status === 200) {
              this.removePreloader();
              this.sendMessage = false;
              const res = await this.showSuccessSwal();
              this.reloadTable = true;
              if (res.value) {
                this.hideModal();
              }
            }
          } else {
            this.removePreloader();
          }
        }
      } catch (error) {
        this.removePreloader();
        this.showErrorSwal(error);
      }
    },
    hideModal() {
      this.ownControl = false;
      this.$emit("close", this.reloadTable);
    },
  },
};
</script>

<style lang="scss" scoped>
.hide-visible {
  visibility: hidden;
}

.modal-body {
  padding: 1px 0px !important;
}

.bg-background-dark {
  background-color: #17171a !important;
}
</style>
