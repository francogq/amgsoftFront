<template>
  <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
    <!-- Form -->
    <b-form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="resetForm">
      <b-row>
        <b-col cols="12" sm="6">
          <validation-provider
            #default="validationContext"
            name="Card Holder Number"
            rules="required"
          >
            <b-form-group label="Card Holder Number" label-for="card-holder-name">
              <b-form-input
                v-model="card.cardholdername"
                id="card-holder-name"
                :state="getValidationState(validationContext)"
              />

              <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col cols="12" sm="6">
          <validation-provider #default="validationContext" name="Card Number" rules="required">
            <b-form-group label="Card Number" label-for="card-number">
              <b-form-input
                v-model="card.cardNumber"
                v-mask="'#### #### #### ####'"
                id="card-number"
                ref="input-focus-1"
                data-input-focus="1"
                placeholder="0000 0000 0000 0000"
                :state="getValidationState(validationContext)"
                v-on:keyup.native="onNextFocus($event, 19)"
              />

              <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col cols="12" sm="6">
          <b-row>
            <b-col cols="4">
              <validation-provider #default="validationContext" name="MM" rules="required">
                <b-form-group label="MM" label-for="card-expi-month">
                  <b-form-input
                    v-model="card.card_expi_month"
                    v-mask="'##'"
                    id="card-expi-month"
                    ref="input-focus-2"
                    data-input-focus="2"
                    :state="getValidationState(validationContext)"
                    v-on:keyup.native="onNextFocus($event, 2)"
                  />

                  <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col cols="4">
              <validation-provider #default="validationContext" name="YY" rules="required">
                <b-form-group label="YY" label-for="card-expi-year">
                  <b-form-input
                    v-model="card.card_expi_year"
                    v-mask="'##'"
                    id="card-expi-year"
                    ref="input-focus-3"
                    data-input-focus="3"
                    :state="getValidationState(validationContext)"
                    v-on:keyup.native="onNextFocus($event, 2)"
                  />

                  <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col cols="4">
              <validation-provider #default="validationContext" name="CVV" rules="required">
                <b-form-group label="CVV" label-for="card-security-code">
                  <b-form-input
                    v-model="card.cardsecuritycode"
                    v-mask="'####'"
                    id="card-security-code"
                    ref="input-focus-4"
                    data-input-focus="4"
                    :state="getValidationState(validationContext)"
                    v-on:keyup.native="onNextFocus"
                  />

                  <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" sm="6">
          <validation-provider>
            <b-form-group label="Billing Address is the same the Mailling Address ?">
              <b-button-group class="w-100">
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  :variant="moreInfo ? 'danger' : 'outline-danger'"
                  @click="moreInfo = true"
                >YES</b-button>
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  :variant="!moreInfo ? 'danger' : 'outline-danger'"
                  @click="moreInfo = false"
                >NO</b-button>
              </b-button-group>
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col v-if="!moreInfo && type !== 1" cols="12">
          <address-component
            :address-data="addressData"
            :state-options="G_EEUU_STATES"
            :is-required="true"
          />
        </b-col>
      </b-row>

      <!-- Form Actions -->
      <div class="d-flex justify-content-center mt-2">
        <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="success" type="submit">
          <template v-if="isLoading">
            <b-spinner small />
            <span>Loading...</span>
          </template>
          <span v-else>Save</span>
        </b-button>
      </div>
    </b-form>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

import formValidation from "@core/comp-functions/forms/form-validation";
import AddressComponent from "@/views/crm/views/Lead/components/AddressComponent.vue";

export default {
  components: {
    vSelect,
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
    this.blankCard = Object.assign({}, this.card);
  },
  data() {
    return {
      authUser: new Object(),
      blankCard: new Object(),
      card: new Object(),
      addressData: {
        prename: "card",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "United States"
      },
      cardOriginalNumber: null,
      isLoading: false,
      moreInfo: true
    };
  },
  directives: { Ripple },
  props: {
    modul: {
      type: Number,
      required: true
    },
    type: {
      type: Number,
      required: false
    },
    lead: {
      type: Object,
      required: true
    }
  },
  setup() {
    const resetuserData = () => {
      const event = Object.assign({}, this.blankCard);
      this.$emit("update:card", event);
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
      A_SET_CREDIT_CARD: "CrmCreditCardStore/A_SET_CREDIT_CARD"
    }),
    onNextFocus(event, maxlength) {
      const inputFocus = Number(event.srcElement.dataset.inputFocus);
      if (
        inputFocus > 1 &&
        (event.key === "Backspace" || event.key === "Delete")
      ) {
        if (!event.srcElement.value.length) {
          const backElement = this.$refs?.[`input-focus-${inputFocus - 1}`];
          if (backElement) backElement.focus();
        }
      } else if (event.srcElement.value.length === maxlength) {
        const nextElement = this.$refs?.[`input-focus-${inputFocus + 1}`];
        if (nextElement) nextElement.focus();
      }
    },
    async onSubmit() {
      this.isLoading = true;
      this.showConfirmSwal("Are you sure?", "You want to create this card?")
        .then(async result => {
          if (result.value) {
            const card = {
              ...this.card,
              idlead: this.lead.id,
              user: this.authUser.user_id,
              cardnumber: this.card.cardNumber.replaceAll(" ", "-"),
              address:
                !this.moreInfo && this.type !== 1
                  ? this.addressData.street
                  : "",
              street:
                !this.moreInfo && this.type !== 1
                  ? this.addressData.street
                  : "",
              city:
                !this.moreInfo && this.type !== 1 ? this.addressData.city : "",
              zipcode:
                !this.moreInfo && this.type !== 1
                  ? this.addressData.zipcode
                  : "",
              country:
                !this.moreInfo && this.type !== 1
                  ? this.addressData.country
                  : "",
              state:
                !this.moreInfo && this.type !== 1 ? this.addressData.state : ""
            };
            const response = await this.A_SET_CREDIT_CARD(card);
            if (this.isResponseSuccess(response)) {
              this.$emit("onReloadCards", response.data);
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
              this.$bvModal.hide("modal-card-create");
            } else
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                `Something went wrong. ${response.message}`
              );
          }
        })
        .catch(error => {
          console.log("Something went wrong onModalCardOpen", error);
          this.showErrorSwal();
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
