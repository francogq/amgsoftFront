<template>
  <b-card>
    <template #header>
      <b-card-title>
        <div>Personal Information</div>
        <div>
          <b-badge :variant="statusVariant" style="padding-top: 10px">
            {{ personalInfo.valueStatus ? personalInfo.valueStatus : "CLIENT" }}
          </b-badge>
        </div>
        <div>
          <template v-if="editPersonal">
            <b-button
              size="sm"
              variant="outline-danger"
              title="Cancel Edit"
              class="mr-1"
              @click="cancelInformationEdit(1)"
            >
              <feather-icon icon="TrashIcon" class="mr-50"></feather-icon>
              Cancel
            </b-button>
            <b-button
              v-show="editPersonal"
              size="sm"
              variant="primary"
              title="Update Personal Information"
              @click="updateInformation(1)"
            >
              <feather-icon icon="CheckIcon" class="mr-50"></feather-icon>
              Update
            </b-button>
          </template>
          <b-button-group v-show="!editPersonal">
            <b-button
              size="sm"
              variant="default"
              class="btn-icon"
              title="Edit Personal Information"
              @click="activateInformationEdit(1)"
            >
              <feather-icon icon="SettingsIcon" size="18"></feather-icon>
            </b-button>
            <b-button
              v-if="lead.status_sn_id && lead.status_sn_id != 2 && modul === 15"
              size="sm"
              v-b-tooltip.hover.bottom="'Not Call'"
              variant="default"
              class="btn-icon"
              @click="onNotCall"
            >
              <amg-icon icon="PhoneSlashIcon" size="18" />
            </b-button>
            <b-button
              v-if="
                lead.status_sn_id &&
                modul === 15 &&
                lead.not_call &&
                lead.not_call.length
              "
              size="sm"
              v-b-tooltip.hover.bottom="'Tracking Not Call'"
              variant="default"
              class="btn-icon"
              @click="$bvModal.show('modal-trackin-not-call')"
            >
              <amg-icon icon="ThListIcon" size="18" />
            </b-button>
          </b-button-group>
        </div>
      </b-card-title>
    </template>
    <validation-observer ref="form" tag="b-card">
      <b-row class="ml-xl-2 ml-lg-2 ml-md-2 ml-sm-0 ml-0 mt-1">
        <b-col md="6">
          <standar-form-group label="Nickname" :disabled="!editPersonal">
            <b-form-input
              v-model.trim="personalInfo.nickname"
              :placeholder="startTypingP"
              type="text"
              :class="['bg-color-white', 'font-bureau-style', borderNickname]"
              :disabled="!editPersonal"
            ></b-form-input>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Phone(M)" :disabled="!editPersonal">
            <b-input-group>
              <b-form-input
                v-model="personalMobile.phonem"
                :placeholder="startTypingM"
                v-mask="'(###) ###-####'"
                :disabled="!editMobile"
              />
              <b-input-group-append class="border-right" v-if="editMobile">
                <b-button
                  variant="outline-primary"
                  class="btn-icon"
                  @click="updateInformation(3)"
                >
                  <feather-icon icon="SaveIcon" class="cursor-pointer" />
                </b-button>
              </b-input-group-append>
              <b-input-group-append>
                <b-button
                  v-if="!editMobile"
                  variant="outline-warning"
                  class="btn-icon"
                  @click="activateInformationEdit(3)"
                >
                  <feather-icon icon="Edit2Icon" class="cursor-pointer" />
                </b-button>
                <b-button
                  v-if="editMobile"
                  variant="outline-danger"
                  class="btn-icon"
                  @click="cancelInformationEdit(3)"
                >
                  <feather-icon icon="TrashIcon" class="cursor-pointer" />
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
            </b-input-group>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Name" :disabled="!editPersonal">
            <b-form-input
              v-model.trim="personalInfo.name"
              :placeholder="startTypingP"
              type="text"
              :class="['bg-color-white', 'font-bureau-style']"
              :disabled="!editPersonal"
            ></b-form-input>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="ST/AD" :disabled="!editPersonal">
            <v-select
              v-model="personalInfo.stateAd"
              :options="optionsStatesAd"
              :disabled="!editPersonal"
              :reduce="(el) => el.value"
            ></v-select>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Lastname" :disabled="!editPersonal">
            <b-form-input
              v-model.trim="personalInfo.last_name"
              :placeholder="startTypingP"
              type="text"
              class="bg-color-white font-bureau-style"
              :disabled="!editPersonal"
            ></b-form-input>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Status" :disabled="!editPersonal">
            <v-select
              v-model="personalInfo.status"
              :options="optionsStatus"
              :disabled="!editPersonal"
              :reduce="(el) => el.value"
            ></v-select>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="DOB" :disabled="!editPersonal">
            <b-form-input
              type="date"
              v-model="personalInfo.dob"
              :disabled="!editPersonal"
            ></b-form-input>
            <!-- <b-form-datepicker
              class="bg-color-white font-bureau-style"
              :disabled="!editPersonal"
              v-model="personalInfo.dob"
            ></b-form-datepicker> -->
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <validation-provider rules="valid-document" v-slot="{ errors }">
            <b-form-group
              id="fieldset-horizontal"
              label-class="p-0"
              label-for="input-horizontal"
              label-cols-lg="3"
              label-cols-md="4"
              label-cols-sm="3"
              label-cols="6"
              content-cols-lg="8"
              content-cols-md="7"
              content-cols-sm="12"
              content-cols="12"
            >
              <template #label>
                <v-select
                  v-model="personalInfo.document"
                  :options="optionsDocuments"
                  class="
                    select-icon-none
                    bg-color-white
                    pl-0
                    pr-2
                    font-bureau-style
                    mb-xl-0 mb-lg-0 mb-md-0 mb-sm-1 mb-1
                    mt-xl-0 mt-lg-0 mt-md-0 mt-sm-1 mt-1
                  "
                  :disabled="!editPersonal"
                  :clearable="false"
                  :reduce="(el) => el.value"
                ></v-select>
              </template>
              <b-input-group >
                <b-form-input
                  v-model="personalInfo.numberDocument"
                  :placeholder="startTypingP"
                  v-if="showDocument || emptyDocument"
                  class="font-bureau-style border-document"
                  v-mask="'###-##-####'"
                  :disabled="
                    (!editPersonal || !isCeoOrSupervisorOrTeamLeader) &&
                    (!emptyDocument || !editPersonal)
                  "
                  :state="errors[0] ? false : null"
                />
                <input
                  :placeholder="startTypingP"
                  type="text"
                  class="form-control border-document"
                  style="padding-top: 7px"
                  v-else
                  disabled
                  :value="personalInfo.numberDocumentEnc"
                />

                <b-input-group-append>
                  <b-button
                    :disabled="!isCeoOrSupervisorOrTeamLeader || editPersonal"
                    variant="outline-primary"
                    class="btn-icon"
                    @click="showDocument = !showDocument"
                  >
                    <feather-icon
                      icon="EyeIcon"
                      v-if="showDocument"
                    ></feather-icon>
                    <feather-icon icon="EyeOffIcon" v-else></feather-icon>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-invalid-feedback>
              {{ errors[0] }}
            </b-form-invalid-feedback>
          </validation-provider>
        </b-col>
        <b-col md="6">
          <standar-form-group label="E-mail" :disabled="!editPersonal">
            <b-form-input
              v-model="personalInfo.email"
              :placeholder="startTypingP"
              type="email"
              class="bg-color-white font-bureau-style"
              :disabled="!editPersonal"
            ></b-form-input>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Origin Country" :disabled="!editPersonal">
            <v-select
              v-model="personalInfo.origin_country"
              :options="optionsOriginCountrys"
              class="select-icon-none bg-color-white font-bureau-style"
              :placeholder="startTypingP"
              :disabled="!editPersonal"
              :reduce="(el) => el.value"
            ></v-select>
          </standar-form-group>
        </b-col>
        <b-col md="6">
          <standar-form-group label="Language" :disabled="!editPersonal">
            <v-select
              v-model="personalInfo.language"
              :options="optionsLanguage"
              class="select-icon-none bg-color-white font-bureau-style"
              :disabled="!editPersonal"
              :reduce="(el) => el.value"
            ></v-select>
          </standar-form-group>
        </b-col>
      </b-row>
    </validation-observer>

    <b-modal
      id="modal-trackin-not-call"
      ok-only
      modal-class="modal-primary"
      centered
      size="lg"
      :title="`TRACKING NOT CALL - ${lead.lead_name}`"
      hide-footer
      no-close-on-backdrop
    >
      <modal-trackin-not-call :modul="modul" :lead="lead" />
    </b-modal>

    <b-modal
      id="modal-tracking-change"
      ok-only
      modal-class="modal-primary"
      centered
      size="lg"
      :title="`Tracking Change ${titleTrackingChange}`"
      hide-footer
    >
      <tracking-change-component
        :lead="lead"
        :items="itemsTrackingChange"
        :name="titleTrackingChange"
        :is-busy="isBusyTrackingChange"
      />
    </b-modal>
  </b-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { mask } from "vue-the-mask";

// Components
import vSelect from "vue-select";
import StandarFormGroup from "@/views/social-network/views/leads/components/StandarFormGroup.vue";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import ModalTrackinNotCall from "@/views/crm/views/Lead/lead-module/dashboard/ModalTrackinNotCall.vue";
import TrackingChangeComponent from "@/views/crm/views/Lead/lead-module/save/TrackingChangeComponent.vue";

// Services
import SNLeadsService from "@/views/social-network/services/leads";
import globalService from "@/service/global";

export default {
  props: {
    modul: {
      type: Number,
    },
    lead: {
      type: Object,
    },
    personalInfo: {
      type: Object,
      default: () => ({}),
    },
    personalAddress: {
      type: Object,
      default: () => ({}),
    },
    personalMobile: {
      type: Object,
      default: () => ({}),
    },
    requiredFieldsForCreateCrmTask: {
      type: Object,
      default: () => ({}),
    },
    dataAlreadyLoaded: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    vSelect,
    VueGoogleAutocomplete,
    StandarFormGroup,
    ModalTrackinNotCall,
    TrackingChangeComponent,
  },
  directives: {
    mask: (el, binding) => {
      if (!binding.value) return;
      mask(el, binding);
    },
  },
  data() {
    return {
      editPersonal: false,
      editAddress: false,
      editMobile: false,
      repeatNickname: false,
      formatDate: {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      },
      returnInformation: {},
      returnAddress: {},
      returnMobile: {},
      //Options
      optionsStates: [],
      optionsStatus: [],
      optionsOriginCountrys: [],
      optionsStatesAd: [],
      optionsDocuments: [
        { label: "Document", value: null, disabled: true },
        { label: "SSN", value: 1 },
        { label: "ITIN", value: 2 },
        { label: "CPN", value: 3 },
      ],

      optionsLanguage: [
        { label: "Select an option ", value: 0, disabled: true },
        { label: "Spanish", value: "ES" },
        { label: "English", value: "EN" },
      ],
      options: [
        { text: "Select an option ", value: 0, disabled: true },
        { text: "New", value: "new" },
        { text: "In Process", value: "in_process" },
        { text: "Closed", value: "closed" },
      ],
      showDocument: false,
      emptyDocument: false,

      itemsTrackingChange: [],
      isBusyTrackingChange: false,
      titleTrackingChange: "",
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    isDarkTheme() {
      return this.$store.state.appConfig.layout.skin == "dark";
    },
    /* Styles */
    statusVariant() {
      return this.editPersonal ? "info" : "warning";
    },
    //Styles Nickname
    borderNickname() {
      return this.editPersonal && this.repeatNickname ? "border-danger" : "";
    },
    /* Placheholders */
    startTypingP() {
      return this.editPersonal ? "Start typing..." : "";
    },
    startTypingM() {
      return this.editMobile ? "Start typing..." : "";
    },
    isCeoOrSupervisorOrTeamLeader() {
      return [1, 2, 11].includes(this.currentUser.role_id);
    },
  },
  methods: {
    ...mapActions({
      A_CHANGE_STATUS_SN: "CrmLeadStore/A_CHANGE_STATUS_SN",
      A_GET_ALL_TRAKING_FIELDS_LEAD:
        "CrmLeadStore/A_GET_ALL_TRAKING_FIELDS_LEAD",
    }),
    getEmptyDocument() {
      this.emptyDocument =
        this.personalInfo.numberDocument == null ? true : false;
    },
    async activateInformationEdit(type) {
      //type 1 personal information
      //type 2 address
      //type 3 mobile

      let message =
        type == 1 ? "information" : type == 2 ? "address" : "mobile";

      const confirm = await this.showConfirmSwal(
        "Are you sure",
        `Do you want to edit the ${message}?`
      );

      if (confirm.value) {
        if (type == 1) {
          this.returnInformation = JSON.parse(
            JSON.stringify(this.personalInfo)
          );
          this.editPersonal = true;
          if (this.isCeoOrSupervisorOrTeamLeader) {
            this.showDocument = true;
          }
        } else if (type == 2) {
          this.returnAddress = JSON.parse(JSON.stringify(this.personalAddress));
          this.editAddress = true;
        } else if (type == 3) {
          this.returnMobile = JSON.parse(JSON.stringify(this.personalMobile));
          this.editMobile = true;
        }
      }
    },
    async cancelInformationEdit(type) {
      const confirm = await this.showConfirmSwal(
        "Are you sure?",
        "Changes will be lost"
      );

      if (confirm.value) {
        if (type == 1) {
          this.personalInfo = this.returnInformation;
          this.editPersonal = false;
        } else if (type == 2) {
          this.personalAddress = this.returnAddress;
          this.editAddress = false;
        } else if (type == 3) {
          this.personalMobile = this.returnMobile;
          this.editMobile = false;
        }
      }
    },
    async updateInformation(type) {
      const validate = await this.$refs.form.validate();
      if (validate) {
        try {
          let message =
            type == 1 ? "information" : type == 2 ? "address" : "mobile";

          const confirm = await this.showConfirmSwal(
            "Are you sure?",
            `The ${message} will be save!`
          );

          if (confirm.value) {
            this.addPreloader();
            let params = {};

            if (type == 1) {
              switch (this.personalInfo.document) {
                case 1:
                  this.personalInfo.ssn = this.personalInfo.numberDocument;
                  break;
                case 2:
                  this.personalInfo.itin = this.personalInfo.numberDocument;
                  break;
                case 3:
                  this.personalInfo.other = this.personalInfo.numberDocument;
                  break;
              }
              this.personalInfo.numberDocumentEnc = this.personalInfo
                .numberDocument
                ? "XXX-XX-" +
                  this.personalInfo.numberDocument.substring(
                    this.personalInfo.numberDocument.length - 4
                  )
                : null;
              params = this.personalInfo;
              this.getEmptyDocument();
              this.showDocument = false
            } else if (type == 2) {
              params = this.personalAddress;
            } else if (type == 3) {
              params = this.personalMobile;
            }

            this.updateFunction(params, type);
          }
        } catch (error) {
          throw error;
        }
      }
    },
    async updateFunction(params, type) {
      this.addPreloader();
      try {
        const response =
          type == 1
            ? await SNLeadsService.postUpdateLeadInformation(params)
            : await SNLeadsService.postUpdateLeadInformationFields(params);

        if (response.status == 200) {
          this.removePreloader();

          this.showGenericToast({
            title: "Updated",
            text: "Information was saved",
          });
          this.lead.first_name = response.data[0].first_name;
          this.lead.last_name = response.data[0].last_name;

          this.lead.lead_name =
            (response.data[0].first_name ? response.data[0].first_name : "") +
            " " +
            (response.data[0].last_name ? response.data[0].last_name : "");
          this.requiredFieldsForCreateCrmTask.first_name =
            response.data[0].first_name;
          this.requiredFieldsForCreateCrmTask.last_name =
            response.data[0].last_name;
          this.requiredFieldsForCreateCrmTask.mobile = response.data[0].mobile;
          this.requiredFieldsForCreateCrmTask.state = response.data[0].state;
          if (type == 1) {
            this.editPersonal = false;
            this.returnInformation = JSON.parse(
              JSON.stringify(this.personalInfo)
            );
          } else if (type == 2) {
            this.editAddress = false;
            this.returnAddress = JSON.parse(
              JSON.stringify(this.personalAddress)
            );
          } else if (type == 3) {
            this.editMobile = false;
            this.returnMobile = JSON.parse(JSON.stringify(this.personalMobile));
          }

          this.repeatNickname = false;
        }
      } catch (error) {
        this.removePreloader();
        this.showErrorSwal(
          "The information could not be saved, contact support or try again"
        );
      }
    },
    onNotCall() {
      this.showConfirmSwal("Your lead not responding to you?")
        .then(async (result) => {
          if (result.value) {
            this.isLoading = true;
            const specialist = `${this.currentUser.first_name} ${this.currentUser.last_name}`;

            // Have just the first program of a string
            let program = "";
            if (this.lead.lead_programs) {
              const programs = this.lead.name_programs;
              program = programs.split(",")[0];
            }
            const response = await this.A_CHANGE_STATUS_SN({
              lead_id: this.lead.id,
              status_id: 4,
              specialist,
              user_id: this.currentUser.user_id,
              language: this.lead.language,
              lead_name: this.lead.last_name,
              modul_id: this.currentUser.modul_id,
              program,
            });
            if (this.isResponseSuccess(response)) {
              this.lead.not_call = JSON.stringify(response.data);
              this.personalInfo.valueStatus = "RECOVERY";
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
              this.$emit("reloadLead");
            } else
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                `Something went wrong. ${response.message}`
              );
            this.isLoading = false;
          }
        })
        .catch((error) => {
          console.log("spmething went wrong onNotCall: ", error);
          this.showToast(
            "danger",
            "top-right",
            "Oop!",
            "AlertOctagonIcon",
            this.getInternalErrors(error)
          );
        });
    },
    capitalize(text) {
      return text.substr(0, 1).toUpperCase() + text.substr(1);
    },
    //Get Options Selects
    async statesAD() {
      try {
        let statesAd = await globalService.getStates({ type: 1 });
        statesAd.data.forEach((state) => {
          this.optionsStatesAd.push({ label: state.state, value: state.slug });
        });
      } catch (error) {
        console.log(error);
      }
    },
    async stateseeuu() {
      try {
        const response = await globalService.getStatesEEuu();

        response.data.map((item) => {
          this.optionsStates.push({ label: item.state, value: item.slug });
        });

        this.optionsStates.unshift({
          label: "Select an option",
          value: 0,
          disabled: true,
        });
      } catch (error) {
        throw error;
      }
    },
    async statusleads() {
      try {
        const response = await globalService.getStatusLead();

        response.data.map((item) => {
          this.optionsStatus.push({
            label: item.name,
            value: item.id,
          });
        });

        this.optionsStatus.unshift({
          label: "Select an option",
          value: 0,
          disabled: true,
        });
      } catch (error) {
        throw error;
      }
    },
    async getCountrys() {
      try {
        const response = await globalService.getCountries();

        response.data.map((item) => {
          this.optionsOriginCountrys.push({
            label: item.name,
            value: item.id,
          });
        });

        this.optionsOriginCountrys.unshift({
          label: "Select an option",
          value: 0,
          disabled: true,
        });
      } catch (error) {
        throw error;
      }
    },
    async validateMobile(mobile) {
      try {
        const validate = await SNLeadsService.verifyMobile({
          mobile: mobile,
        });

        if (validate.status == 200) {
          if (validate.data.error_code == "MOBILE_EXISTS") {
            const verifyMobile = await this.showConfirmSwal(
              "The phone number already exists: " + validate.data.message,
              "",
              {
                confirmButtonText: "OPEN LEAD",
              }
            );

            if (verifyMobile.value) {
              window.open(
                "/social-network/leads/new/dashboard/" + validate.data.lead_id,
                "_blank"
              );
            }
          }
        }
      } catch (error) {
        throw error;
      }
    },
    async validateNickname(nickname) {
      try {
        const validate = await SNLeadsService.validateNickname({
          nickname: nickname,
          lead_id: null,
        });

        if (validate.data.code == 1) {
          this.showWarningSwal(
            "The Nickname already exists: " + validate.data.message,
            ""
          );

          this.repeatNickname = true;
        } else {
          this.repeatNickname = false;
        }
      } catch (error) {
        throw error;
      }
    },
    onModalTrackingChangeOpen(type, name) {
      this.openModalTrackingChange({
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
    async openModalTrackingChange(attribute) {
      try {
        this.titleTrackingChange = attribute.name;
        this.$bvModal.show("modal-tracking-change");
        this.isBusyTrackingChange = true;
        const response = await this.A_GET_ALL_TRAKING_FIELDS_LEAD({
          id_lead: this.lead.id,
          typee: attribute.type,
          id_module: this.modul,
        });
        if (this.isResponseSuccess(response)) {
          this.itemsTrackingChange = response.data.map(attribute.mapFunction);
        } else {
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            "Something went wrong."
          );
        }
        this.isBusyTrackingChange = false;
      } catch (error) {
        console.log("spmething went wrong onModalTrackingChangeOpen: ", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isBusyTrackingChange = false;
      }
    },
  },
  watch: {
    "personalMobile.phonem"(newValue) {
      if (newValue.length === 14 && (this.editPersonal || this.editMobile)) {
        this.validateMobile(newValue);
      }
    },
    "personalInfo.nickname"(newValue) {
      if (this.editPersonal) {
        this.validateNickname(newValue);
      }
    },
    "personalInfo.name"(newValue) {
      this.personalInfo.name = this.capitalize(newValue);
    },
    "personalInfo.last_name"(newValue) {
      this.personalInfo.last_name = this.capitalize(newValue);
    },
     "dataAlreadyLoaded"() {
      this.emptyDocument = this.personalInfo.numberDocument == null ? true : false;
    },
    editPersonal(newValue) {
      //Selects PlaceHolders
      if (newValue) {
        this.personalInfo.status = this.personalInfo.status
          ? this.personalInfo.status
          : 0;
        this.personalInfo.origin_country = this.personalInfo.origin_country
          ? this.personalInfo.origin_country
          : 0;
        this.personalInfo.language = this.personalInfo.language
          ? this.personalInfo.language
          : 0;
      } else {
        this.personalInfo.status = this.personalInfo.status
          ? this.personalInfo.status
          : null;
        this.personalInfo.origin_country = this.personalInfo.origin_country
          ? this.personalInfo.origin_country
          : null;
        this.personalInfo.language = this.personalInfo.language
          ? this.personalInfo.language
          : null;
      }
    },
    editAddress(newValue) {
      //Selects PlaceHolders
      if (newValue) {
        this.personalAddress.state = this.personalAddress.state
          ? this.personalAddress.state
          : 0;
      } else {
        this.personalAddress.state = this.personalAddress.state
          ? this.personalAddress.state
          : null;
      }
    },
  },
  created() {
    this.statesAD();
    this.stateseeuu();
    this.statusleads();
    this.getCountrys();
  },
  mounted() {
    this.getEmptyDocument();
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  div:nth-child(1) {
    width: 30%;
    font-weight: 600;
    flex-shrink: 12;
  }

  div:nth-child(2) {
    width: 40%;
    display: flex;
    justify-content: center;
  }

  div:nth-child(3) {
    width: 30%;
    display: flex;
    justify-content: end;
  }
}

@media screen and(max-width: 500px) {
  .card-title {
    div:nth-child(1) {
      width: 50%;
    }

    div:nth-child(2) {
      width: 100%;
      margin-top: 15px;
      margin-bottom: -20px;
      order: 3;
    }

    div:nth-child(3) {
      width: 50%;
    }
  }
}

.mr-05 {
  margin-right: 5px;
}

.w-95 {
  width: 95%;
}

.b-form-datepicker .dropdown-menu {
  width: 20rem !important;
}
.w-pre {
  width: 32% !important;
}
.w-100 {
  width: 100% !important;
}

.w-15 {
  width: 15.5% !important;
}

.padding-little-icons {
  padding: 0px 4px;
  width: 21px;
  height: 23px;
}

.padding-little-icons-cancel {
  padding: 0px 5.5px;
  width: 21px;
  height: 23px;
}
.position-litlle-icons {
  position: absolute;
  right: 1rem;
  top: 0.3rem;
}
.border-hover-p:hover {
  border: 2px solid #7000ff !important;
}

.border-hover-a:hover {
  border: 2px solid #7000ff !important;
}
.border-hover-m:hover {
  border: 2px solid #7000ff !important;
}

.orange-color-sn {
  background: linear-gradient(75.42deg, #fc482a 24.3%, #f96951 99.88%);
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.purple-color-sn {
  background: linear-gradient(
    75.42deg,
    #6943e6 24.3%,
    #8a67ff 99.88%,
    #7a6aad 99.88%
  );
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  transform: matrix(1, 0, 0, 1, 0, 0);
}

.size-icon {
  width: 20.28px;
}
.size-little-icon {
  width: 14.28px;
}

.radius-prepend-eye {
  border-radius: 0px 4px 4px 0px !important;
}
.border-document {
  border-radius: 4px 0px 0px 4px !important;
}
</style>
