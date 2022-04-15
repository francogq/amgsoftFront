<template>
  <div>
    <b-modal
      v-model="modalUp"
      title-class="h4 text-white"
      centered
      size="md"
      :title="` ${titleModal} Quick Task`"
      modal-class="modal-primary"
      @hidden="hideModal(false)"
    >
      <ValidationObserver ref="form">
        <b-row>
          <b-col cols="12">
            <ValidationProvider v-slot="{errors}" name="subject" rules="required">
              <b-form-group label="Subject" label-for="subject" label-cols-md="2">
                <b-form-input
                  id="subject"
                  v-model="infoQuick.title"
                  :state="errors[0] ? false : null"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
          <b-col cols="12">
            <ValidationProvider v-slot="{errors}" name="content" rules="required">
              <b-form-group label="Content" label-for="content" label-cols-md="2">
                <b-form-textarea
                  id="content"
                  rows="4"
                  v-model="infoQuick.body"
                  class="bg-white"
                  :state="errors[0] ? false : null"
                />
              </b-form-group>
            </ValidationProvider>
          </b-col>
        </b-row>
      </ValidationObserver>
      <template #modal-footer>
        <b-button variant="primary" @click="saveQuickTask()">{{titleModal}}</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import TaskService from "@/service/task/index.js";
import { mapGetters } from "vuex";
export default {
  name: "ModalQuickTaskEditCreate",
  props: {
    infoQuick: {
      type: Object,
      required: true
    },
    titleModal: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      modalUp: false
    };
  },
  created() {},
  mounted() {
    this.modalUp = true;
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    })
  },
  methods: {
    async saveQuickTask() {
      const validation = await this.$refs.form.validate();
      if (validation) {
        try {
          this.addPreloader();
          const params = {
            ...this.infoQuick,
            user_id: this.currentUser.user_id
          };
          const response = await TaskService.saveQuickTask(params);
          this.hideModal(true);
          this.removePreloader();
          this.showToast(
            "success",
            "top-right",
            "Quick Task",
            "CheckIcon",
            "Quick Task has been saved"
          );
        } catch (error) {
          this.removePreloader();
          this.showErrorSwal(error);
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