<template>
  <b-container>
    <div>
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
      </validation-observer>
    </div>
  </b-container>
</template>
<script>
import ScheduleService from "../services/schedules.service.js";
import { mapGetters } from "vuex";

export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    }),
    typeJustify() {
      return this.item.type == "abse" ? 2 : 1;
    }
  },
  mounted() {},
  data() {
    return {
      justify: {
        motive: null,
        status: null
      },
      options: [
        { value: null, text: "Select an status" },
        { value: "0", text: "Disapprove" },
        { value: "1", text: "Approve" }
      ]
    };
  },
  methods: {
    async sendJustify() {
      this.$refs.form.validate().then(async confirm => {
        if (!confirm) {
          return;
        }
        this.addPreloader();
        const params = {
          id: this.item.id,
          user_id: this.item.user_id,
          motive: this.justify.motive,
          user_logged: this.currentUser.user_id,
          modul_id: this.currentUser.modul_id,
          date: this.item.date,
          status: this.justify.status
        };
        await ScheduleService.sendJustifyOvertime(params);
        this.removePreloader();
        this.closeModal();
      });
    },
    closeModal() {
      this.$emit("closeModal");
    }
  }
};
</script>