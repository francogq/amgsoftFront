<template>
  <b-card body-class="px-0">
    <template #header>
      <b-card-title>
        Notes &nbsp;
        <span>
          <a class="text-important"> </a>
        </span>
      </b-card-title>
    </template>

    <b-container>
      <validation-observer ref="importantNoteForm">
        <validation-provider
          #default="{ errors }"
          name="Content"
          rules="required"
        >
          <b-form-group :state="errors.length > 0 ? false : null">
            <b-form-textarea
              id="textarea"
              rows="10"
              placeholder="..."
              v-model="note.text"
              :readonly="!editImportantNote"
              :state="errors.length > 0 ? false : null"
            />
          </b-form-group>
        </validation-provider>
      </validation-observer>

      <b-row>
        <b-col md="6">
          <template v-if="!dontHaveNote">
            <template v-if="!editImportantNote">
              <b-button
                size="sm"
                variant="info"
                class="btn-icon rounded-circle p-0"
                style="padding: 5px !important"
                v-if="!editImportantNote"
                @click="enableForm"
              >
                <feather-icon
                  icon="Edit2Icon"
                  size="10"
                  class="cursor-pointer"
                />
              </b-button>
            </template>
            <template v-else>
              <b-button
                size="sm"
                variant="outline-success"
                class="btn-icon rounded-circle"
                @click="updateImportantNote"
              >
                <feather-icon icon="CheckIcon" class="font-small-3" />
              </b-button>
              <b-button
                size="sm"
                style="margin-left: 5px"
                variant="outline-danger"
                class="btn-icon rounded-circle"
                @click="disableForm"
              >
                <feather-icon icon="XIcon" class="font-small-3" />
              </b-button>
            </template>
          </template>
        </b-col>
        <b-col md="6" class="text-right">
          <b-button
            variant="flat-dark"
            class="btn-icon"
            @click="openModalViewNotes"
          >
            <feather-icon icon="ListIcon" size="18" />
          </b-button>
          <b-button variant="primary" class="ml-1" @click="openModalCreateNote">
            ADD
          </b-button>
        </b-col>
      </b-row>
    </b-container>

    <modal-create-note
      v-if="showModalCreateNote"
      :lead="lead"
      @newImportant="setNewImportantNote"
      @onClose="closeModalCreateNote"
    ></modal-create-note>
    <modal-view-notes
      v-if="showModalViewNotes"
      :lead="lead"
      @newImportant="setNewImportantNote"
      @onClose="closeModalViewNotes"
    ></modal-view-notes>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";

import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";

// Components
import ModalCreateNote from "./ModalCreateNote.vue";
import ModalViewNotes from "./ModalViewNotes.vue";

// Services
import NotesService from "@/views/crm/services/notes";

export default {
  props: {
    lead: {
      type: Object,
      required: true,
    },
  },
  components: {
    ValidationProvider,
    ValidationObserver,

    ModalCreateNote,
    ModalViewNotes,
  },
  data() {
    return {
      // Validations
      required,

      note: {
        id: "",
        text: "",
      },

      editImportantNote: false,

      // Modals
      showModalCreateNote: false,
      showModalViewNotes: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    dontHaveNote() {
      return this.note.id === "";
    },
  },
  watch: {
    lead(newVal) {
      this.getImportantNote();
    },
  },
  methods: {
    openModalCreateNote() {
      this.showModalCreateNote = true;
    },
    closeModalCreateNote() {
      this.showModalCreateNote = false;
    },
    openModalViewNotes() {
      this.showModalViewNotes = true;
    },
    closeModalViewNotes() {
      this.showModalViewNotes = false;
    },
    setNewImportantNote(newVal) {
      this.note = newVal;
      this.note.user_id = this.note.created_by;
    },
    enableForm() {
      this.editImportantNote = true;
      this.backupNote = this.form;
    },
    disableForm() {
      this.editImportantNote = false;
    },
    getImportantNote() {
      [this.note] = JSON.parse(this.lead.notes);
    },
    async updateImportantNote() {
      const validate = await this.$refs.importantNoteForm.validate();

      if (validate) {
        const confirm = await this.showConfirmSwal();

        if (confirm.value) {
          const response = await NotesService.postUpdateLeadNote({
            id: this.note.id,
            lead_id: this.lead.id,
            text: this.note.text,
            user_id: this.currentUser.user_id,
          });

          if (response.status == 200) {
            this.note = response.data[0];
            this.disableForm();
          }
        }
      }
    },
  },
  created() {
    if (this.lead.notes) {
      this.getImportantNote();
    }
  },
  mounted() {},
};
</script>

<style lang="scss" >
</style>