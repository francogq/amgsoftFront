<template>
  <div>

    <header-slot>

    </header-slot>

      <b-nav card-header pills class="m-0">
        <b-nav-item
          :to="{ name: 'list-social-network-preactive' }"
          exact
          exact-active-class="active"
          :link-classes="['px-3',bgTabsNavs]"
        >PRE ACTIVE</b-nav-item>
        <b-nav-item
          :to="{ name: 'list-social-network-active' }"
          exact
          exact-active-class="active"
          :link-classes="['px-3',bgTabsNavs]"
        >ACTIVE</b-nav-item>
        <b-nav-item
          :to="{ name: 'list-social-network-inactive' }"
          exact
          exact-active-class="active"
          :link-classes="['px-3',bgTabsNavs]"
        >INACTIVE</b-nav-item>
      </b-nav>
    <b-card class="border-top-primary border-3 border-table-radius px-0">
      <router-view :key="$route.name"></router-view>

    </b-card>

  </div>
</template>

<script>


export default {

}
</script>

<style scoped>
</style>
