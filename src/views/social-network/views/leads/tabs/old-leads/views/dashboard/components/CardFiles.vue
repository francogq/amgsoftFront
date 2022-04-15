<template>
  <b-card body-class="px-0">
    <template #header>
      <b-card-title>
        Files &nbsp;
        <span>
          <a class="text-important"> </a>
        </span>
      </b-card-title>
    </template>

    <template v-if="files.length > 0">
      <b-table small :fields="table.fields" :items="files" class="text-center">
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
                        errornamefile ? 'border:1px solid red !important;' : ''
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
                  class="btn-icon"
                  variant="flat-success rounded-circle"
                  style="padding: 3px"
                  @click="updateFileName(data.item)"
                >
                  <feather-icon icon="CheckIcon" />
                </b-button>

                <span style="margin: 0px 5px">|</span>

                <b-button
                  class="btn-icon"
                  variant="flat-danger rounded-circle"
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
            @click="editFileName(data.index, data.item)"
            variant="flat-warning rounded-circle"
            class="btn-icon"
          >
            <feather-icon icon="EditIcon"></feather-icon>
          </b-button>
          <b-button
            @click="deleteFile(data.item.id)"
            variant="flat-danger rounded-circle"
            class="btn-icon"
          >
            <feather-icon icon="TrashIcon"></feather-icon>
          </b-button>
        </template>
      </b-table>
    </template>
    <div class="mt-2">
      <b-button
        variant="primary"
        class="float-right mr-2"
        @click="openModalUploadFiles()"
      >
        UPLOAD FILES
      </b-button>
    </div>

    <modal-upload-files
      v-if="showModalUploadFiles"
      :lead="lead"
      @onSaved="filesSaved"
      @onClose="closeModalUploadFiles"
    ></modal-upload-files>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";

// Services
import SNLeadService from "@/views/social-network/services/leads";

// Components
import ModalUploadFiles from "../../../../../components/ModalUploadFiles.vue";

export default {
  props: {
    lead: {
      type: Object,
      required: true,
    },
  },
  components: {
    ModalUploadFiles,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      // Validations
      required,

      table: {
        fields: [
          { key: "file_name", label: "File Name" },
          { key: "created_by", label: "Created By" },
          { key: "actions", label: "Actions" },
        ],
      },

      files: [],
      editName: [],
      fileName: "",

      // Modals
      showModalUploadFiles: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    openModalUploadFiles() {
      this.showModalUploadFiles = true;
    },
    closeModalUploadFiles() {
      this.showModalUploadFiles = false;
    },
    async filesSaved() {
      this.closeModalUploadFiles();
      await this.getFiles();
    },
    async getFiles() {
      try {
        const response = await SNLeadService.getLeadFiles({
          id_lead: 50486,
          orderby: 2,
          order: "asc",
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
    async updateFileName(file) {
      try {
        const validate = await this.$refs.formUpdateFileName.validate();

        if (validate) {
          const confirm = await this.showConfirmSwal();

          if (confirm.value) {
            this.addPreloader();

            const response = await SNLeadService.updateFileName({
              file_id: file.id,
              name_file: file.custom_file_name,
              user_id: this.currentUser.user_id,
            });

            if (response.status == 200) {
              await this.getFiles();

              this.showGenericToast({
                text: "Successful operation",
              });
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
        const confirm = await this.showConfirmSwal();

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

<style lang="scss" scoped>
.custom-form-group {
  display: flex;
  justify-content: space-around;
  align-items: center;

  .input {
    width: 70%;
  }

  .content-buttons {
    width: 30%;
  }
}
</style>

