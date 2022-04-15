<template>
  <div
    class="ml-1"
    style="
      box-shadow: rgb(200 204 211 / 24%) 0px 0px 6px;
      height: 360px !important;
    "
  >
    <b-card body-class="px-0 " class="h-100">
      <template #header>
        <b-card-title class="font-weight-bolder"> Files </b-card-title>
      </template>
      <template #footer>
        <div class="text-right">
          <b-button variant="primary" @click="openModalUploadFiles()">
            <feather-icon icon="FileIcon"></feather-icon>
            UPLOAD FILES
          </b-button>
        </div>
      </template>
      <div class="table-side" v-if="files.length > 0">
        <b-table
          small
          :fields="table.fields"
          :items="files"
          sticky-header="220px"
        >
          <template #cell(file_name)="data">
            <div v-if="!editName[data.index].view">
              <div v-if="data.item.extension != null">
                <b-img
                  :src="$options.filters.extFile(data.item.extension)"
                  style="width: 15px; margin-right: 5px"
                ></b-img>
                <a
                  :href="data.item.route"
                  target="_blank"
                  style="cursor: pointer"
                >
                  {{ data.item.file_name }}.{{ data.item.extension }}
                </a>
              </div>
            </div>
            <div v-if="editName[data.index].view">
              <div class="custom-form-group">
                <div class="input">
                  <validation-observer ref="formUpdateFileName">
                    <validation-provider
                      #default="{ errors }"
                      name="File Name"
                      rules="required"
                    >
                      <b-form-input
                        type="text"
                        :style="
                          errornamefile
                            ? 'border:1px solid red !important;'
                            : ''
                        "
                        v-model="data.item.custom_file_name"
                        @keyup.enter="updateFileName(data.item)"
                        @keyup.esc="
                          cancelEditFileName(data.index, data.item.file_name)
                        "
                        :state="errors.length > 0 ? false : null"
                      />
                    </validation-provider>
                  </validation-observer>
                </div>

                <div class="content-buttons">
                  <b-button
                    variant="flat-success"
                    class="btn-icon rounded-circle"
                    style="padding: 3px"
                    @click="updateFileName(data.item)"
                  >
                    <feather-icon icon="CheckIcon" />
                  </b-button>
                  <b-button
                    variant="flat-danger"
                    class="btn-icon rounded-circle"
                    style="padding: 3px"
                    @click="cancelEditFileName(data.index, data.item.file_name)"
                  >
                    <feather-icon icon="XIcon" />
                  </b-button>
                </div>
              </div>
            </div>
          </template>

          <template #cell(created_by)="data">
            <span>{{ data.item.user_upload }}</span>
            <br />
            <span>{{ data.item.created_at | myGlobalDay }}</span>
          </template>

          <template #cell(actions)="data">
            <b-button
              size="sm"
              variant="flat-warning"
              class="btn-icon rounded-circle"
              style="padding: 4px"
              title="Rename File"
              @click="editFileName(data.index, data.item)"
            >
              <feather-icon icon="Edit2Icon"></feather-icon>
            </b-button>
            <b-button
              size="sm"
              variant="flat-danger"
              class="btn-icon rounded-circle"
              style="padding: 4px"
              title="Delete File"
              @click="deleteFile(data.item.id)"
            >
              <feather-icon icon="TrashIcon"></feather-icon>
            </b-button>
          </template>
        </b-table>
      </div>
    </b-card>

    <modal-upload-files
      v-if="showModalUploadFiles"
      :lead="lead"
      :replyId="replyId"
      @onSaved="filesSaved"
      @onClose="closeModalUploadFiles"
    ></modal-upload-files>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// Components
import ModalUploadFiles from "@/views/social-network/views/leads/components/ModalUploadFiles.vue";

// Services
import SNLeadService from "@/views/social-network/services/leads";

export default {
  props: {
    replyId: Number,
    lead: {
      type: Object,
    },
  },
  components: {
    ModalUploadFiles,
  },
  data() {
    return {
      table: {
        fields: [
          { key: "file_name", label: "File Name", sortable: true },
          { key: "created_by", label: "Created By", sortable: true },
          { key: "actions", label: "Actions" },
        ],
      },

      //files
      files: [],
      sort: null,
      dato2: null,
      modalCreateFile: false,
      name_file: "",
      editName: [],
      errornamefile: false,

      // Modals
      showModalUploadFiles: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    idParam() {
      return this.$route.params.id;
    },
  },
  methods: {
    openModalUploadFiles() {
      this.showModalUploadFiles = true;
    },
    closeModalUploadFiles() {
      this.showModalUploadFiles = false;
    },
    async getFiles() {
      try {
        const response = await SNLeadService.getLeadFiles({
          id_lead: this.idParam,
          orderby: 1,
          order: "asc",
          reply_id: this.replyId,
        });

        if (response.status == 200) {
          this.files = response.data;
          this.editName = [];

          this.files.forEach((value, index) => {
            this.editName.push({ id: index, view: false });
            this.$set(value, "custom_file_name", null);
          });
        }
      } catch (error) {
        throw error;
      }
    },
    editFileName(index, item) {
      this.editName[index].view = true;
      item.custom_file_name = item.file_name;
    },
    cancelEditFileName(index, name) {
      this.name_file = name;
      this.editName[index].view = false;
      this.errornamefile = false;
    },
    async filesSaved() {
      this.closeModalUploadFiles();
      await this.getFiles();
    },
    async updateFileName(item) {
      try {
        this.name_file = item.custom_file_name;

        if (this.name_file.trim() == "") {
          this.errornamefile = true;
        } else {
          this.errornamefile = false;

          const confirm = await this.showGenericConfirmSwal({});

          if (confirm.value) {
            this.addPreloader();

            const response = await SNLeadService.updateFileName({
              file_id: item.id,
              name_file: this.name_file,
              user_id: this.currentUser.user_id,
            });

            if (response.status == 200) {
              this.getFiles();
            }

            this.removePreloader();
          }
        }
      } catch (error) {
        this.removePreloader();
        throw error;
      }
    },
    async deleteFile(id) {
      try {
        const confirm = await this.showGenericConfirmSwal({});

        if (confirm.value) {
          this.addPreloader();

          const response = await SNLeadService.deleteFile({
            file_id: id,
            user_id: this.currentUser.user_id,
          });

          if (response.status == 200) {
            this.getFiles();

            this.showGenericToast({
              text: "Successful operation",
            });
          }

          this.removePreloader();
        }
      } catch (error) {
        throw error;
      }
    },
  },
  async created() {
    await this.getFiles();
  },
};
</script>

<style lang="scss" >
.custom-form-group {
  display: flex;
  justify-content: space-around;
  align-items: center;

  .input {
    width: 70%;
  }

  .content-buttons {
    margin-left: 10px;
    width: 30%;
  }
}
</style>
