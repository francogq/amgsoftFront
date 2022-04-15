<template>
  <b-card no-body>
    <h4 class="title-card">Cards</h4>

    <slot name="errors" />

    <div class="col-lg-12 px-0 mt-1">
      <div>
        <div>
          <div style="margin-bottom: 0">
            <b-table
              slot="table"
              no-provider-filtering
              ref="refClientsList"
              primary-key="id"
              table-class="text-nowrap"
              responsive="sm"
              show-empty
              sticky-header="30vh"
              :items="cards"
              :fields="fields"
            >
              <template #cell(Select)="data">
                <ValidationProvider
                  name="comment"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <b-form-radio
                    class="vs-checkbox-con"
                    :class="{ 'border-required': errors[0] }"
                    :value="data.item.id"
                    @change="$emit('CardId', data.item.id)"
                    v-model="selected"
                    plain
                  >
                  </b-form-radio>
                </ValidationProvider>
              </template>
              <template #cell(cardnumber)="data">
                <div
                  :class="classByColumn"
                >
                  <span> {{ "XXXX-XXXX-XXXX-" + data.item.cardnumber }} </span>
                </div>
              </template>
              <template #cell(cardsecuritycode)="data">
                <div
                  :class="classByColumn"
                >
                  <span>
                    {{
                      data.item.cardsecuritycode.length == 3
                        ? "XX" + data.item.cardsecuritycode.substr(2)
                        : "XXX" + data.item.cardsecuritycode.substr(3)
                    }}
                  </span>
                </div>
              </template>
            </b-table>
          </div>
        </div>
      </div>
      <!-- Buttton ADD -->
      <div class="col-lg-12 text-right pr-0 mt-4">
        <b-button
          type="button"
          variant="primary"
          class="btn rounded float-right btn-orange"
          @click="openModalCreateCard"
        >
          <feather-icon icon="PlusCircleIcon" size="15"></feather-icon> ADD
        </b-button>
      </div>
    </div>
    <!-- Modal Create Card -->
    <modal-card-create
      v-if="modalCreateCard"
      :ifModalCard="modalCreateCard"
      @click="closeModalCreateCard"
      :session="cardsLead.user_id"
      :idlead="cardsLead.lead_id"
      @new="addCard"
    ></modal-card-create>
  </b-card>
</template>
<script>
// Import Services
import PaymentService from "../service/payments.service";
// Import Modal
import ModalCardCreate from "@/views/crm/views/payments/components/ModalCardCreate.vue";
// Import Data
import fields from "../data/fields.credit.card";
export default {
  components: {
    ModalCardCreate,
  },
  props: {
    cardsLead: {
      type: Object,
      default: () => ({}),
    },
  },
  data:function() {
    return {
      selected: null,
      //More information
      cards: [],
      modalCreateCard: false,
      modalCard: false,
      deletecardmodal: false,
      card_id: "",
      fields: fields,
    };
  },
  computed:{
    classByColumn(){
      return "d-flex flex-column justify-content-start align-items-start"
    }
  },
  created:function() {
    this.searchcards();
  },
  methods: {
    //Cards
    openModalCreateCard:function() {
      this.modalCreateCard = true;
    },
    closeModalCreateCard:function() {
      this.modalCreateCard = false;
    },

    addCard:function(cards) {
      this.cards = cards;
    },
    closeModalCard() {
      this.modalCard = false;
    },

    openmodaldeletecard(id) {
      this.card_id = id;
      this.deletecardmodal = true;
    },
    closedModalDeleteCar() {
      this.deletecardmodal = false;
    },
    async searchcards() {
      try {
        const data = await PaymentService.searchcards({
          id: this.cardsLead.lead_id,
        });
        this.cards = data;
      } catch (error) {
        console.log(error);
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "Something went wrong!"
        );
      }
    },
  },
};
</script>

<style scoped>
.w-pre {
  width: 32% !important;
}
.w-100 {
  width: 100% !important;
}

.w-15 {
  width: 15.5% !important;
}

.border-required {
  width: 22px;
  height: 22px;
  border: 1px red solid;
  border-radius: 50%;
  display: flex;
  justify-content: center !important;
}
</style>
