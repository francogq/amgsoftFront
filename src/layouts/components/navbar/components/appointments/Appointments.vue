<template>
  <b-nav-item>
    <feather-icon icon="CalendarIcon" size="19" />
    <b-tooltip
        triggers="hover"
        :target="`bookmark-appointment`"
        title="Appointment"
        :delay="{ show: 1000, hide: 50 }"
    />
  </b-nav-item>
</template>

<script>
export default {};
</script>

<style>
</style>