<template>
  <b-modal
    v-model="modalUp"
    size="xmd"
    header-class="p-0"
    header-bg-variant="transparent"
    modal-class="modal-primary"
    scrollable
    @hide="hideModal(false)"
  >
    <template #modal-header>
      <header-modal-notes
        program="Bussiness"
        :info="noteInfo"
        @close="hideModal(false)"
      />
    </template>
    <validation-observer ref="form">
      <b-row>
        <b-col>
          <validation-provider v-slot="{ errors }" name="ein" rules="required">
            <b-form-group label="EIN" label-class="font-weight-bolder">
              <b-form-radio-group
                v-model="note.ein.value"
                :options="note.ein.options"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="businessIdentification"
            rules="required"
          >
            <b-form-group
              label="Business Identification"
              label-class="font-weight-bolder"
            >
              <b-form-radio-group
                v-model="note.businessIdentification.value"
                :options="note.businessIdentification.options"
                :class="{ 'border-danger rounded': errors[0] }"
              />
              <validation-provider
                v-if="note.businessIdentification.value === 'N/A'"
                v-slot="{ errors }"
                name="businessIdentificationOtherValue"
                rules="required"
              >
                <b-form-input
                  v-model="note.businessIdentification.otherValue"
                  class="mt-50"
                  size="sm"
                  :class="{ 'border-danger rounded': errors[0] }"
                />
              </validation-provider>
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col v-if="dateTypeAgreement">
          <validation-provider
            v-slot="{ errors }"
            name="typeOfAgreement"
            rules="required"
          >
            <b-form-group
              label="Type of Agreement"
              label-class="font-weight-bolder"
            >
              <b-form-radio-group
                v-model="note.typeOfAgreement.value"
                :options="note.typeOfAgreement.options"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="typeOfBusiness"
            rules="required"
          >
            <b-form-group
              label="Type of Business"
              label-class="font-weight-bolder"
            >
              <v-select
                v-model="note.typeOfBuisiness.value"
                :disabled="disabled"
                :options="note.typeOfBuisiness.options"
                :class="{ 'border-danger rounded': errors[0] }"
                label="name"
                multiple
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="numberOfEmployees"
            rules="required"
          >
            <b-form-group
              label="Number of Employees"
              label-class="font-weight-bolder"
            >
              <v-select
                v-model="note.numberOfEmployees.value"
                :options="note.numberOfEmployees.options"
                :reduce="(value) => value.value"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="annualIncome"
            rules="required"
          >
            <b-form-group
              label="Annual Income"
              label-class="font-weight-bolder"
            >
              <v-select
                v-model="note.annualIncome.value"
                :options="note.annualIncome.options"
                :reduce="(value) => value.value"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <validation-provider
            v-slot="{ errors }"
            name="newBusiness"
            rules="required"
          >
            <b-form-group
              label-class="font-weight-bolder"
              label="It a New Business?"
            >
              <b-form-radio-group
                v-model="note.newBusiness.value"
                :options="note.newBusiness.options"
                :class="{ 'border-danger': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <transition name="fade">
          <b-col v-if="note.newBusiness.value === 'No'" md="6">
            <validation-provider
              v-slot="{ errors }"
              name="startBusiness"
              rules="required"
            >
              <b-form-group
                label="When did you start your business?"
                label-class="font-weight-bolder"
              >
                <b-form-input
                  v-model="note.newBusiness.startBusiness"
                  :class="{ 'border-danger': errors[0] }"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
        </transition>
        <transition name="fade">
          <b-col v-if="note.newBusiness.value === 'No'" md="6">
            <validation-provider
              v-slot="{ errors }"
              name="businessRegistration"
              rules="required"
            >
              <b-form-group
                label="Have you ever did any registration of your business in the city or county?"
                label-class="font-weight-bolder"
              >
                <b-form-radio-group
                  v-model="note.newBusiness.registration.value"
                  :options="note.newBusiness.registration.options"
                  :class="{ 'border-danger': errors[0] }"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
        </transition>
        <transition name="fade">
          <b-col
            v-if="
              note.newBusiness.value === 'No' &&
              note.newBusiness.registration.value === 'Yes'
            "
            md="6"
          >
            <validation-provider
              v-slot="{ errors }"
              name="registerBusiness"
              rules="required"
            >
              <b-form-group
                label="How did you register your business?"
                label-class="font-weight-bolder"
              >
                <b-form-radio-group
                  v-model="note.newBusiness.registerBusiness.value"
                  :options="note.newBusiness.registerBusiness.options"
                  :class="{ 'border-danger': errors[0] }"
                />
              </b-form-group>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="registerBusinessText"
              rules="required"
            >
              <quill-editor
                v-model="note.newBusiness.registerBusiness.text"
                :disabled="disabled"
                :options="editorOption"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </validation-provider>
          </b-col>
        </transition>
        <b-col md="6">
          <b-form-group label="Origin Country" label-class="font-weight-bolder">
            <v-select
              v-model="note.country.value"
              :clearable="false"
              :disabled="disabled"
              label="name"
              :reduce="(value) => value.id"
              :options="note.country.options"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="information"
            rules="required"
          >
            <b-form-group label="Information" label-class="font-weight-bolder">
              <quill-editor
                v-model="note.information.value"
                :disabled="disabled"
                :options="editorOption"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="indications"
            rules="required"
          >
            <b-form-group label="Indications" label-class="font-weight-bolder">
              <quill-editor
                v-model="note.indications.value"
                :disabled="disabled"
                :options="editorOption"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="suggestions"
            rules="required"
          >
            <b-form-group label="Suggestions" label-class="font-weight-bolder">
              <quill-editor
                v-model="note.suggestion.value"
                :disabled="disabled"
                :options="editorOption"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="pending"
            rules="required"
          >
            <b-form-group label="Pending" label-class="font-weight-bolder">
              <quill-editor
                v-model="note.pending.value"
                :options="editorOption"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
    </validation-observer>
    <template #modal-footer>
      <button-save v-if="showButtonSave" @click="saveNotesIncomplete" />
      <button-save-and-complete
        v-if="showButtonSave"
        @click="saveNotesCompleted"
      />
      <button-update v-if="showButtonUpdate" @click="updateNotesCompleted" />
    </template>
  </b-modal>
</template>

<script>
import { mapActions } from "vuex";
import { quillEditor } from "vue-quill-editor";
import vSelect from "vue-select";
import HeaderModalNotes from "@/views/commons/components/first-notes/HeaderModalNotes.vue";
import NotesServices from "@/views/commons/components/first-notes/services/notes.service";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import ButtonSave from "@/views/commons/utilities/ButtonSave";
import ButtonSaveAndComplete from "@/views/commons/utilities/ButtonSaveAndComplete";
import ButtonUpdate from "@/views/commons/utilities/ButtonUpdate";

export default {
  name: "ModalNotesFirstOld",
  components: {
    ButtonUpdate,
    ButtonSaveAndComplete,
    ButtonSave,
    HeaderModalNotes,
    vSelect,
    quillEditor,
  },
  props: {
    noteInfo: {
      type: Object,
      required: true,
      default: () => ({
        programSelected: "",
        roleId: null,
        notesProgram: null,
        nameProgram: null,
        nameClient: null,
        salesMades: null,
        module: null,
        type: null,
        editModal: false,
        statusSale: null,
        sourcesName: null,
        pack: null,
        created: null,
        originCountry: null,
        idLead: null,
        notSeller: null,
        capturedName: null,
        sellerName: null,
        trackings: null,
        notes_status: null,
        notes_status_new: null,
      }),
    },
  },
  data() {
    return {
      showSave: false,
      showUpdate: false,
      modalUp: false,
      editorOption: {
        modules: { toolbar: false },
      },
      note: {
        ein: {
          value: "",
          options: [
            {
              text: "Yes",
              value: "Yes",
            },
            {
              text: "No",
              value: "No",
            },
          ],
        },
        businessIdentification: {
          value: "",
          otherValue: "",
          options: [
            {
              text: "ITIN",
              value: "ITIN",
            },
            {
              text: "SSN",
              value: "SSN",
            },
            {
              text: "N/A",
              value: "N/A",
            },
          ],
        },
        typeOfAgreement: {
          value: "",
          options: [
            {
              text: "Email",
              value: "Email",
            },
            {
              text: "Ups",
              value: "Ups",
            },
            {
              text: "Voice",
              value: "Voice ",
            },
          ],
        },
        typeOfBuisiness: {
          value: [],
          options: [],
        },
        numberOfEmployees: {
          value: "",
          options: [
            {
              label: "0 - 5",
              value: "0-5",
            },
            {
              label: "6 - 10",
              value: "6-10",
            },
            {
              label: "10 - 20",
              value: "10-20",
            },
            {
              label: "20 - 30",
              value: "20-30",
            },
            {
              label: "30 - 50",
              value: "30-50",
            },
            {
              label: "More than 50 employees",
              value: "more than 50 employees",
            },
          ],
        },
        annualIncome: {
          value: "",
          options: [
            {
              label: "$0 - $10,000",
              value: "$0-$10,000",
            },
            {
              label: "$10,000 - $20,000",
              value: "$10,000-$20,000",
            },
            {
              label: "$20,000 - $30,000",
              value: "$20,000-$30,000",
            },
            {
              label: "$50,000 - $100,000",
              value: "$50,000-$100,000",
            },
            {
              label: "$100,000 - $500,000",
              value: "$100,000-$500,000",
            },
            {
              label: "$500,000 - $1´000,000",
              value: "$500,000-$1´000,000",
            },
            {
              label: "More $1´000,000",
              value: "more $1´000,000",
            },
          ],
        },
        newBusiness: {
          value: "",
          options: [
            {
              text: "Yes",
              value: "Yes",
            },
            {
              text: "No",
              value: "No",
            },
          ],
          startBusiness: "",
          registration: {
            value: "",
            options: [
              {
                text: "Yes",
                value: "Yes",
              },
              {
                text: "No",
                value: "No",
              },
            ],
          },
          registerBusiness: {
            value: "",
            options: [
              {
                text: "FBN",
                value: "FBN",
              },
              {
                text: "LLC",
                value: "LLC",
              },
              {
                text: "INC",
                value: "INC",
              },
            ],
            text: "",
          },
        },
        country: {
          value: null,
          disabled: false,
          options: [],
        },
        information: {
          value: "",
          disabled: false,
        },
        indications: {
          value: "",
          disabled: false,
        },
        suggestion: {
          value: "",
          disabled: false,
        },
        pending: {
          value: "",
        },
      },
      salesCreated: null,
    };
  },
  computed: {
    dateTypeAgreement() {
      return this.noteInfo.created > "2021-08-05";
    },
    disabled() {
      return this.noteInfo.statusSale === 4 || this.noteInfo.notSeller;
    },
    newNote() {
      return this.noteInfo.created > "2021-05-16 00:00:00";
    },
    emptyNote() {
      if (this.newNote) {
        return this.noteInfo.notes_status_new == null;
      }
      return this.noteInfo.notes_status == 0;
    },
    showButtonSave() {
      return this.showSave && !this.noteInfo.notSeller;
    },
    showButtonUpdate() {
      return this.showUpdate && !this.noteInfo.notSeller;
    },
    deployMoment() {
      return this.$moment("2022-03-14");
    },
    isAfterLastDeploy() {
      return this.$moment(this.salesCreated).isAfter(this.deployMoment);
    },
  },
  watch: {
    "note.businessIdentification.value": {
      handler(newValue) {
        if (newValue !== "N/A") {
          this.note.businessIdentification.otherValue = this.note
            .businessIdentification.otherValue
            ? this.note.businessIdentification.otherValue
            : this.note.businessIdentification.otherValue;
        } else if (
          this.note.businessIdentification.otherValue === "0" &&
          newValue === "N/A"
        )
          this.note.businessIdentification.otherValue = "";
      },
      deep: true,
    },
    "note.newBusiness.value": {
      handler(newValue) {
        if (newValue !== "No") {
          this.note.newBusiness.startBusiness = this.note.newBusiness
            .startBusiness
            ? this.note.newBusiness.startBusiness
            : 0;
          this.note.newBusiness.registration.value = this.note.newBusiness
            .registration.value
            ? this.note.newBusiness.registration.value
            : 0;
        }
      },
      deep: true,
    },
    "note.newBusiness.registration.value": {
      handler(newValue) {
        if (newValue !== "Yes") {
          this.note.newBusiness.registerBusiness.value = this.note.newBusiness
            .registerBusiness.value
            ? this.note.newBusiness.registerBusiness.value
            : 0;
          this.note.newBusiness.registerBusiness.text = this.note.newBusiness
            .registerBusiness.text
            ? this.note.newBusiness.registerBusiness.text
            : 0;
        }
      },
      deep: true,
    },
  },
  async created() {
    this.addPreloader();
    await this.getFirstNote();
    await this.listTypeBusiness();
    await this.getCountries();
    this.note.country.value = this.noteInfo.originCountry
      ? this.noteInfo.originCountry
      : 146;
    this.removePreloader();
  },
  methods: {
    ...mapActions({
      A_GET_CREATES_SALE: "CrmGlobalStore/A_GET_CREATES_SALE",
    }),
    async validateCreatesSale() {
      try {
        const response = await this.A_GET_CREATES_SALE(this.noteInfo.saleId);
        if (response.status == 200) {
          this.salesCreated = response.data.creates;
        }
      } catch (error) {
        throw error;
      }
    },
    async saveNotesIncomplete() {
      if (this.emptyNote) {
        await this.saveUpdate("insert");
      } else {
        await this.saveUpdate("update");
      }
    },
    async saveNotesCompleted() {
      const validate = await this.$refs.form.validate();
      if (validate) {
        if (this.emptyNote) {
          await this.saveUpdate("insert");
        } else {
          await this.saveUpdate("update");
        }
      }
    },
    async updateNotesCompleted() {
      const validate = await this.$refs.form.validate();
      if (validate) {
        await this.saveUpdate("update");
      }
    },
    paramsNote() {
      const params = {
        sale_id: this.noteInfo.saleId,
        note: this.answersNote(),
        originCountry: this.note.country.value,
        idLead: this.noteInfo.idLead,
      };
      return params;
    },
    async saveUpdate(type) {
      const swal = await this.showConfirmSwal();
      if (swal.isConfirmed) {
        this.addPreloader();
        try {
          const service =
            type == "insert" ? "insertFirstNote" : "updateFirstNote";
          await NotesServices[service](this.paramsNote());
          this.hideModal(true);
        } catch (error) {
          console.log(error);
          this.removePreloader();
          this.showErrorSwal(error);
        }
      }
    },

    answersNote() {
      return [
        { number: 1002, value: this.note.businessIdentification.value },
        { number: 1012, value: this.note.information.value },
        { number: 1013, value: this.note.indications.value },
        { number: 1014, value: this.note.suggestion.value },
        { number: 1015, value: this.note.pending.value },
        {
          number: 1063,
          value: this.dateTypeAgreement ? this.note.typeOfAgreement.value : 1,
        },
        { number: 1004, value: this.note.typeOfBuisiness.value },
        { number: 1005, value: this.note.numberOfEmployees.value },
        { number: 1006, value: this.note.annualIncome.value },
        { number: 1068, value: this.note.indications.value },
        { number: 1001, value: this.note.ein.value },
        { number: 1007, value: this.note.newBusiness.value },
        { number: 1008, value: this.note.newBusiness.startBusiness },
        { number: 1009, value: this.note.newBusiness.registration.value },
        { number: 1010, value: this.note.newBusiness.registerBusiness.value },
        { number: 1011, value: this.note.newBusiness.registerBusiness.text },
        {
          number: 1003,
          value: this.note.businessIdentification.otherValue
            ? this.note.businessIdentification.otherValue
            : 0,
        },
      ];
    },
    hideModal(status) {
      this.modalUp = false;
      this.$emit("hide", status);
    },
    async getCountries() {
      try {
        const response = await amgApi.post("/commons/get-world-countrys", {});
        this.note.country.options = response.data;
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
    async listTypeBusiness() {
      try {
        const response = await amgApi.post("/commons/get-all-type-business");
        this.note.typeOfBuisiness.options = response.data;
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
    getDetailsAnswers(note) {
      note.forEach((answer) => {
        if (answer.answer != "null") {
          if (answer.question_id === 1002)
            this.note.businessIdentification.value = answer.answer;
          if (answer.question_id === 1003)
            this.note.businessIdentification.otherValue = answer.answer;
          if (answer.question_id === 1012)
            this.note.information.value = answer.answer;
          if (answer.question_id === 1013)
            this.note.indications.value = answer.answer;
          if (answer.question_id === 1014)
            this.note.suggestion.value = answer.answer;
          if (answer.question_id === 1015)
            this.note.pending.value = answer.answer;
          if (answer.question_id === 1063)
            this.note.typeOfAgreement.value = answer.answer;
          if (answer.question_id === 1004)
            this.note.typeOfBuisiness.value = JSON.parse(answer.answer);
          if (answer.question_id === 1005)
            this.note.numberOfEmployees.value = answer.answer;
          if (answer.question_id === 1006)
            this.note.annualIncome.value = answer.answer;
          if (answer.question_id === 1068)
            this.note.indications.value = answer.answer;
          if (answer.question_id === 1001) this.note.ein.value = answer.answer;
          if (answer.question_id === 1007)
            this.note.newBusiness.value = answer.answer;
          if (answer.question_id === 1008)
            this.note.newBusiness.startBusiness = answer.answer;
          if (answer.question_id === 1009)
            this.note.newBusiness.registration.value = answer.answer;
          if (answer.question_id === 1010)
            this.note.newBusiness.registerBusiness.value = answer.answer;
          if (answer.question_id === 1011)
            this.note.newBusiness.registerBusiness.text = answer.answer;
        } else this.noteNull = true;
      });
    },
    initialValidationNote(note) {
      if (note.length != 0 && this.noteInfo.statusSale != 4 && !this.noteNull) {
        this.showUpdate = true;
      } else if (this.noteInfo.editmodal == false) {
        this.showSave = false;
        this.showUpdate = false;
      } else if (note.length == 0 || this.noteNull) {
        this.showSave = true;
      }
    },
    async getFirstNote() {
      try {
        const params = { sale_id: this.noteInfo.saleId };
        const response = await NotesServices.getFirstNote(params);
        this.getDetailsAnswers(response);
        await this.initialValidationNote(response);
        this.modalUp = true;
        this.removePreloader();
      } catch (error) {
        this.modalUp = false;
        this.showErrorSwal(error);
        this.removePreloader();
      }
    },
  },
};
</script>

<style scoped>
.quill-editor {
  height: 100px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
