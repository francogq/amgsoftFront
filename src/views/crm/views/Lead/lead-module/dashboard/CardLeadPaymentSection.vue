<template>
  <validation-observer ref="refFormObserver">
    <!-- Form -->
    <b-card footer-class="border-0">
      <template #header>
        <b-row>
          <b-col cols="12">
            <validation-provider
              v-slot="{ errors }"
              :name="title"
              :rules="title === 'Other' ? 'required' : null"
            >
              <b-form-group
                :label="title"
                label-for="observation"
                label-cols-xl="3"
                label-class="font-weight-bolder"
              >
                <b-form-input
                  v-if="title === 'Other'"
                  id="observation"
                  v-model="item.observation"
                  placeholder="Specific"
                  :state="errors[0] ? false : null"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col cols="12">
            <validation-provider
              rules="required|validate-amount"
              v-slot="{ errors }"
              name="Ammount"
            >
              <b-form-group label="Amount" label-for="amount" label-cols-md="4">
                <money
                  v-model="item.amount"
                  id="amount"
                  v-bind="vMoney"
                  class="form-control text-center"
                  :class="{ 'border-danger': errors[0] && vmoneyValidate }"
                ></money>
              </b-form-group>
            </validation-provider>
          </b-col>
        </b-row>
      </template>
      <b-table
        show-empty
        sticky-header
        small
        responsive
        :fields="fields"
        :items="cards || []"
        :busy="isBusy"
      >
        <template #cell(radio)="data">
          <validation-provider v-slot="{ errors }" name="card" rules="required">
            <b-form-radio
              v-model="item.card_id"
              :id="`yes-or-not-card-list-${method}-${data.index}`"
              :name="`yes-or-not-card-list-${method}`"
              class="mt-0"
              :value="data.item.id"
              :state="errors[0] ? false : null"
            />
          </validation-provider>
        </template>

        <template #cell(cardnumber)="data">{{
          "XXXX-" + data.item.cardnumber
        }}</template>

        <template #cell(cardsecuritycode)="data">{{
          data.item.cardsecuritycode.length === 3
            ? "XX" + data.item.cardsecuritycode.substr(2)
            : "XXX" + data.item.cardsecuritycode.substr(3)
        }}</template>
      </b-table>

      <span class="text-danger" v-if="errorCard"
        >*Please Pick a Credit Card</span
      >

      <template #footer>
        <div class="text-center">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="primary"
            @click="onSubmit"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Submit</span>
            <b-spinner v-else small />
          </b-button>
        </div>
      </template>
    </b-card>
  </validation-observer>
</template>

<script>
import { mapGetters } from "vuex";

import flatPickr from "vue-flatpickr-component";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

import formValidation from "@core/comp-functions/forms/form-validation";

export default {
  components: {
    flatPickr,
    vSelect,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
    }),
  },
  created() {
    this.authUser = this.currentUser;
    this.setDataBlank("item");
  },
  data() {
    return {
      authUser: {},
      blankItem: {},
      fields: [
        { key: "radio", label: "" },
        { key: "cardnumber", label: "Card Number" },
        { key: "card_expi_month", label: "MM" },
        { key: "card_expi_year", label: "YY" },
        { key: "cardsecuritycode", label: "CVV" },
      ],
      item: {
        amount: "",
        method: this.method,
        card_id: "",
        observation: "",
      },
      vmoneyValidate: false,
      vMoney: {
        decimal: ".",
        thousands: ",",
        prefix: "$",
        precision: 2,
        masked: false,
      },
      errorCard: false,
    };
  },
  directives: { Ripple },
  methods: {
    setDataBlank(key) {
      this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`] =
        Object.assign({}, this[key]);
    },
    refactorNumber() {
      this.item.amount = this.reformatToMoney();
    },
    reformatToMoney() {
      const amount = this.item.amount;
      let number = "0.00";
      if (amount.indexOf(".") != -1) {
        let numberReplace = amount.replace(/,/gi, "");
        const numberSplit = numberReplace.split(".");
        number = numberSplit[0].split(/(?=(?:\d{3})+$)/).join(",");
        number = number + "." + numberSplit[1];
      } else {
        let numberReplace = amount.replace(/,/gi, "");
        number = numberReplace.split(/(?=(?:\d{3})+$)/).join(",");
        number = number + ".00";
      }
      return number;
    },
    async onSubmit() {
      //Helpers for Validation
      this.vmoneyValidate = true;
      if (!this.item.card_id) this.errorCard = true;
      //Validation
      const validation = await this.$refs.refFormObserver.validate();
      if (validation) {
        await this.$emit("onSubmit", this.item);
      }
    },
  },
  mounted() {},
  props: {
    modul: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array | null,
      required: true,
    },
    isBusy: {
      type: Boolean,
      required: true,
    },
    method: {
      type: Number,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const { refFormObserver, getValidationState } = formValidation(() => {});

    return {
      refFormObserver,
      getValidationState,
    };
  },
  watch: {
    "item.card_id"(newValue, oldValue) {
      if (newValue) this.errorCard = false;
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
@import "@core/scss/vue/libs/vue-select.scss";
</style>
