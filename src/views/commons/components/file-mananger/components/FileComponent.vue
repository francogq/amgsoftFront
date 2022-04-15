<template>
  <div class="d-flex flex-column">
    <div
      v-b-tooltip.hover.b.bottom="content.file_name"
      class="w-100 d-flex flex-column align-items-center justify-content-center mt-50"
      @contextmenu.prevent="contentRightClicked"
    >
      <amg-icon
        :icon="
          content.type === 'Folder' ? 'CustomFolderIcon' : 'CustomFileIcon'
        "
        class="font-large-4 cursor-pointer"
        :style="content.type === 'Folder' ? 'fill: #ff9f43' : ''"
        :class="{ 'text-warning': content.type === 'Folder' }"
        @click="clickFile"
      />
      <h5 v-if="!edit" class="mt-1 text-center text w-100">
        {{ content.file_name }}
      </h5>
      <b-form-input
        v-else
        ref="editInput"
        v-model="newName"
        size="sm"
        @blur="renameFile"
      />
      <h6>
        {{ content.created_at | myGlobal }}
      </h6>
    </div>
    <b-dropdown
      ref="dropdown"
      class="bg-danger"
      style="width: 0px; height: 0px"
      variant="transparent"
      toggle-class="text-decoration-none"
      no-caret
    >
      <template #button-content />
      <b-dropdown-item
        v-b-toggle.sidebar-right
        @click="$emit('details', content)"
      >
        <feather-icon icon="InfoIcon" class="mr-50" />Details
      </b-dropdown-item>
      <div v-if="currentUser.modul_id === content.module_id">
        <b-dropdown-item @click="enableRenameFile">
          <feather-icon icon="EditIcon" class="mr-50" />Rename
        </b-dropdown-item>
        <b-dropdown-item @click="deleteFile">
          <feather-icon icon="TrashIcon" class="mr-50" />Delete
        </b-dropdown-item>
        <b-dropdown-item v-if="content.parent == null" @click="shareFile">
          <feather-icon icon="Share2Icon" class="mr-50" />Share
        </b-dropdown-item>
      </div>
    </b-dropdown>
  </div>
</template>

<script>
import { VBTooltip } from "bootstrap-vue";

export default {
  name: "FileComponent",
  directives: {
    "b-tooltip": VBTooltip,
  },
  props: ["content", "currentUser"],
  data() {
    return {
      edit: false,
      newName: "",
    };
  },
  methods: {
    contentRightClicked() {
      this.$refs.dropdown.show();
    },
    enableRenameFile() {
      this.newName = this.content.file_name;
      this.edit = true;
      this.$emit("edit", true);
    },
    async renameFile() {
      if (this.newName === this.content.file_name) {
        this.edit = false;
        return;
      }
      const params = {
        file_id: this.content.id,
        name_file: this.newName,
      };
      try {
        await amgApi.post("/file-manager/update-file-name", params);
        this.content.file_name = this.newName;
        this.showToast(
          "success",
          "top-right",
          "",
          "CheckIcon",
          "Rename success"
        );
      } catch (error) {
        this.showErrorSwal(error);
      }
      this.edit = false;
      this.$emit("edit", false);
    },
    async deleteFile() {
      const params = {
        file_id: this.content.id,
        user_id: this.currentUser.user_id,
      };
      try {
        const response = await this.showConfirmSwal();
        if (response.isConfirmed) {
          await amgApi.post("/file-manager/remove-file-from-module", params);
          this.showSuccessSwal("File has been deleted successfully");
          this.$emit("deleteFile", this.content);
        }
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
    shareFile() {
      this.$emit("shareFile", this.content);
    },
    clickFile() {
      this.edit = false;
      this.$emit("contentClicked", this.content);
    },
  },
};
</script>

<style scoped>
.text {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
