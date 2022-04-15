<template>
  <div>
    <b-tabs
      lazy
      active-tab-class="p-0 "
      pills
      nav-class="mb-0"
      active-nav-item-class="bg-info box-shadow-info border-info info"
    >
      <b-tab :title-link-class="[bgTabsNavs, 'sub-tab px-3']">
        <template #title>
          Pending
          <span v-if="S_COUNT_OVERTIME_PENDING > 0" class="ml-1">
            <feather-icon
              icon
              :badge="S_COUNT_OVERTIME_PENDING > 99 ? '99+' : S_COUNT_OVERTIME_PENDING"
              badge-classes="badge-danger badge-glow"
            />
          </span>
        </template>
        <overtime-pending />
      </b-tab>
      <b-tab :title-link-class="[bgTabsNavs, 'sub-tab px-3']">
        <template #title>
          Done
          <span v-if="S_COUNT_OVERTIME_DONE > 0" class="ml-1">
            <feather-icon
              icon
              :badge="S_COUNT_OVERTIME_DONE > 99 ? '99+' : S_COUNT_OVERTIME_DONE"
              badge-classes="badge-danger badge-glow"
            />
          </span>
        </template>
        <overtime-done />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import OvertimePending from "./overtime/ComponentPending.vue";
import OvertimeDone from "./overtime/ComponentDone.vue";

export default {
  components: {
    OvertimePending,
    OvertimeDone
  },
  computed: {
    ...mapState({
      S_COUNT_OVERTIME_DONE: state =>
        state.SchedulesStore.S_COUNTER_OVERTIME_DONE,
      S_COUNT_OVERTIME_PENDING: state =>
        state.SchedulesStore.S_COUNTER_OVERTIME_ACCOUNT
    })
  }
};
</script>
