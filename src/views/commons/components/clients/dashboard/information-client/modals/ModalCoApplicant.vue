<template>
  <div>
    <b-modal
      modal
      centered
      title="CO-APPLICANT"
      v-model="openModalApplicant"
      size="lg"
      scrollable
      modal-class="modal-primary"
      @hidden="closeModalApplicant"
      title-tag="h3"
      :no-close-on-backdrop="true"
    >
      
        <b-row class="mt-1 px-">
          <!-- Program -->
          <b-col cols="6">
            <h5 class="text-left">Account</h5>
            <p
              class="rounded text-primary border-primary font-medium-1 text-center py10"
            >
              {{ accountName }}
            </p>
          </b-col>
          <!-- Client -->
          <b-col cols="6">
            <h5 class="text-left">Client</h5>
            <p
              class="rounded text-primary border-primary font-medium-1 text-center py10"
            >
              {{ nameClient }}
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6"><span>CO-APPLICANT PERSONAL DATA</span></b-col>
        </b-row>
        <ValidationObserver ref="form">
          <!-- First Row -->
          <b-row>
            <b-col cols="3">
              <ValidationProvider
                name="firstname"
                rules="required"
                v-slot="{ errors }"
              >
                <b-form-group label="First Name">
                  <b-form-input
                    v-model="form.c_first_name"
                    :class="{
                      'border-danger': errors[0],
                    }"
                  />
                </b-form-group>
              </ValidationProvider>
            </b-col>
            <b-col cols="3">
              <b-form-group label="Middle Name">
                <b-form-input v-model="form.c_middle_name" />
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <ValidationProvider
                name="lastname"
                rules="required"
                v-slot="{ errors }"
              >
                <b-form-group label="Last Name">
                  <b-form-input
                    v-model="form.c_last_name"
                    :class="{
                      'border-danger': errors[0],
                    }"
                  />
                </b-form-group>
              </ValidationProvider>
            </b-col>
            <b-col cols="3">
              <b-form-group label="Legal Status">
                <v-select
                  label="name"
                  v-model="form.c_state_lead"
                  :options="states_leads"
                  :reduce="(val) => val.id"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <!-- Second Row -->
          <b-row>
            <b-col cols="3">
              <b-form-group label="DOB">
                <kendo-datepicker
                  :class="[
                    'w-100 rounded bg-transparent k-picker-custom',
                    { 'text-white': isDarkSkin },
                  ]"
                  :format="'MM/dd/yyyy'"
                  v-model="form.c_dob"
                  v-mask="'##/##/####'"
                  class="leads-datepicker"
                />
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group label="SSN">
                <b-form-input style="height: 30px" v-model="form.c_ssn" />
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group label="Civil Status">
                <v-select
                  v-model="form.c_civil"
                  label="name"
                  :options="states_civil"
                />
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group label="Dependents">
                <b-form-input v-model="form.c_dependents" />
              </b-form-group>
            </b-col>
          </b-row>
          <!-- Third Row -->
          <b-row>
            <b-col cols="3">
              <b-form-group label="Employer">
                <b-form-input v-model="form.c_employer" />
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group label="Phone number">
                <b-form-input v-model="form.c_phone" />
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group label="Monthly Net Income">
                <money
                  v-model="form.c_monthly"
                  v-bind="moneyConfig"
                  name="price"
                  id="price"
                  class="form-control"
                ></money>
              </b-form-group>
            </b-col>
          </b-row>
          <!-- Fouth Row -->
          <b-row>
            <b-col cols="9">
              <b-form-group label="Mailing Address">
                <vue-google-autocomplete
                  id="address_principal"
                  ref="addressprincipal"
                  class="form-control input-form"
                  placeholder="Please type your address"
                  @placechanged="getAddressData"
                  country="us"
                  v-model="form.street"
                ></vue-google-autocomplete>
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group label="City">
                <b-form-input v-model="form.city" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4">
              <b-form-group label="State">
                <v-select
                  v-model="form.state"
                  label="state"
                  :options="states"
                  :reduce="(val) => val.slug"
                />
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <b-form-group label="Zip Code">
                <b-form-input v-model="form.zipcode" />
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <b-form-group label="Country">
                <b-form-input v-model="form.country" />
              </b-form-group>
            </b-col>
          </b-row>
        </ValidationObserver>
      
      <!-- Footer -->
      <template #modal-footer>
        <div class="d-flex justify-content-center mt-2 w-100">
          <b-button variant="success" @click="saveCoApp">
            <template v-if="isLoading">
              <b-spinner small />
              <span>Loading...</span>
            </template>
            <span v-else>Save</span>
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import vSelect from "vue-select";
import VueGoogleAutocomplete from "vue-google-autocomplete";
// Import Services
import ClientDashboardService from "../../services/clients.dashboard.services";
export default {
  components: {
    vSelect,
    VueGoogleAutocomplete,
  },
  props: {
    modalApplicant: {
      type: Boolean,
    },
    accountName: {
      type: String,
    },
    nameProgram: {
      type: String,
    },
    id_user: {
      type: [Number, String],
    },
    nameClient: {
      type: String,
    },
    valoCo: {
      type: Boolean,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      isLoading: false,
      moneyConfig: {
        decimal: ",",
        thousands: ".",
        prefix: "$",
        suffix: "",
        precision: 2,
        masked: false,
      },
      openModalApplicant: this.modalApplicant,
      form: {
        c_first_name: "",
        c_dob: "",
        c_employer: "",
        c_middle_name: "",
        c_ssn: "",
        c_phone: "",
        c_last_name: "",
        c_state_lead: "",
        c_civil: "",
        c_dependents: "",
        c_monthly: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "EE.UU.",
      },
      states_leads: [],
      states_civil: [
        { value: "Single", name: "Single" },
        { value: "Engaged", name: "Engaged" },
        { value: "Married", name: "Married" },
        { value: "Divorced", name: "Divorced" },
        { value: "Widow/er", name: "Widow/er" },
      ],
      states: [],

      id_analisis:'',
    };
  },
  methods: {
    closeModalApplicant() {
      this.$emit("closeModalApplicant");
    },
    statesLead: async function () {
      try {
        const response = await ClientDashboardService.stateLeads();
        this.states_leads = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    stateEEUU: async function () {
      try {
        const response = await ClientDashboardService.stateEEUU();
        this.states = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    getAddressData: function (address_principal) {
      this.direccion = address_principal;
      this.address_principal =
        this.direccion.street_number + " " + this.direccion.route;
      this.form.street = this.address_principal; //
      this.form.state = this.direccion.administrative_area_level_1;
      this.form.city = this.direccion.locality;
      this.form.zipcode = this.direccion.postal_code;
    },
    analisisDebsolution:async function(){
      try{
        const response = await ClientDashboardService.getCoApplicant({id: this.id})
        if(response.status == 200){
          this.form.c_first_name = response.data[0].c_name
          this.id_analisis = response.data[0].id_analisis
          this.form.c_middle_name = response.data[0].c_middle
          this.form.c_last_name = response.data[0].c_last
          this.form.c_dob = response.data[0].c_dob
          this.form.c_ssn = response.data[0].c_ssn
          this.form.c_civil = response.data[0].c_status_civil
          this.form.c_dependents = response.data[0].c_dependents
          this.form.c_employer = response.data[0].c_employer
          this.form.c_phone = response.data[0].c_phone_work
          this.form.c_monthly = response.data[0].c_applicant_monthly != null? response.data[0].c_applicant_monthly : ""
          this.form.c_state_lead = response.data[0].c_status_lead
          this.form.street = response.data[0].street
          this.form.city = response.data[0].city
          this.form.zipcode = response.data[0].zipcode
          this.form.country = response.data[0].country != null ? response.data[0].country : this.country
          this.form.state = response.data[0].states
          }
      }catch(error){
        console.log(error)
      }
    },
    saveCoApp:async function(){
      this.$refs.form.validate().then(async (success) => {
        if (!success) {
          return
        } else {
            const confirm = await this.showConfirmSwal(
              "ARE YOU SURE OF CONTINUE ?",
              "Before finalizing you must save."
            )
            if (confirm.isConfirmed) {
                try{
                  let params = {

                  }
                  const data = await ClientDashboardService.setCoApplicant(params)
                }catch(error){
                  console.log(error)
                }
              }
          }
      })
    }
  },
  created() {
    this.statesLead();
    this.stateEEUU();
    this.analisisDebsolution()
  },
};
</script>
