<template>
  <b-container>
    <b-row class="my-2">
      <b-col
        cols="12"
        lg="6"
        md="6"
        sm="8"
        class="
          d-flex
          align-items-center
          justify-content-center justify-content-sm-start
        "
      >
        <b-button
          variant="success"
          class="mr-1 mb-lg-0 mb-md-0 mb-sm-1 mb-1"
          @click="exportExcel()"
        >
          <feather-icon
            icon="DownloadCloudIcon"
            class="mr-50 text-center cursor-pointer"
          />EXCEL
        </b-button>
        <b-button
          variant="primary"
          class="mr-1 mb-lg-0 mb-md-0 mb-sm-1 mb-1"
          v-b-toggle.sidebar-backdrop
          @click="getMoreInfo()"
        >
          <feather-icon
            icon="InfoIcon"
            class="mr-50 text-center cursor-pointer"
          />MORE INFO
        </b-button>
      </b-col>
      <b-col
        cols="12"
        lg="6"
        md="6"
        sm="12"
        class="d-flex align-items-center justify-content-end align-items-center"
      >
        <b-input-group class="mr-1">
          <b-form-input
            type="search"
            v-model="filter.searchUser"
            placeholder="User..."
          />
          <b-input-group-append>
            <b-button variant="primary">
              <feather-icon icon="SearchIcon" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <b-button
          v-b-toggle.sidebar-advance
          v-b-tooltip.bottom="'Advanced Search'"
          variant="primary"
        >
          <div class="d-flex justify-content-between">
            <feather-icon icon="FilterIcon" size="15" />
          </div>
        </b-button>
      </b-col>
    </b-row>
    <b-table-simple
      bordered
      small
      caption-top
      responsive
      ref="table_report_modul"
      class="custom-table"
      cellspacing="0"
      cellpadding="0"
    >
      <b-thead>
        <b-tr>
          <b-th
            v-for="(item, index) in fields"
            :key="index"
            :class="[
              'text-center item-header',
              item.date == today ? 'bg-th-today' : '',
            ]"
          >
            {{ item.label }}
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr v-for="(item, index) in filterUser" :key="index">
          <b-td class="text-center item-user">
            <div class="container">
              <p>
                {{ item.user_name }}
              </p>
            </div>
            <span></span>
          </b-td>
          <b-td v-for="(schedule, i) in item.json_data" :key="i">
            <div
              :class="[
                bgSchedule(schedule),
                'item-hour',
                isDarkTheme ? 'item-hour-dark' : 'item-hour-light',
                schedule.date == today ? 'bg-hour-today' : '',
              ]"
              @click="openDetails(item, schedule, schedule.checking_m, 1)"
              v-b-tooltip.hover
              :title="titleSchedule(schedule, 1)"
            >
              {{ schedule.checking_m }}
            </div>
            <div
              :class="[
                'bg-default item-hour',
                isDarkTheme ? 'item-hour-dark' : 'item-hour-light',
                schedule.date == today ? 'bg-hour-today' : '',
              ]"
              @click="openDetails(item, schedule, schedule.m_begining_break, 2)"
              v-b-tooltip.hover
              :title="titleSchedule(schedule, 2)"
            >
              {{ schedule.m_begining_break }}
            </div>
            <div
              :class="[
                'bg-default item-hour',
                isDarkTheme ? 'item-hour-dark' : 'item-hour-light',
                schedule.date == today ? 'bg-hour-today' : '',
              ]"
              @click="openDetails(item, schedule, schedule.m_finish_break, 3)"
              v-b-tooltip.hover
              :title="titleSchedule(schedule, 3)"
            >
              {{ schedule.m_finish_break }}
            </div>
            <div
              :class="[
                'bg-default item-hour',
                isDarkTheme ? 'item-hour-dark' : 'item-hour-light',
                schedule.date == today ? 'bg-hour-today ' : '',
              ]"
              @click="openDetails(item, schedule, schedule.m_checkout, 4)"
              v-b-tooltip.hover
              :title="titleSchedule(schedule, 4)"
            >
              {{ schedule.m_checkout }}
            </div>
            <div
              :class="[
                'item-count-hours',
                isDarkTheme ? 'text-light' : '',
                schedule.date == today ? 'bg-count-hours-today' : 'bg-hours',
              ]"
            >
              HOURS: {{ schedule.total_hours }}
            </div>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
    <!-- *************** MORE DETAILS SCHEDULE ******************* -->
    <b-modal
      v-model="modal"
      :title="titleModal"
      size="lg"
      body-class="p-0"
      title-class="title-assitence-schedule"
      hide-footer
    >
      <b-container fluid class="p-4">
        <div class="text-center">
          <b-img
            :src="detailsSchedule.image"
            fluid
            class="image-captured"
            alt="Responsive image"
          ></b-img>
        </div>
        <b-row class="py-2">
          <b-col cols="auto">
            <feather-icon icon="CheckCircleIcon" class="mr-50 text-center" />
            ASSIGNED: {{ detailsSchedule.assigned }}
          </b-col>
          <b-col cols="auto">
            <feather-icon icon="CheckCircleIcon" class="mr-50 text-center" />
            ASSISTANCE: {{ detailsSchedule.assistance }}
          </b-col>
          <b-col cols="auto">
            <feather-icon icon="CheckCircleIcon" class="mr-50 text-center" />
            IP ADDRESS: {{ detailsSchedule.ip }}
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <!-- ***************** MORE INFO **************** -->
    <b-sidebar
      id="sidebar-backdrop"
      title="More info"
      bg-variant="white"
      sidebar-class="sidebar-lg-schedule sidebar-schedules"
      header-class="pt-1"
      backdrop
      shadow
      style="width: 700px !important"
    >
      <div class="px-3 py-2">
        <content-more-info-report :data="dataSchedule" :key="keyMoreInfo" />
      </div>
    </b-sidebar>
    <!-- ***************** ADVANCE FILTERS **************** -->
    <b-sidebar
      id="sidebar-advance"
      right
      bg-variant="white"
      sidebar-class="sidebar-lg"
      header-class="pt-1"
      backdrop
      shadow
    >
      <template #header>
        <div class="d-flex justify-content-between align-items-center w-100">
          <span>
            <h3 class="title-sidebar-schedule">Advanced Search</h3>
          </span>
          <span class="cursor-pointer" v-b-toggle.sidebar-advance>
            <feather-icon icon="XIcon" size="15" />
          </span>
        </div>
      </template>
      <b-container>
        <b-row class="d-flex justify-content-end">
          <b-col cols="12" md="6" class="mb-md-0 mb-2">
            <b-form-group label="From" label-for="from">
              <b-form-datepicker
                id="from"
                v-model="filter.from"
                :date-format-options="{
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                }"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6" class="mb-md-0 mb-2">
            <b-form-group label="To" label-for="to">
              <b-form-datepicker
                id="to"
                v-model="filter.to"
                :date-format-options="{
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                }"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
      <template #footer>
        <b-container>
          <b-row class="d-flex align-items-center justify-content-between p-1">
            <b-button
              v-b-toggle.sidebar-advance
              variant="info"
              @click="resetSearch"
              >Reset</b-button
            >
            <b-button
              v-b-toggle.sidebar-advance
              variant="primary"
              @click="getReport()"
              >Search</b-button
            >
          </b-row>
        </b-container>
      </template>
    </b-sidebar>
  </b-container>
</template>
<script>
import SchedulesServices from "./services/schedules.service";
import contentMoreInfoReport from "./modals/contentInfoReportModul.vue";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {
    contentMoreInfoReport,
  },
  data() {
    return {
      fields: [],
      items: [],
      titleModal: null,
      modal: false,
      schedule: {},
      dataSchedule: [],
      filter: {
        from: moment().startOf("week").add(1, "days").format("YYYY-MM-DD"),
        to: moment().endOf("week").add(1, "days").format("YYYY-MM-DD"),
        searchUser: "",
      },
      keyMoreInfo: 0,
      bgBtnAdres: "background-color: rgba(51, 59, 81, 0.2) !important",
      detailsSchedule: {},

      today: moment().format("YYYY-MM-DD"),
    };
  },
  mounted() {
    this.getReport();
  },
  methods: {
    async getReport() {
      try {
        this.addPreloader();
        this.items = [];
        const params = {
          modul_id: this.currentUser.modul_id,
          start_date: this.filter.from,
          end_date: this.filter.to,
          user_id: null,
        };
        const data = await SchedulesServices.getHourReport(params);
        let array = data.data;
        array.forEach((element) => {
          this.items.push({
            id: element.id,
            user_name: element.name_user,
            json_data: element.json_data,
          });
        });
        this.dataByDay(data);
        this.removePreloader();
      } catch (error) {
        console.log(error);
        this.removePreloader();
      }
    },
    dataByDay(data) {
      this.fields = [];
      let array = data.days;
      this.fields.push({
        key: "field",
        label: "USER",
        sortable: false,
      });
      array.forEach((element) => {
        let letter = element.dayheader.toUpperCase();

        this.fields.push({
          key: "field",
          label: letter.toUpperCase(),
          date: element.date,
        });
      });
    },
    bgSchedule(schedule) {
      if (schedule.status) {
        return "bg-late";
      } else {
        return "bg-default";
      }
    },
    openDetails(item, schedule, assistance, type) {
      let dataNull = "00:00:00";
      this.titleModal = item.user_name;
      this.schedule = schedule;
      if (assistance != dataNull) {
        this.getDetailsSchedule(schedule, type);
      } else {
        this.showToast("info", "top-right", "Oops!", "XIcon", "NO ASSISTANCE");
      }
    },
    titleSchedule(schedule, assistance) {
      let dataNull = "00:00:00";
      let replace = "NOT ASSIGNED";
      switch (assistance) {
        case 1:
          return schedule.checking == dataNull ? replace : schedule.checking;
        case 2:
          return schedule.begining_break == dataNull
            ? replace
            : schedule.begining_break;
        case 3:
          return schedule.finish_break == dataNull
            ? replace
            : schedule.finish_break;
        case 4:
          return schedule.checkout == dataNull ? replace : schedule.checkout;
      }
    },
    async getDetailsSchedule(schedule, type) {
      this.addPreloader();
      const params = { id: schedule.id_schedule };
      const data = await SchedulesServices.getDetailsSchedule(params);
      if (type == 1) {
        this.detailsSchedule = {
          ip: data[0].ip,
          assigned: schedule.checking,
          assistance: schedule.checking_m,
          image: data[0].images,
        };
      } else if (type == 2) {
        this.detailsSchedule = {
          ip: data[0].ip2,
          assigned: schedule.begining_break,
          assistance: schedule.m_begining_break,
          image: data[0].images2,
        };
      } else if (type == 3) {
        this.detailsSchedule = {
          ip: data[0].ip3,
          assigned: schedule.finish_break,
          assistance: schedule.m_finish_break,
          image: data[0].images3,
        };
      } else if (type == 4) {
        this.detailsSchedule = {
          ip: data[0].ip4,
          assigned: schedule.checkout,
          assistance: schedule.m_checkout,
          image: data[0].images4,
        };
      }
      this.modal = true;
      this.removePreloader();
    },
    async exportExcel() {
      this.addPreloader();
      const params = {
        items: this.filterUser,
        fields: this.fields,
        start_date: this.filter.from,
        end_date: this.filter.to,
      };
      const data = await SchedulesServices.getExportExcel(params);
      let namefile =
        "schedules_report_" +
        moment(this.filter.from).format("MM-DD-YYYY") +
        "_" +
        moment(this.filter.to).format("MM-DD-YYYY");
      this.forceFileDownload(data, namefile + ".xlsx");
      this.removePreloader();
    },
    getMoreInfo() {
      this.dataSchedule = this.filterUser;
      this.keyMoreInfo = ++this.keyMoreInfo;
    },
    resetSearch() {
      (this.filter.from = moment()
        .startOf("week")
        .add(1, "days")
        .format("YYYY-MM-DD")),
        (this.filter.to = moment()
          .endOf("week")
          .add(1, "days")
          .format("YYYY-MM-DD")),
        this.getReport();
    },
    moveSideways(number) {
      this.$refs.table_report_modul.scrollLeft = "5000px";
    },
  },
  computed: {
    filterUser: function () {
      return this.items.filter((item) => {
        return item.user_name
          .toLowerCase()
          .match(this.filter.searchUser.toLowerCase());
      });
    },
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    isDarkTheme() {
      return this.$store.state.appConfig.layout.skin == "dark";
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-default {
  background: rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 150px !important;
}
.bg-late {
  background: rgba(227, 52, 47, 0.1) !important;
  text-align: center;
  min-width: 150px !important;
}
.p-s {
  margin-top: 3px;
}
.bg-hours {
  background: rgba(143, 95, 232, 0.1) !important;
  text-align: center;
  border: 1px solid #6e6b7b;
  min-width: 150px !important;
}
.sidebar-lg-schedule {
  width: 50rem !important;
}
.title-sidebar-schedule {
  font-weight: bold;
}
.icon-adres {
  position: fixed;
  margin-top: 100px;
}
.icon-left {
  margin-left: 0rem;
}
.icon-right {
  margin-right: 0rem;
}
.btn-icon-adres {
  background-color: rgba(51, 59, 81, 0.9) !important;
}
.btn-scroll-l,
.btn-scroll-r {
  padding: 6px 10px !important;
  z-index: 90;
  position: fixed;
}
.btn-scroll-l {
  left: 120px;
}
.btn-scroll-r {
  right: 2%;
}
.image-captured {
  width: 400px !important;
}

/* Table styles */

.bg-th-today {
  background-color: #8f5fe8 !important;
  color: white;
}

.bg-hour-today {
  background: rgba(188, 159, 241, 0.15) !important;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #543e86 !important;
    color: white;
  }
}

.bg-count-hours-today {
  background: rgba(143, 95, 232, 0.5) !important;
  text-align: center;
  color: white !important;
}

table {
  border-collapse: collapse !important;

  & td,
  & &-sm td {
    padding: 0rem !important;
  }
}

.item-header {
  background: #f3f2f7;
  border: 1px solid #ebe9f1 !important;
  box-sizing: border-box;
  padding-top: 7px !important;
  width: 160px;
  height: 30px;
}

.item-user {
  position: relative;

  .container {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      margin-top: 5px;
      color: #8e8c99;
      font-weight: 500;
    }
  }

  span {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 24.5px;
    background: rgba(143, 95, 232, 0.1);
  }
}

.item-hour {
  background: transparent;
  padding: 0px 0px 3px 0px;
  font-size: 12.5px;

  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:nth-child(4) {
    border-bottom: 1px white solid;
    margin-bottom: 0px;
  }

  &-light {
    border-bottom: 1px solid #ebe9f1 !important;

    &:hover {
      background: #f3f2f7;
    }
  }

  &-dark {
    border-bottom: 1px solid #31343e !important;

    &:hover {
      background: #252541;
    }
  }
}

.item-count-hours {
  border: none;
  color: #484848;
  font-weight: 600 !important;
  font-size: 13px;
  padding: 4px 0px 2px 0px;
  /* border: 2px solid white !important; */
}

.b-sidebar {
  width: 40% !important;
}
</style>
