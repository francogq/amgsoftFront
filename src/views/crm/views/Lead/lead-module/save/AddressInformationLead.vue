<template>
  <b-row>
    <b-col>
      <b-row>
        <b-col md="6">
          <template v-if="userData.id">
            <!-- SSN -->
            <validation-provider
              v-if="
                hideSSN || userData.ssn || (!userData.ssn && !userData.itin)
              "
              name="SSN"
            >
              <b-form-group label="SSN" label-for="ssn" label-cols-md="2">
                <b-input-group>
                  <span
                    class="form-control bg-transparent"
                    v-if="disabled.ssn"
                    >{{ encryptedSSN }}</span
                  >
                  <b-form-input
                    v-else
                    id="ssn"
                    ref="ssn"
                    v-model="userData.ssn"
                    autofocus
                    trim
                    maxlength="11"
                    v-mask="'###-##-####'"
                    @keyup="onValidSsn"
                  />
                  <b-input-group-append
                    v-if="!disabled.ssn"
                    class="border-right"
                  >
                    <b-button
                      variant="outline-primary"
                      class="btn-sm"
                      :disabled="disabled.saveSSN"
                      @click="onSubmitFields('ssn', 4)"
                    >
                      <feather-icon icon="SaveIcon" class="cursor-pointer" />
                    </b-button>
                  </b-input-group-append>
                  <b-input-group-append
                    v-if="
                      isCeo || isSupervisor || !userData.ssn || isCoordinator
                    "
                    class="border-right"
                  >
                    <b-button
                      variant="outline-warning"
                      class="btn-sm"
                      @click="toggleElement('ssn')"
                    >
                      <feather-icon
                        v-if="disabled.ssn"
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
                    @click="onModalTrackingChangeOpen(4, 'SSN')"
                  >
                    <b-input-group-text>
                      <feather-icon icon="ListIcon" />
                    </b-input-group-text>
                  </b-input-group-append>
                  <b-input-group-append
                    is-text
                    class="border-left cursor-pointer"
                    @click="onAddSocial"
                  >
                    <feather-icon
                      :icon="addSocial ? 'MinusIcon' : 'PlusIcon'"
                    />
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </validation-provider>
            <!-- ITIN -->
            <validation-provider v-if="hideITIN || userData.itin" name="ITIN">
              <b-form-group label="ITIN" label-for="itin" label-cols-md="2">
                <b-input-group>
                  <span
                    class="form-control bg-transparent"
                    v-if="disabled.itin"
                    >{{ encryptedITIN }}</span
                  >
                  <b-form-input
                    v-else
                    id="itin"
                    ref="itin"
                    v-model="userData.itin"
                    autofocus
                    trim
                    maxlength="11"
                    v-mask="'###-##-####'"
                    @keyup="onValidItin"
                  />
                  <b-input-group-append
                    v-if="!disabled.itin"
                    class="border-right"
                  >
                    <b-button
                      variant="outline-primary"
                      class="btn-sm"
                      :disabled="disabled.saveITIN"
                      @click="onSubmitFields('itin', 5)"
                    >
                      <feather-icon icon="SaveIcon" class="cursor-pointer" />
                    </b-button>
                  </b-input-group-append>
                  <b-input-group-append
                    v-if="
                      isCeo || isSupervisor || !userData.itin || isCoordinator
                    "
                    class="border-right"
                  >
                    <b-button
                      variant="outline-warning"
                      class="btn-sm"
                      @click="toggleElement('itin')"
                    >
                      <feather-icon
                        v-if="disabled.itin"
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
                    @click="onModalTrackingChangeOpen(5, 'ITIN')"
                  >
                    <b-input-group-text>
                      <feather-icon icon="ListIcon" />
                    </b-input-group-text>
                  </b-input-group-append>
                  <b-input-group-append
                    v-if="!hideSSN && !userData.ssn"
                    is-text
                    class="cursor-pointer border-left"
                    variant="warning"
                    @click="onAddSocial"
                  >
                    <feather-icon
                      :icon="addSocial ? 'MinusIcon' : 'PlusIcon'"
                    />
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </validation-provider>
            <!-- CPN -->
            <validation-provider
              v-if="
                hideSSN ||
                (userData.ssn && userData.itin) ||
                userData.other ||
                !disabled.other
              "
              name="CPN"
            >
              <b-form-group label="CPN" label-for="cpn" label-cols-md="2">
                <b-input-group>
                  <span
                    class="form-control bg-transparent"
                    v-if="disabled.other"
                    >{{ encryptedCPN }}</span
                  >

                  <b-form-input
                    v-else
                    id="cpn"
                    ref="cpn"
                    v-model="userData.other"
                    autofocus
                    trim
                    maxlength="11"
                    v-mask="'###-##-####'"
                    @keyup="onValidCpn"
                  />
                  <b-input-group-append
                    v-if="!disabled.other"
                    class="border-right"
                  >
                    <b-button
                      variant="outline-primary"
                      class="btn-sm"
                      :disabled="disabled.saveCPN"
                      @click="onSubmitFields('cpn', 6, 'other')"
                    >
                      <feather-icon icon="SaveIcon" class="cursor-pointer" />
                    </b-button>
                  </b-input-group-append>
                  <b-input-group-append
                    v-if="
                      isCeo || isSupervisor || !userData.other || isCoordinator
                    "
                    class="border-right"
                  >
                    <b-button
                      variant="outline-warning"
                      class="btn-sm"
                      @click="toggleElement('other')"
                    >
                      <feather-icon
                        v-if="disabled.other"
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
                    @click="onModalTrackingChangeOpen(6, 'CPN')"
                  >
                    <b-input-group-text>
                      <feather-icon icon="ListIcon" />
                    </b-input-group-text>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </validation-provider>
          </template>
          <template v-else>
            <!-- SSN? -->
            <validation-provider name="SSN?">
              <b-form-group
                :label="`${!labssn && !labitin ? 'SSN' : statusLabs}`"
                label-for="ssn?"
                label-cols-md="2"
              >
                <b-input-group>
                  <b-form-input
                    id="ssn?"
                    v-model="userData.social"
                    autofocus
                    trim
                    maxlength="11"
                    v-mask="'###-##-####'"
                    @input="security"
                  />
                  <b-input-group-append is-text variant="warning">
                    <feather-icon
                      :icon="addSocial ? 'MinusIcon' : 'PlusIcon'"
                      class="cursor-pointer"
                      @click="toggleSocial"
                    />
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </validation-provider>
            <!-- SSN -->
            <validation-provider v-if="hideSSN" name="SSN">
              <b-form-group label="SSN" label-for="ssn" label-cols-md="2">
                <b-form-input
                  id="ssn"
                  v-model="userData.ssn"
                  autofocus
                  trim
                  maxlength="11"
                  v-mask="'###-##-####'"
                />
              </b-form-group>
            </validation-provider>
            <!-- ITIN -->
            <validation-provider v-if="hideITIN" name="ITIN">
              <b-form-group label="ITIN" label-for="itin" label-cols-md="2">
                <b-form-input
                  id="itin"
                  v-model="userData.itin"
                  autofocus
                  trim
                  maxlength="11"
                  v-mask="'###-##-####'"
                />
              </b-form-group>
            </validation-provider>
            <!-- CPN -->
            <validation-provider v-if="hideCPN" name="CPN">
              <b-form-group label="CPN" label-for="cpn" label-cols-md="2">
                <b-form-input
                  id="cpn"
                  v-model="userData.other"
                  autofocus
                  trim
                  maxlength="11"
                  v-mask="'###-##-####'"
                />
              </b-form-group>
            </validation-provider>
          </template>
        </b-col>
        <b-col md="6">
          <!-- Phone -->
          <validation-provider name="Phone">
            <b-form-group label="Phone (H)" label-for="phone">
              <b-input-group>
                <b-form-input
                  id="phone"
                  v-model="userData.phone"
                  trim
                  maxlength="14"
                  :disabled="userData.id && disabled.phone"
                  @keyup.native="phone()"
                />
                <template v-if="userData.id">
                  <b-input-group-append
                    v-if="!disabled.phone"
                    class="border-right"
                  >
                    <b-button
                      variant="outline-primary"
                      class="btn-sm"
                      @click="onSubmitFields('phoneh', 2, 'phone')"
                    >
                      <feather-icon icon="SaveIcon" class="cursor-pointer" />
                    </b-button>
                  </b-input-group-append>
                  <b-input-group-append class="border-right">
                    <b-button
                      variant="outline-warning"
                      class="btn-sm"
                      @click="toggleElement('phone')"
                    >
                      <feather-icon
                        v-if="disabled.phone"
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
                    @click="onModalTrackingChangeOpen(2, 'PHONE (H)')"
                  >
                    <b-input-group-text>
                      <feather-icon icon="ListIcon" />
                    </b-input-group-text>
                  </b-input-group-append>
                </template>
              </b-input-group>
            </b-form-group>
          </validation-provider>
          <!-- Mobile -->
          <validation-provider
            v-slot="{ errors }"
            name="Mobile"
            rules="required"
          >
            <b-form-group label="Phone (M)" label-for="mobile">
              <b-input-group>
                <b-form-input
                  id="mobile"
                  v-model="userData.mobile"
                  trim
                  maxlength="14"
                  :disabled="userData.id && disabled.mobile"
                  :state="errors[0] ? false : null"
                  @keyup.native="mobile()"
                />
                <template v-if="userData.id">
                  <b-input-group-append
                    v-if="!disabled.mobile"
                    class="border-right"
                  >
                    <b-button
                      variant="outline-primary"
                      class="btn-sm"
                      @click="onSubmitFields('phonem', 3, 'mobile')"
                    >
                      <feather-icon icon="SaveIcon" class="cursor-pointer" />
                    </b-button>
                  </b-input-group-append>
                  <b-input-group-append class="border-right">
                    <b-button
                      variant="outline-warning"
                      class="btn-sm"
                      @click="toggleElement('mobile')"
                    >
                      <feather-icon
                        v-if="disabled.mobile"
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
                    @click="onModalTrackingChangeOpen(3, 'PHONE (M)')"
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
      </b-row>
      <address-component
        :address-data="userData.address"
        @onSubmitAddress="onSubmitAddress"
        @onModalTrackingChangeOpen="onModalTrackingChangeOpen(1, 'ADDRESS')"
      />
      <b-row>
        <b-col md="6">
          <b-form-group>
            <b-form-checkbox
              id="another-address"
              name="another-address"
              v-model="hideWithOtherAddress"
              class="mt-2"
              >Another address?</b-form-checkbox
            >
          </b-form-group>
        </b-col>
        <b-col md="6">
          <!-- Origin Country -->

          <b-form-group label="Origin Country" label-for="originCountry">
            <v-select
              id="originCountry"
              v-model="userData.origin_country"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="label"
              :options="G_COUNTRIES"
              :reduce="(el) => el.id"
              :clearable="false"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <address-component
        v-if="hideWithOtherAddress"
        :address-data="userData.otherAddress"
        @onSubmitAddress="onSubmitAnotherAddress"
        @onModalTrackingChangeOpen="
          onModalTrackingChangeOpen(8, 'OTHER ADDRESS')
        "
      />
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInvalidFeedback,
  BButton,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, alphaNum, email } from "@validations";

import vSelect from "vue-select";
import VueGoogleAutocomplete from "vue-google-autocomplete";

import formValidation from "@core/comp-functions/forms/form-validation";
import countries from "@/@fake-db/data/other/countries";

import AddressComponent from "@/views/crm/views/Lead/components/AddressComponent.vue";

export default {
  components: {
    AddressComponent,
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
  model: {
    event: "update:is-add-new-user-sidebar-active",
  },
  props: {
    userData: {
      type: Object,
      required: true,
    },
    blankUserFields: {
      type: Object,
      required: false,
    },
    typeForm: {
      type: String,
      required: false, // newLead, editLead
    },
  },
  data() {
    return {
      addSocial: false,
      alphaNum,
      blankUserData: new Object(),
      countries,
      disabled: {
        ssn: true,
        itin: true,
        other: true,
        phone: true,
        mobile: true,
        saveSSN: false,
        saveITIN: false,
      },
      email,
      hideSSN: false,
      hideITIN: false,
      hideCPN: false,
      hideWithOtherAddress: false,
      labssn: false,
      labitin: false,
      location: null,
      required,
    };
  },
  computed: {
    statusLabs() {
      return this.labssn ? "SSN" : "ITIN";
    },
    encryptedSSN() {
      return this.encryptDocument(this.userData.ssn);
    },
    encryptedITIN() {
      return this.encryptDocument(this.userData.itin);
    },
    encryptedCPN() {
      return this.encryptDocument(this.userData.other);
    },

    ...mapGetters({
      G_COUNTRIES: "CrmGlobalStore/G_COUNTRIES",
    }),
  },
  created() {
    this.setDataBlank("userData");
  },
  setup() {
    const { refFormObserver, getValidationState } = formValidation(() => {});

    return {
      refFormObserver,
      getValidationState,
    };
  },
  methods: {
    ...mapActions({
      A_UNIQUE_MOBILE: "CrmGlobalStore/A_UNIQUE_MOBILE",
      A_SET_REQUEST_LEADS: "CrmLeadStore/A_SET_REQUEST_LEADS",
      A_VALID_UNIQUE_SSN: "CrmLeadStore/A_VALID_UNIQUE_SSN",
      A_VALID_UNIQUE_ITIN: "CrmLeadStore/A_VALID_UNIQUE_ITIN",
      A_VALID_UNIQUE_CPN: "CrmLeadStore/A_VALID_UNIQUE_CPN",
      A_UPDATE_FIELDS_LEAD: "CrmLeadStore/A_UPDATE_FIELDS_LEAD",
    }),
    encryptDocument(document) {
      return document ? `xxx-xx-${document.substr(7)}` : "";
    },
    setDataBlank(key) {
      this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`] =
        Object.assign({}, this[key]);
    },
    resetData(key) {
      const object = this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`];
      for (let subkey in object) {
        this[key][subkey] = object[subkey];
      }
    },
    resetElement(key, subkey) {
      const object = this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`];
      this[key][subkey] = object[subkey];
    },
    security() {
      const val = this.userData.social.substr(0, 1);
      if (["", "0", "1", "2", "3", "4", "5", "6", "7", "8"].includes(val)) {
        this.labssn = true;
        this.labitin = false;

        if (this.hideSSN == true) {
          this.hideITIN = true;
          this.hideSSN = false;
          this.userData.itin = "";
        }
      } else if (val == 9) {
        this.labssn = false;
        this.labitin = true;
        if (this.hideITIN == true) {
          this.hideITIN = false;
          this.hideSSN = true;
          this.userData.ssn = "";
        }
      }
    },
    toggleSocial() {
      const val = this.userData.social.substr(0, 1);
      if (!this.addSocial) {
        this.hideSSN = false;
        this.hideITIN = true;
        this.hideCPN = true;
        if (val === "9") {
          this.hideSSN = true;
          this.hideITIN = false;
        }
      } else {
        this.hideSSN = false;
        this.hideITIN = false;
        this.hideCPN = false;
      }
      this.addSocial = !this.addSocial;
    },
    onAddSocial() {
      if (!this.addSocial) {
        this.hideSSN = true;
        this.hideITIN = true;
        this.hideCPN = true;
      } else {
        this.hideSSN = false;
        this.hideITIN = false;
        this.hideCPN = false;
      }
      this.addSocial = !this.addSocial;
    },
    phone() {
      var x = this.userData.phone
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.userData.phone = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    },
    async mobile() {
      try {
        var x = this.userData.mobile
          .replace(/\D/g, "")
          .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        this.userData.mobile = !x[2]
          ? x[1]
          : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
        if (this.userData.mobile.length == 14) {
          this.isPreloading(true);
          const response = await this.A_UNIQUE_MOBILE({
            mobile: this.userData.mobile,
          });
          if (response.status == 200) {
            if (response.data.error_code == "MOBILE_EXISTS") {
              this.showConfirmSwal("Are you sure?", response.data.message, {
                confirmButtonText:
                  this.typeForm == "newLead"
                    ? "REQUEST LEAD TO SOCIAL NETWORK"
                    : "OK",
              })
                .then(async (result) => {
                  if (result.value && this.typeForm == "newLead") {
                    this.isPreloading(true);
                    await this.A_SET_REQUEST_LEADS({
                      lead_id: response.data.lead_id,
                      lead_name: response.data.message,
                    });
                    this.isPreloading(false);
                  }
                })
                .catch((error) => {
                  throw error;
                });
            }
            this.isPreloading(false);
          }
        }
      } catch (error) {
        console.log("Something went wrong mobile:", error);
        this.isPreloading(false);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    toggleElement(key) {
      this.disabled[key] = !this.disabled[key];
      if (this.disabled[key]) this.resetElement("userData", key);
    },
    async onValidSsn() {
      try {
        this.$refs.ssn.$el.classList.remove("is-invalid");
        this.disabled.saveSSN = false;
        if (this.userData.ssn.length === 11) {
          this.isPreloading();
          const response = await this.A_VALID_UNIQUE_SSN({
            ssn: this.userData.ssn,
          });
          if (this.isResponseSuccess(response)) {
            if (response.data.code === "ssn") {
              this.disabled.saveSSN = true;
              this.$refs.ssn.$el.classList.remove("is-valid");
              this.$refs.ssn.$el.classList.add("is-invalid");
              this.showWarningSwal(
                "Alert!",
                "The ssn number already exists: " + response.data.message
              );
            }
          }
          this.isPreloading(false);
        }
      } catch (error) {
        console.log("Something went wrong onValidSsn: ", error);
        this.isPreloading(false);
        this.showErrorSwal();
      }
    },
    async onValidItin() {
      try {
        this.$refs.itin.$el.classList.remove("is-invalid");
        this.disabled.saveITIN = false;
        if (this.userData.itin.length === 11) {
          this.isPreloading(true);
          const response = await this.A_VALID_UNIQUE_ITIN({
            itin: this.userData.itin,
          });
          if (this.isResponseSuccess(response)) {
            if (response.data.code === "itin") {
              this.disabled.saveITIN = true;
              this.$refs.itin.$el.classList.remove("is-valid");
              this.$refs.itin.$el.classList.add("is-invalid");
              this.showWarningSwal(
                "Alert!",
                "The itin number already exists: " + response.data.message
              );
            }
          }
          this.isPreloading(false);
        }
      } catch (error) {
        console.log("Something went wrong onValidSsn: ", error);
        this.isPreloading(false);
        this.showErrorSwal();
      }
    },
    async onValidCpn() {
      try {
        this.$refs.cpn.$el.classList.remove("is-invalid");
        this.disabled.saveITIN = false;
        if (this.userData.other.length === 11) {
          this.isPreloading(true);
          const response = await this.A_VALID_UNIQUE_CPN({
            other: this.userData.other,
          });
          if (this.isResponseSuccess(response)) {
            if (response.data.code === "cpn") {
              this.disabled.saveITIN = true;
              this.$refs.cpn.$el.classList.remove("is-valid");
              this.$refs.cpn.$el.classList.add("is-invalid");
              this.showWarningSwal(
                "Alert!",
                "The cpn number already exists: " + response.data.message
              );
            }
          }
          this.isPreloading(false);
        }
      } catch (error) {
        console.log("Something went wrong onValidSsn: ", error);
        this.isPreloading(false);
        this.showErrorSwal();
      }
    },
    async onSubmitFields(key, typee, subkey) {
      this.showConfirmSwal()
        .then(async (result) => {
          if (result.value) {
            this.isPreloading(true);
            const response = await this.A_UPDATE_FIELDS_LEAD({
              ...this.blankUserFields,
              typee,
              [key]: this.userData[subkey]
                ? this.userData[subkey]
                : this.userData[key],
            });
            if (this.userData[subkey]) {
              key = subkey;
            }
            this.isPreloading(false);
            if (this.isResponseSuccess(response)) {
              this.blankUserData[key] = this.userData[key];
              this.toggleElement(key);
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
            } else
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                "Something went wrong." + response.message
              );
          }
        })
        .catch((error) => {
          console.log("Something went wrong onSubmitFields: ", error);
          this.isPreloading(false);
          this.showErrorSwal();
        });
    },
    async onSubmitAddress() {
      this.showConfirmSwal()
        .then(async (result) => {
          if (result.value) {
            this.isPreloading(true);
            const response = await this.A_UPDATE_FIELDS_LEAD({
              ...this.blankUserFields,
              typee: 1,
              street: this.userData.address.street,
              city: this.userData.address.city,
              state: this.userData.address.state,
              zipcode: this.userData.address.zipcode,
              country: this.userData.address.country,
            });
            this.isPreloading(false);
            if (this.isResponseSuccess(response)) {
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
            } else
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                "Something went wrong." + response.message
              );
          }
        })
        .catch((error) => {
          console.log("Something went wrong onSubmitAddress: ", error);
          this.isPreloading(false);
          this.showErrorSwal();
        });
    },
    async onSubmitAnotherAddress() {
      this.showConfirmSwal()
        .then(async (result) => {
          if (result.value) {
            this.isPreloading(true);
            const response = await this.A_UPDATE_FIELDS_LEAD({
              ...this.blankUserFields,
              typee: 8,
              other_street: this.userData.otherAddress.street,
              other_city: this.userData.otherAddress.city,
              other_state: this.userData.otherAddress.state,
              other_zipcode: this.userData.otherAddress.zipcode,
              other_country: this.userData.otherAddress.country,
            });
            this.isPreloading(false);
            if (this.isResponseSuccess(response)) {
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
            } else
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                "Something went wrong." + response.message
              );
          }
        })
        .catch((error) => {
          console.log("Something went wrong onSubmitAnotherAddress: ", error);
          this.isPreloading(false);
          this.showErrorSwal();
        });
    },
    onModalTrackingChangeOpen(type, name) {
      this.$emit("onModalTrackingChangeOpen", {
        type,
        name,
        mapFunction: (el) => ({
          ...el,
          main_row: el.fields,
          main_row_hide: el.fields_secret,
          seeHideCell: false,
        }),
      });
    },
  },
  mounted() {
    if (this.userData.id)
      this.hideWithOtherAddress = this.userData.otherAddress.street !== null;
  },
  watch: {
    hideWithOtherAddress(current, old) {
      if (current) this.userData.another_address = 1;
      else this.userData.another_address = 0;
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
