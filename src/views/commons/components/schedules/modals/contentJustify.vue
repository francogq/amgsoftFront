<template>
  <b-container>
    <div v-if="typeJustify == 2">
      <validation-observer ref="form">
        <b-form-group class="my-2">
          <validation-provider rules="required" v-slot="{ errors, valid }">
            <b-form-textarea
              id="textarea"
              v-model="justify.motive"
              placeholder="Justification..."
              rows="3"
              max-rows="6"
              :state="errors[0] ? false : valid ? true : null"
            ></b-form-textarea>
          </validation-provider>
        </b-form-group>
        <b-form-group class="my-2">
          <validation-provider rules="required" v-slot="{ errors, valid }">
            <b-form-select
              v-model="justify.status"
              :options="options"
              :state="errors[0] ? false : valid ? true : null"
            ></b-form-select>
          </validation-provider>
        </b-form-group>
        <b-form-group class="my-2">
          <drag-and-drop v-model="files" :filesArray="files" />
        </b-form-group>
      </validation-observer>
    </div>
    <div v-else>
      <validation-observer ref="form">
        <b-form-group class="my-2">
          <small>Motive</small>
          <b-form-textarea
            id="textarea"
            v-model="item.motive"
            rows="3"
            max-rows="6"
            disabled
          ></b-form-textarea>
        </b-form-group>
        <b-form-group class="my-2"
          ><small>Status</small>
          <validation-provider rules="required" v-slot="{ errors, valid }">
            <b-form-select
              v-model="justify.status"
              :options="options"
              :state="errors[0] ? false : valid ? true : null"
            ></b-form-select>
          </validation-provider>
        </b-form-group>
      </validation-observer>
    </div>
  </b-container>
</template>
<script>
import ScheduleService from "../services/schedules.service.js";
import DragAndDrop from "@/views/commons/utilities/DragAndDrop";
import { mapGetters } from "vuex";

export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  components: {
    DragAndDrop,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    typeJustify() {
      return this.item.type == "abse" ? 2 : 1;
    },
  },
  mounted() {},
  data() {
    return {
      justify: {
        motive: null,
        comment: null,
        status: null,
      },
      files: [],
      tracking: [],
      options: [
        { value: null, text: "Select an status" },
        { value: "0", text: "Disapprove" },
        { value: "1", text: "Approve" },
      ],
    };
  },
  methods: {
    async sendJustify() {
      this.$refs.form.validate().then(async (confirm) => {
        if (!confirm) {
          return;
        }
        if (this.typeJustify == 2) {
          this.insertAbsence();
        } else {
          this.insertLate();
        }
      });
    },
    async insertAbsence() {
      this.addPreloader();
      const formData = new FormData();
      this.files.forEach((file) => {
        formData.append("files[]", file, file.name);
      });
      formData.append("user_id", this.item.user_id);
      formData.append("user_logged", this.currentUser.user_id);
      formData.append("schedule_date", this.item.date);
      formData.append("motive", this.justify.motive);
      formData.append("type", this.item.type);
      formData.append("modul_id", this.currentUser.modul_id);
      formData.append("current_location", 2);
      formData.append("comment", this.justify.comment);
      formData.append("status", this.justify.status);
      if (this.justify.status == 1 && this.files.length < 1) {
        this.removePreloader();
        this.showToast(
          "error",
          "top-right",
          "Oops!",
          "XIcon",
          "IT IS REQUIRED TO ATTACH A FILE"
        );
        return;
      }
      await ScheduleService.sendJustify(formData);
      this.closeModal();
      this.removePreloader();
    },
    async insertLate() {
      this.addPreloader();
      const formData = new FormData();
      formData.append("status", this.justify.status);
      formData.append("user_id", this.item.user_id);
      formData.append("modul_id", this.item.modul_id);
      formData.append("modul_logged", this.currentUser.modul_id);
      formData.append("user_logged", this.currentUser.user_id);
      formData.append("schedule_date", this.item.date);
      formData.append("type", this.item.type);
      formData.append("comment", this.justify.comment);
      formData.append("current_location", 2);
      await ScheduleService.sendJustify(formData);
      this.closeModal();
      this.removePreloader();
    },
    closeModal() {
      this.$emit("closeModalJustify");
    },
  },
};
</script>