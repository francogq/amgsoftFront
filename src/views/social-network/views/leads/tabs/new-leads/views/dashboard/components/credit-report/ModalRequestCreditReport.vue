<template>
  <div>
    <b-modal
      v-model="show"
      title="Request CR"
      title-tag="h3"
      hide-footer
      size="lg"
      @hidden="close"
    >
      <div>
        <validation-observer ref="form">
          <b-row>
            <b-col cols="12">
              <span class="text-orange ml-2" v-if="form.dob == null">
                Please fill date of birth to get Credit Report
              </span>
              <b-row>
                <b-col md="12">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <input
                      type="text"
                      v-model="form.type_card"
                      class="d-none"
                    />
                    <b-row>
                      <b-col
                        class="font-bureau-style text-gray-light m-auto"
                        cols="4"
                      >
                        <span :class="{ 'text-danger': errors[0] }">
                          Credit Card
                        </span>
                        <i
                          class="fas fa-exclamation-circle text-orange"
                          v-if="errors[0]"
                        ></i>
                      </b-col>
                      <b-col md="4">
                        <b-button
                          block
                          :variant="
                            form.type_card == 1 ? 'danger' : 'outline-secondary'
                          "
                          size="sm"
                          @click="form.type_card = 1"
                        >
                          Of Client
                        </b-button>
                      </b-col>
                      <b-col md="4">
                        <b-button
                          block
                          :variant="
                            form.type_card == 2 ? 'danger' : 'outline-secondary'
                          "
                          size="sm"
                          @click="form.type_card = 2"
                        >
                          Other Cards
                        </b-button>
                      </b-col>
                    </b-row>
                  </validation-provider>
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="12" class="mb-1 px-0">
              <div class="col-md-12" v-if="form.type_card == 1">
                <b-table
                  small
                  :fields="cardsTable.fields"
                  :items="cards"
                  class="mt-2"
                  sticky-header="150px"
                >
                  <template #cell(select)="data">
                    <validation-provider rules="required" #default="{ errors }">
                      <b-form-radio
                        :value="data.item.id"
                        v-model="form.id_card"
                        :state="errors.length > 0 ? false : null"
                      />
                    </validation-provider>
                  </template>

                  <template #cell(card_number)="data">
                    {{ "XXXX-XXXX-XXXX-" + data.item.cardnumber }}
                  </template>

                  <template #cell(cvc)="data">
                    {{ "XX" + data.item.cardsecuritycode }}
                  </template>

                  <template #cell(actions)="data">
                    <b-button
                      size="sm"
                      variant="flat-success"
                      class="btn-icon rounded-circle"
                      style="padding: 4px"
                      @click="openModalViewCard(data.item.id)"
                    >
                      <feather-icon icon="EyeIcon"></feather-icon>
                    </b-button>
                  </template>
                </b-table>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6">
              <b-row>
                <b-col md="12">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <input type="text" v-model="form.send_cr" class="d-none" />
                    <b-row>
                      <b-col
                        class="font-bureau-style text-gray-light m-auto"
                        cols="4"
                      >
                        <span :class="{ 'text-danger': errors[0] }">
                          Send CR
                        </span>
                        <i
                          class="fas fa-exclamation-circle text-orange"
                          v-if="errors[0]"
                        ></i>
                      </b-col>
                      <b-col cols="4" class="px-1">
                        <b-button
                          block
                          :variant="
                            form.send_cr == 1 ? 'danger' : 'outline-secondary'
                          "
                          size="sm"
                          @click="form.send_cr = 1"
                        >
                          Yes
                        </b-button>
                      </b-col>
                      <b-col cols="4" class="px-1">
                        <b-button
                          block
                          :variant="
                            form.send_cr == 2 ? 'danger' : 'outline-secondary'
                          "
                          size="sm"
                          @click="form.send_cr = 2"
                        >
                          No
                        </b-button>
                      </b-col>
                    </b-row>
                  </validation-provider>
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="6">
              <b-row>
                <b-col md="12">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <input type="text" v-model="form.document" class="d-none" />
                    <b-row>
                      <b-col
                        class="font-bureau-style text-gray-light m-auto px-1"
                        cols="4"
                      >
                        <span>Security Number</span>
                        <i
                          class="fas fa-exclamation-circle text-orange"
                          v-if="errors[0]"
                        ></i>
                      </b-col>
                      <b-col cols="8">
                        <span
                          class="text-orange ml-2"
                          v-if="form.document == null"
                        >
                          <i class="fas fa-exclamation-circle mr-1"></i>
                          Please fill document number
                        </span>
                        <b-row>
                          <b-col cols="4" class="px-1">
                            <b-button
                              :variant="
                                form.document == 1
                                  ? 'danger'
                                  : 'outline-secondary'
                              "
                              size="sm"
                              @click="form.document = 1"
                              v-if="documents.ssn"
                            >
                              SSN
                            </b-button>
                          </b-col>
                          <b-col cols="4" class="px-1">
                            <b-button
                              :variant="
                                form.document == 2
                                  ? 'danger'
                                  : 'outline-secondary'
                              "
                              size="sm"
                              @click="form.document = 2"
                              v-if="documents.itin"
                            >
                              ITIN
                            </b-button>
                          </b-col>
                          <b-col cols="4" class="px-1">
                            <b-button
                              :variant="
                                form.document == 3
                                  ? 'danger'
                                  : 'outline-secondary'
                              "
                              size="sm"
                              @click="form.document = 3"
                              v-if="documents.other"
                            >
                              CPN
                            </b-button>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </validation-provider>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col cols="12">
              <span style="font-size: 9pt">Commentary (Optional)</span>
            </b-col>
            <b-col md="12">
              <div class="form-group mt-0">
                <b-form-textarea
                  v-model="form.note"
                  class="style-area"
                ></b-form-textarea>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12" class="mt-1 text-center">
              <b-button
                variant="primary"
                @click="sendRequest"
                :disabled="disabledButton"
              >
                <i class="fas fa-sendRequest"></i>
                Send
              </b-button>
            </b-col>
          </b-row>
        </validation-observer>
      </div>
    </b-modal>

    <modal-view-card
      v-if="showModalViewCard"
      :modul="15"
      :type="2"
      :card="card"
      :isEditable="false"
      @onClose="closeModalViewCard"
    >
    </modal-view-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";

// Components
import ModalViewCard from "@/views/commons/components/credit-cards/ModalViewCard.vue";

// Services
import SNLeadsService from "@/views/social-network/services/leads";
import CreditCardService from "@/views/crm/services/creditCard";

export default {
  props: {
    lead_id: {
      type: Number,
    },
    modul: {
      type: Number,
    },
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    ModalViewCard,
  },
  data() {
    return {
      show: false,

      // Validations
      required,

      cardsTable: {
        fields: [
          { key: "select", label: "" },
          { key: "cardholdername", label: "Card Holder Name" },
          { key: "card_number", label: "Card Number" },
          { key: "type_card", label: "Type" },
          { key: "card_expi_month", label: "MM" },
          { key: "card_expi_year", label: "YY" },
          { key: "cvc", label: "CVC" },
          { key: "actions", label: "Actions" },
        ],
      },

      cards: [],
      form: {
        user_id: "",
        lead_id: this.lead_id,
        type_card: "",
        id_card: "",
        send_cr: "",
        document: "",
        note: "",
        dob: null,
        modul: this.modul,
      },
      documents: [],
      modalCard: false,
      card: "",

      // Modals
      showModalViewCard: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    disabledButton() {
      if(this.form.type_card == 1)
      {
        if(this.cards.length == 0) return true
        return !this.form.id_card
      }
      return this.form.dob == null
    }
  },
  methods: {
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
    async getCards() {
      try {
        const response = await SNLeadsService.getClientCards({
          id: this.lead_id,
        });

        if (response.status == 200) {
          this.cards = response.data;
        }
      } catch (error) {
        throw error;
      }
    },
    async getLeadDocument() {
      try {
        const response = await SNLeadsService.getLeadDocument({
          lead_id: this.lead_id,
        });

        if (response.status == 200) {
          this.documents = response.data[0];
          this.documents?.ssn
            ? (this.form.document = 1)
            : this.documents?.itin
            ? (this.form.document = 2)
            : this.documents?.other
            ? (this.form.document = 3)
            : (this.form.document = null);
          this.form.dob = response.data[0].dob;
        }
      } catch (error) {
        throw error;
      }
    },
    async sendRequest() {
      try {
        const validate = await this.$refs.form.validate();

        if (validate) {
          const confirm = await this.showConfirmSwal();

          if (confirm.value) {
            this.addPreloader();

            const response = await SNLeadsService.sendCreditReportRequest(
              this.form
            );

            if (response.status == 200) {
              this.close();
              this.showToast();
            }

            this.removePreloader();
          }
        }
      } catch (error) {
        this.removePreloader();

        throw error;
      }
    },
    close() {
      this.$emit("onClose", false);
    },
  },
  async created() {
    await this.getLeadDocument();
    await this.getCards();

    this.form.user_id = this.currentUser.user_id;
    this.show = true;
  },
};
</script>

<style scoped>
.text-danger {
  color: #e3342f !important;
}
</style>