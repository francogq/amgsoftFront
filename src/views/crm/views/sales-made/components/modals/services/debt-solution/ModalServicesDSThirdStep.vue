<template>
  <ValidationObserver ref="formThirdStep">
    <b-container id="item3" fluid>
      <b-row class="mb-1">
        <b-col md="6">
          <b-card
            header-text-variant="white"
            header-bg-variant="info"
            header-class="p-0"
            body-class="pt-1 card-body-border"
          >
            <template #header>
              <div style="padding-top: 12px; padding-left: 20px">
                <p class="font-weight-bolder">Applicant personal data</p>
              </div>
            </template>
            <b-row>
              <b-col>
                <div>
                  <label for>First Name</label>
                  <b-form-input
                    v-model="applicantObject.firstName"
                    :disabled="isModalShow"
                  />
                </div>
                <div class="mt-1">
                  <label for>Last Name</label>
                  <b-form-input
                    v-model="applicantObject.lastName"
                    :disabled="isModalShow"
                  />
                </div>
                <div class="mt-1">
                  <label for>DOB</label>
                  <b-form-datepicker
                    id="date4"
                    v-model="applicantObject.dob"
                    locale="en"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    }"
                    name="date4"
                    :disabled="isModalShow"
                  />
                </div>
              </b-col>
              <b-col>
                <div>
                  <label for>Middle Name</label>
                  <b-form-input
                    v-model="applicantObject.middleName"
                    :disabled="isModalShow"
                  />
                </div>
                <div class="mt-1">
                  <label for>Status</label>
                  <v-select
                    v-model="applicantObject.status"
                    :disabled="isModalShow"
                    :options="states_leads"
                    label="name"
                    :reduce="(value) => value.id"
                  />
                </div>
                <div class="mt-1">
                  <label for>SSN</label>
                  <b-form-input
                    id="SSN"
                    v-model="applicantObject.ssn"
                    v-mask="'###-##-####'"
                    name="ssn"
                    :disabled="isModalShow"
                    maxlength="11"
                  />
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col md="6">
          <b-card
            header-text-variant="white"
            header-bg-variant="info"
            header-class="p-0"
            body-class="pt-1 card-body-border"
          >
            <template #header>
              <div style="padding-top: 12px; padding-left: 20px">
                <p class="font-weight-bolder">Contact Data</p>
              </div>
            </template>
            <b-row>
              <b-col>
                <div>
                  <label for>Phone M</label>
                  <b-form-input />
                </div>
                <div class="mt-1">
                  <label for>Address</label>
                  <vue-google-autocomplete
                    id="address_principal"
                    ref="addressprincipal"
                    v-model="applicantObject.address"
                    class="form-control"
                    placeholder="Please type your address"
                    country="us"
                    :disabled="isModalShow"
                    @placechanged="getAddressData"
                  />
                </div>
                <div class="mt-1">
                  <label for>State</label>
                  <v-select
                    id="state"
                    v-model="applicantObject.state"
                    name="state"
                    :disabled="isModalShow"
                    :options="states"
                    label="state"
                    :reduce="(value) => value.slug"
                  />
                </div>
              </b-col>
              <b-col>
                <div>
                  <label for>Email</label>
                  <b-form-input
                    v-model="applicantObject.email"
                    :disabled="isModalShow"
                  />
                </div>
                <div class="mt-1">
                  <label for>City</label>
                  <b-form-input
                    v-model="applicantObject.city"
                    :disabled="isModalShow"
                  />
                </div>
                <div class="mt-1">
                  <label for>Zipcode</label>
                  <b-form-input
                    v-model="applicantObject.zipcode"
                    :disabled="isModalShow"
                  />
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mb-1">
        <b-form-checkbox
          id="goapplication"
          v-model="applicant"
          :disabled="isModalShow"
          class="ml-1"
          >Co applicant</b-form-checkbox
        >
      </b-row>
      <b-row v-if="applicant === true" class="mt-1">
        <b-col class="cont-user-info">
          <b-card
            header-text-variant="white"
            header-bg-variant="info"
            header-class="p-0"
            body-class="pt-1 card-body-border"
          >
            <template #header>
              <div style="padding-top: 12px; padding-left: 20px">
                <p class="font-weight-bolder">Co-Applicant personal data</p>
              </div>
            </template>
            <b-row>
              <b-col>
                <b-row>
                  <b-col lg="3">
                    <label for>First Name</label>
                    <b-form-input
                      v-model="coApplicantObject.firstName"
                      type="text"
                      :disabled="isModalShow"
                    />
                  </b-col>
                  <b-col lg="3">
                    <label for>Middle Name</label>
                    <b-form-input
                      v-model="coApplicantObject.middleName"
                      :disabled="isModalShow"
                    />
                  </b-col>
                  <b-col lg="3">
                    <label for>Last Name</label>
                    <b-form-input
                      v-model="coApplicantObject.lastName"
                      :disabled="isModalShow"
                    />
                  </b-col>
                  <b-col lg="3">
                    <label for>Status</label>
                    <v-select
                      v-model="coApplicantObject.status"
                      :options="states_leads"
                      :reduce="(value) => value.id"
                      :disabled="isModalShow"
                      label="name"
                    />
                  </b-col>
                </b-row>
                <b-row class="mt-1">
                  <b-col lg="3">
                    <label for>Date of birth</label>
                    <b-form-datepicker
                      id="date5"
                      v-model="coApplicantObject.dob"
                      locale="en"
                      :date-format-options="{
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      }"
                      name="date5"
                      :disabled="isModalShow"
                    />
                  </b-col>
                  <b-col lg="3">
                    <label for>SSN</label>
                    <b-form-input
                      id="SSN2"
                      v-model="coApplicantObject.ssn"
                      v-mask="'###-##-####'"
                      name="ssn2"
                      :disabled="isModalShow"
                      maxlength="11"
                    />
                  </b-col>
                  <b-col lg="3">
                    <label v-if="applicant == true" for>Phone number</label>
                    <b-form-input
                      v-if="applicant == true"
                      id="work1"
                      v-model="coApplicantObject.phoneM"
                      v-mask="'(####) ###-####'"
                      name="work1"
                      maxlength="14"
                      :disabled="isModalShow"
                    />
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col>
          <b-card
            header-text-variant="white"
            header-bg-variant="info"
            header-class="p-0"
            body-class="pt-1 card-body-border"
          >
            <template #header>
              <div style="padding-top: 12px; padding-left: 20px">
                <p class="font-weight-bolder">Aditional Information</p>
              </div>
            </template>
            <b-row>
              <b-col>
                <b-row>
                  <b-col md="3">
                    <label for>Civil status</label>
                    <v-select
                      v-model="applicantObject.civilStatus"
                      :disabled="isModalShow"
                      :options="[
                        'Single',
                        'Engaged',
                        'Married',
                        'Divorced',
                        'Widow/er',
                      ]"
                    />
                  </b-col>
                  <b-col md="3">
                    <label for>Applicant's employer</label>
                    <b-form-input
                      id="employer1"
                      v-model="applicantObject.applicantEmployer"
                      :disabled="isModalShow"
                    />
                  </b-col>
                  <b-col md="3">
                    <label for>Dependents</label>
                    <b-form-input
                      id="dependents"
                      v-model="applicantObject.dependents"
                      :disabled="isModalShow"
                    />
                  </b-col>
                </b-row>
                <b-row class="mt-1">
                  <b-col md="3">
                    <label v-if="applicant == true" for
                      >Co-applicant Civil Status</label
                    >
                    <v-select
                      v-if="applicant == true"
                      v-model="coApplicantObject.civilStatus"
                      :disabled="isModalShow"
                      :options="[
                        'Single',
                        'Engaged',
                        'Married',
                        'Divorced',
                        'Widow/er',
                      ]"
                    />
                  </b-col>
                  <b-col md="3">
                    <label v-if="applicant == true" for
                      >Co-applicant employer</label
                    >
                    <b-form-input
                      v-if="applicant == true"
                      id="employer2"
                      v-model="coApplicantObject.coApplicantEmployer"
                      :disabled="isModalShow"
                    />
                  </b-col>
                  <b-col md="3">
                    <label v-if="applicant == true" for
                      >Co-applicant Dependents</label
                    >
                    <b-form-input
                      v-if="applicant == true"
                      id="dependents2"
                      v-model="coApplicantObject.dependents"
                      :disabled="isModalShow"
                    />
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card
            header-text-variant="white"
            header-bg-variant="info"
            header-class="p-0"
            body-class="pt-1 card-body-border"
            style="height: 90%"
          >
            <template #header>
              <div style="padding-top: 12px; padding-left: 20px">
                <p class="font-weight-bolder">Incomes</p>
              </div>
            </template>
            <b-row>
              <b-col md="4">
                <label>Applicant's monthly net income</label>
                <money
                  id="app-monthly-net-income"
                  v-model="applicantObject.monthlyNetIncome"
                  v-bind="vMoney"
                  :disabled="isModalShow"
                  class="form-control"
                />
              </b-col>
              <b-col md="4">
                <label>Additional monthly net income</label>
                <money
                  id="additiona-m-net-income"
                  v-model="applicantObject.additionalMonthlyNetincome"
                  v-bind="vMoney"
                  :disabled="isModalShow"
                  class="form-control"
                />
              </b-col>
              <b-col md="4" class="pr-0">
                <label>Co-applicant's monthly net income</label>
                <money
                  id="co-applicant-net"
                  v-model="coApplicantObject.monthlyNetIncome"
                  v-bind="vMoney"
                  :disabled="isModalShow || !(applicant == true)"
                  class="form-control"
                />
              </b-col>
              <b-col class="mt-2" md="5">
                <b-input-group prepend="Monthly Net Income">
                  <div
                    class="form-control d-flex align-items-center justify-content-center bg-transparent border"
                  >
                    $ {{ totalMonthlyNetIncome.toFixed(2) }}
                  </div>
                </b-input-group>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col md="4">
          <b-card
            header="Housing expenses"
            header-text-variant="white"
            header-bg-variant="info"
            header-class="p-0"
            body-class="pt-1 card-body-border"
            style="height: 90%"
          >
            <template #header>
              <div style="padding-top: 12px; padding-left: 20px">
                <p class="font-weight-bolder">Housing Expenses</p>
              </div>
            </template>
            <b-row>
              <b-col class="d-flex align-items-center justify-content-start">
                <span>House Owner</span>
                <div
                  class="d-flex ml-1 align-items-center justify-content-center"
                >
                  <b-form-checkbox
                    id="housing"
                    v-model="housingExpensesObject.housing"
                    name="housing"
                    :disabled="isModalShow"
                    switch
                  />
                  <span v-if="housingExpensesObject.housing">YES</span>
                  <span v-else>NO</span>
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <label>Monthly payment or monthly rent</label>
                <money
                  id="month-payment-rent"
                  v-model="housingExpensesObject.monthlyPaymentHousingExpenses"
                  v-bind="vMoney"
                  :disabled="isModalShow"
                  class="form-control"
                />
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <label>Total monthly housing expenses</label>
                <money
                  id="housing-expenses"
                  v-model="housingExpensesObject.monthlyPaymentHousingExpenses"
                  v-bind="vMoney"
                  disabled
                  class="form-control"
                />
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card
            header-text-variant="white"
            header-bg-variant="info"
            header-class="p-0"
            body-class="pt-1 card-body-border"
          >
            <template #header>
              <div style="padding-top: 12px; padding-left: 20px">
                <p class="font-weight-bolder">Cost of living</p>
              </div>
            </template>
            <b-row>
              <b-col md="8">
                <v-select
                  v-model="selected"
                  :options="options"
                  label="text"
                  multiple
                  placeholder="Utilities"
                  :disabled="isModalShow"
                  :close-on-select="false"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col
                v-for="(select, index) in selected"
                :key="select.id"
                cols="2"
                class="mt-1"
              >
                <div>
                  <label>{{ select.text }}</label>
                  <money
                    :id="`inp-${index}`"
                    v-model="select.value"
                    v-bind="vMoney"
                    :disabled="isModalShow"
                    class="form-control"
                  />
                </div>
              </b-col>
              <b-col class="mt-1" cols="2">
                <label>Total Utilities</label>
                <div
                  class="form-control d-flex align-items-center justify-content-start bg-transparent border"
                >
                  $ {{ totalDato5.toFixed(2) }}
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col md="4">
                <label> Food(expenses in store or eating outside) </label>
                <money
                  id="dato7"
                  v-model="dato7"
                  v-bind="vMoney"
                  :disabled="isModalShow"
                  class="form-control"
                />
              </b-col>
              <b-col md="4">
                <label for>Insurance</label>
                <money
                  id="dato8"
                  v-model="dato8"
                  v-bind="vMoney"
                  :disabled="isModalShow"
                  class="form-control"
                />
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <b-button
                  :disabled="cars.length >= 5 || isModalShow"
                  variant="primary"
                  @click="addCar()"
                >
                  CAR PAYMENTS
                  <feather-icon
                    v-if="cars.length < 5 && !isModalShow"
                    icon="PlusIcon"
                  />
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col
                v-for="(car, index) in cars"
                :key="car.id"
                class="mt-1"
                cols="2"
              >
                <div class="d-flex align-items-center justify-content-between">
                  <label>{{ car.text }}</label>
                  <label v-if="index != 0 && index == cars.length - 1">
                    <feather-icon
                      v-if="!isModalShow"
                      icon="XCircleIcon"
                      class="cursor-pointer text-danger font-medium-2"
                      @click="cars.splice(index, 1)"
                    />
                  </label>
                </div>
                <money
                  :id="`car-${index}`"
                  v-model="car.value"
                  v-bind="vMoney"
                  :disabled="isModalShow"
                  class="form-control"
                />
              </b-col>
              <b-col class="mt-1" cols="2">
                <label>Gasoline</label>
                <money
                  id="gasoline"
                  v-model="gasoline"
                  v-bind="vMoney"
                  :disabled="isModalShow"
                  class="form-control"
                />
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <v-select
                  v-model="selectedOther"
                  :options="optionsOthers"
                  label="text"
                  multiple
                  :close-on-select="false"
                  placeholder="Others"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col
                v-for="(select, index) in selectedOther"
                :key="select.id"
                cols="2"
                class="mt-1"
              >
                <div>
                  <label>
                    <span v-if="select.id != 11">{{ select.text }}</span>
                    <span v-else>
                      <b-form-input
                        v-model="select.text"
                        type="text"
                        placeholder="Specify..."
                        :disabled="isModalShow"
                        size="sm"
                        class="py-0"
                      />
                    </span>
                  </label>
                  <money
                    :id="`inp-${index}`"
                    v-model="select.value"
                    v-bind="vMoney"
                    :disabled="isModalShow"
                    class="form-control"
                  />
                </div>
              </b-col>
              <b-col class="mt-1" cols="2">
                <label>Total Others</label>
                <div
                  class="form-control d-flex align-items-center justify-content-start bg-transparent border"
                >
                  $ {{ totalOthers.toFixed(2) }}
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col cols="2">
                <label>Total monthly living cost</label>
                <div
                  class="form-control d-flex align-items-center justify-content-start bg-transparent border"
                >
                  $ {{ totalDato7.toFixed(2) }}
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-card
            header-text-variant="white"
            header-bg-variant="info"
            header-class="p-0"
            body-class="pt-1 card-body-border"
          >
            <template #header>
              <div style="padding-top: 12px; padding-left: 20px">
                <p class="font-weight-bolder">Goals</p>
              </div>
            </template>
            <b-row>
              <b-col>
                <b-button
                  v-if="arrayGoals.length != 4 && !isModalShow"
                  variant="success"
                  @click="addGoals()"
                >
                  <feather-icon icon="PlusIcon" title="ADD NEW GOAL" />ADD GOAL
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col
                v-for="(goal, index) in arrayGoals"
                :key="goal.id"
                md="3"
                class="mt-1"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <label :for="`date-label-${index}`">{{ goal.text }}</label>
                  <label v-if="index != 0 && index == arrayGoals.length - 1">
                    <feather-icon
                      v-if="!isModalShow"
                      icon="XCircleIcon"
                      class="font-medium-3 text-danger cursor-pointer"
                      @click="arrayGoals.splice(index, 1)"
                    />
                  </label>
                </div>
                <ValidationProvider v-slot="{ errors }" rules="required">
                  <b-form-input
                    :id="`date-label-${index}`"
                    v-model="goal.goal"
                    :disabled="isModalShow"
                    :class="{ 'border-danger': errors[0] }"
                  />
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" rules="required">
                  <label class="mt-1" :for="`date-goal-${index}`">Date</label>
                  <b-form-datepicker
                    :id="`date-goal-${index}`"
                    v-model="goal.date"
                    locale="en"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    }"
                    :disabled="isModalShow"
                    :class="{ 'border-danger': errors[0] }"
                  />
                </ValidationProvider>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </ValidationObserver>
</template>

<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import vSelect from "vue-select";
import { mapGetters } from "vuex";

export default {
  components: { VueGoogleAutocomplete, vSelect },
  props: {
    salesClient: Object,
    idleyend: String,
    headerS: {
      type: Object,
      default: () => ({ program: "", seller: "", captured: "" }),
    },
    typeModal: {
      type: Number,
      default: 1,
      // 1: create, 2: show
    },
    isModalShow: Boolean,
    isModalAdd: Boolean,
  },
  data() {
    return {
      errorGoal: false,
      errorDate: false,
      blocking: true,
      selected: [], // Must be an array reference!
      selectedOther: [],
      options: [
        { id: 1, text: "Electricity", value: 0 },
        { id: 2, text: "Gas", value: 0 },
        { id: 3, text: "Water", value: 0 },
        { id: 4, text: "Telephone", value: 0 },
        { id: 5, text: "Cable", value: 0 },
        { id: 6, text: "Internet", value: 0 },
        { id: 7, text: "Trash", value: 0 },
      ],
      optionsOthers: [
        { id: 1, text: "Child Support", value: 0 },
        { id: 2, text: "Spouse Suppport", value: 0 },
        { id: 3, text: "Clothes", value: 0 },
        { id: 4, text: "Education", value: 0 },
        { id: 5, text: "Health & SelfCare", value: 0 },
        { id: 6, text: "Transportation", value: 0 },
        { id: 7, text: "Laundry", value: 0 },
        { id: 8, text: "Donations", value: 0 },
        { id: 9, text: "Family Support", value: 0 },
        { id: 10, text: "Recreation", value: 0 },
        { id: 11, text: "Others", value: 0 },
      ],
      percentajes: [
        { value: "0.0", label: "0%" },
        { value: "0.01", label: "1%" },
        { value: "0.02", label: "2%" },
        { value: "0.03", label: "3%" },
        { value: "0.04", label: "4%" },
        { value: "0.05", label: "5%" },
        { value: "0.06", label: "6%" },
        { value: "0.07", label: "7%" },
        { value: "0.08", label: "8%" },
        { value: "0.09", label: "9%" },
        { value: "0.1", label: "10%" },
      ],
      arrayGoals: [{ text: "1st Goal", goal: null, date: null }],
      cars: [{ text: "Car 1", value: 0 }],
      min: new Date(1000, 0, 1, 8, 0, 0),
      max: new Date(3000, 11, 31, 18, 0, 0),
      minDate: new Date(1000, 1, 1),
      maxDate: new Date(3000, 1, 1),
      applicantObject: {
        firstName: "",
        middleName: "",
        lastName: "",
        status: "",
        dob: "",
        ssn: "",
        phoneM: "",
        phoneH: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        civilStatus: "",
        applicantEmployer: "",
        dependents: "",
        monthlyNetIncome: 0,
        additionalMonthlyNetincome: 0,
      },
      applicant: false,
      coApplicantObject: {
        firstName: "",
        middleName: "",
        lastName: "",
        status: "",
        dob: "",
        ssn: "",
        phoneM: "",
        civilStatus: "",
        coApplicantEmployer: "",
        dependents: "",
        monthlyNetIncome: 0,
      },
      dato4: 0,
      dato7: 0,
      dato8: 0,
      gasoline: 0,
      housingExpensesObject: {
        housing: "",
        monthlyPaymentHousingExpenses: 0,
      },
      inputDisable: false,
      states_leads: [],
      vMoney: {
        decimal: ".",
        thousands: ",",
        prefix: "$ ",
        precision: 2,
        masked: false,
      },
      direccion: null,
      address_principal: null,
      creditors: [],
      id_analisis: "",
      id_history: "",
      states: [],
      applicant: "",
      workphone1: "",
      dato6: "",
      porctrf: "",
      total_balance: "",
      total_ce: null,
      monthly_payment: "",
      cost: "",
      total_monthly: "",
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    totalMonthlyNetIncome() {
      return Number(
        this.applicantObject.monthlyNetIncome +
          this.applicantObject.additionalMonthlyNetincome +
          this.coApplicantObject.monthlyNetIncome
      );
    },
    totalDato5() {
      const total = this.selected.reduce(
        (sum, select) => sum + Number(select.value),
        0
      );
      return total;
    },
    totalDato7() {
      const total = this.cars.reduce((sum, car) => sum + Number(car.value), 0);
      const totalOthers = this.selectedOther.reduce(
        (sum, other) => sum + Number(other.value),
        0
      );
      return Number(
        total +
          totalOthers +
          this.gasoline +
          this.totalDato5 +
          this.dato7 +
          this.dato8
      );
    },
    totalOthers() {
      const totalOthers = this.selectedOther.reduce(
        (sum, other) => sum + Number(other.value),
        0
      );
      return totalOthers;
    },
  },
  mounted() {
    this.statesleads();
    this.stateseeuu();
    this.analisisDebsolution();
    this.allDebtSolution();
  },
  methods: {
    async nextfirst(id, type) {
      if (this.isModalShow) {
        this.hideModal(false, this.program);
        return true;
      }
      if (type == 1 || type == 2) {
        return await this.axiosNext(id, type);
      }
      if (type == 4) {
        return await this.saveant(id, type);
      }
      return await this.axiosNext(id, type);
    },
    async axiosNext(id, type) {
      try {
        const success = await this.$refs.formThirdStep.validate();
        if (success) {
          const result = await this.showConfirmSwal(
            "Are you sure of continue ?",
            "Before finalizing you must save."
          );
          if (result.value) {
            this.addPreloader();
            const arrayUtilities = [];
            const arrayObjUtilities = [];
            // eslint-disable-next-line array-callback-return
            this.selected.map((select) => {
              const obj = {
                id: select.id,
                mont: select.value,
              };
              arrayUtilities.push(select.id);
              arrayObjUtilities.push(obj);
            });
            const arrayOthersTemp = [];
            const arrayObjOthersTemp = [];
            // eslint-disable-next-line array-callback-return
            this.selectedOther.map((select) => {
              const obj = {
                id: select.id,
                mont: select.value,
              };
              arrayOthersTemp.push(select.id);
              arrayObjOthersTemp.push(obj);
            });
            const response = await amgApi.post(
              "/sales-made/debt-solution/save-first-debt-solution",
              {
                type,
                id,
                event:
                  this.typeModal == 3 || this.typeModal == 4
                    ? null
                    : this.salesClient.event_id,
                account:
                  this.typeModal == 3 || this.typeModal == 4
                    ? this.salesClient.account_id
                    : null,
                id_history: this.id_history,
                id_analisis: this.id_analisis,
                name1: this.applicantObject.firstName,
                last1: this.applicantObject.lastName,
                date1: this.applicantObject.dob,
                ssn1: this.applicantObject.ssn,
                applicant: this.applicant,
                name2: this.coApplicantObject.firstName,
                last2: this.coApplicantObject.lastName,
                date2: this.coApplicantObject.dob,
                ssn2: this.coApplicantObject.ssn,
                address: this.applicantObject.address,
                city: this.applicantObject.city,
                state: this.applicantObject.state,
                zipcode: this.applicantObject.zipcode,
                civil: this.applicantObject.civilStatus,
                civil2: this.coApplicantObject.civilStatus,
                dependents: this.applicantObject.dependents,
                dependents2: this.coApplicantObject.dependents,
                phone1: this.applicantObject.phoneM,
                employer1: this.applicantObject.applicantEmployer,
                workphone1: this.workphone1,
                employer2: this.coApplicantObject.coApplicantEmployer,
                workphone2: this.coApplicantObject.phoneM,
                dato1: this.applicantObject.monthlyNetIncome,
                dato2: this.coApplicantObject.monthlyNetIncome,
                dato3: this.applicantObject.additionalMonthlyNetincome,
                dato4: this.housingExpensesObject.monthlyPaymentHousingExpenses,
                dato5: this.totalDato5.toFixed(2),
                dato6: this.dato6,
                dato7: this.dato7,
                dato8: this.dato8,
                dato91: this.cars[0].value,
                dato92: this.cars[1] != undefined ? this.cars[1].value : "",
                dato93: this.cars[2] != undefined ? this.cars[2].value : "",
                dato94: this.cars[3] != undefined ? this.cars[3].value : "",
                dato95: this.cars[4] != undefined ? this.cars[4].value : "",
                dato10: this.gasoline,
                dato11: this.totalOthers,
                dato12: this.arrayGoals[0].goal,
                dato13:
                  this.arrayGoals[1] != undefined
                    ? this.arrayGoals[1].goal
                    : "",
                dato14:
                  this.arrayGoals[2] != undefined
                    ? this.arrayGoals[2].goal
                    : "",
                dato15:
                  this.arrayGoals[3] != undefined
                    ? this.arrayGoals[3].goal
                    : "",
                date3: this.arrayGoals[0].date,
                date4:
                  this.arrayGoals[1] != undefined
                    ? this.arrayGoals[1].date
                    : "",
                date5:
                  this.arrayGoals[2] != undefined
                    ? this.arrayGoals[1].date
                    : "",
                date6:
                  this.arrayGoals[3] != undefined
                    ? this.arrayGoals[1].date
                    : "",
                others: this.optionsOthers[10].text,
                middle1: this.applicantObject.middleName,
                state_lead1: this.applicantObject.status,
                middle2: this.coApplicantObject.middleName,
                state_lead2: this.coApplicantObject.status,
                phone2: this.applicantObject.phoneH,
                email: this.applicantObject.email,
                valorutility: arrayUtilities,
                montoutlity: arrayObjUtilities,
                valorothers: arrayOthersTemp,
                montoothers: arrayObjOthersTemp,
                housing: this.housingExpensesObject.housing == false ? 0 : 1,
              }
            );
            if (response.status === 200) {
              this.removePreloader();
              await this.save(4);
              return true;
            }
            return false;
          }
          return false;
        }
        return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async save(id) {
      try {
        const total = parseFloat(
          Number(this.total_balance) * Number(this.porctrf)
        ).toFixed(2);
        const due = parseFloat(Number(this.total_balance) * 0.8).toFixed(2);
        const months = Math.ceil(
          parseFloat(Number(due) / Number(this.monthly_payment)).toFixed(1)
        );
        const years = Math.ceil(parseFloat(Number(months) / 12).toFixed(1));
        const mont3 = parseFloat(
          (Number(this.total_balance) * Number(this.total_interest)) / 100
        ).toFixed(2);
        const mont4 = parseFloat(Number(mont3) / 12).toFixed(2);
        const mont5 = parseFloat(
          Number(this.total_monthly) - Number(mont4)
        ).toFixed(2);
        const mont9 = Math.ceil(
          parseFloat(Number(this.total_balance) / Number(mont5)).toFixed(1)
        );
        const mont11 = parseFloat(
          Number(mont9) * Number(this.total_monthly)
        ).toFixed(2);
        const estimated = parseFloat(Number(mont11) - Number(due)).toFixed(2);
        //   this.oneclick = false;
        const nev = [];
        let message = "";
        let route = "";
        let typeADD = "";
        //   let prices = [];
        // Depends of the Modal type
        switch (this.typeModal) {
          case 1:
            message = "complete Rates";
            route = "/sales-made/attendend-sale";
            break;
          case 3:
            message = "add new service";
            route = "/sales-made/attendend-saleprogram";
            typeADD = 1;
            break;
          case 4:
            message = "change service";
            route = "/sales-made/attendend-saleprogram";
            typeADD = 2;
            break;
          case 6:
            message = "add new service";
            route = "/sale/insert-lead-attendance";
            break;
          default:
            break;
        }
        const param = {
          prices: nev,
          observation: this.observation,
          contract: 1,
          program: id,
          fee: total,
          event:
            this.typeModal === 3 || this.typeModal === 4 || this.typeModal === 5
              ? null
              : this.salesClient.event_id,
          suggested: this.total_ce == null ? total : this.total_ce,
          otherpricesp: [],
          typepayment: 0,
          mpds: this.monthly_payment,
          total_due: due,
          monthly: this.monthly_payment,
          cost: this.cost,
          retainer: total,
          months,
          years,
          estimated,
          id_history: this.id_history,
          stateid: id == 4 ? 1 : 0,
          porctrf: this.porctrf,
          json_ce: null,
          id_score: null,
          json_noce: null,
          account:
            this.typeModal === 3 || this.typeModal === 4 || this.typeModal === 5
              ? this.salesClient.account_id
                ? this.salesClient.account_id
                : ""
              : null,
          captured: this.headerS.captured,
          seller: this.headerS.seller,
          type: typeADD,
          user_id: this.currentUser.id,
          module: this.currentUser.modul_id,
        };
        const result = await this.showConfirmSwal(
          `Are you sure you want to ${message}`
        );
        if (result.value) {
          this.addPreloader();
          const response = await amgApi.post(route, param);
          if (response.status === 200) {
            this.hideModal(true, this.program);
            this.removePreloader();
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async stateseeuu() {
      try {
        const response = await amgApi.get("/commons/get-eeuu-states");
        this.states = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async prevfirst(id, type) {
      try {
        this.addPreloader();
        const response = await amgApi.post("/sale/delete-leyend-states-ds", {
          type,
          id,
          event:
            this.typeModal === 3 || this.typeModal === 4 || this.typeModal === 5
              ? null
              : this.salesClient.event_id,
          account:
            this.typeModal === 3 || this.typeModal === 4 || this.typeModal === 5
              ? this.salesClient.account_id
              : null,
        });
        if (response.status === 200) {
          this.$emit("previousStep");
        }
      } catch (error) {
        this.removePreloader();
        console.error(error);
      }
    },
    async allDebtSolution() {
      try {
        const response = await amgApi.post(
          "/sales-made/debt-solution/get-credits-debt-solution",
          {
            event:
              this.typeModal === 3 ||
              this.typeModal === 4 ||
              this.typeModal === 5
                ? null
                : this.salesClient.event_id,
            account:
              this.typeModal === 3 ||
              this.typeModal === 4 ||
              this.typeModal === 5
                ? this.salesClient.account_id
                : null,
          }
        );
        if (response.status === 200) {
          this.creditors = response.data;
          if (this.creditors.length > 0) {
            this.total_balance = this.creditors[0].total_balance;
            this.total_interest = this.creditors[0].total_interest;
            this.total_monthly = this.creditors[0].total_monthly;
            this.id_history = this.creditors[0].id_history;
            this.id_analisis = this.creditors[0].id_analisis;
            this.monthly_payment =
              this.creditors[0].monthly_payment == null
                ? ""
                : this.creditors[0].monthly_payment;
            this.porctrf =
              this.creditors[0].pcrf == null
                ? 0.1
                : this.creditors[0].pcrf == "0.10"
                ? 0.1
                : this.creditors[0].pcrf;
            this.cost = this.creditors[0].cost;
          } else {
            this.id_history = "";
            this.id_analisis = "";
          }
          await this.analisisDebsolution();
          await this.statesleads();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async statesleads() {
      try {
        const response = await amgApi.get("/lead/get-state-leads");
        this.states_leads = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    addGoals() {
      this.arrayGoals.push({
        text: `${this.ordinalSuffixOf(this.arrayGoals.length + 1)} Goal`,
        goal: null,
        date: null,
      });
    },
    ordinalSuffixOf(i) {
      const j = i % 10;
      const k = i % 100;
      if (j === 1 && k !== 11) {
        return `${i}st`;
      }
      if (j === 2 && k !== 12) {
        return `${i}nd`;
      }
      if (j === 3 && k !== 13) {
        return `${i}rd`;
      }
      return `${i}th`;
    },
    addCar() {
      const index = this.cars.length;
      const car = {
        text: `Car ${index + 1}`,
        value: 0,
      };
      this.cars.push(car);
    },
    hideModal(refresh, programSelect) {
      this.$emit("hideModal", refresh, programSelect);
    },
    getAddressData(address_principal, placeResultData, id) {
      this.direccion = address_principal;
      this.address_principal = `${this.direccion.street_number} ${this.direccion.route}`;
      this.applicantObject.address = this.address_principal;
      this.applicantObject.state = this.direccion.administrative_area_level_1;
      this.applicantObject.city = this.direccion.locality;
      this.applicantObject.zipcode = this.direccion.postal_code;
    },
    async analisisDebsolution() {
      try {
        const response = await amgApi.post(
          "/sales-made/debt-solution/get-analysis-debt-solution",
          {
            event:
              this.typeModal === 3 ||
              this.typeModal === 4 ||
              this.typeModal === 5
                ? null
                : this.salesClient.event_id,
            account:
              this.typeModal === 3 ||
              this.typeModal === 4 ||
              this.typeModal === 5
                ? this.salesClient.account_id
                : null,
            id: this.id_analisis,
          }
        );
        if (response.status === 200) {
          if (response.data.length > 0) {
            this.applicantObject.firstName = response.data[0].name;
            this.applicantObject.lastName = response.data[0].last;
            this.applicantObject.dob = response.data[0].dob;
            this.applicantObject.ssn = response.data[0].ssn;
            this.coApplicantObject.firstName = response.data[0].c_name;
            this.coApplicantObject.lastName = response.data[0].c_last;
            this.coApplicantObject.dob = response.data[0].c_dob;
            this.coApplicantObject.ssn = response.data[0].c_ssn;
            this.applicantObject.address = response.data[0].address;
            this.applicantObject.city = response.data[0].city;
            this.applicantObject.state = response.data[0].state;
            this.applicantObject.zipcode = response.data[0].zipcode;
            this.applicantObject.civilStatus = response.data[0].status_civil;
            this.applicantObject.dependents = response.data[0].dependents;
            this.applicantObject.phoneM = response.data[0].phone;
            this.applicantObject.applicantEmployer = response.data[0].employer;
            this.applicantObject.phoneH = response.data[0].phone_work;
            this.coApplicantObject.coApplicantEmployer =
              response.data[0].c_employer;
            this.coApplicantObject.phoneM = response.data[0].c_phone_work;
            this.applicantObject.monthlyNetIncome = Number(
              response.data[0].applicant_monthly
            );
            this.coApplicantObject.monthlyNetIncome = Number(
              response.data[0].c_applicant_monthly
            );
            this.applicantObject.additionalMonthlyNetincome = Number(
              response.data[0].adicional_monthly
            );
            this.housingExpensesObject.monthlyPaymentHousingExpenses = Number(
              response.data[0].monthly_payment
            );
            this.dato6 = Number(response.data[0].telephone);
            this.dato7 = Number(response.data[0].food);
            this.dato8 = Number(response.data[0].insurance);
            this.workphone1 = response.data[0].phone_work;
            if (response.data[0].car_payment) {
              this.cars[0].value = Number(response.data[0].car_payment);
            }
            for (let i = 2; i <= 5; i++) {
              if (response.data[0][`car_payment_${i}`]) {
                const car = {
                  text: `Car ${i}`,
                  value: Number(response.data[0][`car_payment_${i}`]),
                };
                this.cars.push(car);
              }
            }
            this.gasoline = Number(response.data[0].gasoline);
            for (let i = 1; i <= 4; i++) {
              if (i == 1) {
                this.arrayGoals[0].goal = response.data[0].goal1;
                this.arrayGoals[0].date = response.data[0].date_g1;
              } else if (response.data[0][`goal${i}`]) {
                const goal = {
                  text: `${this.ordinalSuffixOf(i)} Goal`,
                  goal: response.data[0][`goal${i}`],
                  date: response.data[0][`date_g${i}`],
                };
                this.arrayGoals.push(goal);
              }
            }
            this.others = response.data[0].others_t;
            this.applicantObject.middleName = response.data[0].middle_name;
            this.coApplicantObject.middleName = response.data[0].c_middle;
            this.applicantObject.status = response.data[0].state_lead;
            this.coApplicantObject.status = response.data[0].c_status_lead;
            this.applicantObject.phoneH = response.data[0].phone2;
            this.applicantObject.email = response.data[0].email;
            const utilitiesObjects =
              response.data[0].json_montutility == null
                ? []
                : JSON.parse(response.data[0].json_montutility);
            const othersObject =
              response.data[0].json_montothers == null
                ? []
                : JSON.parse(response.data[0].json_montothers);

            utilitiesObjects.map((utility) => {
              this.options.map((option) => {
                if (Number(utility.id) == option.id) {
                  option.value = Number(utility.mont);
                  this.selected.push(option);
                }
              });
            });
            othersObject.map((other) => {
              this.optionsOthers.map((option) => {
                if (Number(other.id) == option.id) {
                  option.value = Number(other.mont);
                  this.selectedOther.push(option);
                }
              });
            });
            this.applicant = !!(
              this.coApplicantObject.firstName != null ||
              this.coApplicantObject.dob != null ||
              this.coApplicantObject.ssn != null ||
              this.coApplicantObject.coApplicantEmployer != null ||
              this.coApplicantObject.phoneM != null ||
              this.coApplicantObject.monthlyNetIncome != null
            );
            if (response.data[0].housing == null) {
              this.housingExpensesObject.housing = false;
            } else if (response.data[0].housing == 1) {
              this.housingExpensesObject.housing = true;
            } else if (response.data[0].housing == 0) {
              this.housingExpensesObject.housing = false;
            }
            this.removePreloader();
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style></style>
