<template>
  <b-card>
    <template #header>
      <b-card-title>PERSONAL INFORMATION</b-card-title>
    </template>
    <b-row>
      <b-col md="6">
        <!-- First Name -->
        <validation-provider v-slot="{errors}" name="First Name" rules="required">
          <b-form-group label="First Name" label-for="first-name">
            <b-form-input
                id="first-name"
                v-model="userData.first_name"
                name="first-name"
                autofocus
                :state="errors[0] ? false : null"
                trim
                @keyup="capitalize('first_name')"
            />
          </b-form-group>
        </validation-provider>
        <!-- MiddleName -->
        <validation-provider name="MiddleName">
          <b-form-group label="MiddleName" label-for="middle-name">
            <b-form-input id="middle-name" v-model="userData.middle_name" trim/>
          </b-form-group>
        </validation-provider>
        <!-- LastName -->
        <validation-provider v-slot="{errors}" name="LastName" rules="required">
          <b-form-group label="LastName" label-for="last-name">
            <b-form-input
                id="last-name"
                v-model="userData.last_name"
                trim
                :state="errors[0] ? false : null"
                @keyup="capitalize('last_name')"
            />
          </b-form-group>
        </validation-provider>
        <!-- Email -->
        <validation-provider
            v-slot="{errors}"
            name="Email"
            :rules="`${!disabledemail ? 'required|email' : ''}`"
        >
          <b-form-group label="Email" label-for="email">
            <b-form-input
                id="email"
                v-model="userData.email"
                trim
                :state="errors[0] ? false : null"
                :disabled="disabledemail"
            />
          </b-form-group>
        </validation-provider>
        <b-form-group>
          <b-form-checkbox
              id="without-email"
              v-model="hasNotEmailChecked"  
              @input="disabledemail = !disabledemail"
          >Client has not email
          </b-form-checkbox>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <!-- Programs -->
        <validation-provider name="Programs">
          <b-form-group label="Programs" label-for="programs">
            <v-select
                v-model="programsList"
                multiple
                label="label"
                input-id="programs"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="G_PROGRAMS"
            />
          </b-form-group>
        </validation-provider>
        <!-- Dob -->
        <validation-provider name="DOB">
          <b-form-group label="DOB" label-for="dob">
            <kendo-datepicker
                :class="['w-100 rounded bg-transparent k-picker-custom', {'text-white':isDarkSkin}]"
                :format="'MM/dd/yyyy'"
                v-model="userData.dob"
                v-mask="'##/##/####'"
                class="leads-datepicker"
            />
          </b-form-group>
        </validation-provider>
        <!-- Language -->
        <validation-provider v-slot="{errors}" name="Language" rules="required">
          <b-form-group label="Language" label-for="language" :state="errors[0] ? false : null">
            <v-select
                v-model="userData.language"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="G_LANGUAGES"
                :clearable="false"
                input-id="language"
                :reduce="el => el.value"
            />
          </b-form-group>
        </validation-provider>
        <!-- Lead State -->
        <b-form-group label="Legal Status" label-for="state-lead">
          <v-select
              id="state-lead"
              v-model="userData.state_lead"
              :options="G_STATE_LEADS"
              :clearable="false"
              :reduce="el => el.id"
              label="label"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <address-information-lead
        :type-form="typeForm"
        :user-data="userData"
        :blank-user-fields="blankUserFields"
        @onModalTrackingChangeOpen="$emit('onModalTrackingChangeOpen', $event)"
    />
  </b-card>
</template>

<script>
import {mapGetters} from "vuex";
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton
} from "bootstrap-vue";
import {ValidationProvider, ValidationObserver} from "vee-validate";
import {required, alphaNum, email} from "@validations";

import flatPickr from "vue-flatpickr-component";
import vSelect from "vue-select";

import formValidation from "@core/comp-functions/forms/form-validation";

import moment from "moment";
import AddressInformationLead from "./AddressInformationLead.vue";

export default {
  mounted(){
    if(!this.userData.email && this.typeForm == 'editLead'){
      this.hasNotEmailChecked = true;
    }
  },
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    flatPickr,
    vSelect,
    AddressInformationLead,

    // Form Validation
    ValidationProvider,
    ValidationObserver
  },
  model: {
    event: "update:is-add-new-user-sidebar-active"
  },
  props: {
    userData: {
      type: Object,
      required: true
    },
    blankUserFields: {
      type: Object,
      required: false
    },
    typeForm: {
      type: String,
      required: false // newLead, editLead
    }
  },
  data() {
    return {
      currentDate: new Date(),
      required,
      alphaNum,
      email,
      disabledemail: false,
      minDate: new Date(1000, 1, 1),
      maxDate: new Date(3000, 1, 1),
      configFlatPickr: {
        dateFormat: "m/d/Y",
        locale: "en",
        allowInput: true,
      },
      programsList: [],
      hasNotEmailChecked: false
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      G_PROGRAMS: "CrmGlobalStore/G_PROGRAMS",
      G_LANGUAGES: "CrmGlobalStore/G_LANGUAGES",
      G_STATE_LEADS: "CrmLeadStore/G_STATE_LEADS"
    })
  },
  setup() {
    const {refFormObserver, getValidationState} = formValidation(() => {
    });

    return {
      refFormObserver,
      getValidationState
    };
  },
  created() {
    this.formatInitialData();
  },
  methods: {
    onContext(ctx) {
      // The date formatted in the locale, or the `label-no-date-selected` string
      this.formatted = ctx.selectedFormatted
      // The following will be an empty string until a valid date is entered
      this.selected = ctx.selectedYMD
    },
    capitalize(el) {
      const element = this.userData[el];
      this.userData[el] =
          element.substr(0, 1).toUpperCase() + element.substr(1);
    },
    formatInitialData() {
      this.userData.dob = this.userData.dob
          ? moment(this.userData.dob).format("MM/DD/YYYY")
          : "";
      this.programsList = this.userData.programs;
    },
    returnProgramlist() {
      return this.programsList;
    }
  }
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
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
<style>
input.k-input {
  padding: 0.5rem 1rem !important;
  height: auto !important;
}

.k-select {
  background-color: transparent !important;
  background-image: none !important;
}
</style>
