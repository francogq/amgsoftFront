<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Left Col -->
    <b-link
      v-if="$route.meta.module == undefined && $route.name != 'amg-menu'"
      :class="skin == 'dark'?'text-light':'text-dark'"
      :to="{name: 'amg-menu'}"
      class="mr-2"
    >
      <amg-icon icon="AmgIcon" size="35" />
    </b-link>
    <ul v-else-if="$route.meta.module != undefined" class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <!-- Bookmarks Container -->
      <bookmarks />
    </div>
    <b-navbar-nav class="nav align-items-center ml-auto">
      <dark-Toggler />
      <task-dropdown v-b-tooltip.hover.top="'Tasks'" />
      <notification-dropdown v-b-tooltip.hover.top="'Appointments'" />
      <status-dropdown v-b-tooltip.hover.top="'Status Session'" />
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import DarkToggler from "@core/layouts/components/app-navbar/components/DarkToggler.vue";
import NotificationDropdown from "./NotificationDropdown.vue";
import StatusDropdown from "./StatusDropdown.vue";
import TaskDropdown from "./components/tasks/TaskDropdown.vue";
import UserDropdown from "./UserDropdown.vue";
import Bookmarks from "./Bookmark.vue";

export default {
  components: {
    DarkToggler,
    NotificationDropdown,
    UserDropdown,
    Bookmarks,
    TaskDropdown,
    StatusDropdown
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    skin() {
      return this.$store.getters["appConfig/skin"];
    }
  }
};
</script>

<style>
</style>
