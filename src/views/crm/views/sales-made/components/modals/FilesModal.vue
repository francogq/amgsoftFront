<template>
  <validation-observer ref="form" class="w-100">
    <b-modal
      body-class="px-0"
      v-model="ownControl"
      lazy
      title-class="h3 text-white font-weight-bolder"
      :size="modalSize"
      modal-class="modal-primary"
      title="Files"
      hide-footer
      scrollable
      @hidden="hideModal"
    >
      <b-container fluid>
        <program-client-header
          class="mt-1"
          :client="files.client"
          :program="files.program"
        />
        <b-row
          v-if="files.valorEdit || itemTable.length > 0"
          class="mt-2 d-flex align-items-center justify-content-end mr-1"
        >
          <b-btn variant="primary" size="sm" @click="loadFile = !loadFile">
            <feather-icon icon="PlusIcon" />Upload File
          </b-btn>
        </b-row>
        <b-row v-if="loadFile">
          <b-container class="pl-4 pr-4">
            <b-row class="my-2">
              <div style="width: 150px">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="a"
                  class="w-100"
                >
                  <b-form-group label="Type">
                    <v-select
                      v-model="selected"
                      :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                      :options="options"
                      :clearable="false"
                      :class="{ 'border-danger rounded': errors[0] }"
                    />
                  </b-form-group>
                </validation-provider>
              </div>
              <div v-if="selected !== 'Others'" class="mx-4">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="doe"
                  class="w-100"
                >
                  <b-form-group label="DOE">
                    <b-form-datepicker
                      id="from-date-picker"
                      v-model="doe"
                      locale="en"
                      :date-format-options="{
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      }"
                      :class="{ 'border-danger rounded': errors[0] }"
                    />
                  </b-form-group>
                </validation-provider>
              </div>
            </b-row>
            <b-row>
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="file"
                class="w-100"
              >
                <b-form-file
                  v-model="file"
                  drop-placeholder="Drop file here..."
                  placeholder="Choose a file or drop it here..."
                  size="lg"
                  :class="{ 'border-danger rounded': errors[0] }"
                />
              </validation-provider>
            </b-row>
            <b-row class="mt-2">
              <b-button variant="success" @click="uploadFile">
                <feather-icon icon="UploadIcon" />Upload
              </b-button>
            </b-row>
          </b-container>
        </b-row>
        <b-row class="mt-2">
          <b-col class="px-0">
            <b-table
              :items="itemTable"
              small
              class="font-small-3"
              sticky-header="50vh"
              thead-class="text-center"
              :fields="fields"
              responsive
            >
              <template #cell(status)="data">
                <b-form-checkbox
                  v-if="data.item.type_file == 0"
                  v-model="data.item.status"
                  unchecked-value="0"
                  value="1"
                  @change="checkFile(data.item.id, data.item.status)"
                />
              </template>
              <template v-slot:cell(file_name)="data">
                <div>
                  <feather-icon icon="FileTextIcon" />
                  {{ data.item.file_name.replace("UNSIGNED", files.client) }}
                </div>
              </template>
              <template v-slot:cell(size)="data">
                <div>{{ data.item.size }} KB</div>
              </template>
              <template v-slot:cell(expiration)="data">
                <div v-if="data.item.expiration">
                  {{ data.item.expiration | myGlobal }}
                </div>
              </template>
              <template v-slot:cell(updated_at)="data">
                {{ data.item.updated_at | myGlobalWithHour }}
              </template>
              <template v-slot:cell(actions)="data">
                <b-container class="text-center">
                  <b-row v-if="data.item.is_ag">
                    <b-col cols="7" class="pr-0">
                      <b-row
                        v-if="data.item.route"
                        class="pb-50"
                        :class="{ hidden: !data.item.url }"
                      >
                        <b-col
                          cols="1"
                          class="text-info text-center d-flex align-items-center justify-content-center"
                          >EN</b-col
                        >
                        <b-col class="d-flex">
                          <b-btn
                            class="btn-icon rounded-circle"
                            variant="info"
                            size="sm"
                            :href="data.item.url"
                            target="_blank"
                            :disabled="!data.item.url"
                          >
                            <feather-icon icon="DownloadIcon" />
                          </b-btn>
                          <b-btn
                            variant="success"
                            class="ml-1 btn-icon rounded-circle"
                            size="sm"
                            :disabled="!data.item.url"
                            @click="openSmsUrlPdfModal(data.item.url)"
                          >
                            <feather-icon icon="Share2Icon" />
                          </b-btn>
                        </b-col>
                      </b-row>
                      <b-row v-if="data.item.route_es" class="pt-50 border-top">
                        <b-col
                          cols="1"
                          class="text-info text-center d-flex align-items-center justify-content-center"
                          >ES</b-col
                        >
                        <b-col class="d-flex">
                          <b-btn
                            variant="info"
                            size="sm"
                            :href="data.item.route_es"
                            target="_blank"
                            :disabled="!data.item.route_es"
                            class="btn-icon rounded-circle"
                          >
                            <feather-icon icon="DownloadIcon" />
                          </b-btn>
                          <b-btn
                            variant="success"
                            class="ml-1 btn-icon rounded-circle"
                            size="sm"
                            :disabled="!data.item.route_es"
                            @click="openSmsUrlPdfModal(data.item.url)"
                          >
                            <feather-icon icon="Share2Icon" />
                          </b-btn>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      cols="3"
                      class="d-flex align-items-center justify-content-center pl-0"
                      style="margin-left: 20px"
                    >
                      <b-btn
                        variant="warning"
                        size="sm"
                        class="btn-icon rounded-circle"
                        @click="
                          generatePdf(
                            files.id,
                            files.program,
                            files.sale_id,
                            data.item.is_ag
                          )
                        "
                      >
                        <feather-icon icon="RefreshCcwIcon" />
                      </b-btn>
                    </b-col>
                  </b-row>
                  <b-row v-else>
                    <b-col cols="1" />
                    <b-col>
                      <b-btn
                        variant="info"
                        size="sm"
                        target="_blank"
                        :href="data.item.url"
                        class="btn-icon rounded-circle"
                      >
                        <feather-icon icon="DownloadIcon" />
                      </b-btn>
                      <b-btn
                        v-if="mode === 1"
                        class="ml-1 btn-icon rounded-circle"
                        variant="danger"
                        size="sm"
                        @click="
                          deleteFile(
                            data.item.id,
                            data.item.route + '/' + data.item.file_name
                          )
                        "
                      >
                        <feather-icon icon="TrashIcon" />
                      </b-btn>
                    </b-col>
                  </b-row>
                </b-container>
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-container>
      <sms-url-pdf-modal
        v-if="openModalSmsPdf"
        :user_id="currentUser.user_id"
        :modul="currentUser.modul_id"
        :sms="files.id"
        :url-pdf="urlpdf"
        :nameleads="files.client"
        @closeModal="openModalSmsPdf = false"
      />
    </b-modal>
  </validation-observer>
</template>

<script>
import vSelect from "vue-select";
import { mapGetters } from "vuex";
import CrmService from "@/views/crm/services/crm.service";
import ProgramClientHeader from "@/views/crm/views/sales-made/components/modals/ProgramClientHeader";
import SmsUrlPdfModal from "@/views/crm/views/sales-made/components/modals/SmsUrlPdfModal";

export default {
  name: "FilesModal",
  components: { SmsUrlPdfModal, ProgramClientHeader, vSelect },
  props: {
    modal: {
      type: Object,
      required: true,
    },
    files: {
      type: Object,
      required: true,
    },
    mode: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  data() {
    return {
      urlpdf: "",
      item: [],
      openModalSmsPdf: false,
      fields: [
        {
          key: "file_name",
          sortable: false,
          label: "Name",
        },
        {
          key: "size",
          sortable: false,
          label: "Size",
        },
        {
          key: "expiration",
          sortable: false,
          label: "DOE",
        },
        {
          key: "updated_at",
          sortable: false,
          label: "Upload",
        },
        {
          key: "updater_name",
          sortable: false,
          label: "Updated By",
        },
        {
          key: "actions",
          sortable: false,
          label: "Actions",
        },
      ],
      loadFile: false,
      file: null,
      options: ["ID", "UB", "Others"],
      selected: "",
      doe: "",
      base_url: process.env.VUE_APP_BASE_URL_ASSETS,
      ownControl: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    modalSize() {
      if (this.screenWidth > 992) return "lg";
      return "xlg";
    },
    itemTable() {
      const programid = this.files.programId;
      if (this.mode === 1) {
        return this.item.filter(
          (item) =>
            item.is_ag == 0 ||
            (item.is_ag == 1 &&
              (programid == 1 ||
                programid == 2 ||
                programid == 3 ||
                programid == 4 ||
                programid == 7)) ||
            (item.is_ag == 2 && (programid == 3 || programid == 4)) ||
            (item.is_ag == 3 && (programid == 3 || programid == 4))
        );
      }
      return this.item;
    },
  },
  async created() {
    this.addPreloader();
    await this.loadTable();
    this.ownControl = true;
    this.removePreloader();
  },
  methods: {
    async checkFile(id, status) {
      try {
        this.addPreloader();
        const response = await amgApi.post("/sales-made/payment/check-file", {
          id,
          saleid: this.files.sale_id,
        });
        if (response.status === 200) {
          if (status == 1 || status == true)
            this.showSuccessSwal("Retired File");
          else if (status == false) this.showSuccessSwal("File Added");
        }
        this.removePreloader();
      } catch (error) {
        this.removePreloader();
        this.showErrorSwal(error);
      }
    },
    hideModal() {
      this.$emit("close");
      this.ownControl = false;
    },
    async uploadFile() {
      const result = await this.$refs.form.validate();

      if (result) {
        const body = {
          image: "",
          namedoc: this.file.name,
          lead_id: this.files.id,
          size: this.file.size,
          user_id: this.currentUser.user_id,
          type: this.selected,
          program: this.files.program,
          date: this.files.event_date,
          datexp: this.doe,
        };
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = async (file) => {
          body.image = file.target.result;

          this.addPreloader();
          const response = await amgApi.post(
            "/sales-made/save-document-file",
            body
          );
          if (response.status === 200) {
            this.removePreloader();
            this.showSuccessSwal();
            this.doe = "";
            this.file = "";
            this.selected = "";
            this.loadFile = false;
            await this.loadTable();
          }
        };
      }

      this.removePreloader();
    },
    openSmsUrlPdfModal(urlPdf) {
      this.urlpdf = urlPdf;
      this.openModalSmsPdf = true;
    },
    async loadTable() {
      try {
        if (this.mode === 1) {
          this.item = await CrmService.getLeadsFiles({
            program: this.files.program,
            id: this.files.id,
          });
        }
        if (this.mode === 2) {
          this.item = await CrmService.getLeadsFilesAccount({
            id: this.files.client_account_id,
            programid: this.files.program_id,
            saleid: this.files.sale_id,
          });
          this.fields = [
            {
              key: "status",
              sortable: false,
              label: "",
            },
            {
              key: "file_name",
              sortable: false,
              label: "Name",
            },
            {
              key: "size",
              sortable: false,
              label: "Size",
            },
            {
              key: "expiration",
              sortable: false,
              label: "DOE",
            },
            {
              key: "updated_at",
              sortable: false,
              label: "Upload",
            },
            {
              key: "actions",
              sortable: false,
              label: "Actions",
            },
          ];
        }
      } catch (error) {
        this.showToast("danger", "top-right", "Error", "XIcon", error);
      }
    },
    // eslint-disable-next-line camelcase
    async generatePdf(lead_id, program, sale_id, typee) {
      const result = await this.showConfirmSwal();
      try {
        if (result.isConfirmed) {
          this.addPreloader();
          const response = await CrmService.generatePdf({
            lead_id,
            program,
            sale_id,
            typee,
          });
          this.removePreloader();
          if (response === "ok") {
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Your file was generated successfully"
            );
          }
          await this.loadTable();
        }
      } catch (error) {
        this.removePreloader();
        this.showToast("danger", "top-right", "Error", "XIcon", error);
        await this.loadTable();
      }
    },
    async deleteFile(id, url) {
      const result = await this.showConfirmSwal();
      try {
        if (result.isConfirmed) {
          this.addPreloader();
          const response = await CrmService.deleteFile({
            id,
            url,
          });
          this.removePreloader();
          if (response === "ok") {
            this.showToast(
              "success",
              "top-right",
              "Success",
              "CheckIcon",
              "Tu archivo se elimino correctamente"
            );
          }
          await this.loadTable();
        }
      } catch (error) {
        this.removePreloader();
        this.showToast("danger", "top-right", "Error", "XIcon", error);
        await this.loadTable();
      }
    },
  },
};
</script>

<style></style>
