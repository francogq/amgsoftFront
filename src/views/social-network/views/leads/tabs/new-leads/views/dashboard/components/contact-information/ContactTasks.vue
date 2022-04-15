<template>
  <div
    style="
      margin-bottom: 15px;
      box-shadow: rgb(200 204 211 / 24%) 0px 0px 6px;
      height: 360px !important;
    "
  >
    <b-card body-class="px-0" class="h-card-sn h-100">
      <template #header>
        <b-card-title class="font-weight-bolder"> Tasks </b-card-title>
      </template>
      <template #footer>
        <div class="col-lg-12 text-right">
          <b-button
            v-show="countTaskDone != 0"
            variant="outline-secondary"
            class="btn-icon mr-1"
            title="History Tasks"
            @click="openModalTaskHistory"
          >
            <feather-icon icon="ListIcon"></feather-icon>
          </b-button>
          <b-button
            variant="primary"
            @click="openModalCreateTask"
            v-if="isLeadFull || taskForSn"
          >
            <feather-icon icon="PlusIcon"></feather-icon> ADD
          </b-button>
        </div>
      </template>
      <b-col sm="12" md="12" lg="12" xl="12" class="px-2">
        <b-tabs id="sn-d-ci-tasks" pills class="override-tab">
          <b-tab
            title-item-class="text-center w-15"
            :class="{ active: !taskForSn }"
            @click="getTaskShow(0)"
          >
            <template #title>CRM</template>
          </b-tab>
          <b-tab
            title-item-class="text-center w-15"
            :class="{ active: taskForSn }"
            @click="getTaskShow(1)"
          >
            <template #title>
              SN
              <!--<div
                v-if="countData == 0"
                class="rounded-circle text-white"
                style="display: inline-block; width: 25px; background: red"
              >
                {{ countData }}
              </div> -->
            </template>
          </b-tab>
        </b-tabs>
      </b-col>

      <b-table
        small
        :fields="fields"
        :items="tasks"
        sticky-header="180px"
        :busy="isBusy"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle mr-1" />
            <strong>Loading ...</strong>
          </div>
        </template>
        <template #cell(date)="data">
          <template v-if="!lead.state || lead.state == 'UNK'">
            {{ data.item.due_date | myGlobalDay }}
          </template>
          <template v-else>
            <span>{{ data.item.due_date | myGlobalDay }}</span>
            <br />
            <span style="font-weight: 700" v-if="data.item.real_time != null">
              {{ data.item.real_time | myGlobalDay }} ({{ lead.state }})
            </span>
          </template>
        </template>

        <template #cell(sms)="data">
          <span class="text-yes" v-if="data.item.sms_status == 1">YES</span>
          <span class="text-no" v-else>NO</span>
        </template>

        <template #cell(type)="data" v-if="!taskForSn">
          <span class="text-now" v-if="data.item.type_attend == 2">NOW</span>
          <span class="text-later" v-else>LATER</span>
        </template>
        <template #cell(actions)="data">
          <b-button
            variant="flat-success"
            size="sm"
            class="btn-icon rounded-circle"
            style="padding: 4px"
            @click="markTaskAsDone(data.item.id)"
          >
            <feather-icon icon="CheckIcon"></feather-icon>
          </b-button>
          <b-button
            variant="flat-warning"
            :title="
              data.item.type_attend == 2
                ? 'You cannot edit this task (now)'
                : 'Edit task'
            "
            class="btn-icon rounded-circle"
            style="padding: 4px"
            @click="openModalEditTask(data.item.id, false)"
            :class="{ 'not-pointer': data.item.type_attend == 2 }"
          >
            <feather-icon icon="Edit2Icon"></feather-icon>
          </b-button>
          <b-button
            variant="flat-primary"
            class="btn-icon rounded-circle"
            style="padding: 4px"
            @click="openModalEditTask(data.item.id, true)"
          >
            <feather-icon icon="EyeIcon"></feather-icon>
          </b-button>
          <b-button
            variant="flat-danger"
            class="btn-icon rounded-circle"
            style="padding: 4px"
            @click="deleteTask(data.item.id)"
          >
            <feather-icon icon="TrashIcon"></feather-icon>
          </b-button>
        </template>
      </b-table>

      <div class="ml-3" v-if="!isLeadFull &amp;&amp; !taskForSn">
        <p style="color: red">
          To create a task for CRM, you must complete these fields:
        </p>
        <ul style="color: red">
          <li v-if="requiredFieldsForCreateCrmTask.first_name == null">
            First name
          </li>
          <li v-if="requiredFieldsForCreateCrmTask.last_name == null">
            Last name
          </li>
          <li v-if="requiredFieldsForCreateCrmTask.mobile == null">Mobile</li>
        </ul>
      </div>
    </b-card>

    <modal-create-task
      v-if="showModalCreateTask"
      :lead="lead"
      :modul="15"
      :taskForSn="!taskForSn ? 0 : 1"
      :replyId="replyId"
      @onClose="closeModalCreateTask"
      @onReloadTasks="onReloadTasks"
    ></modal-create-task>

    <modal-edit-task
      v-if="showModalEditTask"
      :modul="15"
      :lead="lead"
      :task="task"
      :taskForSn="!taskForSn ? 0 : 1"
      :isDisabled="isDisabledModal"
      @onReloadTasks="onReloadTasks"
      @onClose="closeModalEditTask"
    ></modal-edit-task>

    <modal-task-history
      v-if="showModalTaskHistory"
      :modul="15"
      :lead="lead"
      :taskForSn="!taskForSn ? 0 : 1"
      :replyId="replyId"
      @onClose="closeModalTaskHistory"
    ></modal-task-history>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

// Components
import ModalCreateTask from "@/views/social-network/views/leads/components/ModalCreateTask.vue";
import ModalEditTask from "@/views/social-network/views/leads/components/ModalEditTask.vue";
import ModalTaskHistory from "@/views/social-network/views/leads/components/ModalTaskHistory.vue";

// Services
import SNLeadsService from "@/views/social-network/services/leads";
import TasksService from "@/service/task";

export default {
  props: {
    notes: {
      type: Object,
      default: () => ({}),
    },
    requiredFieldsForCreateCrmTask: {
      type: Object,
      default: () => ({}),
    },
    replyId: Number,
    modul: [String, Number],
    lead: {
      type: Object,
    },
  },
  components: {
    ModalCreateTask,
    ModalEditTask,
    ModalTaskHistory,
  },
  data() {
    return {
      tasks: [],
      task: null,
      isBusy: false,
      countTaskDone: 0,
      isDisabledModal: false,
      dataTask: [],
      events: [],
      error: {
        plataform: false,
        dateonline: false,
        usernameonline: false,
        passwordonline: false,
        membernumberonline: false,
      },
      min: new Date(1950, 0, 1, 8, 0, 0),
      max: new Date(2049, 11, 31, 18, 0, 0),
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(2050, 1, 1),
      currentDate: new Date(),
      loadingprocess: true,
      viewp: true,
      program_id:
        this.lead.lead_programs == null
          ? ""
          : JSON.parse(this.lead.lead_programs)[0].program_id,
      spinner: false,

      // Modals
      showModalCreateTask: false,
      showModalEditTask: false,
      showModalTaskHistory: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    fields() {
      return [
        { key: "subject", label: "Subject" },
        { key: "date", label: "Date / Hour" },
        { key: "sms", label: "Sms" },
        !this.taskForSn ? { key: "type", label: "Type" } : null,
        { key: "actions", label: "Actions" },
      ];
    },
    isLeadFull() {
      return (
        this.requiredFieldsForCreateCrmTask.first_name &&
        this.requiredFieldsForCreateCrmTask.last_name &&
        this.requiredFieldsForCreateCrmTask.mobile
      );
    },
    stateUpdate() {
      return this.requiredFieldsForCreateCrmTask.state
        ? this.requiredFieldsForCreateCrmTask.state
        : this.lead.state;
    },
  },
  methods: {
    ...mapActions({
      A_DELETE_LEAD_TASK: "TaskStore/A_DELETE_LEAD_TASK",
      A_GET_TASK: "TaskStore/A_GET_TASK",
    }),
    openModalCreateTask() {
      if (!this.lead.lead_name.trim()) {
        this.nameOrNick = this.lead.nickname;
      } else {
        this.nameOrNick = this.lead.lead_name;
      }
      this.type = 1;

      this.showModalCreateTask = true;
    },
    closeModalCreateTask() {
      this.dataTask = [];
      this.showModalCreateTask = false;
    },
    openModalTaskHistory() {
      if (!this.lead.lead_name.trim()) {
        this.nameOrNick = this.lead.nickname;
      } else {
        this.nameOrNick = this.lead.lead_name;
      }

      this.type = 0;
      this.showModalTaskHistory = true;
    },
    closeModalTaskHistory() {
      this.showModalTaskHistory = false;
    },
    onReloadTasks(tasks) {
      this.getTaskShow(this.taskForSn);
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
      this.showModalEditTask = false;
    },
    async markTaskAsDone(id) {
      try {
        const confirm = await this.showConfirmSwal();

        if (confirm.value) {
          const response = await TasksService.postDoneLeadTask({
            id: id,
            user_id: this.currentUser.user_id,
            lead_id: this.lead.id,
            taskForSn: this.taskForSn,
          });

          if (response.status == 200) {
            this.showGenericToast({
              text: "Operation successfully",
            });

            this.getTaskShow(this.taskForSn);
            this.lead.count_task = response.data.count_tasks;
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
      const confirm = await this.showGenericConfirmSwal({});

      if (confirm.value) {
        const response = await this.A_DELETE_LEAD_TASK({
          id: id,
          user_id: this.currentUser.user_id,
          lead_id: this.lead.id,
          taskForSn: this.taskForSn,
        });

        if (response.status == 200) {
          this.getTaskShow(this.taskForSn);

          this.showToast();
        }
      }
    },
    addTask() {
      this.getTaskShow(this.taskForSn);
    },
    async getTaskShow(type) {
      this.isBusy = true;
      let leadId = this.$route.params.id;

      this.spinner = true;
      this.tasks = [];

      //type = Crm o Sn
      this.taskForSn = type;

      const response = await SNLeadsService.getLeadTasks({
        lead_id: leadId,
        taskForSn: this.taskForSn,
        reply_id: this.replyId,
      });

      if (response.status == 200) {
        this.spinner = false;
        this.tasks = response.data;
        if (response.data[0]) {
          this.countTaskDone = response.data[0].count_task;
        }
      }
      this.isBusy = false;
    },
  },
  async created() {
    await this.getTaskShow(0);
  },
};
</script>

<style scoped>
.position-img {
  position: absolute;
  right: 0px;
  top: 0px;
}

.tabs-change {
  text-align: center;
  color: white;
  margin: 0px 3px;
  border-radius: 5px 5px 0px 0px;
  width: 160px !important;
  height: 27px !important;
}

.postion-tab {
  position: relative;
  top: -6px;
}

.text-yes {
  color: #80e400;
  font-size: 15;
  font-weight: 600;
}

.text-no {
  color: #ff6a6a;
  font-size: 15;
  font-weight: 600;
}

.text-now {
  color: #3671ee;
  font-size: 15;
  font-weight: 600;
}

.text-later {
  color: #ff9e6a;
  font-size: 15;
  font-weight: 600;
}
</style>
