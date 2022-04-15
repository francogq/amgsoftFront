<template>
  <b-container fluid>
    <b-row
      v-if="!isModal"
      class="mt-1 mb-2"
    >
      <b-col class="d-flex align-items-center justify-content-start">
        <div class="mr-1">
          <b-button
            variant="outline-info"
            @click="showFilter = !showFilter"
          >
            Filter by Seller
            <feather-icon
              icon="FilterIcon"
              style="margin-left: 5px"
            />
          </b-button>
        </div>
        <div
          v-if="showFilter"
          style="width: 20%"
        >
          <v-select
            v-model="host"
            :options="sellers"
            :reduce="val => val.id"
            @input="emitEventDateChange"
          />
        </div>
      </b-col>
    </b-row>
    <b-row class="no-gutters">
      <l-calendar
        ref="calendar"
        :events="events"
        date-location="due_date"
        date-location-format="YYYY-MM-DD"
        @dateChange="fetchEvents"
      >
        <template #date-header="{date, fullDay, haveEvents, events}">
          <div
            class="py-50 text-center w-100 border-bottom font-weight-bolder"
            style="border-color: #C4C4C4 !important;"
            :class="haveEvents ? `bg-primary text-white border-bottom-0` : ''"
          >
            {{ fullDay }}, {{ date }}
          </div>
        </template>
        <template #date="{events, haveEvents}">
          <div
            class="w-100"
            :class="haveEvents ? `text-white` : ''"
          >
            <task-calendar
              v-if="haveEvents"
              :task="events[0]"
            />
          </div>
        </template>
        <template #date-footer="{haveEvents, events, numberOfEvents, fullMonth, year, day}">
          <span
            v-if="haveEvents"
            class="px-50 pb-50 pt-0 text-right w-100"
            :class="haveEvents ? `bg-light-primary` : ''"
          >
            <b-button
              class="rounded mr-50"
              variant="warning"
              style="padding: 4px; background: #00AAAA !important; border-color: #00AAAA !important;"
              @click="openModalEditEventShow(events[0])"
            >
              <feather-icon
                icon="Edit2Icon"
                size="12"
              />
            </b-button>
            <b-button
              v-if="numberOfEvents > 1"
              class="rounded"
              variant="warning"
              style="padding: 4px; background: #FF7A00 !important; border-color: #FF7A00 !important;"
              @click="openViewMoreEvents(events, fullMonth, year, day)"
            >
              <tabler-icon
                icon="ListIcon"
                size="12"
              />
            </b-button>
          </span>
        </template>
        <template #date-list="{event}">
          <div
            class="w-100 p-50"
          >
            <task-calendar
              class="w-100 cursor-pointer"
              :task="event"
              @click.native="openModalEditEventShow(event)"
            />
          </div>
        </template>
      </l-calendar>
    </b-row>
    <b-modal
      :id="isModal ? 'modal-task-edit-modal' : 'modal-task-edit'"
      title-class="h2 text-white"
      ok-only
      modal-class="modal-primary"
      centered
      size="lg"
      title="Tasks"
      hide-footer
    >
      <modal-task-edit
        :modul="module"
        :only-read="true"
        :lead="lead"
        :task="selectedTask"
        :is-disabled="true"
      />
    </b-modal>
    <view-more-events
      v-if="viewMoreEventsController"
      :events="viewMoreEventsData.events"
      :month="viewMoreEventsData.month"
      :year="viewMoreEventsData.year"
      :day="viewMoreEventsData.day"
      @close="closeViewMoreEvents"
    >
      <template #event-place="{event}">
        <task-calendar
          v-if="event.id"
          :task="event"
          class="cursor-pointer"
          @click.native="openModalEditEventShow(event)"
        />
      </template>
    </view-more-events>
  </b-container>
</template>

<script>
import TaskCalendar from '@/views/crm/views/calendar/components/TaskCalendar.vue'
import CalendarService from '@/views/crm/services/calendar'
import ModalTaskEdit from '@/views/crm/views/Lead/lead-task/ModalTaskEdit.vue'
import ViewMoreEvents from '@/views/crm/views/calendar/components/ViewMoreEvents.vue'
import vSelect from 'vue-select'
import { mapGetters, mapState } from 'vuex'
import TaskService from '@/service/task'
import LCalendar from './LCalendar.vue'

export default {
  name: 'CalendarTest',
  components: {
    ViewMoreEvents,
    TaskCalendar,
    LCalendar,
    ModalTaskEdit,
    vSelect,
  },
  props: {
    isModal: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      taskColor: {
        TEL: 'primary',
        CN: 'success',
        Personal: 'danger',
        Family: 'warning',
        ETC: 'info',
      },
      showFilter: false,
      viewMoreEventsController: false,
      events: [],
      host: 0,
      selectedTask: {},
      viewMoreEventsData: {
        events: [],
        month: 'January',
        day: 1,
        year: 2022,
      },
      module: 2,
      onlyRead: false,
      lead: {},
      authUser: '',
    }
  },
  computed: {
    ...mapState({
      sellers: state => state['crm-store'].sellersCrm,
    }),
    ...mapGetters({
      currentUser: 'auth/currentUser',
      token: 'auth/token',
      /* G_TEMPLATES: 'CrmTemplateStore/G_TEMPLATES' */
    }),
  },
  created() {
    this.$store.dispatch('crm-store/getSellers', {
      module: 2,
      body: {
        roles: '[1,5,2]',
        type: '1',
      },
    })
    this.authUser = this.currentUser
    this.setDataBlank('selectedTask')
  },
  methods: {
    setDataBlank(key) {
      this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`] = {
        ...this[key],
      }
    },
    emitEventDateChange() {
      this.$refs.calendar.emitEventDateChange()
    },
    updatedEvent() {
      this.$bvModal.hide(
        this.isModal ? 'modal-event-edit-modal' : 'modal-event-edit',
      )
      this.emitEventDateChange()
    },
    openViewMoreEvents(events, month, year, day) {
      this.viewMoreEventsData.events = events
      this.viewMoreEventsData.month = month
      this.viewMoreEventsData.year = year
      this.viewMoreEventsData.day = day
      this.viewMoreEventsController = true
    },
    closeViewMoreEvents() {
      this.viewMoreEventsController = false
    },
    async fetchEvents({ month, year }) {
      try {
        this.addPreloader()
        const monthInfo = this.$moment(`${month}/1/${year}`)
        if (this.isModal) this.host = this.authUser.user_id
        const response = await CalendarService.filterMonthNextTask({
          year: monthInfo.format('YYYY'),
          month: monthInfo.format('MM'),
          host: this.host ? this.host : 0,
        })
        if (this.isResponseSuccess(response)) {
          this.events = JSON.parse(response.data[0].events_month)
          this.removePreloader()
        } else {
          this.showToast(
            'warning',
            'top-right',
            'Warning!',
            'AlertTriangleIcon',
            `Something went wrong. ${response.message}`,
          )
        }
      } catch (error) {
        console.log('Something went wrong fetchEvents', error)
        this.showErrorSwal(error)
        this.removePreloader()
      }
    },
    resetData(key) {
      this[key] = {
        ...this[`blank${key.charAt(0).toUpperCase()}${key.slice(1)}`],
      }
    },
    async openModalEditEventShow(event) {
      try {
        const { id } = event
        const response = await TaskService.getTask({ id })
        this.resetData('selectedTask')
        if (this.isResponseSuccess(response)) {
          [this.selectedTask] = response.data
          this.lead = {
            lead_name: event.lead_name,
            state: event.lead_state,
          }
          this.$bvModal.show(
            this.isModal ? 'modal-task-edit-modal' : 'modal-task-edit',
          )
        } else {
          this.showToast(
            'warning',
            'top-right',
            'Warning!',
            'AlertTriangleIcon',
            `Something went wrong. ${response.message}`,
          )
        }
      } catch (error) {
        console.log('Something went wrong getEvents', error)
        this.showToast(
          'danger',
          'top-right',
          'Oop!',
          'AlertOctagonIcon',
          this.getInternalErrors(error),
        )
      }
    },
  },
}
</script>

<style scoped>
.bg-light-success {
  background-color: rgba(0, 210, 91, 0.07) !important;
}
.bg-light-primary {
  background-color: rgba(0, 144, 231, 0.07) !important
}
.current-date-class {
  background-color: #00D25B;
  color: white;
}
</style>
