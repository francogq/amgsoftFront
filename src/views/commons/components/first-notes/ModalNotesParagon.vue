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
        program="Paragon"
        :info="noteInfo"
        @close="hideModal(false)"
      />
    </template>
    <validation-observer ref="form">
      <b-row>
        <b-col>
          <b-form-group
            label="Type of Business"
            label-class="font-weight-bolder"
          >
            <validation-provider
              v-slot="{ errors }"
              name="typeOfBusiness"
              rules="required"
            >
              <v-select
                v-model="note.typeOfBuisiness.value"
                :class="{ 'border-danger': errors[0] }"
                :disabled="disabled"
                :options="note.typeOfBuisiness.options"
                label="name"
                multiple
              />
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <validation-provider
            v-slot="{ errors }"
            name="contactTime"
            rules="required"
          >
            <b-form-group label="Contact time" label-class="font-weight-bolder">
              <b-form-input
                v-model="note.contactTime.value"
                :disabled="disabled"
                :class="{ 'border-danger rounded': errors[0] }"
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
        <b-col cols="4">
          <validation-provider
            v-slot="{ errors }"
            name="facebook"
            rules="required"
          >
            <b-form-group label="Facebook" label-class="font-weight-bolder">
              <b-form-radio-group
                v-model="note.facebook.value"
                :options="note.facebook.options"
                name="facebook"
                :class="{ 'border-danger rounded': errors[0] }"
                :disabled="disabled"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col cols="4">
          <validation-provider v-slot="{ errors }" name="logo" rules="required">
            <b-form-group label="Logo" label-class="font-weight-bolder">
              <b-form-radio-group
                v-model="note.logo.value"
                :disabled="disabled"
                :options="note.logo.options"
                name="identification"
                :class="{ 'border-danger rounded': errors[0] }"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col cols="4">
          <validation-provider
            v-slot="{ errors }"
            name="instagram"
            rules="required"
          >
            <b-form-group label="Instagram" label-class="font-weight-bolder">
              <b-form-radio-group
                v-model="note.instagram.value"
                :options="note.instagram.options"
                name="instagram"
                :class="{ 'border-danger rounded': errors[0] }"
                :disabled="disabled"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <transition name="fade">
          <b-col
            v-if="
              note.facebook.value === 'Yes' || note.instagram.value === 'Yes'
            "
            cols="12"
          >
            <b-row class="d-flex align-items-center justify-content-between">
              <b-col
                class="d-flex align-items-center justify-content-between"
                :class="{ aaa: note.facebook.value !== 'Yes' }"
                cols="4"
              >
                <b-form-group
                  label-class="font-weight-bolder"
                  label="Facebook Link"
                  class="mr-1"
                >
                  <b-form-input
                    v-model="note.facebook.link"
                    :disabled="disabled"
                  />
                </b-form-group>
                <b-form-group
                  label-class="font-weight-bolder"
                  label="Facebook Likes"
                >
                  <b-form-input
                    v-model="note.facebook.likes"
                    :disabled="disabled"
                  />
                </b-form-group>
              </b-col>
              <b-col
                v-if="note.instagram.value === 'Yes'"
                cols="4"
                class="d-flex"
              >
                <b-form-group
                  label-class="font-weight-bolder"
                  label="Instagram Link"
                  class="mr-1"
                >
                  <b-form-input
                    v-model="note.instagram.link"
                    :disabled="disabled"
                  />
                </b-form-group>
                <b-form-group
                  label-class="font-weight-bolder"
                  label="Instagram Likes"
                >
                  <b-form-input
                    v-model="note.instagram.likes"
                    :disabled="disabled"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
        </transition>
        <b-col cols="4">
          <validation-provider
            v-slot="{ errors }"
            name="website"
            rules="required"
          >
            <b-form-group label="Website" label-class="font-weight-bolder">
              <b-form-radio-group
                v-model="note.website.value"
                :options="note.website.options"
                name="website"
                :class="{ 'border-danger rounded': errors[0] }"
                :disabled="disabled"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col cols="4">
          <validation-provider
            v-slot="{ errors }"
            name="socialMediaServices"
            rules="required"
          >
            <b-form-group
              label="Experience with Social Media Services"
              label-class="font-weight-bolder"
            >
              <b-form-radio-group
                v-model="note.experience.value"
                :options="note.experience.options"
                name="experience"
                :class="{ 'border-danger rounded': errors[0] }"
                :disabled="disabled"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <b-col cols="4">
          <validation-provider
            v-slot="{ errors }"
            name="newBusiness"
            rules="required"
          >
            <b-form-group
              label="It a New Business?"
              label-class="font-weight-bolder"
            >
              <b-form-radio-group
                v-model="note.newBusiness.value"
                :options="note.newBusiness.options"
                name="newBusiness"
                :class="{ 'border-danger rounded': errors[0] }"
                :disabled="disabled"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
        <transition name="fade">
          <b-col
            v-if="
              note.website.value === 'Yes' || note.newBusiness.value === 'No'
            "
            cols="12"
          >
            <b-row class="d-flex align-items-center justify-content-between">
              <b-col
                cols="4"
                class="d-flex align-items-center justify-content-between"
                :class="{ aaa: note.website.value !== 'Yes' }"
              >
                <b-form-group
                  label-class="font-weight-bolder"
                  label="Website Link"
                  class="mr-1"
                  style="width: 50% !important"
                >
                  <b-form-input
                    v-model="note.website.link"
                    :disabled="disabled"
                  />
                </b-form-group>
                <b-form-group
                  label-class="font-weight-bolder"
                  label="Website Type"
                  style="width: 50% !important"
                >
                  <b-form-select
                    v-model="note.website.type"
                    :disabled="disabled"
                    :options="['STANDAR', 'PROFESSIONAL', 'ECOMMERCE']"
                  />
                </b-form-group>
              </b-col>
              <b-col v-if="note.newBusiness.value === 'No'" cols="4">
                <b-form-group label="Years?" label-class="font-weight-bolder">
                  <b-form-input v-model="note.newBusiness.years" />
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
        </transition>
      </b-row>
      <transition name="fade">
        <b-row v-if="note.experience.value === 'Yes'">
          <b-col>
            <validation-provider
              v-slot="{ errors }"
              name="experience"
              rules="required"
            >
              <b-form-group label="Details" label-class="font-weight-bolder">
                <quill-editor
                  v-model="note.details.value"
                  :disabled="disabled"
                  :options="editorOption"
                  :class="{ 'border-danger rounded': errors[0] }"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
        </b-row>
      </transition>
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
            name="suggestion"
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
import ButtonSave from "@/views/commons/utilities/ButtonSave.vue";
import ButtonSaveAndComplete from "@/views/commons/utilities/ButtonSaveAndComplete.vue";
import ButtonUpdate from "@/views/commons/utilities/ButtonUpdate.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "ModalNotesParagon",
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
      noteNull: false,
      modalUp: false,
      note: {
        logo: {
          value: null,
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
          disabled: false,
        },
        facebook: {
          value: null,
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
          disabled: false,
          link: "",
          likes: "",
        },
        experience: {
          value: null,
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
          disabled: false,
        },
        newBusiness: {
          value: null,
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
          disabled: false,
          years: "",
        },
        website: {
          value: null,
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
          disabled: false,
          link: "",
          type: "",
        },
        instagram: {
          value: null,
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
          disabled: false,
          link: "",
          likes: "",
        },
        typeOfBuisiness: {
          value: [],
          disabled: false,
          options: [],
        },
        contactTime: {
          value: "",
          disabled: false,
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
          disabled: false,
        },
        details: {
          value: "",
          disabled: false,
        },
      },
      showSave: false,
      showUpdate: false,
      editorOption: {
        modules: { toolbar: false },
      },
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
  },
  watch: {
    "note.facebook.value": {
      handler(newValue) {
        if (newValue !== "Yes") {
          this.note.facebook.likes = this.note.facebook.likes
            ? this.note.facebook.likes
            : 0;
          this.note.facebook.link = this.note.facebook.link
            ? this.note.facebook.link
            : 0;
        } else {
          this.note.facebook.likes =
            this.note.facebook.likes === 0 || this.note.facebook.likes === "0"
              ? ""
              : this.note.facebook.likes;
          this.note.facebook.link =
            this.note.facebook.link === 0 || this.note.facebook.link === "0"
              ? ""
              : this.note.facebook.link;
        }
      },
      deep: true,
    },
    "note.instagram.value": {
      handler(newValue) {
        if (newValue !== "Yes") {
          this.note.instagram.likes = this.note.instagram.likes
            ? this.note.instagram.likes
            : 0;
          this.note.instagram.link = this.note.instagram.link
            ? this.note.instagram.link
            : 0;
        } else {
          this.note.instagram.likes =
            this.note.instagram.likes === 0 || this.note.instagram.likes === "0"
              ? ""
              : this.note.instagram.likes;
          this.note.instagram.link =
            this.note.instagram.link === 0 || this.note.instagram.link === "0"
              ? ""
              : this.note.instagram.link;
        }
      },
      deep: true,
    },
    "note.website.value": {
      handler(newValue) {
        if (newValue !== "Yes") {
          this.note.website.link = this.note.website.link
            ? this.note.website.link
            : 0;
          this.note.website.type = this.note.website.type
            ? this.note.website.type
            : 0;
        } else {
          this.note.website.link =
            this.note.website.link === 0 || this.note.website.link === "0"
              ? ""
              : this.note.website.link;
          this.note.website.type =
            this.note.website.type === 0 || this.note.website.type === "0"
              ? ""
              : this.note.website.type;
        }
      },
      deep: true,
    },
    "note.experience.value": {
      handler(newValue) {
        if (newValue !== "Yes") {
          this.note.details.value = this.note.details.value
            ? this.note.details.value
            : 0;
        } else {
          this.note.details.value =
            this.note.details.value === 0 || this.note.details.value === "0"
              ? ""
              : this.note.details.value;
        }
      },
      deep: true,
    },
    "note.newBusiness.value": {
      handler(newValue) {
        if (newValue !== "No") {
          this.note.newBusiness.years = this.note.newBusiness.years
            ? this.note.newBusiness.years
            : 0;
        } else {
          this.note.newBusiness.years =
            this.note.newBusiness.years === 0 ||
            this.note.newBusiness.years === "0"
              ? ""
              : this.note.newBusiness.years;
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
        { number: 1075, value: this.note.facebook.value },
        { number: 1072, value: this.note.website.value },
        { number: 1078, value: this.note.instagram.value },
        { number: 1083, value: this.note.logo.value },
        { number: 1081, value: this.note.experience.value },
        { number: 1066, value: this.note.newBusiness.value },
        { number: 1064, value: this.note.typeOfBuisiness.value },
        { number: 1071, value: this.note.contactTime.value },
        { number: 1067, value: this.note.information.value },
        { number: 1068, value: this.note.indications.value },
        { number: 1069, value: this.note.suggestion.value },
        { number: 1070, value: this.note.pending.value },
        { number: 1082, value: this.note.details.value },
        { number: 1076, value: this.note.facebook.link },
        { number: 1077, value: this.note.facebook.likes },
        { number: 1079, value: this.note.instagram.link },
        { number: 1080, value: this.note.instagram.likes },
        { number: 1073, value: this.note.website.link },
        { number: 1074, value: this.note.website.type },
        { number: 1065, value: this.note.newBusiness.years },
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
        if (answer.answer != "null") {
          if (answer.question_id === 1075)
            this.note.facebook.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1072)
            this.note.website.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1078)
            this.note.instagram.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1083)
            this.note.logo.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1081)
            this.note.experience.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1066)
            this.note.newBusiness.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1064)
            this.note.typeOfBuisiness.value = JSON.parse(answer.answer);
          if (answer.question_id === 1071)
            this.note.contactTime.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1067)
            this.note.information.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1068)
            this.note.indications.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1069)
            this.note.suggestion.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1070)
            this.note.pending.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1082)
            this.note.details.value =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1076) {
            this.note.facebook.link =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          }
          if (answer.question_id === 1077)
            this.note.facebook.likes =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1079)
            this.note.instagram.link =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1080)
            this.note.instagram.likes =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1073)
            this.note.website.link =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1074)
            this.note.website.type =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
          if (answer.question_id === 1065)
            this.note.newBusiness.years =
              answer.answer === 0 || answer.answer === "0" ? "" : answer.answer;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.aaa {
  visibility: hidden !important;
}
</style>
