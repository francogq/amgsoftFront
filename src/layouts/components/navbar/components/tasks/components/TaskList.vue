<template>
  <div>
    <b-card no-body class="mb-1 mt-1">
      <div class="m-2" v-if="!taskToday">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col cols="12" md="6"></b-col>
          <!-- Search -->
          <b-col cols="12" md="6">
            <div
              class="d-flex align-items-center justify-content-end align-items-center"
            >
              <b-button
                variant="primary"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                @click="exportExcel"
                :disabled="exportExcelDisabled"
              >
                <div class="d-flex justify-content-between">
                  <span class="text-nowrap">Export to excel</span>
                </div>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>
      <div class="table-responsive">
        <b-table
          ref="refTaskGrid"
          api-url="/tasks/get-all-tasks"
          class="position-relative"
          :items="myProvider"
          :fields="arrayColumns"
          primary-key="id"
          table-class="text-nowrap"
          responsive="sm"
          show-empty
          sticky-header="50vh"
          :busy="isBusy"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page.sync="currentPage"
          :per-page="perPage"
          :filter="searchInput"
        >
          <template #table-busy>
            <div class="text-center text-primary my-2">
              <b-spinner class="align-middle mr-1" />
              <strong>Loading ...</strong>
            </div>
          </template>
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
            <!-- 
            <b-link class="text-important">{{ data.item.client_name }}</b-link>-->
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
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted"
              >Showing {{ startPage }} to {{ toPage }} of
              {{ totalData }} entries</span
            >
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalData"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
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
      sortBy: "client_name",
      sortDesc: true,
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
      searchInput: "",
      orderby: "",
      order: "",
      startPage: 0,
      endPage: "",
      totalData: 0,
      perPage: 50,
      nextPage: "",
      currentPage: 1,
      toPage: 0,
      isBusy: false,
      perPageOptions: [10, 25, 50, 100],
      modalEdit: false,
      modalShow: false,
      infoTask: {},
      exportExcelDisabled: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),

    routeModule() {
      return this.$route.meta.route;
    },
  },
  methods: {
    ...mapActions({
      A_GET_TASK_COUNTER: "TaskStore/A_GET_TASK_COUNTER",
      A_EXPORT_TASKS_TO_EXCEL: "TaskStore/A_EXPORT_TASKS_TO_EXCEL",
    }),
    async myProvider(ctx) {
      let params = {
        api_url: ctx.apiUrl,
        page: ctx.currentPage,
        num: ctx.perPage,
        order: ctx.sortDesc == 1 ? "desc" : "asc",
        orderby: 5,
        type: this.type,
        id: this.currentUser.user_id,
      };
      const data = await TaskService.getAllTask(params);
      const items = data.data;
      this.startPage = data.from;
      this.currentPage = data.current_page;
      this.perPage = data.per_page;
      this.nextPage = this.startPage + 1;
      this.endPage = data.last_page;
      this.totalData = data.total;
      this.toPage = data.to;
      // Must return an array of items or an empty array if an error occurred
      return items || [];
    },
    resetSearch() {
      this.$refs.refTaskGrid.refresh();
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
          this.$refs.refTaskGrid.refresh();
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
    async exportExcel() {
      const confirm = await this.showConfirmSwal(
        "Are you sure?",
        "Generating Excel!!!"
      );
      if (confirm.isConfirmed) {
        this.exportExcelDisabled = true;
        try {
          const params = {
            type: this.type,
            user_id: this.currentUser.user_id,
          };
          const response = await this.A_EXPORT_TASKS_TO_EXCEL(params);
          await this.forceFileDownload(response, "tasks.xlsx");
          setTimeout(() => {
            this.exportExcelDisabled = false;
          }, 3000);
        } catch (error) {
          this.showErrorSwal(error);
          this.exportExcelDisabled = false;
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
          this.$refs.refTaskGrid.refresh();
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
