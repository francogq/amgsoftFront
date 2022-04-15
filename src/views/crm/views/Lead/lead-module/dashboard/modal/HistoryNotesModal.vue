<template>
  <b-modal
    v-model="ownControl"
    size="lg"
    hide-footer
    :title="`History Notes (Lead: ${lead.lead_name})`"
    scrollable
    @hidden="closeModal"
    modal-class="modal-primary"
    title-class="h3 text-white"
  >
    <b-table :items="historyNotes" :fields="historyNotesFields" small fixed class="font-small-3">
      <template
        #cell(created_by_name)="data"
      >{{ data.item.created_by_name }} | {{ data.item.created_at | myGlobalWithHour }}</template>
      <template #cell(important)="data">
        <b-row>
          <b-col class="d-flex align-items-center justify-content-center">
            <b-form-radio v-model="importantNote" :value="data.item" />
          </b-col>
        </b-row>
      </template>
    </b-table>
  </b-modal>
</template>

<script>
export default {
  name: "HistoryNotesModal",
  props: {
    lead: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      ownControl: false,
      historyNotes: [],
      historyNotesFields: [
        {
          key: "text",
          label: "Note"
        },
        {
          key: "created_by_name",
          label: "Created by"
        },
        {
          key: "important",
          label: "Important",
          class: "text-center"
        }
      ],
      importantNote: {}
    };
  },
  watch: {
    async importantNote(newValue, oldValue) {
      if (oldValue.id) {
        const resolve = await this.showConfirmSwal();
        if (resolve.value) {
          const response = await amgApi.post("/note/note/important-note", {
            id: newValue.id,
            lead_id: this.lead.id,
            user_id: parseInt(newValue.created_by, 10)
          });
          if (response.status === 200) {
            this.$emit("newImportant", response.data[0]);
            this.closeModal();
          }
        }
      }
    }
  },
  async created() {
    await this.getHistoryLeadNotes();
    this.importantNote = this.historyNotes.filter(
      val => val.important === 1
    )[0];
    this.ownControl = true;
  },
  methods: {
    closeModal() {
      this.ownControl = false;
      this.$emit("close");
    },
    async getHistoryLeadNotes() {
      try {
        const response = await amgApi.post("/note/note/get-lead-notes", {
          lead_id: this.lead.id
        });
        if (response.status === 200) {
          this.historyNotes = response.data;
        }
      } catch (error) {
        this.showErrorSwal(error);
      }
    }
  }
};
</script>

<style scoped>
</style>
