<template>
  <div>
    <b-modal
      v-model="show"
      :title="'History Notes (Lead: ' + lead.lead_name + ')'"
      title-tag="h3"
      title-class="text-white"
      id="modal-create-note"
      hide-footer
      size="lg"
      @hidden="close"
    >
      <validation-observer ref="createNoteForm">
        <validation-provider
          #default="{ errors }"
          name="Content"
          rules="required"
        >
          <b-form-group :state="errors.length > 0 ? false : null">
            <b-form-textarea
              rows="9"
              v-model="form.content"
              :state="errors.length > 0 ? false : null"
            ></b-form-textarea>
          </b-form-group>
        </validation-provider>

        <b-form-group>
          <b-row>
            <b-col>
              <b-form-checkbox v-model="form.important">
                Important
              </b-form-checkbox>
            </b-col>
            <b-col class="text-right">
              <b-button variant="primary" @click="saveNote"> Save </b-button>
            </b-col>
          </b-row>
        </b-form-group>
      </validation-observer>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";

// Services
import NotesService from "@/views/crm/services/notes";

export default {
  props: {
    lead: {
      type: Object,
    },
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      show: false,

      // Validations
      required,

      form: {
        content: "",
        important: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    async saveNote() {
      try {
        this.$refs.createNoteForm.validate().then(async (success) => {
          if (success) {
            this.addPreloader();

            const response = await NotesService.postCreateNote({
              user_id: this.currentUser.user_id,
              lead_id: this.lead.id,
              text: this.form.content,
              important: this.form.important,
            });

            if (response.status == 200) {
              this.$emit("newImportant", response.data[0]);

              this.showGenericToast({
                text: "Successful operation",
              });

              this.close();
            } else {
              this.showGenericToast({
                variant: "warning",
                title: "Warning!",
                icon: "AlertTriangleIcon",
                text: "Something went wrong. " + response.message,
              });
            }

            this.removePreloader();
            this.resetForm();
          }
        });
      } catch (error) {
        this.removePreloader();

        this.showGenericToast({
          variant: "danger",
          title: "Oop!",
          icon: "AlertOctagonIcon",
          text: this.generalInternalErrors(error),
        });

        throw error;
      }
    },
    close() {
      this.$emit("onClose");
    },
    resetForm() {
      this.form.content = "";
      this.form.important = "";
    },
  },

  created() {
    this.show = true;
  },
};
</script>

<style>
</style>