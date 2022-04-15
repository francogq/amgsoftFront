<template>
  <div>
    <b-card body-class="px-2">
      <template #header>
        <b-card-title class="card-title-address px-2">
          <div>Notes</div>
          <span>
            <b-button
              variant="warning"
              size="sm"
              class="btn-icon"
              @click="openModalNotes(2)"
              v-if="lead.count_notes != 0"
              style="margin-right: 5px"
            >
              <feather-icon icon="ListIcon"></feather-icon>
            </b-button>
            <b-button
              variant="warning"
              size="sm"
              class="btn-icon"
              v-if="lead.count_notes != 0"
              @click="openModalNotes(1)"
              style="margin-right: 5px"
            >
              <feather-icon icon="PlusIcon"></feather-icon>
            </b-button>
            <b-button
              variant="outline-danger"
              size="sm"
              @click="cancelEditNote"
              v-if="btnsEditNotes"
              style="margin-right: 5px"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              size="sm"
              @click="updateImportantNote"
              v-if="btnsEditNotes"
            >
              Confirm
            </b-button>
          </span>
        </b-card-title>
      </template>

      <div class="col-md-12" style="height: 243px">
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <b-form-textarea
                class="text-area-box roboto-class"
                id="textarea-notes"
                style="
                  border-radius: 5px;
                  width: 100%;
                  height: 187px;
                  padding: 10px;
                  max-height: 191px;
                  font-size: 15px;
                  color: #676767;
                "
                name="text"
                cols="30"
                rows="3"
                v-model="note.text"
                @click="editNote"
              ></b-form-textarea>
            </div>
          </div>
        </div>
      </div>
    </b-card>

    <modal-notes
      v-if="showModalNotes"
      :notes="this.dataHistoryNotes"
      :leadName="this.personalInfo.nickname"
      :type="this.type"
      :userId="this.currentUser.user_id"
      :leadId="this.personalInfo.id_lead"
      :imp="note.text == '' ? true : false"
      :replyId="reply.reply_id"
      @newImportant="setNewImportantNote"
      @onClose="closeModalNotes"
    ></modal-notes>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// Components
import ModalNotes from "./ModalNotes.vue";

// Services
import NotesService from "@/views/crm/services/notes";

export default {
  props: {
    notes: {
      type: Object,
      default: () => ({}),
    },
    reply: {
      type: Object,
      default: () => ({}),
    },
    personalInfo: {
      type: Object,
      default: () => ({}),
    },
    lead: {
      type: Object,
    },
  },
  components: {
    ModalNotes,
  },
  data() {
    return {
      note: {
        id: this.reply.id_note,
        user_id: "",
        lead_id: this.lead.id,
        text: this.reply.content_note,
        reply_id: this.reply.reply_id,
      },
      dataHistoryNotes: [],
      type: "",
      btnsEditNotes: false,

      // Modals
      showModalNotes: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    async openModalNotes(type) {
      try {
        if (type == 2) {
          this.addPreloader();
          const response = await NotesService.getLeadNotes({
            lead_id: this.lead.id,
            reply_id: this.reply.reply_id,
          });

          if (response.status == 200) {
            this.dataHistoryNotes = response.data;
            this.type = 0;
            this.modalHistoryNotes = true;
          }
          this.removePreloader();
        }

        this.type = type;
        this.showModalNotes = true;
      } catch (error) {
        throw error;
      }
    },
    closeModalNotes() {
      this.showModalNotes = false;
    },
    editNote() {
      this.btnsEditNotes = true;
    },
    cancelEditNote() {
      this.btnsEditNotes = false;
    },
    setNewImportantNote(newVal) {
      this.note = newVal;
      this.note.user_id = this.note.created_by;
      this.reply.content_note = newVal.text;
      this.reply.id_note = newVal.id;
    },
    async updateImportantNote() {
      try {
        const confirm = await this.showConfirmSwal();

        if (confirm.value) {
          const response = await NotesService.postUpdateLeadNote(this.note);

          if (response.status == 200 || response.status == 201) {
            this.note.id = response.data[0].id;
            this.note.user_id = response.data[0].created_by;
            this.note.lead_id = response.data[0].lead_id;
            this.note.text = response.data[0].text;

            this.reply.content_note = response.data[0].text;
            this.reply.id_note = response.data[0].id;
            this.btnsEditNotes = false;
          }
        }
      } catch (error) {
        throw error;
      }
    },
  },
  created() {
    this.note.user_id = this.currentUser.user_id;
  },
};
</script>

<style lang="scss" scoped>
</style>
