<template>
  <div>
    <b-modal
      modal
      centered
      :title="`${objectLead.leadname}`"
      v-model="mutableIfModalCard"
      size="lg"
      modal-class="modal-primary"
      hide-footer
      @hidden="closeModal"
      title-tag="h3"
    >
      <!-- Form -->
      <ValidationObserver ref="form">
        <b-row>
          <!-- Sub Title -->
          <b-col md="12">
            <b-row class="class-inline">
              <b-col
                md="5"
                class="class-campo-icon add-class-campo-icon"
                style="border-radius: 10px 10px 0px 0px"
              >
                <span>
                  COMMENT
                  {{
                    objectLead.status == "pending"
                      ? ""
                      : objectLead.cmm_datetime | myGlobalDay
                  }}
                </span>
              </b-col>
            </b-row>
          </b-col>
          <!-- Input Text Tarea Comment -->
          <b-col md="12">
            <ValidationProvider
              name="comment"
              rules="required"
              v-slot="{ errors }"
            >
              <div class="form-group mt-0">
                <b-form-textarea
                  class="textarea-style wysiwyg-notes w-100"
                  style="border-radius: 0px 10px 10px 10px; height: 120px"
                  :class="{ 'border-danger': errors[0] }"
                  v-model="comment"
                  :disabled="!statusPending"
                ></b-form-textarea>
              </div>
            </ValidationProvider>
          </b-col>
        </b-row>
        <!-- Button Save -->
        <b-row v-if="statusPending">
          <b-col md="12" style="text-align: center" class="mt-3">
            <b-button
              variant="success"
              style="border-radius: 5px !important"
              @click="changeStatus()"
              >Save</b-button
            >
          </b-col>
        </b-row>
      </ValidationObserver>
    </b-modal>
  </div>
</template>

<script>
// Import Services
import ListService from "../../service/lists.service";
export default {
  props: {
    ifModalCard: {
      type: Boolean,
    },
    objectLead: {
      type: Object,
      default: () => {},
    },
  },
  data: function () {
    return {
      comment: null,
      mutableIfModalCard: this.ifModalCard,
    };
  },
  computed: {
    statusPending: function () {
      return this.objectLead.status == "pending" ? true : false;
    },
  },
  methods: {
    closeModal: function () {
      this.$emit("close", false);
    },
    changeStatus: function () {
      this.$refs.form.validate().then(async (success) => {
        if (!success) {
          return;
        }
        const confirm = await this.showConfirmSwal(
          "Are you sure?",
          "You won't be able to revert this!"
        );
        if (confirm.isConfirmed) {
          try {
            const params = {
              id: this.objectLead.l_id,
              cmm: this.comment,
            };
            this.addPreloader();
            const data = await ListService.changeStatus(params);
            this.removePreloader();
            this.$emit("update", false);
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Saved Successfully"
            );
          } catch (error) {
            console.log(error);
            this.showErrorSwal(error);
          }
        }
      });
    },
    fillComment: function () {
      if (this.objectLead.status == "done" && this.objectLead.cmm != null) {
        this.comment = this.objectLead.cmm;
      }
    },
  },
  created:function() {
    this.fillComment();
  },
};
</script>