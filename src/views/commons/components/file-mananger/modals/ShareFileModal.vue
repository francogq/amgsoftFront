<template>
  <b-modal
    v-model="ownShowModal"
    :title="'Share ' + selectedFile.file_name"
    hide-footer
    modal-class="modal-primary"
    no-close-on-backdrop
    @hidden="hideModal"
  >
    <b-row>
      <b-col>
        <b-form-group label="Select Modules" label-class="font-weight-bolder">
          <v-select
            v-model="selectedModules"
            :options="modulesList"
            label="name"
            multiple
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex align-items-center justify-content-end">
        <b-button variant="info" @click="shareFolderToModules">
          <feather-icon icon="Share2Icon" />Share
        </b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import vSelect from "vue-select";

export default {
  name: "ShareFileModal",
  components: {
    vSelect,
  },
  props: ["showModal", "selectedFile"],
  data() {
    return {
      modulesList: [],
      selectedModules: [],
      ownShowModal: false,
    };
  },
  async created() {
    await this.getListModules();
    await this.getSelectedModules();
    this.ownShowModal = this.showModal;
  },
  methods: {
    hideModal() {
      this.$emit("closeModal");
      this.ownShowModal = false;
    },
    async shareFolderToModules() {
      try {
        const result = await this.showConfirmSwal();
        if (result.isConfirmed) {
          const params = {
            idfolder: this.selectedFile.id,
            modules: this.selectedModules,
          };
          await amgApi.post("/file-manager/save-file-permission", params);
          this.showSuccessSwal();
          this.hideModal();
        }
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
    async getListModules() {
      try {
        const response = await amgApi.get("/module/get-modules");
        this.modulesList = response.data;
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
    async getSelectedModules() {
      try {
        const response = await amgApi.post(
          "/file-manager/verify-file-permission",
          { idfolder: this.selectedFile.id }
        );
        this.selectedModules = JSON.parse(response.data[0].share);
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
  },
};
</script>

<style scoped></style>
