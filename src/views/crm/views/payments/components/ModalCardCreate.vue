<template>
  <div>
    <b-modal
      modal
      title="Create Credit Card"
      v-model="mutableIfModalCard"
      size="lg"
      modal-class="modal-primary"
      title-tag="h3"
      hide-footer
      body-class="mb-2"
      @hidden="closeModal"
      :no-close-on-backdrop="true"
      centered
    >
      <!-- Form -->
      <ValidationObserver ref="form">
        <b-row class="font-bureau-style mt-1">
          <b-col cols="12" lg="6" md="12">
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
                  :class="{ 'border-danger': errors[0] }"
                />
              </ValidationProvider>
            </div>
          </b-col>
          <!-- Card Number -->
          <b-col cols="12" lg="6" md="12">
            <div class="form-group">
              <label for="card_number">Card Number</label>
              <b-row>
                <!-- Input 1 -->
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
                      :class="{ 'border-danger': errors[0] }"
                    />
                  </ValidationProvider>
                </b-col>
                <!-- Input 2 -->
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
                      :class="{ 'border-danger': errors[0] }"
                    />
                  </ValidationProvider>
                </b-col>
                <!-- Input 3 -->
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
                      :class="{ 'border-danger': errors[0] }"
                    />
                  </ValidationProvider>
                </b-col>
                <!-- Input 4 -->
                <b-col cols="3">
                  <ValidationProvider rules="required" v-slot="{ errors }">
                    <b-form-input
                      class="border-hover-p"
                      ref="input-4"
                      @input="activeFocus(4, 4)"
                      v-model="cardnumber4"
                      type="text"
                      :class="{ 'border-danger': errors[0] }"
                    />
                  </ValidationProvider>
                </b-col>
              </b-row>
            </div>
          </b-col>
          <!-- Input MM -->
          <b-col cols="4" lg="2" md="4">
            <div class="form-group">
              <label for="card-expi-month">MM</label>
              <ValidationProvider rules="required|length:2" v-slot="{ errors }">
                <b-form-input
                  class="border-hover-p"
                  type="text"
                  id="card-expi-month"
                  ref="input-5"
                  maxlength="2"
                  @input="activeFocus(5, 2)"
                  v-model="form.card_expi_month"
                  :class="{ 'border-danger': errors[0] }"
                />
              </ValidationProvider>
            </div>
          </b-col>
          <!-- Input YY -->
          <b-col cols="4" lg="2" md="4">
            <div class="form-group">
              <label for="card-expi-year">YY</label>
              <ValidationProvider rules="required|length:2" v-slot="{ errors }">
                <b-form-input
                  class="border-hover-p"
                  type="text"
                  maxlength="2"
                  id="card-expi-year"
                  ref="input-6"
                  @input="activeFocus(6, 2)"
                  v-model="form.card_expi_year"
                  :class="{ 'border-danger': errors[0] }"
                />
              </ValidationProvider>
            </div>
          </b-col>
          <!-- Input CVV -->
          <b-col cols="4" lg="2" md="4">
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
                  maxlength="4"
                  max="4"
                  type="text"
                  :class="{ 'border-danger': errors[0] }"
                />
              </ValidationProvider>
            </div>
          </b-col>
          <!-- Option Billing Address -->
          <b-col cols="12" lg="6" md="10">
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
        <!-- MORE INFORMATION -->
        <b-row v-if="moreInfo == 0" class="font-bureau-style">
          <!-- Input Mailing Adress -->
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
                  :class="{ 'border-danger': errors[0] }"
                ></vue-google-autocomplete>
              </ValidationProvider>
            </div>
          </b-col>
          <!-- Input City -->
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
                  :class="{ 'border-danger': errors[0] }"
                />
              </ValidationProvider>
            </div>
          </b-col>
          <!-- Input State -->
          <b-col cols="6">
            <div class="form-group">
              <label for="state">State</label>
              <ValidationProvider rules="required" v-slot="{ errors }">
                <select
                  name="state"
                  id="state"
                  v-model="form.state"
                  class="form-control"
                  :class="{ 'border-danger': errors[0] }"
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
          <!-- Input Zip Code -->
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
                  :class="{ 'border-danger': errors[0] }"
                />
              </ValidationProvider>
            </div>
          </b-col>
          <!-- Input Country -->
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
                  :class="{ 'border-danger': errors[0] }"
                />
              </ValidationProvider>
            </div>
          </b-col>
        </b-row>
        <!-- Button Save -->
        <b-row>
          <b-col md="12" style="text-align: center" class="mt-4">
            <b-button
              class="btn-update-sn rounded font-bureau-style text-white"
              variant="primary"
              @click="createCard"
            >
              Save
            </b-button>
          </b-col>
        </b-row>
      </ValidationObserver>
    </b-modal>
  </div>
</template>

<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import PaymentService from "../service/payments.service";
export default {
  components: { VueGoogleAutocomplete },
  props: {
    idlead: {
      type: [String, Number],
    },
    session: {
      type: [String, Number],
    },
    ifModalCard: {
      type: Boolean,
    },
  },
  data: function () {
    return {
      mutableIfModalCard: this.ifModalCard,
      address_create_card_modal: "",
      states: [],
      cards: [],
      moreInfo: "1",
      form: {
        idlead: this.idlead,
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
        user: this.session,
      },
      cardnumber1: "",
      cardnumber2: "",
      cardnumber3: "",
      cardnumber4: "",
    };
  },
  async mounted() {
    try {
      const data = await PaymentService.getStates();
      this.states = data;
    } catch (error) {
      console.error(error);
      this.showToast(
        "danger",
        "top-right",
        "Error",
        "XIcon",
        "Something went wrong!"
      );
    }
  },
  methods: {
    activeFocus: function (index, max) {
      let inputValue = this.$refs?.[`input-${index}`];
      if (inputValue.value.length === max - 1) {
        const nextElement = this.$refs?.[`input-${index + 1}`];
        if (nextElement) nextElement.focus();
      }
    },
    getAddressData: function (address_create_card_modal) {
      this.direccion = address_create_card_modal;
      this.address_create_card_modal =
        this.direccion.street_number + " " + this.direccion.route;
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
            this.addPreloader();
            amgApi
              .post("/commons/create-card", this.form)
              .then((response) => {
                this.cards = response.data;
                this.$emit("new", this.cards);
                this.$emit("click", false);
                this.$store.commit("app/SET_LOADING", false);
                this.showSuccessSwal();
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
    closeModal: function () {
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
