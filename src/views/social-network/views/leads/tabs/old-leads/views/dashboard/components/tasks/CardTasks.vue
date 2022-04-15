<template>
  <b-card body-class="px-0">
    <template #header>
      <b-card-title> Tasks </b-card-title>
    </template>

    <b-tabs
      pills
      nav-class="mb-0 mt-1 ml-1"
      active-nav-item-class="bg-primary box-shadow-info"
    >
      <b-tab title="CRM" @click="searchTasks(0)">
        <table-tasks
          :fields="fields"
          :items="tasks"
          :lead="lead"
          @onMarkAsDone="markTaskAsDone"
          @onView="openModalEditTask"
          @onDelete="deleteTask"
        ></table-tasks>

        <div class="text-right">
          <b-button
            variant="primary"
            class="mt-2 mr-1"
            @click="openModalCreateTask"
          >
            ADD
          </b-button>
          <b-button
            v-if="lead.count_task !== 0"
            variant="outline-secondary"
            class="btn-icon mt-2 mr-1"
            @click="openModalTaskHistory"
          >
            <feather-icon icon="ListIcon" size="18" />
          </b-button>
        </div>
      </b-tab>
      <b-tab title="SN" @click="searchTasks(1)">
        <table-tasks
          :fields="fields"
          :items="tasks"
          :lead="lead"
          @onMarkAsDone="markTaskAsDone"
          @onView="openModalEditTask"
          @onDelete="deleteTask"
        ></table-tasks>
        <div class="text-right">
          <b-button
            variant="primary"
            class="mt-2 mr-1"
            @click="openModalCreateTask"
          >
            ADD
          </b-button>
          <b-button
            v-if="lead.count_task !== 0"
            variant="outline-secondary"
            class="btn-icon mt-2 mr-1"
            @click="openModalTaskHistory"
          >
            <feather-icon icon="ListIcon" size="18" />
          </b-button>
        </div>
      </b-tab>
    </b-tabs>

    <modal-create-task
      v-if="showModalCreateTask"
      :lead="lead"
      :modul="15"
      :taskForSn="isCrm ? 0 : 1"
      @onClose="closeModalCreateTask"
      @onReloadTasks="onReloadTasks"
    ></modal-create-task>

    <modal-edit-task
      v-if="showModalEditTask"
      :modul="15"
      :lead="lead"
      :task="task"
      :taskForSn="isCrm ? 0 : 1"
      :isDisabled="isDisabledModal"
      @onClose="closeModalEditTask"
      @onReloadTasks="onReloadTasks"
    >
    </modal-edit-task>

    <modal-task-history
      v-if="showModalTaskHistory"
      :modul="15"
      :lead="lead"
      :taskForSn="isCrm ? 0 : 1"
      @onClose="closeModalTaskHistory"
    ></modal-task-history>
  </b-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

// Components
import TableTasks from "./TableTasks.vue";
import ModalCreateTask from "@/views/social-network/views/leads/components/ModalCreateTask.vue";
import ModalEditTask from "@/views/social-network/views/leads/components/ModalEditTask.vue";
import ModalTaskHistory from "@/views/social-network/views/leads/components/ModalTaskHistory.vue";

// Services
import SnLeadsService from "@/views/social-network/services/leads";
import TasksService from "@/service/task";

export default {
  props: {
    lead: {
      type: Object,
    },
  },
  components: {
    TableTasks,
    ModalCreateTask,
    ModalEditTask,
    ModalTaskHistory,
  },
  data() {
    return {
      // Modals
      showModalCreateTask: false,
      showModalEditTask: false,
      showModalTaskHistory: false,

      isCrm: true,
      isDisabledModal: false,

      tasks: [],
      task: null,
    };
  },
  computed: {
    fields() {
      return [
        { key: "subject", label: "Subject" },
        { key: "date", label: "Date/Hour" },
        { key: "sms", label: "Sms" },
        this.isCrm ? { key: "type", label: "Type" } : null,
        { key: "actions", label: "Actions" },
      ];
    },
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    ...mapActions({
      A_DELETE_LEAD_TASK: "TaskStore/A_DELETE_LEAD_TASK",
      A_GET_TASK: "TaskStore/A_GET_TASK",
    }),
    openModalCreateTask() {
      this.showModalCreateTask = true;
    },
    closeModalCreateTask() {
      this.showModalCreateTask = false;
    },
    async openModalEditTask(id, isDisabled) {
      this.addPreloader();

      const response = await this.A_GET_TASK({ id });

      if (response.status == 200) {
        this.isDisabledModal = isDisabled;
        this.task = response.data[0];
        this.showModalEditTask = true;
      } else {
        this.showToast(
          "warning",
          "top-right",
          "Warning!",
          "AlertTriangleIcon",
          `Something went wrong. ${response.message}`
        );
      }
    },
    closeModalEditTask() {
      this.task = {};
      this.showModalEditTask = false;
    },
    openModalTaskHistory() {
      this.showModalTaskHistory = true;
    },
    closeModalTaskHistory() {
      this.showModalTaskHistory = false;
    },
    onReloadTasks(tasks) {
      this.tasks = tasks;
    },
    async searchTasks(type) {
      try {
        this.tasks = [];

        let idParam = this.$route.params.id;

        type == 0 ? (this.isCrm = true) : (this.isCrm = false);

        const response = await SnLeadsService.getLeadTasks({
          lead_id: idParam,
          taskForSn: type,
        });

        if (response.status == 200) {
          this.tasks = response.data;
        }
      } catch (error) {
        throw error;
      }
    },
    async markTaskAsDone(id) {
      try {
        const confirm = await this.showConfirmSwal();

        if (confirm.value) {
          const response = await TasksService.postDoneLeadTask({
            id: id,
            user_id: this.currentUser.user_id,
            lead_id: this.lead.id,
            taskForSn: this.isCrm ? 0 : 1,
          });

          if (response.status == 200) {
            this.showGenericToast({
              text: "Operation successfully",
            });

            this.tasks = response.data;
          } else {
            this.showGenericToast({
              variant: "warning",
              title: "Warning!",
              icon: "AlertTriangleIcon",
              text: `Something went wrong. ${response.message}`,
            });
          }
        }
      } catch (error) {
        throw error;
      }
    },
    async deleteTask(id) {
      const confirm = await this.showConfirmSwal();

      if (confirm.value) {
        const response = await this.A_DELETE_LEAD_TASK({
          id,
          user_id: this.currentUser.user_id,
          lead_id: this.lead.id,
          taskForSn: 0,
        });

        if (response.status == 200) {
          const index = this.tasks.map((el) => el.id).indexOf(id);
          if (index !== -1) this.tasks.splice(index, 1);
          this.showGenericToast({
            text: "Deleted successful",
          });
        } else {
          this.showGenericToast({
            variant: "warning",
            title: "Warning!",
            icon: "AlertTriangleIcon",
            text: `Something went wrong. ${response.message}`,
          });
        }
      }
    },
  },
  created() {
    this.searchTasks(0);
  },
};
</script>

<style lang="scss">
.card-tasks {
  overflow: auto;
  max-height: 680px !important;
}
</style>