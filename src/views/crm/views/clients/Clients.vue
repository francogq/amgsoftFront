<template>
  <div>
    <header-slot />
    <b-nav card-header pills class="m-0">
      <b-nav-item
        :to="{ name: 'crm-clients-list' }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Clients</b-nav-item>
      <b-nav-item
        :to="{ name: 'crm-clients-shared-list' }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Shared</b-nav-item>
    </b-nav>

    <b-card no-body class="border-top-primary border-3 border-table-radius px-0">
      <router-view :key="$route.name" />
    </b-card>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {};
</script>

<style>
</style>
