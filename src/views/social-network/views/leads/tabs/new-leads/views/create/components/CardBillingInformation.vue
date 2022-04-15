<template>
  <div>
    <b-card>
      <b-container>
        <b-row>
          <b-col md="6">
            <h4 class="title-card">Billing Information</h4>
          </b-col>
        </b-row>
      </b-container>
      <b-container class="mt-1">
        <br />

        <b-row>
          <b-col md="9">
            <standar-form-group label="Card Holder Name">
              <b-form-input
                v-model="lead.card_holder_name"
                placeholder="Card Holder Name"
              ></b-form-input>
            </standar-form-group>
          </b-col>
          <b-col md="9">
            <standar-form-group label="Card">
              <b-row>
                <b-col md="2">
                  <b-form-input
                    ref="input-1"
                    v-model="card_number_1"
                    @input="activeFocus(1, 4), showLogoByCardNumber(2)"
                    v-mask="'####'"
                  ></b-form-input>
                </b-col>
                <b-col md="2">
                  <b-form-input
                    ref="input-2"
                    v-model="card_number_2"
                    @input="activeFocus(2, 4), showLogoByCardNumber(3)"
                    v-mask="'####'"
                  ></b-form-input>
                </b-col>
                <b-col md="2">
                  <b-form-input
                    ref="input-3"
                    v-model="card_number_3"
                    @input="activeFocus(3, 4), showLogoByCardNumber(4)"
                    v-mask="'####'"
                  ></b-form-input>
                </b-col>
                <b-col md="2">
                  <b-form-input
                    ref="input-4"
                    v-model="card_number_4"
                    @input="activeFocus(4, 4), showLogoByCardNumber(5)"
                    v-mask="'####'"
                  ></b-form-input>
                </b-col>
                <b-col md="2">
                  <img
                    v-if="show_card_logo"
                    :src="image_card"
                    style="margin-top: 5px; max-height: 30px; max-width: 70px"
                    id="imgcard"
                  />
                </b-col>
              </b-row>
            </standar-form-group>
          </b-col>
          <b-col md="9">
            <standar-form-group label="Expired Date">
              <b-row>
                <b-col md="4">
                  <b-form-input
                    ref="input-5"
                    v-model="lead.card_exp_month"
                    @input="activeFocus(5, 2)"
                    v-mask="'##'"
                    placeholder="MM"
                  ></b-form-input>
                </b-col>
                <b-col md="4">
                  <b-form-input
                    ref="input-6"
                    v-model="lead.card_exp_year"
                    @input="activeFocus(6, 2)"
                    v-mask="'##'"
                    placeholder="YY"
                  ></b-form-input>
                </b-col>
                <b-col md="4">
                  <b-form-input
                    ref="input-7"
                    v-model="lead.card_security_code"
                    v-mask="'####'"
                    placeholder="CCV"
                    maxlength="16"
                  ></b-form-input>
                </b-col>
              </b-row>
            </standar-form-group>
          </b-col>
          <b-col md="9">
            <standar-form-group
              label="Billing Address is the same the Mailling Address ?"
            >
              <b-row>
                <b-col md="3">
                  <b-button
                    :variant="anotherAddress ? 'secondary' : 'warning'"
                    class="btn-block"
                    @click="anotherAddress = false"
                  >
                    Yes
                  </b-button>
                </b-col>

                <b-col md="3">
                  <b-button
                    :variant="anotherAddress ? 'warning' : 'secondary'"
                    class="btn-block"
                    @click="anotherAddress = true"
                  >
                    No
                  </b-button>
                </b-col>
              </b-row>
            </standar-form-group>
          </b-col>

          <!-- Negative answer -->
          <template v-if="anotherAddress">
            <b-col cols="12">
              <standar-form-group label="Address" cols="12">
                <vue-google-autocomplete
                  v-model="lead.street_card"
                  id="street-card-address"
                  class="form-control form-group-col-12"
                  placeholder="Pleace type your address"
                  country="us"
                  v-on:placechanged="getAddressData"
                >
                </vue-google-autocomplete>
              </standar-form-group>
            </b-col>

            <b-col cols="6">
              <standar-form-group label="City">
                <b-form-input v-model="lead.city_card"></b-form-input>
              </standar-form-group>
            </b-col>

            <b-col cols="6">
              <standar-form-group label="State">
                <v-select
                  v-model="lead.state_card"
                  :options="G_STATES_EEUU"
                ></v-select>
              </standar-form-group>
            </b-col>

            <b-col cols="6">
              <standar-form-group label="Zip Code">
                <b-form-input v-model="lead.zip_code_card"></b-form-input>
              </standar-form-group>
            </b-col>

            <b-col cols="6">
              <standar-form-group label="Country">
                <b-form-input v-model="lead.country_card"></b-form-input>
              </standar-form-group>
            </b-col>
          </template>
        </b-row>
      </b-container>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// Components
import vSelect from "vue-select";
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";
import VueGoogleAutocomplete from "vue-google-autocomplete";

export default {
  components: {
    vSelect,
    VueGoogleAutocomplete,
    "standar-form-group": StandarFormGroup,
  },
  props: {
    lead: {
      type: Object,
    },
  },
  data() {
    return {
      baseImg: process.env.VUE_APP_BASE_URL_FRONT,
      anotherAddress: false,

      // Card data
      card_number_1: "",
      card_number_2: "",
      card_number_3: "",
      card_number_4: "",
      image_card: "",
      show_card_logo: false,

      // Logo options
      americanCardOptions: new Set([34, 37]),
      discoverCardOptions: new Set([60, 62, 64, 65]),
      masterCardOptions: new Set([30, 36, 38, 39, 51, 52, 53, 54, 55]),
      jcbCardOptions: new Set([30, 35]),
    };
  },
  computed: {
    ...mapGetters({
      G_STATES_EEUU: "StandarStore/G_STATES_EEUU",
    }),
  },
  watch: {
    anotherAddress(newVal) {
      this.lead.street_card = "";
      this.lead.zip_code_card = "";
      this.lead.city_card = "";
      this.lead.state_card = "";
    },
  },
  methods: {
    activeFocus(index, max) {
      let inputValue = this.$refs?.[`input-${index}`];
      if (inputValue.value.length === max) {
        const nextElement = this.$refs?.[`input-${index + 1}`];
        if (nextElement) nextElement.focus();
      }
    },
    showLogoByCardNumber(id) {
      let card = this.card_number_1.substr(0, 2);
      let card_fl = this.card_number_1.substr(0, 1);

      this.show_card_logo = true;
      this.image_card = this.baseImg + "/assets/images/cards/";

      if (card_fl == 4) {
        this.image_card += "visa2.png";
      } else if (this.americanCardOptions.has(card)) {
        this.image_card += "american.png";
      } else if (this.discoverCardOptions.has(card)) {
        this.image_card += "Discover.png";
      } else if (
        (card >= 20 && card <= 27) ||
        this.masterCardOptions.has(card)
      ) {
        this.image_card += "mastercard2.png";
      } else if (this.jcbCardOptions.has(card)) {
        this.image_card += "jcb2.png";
      } else {
        this.image_card = "";
        this.show_card_logo = false;
      }
    },
    getAddressData(mainAddress, details, type) {
      let address = mainAddress.stree_number
        ? mainAddress.street_number + " " + mainAddress.route
        : mainAddress.route;

      const index = this.G_STATES_EEUU.map((el) => el.id).indexOf(
        mainAddress.administrative_area_level_1
      );

      this.lead.street_card = address;
      this.lead.city_card = mainAddress.locality;
      this.lead.zip_code_card = mainAddress.postal_code;
      this.lead.state_card = this.G_STATES_EEUU[index].label;
    },
  },
};
</script>

<style>
.form-group-col-12 {
  margin-left: -58px;
}
</style>