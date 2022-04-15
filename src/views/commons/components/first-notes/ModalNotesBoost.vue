<template>
  <div>
    <b-modal
      v-model="modalUp"
      size="xmd"
      header-class="p-0"
      header-bg-variant="transparent"
      scrollable
      modal-class="modal-primary"
      @hide="hideModal(false)"
    >
      <template #modal-header>
        <HeaderModalNotes
          program="Boost Credit"
          :info="noteInfo"
          @close="hideModal(false)"
        />
      </template>
      <ValidationObserver ref="form">
        <b-row class="px-1 mt-1">
          <b-col lg="4">
            <ValidationProvider
              v-slot="{ errors }"
              name="identification"
              rules="required"
            >
              <b-form-group
                label="Type of identification Number"
                label-class="font-weight-bolder"
              >
                <b-form-radio-group
                  v-model="note.identification"
                  :options="identificationOptions"
                  name="identification"
                  :class="{ 'border-danger rounded': errors[0] }"
                  :disabled="disabledNote"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
          <b-col lg="4">
            <ValidationProvider
              v-slot="{ errors }"
              name="Another"
              rules="required"
            >
              <b-form-group
                label-class="font-weight-bolder"
                label="Did you use another SSN or ITIN?"
              >
                <b-form-radio-group
                  v-model="note.another"
                  :options="anotherOptions"
                  :class="{ 'border-danger rounded': errors[0] }"
                  :disabled="disabledNote"
                  name="Another"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
          <b-col lg="4">
            <ValidationProvider
              v-slot="{ errors }"
              name="Pending"
              rules="required"
            >
              <b-form-group label-class="font-weight-bolder" label=" Pending">
                <b-form-checkbox-group
                  v-model="note.pending"
                  :options="pendingOptions"
                  :class="{ 'border-danger rounded': errors[0] }"
                  :disabled="disabledNote"
                  name="Pending"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>
        <b-row class="mt-1 px-1">
          <b-col v-if="dateTypeAgreement" lg="4">
            <ValidationProvider
              v-slot="{ errors }"
              name="agreement"
              rules="required"
            >
              <b-form-group
                label-class="font-weight-bolder"
                label="Type of Agreement"
              >
                <b-form-radio-group
                  v-model="note.typeAgreement"
                  :options="typeAgreementOptions"
                  :class="{ 'border-danger rounded': errors[0] }"
                  :disabled="disabledNote"
                  name="typeAgreement"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
          <b-col lg="4">
            <ValidationProvider
              v-slot="{ errors }"
              name="Credit"
              rules="required"
            >
              <b-form-group label-class="font-weight-bolder" label="Credit">
                <b-form-radio-group
                  v-model="note.credit"
                  :options="creditOptions"
                  :class="{ 'border-danger rounded': errors[0] }"
                  :disabled="disabledNote"
                  name="Credit"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>
        <b-row class="mt-1 px-1">
          <b-col lg="4">
            <ValidationProvider
              v-slot="{ errors }"
              name="Work"
              rules="required"
            >
              <b-form-group
                label-class="font-weight-bolder"
                label="Work Status"
                label-for="work"
              >
                <b-form-input
                  id="work"
                  v-model="note.work"
                  type="text"
                  :state="errors[0] ? false : null"
                  :disabled="disabledNote"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
          <b-col lg="4">
            <ValidationProvider
              v-slot="{ errors }"
              name="Hours"
              rules="required"
            >
              <b-form-group
                label-class="font-weight-bolder"
                label="Available Hours"
                label-for="hours"
              >
                <b-form-input
                  id="hours"
                  v-model="note.hours"
                  type="text"
                  :state="errors[0] ? false : null"
                  :disabled="disabledNote"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
          <b-col lg="4">
            <ValidationProvider
              v-slot="{ errors }"
              name="TypeDays"
              rules="required"
            >
              <b-form-group
                label-class="font-weight-bolder"
                label="Available Days"
                label-for="TypeDays"
              >
                <v-select
                  v-model="note.typeDays"
                  :dir="'ltr'"
                  multiple
                  transition="multiple"
                  label="name"
                  :options="dayOptions"
                  :class="{ 'border-danger rounded': errors[0] }"
                  :disabled="disabledNote"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>
        <b-row class="mt-1 px-1">
          <b-col lg="6">
            <ValidationProvider
              v-slot="{ errors }"
              name="TypGoal"
              rules="required"
            >
              <b-form-group
                label-class="font-weight-bolder"
                label="Goal"
                label-for="TypGoal"
              >
                <v-select
                  v-model="note.typeGoal"
                  :dir="'ltr'"
                  multiple
                  transition="multiple"
                  label="name"
                  :options="goalOptions"
                  :class="{ 'border-danger rounded': errors[0] }"
                  :disabled="disabledNote"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
          <b-col lg="6">
            <b-form-group
              label-class="font-weight-bolder"
              label="Origin Country"
              label-for="OriginCountry"
            >
              <v-select
                v-model="note.originCountry"
                :dir="'ltr'"
                :clearable="false"
                transition="multiple"
                label="name"
                :options="countryOptions"
                :reduce="(value) => value.id"
                :disabled="disabledNote"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row class="mt-1 px-1">
          <b-col lg="6">
            <b-form-group label-class="font-weight-bolder" label="Attach Call">
              <b-input-group>
                <b-input-group-prepend>
                  <b-button
                    variant="info"
                    class="btn-icon"
                    :disabled="disabledFile"
                    title="Delete File"
                    @click="deleteAudio"
                  >
                    <feather-icon icon="Trash2Icon" class="text-white" />
                  </b-button>
                </b-input-group-prepend>
                <b-form-input
                  v-if="note.fileName"
                  v-model="note.fileName"
                  type="text"
                  class="bg-transparent text-info"
                  disabled
                />
                <b-form-file
                  v-else
                  v-model="audioCall"
                  placeholder="Choose a file or drop it here..."
                  browse-text="Audio"
                  accept="audio/*"
                  :disabled="disabledFile"
                />
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col v-if="note.fileAudio" lg="6">
            <audio
              :src="note.fileAudio"
              controls
              class="mt-1 w-100"
              type="audio/mp3"
            />
          </b-col>
        </b-row>

        <b-row class="px-1">
          <b-col lg="12">
            <ValidationProvider
              v-slot="{ errors }"
              name="Inconvenience"
              rules="required"
            >
              <b-form-group
                label-class="font-weight-bolder"
                label="Inconvenience"
                label-for="Inconvenience"
              >
                <quill-editor
                  ref="editor"
                  v-model="note.inconvenience"
                  :options="editorOption"
                  class="font-small-1"
                  :class="{ 'border-danger': errors[0] }"
                  :disabled="disabledNote"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>

        <b-row class="mt-1 px-1">
          <b-col lg="12">
            <ValidationProvider
              v-slot="{ errors }"
              name="Information"
              rules="required"
            >
              <b-form-group
                label-class="font-weight-bolder"
                label="Information"
                label-for="Information"
              >
                <quill-editor
                  ref="editor"
                  v-model="note.information"
                  :options="editorOption"
                  class="font-small-1"
                  :class="{ 'border-danger': errors[0] }"
                  :disabled="disabledNote"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>
        <b-row class="mt-1 px-1">
          <b-col lg="12">
            <ValidationProvider
              v-slot="{ errors }"
              name="Recommendations"
              rules="required"
            >
              <b-form-group
                label-class="font-weight-bolder"
                label="Recommendations"
                label-for="Recommendations"
              >
                <quill-editor
                  v-model="note.recommendations"
                  :options="editorOption"
                  :class="{ 'border-danger': errors[0] }"
                  :disabled="disabledNote"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>
      </ValidationObserver>

      <template #modal-footer>
        <template v-if="newNote">
          <button-save v-if="showButtonSave" @click="saveNotesIncomplete" />
          <button-save-and-complete
            v-if="showButtonSave"
            @click="saveNotesCompleted"
          />
          <button-update
            v-if="showNewButtonUpdate || showNewButtonUpdateAdmin"
            @click="updateNotesCompleted"
          />
        </template>
        <template v-else>
          <button-save v-if="showButtonSave" @click="saveNotesIncomplete" />
          <button-update
            v-if="showButtonUpdate"
            @click="updateNotesCompleted"
          />
        </template>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { quillEditor } from "vue-quill-editor";
import vSelect from "vue-select";
import NotesServices from "@/views/commons/components/first-notes/services/notes.service";
import GlobalService from "@/views/services/global.service";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import ButtonSave from "@/views/commons/utilities/ButtonSave";
import ButtonSaveAndComplete from "@/views/commons/utilities/ButtonSaveAndComplete";
import ButtonUpdate from "@/views/commons/utilities/ButtonUpdate";
import HeaderModalNotes from "./HeaderModalNotes.vue";

export default {
  name: "ModalNotesBoost",

  components: {
    ButtonUpdate,
    ButtonSaveAndComplete,
    ButtonSave,
    vSelect,
    HeaderModalNotes,
    quillEditor,
  },

  props: {
    noteInfo: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  data() {
    return {
      modalUp: false,
      disabledForm: false,
      editorOption: {
        modules: { toolbar: false },
      },
      note: {
        identification: null,
        typeAgreement: null,
        work: null,
        credit: null,
        hours: null,
        typeDays: [],
        typeGoal: [],
        another: null,
        pending: [],
        originCountry: null,
        inconvenience: null,
        information: null,
        recommendations: null,
        fileAudio: null,
        fileName: null,
        file: null,
      },
      audioCall: null,
      disablebutton: {
        save: false,
        update: false,
      },
      showSave: false,
      showUpdate: false,
      showUpdateAdmin: false,
      noteNull: false,
      identificationOptions: [
        {
          text: "INVENTED SSN",
          value: "1",
        },
        {
          text: "ITIN",
          value: "2",
        },
        {
          text: "SSN",
          value: "3",
        },
      ],
      typeAgreementOptions: [
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
          value: "Voice",
        },
      ],
      creditOptions: [
        {
          text: "Increase",
          value: "1",
        },
        {
          text: "Start",
          value: "2",
        },
      ],
      dayOptions: [
        { name: "Sunday", id: 1 },
        { name: "Monday", id: 2 },
        { name: "Tuesday", id: 3 },
        { name: "Wednesday", id: 4 },
        { name: "Thursday", id: 5 },
        { name: "Friday", id: 6 },
        { name: "Saturday", id: 7 },
      ],
      goalOptions: [],
      anotherOptions: [
        {
          text: "Yes",
          value: "1",
        },
        {
          text: "No",
          value: "2",
        },
      ],
      pendingOptions: [
        {
          text: "UB",
          value: "1",
        },
        {
          text: "ID",
          value: "2",
        },
        {
          text: "OTHER",
          value: "3",
        },
      ],
      countryOptions: [],
    };
  },

  async created() {
    this.addPreloader();
    await this.getFirstNote();
    await this.getListTypeGoal();
    await this.getCountrys();
    this.getOriginCountry();
    this.removePreloader();
  },

  computed: {
    ...mapGetters({
      bigWindow: "app/bigWindow",
      currentUser: "auth/currentUser",
      moduleId: "auth/moduleId",
      userSession: "auth/userSession",
      skin: "appConfig/skin",
    }),
    newNote() {
      return this.noteInfo.created > "2021-05-16 00:00:00";
    },
    emptyNote() {
      if (this.newNote) {
        return this.noteInfo.notes_status_new == null;
      }
      return this.noteInfo.notes_status == 0;
    },
    disabledNote() {
      return (
        this.noteInfo.statusSale == 4 ||
        this.noteInfo.statusSale == 2 ||
        this.noteInfo.notSeller
      );
    },
    disabledFile() {
      return this.noteInfo.statusSale == 4 || this.noteInfo.notSeller;
    },
    showButtonSave() {
      return this.showSave && !this.noteInfo.notSeller;
    },
    showNewButtonUpdate() {
      return (
        this.showUpdate && this.noteInfo.module != 4 && !this.noteInfo.notSeller
      );
    },
    showNewButtonUpdateAdmin() {
      return this.showUpdateAdmin && this.noteInfo.module == 4;
    },
    showButtonUpdate() {
      return this.showUpdate && !this.noteInfo.notSeller;
    },
    dateTypeAgreement() {
      return this.noteInfo.created > "2021-08-05";
    },
  },

  methods: {
    // Save or Update
    async saveNotesIncomplete() {
      if (this.emptyNote) {
        this.saveUpdate("insert");
      } else {
        this.saveUpdate("update");
      }
    },
    async saveNotesCompleted() {
      const validate = await this.$refs.form.validate();
      if (validate) {
        if (this.emptyNote) {
          this.saveUpdate("insert");
        } else {
          this.saveUpdate("update");
        }
      }
    },
    async updateNotesCompleted() {
      const validate = await this.$refs.form.validate();
      if (validate) {
        this.saveUpdate("update");
      }
    },
    paramsNote() {
      const params = {
        sale_id: this.noteInfo.saleId,
        note: this.answersNote(),
        file_audio: this.note.fileAudio,
        file_name: this.note.fileName,
        lead_id: this.noteInfo.idLead,
        originCountry: this.note.originCountry,
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
          const response = await NotesServices[service](this.paramsNote());
          this.hideModal(true);
        } catch (error) {
          console.log(error);
          this.removePreloader();
          this.showErrorSwal(error);
        }
      }
    },

    answersNote() {
      const note = [];
      note.push(
        { number: 1044, value: this.note.identification },
        { number: 1045, value: this.note.work },
        { number: 1046, value: this.note.credit },
        { number: 1047, value: this.note.hours },
        { number: 1048, value: this.note.typeDays },
        { number: 1049, value: this.note.typeGoal },
        { number: 1050, value: this.note.another },
        { number: 1051, value: this.note.pending },
        { number: 1052, value: this.note.inconvenience },
        { number: 1053, value: this.note.information },
        { number: 1054, value: this.note.recommendations },
        {
          number: 1063,
          value: this.dateTypeAgreement ? this.note.typeAgreement : 1,
        },
        {
          number: 1055,
          value: (this.note.file = this.note.fileName
            ? `SM/${this.noteInfo.idLead}/${this.note.fileName}`
            : 0),
        }
      );
      return note;
    },

    // Get Answers Note
    async getFirstNote() {
      try {
        const params = { sale_id: this.noteInfo.saleId };
        const response = await NotesServices.getFirstNote(params);
        await this.getDetailsAnswers(response);
        await this.initialValidationNote(response);
        this.modalUp = true;
        this.removePreloader();
      } catch (error) {
        this.modalUp = false;
        this.showErrorSwal(error);
        this.removePreloader();
      }
    },
    initialValidationNote(note) {
      if (note.length != 0 && this.noteInfo.statusSale == 2) {
        this.showSave = false;
        this.showUpdate = false;
        this.showUpdateAdmin = true;
        return;
      }

      if (
        note.length != 0 &&
        this.noteInfo.statusSale != 4 &&
        !this.noteNull &&
        this.newNote
      ) {
        this.showUpdate = true;
        this.showUpdateAdmin = false;
        return;
      }

      if (this.newNote && (note.length == 0 || this.noteNull)) {
        this.showSave = true;
        return;
      }

      if (note.length != 0 && this.noteInfo.statusSale != 4) {
        this.showUpdate = true;
        this.showUpdateAdmin = false;
        return;
      }

      if (note.length == 0) {
        this.showSave = true;
        return;
      }

      if (
        this.noteInfo.editModal ||
        this.noteInfo.statusSales == 4 ||
        this.noteInfo.statusSales == 2
      ) {
        this.showUpdate = false;
        this.showSave = false;
        this.showUpdateAdmin = false;
      }
    },
    getDetailsAnswers(note) {
      note.forEach((answer) => {
        if (answer.answer != "null") {
          if (answer.question_id == 1044)
            this.note.identification = answer.answer;
          if (answer.question_id == 1045) this.note.work = answer.answer;
          if (answer.question_id == 1046) this.note.credit = answer.answer;
          if (answer.question_id == 1047) this.note.hours = answer.answer;
          if (answer.question_id == 1048)
            this.note.typeDays = JSON.parse(answer.answer);
          if (answer.question_id == 1049)
            this.note.typeGoal = JSON.parse(answer.answer);
          if (answer.question_id == 1050) this.note.another = answer.answer;
          if (answer.question_id == 1051)
            this.note.pending = JSON.parse(answer.answer);
          if (answer.question_id == 1052)
            this.note.inconvenience = answer.answer;
          if (answer.question_id == 1053) this.note.information = answer.answer;
          if (answer.question_id == 1054)
            this.note.recommendations = answer.answer;
          if (answer.question_id == 1055) {
            if (answer.url != 0) {
              this.note.fileAudio = answer.answer;
              this.note.fileName = answer.url.split("/")[2];
            }
          }
          if (answer.question_id == 1063)
            this.note.typeAgreement = answer.answer;
        }

        if (answer.answer == "null") {
          this.noteNull = true;
        }
      });
    },

    // Initials Gets

    async getListTypeGoal() {
      try {
        const response = await NotesServices.getListTypeGoal();
        this.goalOptions = response;
      } catch (error) {
        this.showErrorSwal();
      }
    },
    async getCountrys() {
      try {
        const response = await GlobalService.getCountrys();
        this.countryOptions = response;
      } catch (error) {
        this.showErrorSwal();
      }
    },
    getOriginCountry() {
      this.note.originCountry = this.noteInfo.originCountry
        ? this.noteInfo.originCountry
        : 146;
    },

    /* File */
    onAudioChange() {
      const file = this.audioCall;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.note.fileAudio = e.target.result;
      };
      this.note.fileName = file.name;
      reader.readAsDataURL(file);
    },

    deleteAudio() {
      this.note.fileAudio = "";
      this.note.fileName = "";
    },

    // Hide Modal
    hideModal(status) {
      this.modalUp = false;
      this.$emit("hide", status);
    },
  },
  watch: {
    audioCall(newValue) {
      if (newValue) {
        this.onAudioChange();
      }
    },
  },
};
</script>

<style scoped>
.quill-editor {
  height: 150px;
}
.restart-font-size {
  font-size: 100% !important;
}
* {
  font-size: 0.8rem !important;
}

.border-red {
  border: 1px solid #ff3b19 !important;
  border-radius: 0.357rem !important;
}
</style>
