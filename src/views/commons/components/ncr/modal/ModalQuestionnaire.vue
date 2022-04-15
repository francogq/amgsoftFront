<template>
  <div>
    <b-modal
      modal
      centered
      title="QUESTIONS FOR NCR"
      v-model="ifModal"
      size="lg"
      modal-class="modal-primary"
      hide-footer
      @hidden="closeModal"
      title-tag="h3"
      scrollable
      :no-close-on-backdrop="true"
    >
      <!-- Information -->
      <div class="m-1" id="modalBody">
        <div class="row" id="cont-list" style="height: 400px; overflow: auto">
          <!-- LEAD AND NAME -->
          <div class="col-md-12 col-lg-9 col-12">
            <b-form-group
              label="LEAD"
              label-cols="4"
              content-cols="8"
              label-cols-sm="5"
              content-cols-sm="6"
              label-cols-md="3"
              content-cols-md="6"
              label-cols-lg="3"
              content-cols-lg="6"
            >
              <div
                class="class-coco-campo-text bg-important rounded text-white font-medium-1 px-1"
                style="padding-top: 5px; padding-bottom: 5px"
              >{{ lead_name }}</div>
            </b-form-group>
          </div>
          <!-- EMPLOYEED -->
          <div class="col-md-12 col-lg-9 col-12">
            <b-form-group
              label="EMPLOYEED"
              label-cols="4"
              content-cols="12"
              label-cols-md="3"
              content-cols-md="6"
              label-cols-lg="3"
              content-cols-lg="6"
            >
              <b-form-input v-model="data.employeed" :disabled="this.disabled"></b-form-input>
            </b-form-group>
          </div>
          <div class="container">
            <b-row>
              <!-- FIRST CARD PREVIOUS DIRECTION -->
              <b-col cols="12">
                <b-card>
                  <b-row>
                    <!-- Title -->
                    <b-col cols="12">
                      <b-form-group label="PREVIOUS DIRECTION"></b-form-group>
                    </b-col>
                    <!-- Mailing Address -->
                    <b-col cols="12">
                      <b-form-group label="Mailing Address">
                        <vue-google-autocomplete
                          id="address_principal"
                          ref="addressprincipal"
                          class="form-control input-form"
                          placeholder="Please type your address"
                          @placechanged="getAddressData"
                          country="us"
                          v-model="data.mailing_address"
                          style="height: 30px !important"
                          :disabled="this.disabled"
                        ></vue-google-autocomplete>
                      </b-form-group>
                    </b-col>
                    <!-- City -->
                    <b-col cols="6">
                      <b-form-group label="City">
                        <b-form-input v-model="data.city" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- State -->
                    <b-col cols="6">
                      <b-form-group label="State">
                        <b-form-input v-model="data.state" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Zip Code -->
                    <b-col cols="6">
                      <b-form-group label="Zip Code">
                        <b-form-input v-model="data.zip_code" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Country -->
                    <b-col cols="6">
                      <b-form-group label="Country">
                        <b-form-input v-model="data.mailing_country" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- COUNTRY -->
                    <b-col cols="6">
                      <b-form-group label="COUNTY">
                        <b-form-input v-model="data.country" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
              <!-- SECOND CARD AUTO LOAN-->
              <b-col cols="12">
                <b-card>
                  <b-row>
                    <!-- Check Box Auto Loan -->
                    <b-col cols="12">
                      <b-form-group
                        label="AUTO LOAN"
                        label-cols="5"
                        content-cols="7"
                        label-cols-sm="3"
                        content-cols-sm="9"
                        label-cols-md="3"
                        content-cols-md="9"
                        label-cols-lg="2"
                        content-cols-lg="10"
                      >
                        <b-form-checkbox
                          style="padding-top: 3px"
                          id="withotheraddress"
                          v-model="data.auto_loan"
                          :disabled="this.disabled"
                          value="1"
                        ></b-form-checkbox>
                      </b-form-group>
                    </b-col>
                    <!-- Company -->
                    <b-col cols="6">
                      <b-form-group label="Company">
                        <b-form-input v-model="data.al_question.company" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Monthly Payment -->
                    <b-col cols="6">
                      <b-form-group label="Monthly Payment">
                        <b-input-group prepend="$">
                          <b-form-input
                            v-model="data.al_question.monthly_payment"
                            :disabled="this.disabled"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <!-- Year Opened -->
                    <b-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <b-form-group label="Year Opened">
                        <b-form-input
                          v-model="data.al_question.year_opened"
                          :disabled="this.disabled"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- No. of Months -->
                    <b-col cols="6">
                      <b-form-group label="No. of Months">
                        <b-form-input v-model="data.al_question.n_months" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Original Amount -->
                    <b-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <b-form-group label="Original Amount">
                        <b-input-group prepend="$">
                          <b-form-input
                            v-model="data.al_question.original_amount"
                            :disabled="this.disabled"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
              <!-- THIRD CARD MORTAGE -->
              <b-col cols="12">
                <b-card>
                  <b-row>
                    <!-- Check Box Mortage -->
                    <b-col cols="12">
                      <b-form-group
                        label="MORTAGE"
                        label-cols="5"
                        content-cols="7"
                        label-cols-sm="3"
                        content-cols-sm="9"
                        label-cols-md="3"
                        content-cols-md="9"
                        label-cols-lg="2"
                        content-cols-lg="10"
                      >
                        <b-form-checkbox
                          id="mortage"
                          v-model="data.mortage"
                          :disabled="this.disabled"
                          value="1"
                        ></b-form-checkbox>
                      </b-form-group>
                    </b-col>
                    <!-- Company -->
                    <b-col cols="6">
                      <b-form-group label="Company">
                        <b-form-input v-model="data.m_question.company" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Monthly Payment -->
                    <b-col cols="6">
                      <b-form-group label="Monthly Payment">
                        <b-input-group prepend="$">
                          <b-form-input
                            v-model="data.m_question.monthly_payment"
                            :disabled="this.disabled"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <!-- Year Opened -->
                    <b-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <b-form-group label="Year Opened">
                        <b-form-input
                          v-model="data.m_question.year_opened"
                          :disabled="this.disabled"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- No. of Months -->
                    <b-col cols="6">
                      <b-form-group label="No. of Months">
                        <b-form-input
                          v-model="data.m_question.n_months"
                          type="text"
                          :disabled="this.disabled"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
              <!-- FOURTH CARD STUDENT LOAN-->
              <b-col cols="12">
                <b-card>
                  <b-row>
                    <!-- Check BoxStudent Loan -->
                    <b-col cols="12">
                      <b-form-group
                        label="STUDENT LOAN"
                        label-cols="5"
                        content-cols="7"
                        label-cols-sm="3"
                        content-cols-sm="9"
                        label-cols-md="3"
                        content-cols-md="9"
                        label-cols-lg="2"
                        content-cols-lg="10"
                      >
                        <b-form-checkbox
                          id="studentLoan"
                          v-model="data.student_loan"
                          value="1"
                          :disabled="this.disabled"
                        ></b-form-checkbox>
                      </b-form-group>
                    </b-col>
                    <!-- Company -->
                    <b-col cols="6">
                      <b-form-group label="Company">
                        <b-form-input v-model="data.sl_question.company" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Monthly Payment -->
                    <b-col cols="6">
                      <b-form-group label="Monthly Payment">
                        <b-input-group prepend="$">
                          <b-form-input
                            v-model="data.sl_question.monthly_payment"
                            :disabled="this.disabled"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <!-- Year Opened -->
                    <b-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <b-form-group label="Year Opened">
                        <b-form-input
                          v-model="data.sl_question.year_opened"
                          :disabled="this.disabled"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- No. of Months -->
                    <b-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <b-form-group label="No. of Months">
                        <b-form-input v-model="data.sl_question.n_months" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Original Amount -->
                    <b-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <b-form-group label="Original Amount">
                        <b-input-group prepend="$">
                          <b-form-input
                            v-model="data.sl_question.original_amount"
                            :disabled="this.disabled"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
              <!-- FIFTH CARD COLLECTION -->
              <b-col cols="12">
                <b-card>
                  <b-row>
                    <!-- Tit;e -->
                    <b-col cols="12">
                      <b-form-group label="COLLECTION"></b-form-group>
                    </b-col>
                    <!-- Company -->
                    <b-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <b-form-group label="Company">
                        <b-form-input v-model="data.c_question.company" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Balance -->
                    <b-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <b-form-group label="Balance">
                        <b-form-input v-model="data.c_question.balance" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Year Opened -->
                    <b-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <b-form-group label="Year Opened">
                        <b-form-input
                          v-model="data.c_question.year_opened"
                          :disabled="this.disabled"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
              <!-- SIXTH CARD OPEN ACCOUNTS -->
              <b-col cols="12">
                <b-card>
                  <b-row>
                    <!-- Check Box Open Accounts -->
                    <b-col cols="12">
                      <b-form-group
                        label="OPEN ACCOUNTS"
                        label-cols="5"
                        content-cols="7"
                        label-cols-sm="3"
                        content-cols-sm="9"
                        label-cols-md="3"
                        content-cols-md="9"
                        label-cols-lg="2"
                        content-cols-lg="10"
                      >
                        <b-form-checkbox
                          id="openAccount"
                          v-model="data.open_accounts"
                          value="1"
                          :disabled="this.disabled"
                        ></b-form-checkbox>
                      </b-form-group>
                    </b-col>
                    <!-- Company -->
                    <b-col cols="6">
                      <b-form-group label="Company">
                        <b-form-input v-model="data.oa_question.company" :disabled="this.disabled"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Monthly Payment -->
                    <b-col cols="6">
                      <b-form-group label="Monthly Payment">
                        <b-input-group prepend="$">
                          <b-form-input
                            v-model="data.oa_question.monthly_payment"
                            :disabled="this.disabled"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <!-- Year Opended -->
                    <b-col cols="6" sm="4" md="4" lg="4" xl="4">
                      <b-form-group label="Year Opened">
                        <b-form-input
                          v-model="data.oa_question.year_opened"
                          :disabled="this.disabled"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                    <!-- Original Amount -->
                    <b-col cols="6" sm="6" md="6" lg="4" xl="4">
                      <b-form-group label="Original Amount">
                        <b-input-group prepend="$">
                          <b-form-input
                            v-model="data.oa_question.original_amount"
                            :disabled="this.disabled"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
      <!-- Button Save -->
      <div
        class="modal-footer align-items-end justify-content-end justify-content-sm-center"
        v-if="show"
      >
        <b-button @click="save()" variant="primary">Save</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
// Import Services
import NrcService from '../service/ncr.service'
export default {
  components: {
    VueGoogleAutocomplete
  },
  props: {
    modalQuestionnaire: {
      type: Boolean
    },
    global: {
      type: Object
    },
    score_id: {
      type: [Number, String]
    },
    lead_name: {
      type: [Number, String]
    },
    modul: {
      type: [Number, String]
    },
    question_id: {
      type: [Number, String]
    },
    status_id: {
      type: [Number, String]
    }
  },
  data() {
    return {
      ifModal: this.modalQuestionnaire,
      data: {
        user_id: this.global.user_id,
        score_id: this.score_id,
        modul: this.modul,
        employeed: "",
        mailing_address: "",
        city: "",
        state: "",
        zip_code: "",
        mailing_country: "",
        country: "",
        auto_loan: "",
        al_question: {
          company: "",
          monthly_payment: "",
          year_opened: "",
          n_months: "",
          original_amount: ""
        },
        mortage: "",
        m_question: {
          company: "",
          monthly_payment: "",
          year_opened: "",
          n_months: ""
        },
        student_loan: "",
        sl_question: {
          company: "",
          monthly_payment: "",
          year_opened: "",
          n_months: "",
          original_amount: ""
        },
        c_question: {
          company: "",
          balance: "",
          year_opened: ""
        },
        open_accounts: "",
        oa_question: {
          company: "",
          monthly_payment: "",
          year_opened: "",
          original_amount: ""
        }
      },
      show: false,
      disabled: true
    };
  },
  methods: {
    closeModal:function() {
      this.$emit("closeModalQuestionnaire", false);
    },
    getQuestionnaire:async function() {
      try{
        this.addPreloader();
        const response = await NrcService.getQuestionnaire({question_id: this.question_id})
        if (response.status == 200) {
            this.data.employeed = response.data[0].employeed;
            this.data.mailing_address = response.data[0].mailing_address;
            this.data.city = response.data[0].city;
            this.data.state = response.data[0].state;
            this.data.zip_code = response.data[0].zip_code;
            this.data.mailing_country = response.data[0].mailing_country;
            this.data.country = response.data[0].country;

            this.data.auto_loan = response.data[0].auto_loan;
            var al_question = JSON.parse(response.data[0].auto_loan_question);
            this.data.al_question.company = al_question.company;
            this.data.al_question.monthly_payment = al_question.monthly_payment;
            this.data.al_question.year_opened = al_question.year_opened;
            this.data.al_question.n_months = al_question.n_months;
            this.data.al_question.original_amount = al_question.original_amount;

            this.data.mortage = response.data[0].mortage;
            var m_question = JSON.parse(response.data[0].mortage_question);
            this.data.m_question.company = m_question.company;
            this.data.m_question.monthly_payment = m_question.monthly_payment;
            this.data.m_question.year_opened = m_question.year_opened;
            this.data.m_question.n_months = m_question.n_months;

            this.data.student_loan = response.data[0].student_loan;
            var sl_question = JSON.parse(
              response.data[0].student_loan_question
            );
            this.data.sl_question.company = sl_question.company;
            this.data.sl_question.monthly_payment = sl_question.monthly_payment;
            this.data.sl_question.year_opened = sl_question.year_opened;
            this.data.sl_question.n_months = sl_question.n_months;
            this.data.sl_question.original_amount = sl_question.original_amount;

            var c_question = JSON.parse(response.data[0].collection_question);
            this.data.c_question.company = c_question.company;
            this.data.c_question.balance = c_question.balance;
            this.data.c_question.year_opened = c_question.year_opened;

            this.data.open_accounts = response.data[0].open_accounts;

            var oa_question = JSON.parse(
              response.data[0].open_accounts_question
            );
            this.data.oa_question.company = oa_question.company;
            this.data.oa_question.monthly_payment = oa_question.monthly_payment;
            this.data.oa_question.year_opened = oa_question.year_opened;
            this.data.oa_question.original_amount = oa_question.original_amount;
            this.removePreloader();
          }

      }catch(error){
        console.log(error)
        this.removePreloader();
          if (errors.response.status == 500 || errors.response.status == 422) {
            this.showToast(
              "danger",
              "top-right",
              "Error",
              "XIcon",
              "Something went wrong!"
            );
          }
      }
    },
    getAddressData: function(address_principal) {
      this.direccion = address_principal;
      this.address_principal =
        this.direccion.street_number + " " + this.direccion.route;
      this.data.mailing_address = this.address_principal;
      this.data.state = this.direccion.administrative_area_level_1;
      this.data.city = this.direccion.locality;
      this.data.zip_code = this.direccion.postal_code;
      this.data.mailing_country = this.direccion.country;
    },
    startStatus:function() {
      if (this.question_id != null) {
        this.getQuestionnaire();
      }
      if (
        (this.status_id != 2 && this.status_id != 10) ||
        this.question_id == null
      ) {
        this.show = true;
        this.disabled = false;
      }
    },
    save() {
      this.showConfirmSwal().then(async result => {
        if (result.value) {
          try{
            this.addPreloader();
            this.data["score_id"] = this.score_id;
            this.data["open_account"] = this.data["open_accounts"];
            const response = await NrcService.saveQuestionnaire(this.data)
            if (response.status == 200) {
                this.$emit("closeModalQuestionnaire", false);
                this.removePreloader();
                this.showSuccessSwal("OPERATION SUCCESSFULLY");
                this.$emit("updateGrid", false);
              }

          }catch(errors){
            console.log(errors)
            this.removePreloader();
          }
        }
      });
    }
  },

  created:function() {
    this.startStatus();
  }
};
</script>