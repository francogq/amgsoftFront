<template>
  <div>
    <b-modal
      modal
      title="SEND EMAIL"
      v-model="modalSend"
      size="xmd"
      scrollable
      modal-class="modal-primary"
      @hidden="closeModal"
      title-tag="h3"
      :no-close-on-backdrop="true"
    >
      <validation-observer ref="form">
        <!-- Form -->
        <b-form class="p-1">
          <!-- Title Clients -->
          <b-form-group>
            <b-input-group prepend="Clients">
              <div
                class="form-control h-auto bg-transparent border-secondary sms-container"
              >
                <template v-for="(item, index) in nameLeads">
                  <span :key="index">
                    <span>{{ item.name }}</span>
                    <feather-icon
                      v-if="nameLeads.length > 1"
                      class="text-danger cursor-pointer"
                      icon="MinusCircleIcon"
                      @click="deleteAccount(item.id)"
                    />&nbsp;
                  </span>
                </template>
              </div>
            </b-input-group>
          </b-form-group>
          <!-- Add Quick SMS -->
          <b-form-group
            class="mt-2"
            label="Add Quick SMS"
            label-for="first-name"
            label-cols-md="2"
          >
            <b-input-group>
              <v-select
                v-model="optionsms"
                style="flex: 1 1 auto"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                label="subject"
                :options="quicks"
                @input="selectsms"
              />
              <b-input-group-append>
                <b-button
                  variant="outline-info"
                  @click="$bvModal.show('modal-quick-email')"
                >
                  <feather-icon
                    icon="AlignJustifyIcon"
                    class="cursor-pointer mr-1"
                  />Manage Quick Email
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <!-- Input Null -->
          <validation-provider
            v-slot="{ errors }"
            name="subject"
            rules="required"
          >
            <b-form-group class="mt-2" label-for="first-name">
              <b-form-input
                v-model="subject"
                placeholder="Subject"
                style="flex: 1 1 auto"
                :state="errors[0] ? false : null"
              />
            </b-form-group>
          </validation-provider>
          <!-- Text Tarea -->
          <validation-provider
            v-slot="{ errors }"
            name="Message"
            rules="required"
          >
            <b-form-group label-for="message">
              <b-form-textarea
                id="message"
                v-model="contmessage"
                v-html="contmessage"
                placeholder="Write new message"
                rows="6"
                maxlength="1000"
                :state="errors[0] ? false : null"
              />
            </b-form-group>
          </validation-provider>
          <drag-and-drop v-model="files" :files-array="files" />

          <!-- Save as Note -->
          <b-row>
            <b-col cols="7">
              <small tabindex="-1" class="form-text text-danger"
                >Upload Files Max 8MB</small
              >
            </b-col>
            <b-col cols="3">
              <div class="d-flex justify-content-end mt-2">
                <b-form-checkbox v-model="savenote" name="check-button" switch>
                  <span>Save as Note</span>
                </b-form-checkbox>
              </div>
            </b-col>
            <b-col cols="2">
              <div class="d-flex justify-content-end align-items-center mt-1">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="success"
                  @click="onSubmit"
                >
                  <template v-if="isLoading">
                    <b-spinner small />
                    <span>Loading...</span>
                  </template>
                  <span v-else>Send</span>
                </b-button>
              </div>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
      <!-- VARS and Send -->
      <template #modal-footer>
        <b-row class="w-100">
          <b-col lg="12">
            <b-form-group label="VARS" class="w-100">
              <b-row>
                <b-col sm="2" class="pb-1 pr-0">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text>@1</b-input-group-prepend>
                    <b-form-input placeholder="FIRST NAME" style="font-size:0.67em" readonly />
                  </b-input-group>
                </b-col>
                <b-col sm="2" class="pb-1 pr-0">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text>@2</b-input-group-prepend>
                    <b-form-input placeholder="LAST NAME" style="font-size:0.67em" readonly />
                  </b-input-group>
                </b-col>
                <b-col sm="2" class="pb-1 pr-0">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text>@3</b-input-group-prepend>
                    <b-form-input placeholder="ADVISOR NAME" style="font-size:0.67em" readonly />
                  </b-input-group>
                </b-col>
                <b-col sm="2" class="pb-1 pr-0">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text>@4</b-input-group-prepend>
                    <b-form-input placeholder="PHONE ADVISOR" style="font-size:0.67em" readonly />
                  </b-input-group>
                </b-col>
                <b-col sm="2" class="pb-1 pr-0">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text>@5</b-input-group-prepend>
                    <b-form-input placeholder="PROGRAM NAME" style="font-size:0.67em" readonly />
                  </b-input-group>
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    <!-- Modal quick email -->
    <b-modal
      id="modal-quick-email"
      title-class="h4 text-white"
      modal-class="modal-primary"
      centered
      size="lg"
      title="Quick Email"
      hide-footer
    >
      <modal-quick-email :modul="$route.meta.module" />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
// Import Services
import ClientService from "../services/clients.services";
// Import Components
import ModalQuickEmail from "../components/clientsEmail/ModalQuickEmail.vue";
import DragAndDrop from "@/views/commons/utilities/DragAndDrop";

export default {
  components: {
    ModalQuickEmail,
    vSelect,
    DragAndDrop,
  },
  props: {
    nameLeads: {
      type: Array,
    },
    modalSendEmail: {
      type: Boolean,
    },
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      modalSend: this.modalSendEmail,
      // quicks: [],
      optionsms: "",
      subject: "",
      contmessage: "",
      files: [],
      isLoading: false,
      savenote: false,
      uploadPercentage: 0,
    };
  },
  computed: {
    ...mapState("clients-store", ["quicks"]),
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    ...mapActions("clients-store", ["SET_QUICKS"]),
    closeModal() {
      this.$emit("closeModal");
    },
    deleteAccount(id) {
      for (let i = 0; i < this.nameLeads.length; i++) {
        if (this.nameLeads[i].id == id) {
          this.nameLeads.splice(i, 1);
        }
      }
    },
    allQuicksEmail: async function () {
      try {
        await this.SET_QUICKS({
          modul: this.$route.meta.module,
        });
      } catch (error) {
        console.log("something went wrong with allquicksemail", error);
      }
    },
    selectsms() {
      const index = this.quicks
        .map((el) => el.id)
        .indexOf(this.optionsms ? this.optionsms.id : null);
      // this.contmessage = this.quicks[index].content
      if (index !== -1) {
        this.subject = this.quicks[index].subject;
        const format = this.quicks[index].content
          ? this.quicks[index].content.replace(/<br \/>/g, "\n")
          : "";
        this.contmessage = format;
      } else {
        this.subject = "";
        this.contmessage = "";
      }
      // var format = y.replace(/<br \/>/g,'\n')
      // console.log(",")
      // this.subject = x
    },
    async onSubmit() {
      const validation = await this.$refs.form.validate();
      if (validation) {
        const confirm = await this.showConfirmSwal();
        if (confirm.isConfirmed) {
          try {
          this.addPreloader();
          this.contmessage = this.contmessage.replace(/\r?\n/g, "<br />");
          let formData = new FormData();
          formData.append("cantfiles", this.files);
          formData.append("contmessage", this.contmessage);
          formData.append("user", this.currentUser.user_id);
          formData.append("subject", this.subject);
          let clientsId = this.nameLeads.map((element) => element.id);
          formData.append("sms", clientsId);
          formData.append("modul", this.$route.meta.module);
          formData.append("savenote", this.savenote == true ? 1 : 0);
          const data = await ClientService.sendEmail(formData, {
            onUploadProgress: function (progressEvent) {
              this.uploadPercentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            }.bind(this),
          });
          this.closeModal();
          this.removePreloader();
          this.showToast(
            "success",
            "top-right",
            "Success!",
            "CheckIcon",
            "Successful operation"
          );
        } catch (error) {
          console.log(error);
          this.removePreloader();
          this.showErrorSwal(error);
        }
        }
        
      }
    },
  },
  created() {
    this.allQuicksEmail();
  },
};
</script>
