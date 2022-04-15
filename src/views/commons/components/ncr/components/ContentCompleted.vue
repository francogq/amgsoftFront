<template>
  <div class="p-2">
    <!-- Tabs -->
    <b-tabs
      lazy
      active-tab-class="p-0 "
      pills
      nav-class="mb-0"
      active-nav-item-class="bg-info box-shadow-info info"
    >
      <!-- Tab Successfull -->
      <b-tab title="Successfull" :title-link-class="[bgTabsNavs, 'sub-tab px-3']">
        <content-sub-completed :status="1"></content-sub-completed>
      </b-tab>
      <!-- Tab Invalid -->
      <b-tab title="Invalid" :title-link-class="[bgTabsNavs, 'sub-tab px-3']">
        <content-sub-completed :status="2"></content-sub-completed>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import ContentSubCompleted from "./subcomponents/ContentSubCompleted.vue";
export default {
  components: {
    ContentSubCompleted
  },
};
</script>

