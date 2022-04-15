<template>
  <validation-observer tag="b-row" ref="form">
    <b-col cols="12">
      <b-form-group label="Title" label-for="title">
        <validation-provider rules="required" v-slot="{ errors, valid }">
          <b-form-input
            id="title"
            placeholder="Title"
            v-model="quickNote.title"
            :state="errors[0] ? false : valid ? true : null"
          />
        </validation-provider>
        <!-- <b-form-valid-feedback>
          {{errors[0]}}
        </b-form-valid-feedback> -->
      </b-form-group>
    </b-col>
    <b-col cols="12">
      <b-form-group label="Quick Note" label-for="quick-note">
        <validation-provider rules="required" v-slot="{ errors, valid }">
          <b-form-textarea
            id="quick-note"
            rows="5"
            v-model="quickNote.body"
            placeholder="Quick Note"
            :state="errors[0] ? false : valid ? true : null"
            v-html="quickNote.body"
          />
        </validation-provider>
        <!-- <b-form-valid-feedback>
          {{errors[0]}}
        </b-form-valid-feedback> -->
      </b-form-group>
    </b-col>
  </validation-observer>
</template>

<script>
import { mapGetters } from "vuex";
import QuickNotesService from "./service/quick-notes.service";
export default {
  mounted() {
    if (this.quickNoteObj.id) {
      this.quickNote.title = this.quickNoteObj.title;
      this.quickNote.body = this.quickNoteObj.body;
      this.quickNote.id = this.quickNoteObj.id;
    }
  },
  props: {
    quickNoteObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      quickNote: {
        title: null,
        body: null,
        id: "",
        user_id: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    async saveQuickNote() {
      this.quickNote.user_id = this.currentUser.user_id;
      const result = await this.$refs.form.validate();
      if (result) {
        try {
          const data = await QuickNotesService.saveQuickNote(this.quickNote);
          this.showToast();
          this.$emit("closeModal");
        } catch (error) {
          this.showErrorSwal(error);
        }
      }
    },
  },
};
</script>

<style>
</style>