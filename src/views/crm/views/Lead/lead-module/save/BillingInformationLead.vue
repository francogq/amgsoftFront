<template>
  <b-card>
    <template #header>
      <b-card-title>BILLING INFORMATION</b-card-title>
    </template>
    <b-row>
      <b-col md="6">
        <!-- Card Holder Name -->
        <validation-provider
          name="Card Holder Name"
        >
          <b-form-group
            label="Card Holder Name"
            label-for="card-holdername"
          >
            <b-form-input
              id="card-holdername"
              v-model="userData.cardHoldername"
              autofocus
              trim
              @keyup="capitalize('cardHoldername')"
            />
          </b-form-group>
        </validation-provider>
        <!-- Card -->
        <b-form-group>
          <label class="d-block">Card</label>
          <b-row class="mx-0" style="gap: .25rem;">
            <b-col xs="6" md="2" class="px-0">
              <validation-provider
                v-slot="{errors}"
                name="card-number-1"
                rules="integer"
              >
                <b-form-input
                  id="card-number-1"
                  ref="input-1"
                  v-model="userData.cardNumber1"
                  autofocus
                  trim
                  maxlength="4"
                  :class="{'border-danger rounded': errors[0]}"
                  @input="activeFocus(1, 4)"
                  @keyup.native="activefocus(2)"
                />
              </validation-provider>
            </b-col>
            <b-col xs="6" md="2" class="px-0">
              <validation-provider
                v-slot="{errors}"
                name="card-number-2"
                rules="integer"
              >
                <b-form-input
                  id="card-number-2"
                  ref="input-2"
                  v-model="userData.cardNumber2"
                  autofocus
                  trim
                  maxlength="4"
                  :class="{'border-danger rounded': errors[0]}"
                  @input="activeFocus(2, 4)"
                  @keyup.native="activefocus(3)"
                />
              </validation-provider>
            </b-col>
            <b-col xs="6" md="2" class="px-0">
              <validation-provider
                v-slot="{errors}"
                name="card-number-3"
                rules="integer"
              >
                <b-form-input
                  id="card-number-3"
                  ref="input-3"
                  v-model="userData.cardNumber3"
                  autofocus
                  trim
                  maxlength="4"
                  :class="{'border-danger rounded': errors[0]}"
                  @input="activeFocus(3, 4)"
                  @keyup.native="activefocus(4)"
                />
              </validation-provider>
            </b-col>
            <b-col xs="6" md="2" class="px-0">
              <validation-provider
                v-slot="{errors}"
                name="card-number-4"
                rules="integer"
              >
                <b-form-input
                  id="card-number-4"
                  ref="input-4"
                  v-model="userData.cardNumber4"
                  autofocus
                  trim
                  maxlength="4"
                  :class="{'border-danger rounded': errors[0]}"
                  @input="activeFocus(4, 4)"
                  @keyup.native="activefocus(5)"
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
        <b-form-group>
          <label for="card-expi-month" class="d-block">Expired Date</label>
          <b-row>
            <b-col sm="4">
              <validation-provider
                v-slot="{errors}"
                name="card-expi-month"
                rules="integer"
              >
                <b-form-input
                  id="card-expi-month"
                  ref="input-5"
                  placeholder="MM"
                  v-model="userData.cardExpiMonth"
                  autofocus
                  trim
                  maxlength="2"
                  :state="errors[0] ? false : null"
                  @keyup.native="activeFocus(5, 3)"
                />
              </validation-provider>
            </b-col>
            <b-col sm="4">
              <validation-provider
                v-slot="{errors}"
                name="card-expi-year"
                rules="integer"
              >
                <b-form-input
                  id="card-expi-year"
                  ref="input-6"
                  placeholder="YY"
                  v-model="userData.cardExpiYear"
                  autofocus
                  trim
                  maxlength="2"
                  :state="errors[0] ? false : null"
                  @keyup.native="activeFocus(6, 3)"
                />
              </validation-provider>
            </b-col>
            <b-col sm="4">
              <validation-provider
                v-slot="{errors}"
                name="card-security-code"
                rules="integer"
              >
                <b-form-input
                  id="card-security-code"
                  ref="input-7"
                  placeholder="CVV"
                  v-model="userData.cardSecurityCode"
                  autofocus
                  trim
                  maxlength="4"
                  :state="errors[0] ? false : null"
                />
              </validation-provider>
            </b-col>
          </b-row>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox
            id="yes-or-not-address"
            name="yes-or-not-address"
            value="yes-or-not-address"
            @input="otherinfo = !otherinfo"
            class="mt-2"
          >
            Billing Address is the same the Mailling Address?
          </b-form-checkbox>

        </b-form-group>
      </b-col>
    </b-row>
    <address-lead v-if="otherinfo" :addressData="userData.cardAddress"></address-lead>
  </b-card>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, alphaNum, email } from '@validations'

import vSelect from 'vue-select'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

import formValidation from '@core/comp-functions/forms/form-validation'

import AddressLead from '@/views/crm/views/Lead/components/AddressComponent.vue'

import imageAmerican from '@/assets/images/cards/american.png'
import imageDiscover from '@/assets/images/cards/Discover.jpg'
import imageJcb from '@/assets/images/cards/jcb2.png'
import imageMastercard from '@/assets/images/cards/mastercard2.png'
import imageVisa from '@/assets/images/cards/visa2.png'

export default {
  components: {
    AddressLead,
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,
    VueGoogleAutocomplete,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  model: {
    event: 'update:is-add-new-user-sidebar-active',
  },
  props: {
    userData: {
      required: true
    },
  },
  data() {
    return {
      required,
      alphaNum,
      email,
      imgCardChange: false,
      imgcard: '',
      otherinfo: false,
    }
  },
  computed: {},
  setup(props, { emit }) {
    const blankUserData = {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      programs: '',
      dob: '',
      language: '',
      stateLead: '',
    }

    const resetuserData = () => {
      userData.value = JSON.parse(JSON.stringify(blankUserData))
    }
    const {
      refFormObserver,
      getValidationState,
    } = formValidation(resetuserData)

    return {
      refFormObserver,
      getValidationState,
    }
  },
  methods: {
    capitalize (el) {
      const element = this.userData[el]
      this.userData[el] = element.substr(0, 1).toUpperCase() + element.substr(1)
    },
    activeFocus(index, max) {
      const inputValue = this.$refs?.[`input-${index}`]
      if (inputValue.value.length + 1 === max) {
        const nextElement = this.$refs?.[`input-${index + 1}`]
        if (nextElement) nextElement.focus()
      }
    },
    activefocus (id) {
      if (id == 2) {
        const card = this.userData.cardNumber1.substr(0, 2)
        const cardm = this.userData.cardNumber1.substr(0, 1)
        if (cardm == 4) {
          this.imgCardChange = true
          this.imgcard = imageVisa
        } else if (['34', '37'].includes(card)) {
          this.imgCardChange = true
          this.imgcard = imageAmerican
        } else if (card == 60 || card == 62 || card == 64 || card == 65) {
          this.imgCardChange = true
          this.imgcard = imageDiscover
        } else if ([ '30', '20', '21', '36', '38', '39', '54', '55', '51', '52', '53', '22', '23', '24', '25', '26', '27' ].includes(card)) {
          this.imgCardChange = true
          this.imgcard = imageMastercard
        } else if (['30', '35'].includes(card)) {
          this.imgCardChange = true
          this.imgcard = imageJcb
        } else {
          this.imgCardChange = false
          this.imgcard = ''
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
.sidebar-xl {
  width: 90rem;
}
</style>
