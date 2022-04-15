<template>
  <b-container fluid>
    <b-row class="mb-2">
      <b-col cols="12" md="6" sm="8" class="d-flex align-items-center justify-content-start p-0">
        <div
          class="d-flex align-items-center justify-content-sm-start justify-content-between w-100"
        >
          <div>
            <b-button
                class="mr-05 btn-icon rounded-circle"
                size="sm"
                variant="flat-primary"
                @click="beforeMonth"
            >
              <tabler-icon
                  size="18"
                  icon="ChevronLeftIcon"
              />
            </b-button>
            <b-button
                class="mr-05 btn-icon rounded-circle"
                size="sm"
                variant="flat-primary"
                @click="afterMonth"
            >
              <tabler-icon
                  size="18"
                  icon="ChevronRightIcon"
              />
            </b-button>
          </div>
          <span
            class="d-flex align-items-center justify-content-center m-0 font-medium-5"
          >
            {{ currentMonth }} {{ year }}
          </span>
        </div>
      </b-col>
      <b-col cols="12" md="6" sm="4" class="d-flex align-items-center justify-content-end p-0 mt-sm-0 mt-1">
        <b-form-radio-group
          size="sm"
          v-model="selectedOption"
          :options="calendarOptions"
          buttons
          button-variant="outline-primary"
        />
      </b-col>
    </b-row>
    <b-row v-if="selectedOption === 'Month'">
      <div class="w-100 border border-color seven-columns">
        <b-container
          v-for="(date, index) in calendarDates"
          :key="index"
          class="min-date-height border-color"
          :class="{
            'border-right' : index% colsPerScreenWidth !== colsPerScreenWidth - 1,
            'border-bottom': Math.trunc(index / colsPerScreenWidth) !== Math.trunc((calendarDates.length - 1) / colsPerScreenWidth),
          }"
        >
          <b-row
            :class="{'disabled-date': date.type === 'before' || date.type === 'after'}"
          >
            <b-col>
              <b-row>
                <slot
                  name="date-header"
                  :have-events="date.haveEvents"
                  :number-of-events="date.numberOfEvents"
                  :events="date.events ? date.events : []"
                  :short-day="daysList[index % 7]"
                  :full-day="completeDaysList[index % 7]"
                  :date="date.date"
                  :current-date="currentDay.date() === date.date"
                >
                  <p
                    class="text-center w-100 m-0 font-weight-bolder border-bottom py-50"
                    :class="{'current-date-class': currentDay.date() === date.date && month === currentDay.month()}"
                  >
                    {{ daysList[index % 7] }} {{ date.date }}
                  </p>
                </slot>
              </b-row>
              <b-row>
                <slot
                  name="date"
                  :events="date.events ? date.events : []"
                  :have-events="date.haveEvents"
                  :number-of-events="date.numberOfEvents"
                />
              </b-row>
              <b-row>
                <slot
                  name="date-footer"
                  :have-events="date.haveEvents"
                  :number-of-events="date.numberOfEvents"
                  :events="date.events ? date.events : []"
                  :month="month"
                  :full-month="currentMonth"
                  :year="year"
                  :day="date.date"
                />
              </b-row>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-row>
    <b-row v-if="selectedOption === 'List'">
      <div
        v-for="(day, key) in listEvents"
        :key="key"
        class="w-100 border mb-2 border-color"
      >
        <b-row
          class="m-0"
          :style="'background-color: ' + listTitleBackgroundColor"
        >
          <b-col
            class="border-color d-flex align-items-center justify-content-between px-1 border-bottom py-1"
          >
            <span
              class="m-0 font-weight-bolder font-medium-1"
            >
              {{ currentMonth }} {{ day.date }}, {{ year }}
            </span>
            <span class="m-0 font-weight-bolder font-medium-1">
              {{ completeDaysList[$moment((monthsList.indexOf(currentMonth) + 1) +'/' + day.date +'/' + year).day()] }}
            </span>
          </b-col>
        </b-row>
        <b-row class="seven-columns m-0">
          <div
            v-for="(event, index) in day.events"
            :key="index"
            class="border-color"
            :class="{
              'border-right': (index % colsPerScreenWidth !== colsPerScreenWidth - 1) && colsPerScreenWidth !== 1,
              'border-bottom': Math.trunc(index / colsPerScreenWidth) !== Math.trunc((day.events.length - 1) / colsPerScreenWidth)
            }"
          >
            <slot
              name="date-list"
              :event="event"
            />
          </div>
        </b-row>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import example from './example'

export default {
  name: 'LCalendar',
  props: {
    events: {
      type: Array,
      default: () => example,
    },
    dateLocation: {
      type: String,
      default: 'date',
    },
    dateLocationFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    listTitleBackgroundColor : {
      type: String,
      default: 'transparent',
    }
  },
  data() {
    return {
      month: '',
      year: '',
      currentMonth: '',
      currentDay: '',
      lastDayOfCurrentMonth: '',
      firstDayOfCurrentMonth: '',
      calendarOptions: ['Month', 'List'],
      selectedOption: 'Month',
      monthsList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      daysList: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      completeDaysList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      calendarDates: [],
    }
  },
  computed: {
    colsPerScreenWidth() {
      if (this.screenWidth > 1120) return 7
      if (this.screenWidth > 1024) return 6
      if (this.screenWidth > 938) return 5
      if (this.screenWidth > 690) return 3
      if (this.screenWidth > 425) return 2
      return 1
    },
    listEvents() {
      return this.calendarDates.filter(val => val.haveEvents === true)
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    events(_) {
      this.addEvents()
    },
  },
  created() {
    this.currentDay = this.$moment()
    this.month = this.currentDay.month()
    this.year = this.currentDay.year()
    this.assignMonth()
  },
  methods: {
    emitEventDateChange() {
      this.$emit('dateChange', {
        month: this.month + 1,
        year: this.year,
      })
    },
    assignMonth() {
      this.currentMonth = this.monthsList[this.month]
      const currentMonthInfo = this.$moment(`${this.month + 1}/01/${this.year}`)
      const beforeMonth = (this.month - 1 === -1) ? 11 : (this.month - 1)
      const beforeMonthInfo = this.$moment(`${beforeMonth + 1}/01/${this.month - 1 === -1 ? this.year - 1 : this.year}`)
      const lastDayOfBeforeMonth = beforeMonthInfo.endOf('month')
      this.lastDayOfCurrentMonth = currentMonthInfo.endOf('month')
      this.calendarDates = []
      if (lastDayOfBeforeMonth.day() < 6) {
        for (let i = 0; i <= lastDayOfBeforeMonth.day(); i += 1) {
          this.calendarDates.push({
            date: lastDayOfBeforeMonth.date() - (lastDayOfBeforeMonth.day() - i),
            type: 'before',
            haveEvents: false,
            numberOfEvents: 0,
          })
        }
      }
      for (let i = 1; i <= this.lastDayOfCurrentMonth.date(); i += 1) {
        this.calendarDates.push({
          date: i,
          type: 'current',
        })
      }
      if (this.lastDayOfCurrentMonth.day() < 6) {
        for (let i = 1; i <= 6 - this.lastDayOfCurrentMonth.day(); i += 1) {
          this.calendarDates.push({
            date: i,
            type: 'after',
            haveEvents: false,
            numberOfEvents: 0,
          })
        }
      }
      this.emitEventDateChange()
    },
    beforeMonth() {
      this.month -= 1
      if (this.month === -1) {
        this.month = 11
        this.year -= 1
      }
      this.assignMonth()
    },

    afterMonth() {
      this.month += 1
      if (this.month === 12) {
        this.month = 0
        this.year += 1
      }
      this.assignMonth()
    },
    addEvents() {
      this.calendarDates.forEach((date, index) => {
        if (date.type === 'current') {
          const eventsOfCurrentDay = this.events.filter(event => {
            const eventDay = this.$moment(event[this.dateLocation], this.dateLocationFormat)
            return eventDay.date() === date.date
          })
          this.$set(this.calendarDates[index], 'events', eventsOfCurrentDay)
          this.$set(this.calendarDates[index], 'haveEvents', eventsOfCurrentDay.length > 0)
          this.$set(this.calendarDates[index], 'numberOfEvents', eventsOfCurrentDay.length)
        }
      })
    },
  },
}
</script>

<style scoped>
.mr-05 {
  margin-right: 5px;
}
.seven-columns{
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
}
.min-date-height {
  min-height: 150px;
  overflow-x: hidden;
}

.disabled-date {
  opacity: 0.5;
}
.current-date-class {
  background-color: #00D25B;
  color: white;
}
.border-color {
  border-color: #C4C4C4 !important;
}
@media(max-width: 1120px) {
  .seven-columns{
    display: grid !important;
    grid-template-columns: repeat(6, 1fr) !important;
  }
}
@media(max-width: 1024px) {
  .seven-columns{
    display: grid !important;
    grid-template-columns: repeat(5, 1fr) !important;
  }
}
@media(max-width: 938px) {
  .seven-columns{
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
@media(max-width: 690px) {
  .seven-columns{
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media(max-width: 425px) {
  .seven-columns{
    display: grid !important;
    grid-template-columns: repeat(1, 1fr) !important;
  }
}
</style>
