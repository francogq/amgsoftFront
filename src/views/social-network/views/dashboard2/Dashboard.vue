<template>
  <div>
    <header-slot> </header-slot>
    <b-card no-body>
      <b-row class="p-1">
        <b-col md="auto" sm="auto">
          <div class="d-inline-flex all-text">
            <span class="pr-1 ml-2 day">Day </span>
            <span>
              {{ today | myGlobal }}
            </span>
          </div>
        </b-col>
        <b-col md="auto" sm="auto">
          <div class="d-inline-flex">
            <b-button
              :disabled="today < '2021-04-15'"
              variant="info"
              class="btn-icon rounded-circle mr-1"
              @click="changeDateCard(-1)"
            >
              <feather-icon icon="ChevronLeftIcon" />
            </b-button>
            <b-button
              :disabled="currentDay === today"
              variant="info"
              class="btn-icon rounded-circle"
              @click="changeDateCard(1)"
            >
              <feather-icon icon="ChevronRightIcon" />
            </b-button>
          </div>
        </b-col>

        <b-col md="3" sm="3">
          <div
            v-if="
              (isTeamLeader || isSupervisor || isCeo) &&
              labelGraph !== 'Answers'
            "
            class="ml-2"
          >
            <v-select
              v-model="userFilter"
              :options="users"
              label="user_name"
              @input="getFilterCard(), getGraphics(idSelected)"
            />
          </div>
        </b-col>
      </b-row>
    </b-card>
    <caro-card
      v-if="subscribersGained.analyticsData"
      :key="cardUpdate"
      @getGraphics_version2="getGraphics"
      :chart-data="subscribersGained.series"
      :data="card"
      :type="typeCard"
      :date_init="dateRange.startDate"
      :date_end="dateRange.endDate"
      :program="programFilter"
      :user="userFilter"
    />

    <div class="m-0">
      <b-card :title="`${chardOption.option} Balance`">
        <b-row>
          <b-col
            md="2"
            v-if="labelGraph === 'Leads' || labelGraph === 'Answers'"
          >
            <v-select
              v-if="labelGraph === 'Leads'"
              v-model="programFilter"
              class="w-100"
              :options="OptionProgram"
              label="option"
              @input="getFilterCard(), getGraphics(idSelected)"
            />
            <v-select
              :disabled="firstValidation"
              v-if="labelGraph === 'Answers'"
              v-model="userFilter"
              :options="users"
              label="user_name"
              @input="getFilterCard(), getGraphics(idSelected)"
            />
          </b-col>
          <b-col md="3">
            <v-select
              v-model="chardOption.option"
              class="per-page-selector"
              style="font-size: 15px"
              :clearable="false"
              label="option"
              :options="arrayOptions"
              @input="getGraphics"
            />
          </b-col>
          <b-col md="auto" sm="auto">
            <span
              style="padding-top: 7px"
              class="all-text day d-inline-flex pl-2 mobil"
              >Current {{ showGraphForWeek ? "Week" : "Month" }}</span
            >
          </b-col>
          <b-col md="auto" sm="auto">
            <span style="padding-top: 7px" class="all-text d-inline-flex">
              {{ (showGraphForWeek ? firstDay : firstDayOfMonth) | myGlobal }}
              -
              {{ (showGraphForWeek ? endDay : endDayOfMonth) | myGlobal }}
            </span>
          </b-col>
          <b-col md="auto">
            <b-button
              variant="info"
              class="btn-icon rounded-circle mr-1"
              @click="
                showGraphForWeek ? changeWeek(-1) : changeMonth(-1),
                  getGraphics(idSelected)
              "
            >
              <feather-icon icon="ChevronLeftIcon" />
            </b-button>
            <b-button
              variant="info"
              class="btn-icon rounded-circle"
              :disabled="validateDate > currentDay"
              @click="
                showGraphForWeek ? changeWeek(1) : changeMonth(1),
                  getGraphics(idSelected)
              "
            >
              <feather-icon icon="ChevronRightIcon" />
            </b-button>
          </b-col>

          <b-col md="auto">
            <b-button
              :disabled="chardOption.option.id === 11"
              v-b-tooltip.hover
              style="padding-top: 7px"
              size="30"
              class="rounded"
              variant="primary"
              title="CHANGE"
              @click="
                (showGraphForWeek = !showGraphForWeek), getGraphics(idSelected)
              "
            >
              <feather-icon icon="CalendarIcon" />
              {{ showGraphForWeek ? "SHOW MONTH" : "SHOW WEEK" }}
            </b-button>
          </b-col>
        </b-row>
        <app-echart-line-social-network :key="idEchart" :option-data="option" />
      </b-card>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import vSelect from "vue-select";
import { kFormatter } from "@core/utils/filter";
import DashboardService from "@/views/social-network/views/dashboard2/dashboard.service";
import Card from "@/views/social-network/views/dashboard2/components/Card.vue";
import AppEchartLineSocialNetwork from "@/views/social-network/views/dashboard2/components/chard/AppEchartLineSocialNetwork.vue";
import CaroCard from "@/views/social-network/views/dashboard2/components/CaroCard.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    vSelect,
    Card,
    AppEchartLineSocialNetwork,
    CaroCard,
  },
  data() {
    return {
      subscribersGained: {
        series: [{ data: [28, 40, 36, 52, 38, 60, 55] }],
        analyticsData: { subscribers: 92600 },
      },
      idEchart: 0,
      option: {
        xAxisData: [],

        series: [],
      },
      validateDate: null,
      firstDay: moment()
        .startOf("week")
        .add(1, "days")
        .format("YYYY-MM-DD 00:00:00"),
      endDay: moment()
        .endOf("week")
        .add(1, "days")
        .format("YYYY-MM-DD 00:00:00"),
      firstDayOfMonth: moment().startOf("month").format("YYYY-MM-DD 00:00:00"),
      endDayOfMonth: moment().endOf("month").format("YYYY-MM-DD 00:00:00"),
      showGraphForWeek: false,
      dateRange: {
        startDate: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
        endDate: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
      },
      currentDay: moment().format("YYYY-MM-DD 00:00:00"),
      typeCard: null,
      cardUpdate: 0,
      chardOption: {},
      graph: [],
      card: [
        {
          title: "replies",
          data: 0,
          style:
            "background: linear-gradient(75.42deg, #6943E6 24.3%, #8A67FF 99.88%, #7A6AAD 99.88%)!important;border: 1px solid #4015D0;",
          styleModal:
            "background: linear-gradient(75.42deg, #6943E6 24.3%, #8A67FF 99.88%, #7A6AAD 99.88%)!important;",
          icon: "MessageCircleIcon",
          cursor: true,
          color: "#744FEF",
          back: "background-color: rgba(143, 95, 232, 0.12)!important",
          series: [],
          key: 0,
        },
        {
          title: "leads",
          data: 0,
          style:
            "background: linear-gradient(75.42deg, #E84E4D 24.3%, #FF7170 99.88%)!important;border: 1px solid #D73A39;",
          styleModal:
            "background: linear-gradient(75.42deg, #E84E4D 24.3%, #FF7170 99.88%)!important;",
          icon: "UsersIcon",
          cursor: true,
          color: "#E84E4D",
          back: "background-color: rgba(252, 66, 74, 0.12)!important",
          series: [],
          key: 0,
        },
        {
          title: "answers",
          data: 0,
          style:
            "background: linear-gradient(75.42deg, #E2764A 24.3%, #FF996F 99.88%)!important;border: 1px solid #CA4F1D;",
          styleModal:
            "background: linear-gradient(75.42deg, #E2764A 24.3%, #FF996F 99.88%)!important;",
          icon: "MessageSquareIcon",
          cursor: true,
          color: "#E67B4F",
          back: "background-color: rgba(255, 159, 67, 0.12)!important",
          series: [],
          key: 0,
        },
        {
          title: "mobiles",
          color: "#4EC4F0",
          data: 0,
          style:
            "background: linear-gradient(75.42deg, #4BBFEA 24.3%, #54D1FF 99.88%)!important;border: 1px solid #279FCB;",
          styleModal:
            "background: linear-gradient(75.42deg, #4BBFEA 24.3%, #54D1FF 99.88%)!important;",
          icon: "SmartphoneIcon",
          cursor: true,
          back: "background-color: rgba(0, 144, 231, 0.12)!important",
          series: [],
          key: 0,
        },
        {
          title: "appointments",
          color: "#515CEE",
          data: 0,
          style:
            "background: linear-gradient(75.42deg, #4B56E9 24.3%, #4B56E9 24.3%, #6671FF 99.88%)!important;border: 1px solid #3B45D0;",
          styleModal:
            "background: linear-gradient(75.42deg, #4B56E9 24.3%, #4B56E9 24.3%, #6671FF 99.88%)!important;",
          icon: "CalendarIcon",
          cursor: true,
          back: "background-color: rgba(143, 95, 232, 0.12)!important",
          series: [],
          key: 0,
        },
        {
          title: "productivity",
          color: "#40A094",
          data: 0,
          style:
            "background: linear-gradient(75.42deg, #3ACDBB 24.3%, #42EDD8 99.88%)!important;border: 1px solid #14AC9A;",
          styleModal:
            "background: linear-gradient(75.42deg, #3ACDBB 24.3%, #42EDD8 99.88%)!important;",

          icon: "PercentIcon",
          cursor: true,
          back: "background-color: rgba(0, 210, 91, 0.12)!important",
          series: [],
          key: 0,
        },
      ],
      arrayOptions: [
        {
          id: 10,
          option: "Seller appointment",
        },
        {
          id: 11,
          option: "Weekly Average",
        },
      ],
      today: moment().format("YYYY-MM-DD 00:00:00"),
      advanceFilter: false,
      programFilter: [
        {
          id: 0,
          option: "All programs",
        },
      ],
      userFilter: [
        {
          id: "0",
        },
      ],
      OptionProgram: [
        {
          id: 0,
          option: "All programs",
        },
        {
          id: 1,
          option: "Business",
        },
        {
          id: 2,
          option: "Boost Credit",
        },
        {
          id: 3,
          option: "Credit Experts",
        },
        {
          id: 5,
          option: "Tax Research",
        },
      ],

      users: [],
      juniorUser: false,
      labelGraph: null,
      type: null,
      labelsDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      keychart: 0,
      idSelected: "",
      firstValidation: "",
    };
  },
  watch: {
    showGraphForWeek(newVal, oldVal) {
      this.firstDay = moment()
        .startOf("week")
        .add(1, "days")
        .format("YYYY-MM-DD 00:00:00");
      this.endDay = moment(this.firstDay)
        .add(6, "days")
        .format("YYYY-MM-DD 00:00:00");
      this.firstDayOfMonth = moment()
        .startOf("month")
        .format("YYYY-MM-DD 00:00:00");
      this.endDayOfMonth = moment()
        .endOf("month")
        .format("YYYY-MM-DD 00:00:00");
      this.validateDate = this.showGraphForWeek
        ? this.endDay
        : this.endDayOfMonth;
    },
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
  },
  async created() {
    this.addPreloader();
    this.validation();
    this.programFilter.id = 0;
    if (this.isSupervisor || this.isTeamLeader || this.isCeo) {
      this.userFilter.id = 0;
    } else {
      this.userFilter.id = this.currentUser.user_id;
    }

    this.chardOption.option = "Replies";
    this.chardOption.id = 0;
    await this.getUsers();
    await this.getGraphics(this.chardOption.id);

    this.validateDate = this.showGraphForWeek
      ? this.endDay
      : this.endDayOfMonth;

    this.removePreloader();
  },
  mounted() {
    this.getFilterCard();
  },
  methods: {
    validation() {
      this.firstValidation = !(
        this.isSupervisor ||
        this.isTeamLeader ||
        this.isCeo
      );
    },
    kFormatter,
    statusColor(name) {
      let color = "";
      switch (name) {
        case "Leads":
          color = "#E84E4D";
          break;
        case "Replies":
          color = "#744FEF";
          break;
        case "Answers":
          color = "#E67B4F";
          break;
        case "Mobiles Today":
          color = "#4EC4F0";
          break;
        case "Mobiles Recovery":
          color = "#4EC4F3";
          break;

        case "Crm Appointments":
          color = "#515CEE";
          break;
        case "Social Network Appointments":
          color = "#515CE0";
          break;
        case "Productivity":
          color = "#40A094";
          break;
        case "Seller Appointments":
          color = "#e83e8c";
          break;
        default:
          color = "#e83e8c";
          break;
      }
      return color;
    },
    prueba(type) {
      const x = [];

      if (type === "sellers") {
        this.graph.map((data) => {
          x.push(data.string);
        });
        this.option.xAxisData = x;
      } else if (type === "multi") {
        this.option.xAxisData = this.labelsDays;
      } else {
        this.graph.map((data) => {
          x.push(data.due_date);
        });
        this.option.xAxisData = x;
      }

      const info = [];
      if (type === "multi") {
        this.option.series = [];
        for (let i = 0; i < this.graph.length; i++) {
          this.option.series.push({
            type: "line",
            name: this.graph[i].name,
            data: this.graph[i].count,
            color: this.graph[i].color,
          });
        }
      } else {
        this.graph.map((data) => {
          info.push(data.count.toString());
        });

        const normal = {
          type: "line",
          name: this.labelGraph,
          data: info,
          color: this.statusColor(this.labelGraph),
        };

        this.option.series = [];
        this.option.series.push(normal);
      }
      // eslint-disable-next-line no-plusplus
      this.idEchart++;
    },
    async getUsers() {
      try {
        const params = {
          roles: "[]",
          type: "1",
          junior: this.juniorUser,
        };
        const data = await DashboardService.getUsers(params);
        const firstOption = {
          user_name: "All users",
          id: 0,
        };

        data.data.unshift(firstOption);

        this.users = data.data;

        this.userFilter = this.users[0];

        return this.users;
      } catch (e) {
        this.showErrorSwal(e);
        return [];
      }
    },
    async getFilterCard() {
      try {
        const params = {
          from: moment(this.dateRange.startDate).format("Y-MM-D 00:00:00"),
          to: moment(this.dateRange.endDate).format("Y-MM-D 00:00:00"),
          program: this.programFilter.id,
          user: this.userFilter.id,
        };
        const data = await DashboardService.getFilterCardSocial(params);

        this.card[1].data = data.data.leads;
        this.card[0].data = data.data.replies;
        this.card[2].data = data.data.answer;
        this.card[3].data = data.data.mobiles_act;
        this.card[3].data_rec = data.data.mobiles_rec;
        this.card[4].data = data.data.appointments_crm;
        this.card[4].data_sn = data.data.appointments_sn;
        this.card[5].data = `${data.data.productivity}%`;

        return data;
      } catch (e) {
        this.showErrorSwal(e);
        return [];
      }
    },

    changeDateCard(addDay) {
      this.today = moment(this.today).add(addDay, "days").format("YYYY-MM-DD");
      this.currentDay = moment().format("YYYY-MM-DD");
      this.dateRange.startDate = this.today;
      this.dateRange.endDate = this.today;
      this.changeOverlay = true;
      this.getFilterCard();
      this.keychart++;
    },
    changeMonth(month) {
      this.firstDayOfMonth = moment(this.firstDayOfMonth)
        .add(month, "month")
        .startOf("month")
        .format("YYYY-MM-DD 00:00:00");
      this.endDayOfMonth = moment(this.endDayOfMonth)
        .add(month, "month")
        .endOf("month")
        .format("YYYY-MM-DD 00:00:00");

      this.validateDate = this.showGraphForWeek
        ? this.endDay
        : this.endDayOfMonth;
    },

    changeWeek(week) {
      this.firstDay = moment(this.firstDay)
        .add(week, "week")
        .format("YYYY-MM-DD 00:00:00");
      this.endDay = moment(this.firstDay)
        .add(6, "days")
        .format("YYYY-MM-DD 00:00:00");

      this.validateDate = this.showGraphForWeek
        ? this.endDay
        : this.endDayOfMonth;
    },

    async getGraphics(chardOption) {
      this.idSelected = chardOption;

      if (!(this.isSupervisor || this.isTeamLeader || this.isCeo)) {
        this.userFilter.id = this.currentUser.user_id;
        this.userFilter.user_name =
          this.currentUser.first_name + " " + this.currentUser.last_name;
      }

      try {
        const params = {
          from: this.showGraphForWeek ? this.firstDay : this.firstDayOfMonth,
          to: this.showGraphForWeek ? this.endDay : this.endDayOfMonth,
          program: this.programFilter.id,
          user: this.userFilter.id,
        };
        this.juniorUser = false;
        if (chardOption === 1) {
          const data = await DashboardService.getLeadsGraphic(params);

          this.graph = data.data;
          this.labelGraph = "Leads";
          this.type = "";
          this.chardOption.option = "Leads";
        } else if (chardOption === 0) {
          const data = await DashboardService.getRepliesGraphic(params);

          this.graph = data.data;

          this.labelGraph = "Replies";
          this.chardOption.option = "Replies";
          this.type = "";
        } else if (chardOption === 2) {
          const data = await DashboardService.getAnswersGraphic(params);
          this.graph = data.data;
          this.labelGraph = "Answers";
          this.type = "";
          this.chardOption.option = "Answers";
        } else if (chardOption === 6) {
          const data = await DashboardService.getMobilesGraphicToday(params);
          this.graph = data.data;
          this.labelGraph = "Mobiles Today";
          this.type = "";
          this.chardOption.option = "Mobiles Today";
        } else if (chardOption === 7) {
          const data = await DashboardService.getMobilesGraphicRecovery(params);
          this.graph = data.data;
          this.labelGraph = "Mobiles Recovery";
          this.type = "";
          this.chardOption.option = "Mobiles Recovery";
        } else if (chardOption === 8) {
          const data = await DashboardService.getTasksGraphicCrm(params);
          this.graph = data.data;
          this.labelGraph = "Crm Appointments";
          this.type = "";
          this.chardOption.option = "Crm Appointments";
        } else if (chardOption === 9) {
          const data = await DashboardService.getTasksGraphicSn(params);
          this.graph = data.data;
          this.labelGraph = "Social Network Appointments";
          this.chardOption.option = "Social Network Appointments";
          this.type = "";
        } else if (chardOption === 5) {
          const data = await DashboardService.getProductivityGraphic(params);
          this.graph = data.data;
          this.labelGraph = "Productivity";
          this.juniorUser = true;
          this.chardOption.option = "Productivity";
          this.type = "";
        } else if (this.chardOption.option.id === 10) {
          const data = await DashboardService.getTaskCatcherGraphic(params);
          this.graph = data.data;
          this.labelGraph = "Seller Appointments";
          this.isDate = false;
          this.chardOption.option = "Seller Appointments";
          this.type = "sellers";
        } else if (this.chardOption.option.id === 11) {
          this.showGraphForWeek = false;
          const data = await DashboardService.getMultiChartGraphic(params);
          this.chardOption.option = "Weekly Average";
          this.graph = data.data;
          this.type = "multi";
        }
        this.prueba(this.type);
        return this.graph;
      } catch (e) {
        this.showErrorSwal(e);
        return [];
      }
    },
  },
};
</script>

<style scoped>
.day {
  font-weight: bold;
}

.all-text {
  color: #818181;
  font-size: large;
  padding-top: 5px;
}

.btn-filters {
  color: white !important;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25) !important;
  width: 127px;
  height: 38px;
  left: 454px;
  top: 215px;
  border-radius: 40px !important;
}

.btn-show {
  color: white !important;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25) !important;
  width: 150px;
  height: 38px;
  left: 454px;
  top: 215px;
  border-radius: 40px !important;
}

@media (max-width: 414px) {
  .mobil {
    padding: 0 !important;
    padding-top: 10px !important;
  }
  .all-text {
    font-size: medium;
  }
  @media (max-width: 1024px) {
    .showWeek {
      background: white;
    }
  }
}
</style>
