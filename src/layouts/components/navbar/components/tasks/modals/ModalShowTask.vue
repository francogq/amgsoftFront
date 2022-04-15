<template>
  <div>
    <b-modal
      v-model="modalUp"
      title-class="h3 text-white"
      centered
      size="lg"
      title="Show Task"
      hide-footer
      modal-class="modal-primary"
      @hidden="hideModal()"
    >
      <b-row>
        <b-col cols="12">
          <b-form-group label="Client" label-for="lead-name" label-cols-md="2">
            <b-form-input
              id="lead-name"
              :value="infoTask.client_name"
              readonly
              class="font-weight-bolder"
            />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Subject" label-for="subject" label-cols-md="2">
            <b-form-input id="subject" :value="task.subject" disabled />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Created by" label-for="createdBy" label-cols-md="2">
            <b-form-input id="createdBy" :value="task.creator_name" disabled />
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Assigned to" label-for="assignetTo" label-cols-md="2">
            <b-form-input id="assignetTo" :value="task.asigned_name" disabled />
          </b-form-group>
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
                  disabled
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
                  :disabled="true"
                  style="height: 2.73rem"
                />
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Content" label-for="content" label-cols-md="2">
            <b-form-textarea id="content" rows="4" v-html="task.content" readonly />
          </b-form-group>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import TaskService from "@/service/task/index.js";
import moment from "moment";
import flatPickr from "vue-flatpickr-component";
export default {
  name: "ModalShowTask",
  components: {
    flatPickr
  },
  props: {
    infoTask: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      modalUp: false,
      task: { date: "", hour: "" },
      configFlatPickr: {
        dateFormat: "m/d/Y",
        locale: "en"
      }
    };
  },
  created() {
    this.getInfoTask();
  },
  mounted() {},
  methods: {
    async getInfoTask() {
      try {
        const params = { id: this.infoTask.id };
        const response = await TaskService.editTaskCredit(params);
        this.task = response[0];
        this.modalUp = true;
        this.removePreloader();
      } catch (error) {
        this.showErrorSwal(error);
      }
    },
    hideModal() {
      this.modalUp = false;
      this.$emit("hide");
    }
  }
};
</script>

<style>
</style>