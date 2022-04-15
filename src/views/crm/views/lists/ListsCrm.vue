<template>
  <div >
    <header-slot></header-slot>
    <!-- Navigation -->
    <b-nav card-header pills class="m-0">
      <!-- My List -->
      <b-nav-item
        :to="{ name: 'lists-crm-mylist' }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >My List</b-nav-item>
      <!-- List -->
      <b-nav-item
        :to="{ name: 'lists-crm-list' }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >List</b-nav-item>
    </b-nav>
   <!-- Dinamic Route -->
    <b-card no-body class="border-top-primary border-3 border-table-radius px-0">
      <router-view :key="$route.name"></router-view>
    </b-card>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>