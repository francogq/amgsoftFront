<template>
  <b-modal
    v-model="ownControl"
    title-class="h3 text-white"
    size="lg"
    hide-footer
    :title="`Add Note (Lead: ${lead.lead_name})`"
    scrollable
    @hidden="closeModal"
    modal-class="modal-primary"
  >
    <validation-observer ref="form">
      <b-container fluid>
        <b-row>
          <b-col md="12">
            <validation-provider v-slot="{ errors }" name="noteText" rules="required">
              <b-form-textarea
                v-model="noteText"
                rows="10"
                :class="{'border-danger rounded': errors[0]}"
              />
            </validation-provider>
          </b-col>
          <b-col class="mt-1">
            <b-form-checkbox v-model="noteImportant">Important</b-form-checkbox>
          </b-col>
          <b-col class="mt-1 d-flex align-items-center justify-content-end">
            <button-save @click="saveNewNote" />
          </b-col>
        </b-row>
      </b-container>
    </validation-observer>
  </b-modal>
</template>

<script>
import { mapGetters } from "vuex";
import ButtonSave from "@/views/commons/utilities/ButtonSave.vue";

export default {
  name: "AddNotesModal",
  components: { ButtonSave },
  props: {
    lead: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      ownControl: false,
      noteText: "",
      noteImportant: false
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    })
  },
  async created() {
    this.ownControl = true;
  },
  methods: {
    closeModal() {
      this.ownControl = false;
      this.$emit("close");
    },
    async saveNewNote() {
      const resolve = await this.$refs.form.validate();
      if (resolve) {
        const result = await this.showConfirmSwal();
        if (result.value) {
          try {
            this.addPreloader();
            const response = await amgApi.post("/note/note/notes-create", {
              important: this.noteImportant ? 1 : 0,
              lead_id: this.lead.id,
              text: this.noteText,
              user_id: this.currentUser.user_id
            });
            if (response.status === 200) {
              this.closeModal();
              this.$emit("newImportant", response.data[0]);
            }
          } catch (error) {
            this.closeModal();
            this.showErrorSwal(error);
          } finally {
            this.removePreloader();
          }
        }
      }
    }
  }
};
</script>

<style scoped>
</style>
