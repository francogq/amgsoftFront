<template>
  <div class="p-2">
     <!-- Tabs -->
    <b-tabs 
      lazy
      active-tab-class="p-0 "
      pills
      nav-class="mb-0"
      active-nav-item-class="bg-info box-shadow-info border-info info"
    >
      <!-- Tab Pending -->
      <b-tab title="Pending" :title-link-class="[bgTabsNavs, 'sub-tab px-3']">
        <pending-done active :status="1" />
      </b-tab>
      <!-- Tab Done -->
      <b-tab title="Done" :title-link-class="[bgTabsNavs, 'sub-tab px-3']">
        <pending-done :status="2" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
// Import Component
import PendingDone from "./subcomponents/PendingDone.vue";

export default {
  components: {
    PendingDone
  }
};
</script>