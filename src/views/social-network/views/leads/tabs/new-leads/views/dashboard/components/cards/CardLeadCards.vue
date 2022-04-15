<template>
  <b-card body-class="px-0">
    <template #header>
      <b-card-title class="card-title-address">
        <div>Credit Cards</div>
      </b-card-title>
    </template>
    <template #footer>
      <div class="text-right">
        <b-button
          variant="primary"
          class="float-right mt-2 mr-2"
          @click="openModalCreateCard"
        >
          <feather-icon icon="PlusIcon"></feather-icon>
          ADD
        </b-button>
      </div>
    </template>
    <b-table small :fields="table.fields" :items="cards" sticky-header="250px">
      <template #cell(card_number)="data">
        {{ "XXXX-XXXX-XXXX-" + data.item.cardnumber }}
      </template>

      <template #cell(cvc)="data">
        {{
          data.item.cardsecuritycode.length == 3
            ? "XX" + data.item.cardsecuritycode.substr(2)
            : "XXX" + data.item.cardsecuritycode.substr(3)
        }}
      </template>

      <template #cell(actions)="data">
        <b-button
          size="sm"
          variant="flat-info"
          class="btn-icon rounded-circle"
          @click="openModalViewCard(data.item.id)"
        >
          <feather-icon icon="EyeIcon"></feather-icon>
        </b-button>
        <b-button
          size="sm"
          variant="flat-danger"
          class="btn-icon rounded-circle"
          @click="deleteCard(data.item.id)"
        >
          <feather-icon icon="TrashIcon"></feather-icon>
        </b-button>
      </template>
    </b-table>

    <modal-create-card
      v-if="showModalCreateCard"
      :lead="lead"
      @onSavedCard="reloadCards"
      @onClose="closeModalCreateCard"
    ></modal-create-card>

    <modal-view-card
      v-if="showModalViewCard"
      :modul="modul"
      :type="2"
      :card="card"
      :isEditable="false"
      @onClose="closeModalViewCard"
    ></modal-view-card>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";

// Components
import ModalCreateCard from "@/views/commons/components/credit-cards/ModalCreateCard.vue";
import ModalViewCard from "@/views/commons/components/credit-cards/ModalViewCard.vue";

// Services
import SNLeadsService from "@/views/social-network/services/leads";
import CreditCardService from "@/views/crm/services/creditCard";

export default {
  props: {
    lead: {
      type: Object,
    },
    cardsLead: {
      type: Object,
      default: () => ({}),
    },
    modul: {
      type: Number,
    },
  },
  components: {
    ModalCreateCard,
    ModalViewCard,
  },
  data() {
    return {
      table: {
        fields: [
          { key: "cardholdername", label: "Card Holder Name" },
          { key: "card_number", label: "Card Number" },
          { key: "type_card", label: "Type" },
          { key: "card_expi_month", label: "MM" },
          { key: "card_expi_year", label: "YY" },
          { key: "cvc", label: "CVC" },
          { key: "actions", label: "Actions" },
        ],
      },

      //More information
      statesCard: [],
      states_leads: [],
      dragCount: 0,
      cards: [],
      card_id: "",
      card: {},

      // Modals
      showModalCreateCard: false,
      showModalViewCard: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    isSupervisor() {
      return this.cardsLead.rol == 1 || this.cardsLead.rol == 2;
    },
  },
  methods: {
    openModalCreateCard() {
      this.showModalCreateCard = true;
    },
    closeModalCreateCard() {
      this.showModalCreateCard = false;
    },
    async openModalViewCard(id) {
      try {
        const response = await CreditCardService.getCreditCard({
          id: id,
        });

        if (response.status == 200) {
          this.card = response.data[0];
          this.showModalViewCard = true;
        }
      } catch (error) {
        throw error;
      }
    },
    closeModalViewCard() {
      this.showModalViewCard = false;
    },
    reloadCards(cards) {
      this.cards = cards;
    },
    deleteCard(id) {
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
            const response = await CreditCardService.deleteCreditCard({
              cardid: id,
              leadid: this.lead.id,
              user_id: this.currentUser.user_id,
              comment: result.value,
            });

            if (response.status == 200) {
              this.cards = response.data;
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
    async getCards() {
      try {
        let leadId = this.$route.params.id;

        const response = await SNLeadsService.getClientCards({
          id: leadId,
        });

        if (response.status == 200) {
          this.cards = response.data;
        }
      } catch (error) {
        throw error;
      }
    },
  },
  async created() {
    await this.getCards();
  },
};
</script>

<style scoped>
</style>
