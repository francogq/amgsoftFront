<template>
  <div>
    <header-slot></header-slot>
    <!-- Navigation -->
    <b-nav card-header pills class="m-0">
      <!-- Payments -->
      <b-nav-item
        :to="{ name: 'payments-crm-list' }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Payments</b-nav-item>
      <!-- Process -->
      <b-nav-item
        :to="{ name: 'payments-crm-process' }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Process</b-nav-item>
    </b-nav>

    <b-card class="border-top-primary border-3 border-table-radius px-0">
      <router-view :key="$route.name"></router-view>
    </b-card>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>