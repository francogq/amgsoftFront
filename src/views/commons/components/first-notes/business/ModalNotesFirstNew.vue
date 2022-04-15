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
        <b-col cols="4">
          <b-form-group label="Tax ID">
            <validation-provider
              v-slot="{ errors }"
              name="taxId"
              rules="required"
            >
              <v-select
                :options="note.taxId.options"
                :disabled="disabled"
                :clearable="false"
                v-model="note.taxId.value"
                :class="{ 'border-danger rounded': errors.length > 0 }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group label="Contact Time">
            <validation-provider
              v-slot="{ errors }"
              name="contactTime"
              rules="required"
            >
              <v-select
                :options="note.contactTime.options"
                :disabled="disabled"
                :clearable="false"
                v-model="note.contactTime.value"
                :class="{ 'border-danger rounded': errors.length > 0 }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group label="Work Status">
            <validation-provider
              v-slot="{ errors }"
              name="workStatus"
              rules="required"
            >
              <v-select
                :options="note.workStatus.options"
                :disabled="disabled"
                v-model="note.workStatus.value"
                :clearable="false"
                :class="{ 'border-danger rounded': errors.length > 0 }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group label="Type of Business">
            <validation-provider
              v-slot="{ errors }"
              name="typeOfBusiness"
              rules="required"
            >
              <v-select
                :options="note.typeOfBuisiness.options"
                :disabled="disabled"
                :clearable="false"
                v-model="note.typeOfBuisiness.value"
                :class="{ 'border-danger rounded': errors.length > 0 }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group label="Emergency Contact">
            <validation-provider
              v-slot="{ errors }"
              name="emergencyContact"
              rules="required"
            >
              <b-form-input
                v-model="note.emergencyContact.value"
                :disabled="disabled"
                :class="{ 'border-danger rounded': errors.length > 0 }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group label="Is It New?">
            <validation-provider
              v-slot="{ errors }"
              name="isItNew"
              rules="required"
            >
              <v-select
                :options="note.isItNew.options"
                :disabled="disabled"
                :clearable="false"
                v-model="note.isItNew.value"
                :class="{ 'border-danger rounded': errors.length > 0 }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="6" v-if="note.isItNew.value === 'NO'">
          <b-form-group label="Have The Client Registered His/Her Business?">
            <validation-provider
              v-slot="{ errors }"
              name="registeredBusiness"
              rules="required"
            >
              <v-select
                :options="note.registeredBusiness.options"
                :disabled="disabled"
                :clearable="false"
                v-model="note.registeredBusiness.value"
                :class="{ 'border-danger rounded': errors.length > 0 }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col
          cols="6"
          v-if="
            note.isItNew.value === 'NO' &&
            note.registeredBusiness.value === 'YES'
          "
        >
          <b-form-group label="How did the client register it?">
            <validation-provider
              v-slot="{ errors }"
              name="howDidTheClientRegistered"
              rules="required"
            >
              <v-select
                :options="note.howDidTheClientRegistered.options"
                :disabled="disabled"
                :clearable="false"
                v-model="note.howDidTheClientRegistered.value"
                :class="{ 'border-danger rounded': errors.length > 0 }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col
          cols="6"
          v-if="
            note.isItNew.value === 'NO' &&
            note.registeredBusiness.value === 'YES'
          "
        >
          <b-form-group label="Company Name">
            <validation-provider
              v-slot="{ errors }"
              name="companyName"
              rules="required"
            >
              <b-form-input
                v-model="note.companyName.value"
                :disabled="disabled"
                :class="{ 'border-danger rounded': errors.length > 0 }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="What does the client need?">
            <validation-provider
              v-slot="{ errors }"
              name="whatDoesTheClientNeed"
              rules="required"
            >
              <quill-editor
                v-model="note.whatDoesTheClientNeed.value"
                :disabled="disabled"
                :options="editorOption"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="What did you suggest and recommend?">
            <validation-provider
              v-slot="{ errors }"
              name="whatDidYouSuggest"
              rules="required"
            >
              <quill-editor
                v-model="note.whatDidYouSuggest.value"
                :disabled="disabled"
                :options="editorOption"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Is there eny indication for the advisor?">
            <validation-provider
              v-slot="{ errors }"
              name="isAnyIndicator"
              rules="required"
            >
              <quill-editor
                v-model="note.isAnyIndicator.value"
                :disabled="disabled"
                :options="editorOption"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <validation-provider
            v-slot="{ errors }"
            name="pending"
            rules="required"
          >
            <b-form-group label="Pending">
              <b-form-checkbox-group
                v-model="note.pendingValue"
                :options="note.pending.options"
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
  name: "ModalNotesFirstNew",
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
  components: {
    ButtonUpdate,
    ButtonSaveAndComplete,
    ButtonSave,
    HeaderModalNotes,
    vSelect,
    quillEditor,
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
        taxId: {
          value: "",
          options: ["SSN", "ITIN", "ENROLLED IN TAX RESEARCH"],
        },
        contactTime: {
          value: "",
          options: [
            "8:00-9:00",
            "9:00-10:00",
            "10:00-11:00",
            "11:00-12:00",
            "12:00-13:00",
            "13:00-14:00",
          ],
        },
        workStatus: {
          value: "",
          options: [
            "EMPLOYED",
            "UNEMPLOYED",
            "SOLE PROPRIETOR",
            "LLC OWNER",
            "INC OWNER",
          ],
        },
        typeOfBuisiness: {
          value: "",
          options: [
            "CONSTRUCTION",
            "RENTAL & LEASING",
            "TRANSPORTATION",
            "HEALTHCARE",
            "WHOLESALE AGENT",
            "BROKER",
            "RETEAIL SALES",
            "REAL ESTATE",
            "MANUFACTURING",
            "FINANCE & INSURANCE",
            "SERVICES",
          ],
        },
        emergencyContact: {
          value: "",
        },
        isItNew: {
          value: "",
          options: ["YES", "NO"],
        },
        registeredBusiness: {
          value: "",
          options: ["YES", "NO"],
        },
        howDidTheClientRegistered: {
          value: "",
          options: ["FBN", "LLC", "INCORPORATION", "SOLE PROPIETOR"],
        },
        companyName: {
          value: "",
        },
        whatDoesTheClientNeed: {
          value: "",
        },
        whatDidYouSuggest: {
          value: "",
        },
        isAnyIndicator: {
          value: "",
        },
        pendingValue: [],
        pending: {
          options: ["ID", "UB"],
        },
      },
      salesCreated: null,
    };
  },
  computed: {
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
    "note.isItNew.value": {
      handler(newValue) {
        if (newValue === "YES" || !newValue) {
          this.note.registeredBusiness.value = "0";
          this.note.howDidTheClientRegistered.value = "0";
          this.note.companyName.value = "0";
        } else if (newValue === "NO") {
          this.note.registeredBusiness.value =
            this.note.registeredBusiness.value !== "0"
              ? this.note.registeredBusiness.value
              : "";
        }
      },
      deep: true,
    },
    "note.registeredBusiness.value": {
      handler(newValue) {
        if (newValue === "NO" || !newValue) {
          this.note.howDidTheClientRegistered.value = "0";
          this.note.companyName.value = "0";
        } else if (newValue === "YES") {
          this.note.howDidTheClientRegistered.value =
            this.note.howDidTheClientRegistered.value !== "0"
              ? this.note.howDidTheClientRegistered.value
              : "";
          this.note.companyName.value =
            this.note.companyName.value !== "0"
              ? this.note.companyName.value
              : "";
        }
      },
      deep: true,
    },
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
        { number: 2001, value: this.note.taxId.value },
        { number: 2002, value: this.note.contactTime.value },
        { number: 2003, value: this.note.workStatus.value },
        { number: 2004, value: this.note.typeOfBuisiness.value },
        { number: 2005, value: this.note.emergencyContact.value },
        { number: 2006, value: this.note.isItNew.value },
        { number: 2007, value: this.note.registeredBusiness.value },
        { number: 2008, value: this.note.howDidTheClientRegistered.value },
        { number: 2009, value: this.note.companyName.value },
        { number: 2010, value: this.note.whatDoesTheClientNeed.value },
        { number: 2011, value: this.note.whatDidYouSuggest.value },
        { number: 2012, value: this.note.isAnyIndicator.value },
        { number: 2013, value: JSON.stringify(this.note.pendingValue) },
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
          if (answer.question_id === 2001)
            this.note.taxId.value = answer.answer;
          if (answer.question_id === 2002)
            this.note.contactTime.value = answer.answer;
          if (answer.question_id === 2003)
            this.note.workStatus.value = answer.answer;
          if (answer.question_id === 2004)
            this.note.typeOfBuisiness.value = answer.answer;
          if (answer.question_id === 2005)
            this.note.emergencyContact.value = answer.answer;
          if (answer.question_id === 2006)
            this.note.isItNew.value = answer.answer;
          if (answer.question_id === 2007)
            this.note.registeredBusiness.value = answer.answer;
          if (answer.question_id === 2008)
            this.note.howDidTheClientRegistered.value = answer.answer;
          if (answer.question_id === 2009)
            this.note.companyName.value = answer.answer;
          if (answer.question_id === 2010)
            this.note.whatDoesTheClientNeed.value = answer.answer;
          if (answer.question_id === 2011)
            this.note.whatDidYouSuggest.value = answer.answer;
          if (answer.question_id === 2012)
            this.note.isAnyIndicator.value = answer.answer;
          if (answer.question_id === 2013) {
            answer.answer = answer.answer.replace(/\\\\n/g, "<br>");
            this.note.pendingValue = JSON.parse(
              answer.answer.replace(/\\/g, '"')
            );
          }
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
  async created() {
    this.addPreloader();
    await this.getFirstNote();
    this.removePreloader();
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
