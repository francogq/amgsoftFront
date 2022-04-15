<template>
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
      <header-modal-notes
        program="Credit Experts"
        :info="noteInfo"
        @close="hideModal(false)"
      />
    </template>
    <validation-observer ref="form">
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="identificationNumber"
            rules="required"
          >
            <b-form-group
              label="Type of Identification Number"
              label-class="font-weight-bolder"
            >
              <b-form-radio-group
                v-model="note.identificationNumber.value"
                :options="note.identificationNumber.options"
                :class="{ 'border-danger': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="typeOfAgreement"
            rules="required"
          >
            <b-form-group
              label-class="font-weight-bolder"
              label="Type of Agreement"
            >
              <b-form-radio-group
                v-model="note.typeOfAgreement.value"
                :options="note.typeOfAgreement.options"
                :class="{ 'border-danger': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="workStatus"
            rules="required"
          >
            <b-form-group label="Work Status" label-class="font-weight-bolder">
              <v-select
                v-model="note.workStatus.value"
                label="label"
                :reduce="(value) => value.value"
                :options="note.workStatus.options"
                :class="{ 'border-danger': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="maritalStatus"
            rules="required"
          >
            <b-form-group
              label="Marital Status"
              label-class="font-weight-bolder"
            >
              <v-select
                v-model="note.maritalStatus.value"
                :options="note.maritalStatus.options"
                label="text"
                :reduce="(value) => value.value"
                :class="{ 'border-danger': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="contactSchedule"
            rules="required"
          >
            <b-form-group
              label="Contact Schedule"
              label-class="font-weight-bolder"
            >
              <b-form-input
                v-model="note.contactSchedule.value"
                :class="{ 'border-danger': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="emergencyContact"
            rules="required"
          >
            <b-form-group
              label="Emergency Contact"
              label-class="font-weight-bolder"
            >
              <b-form-input
                v-model="note.emergencyContact.value"
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
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="goals"
            rules="required"
          >
            <b-form-group label="Goals" label-class="font-weight-bolder">
              <b-form-checkbox-group
                v-model="note.goals.value"
                :options="note.goals.options"
                :class="{ 'border-danger': errors[0] }"
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
              <b-form-checkbox-group
                v-model="note.pending.value"
                :options="note.pending.options"
                :class="{ 'border-danger': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group label-class="font-weight-bolder" label="Incoveniences">
            <b-row>
              <b-col>
                <b-table
                  small
                  :items="note.incoveniences.mid1"
                  class="font-small-2"
                />
              </b-col>
              <b-col>
                <b-table
                  small
                  :items="note.incoveniences.mid2"
                  class="font-small-2"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="6">
                <b-form-group
                  label-class="font-weight-bolder"
                  label="Attach Call"
                >
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
            <b-row>
              <b-col>
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="incoveniences"
                >
                  <quill-editor
                    v-model="note.incoveniences.value"
                    :disabled="disabled"
                    :options="editorOption"
                    :class="{ 'border-danger rounded': errors[0] }"
                  />
                </validation-provider>
              </b-col>
            </b-row>
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
          <b-form-group label="Recomendations" label-class="font-weight-bolder">
            <validation-provider
              v-slot="{ errors }"
              name="recomendationCheckbox"
              rules="required"
            >
              <b-form-checkbox-group
                v-model="note.recomendations.selectedsOptions"
                :options="note.recomendations.options"
                plain
                :class="{ 'border-danger': errors[0] }"
              />
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="recomendationTextArea"
              :rules="isSelectedOthersOnRecomendations ? 'required' : ''"
            >
              <quill-editor
                v-model="note.recomendations.value"
                :disabled="disabled"
                :options="editorOption"
                class="mt-1"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="suggestion"
            rules="required"
          >
            <b-form-group label="Suggestion" label-class="font-weight-bolder">
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
import { quillEditor } from "vue-quill-editor";
import vSelect from "vue-select";
import NotesServices from "@/views/commons/components/first-notes/services/notes.service";
import HeaderModalNotes from "@/views/commons/components/first-notes/HeaderModalNotes.vue";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import ButtonSave from "@/views/commons/utilities/ButtonSave";
import ButtonSaveAndComplete from "@/views/commons/utilities/ButtonSaveAndComplete";
import ButtonUpdate from "@/views/commons/utilities/ButtonUpdate";

export default {
  name: "ModalNotesCreditOld",
  components: {
    ButtonUpdate,
    ButtonSaveAndComplete,
    ButtonSave,
    HeaderModalNotes,
    quillEditor,
    vSelect,
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
      audioCall: null,
      noteNull: false,
      modalUp: false,
      note: {
        recomendations: {
          value: "",
          options: [
            {
              text: "AVOID INQUIRES",
              value: {
                id: "reco-1",
              },
            },
            {
              text: "ADVISOR'S RECOMMENDATIONS",
              value: {
                id: "reco-2",
              },
            },
            {
              text: "CREDIT CARDS BALANCE",
              value: {
                id: "reco-3",
              },
            },
            {
              text: "COLLECTION LETTERS",
              value: {
                id: "reco-5",
              },
            },
            {
              text: "OTHERS",
              value: {
                id: "reco-4",
              },
            },
          ],
          selectedsOptions: [],
          disabled: false,
        },
        suggestion: {
          value: "",
          disabled: false,
        },
        information: {
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
            {
              text: "SSN",
              value: {
                id: "pen-3",
              },
            },
            {
              text: "NONE",
              value: {
                id: "pen-4",
              },
            },
          ],
        },
        goals: {
          value: [],
          options: [
            {
              text: "CASA",
              value: { id: "goal-1" },
            },
            {
              text: "AUTO",
              value: { id: "goal-2" },
            },
            {
              text: "REFINANCIAR CASA",
              value: { id: "goal-3" },
            },
            {
              text: "REFINANCIAR AUTO",
              value: { id: "goal-4" },
            },
            {
              text: "EXCELENTE CREDITO",
              value: { id: "goal-5" },
            },
          ],
        },
        country: {
          value: null,
          disabled: false,
          options: [],
        },
        emergencyContact: {
          value: "",
        },
        maritalStatus: {
          value: "",
          options: [
            {
              text: "SINGLE",
              value: "1",
            },
            {
              text: "MARRIED",
              value: "2",
            },
            {
              text: "DIVORCED",
              value: "3",
            },
            {
              text: "WIDOWER - WIDOW",
              value: "4",
            },
          ],
        },
        contactSchedule: {
          value: "",
        },
        identificationNumber: {
          value: "",
          options: [
            {
              text: "CPN",
              value: 1,
            },
            {
              text: "ITIN",
              value: 2,
            },
            {
              text: "SSN",
              value: 3,
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
              value: "Voice",
            },
          ],
        },
        workStatus: {
          options: [
            {
              label: "EMPLOYED",
              value: "1",
            },
            {
              label: "SELF EMPLOYED",
              value: "2",
            },
            {
              label: "RETIRED",
              value: "3",
            },
            {
              label: "STUDENT",
              value: "4",
            },
            {
              label: "DISABILITY",
              value: "5",
            },
            {
              label: "UNEMPLOYED",
              value: "6",
            },
          ],
        },
        incoveniences: {
          value: "",
          mid1: [],
          mid2: [],
        },
        fileAudio: "",
        fileName: "",
        file: null,
      },
      noCredit: [],
      showSave: false,
      showUpdate: false,
      editorOption: {
        modules: { toolbar: false },
      },
    };
  },
  computed: {
    disabledFile() {
      return this.noteInfo.statusSale === 4 || this.noteInfo.notSeller;
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
    isSelectedOthersOnRecomendations() {
      return this.note.recomendations.selectedsOptions
        .map((val) => val.id)
        .includes("reco-4");
    },
  },
  watch: {
    audioCall(newValue) {
      if (newValue) {
        this.onAudioChange();
      }
    },
    "note.recomendations.value": {
      handler(newValue) {
        const include = this.note.recomendations.selectedsOptions
          .map((val) => val.id)
          .includes("reco-4");
        if (newValue && !include) {
          this.note.recomendations.selectedsOptions.push({ id: "reco-4" });
        }
        if (!newValue && include) {
          const index = this.note.recomendations.selectedsOptions.indexOf({
            id: "reco-4",
          });
          this.note.recomendations.selectedsOptions.splice(index, 1);
        }
      },
      deep: true,
    },
    "note.recomendations.selectedsOptions": {
      handler(newValue, oldValue) {
        const isRemoved = newValue.length < oldValue.length;
        if (isRemoved) {
          const includedReco4InNewValue = newValue
            .map((val) => val.id)
            .includes("reco-4");
          const includedReco4InOldValue = oldValue
            .map((val) => val.id)
            .includes("reco-4");
          if (!includedReco4InNewValue && includedReco4InOldValue) {
            this.note.recomendations.value = "";
          }
        }
      },
      deep: true,
    },
  },
  async created() {
    this.addPreloader();
    this.getCountries();
    await this.getFirstNote();
    await this.getNoCredit();
    this.note.country.value = this.noteInfo.originCountry
      ? this.noteInfo.originCountry
      : 146; //MEXICO
    this.removePreloader();
  },
  methods: {
    deleteAudio() {
      this.note.fileAudio = "";
      this.note.fileName = "";
    },
    onAudioChange() {
      const file = this.audioCall;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.note.fileAudio = e.target.result;
      };
      this.note.fileName = file.name;
      reader.readAsDataURL(file);
    },
    async getNoCredit() {
      try {
        const response = await amgApi.post(
          "/sales-made/get-program-task-welcome",
          {
            sale_id: this.noteInfo.saleId,
          }
        );
        this.noCredit = response.data;
        const middle = this.noCredit.length / 2;
        this.note.incoveniences.mid1 = this.noCredit.slice(0, middle + 1);
        this.note.incoveniences.mid2 = this.noCredit.slice(middle + 1);
      } catch (error) {
        this.showErrorSwal(error);
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
        file_audio: this.note.fileAudio,
        file_name: this.note.fileName,
        sale_id: this.noteInfo.saleId,
        note: this.answersNote(),
        originCountry: this.note.country.value,
        idLead: this.noteInfo.idLead,
        lead_id: this.noteInfo.idLead,
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
      const answer23 = {
        number: 23,
        value: [...this.note.recomendations.selectedsOptions],
      };
      // eslint-disable-next-line array-callback-return
      answer23.value.map((val) => {
        // eslint-disable-next-line no-param-reassign
        if (val.id === "reco-4") val.text = this.note.recomendations.value;
      });
      answer23.value = answer23.value;
      return [
        answer23,
        { number: 24, value: JSON.stringify(this.note.pending.value) },
        { number: 25, value: JSON.stringify(this.note.goals.value) },
        { number: 1058, value: this.note.emergencyContact.value },
        { number: 1057, value: this.note.contactSchedule.value },
        { number: 1056, value: this.note.maritalStatus.value },
        {
          number: 20,
          value: this.note.workStatus.value ? this.note.workStatus.value : "",
        },
        { number: 1063, value: this.note.typeOfAgreement.value },
        { number: 19, value: this.note.identificationNumber.value },
        { number: 1060, value: this.note.incoveniences.value },
        { number: 1061, value: this.note.information.value },
        { number: 26, value: this.note.suggestion.value },
        {
          number: 1055,
          value: (this.note.file = this.note.fileName
            ? `SM/${this.noteInfo.idLead}/${this.note.fileName}`
            : 0),
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
    getDetailsAnswers(note) {
      note.forEach((answer) => {
        if (answer.answer != "null" && answer.answer != "[]") {
          if (answer.question_id === 23) {
            answer.answer = answer.answer.replace(/\\\\n/g, "<br>");
            answer.answer = JSON.parse(answer.answer.replace(/\\/g, '"'));
            /* response = JSON.parse(
              JSON.parse(
                answer.answer.replace(/\\\\n/g, '<br>').replace(/\\\\/g, '"').replaceAll('""', ''),
              ),
            ) */
            answer.answer.forEach((ans) => {
              if (ans.id === "reco-4") {
                this.note.recomendations.selectedsOptions.push({
                  id: "reco-4",
                });
                this.note.recomendations.value = ans.text;
              } else this.note.recomendations.selectedsOptions.push(ans);
            });
          }
          if (answer.question_id === 24) {
            answer.answer = answer.answer.replace(/\\\\n/g, "<br>");
            this.note.pending.value = JSON.parse(
              answer.answer.replace(/\\/g, '"')
            );
            /* this.note.pending.value = JSON.parse(
              answer.answer.replace(/\\\\n/g, '<br>').replace(/\\/g, '"'),
            ) */
          }
          if (answer.question_id === 25) {
            this.note.goals.value = answer.answer.replace(/\\\\n/g, "<br>");
            this.note.goals.value = JSON.parse(
              answer.answer.replace(/\\/g, '"')
            );
            /* this.note.goals.value = JSON.parse(
              answer.answer.replace(/\\\\n/g, '<br>').replace(/\\/g, '"'),
            ) */
          }
          if (answer.question_id === 1058)
            this.note.emergencyContact.value = answer.answer;
          if (answer.question_id === 1057)
            this.note.contactSchedule.value = answer.answer;
          if (answer.question_id === 1056)
            this.note.maritalStatus.value = answer.answer;
          if (answer.question_id === 20)
            this.note.workStatus.value = answer.answer;
          if (answer.question_id === 1063)
            this.note.typeOfAgreement.value = answer.answer;
          if (answer.question_id === 19)
            this.note.identificationNumber.value = answer.answer;
          if (answer.question_id === 1060)
            this.note.incoveniences.value = answer.answer;
          if (answer.question_id === 1061)
            this.note.information.value = answer.answer;
          if (answer.question_id === 26)
            this.note.suggestion.value = answer.answer;
          if (answer.question_id === 1055) {
            if (answer.url != 0) {
              this.note.fileAudio = answer.answer;
              this.note.fileName = answer.url.split("/")[2];
            }
          }
        } else this.noteNull = true;
      });
    },
    async listTypeBusiness() {
      try {
        const response = await amgApi.post("/commons/get-all-type-business");
        this.note.typeOfBuisiness.options = response.data;
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
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
  },
};
</script>

<style scoped>
.quill-editor {
  height: 100px;
}
</style>
