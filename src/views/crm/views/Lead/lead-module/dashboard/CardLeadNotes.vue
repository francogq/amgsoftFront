<template>
  <b-card>
    <template #header>
      <b-card-title>Notes</b-card-title>
    </template>
    <validation-observer ref="form">
      <b-row>
        <b-col>
          <validation-provider v-slot="{ errors }" name="noteText" rules="required">
            <b-form-textarea
              v-model="note.text"
              :disabled="onlyRead || textAreaDisabled"
              rows="8"
              :class="{'border-danger rounded' : errors[0]}"
            />
          </validation-provider>
        </b-col>
      </b-row>
      <b-row v-if="!dontHaveNote" class="font-small-3" style="margin-top: 3px">
        <b-col md="10" class="d-flex align-items-center justify-content-start">
          <span class="font-weight-bolder" style="margin-right: 2px">Created by:</span>
          {{ note.created_by_name }} (
          <feather-icon
            icon="CalendarIcon"
            size="12"
            style="margin-right: 4px; margin-bottom: 2px; margin-left: 2px"
          />
          {{ note.created_at | myGlobalWithHour }})
        </b-col>
        <b-col class="text-right">
          <b-button
            v-if="note.user_id === currentUser.user_id.toString()"
            size="sm"
            variant="info"
            class="btn-icon rounded-circle p-0"
            style="padding: 3px !important;"
            @click="enableTextArea"
          >
            <feather-icon icon="Edit2Icon" size="10" class="cursor-pointer" />
          </b-button>
        </b-col>
      </b-row>
      <b-row style="margin-top: 10px">
        <b-col v-if="!textAreaDisabled || dontHaveNote">
          <b-button
            size="sm"
            variant="outline-success"
            class="btn-icon rounded-circle"
            @click="clickCheckIcon"
          >
            <feather-icon icon="CheckIcon" class="font-small-3" />
          </b-button>
          <b-button
            size="sm"
            style="margin-left: 5px"
            variant="outline-danger"
            class="btn-icon rounded-circle"
            @click="clickXIcon"
          >
            <feather-icon icon="XIcon" class="font-small-3" />
          </b-button>
        </b-col>
        <b-col v-if="!dontHaveNote" class="d-flex align-items-center justify-content-end">
          <feather-icon
            icon="ListIcon"
            size="20"
            class="cursor-pointer"
            style="margin-right: 10px"
            @click="openHistoryModal"
          />
          <b-button variant="primary" @click="openAddNewNote">Add</b-button>
        </b-col>
      </b-row>
    </validation-observer>
    <history-notes-modal
      v-if="historyModal"
      :lead="lead"
      @close="closeHistoryModal"
      @newImportant="setNewImportantNote"
    />
    <add-notes-modal
      v-if="addNoteModal"
      :lead="lead"
      @close="closeAddNewNote"
      @newImportant="setNewImportantNote"
    />
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import HistoryNotesModal from "@/views/crm/views/Lead/lead-module/dashboard/modal/HistoryNotesModal.vue";
import AddNotesModal from "@/views/crm/views/Lead/lead-module/dashboard/modal/AddNotesModal.vue";

export default {
  components: { AddNotesModal, HistoryNotesModal },
  props: {
    modul: {
      type: Number,
      required: true
    },
    onlyRead: {
      type: Boolean,
      required: true
    },
    lead: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      note: {
        id: "",
        text: "",
        created: "",
        user_id: "",
        created_by: ""
      },
      textAreaDisabled: true,
      historyModal: false,
      addNoteModal: false
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    }),
    dontHaveNote() {
      return this.note.id === "";
    }
  },
  created() {
    if (this.lead.notes) {
      [this.note] = this.lead.notes;
      this.note.created_by_name = this.note.created_by;
      this.note.created_at = this.note.created;
    }
    if (this.dontHaveNote) this.textAreaDisabled = false;
  },
  methods: {
    enableTextArea() {
      this.textAreaDisabled = false;
    },
    disableTextArea() {
      this.textAreaDisabled = true;
    },
    clickXIcon() {
      if (this.dontHaveNote) this.note.text = "";
      else this.disableTextArea();
    },
    openAddNewNote() {
      this.addNoteModal = true;
    },
    closeAddNewNote() {
      this.addNoteModal = false;
    },
    openHistoryModal() {
      this.historyModal = true;
    },
    closeHistoryModal() {
      this.historyModal = false;
    },
    async clickCheckIcon() {
      const resolve = await this.$refs.form.validate();
      if (resolve) {
        const result = await this.showConfirmSwal();
        if (result.value) {
          if (this.dontHaveNote) {
            const response = await amgApi.post("/note/note/update-notes", {
              created_at: "",
              created_by: "",
              created_by_name: "",
              id: "",
              lead_id: this.lead.id,
              text: this.note.text,
              user_id: this.currentUser.user_id
            });
            if (response.status === 200) {
              [this.note] = response.data;
              this.note.user_id = this.note.created_by;
              this.disableTextArea();
            }
          } else {
            const response = await amgApi.post("/note/note/update-notes", {
              created_at: this.note.created_at,
              created_by: this.note.user_id,
              created_by_name: this.note.created_by_name,
              id: this.note.id,
              important: 1,
              lead_id: this.lead.id,
              text: this.note.text
            });
            if (response.status === 200) {
              [this.note] = response.data;
              this.note.user_id = this.note.created_by;
              this.disableTextArea();
            }
          }
        }
      }
    },
    setNewImportantNote(newImportant) {
      this.note = newImportant;
      this.note.user_id = this.note.created_by;
    }
  }
};
</script>
