<template>
  <div>
    <header-slot>

      <template #actions>
        <div>
          <b-row style="justify-content: right;">
            <b-col md="9">
              <b-button v-if="isCeo || isSupervisor || isTeamLeader" variant="primary" size="sm" @click="openInsertTaskModal(false)">
                CREATE ACTIVITY
              </b-button>
            </b-col>
          </b-row>
        </div>
      </template>
    </header-slot>

    <b-card no-body>
      <!--      <div class="card-header d-flex justify-content-end" style="background: transparent" >-->

      <!--          <b-button-->
      <!--            variant="primary"-->
      <!--            @click="openInsertTaskModal(false)"-->
      <!--          >-->
      <!--            CREATE TASK-->
      <!--          </b-button>-->

      <!--        &lt;!&ndash;        <template>&ndash;&gt;-->
      <!--        &lt;!&ndash;          <div>&ndash;&gt;-->

      <!--        &lt;!&ndash;            <b-button&ndash;&gt;-->
      <!--        &lt;!&ndash;              v-b-toggle.sidebar-right&ndash;&gt;-->
      <!--        &lt;!&ndash;              v-b-tooltip.bottom="'Advanced Search'"&ndash;&gt;-->
      <!--        &lt;!&ndash;              variant="primary"&ndash;&gt;-->
      <!--        &lt;!&ndash;            >&ndash;&gt;-->
      <!--        &lt;!&ndash;              <div class="d-flex justify-content-between">&ndash;&gt;-->
      <!--        &lt;!&ndash;                <feather-icon&ndash;&gt;-->
      <!--        &lt;!&ndash;                  icon="FilterIcon"&ndash;&gt;-->
      <!--        &lt;!&ndash;                  size="15"&ndash;&gt;-->
      <!--        &lt;!&ndash;                />&ndash;&gt;-->
      <!--        &lt;!&ndash;              </div>&ndash;&gt;-->
      <!--        &lt;!&ndash;            </b-button>&ndash;&gt;-->
      <!--        &lt;!&ndash;            <b-sidebar&ndash;&gt;-->
      <!--        &lt;!&ndash;              id="sidebar-right"&ndash;&gt;-->
      <!--        &lt;!&ndash;              right&ndash;&gt;-->
      <!--        &lt;!&ndash;              backdrop&ndash;&gt;-->
      <!--        &lt;!&ndash;              bg-variant="white"&ndash;&gt;-->
      <!--        &lt;!&ndash;              sidebar-class="sidebar-lg"&ndash;&gt;-->
      <!--        &lt;!&ndash;              header-class="pt-1"&ndash;&gt;-->
      <!--        &lt;!&ndash;              lazy&ndash;&gt;-->
      <!--        &lt;!&ndash;            >&ndash;&gt;-->
      <!--        &lt;!&ndash;              <template #header>&ndash;&gt;-->
      <!--        &lt;!&ndash;                <div class="d-flex justify-content-between align-items-center w-100">&ndash;&gt;-->
      <!--        &lt;!&ndash;                  <span>&ndash;&gt;-->
      <!--        &lt;!&ndash;                    <h3>Advanced Search</h3>&ndash;&gt;-->
      <!--        &lt;!&ndash;                  </span>&ndash;&gt;-->
      <!--        &lt;!&ndash;                  <span&ndash;&gt;-->
      <!--        &lt;!&ndash;                    v-b-toggle.sidebar-right&ndash;&gt;-->
      <!--        &lt;!&ndash;                    class="cursor-pointer"&ndash;&gt;-->
      <!--        &lt;!&ndash;                  >&ndash;&gt;-->
      <!--        &lt;!&ndash;                    <amg-icon&ndash;&gt;-->
      <!--        &lt;!&ndash;                      icon="XIcon"&ndash;&gt;-->
      <!--        &lt;!&ndash;                      size="20"&ndash;&gt;-->
      <!--        &lt;!&ndash;                    />&ndash;&gt;-->
      <!--        &lt;!&ndash;                  </span>&ndash;&gt;-->
      <!--        &lt;!&ndash;                </div>&ndash;&gt;-->
      <!--        &lt;!&ndash;              </template>&ndash;&gt;-->
      <!--        &lt;!&ndash;              <b-container>&ndash;&gt;-->
      <!--        &lt;!&ndash;                <filters-component&ndash;&gt;-->
      <!--        &lt;!&ndash;                  :filters="filter"&ndash;&gt;-->
      <!--        &lt;!&ndash;                />&ndash;&gt;-->
      <!--        &lt;!&ndash;              </b-container>&ndash;&gt;-->
      <!--        &lt;!&ndash;              <template #footer>&ndash;&gt;-->
      <!--        &lt;!&ndash;                <b-container>&ndash;&gt;-->
      <!--        &lt;!&ndash;                  <b-row class="d-flex align-items-center justify-content-between p-1">&ndash;&gt;-->
      <!--        &lt;!&ndash;                    <b-button&ndash;&gt;-->
      <!--        &lt;!&ndash;                      v-b-toggle.sidebar-right&ndash;&gt;-->
      <!--        &lt;!&ndash;                      variant="info"&ndash;&gt;-->
      <!--        &lt;!&ndash;                      @click="$emit('reset-all-filters')"&ndash;&gt;-->
      <!--        &lt;!&ndash;                    >&ndash;&gt;-->
      <!--        &lt;!&ndash;                      Reset&ndash;&gt;-->
      <!--        &lt;!&ndash;                    </b-button>&ndash;&gt;-->
      <!--        &lt;!&ndash;                    <b-button&ndash;&gt;-->
      <!--        &lt;!&ndash;                      v-b-toggle.sidebar-right&ndash;&gt;-->
      <!--        &lt;!&ndash;                      variant="primary"&ndash;&gt;-->
      <!--        &lt;!&ndash;                      @click="sideBarSearch"&ndash;&gt;-->
      <!--        &lt;!&ndash;                    >&ndash;&gt;-->
      <!--        &lt;!&ndash;                      Search&ndash;&gt;-->
      <!--        &lt;!&ndash;                    </b-button>&ndash;&gt;-->
      <!--        &lt;!&ndash;                  </b-row>&ndash;&gt;-->
      <!--        &lt;!&ndash;                </b-container>&ndash;&gt;-->
      <!--        &lt;!&ndash;              </template>&ndash;&gt;-->
      <!--        &lt;!&ndash;            </b-sidebar>&ndash;&gt;-->
      <!--        &lt;!&ndash;          </div>&ndash;&gt;-->
      <!--        &lt;!&ndash;        </template>&ndash;&gt;-->
      <!--      </div>-->
      <b-container fluid>
        <div class="row">
          <b-table-simple
              ref="activities"
              :busy.sync="isBusy"
              small
              caption-top
              responsive
          >
            <b-thead>
              <b-tr>
                <b-th class="text-center"> USER</b-th>
                <b-th class="text-center"> MON</b-th>
                <b-th class="text-center"> BREAK</b-th>
                <b-th class="text-center"> TUE</b-th>
                <b-th class="text-center"> BREAK</b-th>
                <b-th class="text-center"> WED</b-th>
                <b-th class="text-center"> BREAK</b-th>
                <b-th class="text-center"> THU</b-th>
                <b-th class="text-center"> BREAK</b-th>
                <b-th class="text-center"> FRI</b-th>
                <b-th class="text-center"> BREAK</b-th>
                <b-th class="text-center"> SAT</b-th>
                <b-th class="text-center"> BREAK</b-th>
                <b-th class="text-center"> SUN</b-th>
                <b-th class="text-center"> BREAK</b-th>
                <b-th class="text-center"> ACTION</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="(item, index) in schedules" :key="index">
                <b-th>{{ item.name_user }}</b-th>

                <td v-for="(schedule, i) in item.json_data" :key="i">
                  <div v-if="schedule.isBreak === 0">
                    <div
                        v-if="schedule.id_tasks != null"
                        v-b-tooltip.hover
                        :title="schedule.title_task"
                        class="text-white cursor-pointer schedule"
                        :style="'background:' + schedule.color + '!important'"
                        @click="openSchedulesModal(schedule, item, true)"
                    >
                      {{ schedule.clock_in }} to {{ schedule.clock_out }}
                    </div>
                    <div
                        v-else
                        :style="
                        skin === 'dark'
                          ? 'background: black'
                          : 'background: #f1f1f1;'
                      "
                        class="cursor-pointer off"
                        @click="openSchedulesModal(schedule, item, false)"
                    >
                      OFF
                    </div>
                  </div>
                  <div v-else>
                    {{ schedule.start_break }}
                  </div>
                </td>
                <td>
                  <b-icon
                      icon="list-check"
                      class="rounded cursor-pointer"
                      size="50px"
                      style="font-size: 10px"
                      title="SEE TRACKING"
                      @click="openTrackingModal(schedule, item)"
                  >
                    TRACKING
                  </b-icon>
                </td>
              </b-tr>
            </b-tbody>
            <b-tfoot>
              <b-tr/>
            </b-tfoot>
          </b-table-simple>
        </div>
      </b-container>
      <modal-create-task
          v-if="modalInsertTaskModal"
          :edit-task="editTask"
          :task-out="taskOut"
          @getSchedules="getSchedulesIn"
          @close="closeInsertTaskModal"
      />

      <modal-tracking
          v-if="modalTrackingModal"
          :item="item"
          :from="date.from"
          :to="date.to"
          :user="user"
          @close="closeTrackingModal"
      />
      <modal-schedule
          v-if="modalSchedulesModal"
          :user="user"
          :schedule="schedule"
          :schedules="schedules"
          :edit="edit"
          @getSchedules="getSchedulesIn"
          @close="closeSchedulesModal"
      />

      <div class="row" style="margin: 1px !important">
        <div
            v-for="(i, index) in tasks"
            :key="index"
            class="col-sm-2"
            style="margin: 0 !important; padding: 1px !important"
        >
          <div
              :style="'background:' + i.color + '!important'"
              class="border-task"
              @click="openInsertTaskModal(true, i)"
          >
            <p
                v-if="i.title.length < 24"
                class="card-text text-white text-center cursor-pointer"
            >
              {{ i.title }}
            </p>
            <p v-else class="card-text text-white text-center cursor-pointer">
              {{ i.title.substr(0, 24) }}...
            </p>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ActivitiesService from "@/views/social-network/views/activities/activities.service";

import ModalCreateTask
  from "@/views/social-network/views/activities/activities-module/modals/create-task-modal/CreateTaskModal.vue";

import ModalSchedule
  from "@/views/social-network/views/activities/activities-module/modals/schedules-modal/SchedulesModal.vue";

import ModalTracking
  from "@/views/social-network/views/activities/activities-module/modals/tracking-modal/TrackingModal.vue";

import FilterData from "@/views/social-network/views/activities/activities-module/filters.data";

export default {
  components: {
    ModalCreateTask,
    ModalTracking,
    ModalSchedule,
  },
  data() {
    return {
      lenght: null,
      fields: [],
      filter: FilterData,
      isBusy: false,
      schedules: [],
      date: {
        // from: moment().startOf("week").add(1, "days").format("YYYY-MM-DD"),
        // to: moment().endOf("week").add(1, "days").format("YYYY-MM-DD"),
        from: "2021-10-18",
        to: "2021-10-24",
      },
      modalInsertTaskModal: false,
      modalTrackingModal: false,
      modalSchedulesModal: false,
      item: {},
      schedule: {},
      user: {},
      edit: false,
      editTask: false,
      taskOut: null,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      tasks: "SocialNetworkActivities/G_TASKS",
      skin: "appConfig/skin",
    }),
    classAdd() {
      return this.skin === "dark" ? "dark" : "";
    },
  },

  created() {
    this.$store.commit("app/SET_LOADING", true);
    // this.filter[0].model = '2020-10-18'
    // this.filter[1].model = '2020-10-24'
    this.getSchedulesIn();
    this.A_GET_TASKS();
  },
  methods: {
    dataByDay(data) {
      this.fields = [];
      let json = [];
      this.fields.push({
        key: "field",
        label: "USER",
        sortable: false,
      });

      data.map((json_data) => {
        // eslint-disable-next-line no-param-reassign
        json = json_data.json_data;
      });

      for (let i = 0; i < json.length - 1; i += 2) {
        const date = new Date(json[i].date);
        const options = {
          weekday: "long",
          month: "numeric",
          day: "numeric",
        };

        this.fields.push({
          key: "field",
          label: date.toLocaleDateString("en-US", options),
        });
        this.fields.push({
          key: "field",
          label: "Break",
        });
      }

      this.fields.push({
        key: "field",
        label: "Action",
        sortable: false,
      });
    },
    ...mapActions("SocialNetworkActivities", ["A_GET_TASKS"]),
    async getSchedulesIn() {
      const params = {
        from: this.date.from,
        to: this.date.to,
      };
      const data = await ActivitiesService.getSchedules(params);
      if (data.status === 200) {
        this.$store.commit("app/SET_LOADING", false);
      }

      this.schedules = data.data;

      // this.dataByDay(this.schedules)
      return this.schedules;
    },
   async openInsertTaskModal(editTask, task) {
      if (this.isCeo || this.isSupervisor || this.isTeamLeader) {
        this.editTask = editTask;
        this.modalInsertTaskModal = true;
        this.taskOut = task;

      }
    },

    closeInsertTaskModal() {
      this.A_GET_TASKS();
      this.modalInsertTaskModal = false;
    },

    openSchedulesModal(schedule, item, edit) {
      if (this.isCeo || this.isSupervisor || this.isTeamLeader) {
        this.modalSchedulesModal = true;
        this.user = item;

        this.schedule = schedule;
        this.edit = edit;
      }
    },

    closeSchedulesModal() {
      this.modalSchedulesModal = false;
    },

    openTrackingModal(schedule, item) {
      this.modalTrackingModal = true;
      this.user.name_user = item.name_user;
      this.user.id = item.id;
      this.schedule = schedule;
      this.item = item;
    },

    closeTrackingModal() {
      this.modalTrackingModal = false;
    },

    resetFilter() {
      this.filter.map((fil) => {
        fil.model = null;
      });

      this.$emit("reload");
    },
    sideBarSearch() {
      this.getSchedulesIn();
    },
  },
};
</script>

<style scoped>
tbody tr td {
  text-align: center !important;
}

.schedule {
  padding-top: 1px;
  padding-bottom: 1px;
  border-radius: 7px;
}

.off {
  background: #f1f1f1;
  color: #b1b1b1;
  padding-top: 1px;
  padding-bottom: 1px;
  border-radius: 7px;
}

.border-task {
  border: 1px solid transparent !important;
  padding-top: 1px;
  padding-bottom: 1px;
  border-radius: 7px;
}
</style>
