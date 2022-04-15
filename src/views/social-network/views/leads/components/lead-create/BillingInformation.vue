<template>
  <div>
    <b-card no-body class="p-2 mt-4">
      <b-row>
        <b-col md="6">
          <h4 class="title-card text-left">Billing Information</h4>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8" class="text-left">
          <!-- Card Holder Name -->
          <ValidationProvider rules="" v-slot="{errors}" name="input-create-lead-25,Card Holder Name">
            <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                label="Card Holder Name"
                id="input-create-lead-25"
            >
              <b-form-input
                  v-model="lead.cardholdername"
                  class="select-icon-none font-bureau-style border-hover bg-white-c"
                  :class="{'border-error-sn' :errors[0]}"
                  :state="errors[0] ? false : null"
                  @keyup="capitalize"
                  placeholder="Please type card holder name"
              ></b-form-input>
              <div v-if="errors[0]" class="text-error-sn text-center">Card Holder Name {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
          <!-- Card -->
          <b-form-group
              id="fieldset-horizontal"
              label-class="font-bureau-style font-weight-normal color-gray-input-sn"
              label-cols-sm="4"
              label-for="input-horizontal"
              label-cols-lg="4"
              content-cols-sm
              content-cols-lg="8"
              label="Card"
          >
            <b-row class="mx-0 " style="gap: .25rem;">
              <b-col xs="6" md="2" class="px-0">
                <validation-provider
                    v-slot="{errors}"
                    name="input-create-lead-26,Card number 1"
                    rules=""
                >
                  <b-form-input
                      ref="input-1"
                      trim
                      maxlength="4"
                      :class="{'border-error-sn' :errors[0]}"
                      :state="errors[0] ? false : null"
                      v-mask="'####'"
                      v-model="cardNumber1"
                      @input="activeFocus(1, 4)"
                      placeholder="####"
                      id="input-create-lead-26"
                  />
                  <div class="d-flex align-items-center justify-content-center position-relative">
                    <p v-if="errors[0]" class="text-error-sn text-center text-transparent m-0">Card</p>
                    <div class="position-absolute d-flex align-items-center justify-content-center card-error">
                      <p v-if="errors[0]" class="text-error-sn text-center m-0">Card {{errors[0]}}</p>
                    </div>
                  </div>
                </validation-provider>
              </b-col>
              <b-col xs="6" md="2" class="px-0">
                <validation-provider
                    v-slot="{errors}"
                    name="input-create-lead-27,Card number 2"
                    rules=""
                >
                  <b-form-input
                      id="input-create-lead-27"
                      ref="input-2"
                      v-model="cardNumber2"
                      @input="activeFocus(2, 4)"
                      trim
                      maxlength="4"
                      :class="{'border-error-sn' :errors[0]}"
                      :state="errors[0] ? false : null"
                      v-mask="'####'"
                      placeholder="####"
                  />
                </validation-provider>
              </b-col>
              <b-col xs="6" md="2" class="px-0">
                <validation-provider
                    v-slot="{errors}"
                    name="input-create-lead-28,Card number 3"
                    rules=""
                >
                  <b-form-input
                      id="input-create-lead-28"
                      ref="input-3"
                      v-model="cardNumber3"
                      @input="activeFocus(3, 4)"
                      trim
                      maxlength="4"
                      :class="{'border-error-sn' :errors[0]}"
                      :state="errors[0] ? false : null"
                      v-mask="'####'"
                      placeholder="####"
                  />
                </validation-provider>
              </b-col>
              <b-col xs="6" md="2" class="px-0">
                <validation-provider
                    v-slot="{errors}"
                    name="input-create-lead-29,Card number 4"
                    rules=""
                >
                  <b-form-input
                      id="input-create-lead-29"
                      ref="input-4"
                      v-model="cardNumber4"
                      @input="activeFocus(4, 4)"
                      trim
                      maxlength="4"
                      :class="{'border-error-sn' :errors[0]}"
                      :state="errors[0] ? false : null"
                      v-mask="'####'"
                      placeholder="####"
                  />
                </validation-provider>
              </b-col>
              <b-col xs="12" md="3" class="text-center">
                <img
                    :src="imgcard"
                    :style="`${!imgCardChange ? 'display:none':'display:block'}height:30px;width:70px;`"
                    alt=""/>
              </b-col>
            </b-row>

          </b-form-group>
          <!-- Expired Date -->
          <b-form-group
              id="fieldset-horizontal"
              label-class="font-bureau-style font-weight-normal color-gray-input-sn"
              label-cols-sm="4"
              label-for="input-horizontal"
              label-cols-lg="4"
              content-cols-sm
              content-cols-lg="8"
              label="Expired Date"
          >
            <b-row>
              <b-col sm="4">
                <validation-provider
                    v-slot="{errors}"
                    name="input-create-lead-30,Card month"
                    rules=""
                >
                  <b-form-input
                      id="input-create-lead-30"
                      ref="input-5"
                      placeholder="MM"
                      v-model="lead.card_expi_month"
                      :class="{'border-error-sn' :errors[0]}"
                      @input="activeFocus(5, 2)"
                      trim
                      maxlength="2"
                      :state="errors[0] ? false : null"
                      v-mask="'##'"
                  />
                  <div v-if="errors[0]" class="text-error-sn text-center">Month {{errors[0]}} {{errors[1]}}</div>
                </validation-provider>
              </b-col>
              <b-col sm="4">
                <validation-provider
                    v-slot="{errors}"
                    name="input-create-lead-31,Card year"
                    rules=""
                >
                  <b-form-input
                      id="input-create-lead-31"
                      ref="input-6"
                      placeholder="YY"
                      v-model="lead.card_expi_year"
                      @input="activeFocus(6, 2)"
                      trim
                      maxlength="2"
                      :state="errors[0] ? false : null"
                      v-mask="'##'"
                  />
                  <div v-if="errors[0]" class="text-error-sn text-center">Year {{errors[0]}}</div>
                </validation-provider>
              </b-col>
              <b-col sm="4">
                <validation-provider
                    v-slot="{errors}"
                    name="input-create-lead-32,Card code"
                    rules=""
                >
                  <b-form-input
                      id="input-create-lead-32"
                      ref="input-7"
                      placeholder="CVV"
                      v-model="lead.cardsecuritycode"
                      trim
                      maxlength="3"
                      :state="errors[0] ? false : null"
                      v-mask="'###'"
                  />
                  <div v-if="errors[0]" class="text-error-sn text-center">Code {{errors[0]}}</div>
                </validation-provider>
              </b-col>
            </b-row>

          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-2 mb-1 text-left">
        <b-col md="3">
          <div  class="d-flex align-items-center justify-content-center">
            <span>
              Billing Address is the same the Mailling Address ?
            </span>
          </div>

        </b-col>
        <b-col md="3">

          <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant=""
              class="mr-2"
              :class="addAddress ? '' : 'btn-danger'"
              @click="addAddress = false"
          >
            <span >Yes</span>
          </b-button>
          <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant=""
              class="mr-2"
              :class="!addAddress ? '' : 'btn-danger'"
              @click="addAddress = true"
          >
            <span >No</span>
          </b-button>

        </b-col>
      </b-row>

      <template v-if="addAddress">

        <StreetCreateSN
            title="Billing street"
            :street="lead.streetcard"
            :city="lead.citycard"
            :state="lead.statecard"
            @street-changed="streetChangedBilling"
        />

        <b-row class="mt-2 text-left">
          <b-col mb="6" >
            <ValidationProvider rules="" v-slot="{errors}" name="input-create-lead-33,Card zip code">
              <b-form-group
                  id="input-create-lead-33"
                  label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                  label-cols-sm="4"
                  label-for="input-horizontal"
                  label-cols-lg="4"
                  content-cols-sm
                  content-cols-lg="8"
                  label="Zip Code"
              >
                <b-form-input
                    v-model="lead.zipcodecard"
                    class="select-icon-none font-bureau-style border-hover bg-white-c"
                    :class="{'border-error-sn' :errors[0]}"
                    :state="errors[0] ? false : null"
                    type="number"
                ></b-form-input>
                <div v-if="errors[0]" class="text-error-sn text-center">Zip code {{errors[0]}}</div>
              </b-form-group>
            </ValidationProvider>
          </b-col>
          <b-col mb="6">
            <ValidationProvider rules="required" v-slot="{errors}" name="input-create-lead-34,Card Country">
              <b-form-group
                  id="input-create-lead-34"
                  label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                  label-cols-sm="4"
                  label-for="input-horizontal"
                  label-cols-lg="4"
                  content-cols-sm
                  content-cols-lg="8"
                  label="Country"
              >
                <b-input
                    :disabled="true"
                  v-model="lead.countrycard"
                />
                <input type="radio" class="d-none bg-green" v-model="lead.countrycard" />
                <div v-if="errors[0]" class="text-error-sn text-center">Country {{errors[0]}}</div>
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>

      </template>

    </b-card>
  </div>
</template>

<script>
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import {mapState} from "vuex";
import StreetCreateSN from "./StreetCreateSN";
import imageVisa from "@/assets/images/cards/visa2.png";
import imageAmerican from "@/assets/images/cards/american.png";
import imageDiscover from "@/assets/images/cards/Discover.jpg";
import imageMastercard from "@/assets/images/cards/mastercard2.png";
import imageJcb from "@/assets/images/cards/jcb2.png";

export default {
  data () {
    return {
      addAddress: false,
      imgCardChange:false,
      imgcard: '',
      cardNumber1: null,
      cardNumber2: "",
      cardNumber3: "",
      cardNumber4: "",
    }
  },
  created() {
  },
  directives: {
    Ripple,
  },
  props: {
    lead: {
      type: Object,
      default: () => ({}),
    },
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    StreetCreateSN,
    vSelect
  },
  computed: {
    ...mapState('SocialNetworkLeadsStore', ['S_STATES_EEUU']),
  },
  methods: {
    streetChangedBilling({street, city, state}) {
      this.lead.streetcard = street
      this.lead.citycard = city
      this.lead.statecard = state
    },
    capitalize () {
      this.lead.cardholdername = this.lead.cardholdername.charAt(0).toUpperCase() + this.lead.cardholdername.slice(1)
    },
    activeFocus(index, max) {
      const inputValue = this.$refs?.[`input-${index}`]
      if (inputValue.value.length  === max) {
        const nextElement = this.$refs?.[`input-${index + 1}`]
        if (nextElement) nextElement.focus()
      }
    },
    resetImageCard(img) {
      this.imgCardChange = true
      this.imgcard = img
    }
  },
  watch: {
    cardNumber1 () {
      const card = this.cardNumber1.substr(0, 2)
      const cardm = this.cardNumber1.substr(0, 1)
      if(cardm === '4' || cardm.includes('4')) {
        this.resetImageCard(imageVisa)
      } else {
        switch (card) {
          case '34':
          case '37':
            this.resetImageCard(imageAmerican)
            break;
          case '60':
          case '62':
          case '64':
          case '65':
            this.resetImageCard(imageDiscover)
            break;
          case '20':
          case '21':
          case '36':
          case '38':
          case '39':
          case '54':
          case '55':
          case '51':
          case '52':
          case '53':
          case '22':
          case '23':
          case '24':
          case '25':
          case '26':
          case '27':
            this.resetImageCard(imageMastercard)
            break;
          case '30':
          case '35':
            this.resetImageCard(imageJcb)
            break;
          default:
            this.resetImageCard('')
        }
      }
      this.lead.cardnumber = `${this.cardNumber1}-${this.cardNumber2}-${this.cardNumber3}-${this.cardNumber4}`
    },
    cardNumber2() {
      this.lead.cardnumber = `${this.cardNumber1}-${this.cardNumber2}-${this.cardNumber3}-${this.cardNumber4}`
    },
    cardNumber3() {
      this.lead.cardnumber = `${this.cardNumber1}-${this.cardNumber2}-${this.cardNumber3}-${this.cardNumber4}`
    },
    cardNumber4 () {
      this.lead.cardnumber = `${this.cardNumber1}-${this.cardNumber2}-${this.cardNumber3}-${this.cardNumber4}`
    },
    "lead.card_expi_month"(){
      if(this.lead.card_expi_month > 12) {
        this.lead.card_expi_month = 12
        const nextElement = this.$refs?.[`input-6`]
        nextElement.focus()
      }
      if(this.lead.card_expi_month === '00') {
        this.lead.card_expi_month = '01'
      }

    },
    "lead.card_expi_year"() {
      if(this.lead.card_expi_month < 10 && this.lead.card_expi_month.length == 1) {
        this.lead.card_expi_month = `0${this.lead.card_expi_month}`
      }
    }
  }

}
</script>

<style>
.card-error{
  top: 0;
  left: 0;
  width: 354px;
}
.text-transparent{
  color: transparent;
}
</style>