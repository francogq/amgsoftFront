<template>
  <div>
    <div no-body class="mb-1 mt-1">
      <div v-if="isLoading" class="text-center text-primary my-2">
        <b-spinner class="align-middle mr-1" />
        <strong>Loading ...</strong>
      </div>
      <template v-else>
        <div v-for="(tasks, index) in tasksUpcoming" :key="index">
          <b-alert variant="info" class="mb-0" show>
            <div class="alert-body">
              <span>
                <strong>{{ tasks.day_name }}</strong>
                {{ tasks.date }} - ({{ tasks.sum_day }})
              </span>
            </div>
          </b-alert>
          <div class="table-responsive">
            <b-table
              ref="refTaskGrid"
              api-url="/tasks/get-all-tasks"
              class="position-relative"
              :items="JSON.parse(tasks.data)"
              :fields="arrayColumns"
              primary-key="id"
              table-class="text-nowrap"
              responsive="sm"
              striped
              outlined
              show-empty
              sticky-header="50vh"
            >
              <template #cell(client_name)="data">
                <b-link
                  class="text-important"
                  :to="
                    data.item.account_id == null
                      ? (data.item.route == 'socialnetwork' ? `/social-network/leads/new/dashboard/${data.item.lead_id}` : `/${data.item.route}/leads/${data.item.lead_id}`)
                      : `/${data.item.route}/clients/account/'${data.item.account_id}`
                  "
                  target="_blank"
                  >{{ data.item.client_name }}</b-link
                >
                <br />
                <span>
                  <feather-icon icon="SmartphoneIcon"></feather-icon>
                  {{ data.item.mobile }}
                </span>
              </template>
              <template #cell(due_date)="data">
                {{ data.item.due_date | myGlobalDay }}
                <br />
                <span style="font-weight: bold">
                  {{ data.item.real_time | myGlobalDay }} ({{
                    data.item.state_hour
                  }})
                </span>
              </template>
              <template #cell(actions)="data">
                <div class="d-flex justify-content-between align-items-center">
                  <span v-if="type != 4">
                    <b-button
                      variant="flat-success"
                      class="button-little-size rounded-circle"
                      @click="checkTask(data.item.id)"
                      v-b-tooltip.hover.top="'Done Task'"
                    >
                      <feather-icon icon="CheckCircleIcon" />
                    </b-button>
                  </span>
                  <span v-if="type != 4">
                    <b-button
                      variant="flat-warning"
                      class="button-little-size rounded-circle"
                      @click="openModalEditTask(data.item)"
                      v-b-tooltip.hover.top="'Edit Task'"
                    >
                      <feather-icon icon="EditIcon" />
                    </b-button>
                  </span>
                  <span>
                    <b-button
                      variant="flat-info"
                      class="button-little-size rounded-circle"
                      v-b-tooltip.hover.top="'View'"
                      @click="openModalShowTask(data.item)"
                    >
                      <feather-icon icon="EyeIcon" />
                    </b-button>
                  </span>
                  <span v-if="type != 4">
                    <b-button
                      variant="flat-danger"
                      class="button-little-size rounded-circle"
                      v-b-tooltip.hover.top="'Delete'"
                      @click="deleteTask(data.item.id)"
                    >
                      <feather-icon icon="Trash2Icon" />
                    </b-button>
                  </span>
                </div>
              </template>
            </b-table>
          </div>
        </div>
      </template>
    </div>
    <ModalEditTask
      v-if="modalEdit"
      @hide="closeModalEditTask"
      :infoTask="infoTask"
    />
    <ModalShowTask
      v-if="modalShow"
      @hide="closeModalShowTask"
      :infoTask="infoTask"
    />
  </div>
</template>
<script>
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import TaskService from "@/service/task/index.js";
import ModalEditTask from "../modals/ModalEditTask.vue";
import ModalShowTask from "../modals/ModalShowTask.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    type: {
      type: [Number, String],
      default: 1,
    },
    taskToday: {
      type: Boolean,
      default: false,
    },
  },
  directives: {
    Ripple,
  },
  components: {
    vSelect,
    ModalEditTask,
    ModalShowTask,
  },
  data() {
    return {
      isLoading: true,
      arrayColumns: [
        {
          key: "client_name",
          label: "Client Name",
          sortable: true,
          visible: true,
        },
        {
          key: "subject",
          label: "Subject",
          sortable: true,
          visible: true,
        },
        {
          key: "due_date",
          label: "Date / Hour",
          visible: true,
        },
        { key: "actions", label: "Actions" },
      ],
      modalEdit: false,
      modalShow: false,
      infoTask: {},
      tasksUpcoming: [],
    };
  },
  created() {
    this.getTasksUpcoming();
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  methods: {
    ...mapActions({
      A_GET_TASK_COUNTER: "TaskStore/A_GET_TASK_COUNTER",
    }),
    async getTasksUpcoming() {
      this.isLoading = true;
      let params = {
        order: "desc",
        orderby: 5,
        type: this.type,
        id: this.currentUser.user_id,
        api_url: "tasks/get-all-tasks",
      };
      const data = await TaskService.getAllTask(params);
      this.tasksUpcoming = data.data;
      this.isLoading = false;
    },
    resetSearch() {
      this.getTasksUpcoming();
    },
    async checkTask(taskId) {
      const confirm = await this.showConfirmSwal();
      if (confirm.value) {
        this.addPreloader();
        try {
          const data = await TaskService.postCheckTask({ id: taskId });
          this.removePreloader();
          this.showToast(
            "success",
            "top-right",
            "Congratulation!",
            "CheckIcon",
            "Task has been checked successfully"
          );
          this.A_GET_TASK_COUNTER({ id: this.currentUser.user_id });
          this.resetSearch();
        } catch (error) {
          this.showToast(
            "error",
            "top-right",
            "Oops!",
            "XIcon",
            "There was an error while deleting the task"
          );
          this.removePreloader();
          throw error;
        }
      }
    },
    openModalEditTask(task) {
      this.addPreloader();
      this.infoTask = task;
      this.modalEdit = true;
    },
    closeModalEditTask(status) {
      if (status) {
        this.resetSearch();
        this.A_GET_TASK_COUNTER({ id: this.currentUser.user_id });
      }
      this.modalEdit = false;
    },
    openModalShowTask(task) {
      this.addPreloader();
      this.infoTask = task;
      this.modalShow = true;
    },
    closeModalShowTask() {
      this.modalShow = false;
    },
    async deleteTask(taskId) {
      const confirm = await this.showConfirmSwal();
      if (confirm.value) {
        this.addPreloader();
        try {
          const data = await TaskService.deleteTaskCredit({ id: taskId });
          this.removePreloader();
          this.showToast(
            "success",
            "top-right",
            "Congratulation!",
            "CheckIcon",
            "Task has been deleted successfully"
          );
          this.A_GET_TASK_COUNTER({ id: this.currentUser.user_id });
          this.resetSearch();
        } catch (error) {
          this.showToast(
            "error",
            "top-right",
            "Oops!",
            "XIcon",
            "There was an error while deleting the task"
          );
          this.removePreloader();
          throw error;
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-sweetalert.scss";
</style>
