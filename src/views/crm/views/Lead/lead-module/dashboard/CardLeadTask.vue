<template>
  <b-card body-class="px-0">
    <template #header>
      <b-card-title>Tasks</b-card-title>
    </template>
    <b-table
      show-empty
      small
      sticky-header
      striped
      responsive="sm"
      :fields="fieldsTask"
      :items="lead.lead_tasks"
      class="mb-0"
    >
      <template #cell(title)="data">{{ data.item.title }}</template>

      <template #cell(date)="data">
        <div style="white-space: nowrap">
          {{ data.item.due_date | myGlobalDay }}
          <template
            v-if="lead.state && lead.state !== 'UNK' && data.item.real_time"
          >
            <br />
            <span class="font-weight-bolder">
              {{ data.item.real_time | myGlobalDay }} ({{ lead.state }})
            </span>
          </template>
        </div>
      </template>

      <template #cell(sms)="data">
        <b-badge :variant="data.item.sms_status == 1 ? 'success' : 'danger'">{{
          data.item.sms_status == 1 ? "YES" : "NO"
        }}</b-badge>
      </template>

      <template #cell(actions)="data">
        <div v-if="!onlyRead" class="w-100 d-flex justify-content-around">
          <b-button
            variant="flat-success"
            class="button-little-size rounded-circle"
            :disabled="isLoading"
            @click="onDoneTask(data.item.id)"
          >
            <feather-icon v-if="!isLoading" icon="CheckCircleIcon" />
            <b-spinner v-else small />
          </b-button>
          <b-button
            variant="flat-warning"
            class="button-little-size rounded-circle"
            :disabled="isLoading"
            @click="onModalEditTaskOpen(data.item.id, false)"
          >
            <feather-icon v-if="!isLoading" icon="EditIcon" />
            <b-spinner v-else small />
          </b-button>
          <b-button
            variant="flat-info"
            class="button-little-size rounded-circle"
            :disabled="isLoading"
            @click="onModalEditTaskOpen(data.item.id, true)"
          >
            <feather-icon v-if="!isLoading" icon="EyeIcon" />
            <b-spinner v-else small />
          </b-button>
          <b-button
            variant="flat-danger"
            class="button-little-size rounded-circle"
            :disabled="isLoading"
            @click="onDeleteTask(data.item.id)"
          >
            <feather-icon v-if="!isLoading" icon="Trash2Icon" />
            <b-spinner v-else small />
          </b-button>
          <b-button
            variant="flat-warning"
            class="button-little-size rounded-circle"
            :class="data.item.favorite ? 'text-warning' : null"
            :disabled="isLoading"
            @click="onMakeFavoriteTask(data.item.id, data.item.favorite)"
          >
            <b-spinner v-if="isLoading" small />
            <template v-else>
              <b-icon v-if="data.item.favorite" icon="star-fill" />
              <b-icon v-else icon="star" />
            </template>
          </b-button>
        </div>
      </template>
    </b-table>

    <template v-if="!onlyRead" #footer>
      <div class="text-right">
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="primary"
          @click="onModalCreateTaskOpen"
        >
          <span class="align-middle">Add</span>
        </b-button>
        <b-button
          v-if="lead.count_task !== 0"
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="outline-secondary"
          class="btn-icon ml-1"
          @click="$bvModal.show('modal-task-history')"
        >
          <feather-icon icon="ListIcon" size="18" />
        </b-button>
      </div>
    </template>

    <!-- modal TASK CREATE -->
    <b-modal
      id="modal-task-create"
      ok-only
      title-class="h2 text-white"
      modal-class="modal-primary"
      centered
      size="lg"
      title="Tasks"
      hide-footer
      no-close-on-backdrop
    >
      <modal-task-create
        :modul="modul"
        :only-read="onlyRead"
        :lead="lead"
        :type="type"
        @onReloadTasks="onReloadTasks"
      />
    </b-modal>

    <!-- modal TASK EDIT -->
    <b-modal
      id="modal-task-edit"
      title-class="h2 text-white"
      ok-only
      modal-class="modal-primary"
      centered
      size="lg"
      title="Tasks"
      hide-footer
      no-close-on-backdrop
    >
      <modal-task-edit
        :modul="modul"
        :only-read="onlyRead"
        :lead="lead"
        :task="task"
        :is-disabled="isTaskDisabled"
        @onReloadTasks="onReloadTasks"
      />
    </b-modal>

    <!-- modal TASK HISTORY -->
    <b-modal
      id="modal-task-history"
      title-class="h3 text-white"
      modal-class="modal-primary"
      centered
      size="lg"
      :title="`All Tasks - ${nameModule}`"
      hide-footer
    >
      <modal-task-history :modul="modul" :lead="lead" />
    </b-modal>
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Ripple from "vue-ripple-directive";

import ModalTaskCreate from "../../lead-task/ModalTaskCreate.vue";
import ModalTaskEdit from "../../lead-task/ModalTaskEdit.vue";
import ModalTaskHistory from "../../lead-task/ModalTaskHistory.vue";

export default {
  components: {
    ModalTaskCreate,
    ModalTaskEdit,
    ModalTaskHistory,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
    nameModule() {
      if (this.taskForSn) {
        return "SOCIAL NETWORK";
      }
      return "CRM";
    },
  },
  created() {
    this.getUserAppointments();
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      fieldsTask: [
        { key: "subject", tdClass: "py-1" },
        { key: "date", label: "Date/Hour", tdClass: "py-1" },
        { key: "sms", tdClass: "py-1" },
        { key: "Actions", tdClass: "py-1" },
      ],
      isLoading: false,
      isTaskDisabled: false,
      task: {},
      taskForSn: 0,
      type: 0,
    };
  },
  methods: {
    ...mapActions({
      A_GET_USER_APPOINTMENT_SN: "CrmLeadStore/A_GET_USER_APPOINTMENT_SN",
      A_DONE_LEAD_TASK: "TaskStore/A_DONE_LEAD_TASK",
      A_GET_TASKS: "TaskStore/A_GET_TASKS",
      A_GET_TASK: "TaskStore/A_GET_TASK",
      A_DELETE_LEAD_TASK: "TaskStore/A_DELETE_LEAD_TASK",
      A_MAKE_FAVORITE_LEAD_TASK: "TaskStore/A_MAKE_FAVORITE_LEAD_TASK",
      A_GET_TASK_COUNTER: "TaskStore/A_GET_TASK_COUNTER",
    }),
    async getUserAppointments() {
      try {
        await this.A_GET_USER_APPOINTMENT_SN({
          date: "date_task",
          from: "from_task",
          to: "to_task",
          taskForSn: this.taskForSn,
        });
      } catch (error) {
        console.log("Something went wrong getUserAppointments", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    onModalCreateTaskOpen() {
      this.type = 1;
      this.addPreloader();
      this.$bvModal.show("modal-task-create");
    },
    onReloadTasks(tasks) {
      this.lead.lead_tasks = tasks;
    },
    onDoneTask(id) {
      this.isLoading = true;
      this.showConfirmSwal()
        .then(async (result) => {
          if (result.value) {
            const response = await this.A_DONE_LEAD_TASK({
              id,
              user_id: this.currentUser.user_id,
              lead_id: this.lead.id,
              taskForSn: 0,
            });
            if (this.isResponseSuccess(response)) {
              this.A_GET_TASK_COUNTER({ id: this.currentUser.user_id });
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Successful operation"
              );
              this.lead.lead_tasks = response.data;
              this.lead.count_task = response.data.count_tasks;
              await this.A_GET_TASKS({ id: this.currentUser.user_id });
            }
          }
          this.isLoading = false;
        })
        .catch((error) => {
          console.log("Something went wrong onDoneTask", error);
          this.showErrorSwal(error);
          this.isLoading = false;
        });
    },
    async onModalEditTaskOpen(id, isDisabled) {
      try {
        this.addPreloader();
        this.isLoading = true;
        const response = await this.A_GET_TASK({ id });
        if (this.isResponseSuccess(response)) {
          this.A_GET_TASK_COUNTER({ id: this.currentUser.user_id });
          this.task = response.data[0];
          this.isTaskDisabled = isDisabled;
          this.$bvModal.show("modal-task-edit");
        } else {
          this.showToast(
            "warning",
            "top-right",
            "Warning!",
            "AlertTriangleIcon",
            `Something went wrong. ${response.message}`
          );
        }
        this.isLoading = false;
      } catch (error) {
        console.log("Something went wrong onGetTask", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
        this.isLoading = false;
      }
    },
    onDeleteTask(id) {
      this.isLoading = true;
      this.showConfirmSwal()
        .then(async (result) => {
          if (result.value) {
            const response = await this.A_DELETE_LEAD_TASK({
              id,
              user_id: this.currentUser.user_id,
              lead_id: this.lead.id,
              taskForSn: 0,
            });
            if (this.isResponseSuccess(response)) {
              this.A_GET_TASK_COUNTER({ id: this.currentUser.user_id });
              await this.A_GET_TASKS({ id: this.currentUser.user_id });
              const index = this.lead.lead_tasks.map((el) => el.id).indexOf(id);
              if (index !== -1) this.lead.lead_tasks.splice(index, 1);
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Deleted successful"
              );
            } else {
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                `Something went wrong. ${response.message}`
              );
            }
          }
          this.isLoading = false;
        })
        .catch((error) => {
          console.log("Something went wrong onDeleteTask", error);
          this.showErrorSwal();
          this.isLoading = false;
        });
    },
    onMakeFavoriteTask(id, favorite) {
      this.isLoading = true;
      this.showConfirmSwal("Are you sure?", "Favorite Task")
        .then(async (result) => {
          if (result.value) {
            const response = await this.A_MAKE_FAVORITE_LEAD_TASK({
              id,
              favorite,
              user_id: this.currentUser.user_id,
              lead_id: this.lead.id,
              taskForSn: 0,
            });
            if (this.isResponseSuccess(response)) {
              this.lead.lead_tasks = response.data;
              this.showToast(
                "success",
                "top-right",
                "Success!",
                "CheckIcon",
                "Favorite successful"
              );
            } else {
              this.showToast(
                "warning",
                "top-right",
                "Warning!",
                "AlertTriangleIcon",
                `Something went wrong. ${response.message}`
              );
            }
          }
          this.isLoading = false;
        })
        .catch((error) => {
          console.log("Something went wrong onMakeFavoriteTask", error);
          this.showErrorSwal();
          this.isLoading = false;
        });
    },
  },
  mounted() {},
  props: {
    modul: {
      type: Number,
      required: true,
    },
    onlyRead: {
      type: Boolean,
      required: true,
    },
    lead: {
      type: Object,
      required: true,
    },
  },
  setup() {},
};
</script>
