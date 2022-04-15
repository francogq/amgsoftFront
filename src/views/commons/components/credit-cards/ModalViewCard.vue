<template>
  <b-modal
    v-model="show"
    title="Credit Card"
    title-tag="h3"
    hide-footer
    size="lg"
    no-close-on-backdrop
    @hidden="close"
  >
    <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
      <b-form
        @submit.prevent="handleSubmit(onSubmit)"
        @reset.prevent="resetForm"
      >
        <b-row>
          <b-col cols="12" sm="6">
            <validation-provider>
              <b-form-group
                label="Card Holder Number"
                label-for="card-holder-name"
              >
                <b-form-input
                  id="card-holder-name"
                  disabled
                  :value="card.cardholdername"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col cols="12" sm="6">
            <validation-provider>
              <b-form-group label="Card Number" label-for="card-number">
                <b-input-group>
                  <b-form-input
                    id="card-number"
                    placeholder="XXXX-XXXX-XXXX-..."
                    disabled
                    :value="
                      cardOriginalNumber ? cardOriginalNumber : cardNumber
                    "
                  />
                  <b-input-group-append
                    v-if="isCeo || isSupervisor || isCoordinator"
                    is-text
                  >
                    <feather-icon
                      v-if="!isCreditCardLoading"
                      :icon="creditCardToggleIcon"
                      class="cursor-pointer"
                      @click="onToggleCreditCard"
                    />
                    <b-spinner v-else small />
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col cols="12" sm="6">
            <b-row>
              <b-col cols="3">
                <validation-provider>
                  <b-form-group label="MM" label-for="card-expi-month">
                    <b-form-input
                      id="card-expi-month"
                      disabled
                      :value="card.card_expi_month"
                    />
                  </b-form-group>
                </validation-provider>
              </b-col>
              <b-col cols="3">
                <validation-provider>
                  <b-form-group label="YY" label-for="card-expi-year">
                    <b-form-input
                      id="card-expi-year"
                      disabled
                      :value="card.card_expi_year"
                    />
                  </b-form-group>
                </validation-provider>
              </b-col>
              <b-col cols="6">
                <validation-provider>
                  <b-form-group label="YY" label-for="card-expi-year">
                    <b-input-group>
                      <b-form-input
                        id="card-expi-year"
                        disabled
                        :value="cardCvv"
                      />
                      <b-input-group-append
                        v-if="isCeo || isSupervisor || isCoordinator"
                        is-text
                      >
                        <feather-icon
                          :icon="isShowCardCvv ? 'EyeOffIcon' : 'EyeIcon'"
                          class="cursor-pointer"
                          @click="isShowCardCvv = !isShowCardCvv"
                        />
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </validation-provider>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12" sm="6">
            <validation-provider>
              <b-form-group
                label="Billing Address is the same the Mailling Address ?"
              >
                <b-button-group class="w-100">
                  <b-button
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    :variant="moreInfo ? 'primary' : 'outline-primary'"
                    disabled
                    >YES</b-button
                  >
                  <b-button
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    :variant="!moreInfo ? 'primary' : 'outline-primary'"
                    disabled
                    >NO</b-button
                  >
                </b-button-group>
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col v-if="!moreInfo && type !== 1" cols="12">
            sssss
            <address-component
              :address-data="card"
              :state-options="G_EEUU_STATES"
              :is-disabled="true"
              :is-editable="false"
            />
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-modal>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import flatPickr from "vue-flatpickr-component";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

import formValidation from "@core/comp-functions/forms/form-validation";
import AddressComponent from "@/views/crm/views/Lead/components/AddressComponent.vue";

export default {
  props: {
    modul: {
      type: Number,
      required: false,
    },
    type: {
      type: Number,
      required: false,
    },
    card: {
      type: Object,
      required: true,
    },
    isEditable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  components: {
    flatPickr,
    vSelect,
    AddressComponent,
  },
  directives: { Ripple },
  data() {
    return {
      show: false,

      authUser: new Object(),
      blankItem: new Object(),
      cardNumber: `XXXX-XXXX-XXXX-${this.card.cardnumber}`,
      cardOriginalNumber: null,
      eeuu_state: null,
      isCreditCardLoading: false,
      isShowCardCvv: false,
      moreInfo: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_EEUU_STATES: "CrmGlobalStore/G_EEUU_STATES",
      isCeo: "auth/isCeo",
      isSupervisor: "auth/isSupervisor",
    }),
    creditCardToggleIcon() {
      return this.cardOriginalNumber ? "EyeOffIcon" : "EyeIcon";
    },
    cardCvv() {
      return this.isShowCardCvv
        ? this.card.cardsecuritycode
        : this.card.cardsecuritycode.length === 3
        ? `XX${this.card.cardsecuritycode.substr(2)}`
        : `XXX${this.card.cardsecuritycode.substr(3)}`;
    },
  },
  setup() {
    const resetuserData = () => {
      const event = { ...this.blankItem };
      this.$emit("update:card", event);
    };
    const { refFormObserver, getValidationState } =
      formValidation(resetuserData);

    return {
      refFormObserver,
      getValidationState,
      resetuserData,
    };
  },
  methods: {
    ...mapActions({
      A_GET_ORIGINAL_TARGET: "CrmCreditCardStore/A_GET_ORIGINAL_TARGET",
    }),
    async onToggleCreditCard() {
      try {
        if (!this.cardOriginalNumber) {
          this.isCreditCardLoading = true;
          const response = await this.A_GET_ORIGINAL_TARGET({
            id: this.card.id,
          });
          if (this.isResponseSuccess(response)) {
            this.cardOriginalNumber = response.data[0];
          } else
            this.showToast(
              "warning",
              "top-right",
              "Warning!",
              "AlertTriangleIcon",
              `Something went wrong. ${response.message}`
            );
          this.isCreditCardLoading = false;
        } else this.cardOriginalNumber = null;
      } catch (error) {
        console.log("Something went wrong onToggleCreditCard", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isCreditCardLoading = false;
      }
    },
    close() {
      this.$emit("onClose");
    },
  },
  created() {
    this.authUser = this.currentUser;
    this.blankItem = { ...this.card };

    this.show = true;
  },
  mounted() {
    this.moreInfo = !this.card.address;
    this.card.prename = "card";
    this.card.street = this.card.address;
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
@import "@core/scss/vue/libs/vue-select.scss";
</style>
