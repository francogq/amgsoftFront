<template>
  <b-row>
    <b-col sm="12">
      <!-- Street -->
      <validation-provider
        v-slot="{ errors }"
        :name="`Mailing address (${addressData.prename})`"
        :rules="isRequired ? 'required' : null"
      >
        <b-form-group
          label="Mailing address"
          :label-for="`${addressData.prename}-street`"
          :state="errors[0] ? false : null"
        >
          <b-input-group>
            <vue-google-autocomplete
              :id="`${addressData.prename}-street`"
              :ref="`${addressData.prename}-street`"
              v-model="addressData.street"
              class="form-control input-form fond-white border-hover"
              placeholder="Please type your address"
              country="us"
              :class="{ 'border border-danger': errors[0] }"
              :readonly="(addressData.id && disabled.street) || isDisabled"
              @placechanged="getAddressData"
              @keyup="(e) => onChangeMaillingAddress(e, addressData)"
            />
            <template v-if="addressData.id && isEditable">
              <b-input-group-append
                v-if="!disabled.street"
                class="border-right"
              >
                <b-button
                  variant="outline-primary"
                  class="btn-sm"
                  @click="onSubmitAddress"
                >
                  <feather-icon icon="SaveIcon" class="cursor-pointer" />
                </b-button>
              </b-input-group-append>
              <b-input-group-append class="border-right">
                <b-button
                  variant="outline-warning"
                  class="btn-sm"
                  @click="toggleData('street')"
                >
                  <feather-icon
                    v-if="disabled.street"
                    icon="Edit2Icon"
                    class="cursor-pointer"
                  />
                  <amg-icon
                    v-else
                    icon="Edit2SlashIcon"
                    class="cursor-pointer"
                  />
                </b-button>
              </b-input-group-append>
              <b-input-group-append
                class="cursor-pointer"
                @click="$emit('onModalTrackingChangeOpen')"
              >
                <b-input-group-text>
                  <feather-icon icon="ListIcon" />
                </b-input-group-text>
              </b-input-group-append>
            </template>
          </b-input-group>
        </b-form-group>
      </validation-provider>
    </b-col>
    <b-col md="6">
      <!-- City -->
      <validation-provider
        v-slot="{ errors }"
        :name="`City (${addressData.prename})`"
        :rules="isRequired ? 'required' : null"
      >
        <b-form-group label="City" label-for="city">
          <b-form-input
            id="city"
            v-model="addressData.city"
            trim
            :disabled="isDisabled || disabled.street"
            :state="errors[0] ? false : null"
          />
        </b-form-group>
      </validation-provider>
      <!-- Zip Code -->
      <validation-provider
        v-slot="{ errors }"
        :name="`Zip Code (${addressData.prename})`"
        :rules="isRequired ? 'required' : null"
      >
        <b-form-group label="Zip Code" label-for="zipcode">
          <b-form-input
            id="zipcode"
            v-model="addressData.zipcode"
            trim
            :disabled="isDisabled || disabled.street"
            :state="errors[0] ? false : null"
          />
        </b-form-group>
      </validation-provider>
    </b-col>
    <b-col md="6">
      <!-- State -->
      <validation-provider
        v-slot="{ errors }"
        :name="`State (${addressData.prename})`"
        :rules="isRequired ? 'required' : null"
      >
        <b-form-group
          label="State"
          label-for="country"
          :state="errors[0] ? false : null"
        >
          <v-select
            id="country"
            v-model="addressData.state"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            label="state"
            :options="G_EEUU_STATES"
            :disabled="isDisabled || disabled.street"
            :reduce="(el) => el.value"
          />
        </b-form-group>
      </validation-provider>
      <!-- Country -->
      <validation-provider
        v-slot="{ errors }"
        :name="`Country (${addressData.prename})`"
        :rules="isRequired ? 'required' : null"
      >
        <b-form-group label="Country" label-for="country">
          <b-form-input
            id="country"
            v-model="addressData.country"
            trim
            :disabled="isDisabled || disabled.street"
            :state="errors[0] ? false : null"
          />
        </b-form-group>
      </validation-provider>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInvalidFeedback,
  BButton,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

import vSelect from "vue-select";
import VueGoogleAutocomplete from "vue-google-autocomplete";

import formValidation from "@core/comp-functions/forms/form-validation";

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInvalidFeedback,
    BButton,
    vSelect,
    VueGoogleAutocomplete,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    addressData: {
      type: Object,
      required: true,
    },
    isRequired: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isEditable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      addSocial: false,
      blankAddressData: new Object(),
      disabled: {
        street: true,
      },
      hideSSN: false,
      hideITIN: false,
      hideWithOtherAddress: false,
      hideCPN: false,
      labssn: false,
      labitin: false,
      location: null,
    };
  },
  computed: {
    ...mapGetters({
      G_EEUU_STATES: "CrmGlobalStore/G_EEUU_STATES",
    }),
  },
  created() {
    this.setDataBlank("addressData");
    this.fieldsNotDisabled();
  },
  setup(props, { emit }) {
    const { refFormObserver, getValidationState } = formValidation(() => {});

    return {
      refFormObserver,
      getValidationState,
    };
  },
  mounted() {},
  methods: {
    onChangeMaillingAddress(event, data){
      this.$set(data, 'street', event.target.value)
    },
    fieldsNotDisabled() {
      if (!(this.addressData.id && this.isEditable))
        this.disabled.street = false;
    },
    setDataBlank(key) {
      this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`] = {
        ...this[key],
      };
    },
    resetData(key) {
      const object = this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`];
      for (const subkey in object) {
        this[key][subkey] = object[subkey];
      }
    },
    getObjectToKey(array, keyId) {
      const index = array.map((el) => el.id).indexOf(keyId);
      if (index !== -1) return array[index];
      return null;
    },
    getAddressData(mainAddress) {
      const location = mainAddress;
      const address = `${location.street_number} ${location.route}`;
      this.$refs[`${this.addressData.prename}-street`].$el.value = address;
      this.addressData.state = mainAddress.administrative_area_level_1;
      this.$refs[`${this.addressData.prename}-street`].$el.value = address
      this.addressData.street = address;
      this.addressData.city = location.locality;
      this.addressData.zipcode = location.postal_code;
    },
    toggleData(key) {
      this.disabled[key] = !this.disabled[key];
      if (this.disabled[key]) this.resetData("addressData");
    },
    onSubmitAddress() {
      if (!this.addressData.street) {
        this.addressData.street = this.addressData.streetReal;
      }
      this.$emit("onSubmitAddress", false);

      this.blankAddressData.street = this.addressData.street;
      this.blankAddressData.city = this.addressData.city;
      this.blankAddressData.state = this.addressData.state;
      this.blankAddressData.zipcode = this.addressData.zipcode;
      this.blankAddressData.country = this.addressData.country;
      this.disabled.street = !this.disabled.street;
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
.sidebar-xl {
  width: 90rem;
}
</style>
