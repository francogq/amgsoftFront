<template>
  <b-navbar-nav class="nav">
    <b-nav-item :id="`bookmark-clock-in`">
      <clock-in></clock-in>
    </b-nav-item>
    <b-nav-item
      :id="`bookmark-messages`"
      v-b-tooltip.hover.top="'Messages'"
      :to="{name: 'amg-messages'}"
    >
      <messages />
    </b-nav-item>
    <b-nav-item
      :id="`bookmark-sticky-notes`"
      @click="$refs.stickyNotes.openStickyNotes()"
    >
      <sticky-notes ref="stickyNotes" />
    </b-nav-item>
    <b-nav-item
      :id="`bookmark-pay-stub`"
      @click="$refs.payStub.openPayStubModal()"
    >
      <pay-stub ref="payStub" />
    </b-nav-item>
    <b-nav-item
      v-b-tooltip.hover.top="'Appointments'"
      @click="$refs.calendar.openAppointmentsModal()"
    >
      <calendar ref="calendar" />
    </b-nav-item>
    <b-nav-item
      :id="`bookmark-messenger`"
      v-b-tooltip.hover.top="'AMG Messenger'"
      @click="$refs.messenger.redirectToMessenger()"
    >
      <messenger ref="messenger" />
    </b-nav-item>
  </b-navbar-nav>
</template>

<script>
import StickyNotes from './components/sticky-notes/StickyNotes.vue'
import Appointments from './components/appointments/Appointments.vue'
import Messages from './components/messages/Messages.vue'
import Messenger from './components/messenger/Messenger.vue'
import PayStub from './components/pay-stub/PayStub.vue'
import ClockIn from './components/schedules/ClockIn.vue'
import Calendar from './components/calendar/Calendar.vue'

export default {
  components: {
    StickyNotes,
    Appointments,
    Messages,
    Messenger,
    PayStub,
    ClockIn,
    Calendar,
  },
}
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/bootstrap-extended/include";

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
p {
  margin: 0;
}

.nav-bookmar-content-overlay {
  position: fixed;
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-transition: all 0.7s;
  transition: all 0.7s;
  z-index: -1;

  &:not(.show) {
    pointer-events: none;
  }

  &.show {
    cursor: pointer;
    z-index: 10;
    opacity: 1;
  }
}
</style>
