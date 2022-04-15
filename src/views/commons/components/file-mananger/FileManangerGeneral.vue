<template>
  <div>
    <b-card>
      <header-slot no-border-bottom>
        <template #actions>
          <b-row>
            <b-col
              class="d-flex align-items-end justify-content-end flex-column"
            >
              <div>
                <b-button
                  class="mr-1"
                  variant="outline-info"
                  @click="openModalNewFolder"
                >
                  New Folder
                </b-button>
                <b-button
                  variant="outline-primary"
                  @click="openUploadFileMoadl"
                >
                  Add Files
                </b-button>
              </div>
            </b-col>
          </b-row>
        </template>
      </header-slot>
    </b-card>
    <b-card>
      <b-row class="pl-1">
        <template v-for="(route, index) in history">
          <div
            :key="index"
            class="d-flex align-items-center justify-content-between cursor-pointer"
            @click="historyClicked(index)"
          >
            <feather-icon
              class="font-medium-5"
              :icon="route.icon"
              :class="{
                'text-warning': route.icon === '',
                'text-primary': route.icon === 'HomeIcon',
              }"
            />
            <span
              class="ml-50 d-flex align-items-center justify-content-center font-medium-1"
              >{{ route.label }}</span
            >
            <span class="font-large-1 ml-50">/</span>
          </div>
        </template>
      </b-row>
    </b-card>
    <b-card class="p-0" body-class="py-0">
      <b-row class="my-1">
        <b-col class="d-flex align-items-center justify-content-end py-0">
          <b-form-radio-group
            buttons
            button-variant="outline-primary"
            v-model="selectedView"
          >
            <b-form-radio :value="true">
              <feather-icon icon="FolderIcon" size="18" />
            </b-form-radio>
            <b-form-radio :value="false">
              <feather-icon icon="ListIcon" size="18" />
            </b-form-radio>
          </b-form-radio-group>
        </b-col>
      </b-row>
      <b-row class="mb-4" v-if="selectedView">
        <b-col
          v-for="(content, index) in currentFiles"
          :key="index"
          cols="6"
          sm="4"
          md="3"
          lg="2"
          xl="2"
          :class="skin === 'dark' ? 'hover-shadow-dark' : 'hover-shadow-light'"
        >
          <file-component
            :current-user="currentUser"
            :content="content"
            @contentClicked="contentClicked"
            @details="openFileDetail"
            @deleteFile="deleteFile"
            @shareFile="openShareFileModal"
            @edit="updateEditState"
          />
        </b-col>
      </b-row>
      <b-row class="mb-1" v-else>
        <b-table :fields="fields" :items="currentFiles" responsive>
          <template #cell(file_name)="data">
            <span
              v-if="selectedFile !== data.item || !editState"
              class="
                cursor-pointer
                d-flex
                align-items-center
                justify-content-start
              "
              @click="contentClicked(data.item)"
            >
              <amg-icon
                :icon="
                  data.item.extension ? 'CustomFileIcon' : 'CustomFolderIcon'
                "
                :style="data.item.type === 'Folder' ? 'fill: #ff9f43' : ''"
                class="mr-50"
                :class="{ 'text-warning': data.item.type === 'Folder' }"
                size="15"
              />
              <span class="font-small-4">{{
                data.item.file_name +
                (data.item.extension ? "." + data.item.extension : "")
              }}</span>
            </span>
            <b-form-input
              v-else
              v-model="selectedFile.file_name"
              size="sm"
              @keyup.enter="renameFile(data.item)"
              @blur="renameFile(data.item)"
            />
          </template>
          <template #cell(countfiel)="data">
            <span v-if="!data.item.extension">{{ data.item.countfiel }}</span>
            <span v-else>{{ data.item.size }}</span>
          </template>
          <template #cell(user_upload)="data">
            <p>{{ data.item.user_upload }}</p>
            <p>{{ data.item.created_at | myGlobalWithHour }}</p>
          </template>
          <template #cell(user_modified)="data">
            <div v-if="data.item.user_modified">
              <p>{{ data.item.user_modified }}</p>
              <p>{{ data.item.updated_at | myGlobalWithHour }}</p>
            </div>
          </template>
          <template #cell(actions)="data">
            <b-row>
              <b-col
                v-if="currentUser.modul_id === data.item.module_id"
                class="d-flex align-items-center justify-content-around"
              >
                <feather-icon
                  class="text-primary cursor-pointer"
                  icon="EditIcon"
                  size="15"
                  @click="
                    selectedFile = currentFiles[data.index];
                    updateEditState(true);
                  "
                />
                <feather-icon
                  class="text-danger cursor-pointer"
                  icon="TrashIcon"
                  size="15"
                  @click="asyncDeleteFile(data.item)"
                />
                <feather-icon
                  v-if="data.item.parent == null"
                  class="text-success cursor-pointer"
                  icon="Share2Icon"
                  size="15"
                  @click="openShareFileModal(data.item)"
                />
              </b-col>
            </b-row>
          </template>
        </b-table>
      </b-row>
    </b-card>
    <b-sidebar id="sidebar-right" right bg-variant="white" lazy backdrop>
      <b-container>
        <b-row class="mb-1">
          <b-col
            v-if="selectedFile !== {}"
            class="d-flex align-items-center justify-content-center"
          >
            <amg-icon
              size="50"
              :icon="
                selectedFile.type === 'Folder'
                  ? 'CustomFolderIcon'
                  : 'CustomFileIcon'
              "
              :class="{ 'text-warning': selectedFile.type === 'Folder' }"
            />
          </b-col>
        </b-row>
        <b-row class="border-bottom border-bottom-2">
          <b-col class="d-flex align-items-center justify-content-center">
            <h3 class="font-weight-bolder">
              {{ selectedFile.file_name }}
            </h3>
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col>
            <p class="font-medium-1">
              Created: {{ selectedFile.created_at | myGlobal }} by
              {{ selectedFile.user_upload }}
            </p>
          </b-col>
        </b-row>
        <b-row v-if="selectedFile.updated_at" class="mt-10">
          <b-col>
            <p class="font-medium-1">
              Updated: {{ selectedFile.updated_at | myGlobal }}
            </p>
          </b-col>
        </b-row>
        <b-row v-if="selectedFile.type === 'Folder'" class="mt-10">
          <b-col>
            <p class="font-medium-1">Files: {{ selectedFile.countfiel }}</p>
          </b-col>
        </b-row>
        <b-row v-else class="mt-10">
          <b-col>
            <p class="font-medium-1">Size: {{ selectedFile.size }}</p>
          </b-col>
        </b-row>
        <b-row class="mt-10">
          <b-col>
            <p class="font-medium-1">Route: {{ currentRoute }}</p>
          </b-col>
        </b-row>
        <b-row class="mt-10">
          <b-col>
            <p class="font-medium-1">
              Permissions:
              <span v-if="currentUser.modul_id == selectedFile.module_id">
                Rename, Delete,
                <span v-if="selectedFile.parent == null">Share</span>
              </span>
              <span v-else>None</span>
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-button
              v-b-toggle.sidebar-right
              variant="primary"
              class="w-100"
              @click="contentClicked(selectedFile)"
              >Open</b-button
            >
          </b-col>
        </b-row>
      </b-container>
    </b-sidebar>
    <share-file-modal
      v-if="shareFileModal"
      :selected-file="selectedFile"
      :show-modal="shareFileModal"
      @closeModal="closeShareFileModal"
    />
    <new-folder-modal
      v-if="newFolderModal"
      :current-user="currentUser"
      :show-modal="newFolderModal"
      :current-folder="currentFolder"
      :current-folder-module="currentFolderModule"
      @closeModal="closeModalNewFolder"
      @closeModalAndRefresh="closeModalNewFolderAndRefresh"
    />
    <b-modal
      v-model="uploadFileModal"
      title="Upload File"
      modal-class="modal-primary"
      body-class="p-50"
      button-size="sm"
      ok-title="Ok"
      :hide-footer="files.length === 0"
      centered
      @hidden="actionOnHideUploadFileModal"
    >
      <drag-and-drop v-model="files" :files-array="files" />
      <template #modal-footer>
        <b-button variant="primary" @click="onUploadFile"> Upload </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { VBTooltip } from "bootstrap-vue";
import FileComponent from "@/views/commons/components/file-mananger/components/FileComponent";
import ShareFileModal from "@/views/commons/components/file-mananger/modals/ShareFileModal";
import NewFolderModal from "@/views/commons/components/file-mananger/modals/NewFolderModal";
import DragAndDrop from "@/views/commons/utilities/DragAndDrop";
import { mapGetters } from "vuex";

export default {
  name: "FileManangerGeneral",
  components: {
    DragAndDrop,
    NewFolderModal,
    ShareFileModal,
    FileComponent,
  },
  directives: {
    "b-tooltip": VBTooltip,
  },
  props: {
    currentUser: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editState: false,
      fileModel: {
        model: false,
      },
      selectedView: true,
      fields: [
        {
          key: "file_name",
          label: "File Name ",
        },
        {
          key: "countfiel",
          label: "Files/Size",
          class: "text-center",
        },
        {
          key: "user_upload",
          label: "Created By",
          class: "text-center",
        },
        {
          key: "user_modified",
          label: "Modified By",
          class: "text-center",
        },
        {
          key: "actions",
          label: "Actions",
        },
      ],
      shareFileModal: false,
      newFolderModal: false,
      uploadFileModal: false,
      selectedFile: {},
      history: [
        {
          label: "",
          icon: "HomeIcon",
          folderId: null,
          folderModule: this.currentUser.modul_id,
        },
      ],
      currentFiles: [],
      currentFolder: "",
      currentFolderModule: "",
      files: [],
    };
  },
  computed: {
    ...mapGetters({
      skin: "appConfig/skin",
    }),
    currentRoute() {
      let route = "";
      this.history.forEach((r) => {
        route += `${r.label}/`;
      });
      return route;
    },
  },
  async created() {
    await this.getFilesFromFolder(null);
  },
  methods: {
    updateEditState(state) {
      this.editState = state;
    },
    actionOnHideUploadFileModal() {
      this.files = [];
    },
    async onUploadFile() {
      try {
        const result = await this.showConfirmSwal();
        if (result.isConfirmed) {
          const formData = new FormData();
          this.files.forEach((file) => {
            formData.append("images[]", file, file.name);
          });
          this.addPreloader();
          formData.append("module_id", this.currentFolderModule);
          formData.append("folder_name", "");
          formData.append("user_id", this.currentUser.user_id);
          formData.append(
            "idfolder",
            this.currentFolder ? this.currentFolder : ""
          );
          const headers = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            // eslint-disable-next-line func-names
            onUploadProgress: function (progressEvent) {
              this.uploadPercentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            }.bind(this),
          };
          const response = await amgApi.post(
            "/file-manager/save-file-by-module",
            formData,
            headers
          );
          if (response.status === 200) {
            this.uploadFileModal = false;
            this.showSuccessSwal();
            await this.getFilesFromFolder(
              this.currentFolder,
              this.currentFolderModule
            );
          }
        }
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
    openUploadFileMoadl() {
      this.uploadFileModal = true;
    },
    async getFilesFromFolder(
      folderId,
      folderModule = this.currentUser.modul_id
    ) {
      try {
        this.addPreloader();
        const response = await amgApi.post(
          "/file-manager/search-files-manager",
          {
            module_id: folderModule,
            order: "asc",
            orderby: 2,
            parent: folderId,
            typee: null,
          }
        );
        this.currentFiles = [];
        this.currentFiles = response.data.data;
        this.currentFolder = folderId;
        this.currentFolderModule = folderModule;
        this.removePreloader();
      } catch (error) {
        this.showErrorSwal(error);
        this.removePreloader();
      }
    },
    async contentClicked(content) {
      if (content.type === "Folder") {
        await this.getFilesFromFolder(content.id, content.module_id);
        this.history.push({
          label: content.file_name,
          icon: "",
          folderId: content.id,
          folderModule: content.module_id,
        });
      } else {
        window.open(
          content.url,
          "_blank" // <- This is what makes it open in a new window.
        );
      }
    },
    openModalNewFolder() {
      this.newFolderModal = true;
    },
    closeModalNewFolder() {
      this.newFolderModal = false;
    },
    closeModalNewFolderAndRefresh() {
      this.newFolderModal = false;
      this.getFilesFromFolder(this.currentFolder, this.currentFolderModule);
    },
    openShareFileModal(content) {
      this.selectedFile = content;
      this.shareFileModal = true;
    },
    closeShareFileModal() {
      this.shareFileModal = false;
    },
    async historyClicked(index) {
      const route = this.history[index];
      await this.getFilesFromFolder(route.folderId, route.folderModule);
      this.history = this.history.slice(0, index + 1);
    },
    openFileDetail(content) {
      this.selectedFile = content;
    },
    async asyncDeleteFile(content) {
      const params = {
        file_id: content.id,
        user_id: this.currentUser.user_id,
      };
      try {
        const response = await this.showConfirmSwal();
        if (response.isConfirmed) {
          await amgApi.post("/file-manager/remove-file-from-module", params);
          this.showSuccessSwal("File has been deleted successfully");
          this.deleteFile(content);
        }
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
    deleteFile(content) {
      const index = this.currentFiles.indexOf(content);
      if (index > -1) this.currentFiles.splice(index, 1);
    },
    async renameFile(content) {
      const params = {
        file_id: content.id,
        name_file: this.selectedFile.file_name,
      };
      try {
        await amgApi.post("/file-manager/update-file-name", params);
      } catch (error) {
        this.showErrorSwal(error);
      }
      this.selectedFile = {};
    },
  },
};
</script>

<style scoped>
.hover-shadow-light,
.hover-shadow-dark {
  transition: box-shadow 0.3s;
}
.hover-shadow-dark:hover {
  box-shadow: 0 0 11px #191c24;
}
.hover-shadow-light:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
}
</style>
