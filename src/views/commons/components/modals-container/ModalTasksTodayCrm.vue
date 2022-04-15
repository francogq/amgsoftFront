<template>
  <div>
    <b-modal
      v-model="modalUp"
      title-class="h2 text-white"
      size="lg"
      :title="`Tasks Today (${taskCounter.today})`"
      centered
      modal-class="modal-primary"
      @hidden="hideModal()"
    >
      <task-list :type="2" :taskToday="true"></task-list>
      <template #modal-footer>
        <b-button variant="primary" @click="doneTaskTodayModal">Done</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
import TaskList from "@/layouts/components/navbar/components/tasks/components/TaskList.vue";
export default {
  components: {
    TaskList
  },
  data() {
    return {
      modalUp: false
    };
  },
  mounted() {
    this.modalUp = true;
  },
  computed: {
    ...mapState({
      taskCounter: state => state.TaskStore.S_TASK_COUNTER
    }),
    ...mapGetters({
      userSession: "auth/userSession"
    })
  },
  methods: {
    hideModal() {
      this.modalUp = false;
      this.$emit("hide");
    },
    async doneTaskTodayModal() {
      const confirm = await this.showConfirmSwal();
      if (confirm.isConfirmed) {
        try {
          this.hideModal();
          const params = { user_id: this.userSession };
          const response = await this.$store.dispatch(
            "TaskStore/A_CHANGE_TASK_TODAY_MODAL",
            params
          );
          this.$store.commit("TaskStore/M_CHANGE_T_TODAY", 0);
        } catch (error) {
          this.showErrorSwal(error);
          this.hideModal();
        }
      }
    }
  }
};
</script>

<style>
</style>