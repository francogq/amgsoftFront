<template>
  <div>
    <header-slot></header-slot>

    <b-tabs
      v-if="isSupervisorCrm"
      lazy
      pills
      nav-class="mb-0"
      active-nav-item-class="bg-primary box-shadow-info"
    >
      <b-tab lazy title="CRM" :title-link-class="[bgTabsNavs, 'px-3']">
        <CommissionsComponent
          :module="$route.meta.module"
          tab="crm"
          tabSupervisorCrm
        />
      </b-tab>
      <b-tab
        lazy
        title="Departments"
        :title-link-class="[bgTabsNavs, 'px-3']"
        v-if="isSupervisorCrm && !isCoordinator"
      >
        <CommissionsComponent
          :module="$route.meta.module"
          tab="supervisorCrm"
          tabSupervisorCrm
        />
      </b-tab>
    </b-tabs>
    <commissions-component
      v-else
      :module="$route.meta.module"
      :tab="$route.meta.tab"
    ></commissions-component>
  </div>
</template>
<script>
import CommissionsComponent from "@/views/commons/components/commissions/CommissionsComponent.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    CommissionsComponent,
  },
  mounted() {},
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    isSupervisorCrm() {
      return (
        (this.currentUser.role_id === 2 ||
          this.currentUser.role_id === 1 ||
          this.currentUser.role_id === null) &&
        this.$route.meta.module === 2
      );
    },
  },
};
</script>
