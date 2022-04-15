<template>
  <div>
    <b-row class="mt-2 text-left">
      <b-col mb="12">
        <ValidationProvider rules="" v-slot="{errors}" :name="`${this.titleC} address`">
          <b-form-group
              id="fieldset-horizontal"
              label-class="font-bureau-style font-weight-normal color-gray-input-sn"
              label-cols-sm="2"
              label-for="input-horizontal"
              label-cols-lg="2"
              content-cols-sm
              content-cols-lg="10"
              label="Address"
          >
            <vue-google-autocomplete
                :id="`${titleC}-${streetC}-street`"
                :ref="`${titleC}-${streetC}-street`"
                v-model="streetC"
                class="form-control input-form fond-white border-hover pl-1"
                placeholder="Please type your address"
                country="us"
                :readonly="false"
                @placechanged="getAddressData"
                @keyup="(e) => onChangeAddress(e, streetC)"
                :state="errors[0] ? false : null"
                :class="{'border-error-sn style-chooser' :errors[0]}"
            />
            <div v-if="errors[0]" class="text-error-sn text-center">Address {{errors[0]}}</div>
          </b-form-group>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-2 text-left">
      <b-col mb="6">
        <ValidationProvider rules="" v-slot="{errors}" :name="`${this.titleC} city`">
          <b-form-group
              id="fieldset-horizontal"
              label-class="font-bureau-style font-weight-normal color-gray-input-sn"
              label-cols-sm="4"
              label-for="input-horizontal"
              label-cols-lg="4"
              content-cols-sm
              content-cols-lg="8"
              label="City"
          >
            <b-form-input
                v-model="cityC"
                class="select-icon-none font-bureau-style border-hover bg-white-c"
                :class="{'border-error-sn' :errors[0]}"
                placeholder="Please type city"
                :state="errors[0] ? false : null"

            ></b-form-input>
            <div v-if="errors[0]" class="text-error-sn text-center">City {{errors[0]}}</div>
          </b-form-group>
        </ValidationProvider>
      </b-col>
      <b-col mb="6">
        <ValidationProvider rules="" v-slot="{errors}" :name="`${this.titleC} state`">
          <b-form-group
              id="fieldset-horizontal"
              label-class="font-bureau-style font-weight-normal color-gray-input-sn"
              label-cols-sm="4"
              label-for="input-horizontal"
              label-cols-lg="4"
              content-cols-sm
              content-cols-lg="8"
              label="State"
              :state="errors[0] ? false : null"
          >
            <v-select
                id="state_more_information"
                v-model="stateC"
                :selected="null"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                label="label"
                :options="S_STATES_EEUU"
                :clearable="false"
                :reduce="el => el.value"
            />
            <input type="radio" class="d-none bg-green" v-model="stateC" />
            <div v-if="errors[0]" class="text-error-sn text-center">State {{errors[0]}}</div>
          </b-form-group>

        </ValidationProvider>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import vSelect from "vue-select";
import {mapActions, mapState} from "vuex";
export default {
  name: 'StreetCreateSN',
  props: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    title: {
      type: String,
      default: 'asd'
    }
  },
  data () {
    return {
      streetC: '',
      cityC: '',
      stateC: '',
      titleC: ''
    }
  },
  components: {
    vSelect,
    VueGoogleAutocomplete,
    ValidationProvider,
    ValidationObserver,
  },
  computed: {
    ...mapState('SocialNetworkLeadsStore', ['S_STATES_EEUU']),
  },
  async created() {
    await this.A_GET_STATE_EEUU()
    this.streetC = this.street;
    this.cityC = this.city;
    this.stateC = this.state
  },
  mounted() {

  },
  methods: {
    ...mapActions(
        'SocialNetworkLeadsStore',
        [
          'A_STATUS_LEADS',
          'A_GET_STATE_EEUU',
        ]
    ),

    onChangeAddress(event, data) {
      this.streetC = `${event.target.value}`;
      this.$emit('street-changed', { street: this.streetC, state: this.state, city: this.cityC })
    },
    getAddressData: function (addressData) {
      const address = `${addressData.street_number} ${addressData.route}`;
      this.$refs[`${this.titleC}-${this.streetC}-street`].$el.value = address;
      this.cityC = addressData.locality;
      this.stateC = addressData.administrative_area_level_1
      this.streetC = address;
      this.$emit('street-changed', { street: this.streetC, state: this.stateC, city: this.cityC })
    },
  }
}
</script>

<style scoped lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
.style-chooser {
  border: 1px solid #fc424a !important;

  padding: .1rem;
  border-radius: 0.3rem
}
</style>