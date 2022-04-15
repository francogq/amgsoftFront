<template>
  <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
    <!-- Form -->
    <b-form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="resetForm">
      <b-row>
        <b-col cols="12 mb-2">
          <validation-provider v-slot="{ errors }" name="Credit Card" rules="required">
            <input v-model="item.type_card" type="text" class="d-none" />
            <b-row>
              <b-col class="font-bureau-style text-gray-light m-auto" cols="4">
                <span :class="{ 'text-danger': errors[0] }">Credit Card</span>
              </b-col>
              <b-col cols="4" class="px-1">
                <button
                  class="btn btn-outline-secondary rounded btn-sm w-100 btn-gray-selector"
                  type="button"
                  :class="{ 'btn-danger': item.type_card === 1 }"
                  @click="item.type_card = 1"
                >Of Client</button>
              </b-col>
              <b-col cols="4" class="px-1">
                <button
                  class="btn btn-outline-secondary rounded btn-sm w-100 btn-gray-selector"
                  type="button"
                  :class="{ 'btn-danger': item.type_card === 2 }"
                  @click="item.type_card = 2"
                >Other Cards</button>
              </b-col>
            </b-row>
          </validation-provider>
        </b-col>
        <b-col v-if="item.type_card === 1" cols="12">
          <b-table
            show-empty
            sticky-header
            small
            responsive
            :fields="fieldCards"
            :items="lead.cards || []"
          >
            <template #cell(radio)="data">
              <validation-provider v-slot="{ errors }" name="Ammount" rules="required">
                <b-form-radio
                  :id="`yes-or-not-card-list--${data.index}`"
                  v-model="item.id_card"
                  :name="`yes-or-not-card-list-`"
                  class="mt-0"
                  :value="data.item.id"
                  :state="errors[0] ? false : null"
                />
              </validation-provider>
            </template>

            <template #cell(cardnumber)="data">
              {{
              "XXXX-XXXX-XXXX-" + data.item.cardnumber
              }}
            </template>

            <template #cell(cardsecuritycode)="data">
              {{
              data.item.cardsecuritycode.length === 3
              ? "XX" + data.item.cardsecuritycode.substr(2)
              : "XXX" + data.item.cardsecuritycode.substr(3)
              }}
            </template>

            <template #cell(actions)="data">
              <div class="d-flex justify-content-center">
                <b-button
                  variant="flat-info"
                  class="button-little-size rounded-circle"
                  :disabled="isActionButtonLoading || isLoading"
                  @click="onModalCardOpen(data.item.id)"
                >
                  <feather-icon v-if="!isActionButtonLoading && !isLoading" icon="EyeIcon" />
                  <b-spinner v-else small />
                </b-button>
              </div>
            </template>
          </b-table>
        </b-col>
        <b-col cols="6 mb-2">
          <validation-provider v-slot="{ errors }" name="Send CR" rules="required">
            <input v-model="item.send_cr" type="text" class="d-none" />
            <b-row>
              <b-col class="font-bureau-style text-gray-light m-auto" cols="4">
                <span :class="{ 'text-danger': errors[0] }">Send CR</span>
              </b-col>
              <b-col cols="4" class="px-1">
                <button
                  class="btn btn-outline-secondary rounded btn-sm w-100 btn-gray-selector"
                  type="button"
                  :class="{ 'btn-danger': item.send_cr === 1 }"
                  @click="item.send_cr = 1"
                >Yes</button>
              </b-col>
              <b-col cols="4" class="px-1">
                <button
                  class="btn btn-outline-secondary rounded btn-sm w-100 btn-gray-selector"
                  type="button"
                  :class="{ 'btn-danger': item.send_cr === 2 }"
                  @click="item.send_cr = 2"
                >No</button>
              </b-col>
            </b-row>
          </validation-provider>
        </b-col>
        <b-col cols="6 mb-2">
          <validation-provider v-slot="{ errors }" name="Security Number" rules="required">
            <input v-model="item.document" type="text" class="d-none" />
            <b-row>
              <b-col class="font-bureau-style text-gray-light m-auto px-1" cols="4">
                <span :class="{ 'text-danger': errors[0] }">Security Number</span>
              </b-col>
              <b-col cols="8">
                <span v-if="!item.document" class="text-danger ml-2">
                  <feather-icon icon="AlertCircleIcon" />
                  <span class="ml-1 pt-1">Please fill document number</span>
                </span>
                <b-row>
                  <b-col cols="4" class="px-1">
                    <button
                      v-if="item.documents.ssn"
                      class="btn btn-outline-secondary rounded btn-sm w-100 btn-gray-selector"
                      type="button"
                      :class="{ 'btn-danger': item.document == 1 }"
                      @click="item.document = 1"
                    >SSN</button>
                  </b-col>
                  <b-col cols="4" class="px-1">
                    <button
                      v-if="item.documents.itin"
                      class="btn btn-outline-secondary rounded btn-sm w-100 btn-gray-selector"
                      type="button"
                      :class="{ 'btn-danger': item.document == 2 }"
                      @click="item.document = 2"
                    >ITIN</button>
                  </b-col>
                  <b-col cols="4" class="px-1">
                    <button
                      v-if="item.documents.other"
                      class="btn btn-outline-secondary rounded btn-sm w-100 btn-gray-selector"
                      type="button"
                      :class="{ 'btn-danger': item.document == 3 }"
                      @click="item.document = 3"
                    >CPN</button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
          </validation-provider>
        </b-col>
        <div v-if="!item.dob" class="text-danger ml-2 my-auto text-center w-100">
          <feather-icon icon="AlertCircleIcon" />
          <span class="ml-1 pt-1">Please fill date of birth to get Credit Report</span>
        </div>
        <b-col cols="12">
          <b-form-group label="Commentary (Optional)" label-for="commentary">
            <b-form-textarea id="commentary" v-model="item.commentary" />
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Form Actions -->
      <div class="d-flex float-right mt-2">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          type="submit"
          :disabled="isLoading"
        >
          <template v-if="isLoading">
            <b-spinner class="mr-1" small />
            <span>Loading...</span>
          </template>
          <span v-else>Send</span>
        </b-button>
      </div>
    </b-form>

    <!-- modal CARD SHOW -->
    <b-modal
      v-model="viewCardModal"
      ok-only
      modal-class="modal-warning"
      centered
      size="lg"
      title="CREDIT CARD"
      hide-footer
      no-close-on-backdrop
    >
      <modal-card-show
        :modul="modul"
        :only-read="true"
        :lead="lead"
        :card="card"
        :is-editable="false"
      />
    </b-modal>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

import formValidation from "@core/comp-functions/forms/form-validation";
import AddressComponent from "@/views/crm/views/Lead/components/AddressComponent.vue";
import ModalCardShow from "@/views/crm/views/Lead/lead-card/ModalCardShow.vue";

export default {
  components: {
    vSelect,
    ModalCardShow,
    AddressComponent
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_EEUU_STATES: "CrmGlobalStore/G_EEUU_STATES"
    }),
    creditCardToggleIcon() {
      return this.cardOriginalNumber ? "EyeOffIcon" : "EyeIcon";
    }
  },
  created() {
    this.authUser = this.currentUser;
    this.blankItem = { ...this.item };
  },
  directives: { Ripple },
  props: {
    modul: {
      type: Number,
      required: true
    },
    lead: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      authUser: new Object(),
      blankItem: new Object(),
      card: new Object(),
      cardOriginalNumber: null,
      isLoading: false,
      isActionButtonLoading: false,
      moreInfo: true,
      fieldCards: [
        { key: "radio", label: "" },
        { key: "cardnumber", label: "Card Number" },
        { key: "card_expi_month", label: "MM" },
        { key: "card_expi_year", label: "YY" },
        { key: "cardsecuritycode", label: "CVV" },
        { key: "actions" }
      ],
      viewCardModal: false
    };
  },
  setup() {
    const resetuserData = () => {
      const event = { ...this.blankItem };
      this.$emit("update:item", event);
    };
    const { refFormObserver, getValidationState } = formValidation(
      resetuserData
    );

    return {
      refFormObserver,
      getValidationState,
      resetuserData
    };
  },
  methods: {
    ...mapActions({
      A_GET_CREDIT_CARD: "CrmCreditCardStore/A_GET_CREDIT_CARD",
      A_SET_CREDIT_CARD: "CrmCreditCardStore/A_SET_CREDIT_CARD",
      A_GET_LEAD_SEND_REQUEST: "CrmLeadStore/A_GET_LEAD_SEND_REQUEST",
      A_GET_CREDIT_REPORT_PENDINGS:
        "CrmCreditReportStore/A_GET_CREDIT_REPORT_PENDINGS"
    }),
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
    async onSubmit() {
      this.isLoading = true;
      this.showConfirmSwal()
        .then(async result => {
          if (result.value) {
            const item = {
              user_id: this.authUser.user_id,
              lead_id: this.lead.id,
              type_card: "",
              id_card: "",
              send_cr: "",
              document: "",
              note: "",
              dob: null,
              modul: this.modul,
              ...this.item
            };
            const response = await this.A_GET_LEAD_SEND_REQUEST(item);
            if (this.isResponseSuccess(response)) {
              await this.A_GET_CREDIT_REPORT_PENDINGS({
                id: this.$route.params.id,
                modul: this.modul
              });
              this.$emit("onSubmit", false);
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
            } else
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                `Something went wrong. ${response.message}`
              );
          } else {
            this.isLoading = false;
          }
        })
        .catch(error => {
          console.log("Something went wrong onModalCardOpen", error);
          this.showErrorSwal(error);
          this.isLoading = false;
        });
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
