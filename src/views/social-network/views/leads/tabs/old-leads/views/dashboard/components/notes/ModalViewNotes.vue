<template>
  <div>
    <b-modal
      v-model="show"
      :title="'History Notes (Lead: ' + lead.lead_name + ')'"
      title-tag="h3"
      id="modal-sn-view-notes"
      hide-footer
      size="lg"
      @hidden="close"
    >
      <b-table
        small
        sticky-header="60vh"
        :fields="fields"
        :items="notes"
        class="text-center"
      >
        <template #cell(created_by_name)="data">
          {{ data.item.created_by_name }} |
          {{ data.item.created_at | myGlobalWithHour }}
        </template>

        <template #cell(important)="data">
          <b-form-radio v-model="importantNote" :value="data.item">
          </b-form-radio>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
// Services
import NotesService from "@/views/crm/services/notes";

export default {
  props: {
    lead: {
      type: Object,
    },
  },
  data() {
    return {
      show: false,

      fields: [
        { key: "text", label: "Note" },
        { key: "created_by_name", label: "Created By" },
        { key: "important", label: "Important" },
      ],

      importantNote: {},
      notes: [],
    };
  },
  watch: {
    async importantNote(newValue, oldValue) {
      if (oldValue.id) {
        const resolve = await this.showConfirmSwal();
        if (resolve.value) {
          const response = await NotesService.postMakeImportantNote({
            id: newValue.id,
            lead_id: this.lead.id,
            user_id: parseInt(newValue.created_by, 10),
          });
          if (response.status === 200) {
            this.$emit("newImportant", response.data[0]);

            this.showGenericToast({
              text: "Successful operation",
            });

            this.close();
          }
        }
      }
    },
  },
  methods: {
    getImportant() {
      this.importantNote = this.notes.filter((val) => val.important === 1)[0];
    },
    async getNotes() {
      try {
        this.addPreloader();

        const response = await NotesService.getLeadNotes({
          lead_id: this.lead.id,
          reply_id: " ",
        });

        if (response.status == 200) {
          this.notes = response.data;
        }

        this.removePreloader();
      } catch (error) {
        this.removePreloader();

        throw error;
      }
    },
    close() {
      this.$emit("onClose");
    },
  },
  async created() {
    this.mutableShow = true;
    await this.getNotes();
    this.getImportant();

    this.show = true;
  },
};
</script>

<style lang="scss">
#modal-sn-view-notes {
  table {
    tr {
      td:nth-child(3) {
        display: flex;
        justify-content: center;
        padding-top: 15px;
      }
    }
  }
}
</style>