<template>
  <div>
    <header-slot> </header-slot>
    <b-card no-body class="pt-2">
      <b-row>
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
              class="btn-icon rounded mr-1"
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
        <b-col md="auto" sm="auto">
          <b-button
            v-b-tooltip.hover
            class="btn btn-filters"
            variant="primary"
            title="FILTERS"
            @click="advanceFilter = !advanceFilter"
          >
            <span v-text="advanceFilter ? 'BASIC' : 'ADVANCE'" />
          </b-button>
        </b-col>
        <b-col md="3" sm="auto">
          <div v-if="advanceFilter" class="ml-2">
            <v-select
              v-model="programFilter"
              class="w-100"
              :options="OptionProgram"
              label="option"
              @input="getFilterCard(), getGraphics()"
            />
          </div>
        </b-col>
        <b-col md="3" sm="auto">
          <div v-if="advanceFilter" class="ml-2">
            <v-select
              v-model="userFilter"
              :options="users"
              label="user_name"
              @input="getFilterCard(), getGraphics()"
            />
          </div>
        </b-col>
      </b-row>
      <Card
        :key="cardUpdate"
        :data="card"
        :type="typeCard"
        :date_init="dateRange.startDate"
        :date_end="dateRange.endDate"
        :program="programFilter"
        :user="userFilter"
      />
    </b-card>
    <div class="m-0">
      <b-card :title="`${chardOption.option} Balance`">
        <b-row>
          <b-col md="3">
            <v-select
              v-model="chardOption"
              class="per-page-selector"
              x
              style="font-size: 15px"
              :clearable="false"
              label="option"
              :options="arrayOptions"
              @input="getGraphics"
            />
          </b-col>
          <b-col md="auto">
            <span
              style="padding-top: 7px"
              class="all-text day d-inline-flex pl-2"
              >Current {{ showGraphForWeek ? "Week" : "Month" }}</span
            >
          </b-col>
          <b-col md="auto">
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
              @click="showGraphForWeek ? changeWeek(-1) : changeMonth(-1)"
            >
              <feather-icon icon="ChevronLeftIcon" />
            </b-button>
            <b-button
              variant="info"
              class="btn-icon rounded-circle"
              :disabled="validateDate > currentDay"
              @click="showGraphForWeek ? changeWeek(1) : changeMonth(1)"
            >
              <feather-icon icon="ChevronRightIcon" />
            </b-button>
          </b-col>

          <div class="d-flex align-content-center mb-1 mb-sm-0 col-lg-3">
            <b-button
              v-b-tooltip.hover
              style="padding-top: 7px"
              size="30"
              class="btn-show"
              variant="primary"
              title="CHANGE"
              @click="(showGraphForWeek = !showGraphForWeek), getGraphics()"
            >
              <feather-icon icon="CalendarIcon" />
              {{ showGraphForWeek ? "SHOW MONTH" : "SHOW WEEK" }}
            </b-button>
          </div>
        </b-row>
        <app-echart-line-social-network :key="idEchart" :option-data="option" />
      </b-card>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import vSelect from "vue-select";
import DashboardService from "@/views/social-network/views/dashboard/dashboard.service";
import Card from "@/views/social-network/views/dashboard/components/Card.vue";
import AppEchartLineSocialNetwork from "@/views/social-network/views/dashboard/components/chard/AppEchartLineSocialNetwork.vue";

export default {
  components: {
    vSelect,
    Card,
    AppEchartLineSocialNetwork,
  },
  data() {
    return {
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
          icon: "/images/social-network/dashboard/replies.png",
          cursor: true,
          color: "#E84E4D",
        },
        {
          title: "leads",
          data: 0,
          style:
            "background: linear-gradient(75.42deg, #E84E4D 24.3%, #FF7170 99.88%)!important;border: 1px solid #D73A39;",
          styleModal:
            "background: linear-gradient(75.42deg, #E84E4D 24.3%, #FF7170 99.88%)!important;",
          icon: "/images/social-network/dashboard/leads.png",
          cursor: true,
          color: "#744FEF",
        },
        {
          title: "answers",
          data: 0,
          style:
            "background: linear-gradient(75.42deg, #E2764A 24.3%, #FF996F 99.88%)!important;border: 1px solid #CA4F1D;",
          styleModal:
            "background: linear-gradient(75.42deg, #E2764A 24.3%, #FF996F 99.88%)!important;",
          icon: "/images/social-network/dashboard/answers.png",
          cursor: true,
          color: "#E67B4F",
        },
        {
          title: "mobiles",
          color: "#4EC4F0",
          data: 0,
          data_rec: 0,
          style:
            "background: linear-gradient(75.42deg, #4BBFEA 24.3%, #54D1FF 99.88%)!important;border: 1px solid #279FCB;",
          styleModal:
            "background: linear-gradient(75.42deg, #4BBFEA 24.3%, #54D1FF 99.88%)!important;",
          icon: "/images/social-network/dashboard/mobiles.png",
          cursor: true,
        },
        {
          title: "appointments",
          color: "#515CEE",
          data: 0,
          style:
            "background: linear-gradient(75.42deg, #4B56E9 24.3%, #4B56E9 24.3%, #6671FF 99.88%)!important;border: 1px solid #3B45D0;",
          styleModal:
            "background: linear-gradient(75.42deg, #4B56E9 24.3%, #4B56E9 24.3%, #6671FF 99.88%)!important;",
          icon: "/images/social-network/dashboard/appointments.png",
          cursor: true,
        },
        {
          title: "productivity",
          color: "#40A094",
          data: 0,
          style:
            "background: linear-gradient(75.42deg, #3ACDBB 24.3%, #42EDD8 99.88%)!important;border: 1px solid #14AC9A;",
          styleModal:
            "background: linear-gradient(75.42deg, #3ACDBB 24.3%, #42EDD8 99.88%)!important;",

          icon: "/images/social-network/dashboard/productivity.png",
          cursor: false,
        },
      ],
      arrayOptions: [
        {
          id: 2,
          option: "Replies",
        },
        {
          id: 1,
          option: "Leads",
        },
        {
          id: 3,
          option: "Answers",
        },
        {
          id: 4,
          option: "Mobiles",
        },
        {
          id: 5,
          option: "Appointment",
        },
        {
          id: 6,
          option: "Productivity",
        },
        {
          id: 7,
          option: "Seller appointment",
        },
        {
          id: 8,
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
    selectedOption() {
      this.getGraphics();
    },
  },
  created() {
    this.$store.commit("app/SET_LOADING", true);
    this.programFilter.id = 0;
    this.chardOption.option = "Replies";
    this.chardOption.id = 2;
    this.getUsers();
    this.getGraphics();
    this.validateDate = this.showGraphForWeek
      ? this.endDay
      : this.endDayOfMonth;
  },
  mounted() {
    this.getFilterCard();
  },
  methods: {
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
        case "Mobiles":
          color = "#4EC4F0";
          break;
        case "Appointments":
          color = "#515CEE";
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
        this.userFilter = this.users[0].user_name;

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
        this.card[4].data = data.data.appointments;
        this.card[5].data = `${data.data.productivity}%`;
        if (data.status === 200) {
          this.$store.commit("app/SET_LOADING", false);
        }
        return data;
      } catch (e) {
        this.removePreloader();

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
      this.getGraphics();
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
      this.getGraphics();
      this.validateDate = this.showGraphForWeek
        ? this.endDay
        : this.endDayOfMonth;
    },
    async getGraphics() {
      try {
        const params = {
          from: this.showGraphForWeek ? this.firstDay : this.firstDayOfMonth,
          to: this.showGraphForWeek ? this.endDay : this.endDayOfMonth,
          program: this.programFilter.id,
          user: this.userFilter.id,
        };
        this.juniorUser = false;
        if (this.chardOption.id === 1) {
          const data = await DashboardService.getLeadsGraphic(params);

          this.graph = data.data;
          this.labelGraph = "Leads";
          this.type = "";
        } else if (this.chardOption.id === 2) {
          const data = await DashboardService.getRepliesGraphic(params);

          this.graph = data.data;

          this.labelGraph = "Replies";
          this.type = "";
        } else if (this.chardOption.id === 3) {
          const data = await DashboardService.getAnswersGraphic(params);
          this.graph = data.data;
          this.labelGraph = "Answers";
          this.type = "";
        } else if (this.chardOption.id === 4) {
          const data = await DashboardService.getMobilesGraphic(params);
          this.graph = data.data;
          this.labelGraph = "Mobiles";
          this.type = "";
        } else if (this.chardOption.id === 5) {
          const data = await DashboardService.getTasksGraphic(params);
          this.graph = data.data;
          this.labelGraph = "Appointments";
          this.type = "";
        } else if (this.chardOption.id === 6) {
          const data = await DashboardService.getProductivityGraphic(params);
          this.graph = data.data;
          this.labelGraph = "Productivity";
          this.juniorUser = true;
          this.type = "";
        } else if (this.chardOption.id === 7) {
          const data = await DashboardService.getTaskCatcherGraphic(params);
          this.graph = data.data;
          this.labelGraph = "Seller Appointments";
          this.isDate = false;
          this.type = "sellers";
        } else if (this.chardOption.id === 8) {
          const data = await DashboardService.getMultiChartGraphic(params);
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
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25) !important;
  width: 127px;
  height: 38px;
  left: 454px;
  top: 215px;
  border-radius: 40px !important;
}

.btn-show {
  color: white !important;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25) !important;
  width: 150px;
  height: 38px;
  left: 454px;
  top: 215px;
  border-radius: 40px !important;
}
</style>
