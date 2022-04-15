<template>
  <b-modal
    v-model="show"
    :title="
      (type == 1 ? 'New Note' : 'History Note') + ' (Lead: ' + leadName + ')'
    "
    title-tag="h3"
    hide-footer
    size="lg"
    @hidden="close"
  >
    <validation-observer ref="form">
      <div>
        <b-row>
          <b-col lg="12" v-if="type == 2">
            <b-table small :fields="table.fields" :items="notes">
              <template #cell(created_by)="data">
                {{ data.item.created_by_name }} |
                {{ data.item.created_at | myDateGlobal }}
              </template>

              <template #cell(important)="data">
                <input
                  type="radio"
                  name="notes"
                  :id="'imp' + data.item.id"
                  @click="importantNote(data.item.id)"
                  :checked="data.item.important == 1 ? true : false"
                  :disabled="onlyRead"
                />
              </template>
            </b-table>
          </b-col>
          <b-col lg="12" v-if="type == 1">
            <validation-provider rules="required" #default="{ errors }">
              <b-form-group :state="errors.length > 0 ? false : null">
                <b-form-textarea
                  rows="9"
                  v-model="text"
                  :state="errors.length > 0 ? false : null"
                >
                </b-form-textarea>
              </b-form-group>
            </validation-provider>

            <b-form-group>
              <b-row>
                <b-col>
                  <b-form-checkbox v-model="important" :disabled="imp">
                    Important
                  </b-form-checkbox>
                </b-col>
                <b-col class="text-right">
                  <b-button variant="primary" @click="saveNote">
                    Save
                  </b-button>
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </validation-observer>
  </b-modal>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";

// Services
import NotesService from "@/views/crm/services/notes";

export default {
  props: {
    notes: {
      type: Array,
    },
    leadName: {
      type: String,
    },
    type: {
      type: Number,
      default: 1,
    },
    userId: {
      type: Number,
    },
    leadId: {
      type: Number,
    },
    imp: {
      type: Boolean,
    },
    replyId: {
      type: Number,
    },
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      show: false,

      // Validations
      required,

      table: {
        fields: [
          { key: "text", label: "Note" },
          { key: "created_by", label: "Created By" },
          { key: "important", label: "Important" },
        ],
      },

      text: "",
      important: this.imp,
      errorText: false,
    };
  },
  mounted() {},
  computed: {
    onlyRead() {
      return this.module == 18;
    },
  },
  methods: {
    async importantNote(id) {
      try {
        const confirm = await this.showGenericConfirmSwal({
          text: "You are going to change the important note!",
        });

        if (confirm.value) {
          const response = await NotesService.postMakeImportantNote({
            id: id,
            user_id: this.userId,
            lead_id: this.leadId,
            reply_id: this.replyId,
          });

          if (response.status == 200) {
            this.$emit("newImportant", response.data[0]);

            this.showGenericToast({
              text: "Successful operation",
            });

            this.close();
          }
        }
      } catch (error) {
        throw error;
      }
    },
    async saveNote() {
      try {
        const validate = await this.$refs.form.validate();

        if (validate) {
          this.addPreloader();

          const response = await NotesService.postCreateNote({
            user_id: this.userId,
            lead_id: this.leadId,
            text: this.text,
            important: this.important == true ? 1 : 0,
            reply_id: this.replyId,
          });

          if (response.status == 200) {
            this.$emit("newImportant", response.data[0]);

            this.showGenericToast({
              text: "Successful operation",
            });
            
            this.close();
          }

          this.removePreloader();
        }
      } catch (error) {
        this.removePreloader();
        throw error;
      }
    },
    close() {
      this.$emit("onClose");
    },
  },
  created() {
    this.show = true;
  },
};
</script>

<style>
</style>
