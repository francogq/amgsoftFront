<template>
  <b-container>
    <!-- Input: Creditor Parent -->
    <b-row>
      <b-col>
        <b-form-group label="Creditor Parent" label-for="creditorParent">
          <vue-autosuggest
            ref="autocomplete"
           
            :suggestions="filteredOptions"
            :get-suggestion-value="getSuggestionValue"
            :input-props="{
              id: 'creditorParent',
              class: 'form-control',
            }"
            :limit="10"
            @input="searchCreditorParent"
            @selected="selectHandler"
          >
            <template slot-scope="{ suggestion }">
              <span class="my-suggestion-item">
                {{ suggestion.item.value }}
              </span>
            </template>
          </vue-autosuggest>
        </b-form-group>
      </b-col>
    </b-row>
    <!-- Input: Creditor Name -->
    <b-row>
      <b-col>
        <validation-provider
          name="Creditor Name"
          rules="required"
          v-slot="{ errors }"
        >
          <b-form-group label="Creditor Name" label-for="creditorName">
            <b-form-input
              id="creditorName"
              v-model="userData.creditorName"
              name="creditorName"
              autofocus
              trim
              :state="errors[0] ? false : null"
            />
          </b-form-group>
        </validation-provider>
      </b-col>
    </b-row>
    <!-- Start Recovery Section -->
    <h4>Recovery</h4>
    <!-- Input: Recovery - Name -->
    <b-row class="mt-1">
      <b-col>
        <b-form-group label="Name" label-for="recovery">
          <div class="paddingT">
            <b-form-input id="recovery" name="recovery" v-model="userData.recoveryName" autofocus trim />
          </div>
        </b-form-group>
      </b-col>
      <!-- Input: Recovery - Phone -->
      <b-col>
        <validation-provider name="recoveryPhone">
          <div class="d-flex justify-content-between">
            <label for="recoveryPhone">Phone</label>
            <b-button
              variant="outline"
              class="p-0 paddingB"
              :disabled="isDisabledPhone"
              @click="addInput(1)"
            >
              <feather-icon
                icon="PlusSquareIcon"
                size="18"
                class="mr-50 text-primary"
              />
            </b-button>
          </div>
          <b-form-input
            id="recoveryPhone"
            v-model="userData.recoveryPhone[0].phone"
            autofocus
            trim
            class="widthInput"
            maxlength="14"
            @keyup.native="formatPhone(0)"
          />
        </validation-provider>
        <div v-show="showPhone">
          <validation-provider name="recoveryPhone">
            <b-row v-for="(item, index) in userData.recoveryPhone" :key="index">
              <b-col class="mt-1 ml-1 p-0" v-if="index > 0">
                <div class="d-flex justify-content-between">
                  <b-form-input
                    v-model="userData.recoveryPhone[index].phone"
                    autofocus
                    trim
                    maxlength="14"
                    @keyup.native="formatPhone(index)"
                  />
                  <div class="paddingIconoX">
                    <b-button
                      variant="outline"
                      class="p-0 m-0"
                      @click="deleteInput(1, index)"
                    >
                      <feather-icon
                        icon="XCircleIcon"
                        size="18"
                        class="text-danger"
                      />
                    </b-button>
                  </div>
                </div>
              </b-col>
            </b-row>
          </validation-provider>
        </div>
      </b-col>
      <!-- Input: Recovery - Fax -->
      <b-col>
        <validation-provider name="recoveryFax">
          <div class="d-flex justify-content-between">
            <label>Fax</label>
            <b-button
              variant="outline"
              class="p-0 paddingB"
              :disabled="isDisabledFax"
              @click="addInput(2)"
            >
              <feather-icon
                icon="PlusSquareIcon"
                size="18"
                class="mr-50 text-primary"
              />
            </b-button>
          </div>
          <b-form-input
            id="recoveryFax"
            v-model="userData.recoveryFax[0].fax"
            name="recoveryFax"
            autofocus
            trim
            class="widthInput"
            maxlength="14"
            @keyup.native="formatFax(0)"
          />
        </validation-provider>
        <div v-show="showFax">
          <validation-provider name="recoveryFax">
            <b-row v-for="(item, index) in userData.recoveryFax" :key="index">
              <b-col class="mt-1 ml-1 p-0" v-if="index > 0">
                <div class="d-flex justify-content-between">
                  <b-form-input
                    v-model="userData.recoveryFax[index].fax"
                    id="fax1"
                    name="fax1"
                    autofocus
                    trim
                    maxlength="14"
                    @keyup.native="formatFax(index)"
                  />
                  <div class="paddingIconoX">
                    <b-button
                      variant="outline"
                      class="p-0 m-0"
                      @click="deleteInput(2, index)"
                    >
                      <feather-icon
                        icon="XCircleIcon"
                        size="18"
                        class="text-danger"
                      />
                    </b-button>
                  </div>
                </div>
              </b-col>
            </b-row>
          </validation-provider>
        </div>
      </b-col>
      <!-- Input: Recovery - Email -->
      <b-col>
        <validation-provider v-slot="{ errors }" name="Email" rules="email">
          <div class="d-flex justify-content-between">
            <label>Email</label>

            <b-button
              variant="outline"
              class="p-0 paddingB"
              :disabled="isDisabledEmail"
              @click="addInput(3)"
            >
              <feather-icon
                icon="PlusSquareIcon"
                size="18"
                class="mr-50 text-primary"
              />
            </b-button>
          </div>
          <b-form-input
            id="email"
            v-model="userData.recoveryEmail[0].email"
            name="email"
            autofocus
            trim
            :state="errors[0] ? false : null"
            class="widthInput"
          />
        </validation-provider>
        <div v-show="showEmail">
          <b-row v-for="(item, index) in userData.recoveryEmail" :key="index">
            <validation-provider v-slot="{ errors }" rules="email">
              <b-col class="mt-1 ml-1 p-0" v-if="index > 0">
                <div class="d-flex justify-content-between">
                  <b-form-input
                    v-model="userData.recoveryEmail[index].email"
                    name="email"
                    autofocus
                    trim
                    :state="errors[0] ? false : null"
                  />
                  <div class="paddingIconoX">
                    <b-button
                      variant="outline"
                      class="p-0 m-0"
                      @click="deleteInput(3, index)"
                    >
                      <feather-icon
                        icon="XCircleIcon"
                        size="18"
                        class="text-danger"
                      />
                    </b-button>
                  </div>
                </div>
              </b-col>
            </validation-provider>
          </b-row>
        </div>
      </b-col>
    </b-row>
    <!-- End Recovery Section -->
    <!-- Start Customer Section -->
    <h4>Customer</h4>
    <!-- Input: Customer - Phone -->
    <b-row class="mt-2">
      <b-col cols="2" class="mr-0 pr-0">
        <validation-provider name="customerPhone">
          <div class="d-flex justify-content-between">
            <label>Phone</label>
            <b-button
              variant="outline"
              class="p-0 paddingB"
              :disabled="isDisabledPhoneCustoner"
              @click="addInput(4)"
            >
              <feather-icon
                icon="PlusSquareIcon"
                size="18"
                class="text-primary"
              />
            </b-button>
          </div>
          <b-form-input
            id="phone"
            v-model="userData.customerPhone[0].phone"
            name="phone"
            autofocus
            trim
            maxlength="14"
            @keyup.native="formatPhoneCustomer(0)"
          />
        </validation-provider>
      </b-col>
      <b-col cols="10" v-show="showPhoneCustoner" class="w-75">
        <validation-provider name="customerPhone">
          <b-row class="ppaddingTP">
            <b-col
              cols="3"
              v-for="(item, index) in userData.customerPhone"
              :key="index"
              v-show="index > 0"
            >
              <div class="d-flex justify-content-end">
                <b-form-input
                  id="phone1"
                  v-model="userData.customerPhone[index].phone"
                  name="phone1"
                  autofocus
                  trim
                  class="widthInputPhone"
                  maxlength="14"
                  @keyup.native="formatPhoneCustomer(index)"
                />
                <div class="paddingIconoX">
                  <b-button
                    variant="outline"
                    class="p-0 m-0"
                    @click="deleteInput(4, index)"
                  >
                    <feather-icon
                      icon="XCircleIcon"
                      size="18"
                      class="text-danger"
                    />
                  </b-button>
                </div>
              </div>
            </b-col>
          </b-row>
        </validation-provider>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <!-- Input: Customer - % Min of settlement -->
      <b-col cols="4">
        <b-form-group label="% Min of settlement" label-for="settlement">
          <b-form-input
            id="settlement"
            type="number"
            v-model="userData.customerSettlement"
            name="settlement"
            autofocus
            trim
          />
        </b-form-group>
      </b-col>
      <!-- Input: Customer - Settle with A.M.G -->
      <b-col cols="2" class="d-flex justify-content-center">
        <b-form-group label="Settle with A.M.G" v-slot="{ ariaDescribedby }">
          <b-form-radio-group class="paddingT">
            <b-form-radio
              v-model="userData.customerSettle"
              :aria-describedby="ariaDescribedby"
              value="1"
              >Yes</b-form-radio
            >
            <b-form-radio
              v-model="userData.customerSettle"
              :aria-describedby="ariaDescribedby"
              value="2"
              >No</b-form-radio
            >
          </b-form-radio-group>
        </b-form-group>
      </b-col>
      <!-- Input: Customer - website -->
      <b-col cols="6">
        <b-form-group label="Website" label-for="website">
          <b-form-input
            id="website"
            v-model="userData.customerWeb"
            name="website"
            autofocus
            trim
          />
        </b-form-group>
      </b-col>
    </b-row>
    <!-- Input: Customer - Mailing address -->
    <b-row class="mt-1">
      <b-col>
        <b-form-group label="Mailing address">
          <vue-google-autocomplete
            id="address_principal"
            ref="addressprincipal"
            class="form-control input-form"
            placeholder="Please type your address"
            country="us"
            v-model="userData.customerAddress"
            style="height: 30px !important"
          ></vue-google-autocomplete>
        </b-form-group>
      </b-col>
    </b-row>
    <!-- End Customer Section -->
  </b-container>
</template>
<script>
import { VueAutosuggest } from "vue-autosuggest";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import CreditorsService from "../../service/creditors.service";
import { required, alphaNum, email } from "@validations";
export default {
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    VueAutosuggest,
    VueGoogleAutocomplete,
  },

  computed: {
    filterSearch() {
      return this.creditorParent == "" ? false : true;
    },
  },
  data() {
    return {
      required,
      alphaNum,
      email,
      dataCreditor: [],
      creditorParent: "",
      
      isDisabledPhone: false,
      isDisabledFax: false,
      isDisabledEmail: false,
      isDisabledPhoneCustoner: false,
      showPhone: false,
      showFax: false,
      showEmail: false,
      showPhoneCustoner: false,
      dataPhoneCustoner: false,
      dataPhone: [],
      dataFax: [],
      dataEmail: [],
      dataPhoneCustoner: [],
    };
  },
  methods: {
    async searchCreditorParent(text) {
      this.userData = null;
      if (text === "" || text === undefined) {
        this.filteredOptions = [];
        return;
      }
      try {
        const data = await CreditorsService.GET_CREDITORS_PARENTS({ q: text });
        this.filteredOptions = [{ data: data }];
      } catch (error) {
        console.error(error);
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "Something went wrong!"
        );
      }
    },
    selectHandler(data) {
      console.log(data, "data");
      this.user_id = data.item.id;
      this.creditorParent = data.item.value;
      this.users = null;
      this.statusSelected = false;
    },
    getSuggestionValue(suggestion) {
      console.log(suggestion, "suggestion")
      this.userData.creditorParent = suggestion.item.id;
      return suggestion.item.value;
    },
    addInput(data) {
      switch (data) {
        case 1:
          this.showPhone = true;
          this.userData.recoveryPhone.push({ phone: "" });
          if (this.userData.recoveryPhone.length == 5) {
            this.isDisabledPhone = true;
          }
          break;
        case 2:
          this.showFax = true;
          this.userData.recoveryFax.push({ fax: "" });
          if (this.userData.recoveryFax.length == 5) {
            this.isDisabledFax = true;
          }
          break;
        case 3:
          this.showEmail = true;
          this.userData.recoveryEmail.push({ email: "" });
          if (this.userData.recoveryEmail.length == 5) {
            this.isDisabledEmail = true;
          }
          break;
        case 4:
          this.showPhoneCustoner = true;
          this.userData.customerPhone.push({ phonecust: "" });
          if (this.userData.customerPhone.length == 5) {
            this.isDisabledPhoneCustoner = true;
          }
          break;
        default:
          break;
      }
    },
    deleteInput(data, index) {
      switch (data) {
        case 1:
          this.isDisabledPhone = false;
          for (var i = 0; i < this.userData.recoveryPhone.length; i++) {
            if (i == index) {
              this.userData.recoveryPhone.splice(i, 1);
            }
          }
          console.log(this.dataPhone.length, "dataPhone +");
          break;
        case 2:
          this.isDisabledFax = false;
          for (var i = 0; i < this.userData.recoveryFax.length; i++) {
            if (i == index) {
              this.userData.recoveryFax.splice(i, 1);
            }
          }
          break;
        case 3:
          this.isDisabledEmail = false;
          for (var i = 0; i < this.userData.recoveryEmail.length; i++) {
            if (i == index) {
              this.userData.recoveryEmail.splice(i, 1);
            }
          }
          break;
        case 4:
          this.isDisabledPhoneCustoner = false;
          for (var i = 0; i < this.userData.customerPhone.length; i++) {
            if (i == index) {
              this.userData.customerPhone.splice(i, 1);
            }
          }
          break;

        default:
          break;
      }
    },
    capitalize(el) {
      const element = this.userData[el];
      this.userData[el] =
        element.substr(0, 1).toUpperCase() + element.substr(1);
    },
    formatPhone(index) {
      var x = this.userData.recoveryPhone[index].phone
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.userData.recoveryPhone[index].phone = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    },
    formatFax(index) {
      var x = this.userData.recoveryFax[index].fax
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.userData.recoveryFax[index].fax = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    },
    formatPhoneCustomer(index ){
      var x = this.userData.customerPhone[index].phone
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.userData.customerPhone[index].phone = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    }
  },
  mounted() {},
};
</script>
<style lang="scss">
.paddingB {
  padding-bottom: 4px !important;
}
.paddingT {
  padding-top: 4px !important;
}
.ppaddingTP {
  padding-top: 23px !important;
}
.paddingIconoX {
  padding-top: 8px !important;
  padding-left: 3px !important;
}
.widthInput {
  width: 96%;
}
.widthInputPhone {
  width: 80%;
}
</style>