<template>
  <div>
    <b-nav-item-dropdown
      right
      class="dropdown-notification mr-25"
      menu-class="dropdown-menu-media"
    >
      <template #button-content>
        <feather-icon
          :badge="taskCounter"
          badge-classes="badge-important"
          class="text-body"
          icon="ClipboardIcon"
          size="19"
        />
      </template>

      <!-- Header -->
      <li class="dropdown-menu-header">
        <div class="dropdown-header d-flex">
          <h4 class="notification-title mb-0 mr-auto">Tasks</h4>
        </div>
      </li>

      <!-- Notifications -->
      <vue-perfect-scrollbar
        :settings="perfectScrollbarSettings"
        class="scrollable-container media-list scroll-area"
        tagname="li"
      >
        <template v-for="notification in S_TASKS">
          <div :key="notification.id">
            <div class="media d-flex align-items-center">
              <h6 class="font-weight-bolder mr-auto mb-0 text-capitalize">
                {{ notification.type }}
              </h6>
            </div>
            <!-- Account Notification -->
            <template v-for="task in notification.tasks">
              <b-link :key="task.id">
                <router-link
                  :to="resolveRoute(task)"
                >
                  <b-media>
                    <template #aside>
                      <b-avatar size="32" variant="light-secondary">
                        <feather-icon icon="ClipboardIcon" />
                      </b-avatar>
                    </template>

                    <p class="media-heading">
                      <span class="font-weight-bolder">{{ task.subject }}</span>
                    </p>
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <small
                        class="notification-text"
                        style="width: calc(100% - 115px)"
                      >
                        {{ task.client_name }} | {{ task.date | myHourTime }} |
                        {{ task.real_time | myHourTime }}
                      </small>
                      <b-button
                        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                        variant="outline-primary"
                        size="sm"
                        style="width: 105px"
                        block
                      >
                        {{ notification.type == "today" ? "" : task.cant }}
                        {{ notification.type }}
                      </b-button>
                    </div>
                  </b-media>
                </router-link>
              </b-link>
            </template>
          </div>
        </template>
      </vue-perfect-scrollbar>

      <!-- Cart Footer -->
      <li class="dropdown-menu-footer">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          block
          @click="taskModal = true"
          >See all tasks</b-button
        >
      </li>
    </b-nav-item-dropdown>
    <b-modal
      size="xmd"
      v-model="taskModal"
      scrollable
      hide-footer
      modal-class="modal-primary"
      title="Tasks"
      title-class="h2 text-white"
    >
      <task-modal></task-modal>
    </b-modal>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Ripple from "vue-ripple-directive";
import TaskModal from "./components/TaskModal.vue";
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
export default {
  async mounted() {
    this.getFirstFiveUserTasks();
    await this.getTaskCounter();
    this.showTaskTodayModal();
  },
  components: {
    VuePerfectScrollbar,
    TaskModal,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      taskCounter: "TaskStore/taskCounter",
    }),
    ...mapState({
      S_TASKS: (state) => state.TaskStore.S_TASKS,
    }),
  },
  data() {
    return {
      perfectScrollbarSettings: {
        maxScrollbarLength: 60,
        wheelPropagation: false,
      },
      taskModal: false,
    };
  },
  methods: {
    ...mapActions({
      A_GET_TASKS: "TaskStore/A_GET_TASKS",
      A_GET_TASK_COUNTER: "TaskStore/A_GET_TASK_COUNTER",
    }),
    ...mapMutations({
      showTaskTodayModal: "TaskStore/M_SHOW_TASK_TODAY_MODAL",
    }),
    async getFirstFiveUserTasks() {
      try {
        await this.A_GET_TASKS({ id: this.currentUser.user_id });
      } catch (error) {}
    },
    async getTaskCounter() {
      try {
        await this.A_GET_TASK_COUNTER({ id: this.currentUser.user_id }, true);
      } catch (error) {}
    },
    resolveRoute(task){
      if(!task.lead_id){
        return `/${task.module}/clients/account/${task.account_id}`
      }else{
        if(task.module == 'socialnetwork'){
          return `/social-network/leads/new/dashboard/${task.lead_id}`
        }else{
          return `/${task.module}/leads/show/${task.lead_id}`
        }
      }
    }
  },
};
</script>

<style>
</style>
