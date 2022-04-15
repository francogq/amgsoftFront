<template>
  <div>
    <feather-icon
      icon="CalendarIcon"
      size="19"
    />
    <b-modal
      id="modal-appointments-calendar-a"
      title="Appointments"
      size="xl"
      scrollable
      hide-footer
    >
      <calendar
        :is-modal="true"
      />
    </b-modal>
  </div>
</template>

<script>
import Calendar from '@/views/crm/views/calendar/components/appointment/default.vue'

export default {
  name: 'CalendarVue',
  components: {
    Calendar,
  },
  methods: {
    openAppointmentsModal() {
      this.$bvModal.show('modal-appointments-calendar-a')
    },
  },
}
</script>

<style scoped>

</style>
