<template>
  <b-modal
    v-model="modalUp"
    size="xmd"
    header-class="p-0"
    header-bg-variant="transparent"
    scrollable
    @hide="hideModal(false)"
  >
    <template #modal-header>
      <header-modal-notes
        program="Tax Research"
        :info="noteInfo"
        @close="hideModal(false)"
      />
    </template>
    <validation-observer ref="form">
      <b-row>
        <b-col md="9">
          <b-form-group label="Marital Status" label-class="font-weight-bolder">
            <validation-provider
              v-slot="{ errors }"
              name="maritalStatus"
              rules="required"
            >
              <b-form-radio-group
                v-model="note.maritalStatus.value"
                :disabled="disabled"
                :options="note.maritalStatus.options"
                :class="{ 'border-danger': errors[0] }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-form-group
            label="Dependents"
            label-class="font-weight-bolder"
            :disabled="disabled"
          >
            <validation-provider
              v-slot="{ errors }"
              name="dependents"
              rules="required"
            >
              <b-form-input
                v-model="note.dependents.value"
                v-mask="'##'"
                type="number"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <validation-provider
            v-slot="{ errors }"
            name="migrationSituation"
            rules="required"
          >
            <b-form-group
              label="Migratory Situation"
              label-class="font-weight-bolder"
            >
              <b-form-radio-group
                v-model="note.migrationSituation.value"
                :disabled="disabled"
                :options="note.migrationSituation.options"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="bankruptcy"
            rules="required"
          >
            <b-form-group label="Bankruptcy" label-class="font-weight-bolder">
              <b-form-radio-group
                v-model="note.bankruptcy.value"
                :disabled="disabled"
                :options="note.bankruptcy.options"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <transition name="fade">
          <b-col v-if="note.bankruptcy.value === 'YES'">
            <validation-provider
              v-slot="{ errors }"
              name="bankruptcyYear"
              rules="required"
            >
              <b-form-group
                label="Bankruptcy Year"
                label-class="font-weight-bolder"
              >
                <b-form-input
                  v-model="note.bankruptcy.bankruptcyYear"
                  v-mask="'####'"
                  :disabled="disabled"
                  type="number"
                  :class="{ 'border-danger': errors[0] }"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
        </transition>
        <transition name="fade">
          <b-col v-if="note.bankruptcy.value === 'YES'">
            <validation-provider
              v-slot="{ errors }"
              name="bankruptcyChapter"
              rules="required"
            >
              <b-form-group label="Chapter" label-class="font-weight-bolder">
                <b-form-input
                  v-model="note.bankruptcy.chapter"
                  v-mask="'####'"
                  :disabled="disabled"
                  type="number"
                  :class="{ 'border-danger': errors[0] }"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
        </transition>
      </b-row>
      <b-row>
        <b-col md="3">
          <validation-provider
            v-slot="{ errors }"
            name="taxYearsPending"
            rules="required"
          >
            <b-form-group
              label="Tax Years pending"
              label-class="font-weight-bolder"
            >
              <b-form-input
                v-model="note.taxYearsPending.value"
                v-mask="'####'"
                :disabled="disabled"
                type="number"
                :class="{ 'border-danger': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col>
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
        <b-col v-if="dateTypeAgreement" md="3">
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
                :disabled="disabled"
                :options="note.typeOfAgreement.options"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col cols="12" v-if="isAfterLastDeploy">
          <b-form-group label="Pending" label-class="font-weight-bolder">
            <b-form-checkbox-group
              v-model="note.pending.value"
              :options="note.pending.options"
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
import ButtonSave from "@/views/commons/utilities/ButtonSave.vue";
import ButtonSaveAndComplete from "@/views/commons/utilities/ButtonSaveAndComplete.vue";
import ButtonUpdate from "@/views/commons/utilities/ButtonUpdate.vue";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "ModalNotesTax",
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
        maritalStatus: {
          value: "",
          options: [
            {
              text: "Single",
              value: 1,
            },
            {
              text: "Married",
              value: 2,
            },
            {
              text: "Divorced",
              value: 3,
            },
            {
              text: "Separated",
              value: 4,
            },
            {
              text: "Widowed",
              value: 5,
            },
            {
              text: "Unmarried",
              value: 6,
            },
          ],
        },
        dependents: {
          value: "",
        },
        migrationSituation: {
          value: "",
          options: [
            {
              text: "Resident",
              value: 0,
            },
            {
              text: "Citizen",
              value: 1,
            },
            {
              text: "Undocumented",
              value: 2,
            },
          ],
        },
        bankruptcy: {
          value: "",
          options: [
            {
              text: "Yes",
              value: "YES",
            },
            {
              text: "No",
              value: "NO",
            },
          ],
          bankruptcyYear: "0",
          chapter: "0",
        },
        taxYearsPending: {
          value: "",
        },
        country: {
          value: [],
          options: [],
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
          value: [],
          options: [
            {
              text: "ID",
              value: {
                id: "pen-1",
              },
            },
            {
              text: "UB",
              value: {
                id: "pen-2",
              },
            },
          ],
        },
      },
      salesCreated: null,
    };
  },
  computed: {
    disabled() {
      return this.noteInfo.statusSale === 4 || this.noteInfo.notSeller;
    },
    dateTypeAgreement() {
      return this.noteInfo.created > "2021-08-05";
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
    "note.bankruptcy.value": {
      handler(newVal) {
        if (newVal !== "YES") {
          this.note.bankruptcy.bankruptcyYear = this.note.bankruptcy
            .bankruptcyYear
            ? this.note.bankruptcy.bankruptcyYear
            : 0;
          this.note.bankruptcy.chapter = this.note.bankruptcy.chapter
            ? this.note.bankruptcy.chapter
            : 0;
        } else {
          this.note.bankruptcy.bankruptcyYear =
            this.note.bankruptcy.bankruptcyYear === "0" ||
            this.note.bankruptcy.bankruptcyYear === 0
              ? ""
              : this.note.bankruptcy.bankruptcyYear;
          this.note.bankruptcy.chapter =
            this.note.bankruptcy.chapter === "0" ||
            this.note.bankruptcy.chapter === 0
              ? ""
              : this.note.bankruptcy.chapter;
        }
      },
      deep: true,
    },
  },
  async created() {
    await this.validateCreatesSale();
    this.addPreloader();
    await this.getFirstNote();
    await this.getCountries();
    this.note.country.value = this.noteInfo.originCountry;
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
        { number: 1021, value: this.note.maritalStatus.value },
        { number: 1022, value: this.note.dependents.value },
        { number: 1023, value: this.note.migrationSituation.value },
        { number: 1024, value: this.note.bankruptcy.value },
        { number: 1025, value: this.note.bankruptcy.bankruptcyYear },
        { number: 1026, value: this.note.bankruptcy.chapter },
        { number: 1027, value: this.note.taxYearsPending.value },
        { number: 1028, value: this.note.indications.value },
        { number: 1029, value: this.note.information.value },
        { number: 1030, value: this.note.suggestion.value },
        { number: 2015, value: JSON.stringify(this.note.pending.value) },
        {
          number: 1063,
          value: this.dateTypeAgreement ? this.note.typeOfAgreement.value : 1,
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
    getDetailsAnswers(note) {
      note.forEach((answer) => {
        if (answer.answer != "null") {
          if (answer.question_id === 1021)
            this.note.maritalStatus.value = answer.answer;
          if (answer.question_id === 1022)
            this.note.dependents.value = answer.answer;
          if (answer.question_id === 1023)
            this.note.migrationSituation.value = answer.answer;
          if (answer.question_id === 1024)
            this.note.bankruptcy.value = answer.answer;
          if (answer.question_id === 1025)
            this.note.bankruptcy.bankruptcyYear = answer.answer;
          if (answer.question_id === 1026)
            this.note.bankruptcy.chapter = answer.answer;
          if (answer.question_id === 1027)
            this.note.taxYearsPending.value = answer.answer;
          if (answer.question_id === 1028)
            this.note.indications.value = answer.answer;
          if (answer.question_id === 1029)
            this.note.information.value = answer.answer;
          if (answer.question_id === 1030)
            this.note.suggestion.value = answer.answer;
          if (answer.question_id === 1063)
            this.note.typeOfAgreement.value = answer.answer;
          if (answer.question_id === 2015) {
            answer.answer = answer.answer.replace(/\\\\n/g, "<br>");
            this.note.pending.value = JSON.parse(
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
