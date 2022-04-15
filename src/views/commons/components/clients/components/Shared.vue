<template>
    <div class="p-2">
     <!-- Tabs -->
    <b-tabs v-if="this.currentUser.role_id != 3"
      lazy
      active-tab-class="p-0 "
      pills
      nav-class="mb-0"
      active-nav-item-class="bg-info box-shadow-info border-info info"
    >
      <!-- Tab Of the Program -->
      <b-tab title="Of the Program" :title-link-class="[bgTabsNavs, 'sub-tab px-3']">
        <general-table-shared :typeShared="1" ></general-table-shared>
      </b-tab>
      <!-- Tab From others Programs -->
      <b-tab title="From Others Programs" :title-link-class="[bgTabsNavs, 'sub-tab px-3']">
        <general-table-shared :typeShared="2" ></general-table-shared>
      </b-tab>
    </b-tabs>
    <general-table-shared v-else :typeShared="2" ></general-table-shared>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// Import Components
import GeneralTableShared from "./subcomponents/GeneralTableShared.vue"
export default {
  components:{
    GeneralTableShared,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    })
  },
}
</script>