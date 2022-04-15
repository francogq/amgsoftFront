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
          <span v-if="S_COUNT_JUSTIFICATION_PENDING > 0" class="ml-1">
            <feather-icon
              icon
              :badge="S_COUNT_JUSTIFICATION_PENDING > 99 ? '99+' : S_COUNT_JUSTIFICATION_PENDING"
              badge-classes="badge-danger badge-glow"
            />
          </span>
        </template>
        <justification-pending />
      </b-tab>
      <b-tab :title-link-class="[bgTabsNavs, 'sub-tab px-3']">
        <template #title>
          Done
          <span v-if="S_COUNT_JUSTIFICATION_DONE > 0" class="ml-1">
            <feather-icon
              icon
              :badge="S_COUNT_JUSTIFICATION_DONE > 99 ? '99+' : S_COUNT_JUSTIFICATION_DONE"
              badge-classes="badge-danger badge-glow"
            />
          </span>
        </template>
        <justification-done />
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import { mapState } from "vuex";
import JustificationPending from "./Justify/ComponentPending.vue";
import JustificationDone from "./Justify/ComponentDone.vue";

export default {
  components: {
    JustificationPending,
    JustificationDone
  },
  computed: {
    ...mapState({
      S_COUNT_JUSTIFICATION_DONE: state =>
        state.SchedulesStore.S_COUNTER_JUSTIFICATIONS_DONE,
      S_COUNT_JUSTIFICATION_PENDING: state =>
        state.SchedulesStore.S_COUNTER_JUSTIFICATIONS_ACCOUNT
    })
  }
};
</script>
