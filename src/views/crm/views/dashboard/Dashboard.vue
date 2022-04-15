<template>
  <div>
    <header-slot></header-slot>
    <b-row>
      <b-col cols="12">
        <!-- All Screen -->
        <b-row>
          <!-- Column Cards -->
          <b-col
            class="col-tab"
            v-dragscroll="allSizeOfScreen === 'xs' ? false : true"
            cols="12"
            sm="4"
            md="4"
            lg="3"
            xl="2"
            :style="`${statusHeightByScreenColOne}
             ${statusHeightByDevicesColOne}`"
          >
            <!-- Card Leads-->
            <b-row class="b-row-card">
              <b-card
                @click="changeTab(0)"
                class="ecommerce-card col-lg-12 cursor-pointer"
                :class="{
                  classAdd,
                  'ecommerce-card-leads': !itemCards[0] && !isTouch,
                }"
                :style="
                  switchHoverByCard(
                    0,
                    'linear-gradient(90deg, #0090E7 0%, #8F5FE8 100%)'
                  )
                "
              >
                <!-- Card Title -->
                <b-card-title
                  :style="itemCards[0] == true ? 'color: white' : ''"
                >
                  Leads
                </b-card-title>
                <!-- Card Content -->
                <b-card-text>
                  <!-- First Line -->
                  <b-row :class="classWrapper">
                    <!-- Box First-->
                    <div
                      :style="
                        itemCards[0] == true ? 'background-color: white' : ''
                      "
                      class="mr-2 item-wrapper-font div-box1"
                    ></div>
                    <!-- Name Today -->
                    <div class="mr-1">
                      <span style="font-size: medium" class>Today :</span>
                    </div>
                    <!-- Today -->
                    <div>
                      <span style="font-size: large">
                        <strong>{{ global.leadday }}</strong>
                      </span>
                    </div>
                  </b-row>
                  <b-row style="height: 10px" />
                  <!-- Second Line -->
                  <b-row :class="classWrapper">
                    <!-- Box Second-->
                    <div
                      :style="
                        itemCards[0] == true ? 'background-color: white' : ''
                      "
                      class="mr-1 div-box"
                    ></div>
                    <!-- Name Month -->
                    <div class="mr-1">
                      <span style="font-size: medium">Month :</span>
                    </div>
                    <!-- Month -->
                    <div>
                      <span style="font-size: large">
                        <strong>{{ global.leadmonth }}</strong>
                      </span>
                    </div>
                  </b-row>
                </b-card-text>
              </b-card>
            </b-row>
            <!-- Card Appointments-->
            <b-row class="b-row-card">
              <b-card
                class="ecommerce-card col-lg-12 cursor-pointer"
                :class="{
                  classAdd,
                  'ecommerce-card-appointments': !itemCards[1] && !isTouch,
                }"
                @click="changeTab(1)"
                :style="
                  switchHoverByCard(
                    1,
                    'linear-gradient(90deg, #FAC632 0%, #F37432 100%)'
                  )
                "
              >
                <!-- Card Title -->
                <b-card-title
                  :style="itemCards[1] == true ? 'color: white' : ''"
                  >Appointments</b-card-title
                >
                <!-- Card Content -->
                <b-card-text>
                  <!-- First Line -->
                  <b-row :class="classWrapper">
                    <!-- Box First-->
                    <div
                      :style="
                        itemCards[1] == true ? 'background-color: white' : ''
                      "
                      class="mr-2 item-wrapper-font div-box1"
                    ></div>
                    <!-- Name Today -->
                    <div class="mr-1">
                      <span style="font-size: medium">Today :</span>
                    </div>
                    <!-- Today -->
                    <div>
                      <span style="font-size: large">
                        <strong>{{ global.eventday }}</strong>
                      </span>
                    </div>
                  </b-row>
                  <b-row style="height: 10px" />
                  <!-- Second Line -->
                  <b-row :class="classWrapper">
                    <!-- Box Second-->
                    <div
                      :style="
                        itemCards[1] == true ? 'background-color: white' : ''
                      "
                      class="mr-1 item-wrapper-font div-box"
                    ></div>
                    <!-- Name Month -->
                    <div class="mr-1">
                      <span style="font-size: medium">Month :</span>
                    </div>
                    <!-- Month -->
                    <div>
                      <span style="font-size: large">
                        <strong>{{ global.eventmonth }}</strong>
                      </span>
                    </div>
                  </b-row>
                </b-card-text>
              </b-card>
            </b-row>
            <!-- Card Tasks-->
            <b-row class="b-row-card">
              <b-card
                class="ecommerce-card col-lg-12 cursor-pointer"
                :class="{
                  classAdd,
                  'ecommerce-card-tasks': !itemCards[2] && !isTouch,
                }"
                @click="changeTab(2)"
                :style="
                  switchHoverByCard(
                    2,
                    'linear-gradient(90deg, #961BCE 0%, #D0317D 100%)'
                  )
                "
              >
                <!-- Card Title -->
                <b-card-title
                  :style="itemCards[2] == true ? 'color: white' : ''"
                  >Tasks</b-card-title
                >
                <!-- Card Content -->
                <b-card-text>
                  <!-- First Line -->
                  <b-row :class="classWrapper">
                    <!-- Box First-->
                    <div
                      :style="
                        itemCards[2] == true ? 'background-color: white' : ''
                      "
                      class="mr-2 item-wrapper-font div-box1"
                    ></div>
                    <!-- Name Today -->
                    <div class="mr-1">
                      <span style="font-size: medium">Today :</span>
                    </div>
                    <!-- Today -->
                    <div>
                      <span style="font-size: large">
                        <strong>{{ global.taskday }}</strong>
                      </span>
                    </div>
                  </b-row>
                  <b-row style="height: 10px" />
                  <!-- Second Line-->
                  <b-row :class="classWrapper">
                    <!-- Box Second-->
                    <div
                      :style="
                        itemCards[2] == true ? 'background-color: white' : ''
                      "
                      class="mr-1 item-wrapper-font div-box"
                    ></div>
                    <!-- Name Month -->
                    <div class="mr-1">
                      <span style="font-size: medium">Month :</span>
                    </div>
                    <!-- Month -->
                    <div>
                      <span style="font-size: large">
                        <strong>{{ global.taskmonth }}</strong>
                      </span>
                    </div>
                  </b-row>
                </b-card-text>
              </b-card>
            </b-row>
            <!-- Card Sales-->
            <b-row class="b-row-card">
              <b-card
                class="ecommerce-card col-lg-12 cursor-pointer"
                :class="{
                  classAdd,
                  'ecommerce-card-sales': !itemCards[3] && !isTouch,
                }"
                @click="changeTab(3)"
                :style="
                  switchHoverByCard(
                    3,
                    'linear-gradient(90deg, #ADD210 0%, #5F873E 100%)'
                  )
                "
              >
                <!-- Card Title -->
                <b-card-title
                  :style="itemCards[3] == true ? 'color: white' : ''"
                  >Sales</b-card-title
                >
                <!-- Card Content -->
                <b-card-text>
                  <!-- First Line -->
                  <b-row :class="classWrapper">
                    <!-- Box First -->
                    <div
                      :style="
                        itemCards[3] == true ? 'background-color: white' : ''
                      "
                      class="mr-2 item-wrapper-font div-box1"
                    ></div>
                    <!-- Name Today -->
                    <div class="mr-1">
                      <span style="font-size: medium">Today :</span>
                    </div>
                    <!-- Today -->
                    <div>
                      <span style="font-size: large">
                        <strong>{{ global.vendioday }}</strong>
                      </span>
                    </div>
                  </b-row>
                  <b-row style="height: 10px" />
                  <!-- Second Line -->
                  <b-row :class="classWrapper">
                    <!-- Box Second -->
                    <div
                      :style="
                        itemCards[3] == true ? 'background-color: white' : ''
                      "
                      class="mr-1 item-wrapper-font div-box"
                    ></div>
                    <!-- Name Month -->
                    <div class="mr-1">
                      <span style="font-size: medium">Month :</span>
                    </div>
                    <!-- Month -->
                    <div>
                      <span style="font-size: large">
                        <strong>{{ global.vendiomonth }}</strong>
                      </span>
                    </div>
                  </b-row>
                </b-card-text>
              </b-card>
            </b-row>
            <!-- Card Capturated-->
            <b-row class="b-row-card">
              <b-card
                class="ecommerce-card col-lg-12 cursor-pointer"
                :class="{
                  classAdd,
                  'ecommerce-card-capturated': !itemCards[4] && !isTouch,
                }"
                @click="changeTab(4)"
                :style="
                  switchHoverByCard(
                    4,
                    'linear-gradient(90deg, #FE8F8F 0%, #EC1443 100%)'
                  )
                "
              >
                <!-- Card Title -->
                <b-card-title
                  :style="itemCards[4] == true ? 'color: white' : ''"
                  >Capturated</b-card-title
                >
                <!--Card Content  -->
                <b-card-text>
                  <!-- First Line -->
                  <b-row :class="classWrapper">
                    <!-- Box First -->
                    <div
                      :style="
                        itemCards[4] == true ? 'background-color: white' : ''
                      "
                      class="mr-2 item-wrapper-font div-box1"
                    ></div>
                    <!-- Name Today -->
                    <div class="mr-1">
                      <span style="font-size: medium">Today :</span>
                    </div>
                    <!-- Today -->
                    <div>
                      <span style="font-size: large">
                        <strong>{{ global.clientday }}</strong>
                      </span>
                    </div>
                  </b-row>
                  <b-row style="height: 10px" />
                  <!-- Second Line -->
                  <b-row :class="classWrapper">
                    <!-- Box Second -->
                    <div
                      :style="
                        itemCards[4] == true ? 'background-color: white' : ''
                      "
                      class="mr-1 item-wrapper-font div-box"
                    ></div>
                    <!-- Name Month -->
                    <div class="mr-1">
                      <span style="font-size: medium">Month :</span>
                    </div>
                    <!-- Month -->
                    <div>
                      <span style="font-size: large">
                        <strong>{{ global.clientmonth }}</strong>
                      </span>
                    </div>
                  </b-row>
                </b-card-text>
              </b-card>
            </b-row>
          </b-col>
          <!-- Column Graphics -->
          <b-col class cols="12" sm="8" md="8" lg="9" xl="10">
            <b-card class="col-12 mb-0" :style="statusHeightByScreenColTwo">
              <br />
              <br />
              <!-- Content Card -->
              <b-row :style="allSizeOfScreen === 'xxl' ? 'height:130px' : ''">
                <div class="mb-1 mb-sm-0 d-inline col-lg-10 col-md-12 col-xl-7">
                  <b-row class="d-flex align-items-center">
                    <!-- Select User -->
                    <b-col cols="12" sm="12" md="12" lg="5" class="pb-1">
                      <v-select
                        id="v-user"
                        v-if="isCeo || isSupervisor || isCoordinator"
                        showIcons="false"
                        v-model="userfilter"
                        :style="
                          allSizeOfScreen === 'xxl'
                            ? 'font-size: 15px;width: 244px'
                            : allSizeOfScreen === 'lg'
                            ? 'width:200px'
                            : 'width:100%'
                        "
                        placeholder="Select User"
                        label="user_name"
                        :options="users"
                        :reduce="(val) => val.id"
                        @input="filtroCont()"
                      />
                    </b-col>
                    <!-- Year and Sub Title -->
                    <b-col
                      cols="12"
                      sm="12"
                      md="12"
                      lg="7"
                      class="d-flex flex-wrap pb-1"
                    >
                      <div
                        class="
                          d-flex
                          align-items-center
                          justify-content-center
                          pr-1
                        "
                      >
                        <!-- Graphic Sub Title -->
                        <div>
                          <span class="ClassWord" style="color: #9f9da8"
                            >Monthly Graphics</span
                          >
                        </div>
                      </div>
                      <!-- Select Year -->
                      <v-select
                        id="v-year"
                        v-model="year"
                        :style="
                          allSizeOfScreen === 'xxl'
                            ? 'font-size: 15px; width: 120px'
                            : 'width: 120px'
                        "
                        :clearable="false"
                        :options="years"
                        @input="filtroCont()"
                      />
                    </b-col>
                  </b-row>
                </div>
                <!-- Array of Sub title Totals -->
                <div
                  class="col-lg-12 col-md-12 col-xl-5 d-flex flex-wrap"
                  style="width: 100%"
                  v-if="allSizeOfScreen !== 'xxl'"
                >
                  <div
                    v-for="data in totalYearByCard"
                    :key="data.id"
                    class="d-flex flex-wrap mb-1 justify-content-between pr-1"
                    :style="`${
                      allSizeOfScreen === 'lg'
                        ? 'width: 33%'
                        : allSizeOfScreen === 'xs' || allSizeOfScreen === 'sm'
                        ? 'width: 80%'
                        : screenHeight == 800
                        ? 'width: 100%'
                        : 'width: 45%'
                    }`"
                  >
                    <!-- Name of -->
                    <div :class="flexCenter">
                      <span
                        class="ClassWord"
                        :style="
                          allSizeOfScreen === 'xxl'
                            ? 'font-size: 150%'
                            : 'font-size: 15px;color:#9F9DA8'
                        "
                        >{{ data.name }}:</span
                      >
                    </div>
                    <!-- Quantity of Data -->
                    <div class="important" style="float: left">
                      <div :class="flexCenter" class="box-number">
                        <span class="font-weight-bolder data-subtitle-num">
                          {{ data.total }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </b-row>
              <!-- If XXL Screen -->
              <b-row v-if="allSizeOfScreen === 'xxl'">
                <b-col
                  cols="2"
                  v-for="data in totalYearByCard"
                  :key="data.id"
                  class="d-flex justify-content-between"
                >
                  <div class="ml-2" :class="flexCenter">
                    <span
                      class="ClassWord"
                      :style="
                        allSizeOfScreen === 'xxl'
                          ? 'font-size: 150%'
                          : 'font-size: 15px;color:#9F9DA8'
                      "
                      >{{ data.name }}:</span
                    >
                  </div>
                  <div class="important" style="float: left">
                    <div class="box-number" :class="flexCenter">
                      <span class="font-weight-bolder data-subtitle-num">
                        {{ data.total }}
                      </span>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <!-- Graphics Line -->
              <b-card-body class="p-0 pb-2">
                <app-echart-line-crm
                  :key="idEchart"
                  :option-data="rePaint"
                  :screen="allSizeOfScreen"
                  :style="allSizeOfScreen === 'xxl' ? 'height:550px' : ''"
                />
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import isTouchDevice from "is-touch-device";

import { dragscroll } from "vue-dragscroll";
import { BCard, BButton, BCardBody, BBadge } from "bootstrap-vue";
import { mapGetters } from "vuex";
import vSelect from "vue-select";
import moment from "moment";
// Import Components
import AppEchartLine from "@core/components/charts/echart/AppEchartLine.vue";
import AppEchartLineCrm from "./components/AppEchartLineCrm.vue";
// Import Services
import DashboardService from "./service/dashboard.service";
export default {
  name: "DashboardCrm",
  directives: {
    dragscroll,
  },
  components: {
    BCard,
    BButton,
    BCardBody,
    BBadge,
    vSelect,
    AppEchartLine,
    AppEchartLineCrm,
  },
  data: function () {
    return {
      idEchart: 0,
      option: {
        xAxisData: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        series: [],
      },
      global: [],
      leads: [],
      quotes: [],
      calls: [],
      sales: [],
      captur: [],
      userfilter: "",
      value: "",
      total_year: 0,
      totalYearByCard: [],
      index: 0,
      users: [],
      year: moment().format("YYYY"),
      years: [],
      itemCards: [true, false, false, false, false],
      item: null,
      widthOfScreen: null,
      heightOfScreen: null,
    };
  },
  created: function () {
    this.userCreator();
    this.allData();
    this.yearSelect();
  },
  computed: {
    ...mapGetters({
      sizeScreenByPixels: "app/sizeScreenByPixels",
      allSizeOfScreen: "app/allSizeOfScreen",
    }),
    isTouch() {
      return isTouchDevice();
    },
    classWrapper: function () {
      return "item-wrapper justify-content-start align-items-center";
    },
    flexCenter: function () {
      return "d-flex justify-content-center align-items-center";
    },
    classAdd: function () {
      return this.skin == "dark" ? "dark" : "";
    },

    screenHeight: function () {
      const { width, height } = this.sizeScreenByPixels;
      return height.value;
    },
    statusHeightByScreenColOne: function () {
      switch (this.allSizeOfScreen) {
        case "xxl":
          return "height: 800px !important;max-height: 900px !important;";
        case "xl":
          return "height: 85vh;max-height: 85vh;overflow: auto;";
        case "lg":
          return "height: 75vh;max-height: 75vh;overflow: auto;";
        case "md":
          return "height: 155vh;max-height: 155vh;overflow: auto;";
        case "sm":
          return "height: 170vh;max-height: 180vh;overflow: auto;";
        default:
          return "";
      }
    },
    statusHeightByDevicesColOne: function () {
      return this.screenHeight >= 1368
        ? "height: 45vh;max-height: 45vh;overflow: auto;"
        : this.screenHeight >= 1024
        ? "height: 60vh;max-height: 60vh;overflow: auto;"
        : this.screenHeight >= 912 && this.allSizeOfScreen !== "xxl"
        ? "height: 50vh;max-height: 50vh;overflow: auto;"
        : this.screenHeight >= 912
        ? ""
        : this.screenHeight >= 800
        ? "height: 65vh;max-height: 65vh;overflow: auto;"
        : this.screenHeight >= 768
        ? ""
        : this.screenHeight >= 720
        ? "height: 80vh;max-height: 80vh;overflow: auto;"
        : this.screenHeight >= 540 && this.screenHeight <= 600
        ? "height: 110vh;max-height: 110vh;overflow: auto;"
        : "";
    },
    statusHeightByScreenColTwo: function () {
      switch (this.allSizeOfScreen) {
        case "xxl":
          return "height: 800px !important;max-height: 900px !important;";
        case "xl":
          return "height: 570px;max-height: 570px !important;";
        case "lg":
          return "";
        case "md":
          return "";
        case "sm":
          return "";
        default:
          return "";
      }
    },
    ...mapGetters({
      skin: "appConfig/skin",
    }),
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),

    rePaint: function () {
      return this.option;
    },
  },

  methods: {
    switchHoverByCard(index, background) {
      for (let i = 0; i < this.itemCards.length; i++) {
        if (index == i) {
          return this.itemCards[i] == true
            ? `background: ${background};color: white`
            : this.classAdd == "dark"
            ? ""
            : "background:linear-gradient(90deg, rgba(0, 144, 231, 0.1) 0%, rgba(143, 95, 232, 0.1) 100%);";
        }
      }
    },
    statusColor: function (name) {
      let color = "";
      switch (name) {
        case "Leads":
          color = "#0090E7";
          break;
        case "Appointments":
          color = "#F37432";
          break;
        case "Calls":
          color = "#D0317D";
          break;
        case "Sales":
          color = "#5F873E";
          break;
        case "Captured":
          color = "#EC1443";
          break;
      }
      return color;
    },
    chargeDataToEchart: function (array, name) {
      if (this.option.series <= 0) {
        this.option.series.push({
          type: "line",
          name: name,
          data: array,
          color: this.statusColor(name),
        });
      } else {
        let found = false;
        for (let i = 0; i < this.option.series.length; i++) {
          let object = this.option.series[i];
          if (name.localeCompare(object.name) == 0) {
            this.option.series.splice(i, 1);
            found = true;
          }
        }
        if (!found) {
          this.option.series.push({
            type: "line",
            name: name,
            data: array,
            color: this.statusColor(name),
          });
        }
      }
      this.idEchart++;
    },
    chargeDataToEchartNew: function (array, name) {
      this.option.series = [];
      if (this.option.series <= 0) {
        this.option.series.push({
          type: "line",
          name: name,
          data: array,
          color: this.statusColor(name),
        });
      }
      this.idEchart++;
    },
    changeItemCards: function (index) {
      for (let i = 0; i < this.itemCards.length; i++) {
        if (i === index) {
          if (this.itemCards[i] == true) {
            this.itemCards[i] = false;
          } else {
            this.itemCards[i] = true;
          }
        }
      }
    },
    changeListYear: function (name, total) {
      if (this.totalYearByCard <= 0) {
        this.totalYearByCard.push({ name: name, total: total });
      } else {
        let found = false;
        for (let i = 0; i < this.totalYearByCard.length; i++) {
          let object = this.totalYearByCard[i];
          if (name.localeCompare(object.name) == 0) {
            this.totalYearByCard.splice(i, 1);
            found = true;
          }
        }
        if (!found) {
          this.totalYearByCard.push({ name: name, total: total });
        }
      }
    },
    changeListYearNew: function (name, total) {
      this.totalYearByCard = [];
      if (this.totalYearByCard <= 0) {
        this.totalYearByCard.push({ name: name, total: total });
      }
    },
    // Change By Card
    changeTab: function (index) {
      this.widthOfScreen = window.screen.width;
      this.heightOfScreen = window.screen.height;
      this.changeItemCards(index);
      switch (index) {
        case 0:
          this.total_year = this.global.leads_year;
          this.chargeDataToEchart(this.leads, "Leads");
          this.changeListYear("Leads", this.global.leads_year);
          break;
        case 1:
          this.total_year = this.global.quotes_year;
          this.chargeDataToEchart(this.quotes, "Appointments");
          this.changeListYear("Appointments", this.global.quotes_year);
          break;
        case 2:
          this.total_year = this.global.calls_year;
          this.chargeDataToEchart(this.calls, "Calls");
          this.changeListYear("Calls", this.global.calls_year);
          break;
        case 3:
          this.total_year = this.global.sales_year;
          this.chargeDataToEchart(this.sales, "Sales");
          this.changeListYear("Sales", this.global.sales_year);
          break;
        case 4:
          this.total_year = this.global.clients_year;
          this.chargeDataToEchart(this.captur, "Captured");
          this.changeListYear("Captured", this.global.clients_year);
          break;
      }
      this.index = index;
    },
    allData: async function (status = null) {
      try {
        this.addPreloader();
        let { user_id } = this.currentUser;
        if (this.isCeo || this.isSupervisor || this.isCoordinator) {
          user_id = 0;
        }
        const response = await DashboardService.getDashboardData({
          created_id: user_id,
        });
        this.userfilter = response.data.usercreate;
        this.global = response.data;
        this.leads = response.data.leads.map((list) => list);
        this.quotes = response.data.quotes.map((list) => list);
        this.calls = response.data.calls.map((list) => list);
        this.sales = response.data.sales.map((list) => list);
        this.captur = response.data.vendio.map((list) => list);
        this.removePreloader();
        if (status == null) {
          this.chargeDataToEchart(this.leads, "Leads");
          this.changeListYear("Leads", this.global.leads_year);
        } else {
          this.chargeDataToEchartNew(this.leads, "Leads");
          this.changeListYearNew("Leads", this.global.leads_year);
        }
        this.total_year = this.global.leads_year;
      } catch (error) {
        console.log(error);
        this.removePreloader();
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "Something went wrong!"
        );
      }
    },
    // Change By User or Year
    filtroCont: async function () {
      this.itemCards = [true, false, false, false, false];
      if (this.userfilter != null) {
        try {
          this.addPreloader();
          const response = await DashboardService.getDashboardData({
            created_id: this.userfilter,
            anio: this.year,
          });
          this.global = response.data;
          this.leads = response.data.leads.map((list) => list);
          this.quotes = response.data.quotes.map((list) => list);
          this.calls = response.data.calls.map((list) => list);
          this.sales = response.data.sales.map((list) => list);
          this.captur = response.data.vendio.map((list) => list);
          this.chargeDataToEchartNew(this.leads, "Leads");
          this.changeListYearNew("Leads", this.global.leads_year);
          this.total_year = this.global.leads_year;
          this.removePreloader();
        } catch (error) {
          console.error(error);
          this.removePreloader();
          this.showToast(
            "danger",
            "top-right",
            "Error",
            "XIcon",
            "Something went wrong!"
          );
        }
      } else {
        this.allData("update");
        this.year = this.years[this.years.length - 1];
      }
    },
    userCreator: async function () {
      try {
        const data = await DashboardService.userCreator({
          roles: "",
          type: "1",
        });
        this.users = data;
      } catch (error) {
        console.log(error);
        this.showToast(
          "danger",
          "top-right",
          "Error",
          "XIcon",
          "Something went wrong!"
        );
      }
    },
    yearSelect: function () {
      for (let x = 2014; x <= moment().format("YYYY"); x++) {
        this.years.push(x);
      }
    },
  },
};
</script>

<style lang="scss">
@import "~@core/scss/base/pages/app-ecommerce.scss";
</style>

<style lang="scss">
.data-subtitle-num {
  color: white;
  font-size: 18px;
}
.box-number {
  background: #0090e7;
  border-radius: 5px;
  width: 50px;
  height: 38px;
}
.ClassWord {
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 11px;
}

// V-Select
#v-user {
  div.vs__dropdown-toggle {
    border-color: #d1cfd7;
  }
  div.vs__dropdown-toggle:hover {
    border: 1px solid #0090e7 !important;
    // box-sizing: border-box;
    border-radius: 5px;
    div > input::placeholder {
      color: #0090e7 !important;
      font-size: 15px;
      font-family: Rubik;
    }
    div > span {
      color: #0090e7 !important;
    }
  }
  div > input::placeholder {
    font-size: 15px;
    font-family: Rubik;
    color: #d1cfd7;
  }
}

#v-year {
  div.vs__dropdown-toggle:hover {
    border: 1px solid #0090e7 !important;
    border-radius: 5px;
    div > span {
      color: #0090e7 !important;
    }
  }
  div > span {
    font-size: 15px;
    font-family: Rubik;
    color: #d1cfd7;
  }
}

// hidding scrollbar
.col-tab::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.div-box1 {
  background-color: #0090e7;
  width: 17px;
  height: 17px;
  border-radius: 4px;
}
.div-box {
  background-color: #8f5fe8;
  width: 17px;
  height: 17px;
  border-radius: 4px;
}
// All Titles
.ecommerce-card .card-title {
  font-weight: bold;
}
// Card Leads
.ecommerce-card-leads {
  &:hover {
    .div-box {
      background-color: white;
    }
    .div-box1 {
      background-color: white;
    }
    box-shadow: 0 4px 25px 0 rgba(black, 0.25);
    background: linear-gradient(90deg, #0090e7 0%, #8f5fe8 100%) !important;
    // background: red !important;
    // background: var(--li);
    color: white;
  }
  &:hover {
    .card-title {
      color: white;
    }
  }
  &:hover {
    .item-wrapper .item-wrapper-font {
      background-color: white;
    }
  }
}

// Card Appointments
.ecommerce-card-appointments {
  &:hover {
    box-shadow: 0 4px 25px 0 rgba(black, 0.25);
    background: linear-gradient(90deg, #fac632 0%, #f37432 100%) !important;
    color: white;
  }
  &:hover {
    .card-title {
      color: white;
    }
  }
  &:hover {
    .item-wrapper .item-wrapper-font {
      background-color: white;
    }
  }
}
// Card Tasks
.ecommerce-card-tasks {
  &:hover {
    box-shadow: 0 4px 25px 0 rgba(black, 0.25);
    background: linear-gradient(90deg, #961bce 0%, #d0317d 100%) !important;
    color: white;
  }
  &:hover {
    .card-title {
      color: white;
    }
  }
  &:hover {
    .item-wrapper .item-wrapper-font {
      background-color: white;
    }
  }
}
// Card Sales
.ecommerce-card-sales {
  &:hover {
    box-shadow: 0 4px 25px 0 rgba(black, 0.25);
    background: linear-gradient(90deg, #add210 0%, #5f873e 100%) !important;
    color: white;
  }
  &:hover {
    .card-title {
      color: white;
    }
  }
  &:hover {
    .item-wrapper .item-wrapper-font {
      background-color: white;
    }
  }
}
// Card Capturated
.ecommerce-card-capturated {
  &:hover {
    box-shadow: 0 4px 25px 0 rgba(black, 0.25);
    background: linear-gradient(90deg, #fe8f8f 0%, #ec1443 100%) !important;
    color: white;
  }
  &:hover {
    .card-title {
      color: white;
    }
  }
  &:hover {
    .item-wrapper .item-wrapper-font {
      background-color: white;
    }
  }
}
// V-Select Year
.select-year {
  width: 130px;
}

// V-Select User
.per-page-selector-user {
  width: 200px;
}

// Space Cards
.b-row-card {
  padding-left: 13.5px;
  padding-right: 13.5px;
}
</style>
