<template>
  <div>
    <ValidationObserver ref="form">
      <b-row class="font-bureau-style">
        <b-col cols="12" md="6">
          <div class="form-group">
            <label for="card_holder">Card Holder Name</label>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                class="border-hover-p"
                id="card_holder"
                name="card_holder"
                v-model="form.cardholdername"
                type="text"
                placeholder="Card Holder Name"
                :class="{ 'border border-danger': errors[0] }"
              />
            </ValidationProvider>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="form-group">
            <label for="card_number">Card Number</label>
            <b-row>
              <b-col cols="3">
                <ValidationProvider
                  rules="required|length:4"
                  v-slot="{ errors }"
                >
                  <b-form-input
                    class="border-hover-p"
                    ref="input-1"
                    @input="activeFocus(1, 4)"
                    v-model="cardnumber1"
                    type="text"
                    :class="{ 'border border-danger': errors[0] }"
                  />
                </ValidationProvider>
              </b-col>
              <b-col cols="3">
                <ValidationProvider
                  rules="required|length:4"
                  v-slot="{ errors }"
                >
                  <b-form-input
                    class="border-hover-p"
                    ref="input-2"
                    @input="activeFocus(2, 4)"
                    v-model="cardnumber2"
                    type="text"
                    :class="{ 'border border-danger': errors[0] }"
                  />
                </ValidationProvider>
              </b-col>
              <b-col cols="3">
                <ValidationProvider
                  rules="required|length:4"
                  v-slot="{ errors }"
                >
                  <b-form-input
                    class="border-hover-p"
                    ref="input-3"
                    @input="activeFocus(3, 4)"
                    v-model="cardnumber3"
                    type="text"
                    :class="{ 'border border-danger': errors[0] }"
                  />
                </ValidationProvider>
              </b-col>
              <b-col cols="3">
                <ValidationProvider
                  rules="required|min:3|max:4"
                  v-slot="{ errors }"
                >
                  <b-form-input
                    class="border-hover-p"
                    ref="input-4"
                    @input="activeFocus(4, 4)"
                    v-model="cardnumber4"
                    type="text"
                    :class="{ 'border border-danger': errors[0] }"
                  />
                </ValidationProvider>
              </b-col>
            </b-row>
          </div>
        </b-col>
        <b-col cols="4" md="2">
          <div class="form-group">
            <label for="card-expi-month">MM</label>
            <ValidationProvider rules="required|length:2" v-slot="{ errors }">
              <b-form-input
                class="border-hover-p"
                type="text"
                id="card-expi-month"
                maxlength="2"
                ref="input-5"
                @input="activeFocus(5, 2)"
                v-model="form.card_expi_month"
                :class="{ 'border border-danger': errors[0] }"
              />
            </ValidationProvider>
          </div>
        </b-col>
        <b-col cols="4" md="2">
          <div class="form-group">
            <label for="card-expi-year">YY</label>
            <ValidationProvider rules="required|length:2" v-slot="{ errors }">
              <b-form-input
                class="border-hover-p"
                type="text"
                id="card-expi-year"
                maxlength="2"
                ref="input-6"
                @input="activeFocus(6, 2)"
                v-model="form.card_expi_year"
                :class="{ 'border border-danger': errors[0] }"
              />
            </ValidationProvider>
          </div>
        </b-col>
        <b-col cols="4" md="2">
          <div class="form-group">
            <label for="card-cvv">CVV</label>
            <ValidationProvider
              rules="required|min:3|max:4"
              v-slot="{ errors }"
            >
              <b-form-input
                class="border-hover-p"
                v-model="form.cardsecuritycode"
                ref="input-7"
                id="card-cvv"
                max="4"
                type="text"
                maxlength="4"
                :class="{ 'border border-danger': errors[0] }"
              />
            </ValidationProvider>
          </div>
        </b-col>
        <b-col cols="12" md="6">
          <div class="form-group">
            <input type="text" v-model="moreInfo" class="d-none" />
            <label for="billing"
              >Billing Address is the same the Mailling Address ?</label
            >
            <b-row>
              <b-col cols="6" class="px-1">
                <b-button
                  @click="moreInfo = 1"
                  class="btn rounded w-100 btn-gray-selector"
                  :variant="`${moreInfo == 1 ? 'primary' : ''}`"
                  >Yes</b-button
                >
              </b-col>
              <b-col cols="6" class="px-1">
                <b-button
                  @click="moreInfo = 0"
                  class="btn rounded w-100 btn-gray-selector"
                  :variant="`${moreInfo == 0 ? 'primary' : ''}`"
                  >No</b-button
                >
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
      <b-row v-if="moreInfo == 0" class="font-bureau-style">
        <b-col cols="12">
          <div class="form-group">
            <label for="address_create_card_modal">Mailing address</label>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <vue-google-autocomplete
                ref="address_create_card_modal"
                id="address_create_card_modal"
                class="form-control boder-hover-p"
                placeholder="Please type your address"
                v-on:placechanged="getAddressData"
                country="us"
                v-model="form.address"
                :class="{ 'border border-danger': errors[0] }"
              ></vue-google-autocomplete>
            </ValidationProvider>
          </div>
        </b-col>
        <b-col cols="6">
          <div class="form-group">
            <label for="city">City</label>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                class="border-hover-p"
                v-model="form.city"
                id="city"
                type="text"
                placeholder="City"
                :class="{ 'border border-danger': errors[0] }"
              />
            </ValidationProvider>
          </div>
        </b-col>
        <b-col cols="6">
          <div class="form-group">
            <label for="state">State</label>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <select
                name="state"
                id="state"
                v-model="form.state"
                class="form-control"
                :class="{ 'border border-danger': errors[0] }"
              >
                <option
                  :value="state.slug"
                  v-for="state in states"
                  :key="state.id"
                >
                  {{ state.state }}
                </option>
              </select>
            </ValidationProvider>
          </div>
        </b-col>
        <b-col cols="6">
          <div class="form-group">
            <label for="zipcode">Zip Code</label>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                class="border-hover-p"
                v-model="form.zipcode"
                id="zipcode"
                type="text"
                placeholder="Zip Code"
                :class="{ 'border border-danger': errors[0] }"
              />
            </ValidationProvider>
          </div>
        </b-col>
        <b-col cols="6">
          <div class="form-group">
            <label for="country">Country</label>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <b-form-input
                class="border-hover-p"
                disabled
                v-model="form.country"
                id="country"
                type="text"
                placeholder="Country"
                :class="{ 'border border-danger': errors[0] }"
              />
            </ValidationProvider>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12" class="mt-2 text-right">
          <b-button
            class="btn-update-sn rounded font-bureau-style text-white"
            variant="primary"
            @click="createCard"
          >
            <i class="fas fa-save"></i> Save
          </b-button>
        </b-col>
      </b-row>
    </ValidationObserver>
  </div>
</template>

<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { extend } from "vee-validate";
import { mapActions, mapGetters, mapState } from "vuex";

import { amgApi } from "@/service/axios";
export default {
  components: { VueGoogleAutocomplete },
  props: ["lead", "session", "ifModalCard"],
  data() {
    return {
      address_create_card_modal: "",
      states: [],
      cards: [],
      moreInfo: "1",
      form: {
        idlead: this.lead.id,
        card_expi_month: "",
        card_expi_year: "",
        cardnumber: "",
        cardsecuritycode: "",
        city: "",
        state: "",
        country: "United Stated",
        zipcode: "",
        address: "",
        cardholdername: "",
        street: "",
        user: null,
      },
      cardnumber1: "",
      cardnumber2: "",
      cardnumber3: "",
      cardnumber4: "",
    };
  },
  created() {
    this.user = this.currentUser.user_id;
  },
  mounted() {
    amgApi.get("/commons/get-eeuu-states").then((response) => {
      this.states = response.data;
    });
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_EEUU_STATES: "CrmGlobalStore/G_EEUU_STATES",
    }),
  },
  methods: {
    activeFocus(index, max) {
      let inputValue = this.$refs?.[`input-${index}`];
      if (inputValue.value.length === max - 1) {
        const nextElement = this.$refs?.[`input-${index + 1}`];
        if (nextElement) nextElement.focus();
      }
    },
    getAddressData(address_create_card_modal) {
      this.direccion = address_create_card_modal;
      this.address_create_card_modal =
        this.direccion.street_number + " " + this.direccion.route;
      var x = document.getElementById("address_create_card_modal");
      x.value = this.address_create_card_modal;
      this.form.street = this.address_create_card_modal;
      this.form.address = this.address_create_card_modal;
      this.form.state = this.direccion.administrative_area_level_1;
      this.form.city = this.direccion.locality;
      this.form.zipcode = this.direccion.postal_code;
    },
    createCard() {
      this.$refs.form.validate().then((success) => {
        if (!success) {
          return;
        }
        this.form.cardnumber =
          this.cardnumber1 +
          "-" +
          this.cardnumber2 +
          "-" +
          this.cardnumber3 +
          "-" +
          this.cardnumber4;
        var x = document.getElementById("address_create_card_modal");
        if (x)
          if (x.value != null && x.value != "") {
            this.form.street = x.value;
          } else {
            this.form.street = "";
          }
        this.showConfirmSwal().then((result) => {
          if (result.isConfirmed) {
            this.$store.commit("app/SET_LOADING", true);
            amgApi
              .post("/cards/create-cards", this.form)
              .then((response) => {
                this.cards = response.data;
                this.$emit("closeModalCard", false);
                this.$emit("onReloadCards", response.data);
                this.$emit("reloadLeadEmit");
                this.$store.commit("app/SET_LOADING", false);
                this.showSuccessSwal("Credit Card created successfully");
              })
              .catch((error) => {
                console.error(error);
                this.$store.commit("app/SET_LOADING", false);
                this.showToast(
                  "danger",
                  "top-right",
                  "Error",
                  "XIcon",
                  "Something went wrong!"
                );
              });
          }
        });
      });
    },
    closeModal() {
      this.$emit("click", false);
    },
  },
};
</script>

<style scoped>
.font-bureau-style {
  color: #706989;
}

label {
  font-weight: 300 !important;
}
.border-hover-p:hover,
.border-hover-p:active {
  border: 2px solid #7000ff !important;
  filter: drop-shadow(0px 2px 7px rgba(0, 0, 0, 0.15));
}
</style>
