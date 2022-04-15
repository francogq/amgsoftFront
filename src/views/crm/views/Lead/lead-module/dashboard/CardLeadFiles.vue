<template>
  <b-card body-class="px-0">
    <template #header>
      <b-card-title>Files</b-card-title>
    </template>
    <b-table
      show-empty
      sticky-header
      striped
      responsive="sm"
      :fields="fields"
      :items="S_FILES_LEADS"
      :busy.sync="isBusy"
      class="mb-0"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading ...</strong>
        </div>
      </template>

      <template #cell(file_name)="data">
        <a v-if="data.item.isDisabled" :href="data.item.route" target="_blank">
          <amg-icon
            :class="getIcon(data.item.extension).color"
            :icon="getIcon(data.item.extension).icon"
          />
          {{ data.item.file_name }}.{{ data.item.extension }}
        </a>
        <validation-observer v-else :ref="`refFormObserver${data.index}`">
          <validation-provider
            #default="validationContext"
            name="File Name"
            rules="required"
          >
            <b-input-group label-for="file-name" class="input-group-sm">
              <b-form-input
                id="file-name"
                :ref="`fileName${data.index}`"
                v-model="data.item.custom_file_name"
                :state="getValidationState(validationContext)"
                @keyup.enter="onSubmit(data.index, data.item)"
                @keyup.esc="data.item.isDisabled = true"
              />
              <b-input-group-append>
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="outline-success"
                  @click="onSubmit(data.index, data.item)"
                >
                  <feather-icon v-if="!isLoading" icon="CheckIcon" />
                  <b-spinner v-else small />
                </b-button>
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="outline-danger"
                  @click="data.item.isDisabled = true"
                >
                  <feather-icon v-if="!isLoading" icon="XIcon" />
                  <b-spinner v-else small />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </validation-provider>
        </validation-observer>
      </template>

      <template #cell(created_by)="data">
        <div style="white-space: nowrap">
          {{ data.item.user_upload }}
          <br />
          <span>{{ data.item.created_at | myGlobalWithHour }}</span>
        </div>
      </template>

      <template #cell(actions)="data">
        <div class="w-100 text-center">
          <b-button
            variant="flat-warning"
            class="button-little-size rounded-circle"
            :disabled="isLoading"
            @click="
              data.item.isDisabled = !data.item.isDisabled;
              data.item.custom_file_name = data.item.file_name;
            "
          >
            <feather-icon v-if="!isLoading" icon="Edit2Icon" />
            <b-spinner v-else small />
          </b-button>
          <b-button
            variant="flat-danger"
            class="button-little-size rounded-circle ml-1"
            :disabled="isLoading"
            @click="onDeleteFile(data.item)"
          >
            <feather-icon v-if="!isLoading" icon="Trash2Icon" />
            <b-spinner v-else small />
          </b-button>
        </div>
      </template>
    </b-table>

    <template v-if="modul === 15" #footer>
      <div class="text-right">
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="primary"
          @click="$bvModal.show('modal-upload-file')"
        >
          <span class="align-middle">Upload File</span>
        </b-button>
      </div>
    </template>

    <b-modal
      v-if="modul === 15"
      id="modal-upload-file"
      title="Upload File"
      modal-class="modal-primary"
      button-size="sm"
      ok-title="Ok"
    >
      <drag-and-drop v-model="files" :filesArray="files" />
      <template #modal-footer>
        <b-button
          v-show="files.length"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="primary"
          @click="onUploadFile"
        >
          <feather-icon icon="UploadIcon" class="mr-50" />
          <span class="align-middle">Upload</span>
        </b-button>
      </template>
    </b-modal>
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";

import formValidation from "@core/comp-functions/forms/form-validation";

import DragAndDrop from "@/views/commons/utilities/DragAndDrop.vue";
import Button from "@/views/components/button/Button.vue";

export default {
  components: {
    DragAndDrop,
    Button,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
    ...mapState({
      S_FILES_LEADS: (event) => event.CrmLeadStore.S_FILES_LEADS,
    }),
  },
  created() {
    this.authUser = this.currentUser;
    this.getFilesLeads();
  },
  data() {
    return {
      authUser: {},
      fields: [
        { key: "file_name" },
        { key: "created_by" },
        this.modul === 15 ? { key: "actions" } : null,
      ],
      files: [],
      isBusy: false,
      isLoading: false,
    };
  },
  directives: { Ripple },
  methods: {
    ...mapActions({
      A_GET_FILES_LEADS: "CrmLeadStore/A_GET_FILES_LEADS",
      A_UPDATE_FILE_NAME_LEAD: "CrmLeadStore/A_UPDATE_FILE_NAME_LEAD",
      A_SET_FILE_LEAD: "CrmLeadStore/A_SET_FILE_LEAD",
      A_DELETE_FILES_LEADS: "CrmLeadStore/A_DELETE_FILES_LEADS",
    }),
    async getFilesLeads(orderby, order) {
      try {
        this.isBusy = true;
        await this.A_GET_FILES_LEADS({
          id_lead: this.lead.id,
          orderby: orderby || 2,
          order: order || "asc",
        });
        this.isBusy = false;
      } catch (error) {
        console.log("Something went wrong getFilesLeads", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isBusy = false;
      }
    },
    getIcon(extension) {
      switch (true) {
        case extension === "pdf":
          return { icon: "FilePdfIcon", color: "text-danger" };
        case ["ppt", "pptx"].includes(extension):
          return { icon: "FilePowerpointIcon", color: "text-warning" };
        case ["xlsx", "csv"].includes(extension):
          return { icon: "FileExcelIcon", color: "text-success" };
        case extension === "docx":
          return { icon: "FileWordIcon", color: "text-primary" };
        case ["png", "jpg", "jpeg", "ico"].includes(extension):
          return { icon: "FileCsvIcon", color: "text-info" };
      }
      return { icon: "FileChartIcon", color: "text-primary" };
    },
    async onSubmit(index, item) {
      if (await this.$refs[`refFormObserver${index}`].validate()) {
        this.showConfirmSwal()
          .then(async (result) => {
            if (result.value) {
              this.isLoading = true;

              const response = await this.A_UPDATE_FILE_NAME_LEAD({
                file_id: item.id,
                name_file: item.custom_file_name,
                user_id: this.authUser.user_id,
              });
              if (this.isResponseSuccess(response)) {
                this.S_FILES_LEADS[index].file_name = item.custom_file_name;
                this.S_FILES_LEADS[index].isDisabled = true;
                this.showToast(
                  "success",
                  "top-right",
                  "Success!",
                  "CheckIcon",
                  "Successful operation"
                );
              } else
                this.showToast(
                  "warning",
                  "top-right",
                  "Warning!",
                  "AlertTriangleIcon",
                  "Something went wrong.",
                  response.message
                );
              this.isLoading = false;
            }
          })
          .catch((error) => {
            console.log("Something went wrong onSubmit", error);
            this.showErrorSwal();
          });
      }
    },
    async onUploadFile() {
      try {
        this.addPreloader();
        const body = new FormData();
        this.files.forEach((file) => {
          body.append("images[]", file, file.name);
        });
        body.append("user_id", this.authUser.user_id);
        body.append("id_lead", this.lead.id);
        body.append("module_id", this.modul);
        const response = await this.A_SET_FILE_LEAD(body);
        if (this.isResponseSuccess(response)) {
          await this.getFilesLeads();
          this.files = [];
          this.$bvModal.hide("modal-upload-file");
          this.removePreloader();
          this.showToast(
            "success",
            "top-right",
            "Success!",
            "CheckIcon",
            "Successful operation"
          );
        } else
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            "Something went wrong.",
            response.message
          );
        this.removePreloader();
      } catch (error) {
        console.log("Something went wrong onUploadFile", error);
        this.showErrorSwal();
        this.removePreloader();
      }
    },
    onDeleteFile(item) {
      this.showConfirmSwal()
        .then(async (result) => {
          if (result.value) {
            this.addPreloader();
            const response = await this.A_DELETE_FILES_LEADS({
              file_id: item.id,
              user_id: this.authUser.user_id,
            });
            if (response)
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
            else
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                "Something went wrong.",
                response.message
              );
            this.removePreloader();
          }
        })
        .catch((error) => {
          console.log("Something went wrong onDeleteFile", error);
          this.showErrorSwal();
          this.removePreloader();
        });
    },
  },
  mounted() {},
  props: {
    modul: {
      type: Number,
      required: true,
    },
    lead: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { refFormObserver, getValidationState } = formValidation(() => {});

    return {
      refFormObserver,
      getValidationState,
    };
  },
};
</script>
