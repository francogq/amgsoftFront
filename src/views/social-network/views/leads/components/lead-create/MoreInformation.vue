<template>
  <div>
    <b-card no-body class="p-2 mt-4">
      <b-row>
        <b-col md="6">
          <h4 class="title-card text-left">More information</h4>
        </b-col>
      </b-row>
      <b-row class="mt-2 text-left">
        <b-col mb="6">
          <ValidationProvider rules="" v-slot="{errors}" name="input-create-lead-20,DOB">
            <b-form-group
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                label="DOB"
            >
              <kendo-datepicker

                  :format="'MM/dd/yyyy'"
                  v-model="lead.dob"
                  v-mask="'##/##/####'"
                  class="leads-datepicker"
                  id="input-create-lead-20"
                  :class="errors[0] ? 'w-100 rounded bg-transparent k-picker-custom border-error-datepicker picker-select-date' : 'w-100 rounded bg-transparent k-picker-custom picker-select-date'"
              />
              <div v-if="errors[0]" class="text-error-sn text-center">DOB {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </b-col>
        <b-col mb="6">
          <ValidationProvider rules="" v-slot="{errors}" name="input-create-lead-21,Status">

            <b-form-group
                label="Status"
                label-for="st-ad"
                :state="errors[0] ? false : null"
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
            >
              <v-select
                  v-model="lead.state_lead"
                  label="label"
                  :options="optionsState"
                  :reduce="el => el.value"
                  :class="{'border-error-sn' :errors[0]}"
                  id="input-create-lead-21"
              />
              <div v-if="errors[0]" class="text-error-sn text-center">Status {{errors[0]}}</div>
            </b-form-group>
            <input type="radio" class="d-none bg-green" v-model="lead.state_lead" />

          </ValidationProvider>
        </b-col>
      </b-row>
      <b-row class="mt-2 text-left">
        <b-col mb="6">
          <ValidationProvider rules="" v-slot="{errors}" name="input-create-lead-22,Type doc.">
            <b-form-group
                label="Type doc."
                label-for="st-ad"
                :state="errors[0] ? false : null"
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
            >
              <v-select
                  v-model="lead.type_document"
                  selected=""
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="label"
                  :options="documents"
                  :clearable="false"
                  :reduce="el => el.value"
                  id="input-create-lead-22"
              />
              <div v-if="errors[0]" class="text-error-sn text-center">Type doc. {{errors[0]}}</div>
            </b-form-group>
            <input type="radio" class="d-none bg-green" v-model="lead.type_document" />
          </ValidationProvider>
        </b-col>
        <b-col mb="6">
          <ValidationProvider rules="" v-slot="{errors}" name="input-create-lead-23,Document">
            <b-form-group
                id="fieldset-horizontal"
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                :label="selectDocument"
            >
              <b-form-input
                  v-model="lead.document"
                  class="select-icon-none font-bureau-style border-hover bg-white-c"
                  v-mask="'###-##-####'"
                  placeholder="Please type document"
                  :class="{'border-error-sn' :errors[0]}"
                  :state="errors[0] ? false : null"
                  id="input-create-lead-23"
              ></b-form-input>
              <div v-if="errors[0]" class="text-error-sn text-center">document {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </b-col>
      </b-row>
      <b-row class="mt-2 text-left">
        <b-col mb="6 text-left">
          <ValidationProvider rules="" v-slot="{errors}" name="input-create-lead-24,Phone(H)">
            <b-form-group
                label-class="font-bureau-style font-weight-normal color-gray-input-sn"
                label-cols-sm="4"
                label-for="input-horizontal"
                label-cols-lg="4"
                content-cols-sm
                content-cols-lg="8"
                label="Phone(H)"
                id="input-create-lead-24"
            >
              <b-form-input
                  v-model="lead.phone"
                  class="select-icon-none font-bureau-style border-hover bg-white-c"
                  :class="{'border-error-sn' :errors[0]}"
                  v-mask="'(###) ###-####'"
                  placeholder="Please type phone(H)"
                  :state="errors[0] ? false : null"

              ></b-form-input>
              <div v-if="errors[0]" class="text-error-sn text-center">Phone(H) {{errors[0]}}</div>
            </b-form-group>
          </ValidationProvider>
        </b-col>
        <b-col mb="6">
        </b-col>
      </b-row>

      <StreetCreateSN
          title="More information"
          :street="lead.street"
          :city="lead.city"
          :state="lead.state"

          @street-changed="streetChanged"
      />

    </b-card>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import vSelect from "vue-select";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import StreetCreateSN from "./StreetCreateSN";

export default {
  data() {
    return {
      optionsState: [{
        label: "Select a State",
        value: null,
      }],
      documents: [
        { label: "Select Document", value: null},
        { label: "SSN", value: 1 },
        { label: "ITIN", value: 2 },
        { label: "CPN", value: 3 }
      ],
      selectDocument: 'Document'
    }
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
  created() {
    this.loadStateLeads()
    //document.getElementsByName('input-create-lead-19')[0].placeholder='Tu nuevo placeholder';

  },
  mounted() {
    document.getElementById('input-create-lead-20').placeholder='Type DOB';
  },
  components: {
    StreetCreateSN,
    vSelect,
    VueGoogleAutocomplete,
    ValidationProvider,
    ValidationObserver,
  },

  methods: {
    ...mapActions(
        'SocialNetworkLeadsStore',
        [
          'A_GET_STATE_LEAD',
          'A_STATUS_LEADS',
        ]
    ),
    streetChanged({street, city, state}) {
      this.lead.street = street
      this.lead.city = city
      this.lead.state = state
    },

    async loadStateLeads () {
      const loadStateLeads = (await this.A_STATUS_LEADS()).map(st => {
        return {
          label: st.name,
          value: st.id
        }
      });
      this.optionsState = [...this.optionsState, ...loadStateLeads];
    },
  },
  watch: {
    "lead.type_document"() {
      const doc = this.documents.find(doc => doc.value === this.lead.type_document)
      this.selectDocument = doc.label;
    },
  }

}
</script>

<style lang="scss">
.k-select {
  background-color: transparent !important;
  background-image: none !important;
}
.picker-select-date{
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: #fff !important;
  .leads-datepicker{
    height: 35px !important;
    border: none !important
  }
  &:hover{
    border: 1px solid rgba(255, 255, 255, 0.4);
  }
  input::placeholder {
    color: #ccccd3;
    font-weight: 400;
  }
}
.dark-layout .picker-select-date{
  background: #17171a !important;
  input::placeholder{
    color: #4f4f52 !important;
    font-weight: 600;
  }
}
.border-error-datepicker{
  border: 1px solid #fc424a;
  .k-icon{
    color: #fc424a;
  }
  &:hover{
    border: 1px solid #fc424a;
  }
}
</style>

