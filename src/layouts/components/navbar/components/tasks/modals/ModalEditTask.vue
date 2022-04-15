<template>
  <div>
    <b-modal
      v-model="modalUp"
      title-class="h3 text-white"
      centered
      size="lg"
      title="Edit Task"
      modal-class="modal-primary"
      @hidden="hideModal(false)"
    >
      <ValidationObserver ref="form">
        <b-row>
          <b-col cols="12">
            <b-form-group label="Client" label-for="lead-name" label-cols-md="2">
              <b-form-input
                id="lead-name"
                v-model="infoTask.client_name"
                readonly
                class="font-weight-bolder"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" class="my-1">
            <b-row class="d-flex justify-content-around">
              <b-col lg="8">
                <b-form-group
                  label="Select a quick Task "
                  label-for="quickTask"
                  label-cols-md="4"
                  label-class="text-primary"
                >
                  <v-select
                    v-model="quickTask"
                    id="asigned"
                    placeholder="Select a Quick Task"
                    label="title"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="quickTasks"
                    :clearable="false"
                    @input="selectQuickTask"
                  />
                </b-form-group>
              </b-col>
              <b-col lg="3">
                <b-button
                  variant="primary"
                  @click="openModalQuickTasks"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                >
                  <feather-icon icon="AlignJustifyIcon"></feather-icon>&nbsp; Quick Tasks
                </b-button>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12">
            <ValidationProvider v-slot="{errors}" name="subject" rules="required">
              <b-form-group label="Subject" label-for="subject" label-cols-md="2" trim>
                <b-form-input
                  id="subject"
                  name="subject"
                  v-model.trim="task.subject"
                  :state="errors[0] ? false : null"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
          <b-col cols="12">
            <b-row>
              <label class="col-md-2 col-form-label">Due Date</label>
              <b-col>
                <b-form-group>
                  <flat-pickr
                    v-model="task.date"
                    id="date"
                    placeholder="Date"
                    class="form-control"
                    :config="configFlatPickr"
                  />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group>
                  <kendo-timepicker
                    :format="'HH:mm'"
                    v-model="task.hour"
                    :interval="15"
                    class="w-100 rounded bg-transparent"
                    placeholder="Hour"
                    style="height: 2.73rem"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="12">
            <ValidationProvider v-slot="{errors}" name="content" rules="required">
              <b-form-group label="Content" label-for="content" label-cols-md="2">
                <b-form-textarea
                  id="content"
                  rows="4"
                  v-model.trim="task.content"
                  :state="errors[0] ? false : null"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>
      </ValidationObserver>
      <template #modal-footer>
        <b-button variant="primary" @click="editTask">Submit</b-button>
      </template>
    </b-modal>
    <ModalQuickTasks
      v-if="modalQuick"
      :infoQuicKTask="infoQuicKTask"
      @hide="closeModalQuickTasks"
      @reloadQuickTasks="getQuickTasks"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import Ripple from "vue-ripple-directive";
import ModalQuickTasks from "./ModalQuickTasks.vue";
import vSelect from "vue-select";
import TaskService from "@/service/task/index.js";
import moment from "moment";
import flatPickr from "vue-flatpickr-component";
export default {
  name: "ModalShowTask",
  components: {
    flatPickr,
    vSelect,
    ModalQuickTasks
  },
  props: {
    infoTask: {
      type: Object,
      required: true
    }
  },
  directives: {
    Ripple
  },
  data() {
    return {
      modalUp: false,
      task: { date: "", hour: "" },
      quickTasks: [],
      quickTask: "",
      configFlatPickr: {
        dateFormat: "m/d/Y",
        locale: "en",
        minDate: ""
      },
      modalQuick: false,
      infoQuicKTask: {}
    };
  },
  created() {
    this.getQuickTasks();
    this.getInfoTask();
  },
  mounted() {},
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    })
  },
  methods: {
    async getInfoTask() {
      try {
        const params = { id: this.infoTask.id };
        const response = await TaskService.editTaskCredit(params);
        this.task = response[0];
        this.configFlatPickr.minDate =
          this.task.date > moment().format("MM/DD/YYYY")
            ? moment().format("MM/DD/YYYY")
            : this.task.date;
        this.modalUp = true;
        this.removePreloader();
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
    async getQuickTasks() {
      try {
        const params = {
          id: this.currentUser.user_id
        };
        const response = await TaskService.getQuickTasks(params);
        this.quickTasks = response.data;
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
    selectQuickTask() {
      this.task.subject = this.quickTask.title;
      this.task.content = this.quickTask.body;
    },
    openModalQuickTasks() {
      this.modalQuick = true;
    },
    closeModalQuickTasks() {
      this.modalQuick = false;
    },
    async editTask() {
      const validation = await this.$refs.form.validate();
      if (validation) {
        const confirm = await this.showConfirmSwal();
        if (confirm.isConfirmed) {
          try {
            this.addPreloader();
            const params = {
              id: null,
              idtask: this.task.id,
              subject: this.task.subject,
              date: this.task.date,
              hour: this.task.hour,
              content: this.task.content,
              created: this.currentUser.user_id,
              user_id: this.currentUser.user_id,
              modul: null
            };
            const response = await TaskService.addTask(params);
            this.hideModal(true);
            this.removePreloader();
          } catch (error) {
            this.removePreloader();
            this.showErrorSwal(error);
          }
        }
      }
    },
    hideModal(status) {
      this.modalUp = false;
      this.$emit("hide", status);
    }
  }
};
</script>

<style>
</style>