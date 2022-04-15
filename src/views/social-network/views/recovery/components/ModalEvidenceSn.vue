<template>
  <div>
    <b-modal
      v-model="mutableShow"
      :title="'Upload Evidence File (Lead: ' +  lead_name + ')'"
      title-tag="h3"
      title-class="text-white"
      id="modal-sn-upload-files"
      hide-footer
      size="lg"
      @hidden="close"
    >
      <b-container>
        <b-card>
            <b-input-group class="my-2">
                <template #prepend>
                    <b-input-group-text>LEAD NAME</b-input-group-text>
                </template>
                <b-form-input :value="lead_name" readonly />
            </b-input-group>

            <b-card-text>
                <h5 class="mb-1">ATTACH EVIDENCE</h5>
                <hr>
                <drag-and-drop v-model="files" :files-array="files" image="image" single />
            </b-card-text>
            <b-card-text class="text-center">
                <b-button variant="primary" @click="insertEvidence()">
                    <feather-icon icon="SaveIcon" size="15"></feather-icon>
                    ADD EVIDENCE
                </b-button>
            </b-card-text>
        </b-card>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

// Components
import DragAndDrop from "@/views/commons/utilities/DragAndDrop.vue";

export default {
  props: {
    show: {
      type: Boolean,
    },
    lead_id: {
      type: Number,
    },
    lead_name: {
      type: String,
    },
  },
  data() {
      return {
          image: 1,
      }
  },
  components: {
    "drag-and-drop" : DragAndDrop,
  },
  data() {
    return {
      mutableShow: this.show,

      files: [],
    };
  },
  methods: {
    ...mapActions('SocialNetworkLeadsStore', ['A_POST_EVIDENCE_SN_LEADS']),
    close() {
      this.$emit("onClose");
    },

    async insertEvidence() {
      const result = await this.showConfirmSwal(
        "Are you sure?",
        "You won't be able to revert this!",
        "question"
      )
      if (result.value) {
        this.addPreloader();
          const formData = new FormData();

          this.files.forEach(file => {
              formData.append('images[]', file, file.name);
          });
          formData.append('lead_id', this.lead_id);

          const response = await this.A_POST_EVIDENCE_SN_LEADS(formData);

          if (this.isResponseSuccess(response)) {
            this.showToast(
              "success",
              "top-right",
              "Saved!",
              "CheckIcon",
              "Your file has been saved."
            );
          } else {
            this.showToast(
              "warning",
              "top-right",
              "Warning!",
              "AlertTriangleIcon",
              `Something went wrong.${response.message}`
            );
          }

          this.$emit("onClose", {lead_id: this.lead_id, url_file: response.data});
          this.removePreloader();
        }
    },
  },
  created() {},
};
</script>

<style>
</style>