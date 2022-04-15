<template>
  <div>
    <header-slot />

    <b-nav card-header pills class="m-0">
      <b-nav-item
        :to="{name: 'sales-made-crm-new-client'}"
        :class="{'active bg-tab rounded-top': isNewClient}"
        :link-classes="linkClasses"
      >New Clients</b-nav-item>
      <b-nav-item
        v-if="(currentUser.role_id == 1 || currentUser.role_id == 2 || isCoordinator)"
        :to="{name: 'sales-made-crm-add-change'}"
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Add/Change Service</b-nav-item>
      <b-nav-item
        v-if="(currentUser.role_id == 1 || currentUser.role_id == 2 || isCoordinator)"
        :to="{name: 'sales-made-crm-annulled'}"
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Annulled</b-nav-item>
    </b-nav>

    <b-card no-body class="border-top-primary border-3 border-table-radius">
      <router-view />
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SalesMade",
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    }),
    isNewClient() {
      return this.$route.name === "sales-made-crm-new-client";
    },
    linkClasses() {
      if (this.isNewClient) return ["px-3", "bg-tab", "text-white"];
      return ["px-3", this.bgTabsNavs];
    }
  },
};
</script>

<style scoped>
.bg-tab {
  background-color: #0090e7;
}
</style>
