<template>
  <b-card body-class="px-0">
    <template #header>
      <b-card-title>{{ title ? title : `Credit Cards` }}</b-card-title>
    </template>
    <b-table
      show-empty
      sticky-header
      striped
      responsive="sm"
      :fields="fieldsTask"
      :items="statusLeadCards"
      class="mb-0"
      small
    >
      <template #cell(cardholdername)="data">
        <span class="text-capitalize">{{ data.item.cardholdername }}</span>
      </template>

      <template #cell(cardnumber)="data">{{
        "XXXX-XXXX-XXXX-" + data.item.cardnumber
      }}</template>

      <template #cell(cardsecuritycode)="data">{{
        data.item.cardsecuritycode.length === 3
          ? "XX" + data.item.cardsecuritycode.substr(2)
          : "XXX" + data.item.cardsecuritycode.substr(3)
      }}</template>

      <template #cell(actions)="data">
        <div class="d-flex justify-content-center">
          <b-button
            variant="flat-info"
            class="button-little-size rounded-circle"
            :disabled="isActionButtonLoading || isLoading"
            @click="onModalCardOpen(data.item.id)"
          >
            <feather-icon
              v-if="!isActionButtonLoading && !isLoading"
              icon="EyeIcon"
            />
            <b-spinner v-else small />
          </b-button>
          <b-button
            v-if="(authUser.role_id == 1 || authUser.role_id == 2) && !onlyRead"
            variant="flat-danger"
            class="button-little-size rounded-circle ml-1"
            :disabled="isActionButtonLoading || isLoading"
            @click="onDeleteCard(data.item.id)"
          >
            <feather-icon
              v-if="!isActionButtonLoading && !isLoading"
              icon="Trash2Icon"
            />
            <b-spinner v-else small />
          </b-button>
        </div>
      </template>
    </b-table>

    <template v-if="!onlyRead" #footer>
      <div class="text-right">
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="primary"
          @click="$bvModal.show(`modal-card-create-${key}`)"
        >
          <span class="align-middle">Add</span>
        </b-button>
      </div>
    </template>

    <!-- modal CARD CREATE -->
    <b-modal
      :id="`modal-card-create-${key}`"
      modal-class="modal-primary"
      title-class="h3 text-white"
      centered
      size="lg"
      title="Create Credit Card"
      hide-footer
      no-close-on-backdrop
    >
      <!-- <modal-card-create
        :modul="modul"
        :only-read="onlyRead"
        :lead="lead"
        @onReloadCards="onReloadCards"
      />-->
      <modal-card-new-create
        :modul="modul"
        :only-read="onlyRead"
        :lead="lead"
        @onReloadCards="onReloadCards"
        @closeModalCard="$bvModal.hide(`modal-card-create-${key}`)"
        @reloadLeadEmit="reloadLeadEmit()"
      ></modal-card-new-create>
    </b-modal>

    <!-- modal CARD SHOW -->
    <b-modal
      v-model="viewCardModal"
      ok-only
      modal-class="modal-primary"
      title-class="h3 text-white"
      centered
      size="lg"
      title="Credit Card"
      hide-footer
      no-close-on-backdrop
    >
      <modal-card-show
        :modul="modul"
        :only-read="onlyRead"
        :lead="lead"
        :card="card"
      />
    </b-modal>
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";

import ModalCardShow from "../../lead-card/ModalCardShow.vue";
import ModalCardCreate from "../../lead-card/ModalCardCreate.vue";
import ModalCardNewCreate from "../../lead-card/ModalCardNewCreate.vue";
export default {
  components: {
    ModalCardShow,
    ModalCardCreate,
    ModalCardNewCreate,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      updatedCards: "CrmCreditCardStore/LISTCARDS",
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
    ...mapState({
      /* S_TEMPLATES: event => event.CrmTemplateStore.S_TEMPLATES */
    }),
    statusLeadCards() {
      return this.updatedCards != null ? this.updatedCards : this.lead.cards;
    },
  },
  created() {
    this.authUser = this.currentUser;
    this.getStatesEeuu();
  },
  directives: { Ripple },
  data() {
    return {
      viewCardModal: false,
      key: Math.random(),
      authUser: new Object(),
      card: new Object(),
      fieldsTask: [
        { key: "cardholdername", label: "Card Holder Name", tdClass: "py-1" },
        { key: "cardnumber", label: "Card Number", tdClass: "py-1" },
        { key: "type_card", label: "Type", tdClass: "py-1" },
        { key: "card_expi_month", label: "MM", tdClass: "py-1" },
        { key: "card_expi_year", label: "YY", tdClass: "py-1" },
        { key: "cardsecuritycode", label: "CVV", tdClass: "py-1" },
        { key: "actions", tdClass: "py-1" },
      ],
      isActionButtonLoading: false,
      isLoading: false,
    };
  },
  methods: {
    ...mapActions({
      A_GET_EEUU_STATES: "CrmGlobalStore/A_GET_EEUU_STATES",
      A_GET_CREDIT_CARD: "CrmCreditCardStore/A_GET_CREDIT_CARD",
      A_DELETE_CREDIT_CARD: "CrmCreditCardStore/A_DELETE_CREDIT_CARD",
      SET_DATA_CARDS_UPDATE: "CrmCreditCardStore/SET_DATA_CARDS_UPDATE",
    }),
    reloadLeadEmit() {
      this.$emit("reloadLead");
    },
    async getStatesEeuu() {
      try {
        await this.A_GET_EEUU_STATES();
      } catch (error) {
        console.log("Something went wrong getStatesEeuu", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async onModalCardOpen(id) {
      try {
        this.isActionButtonLoading = true;
        const response = await this.A_GET_CREDIT_CARD({ id });
        if (this.isResponseSuccess(response)) {
          this.card = response.data[0];
          this.viewCardModal = true;
        } else
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            `Something went wrong. ${response.message}`
          );
        this.isActionButtonLoading = false;
      } catch (error) {
        console.log("Something went wrong onModalCardOpen", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isActionButtonLoading = false;
      }
    },
    onReloadCards(cards) {
      // this.lead.cards = cards;
      this.SET_DATA_CARDS_UPDATE(cards);
      this.lead.cards = this.updatedCards;
    },
    onDeleteCard(id) {
      this.isActionButtonLoading = true;
      this.showConfirmSwal(
        "Delete Credit Card",
        "You won't be able to revert this!",
        {
          input: "textarea",
          inputValidator: (value) => {
            if (!value) {
              return "You need to write something!";
            }
          },
        }
      )
        .then(async (result) => {
          if (result.value) {
            const response = await this.A_DELETE_CREDIT_CARD({
              cardid: id,
              leadid: this.lead.id,
              user_id: this.authUser.user_id,
              comment: result.value,
            });
            if (this.isResponseSuccess(response)) {
              this.lead.cards = response.data;
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
              this.isActionButtonLoading = false;
            } else {
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                `Something went wrong. ${response.message}`
              );
              this.isActionButtonLoading = false;
            }
          }
          this.isActionButtonLoading = false;
        })
        .catch((error) => {
          console.log("Something went wrong onDeleteCard", error);
          this.showToast(
            "danger",
            "top-right",
            "Oop!",
            "AlertOctagonIcon",
            this.getInternalErrors(error)
          );
          this.isActionButtonLoading = false;
        });
    },
  },
  mounted() {},
  props: {
    modul: {
      type: Number,
      required: true,
    },
    onlyRead: {
      type: Boolean,
      required: true,
    },
    lead: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
  },
  setup() {},
};
</script>
