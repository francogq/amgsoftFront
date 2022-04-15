<template>
  <div>
    <b-nav-item-dropdown
      right
      toggle-class="d-flex align-items-center dropdown-user-link"
      class="dropdown-user"
    >
      <template #button-content>
        <feather-icon
          badge-classes="badge-important"
          class="text-body"
          :icon="userStatusSession"
          size="19"
        />
      </template>

      <!-- Header -->
      <li class="dropdown-menu-header">
        <div class="dropdown-header d-flex">
          <h4 class="notification-title mb-0 mr-auto">Status Session</h4>
        </div>
      </li>

      <b-dropdown-item @click="changeStatusSession(1)" link-class="d-flex align-items-center">
        <feather-icon size="16" icon="UserCheckIcon" class="mr-50" />
        <span>Active</span>
      </b-dropdown-item>
      <b-dropdown-item @click="changeStatusSession(2)" link-class="d-flex align-items-center">
        <feather-icon size="16" icon="UserPlusIcon" class="mr-50" />
        <span>Busy</span>
      </b-dropdown-item>
      <b-dropdown-item @click="changeStatusSession(3)" link-class="d-flex align-items-center">
        <feather-icon size="16" icon="UserMinusIcon" class="mr-50" />
        <span>Away</span>
      </b-dropdown-item>
      <b-dropdown-item @click="changeStatusSession(4)" link-class="d-flex align-items-center">
        <feather-icon size="16" icon="UserXIcon" class="mr-50" />
        <span>Offline</span>
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      G_USER_STATUS_SESSION: "UserStore/G_USER_STATUS_SESSION"
    }),
    userStatusSession() {
      return this.G_USER_STATUS_SESSION === 1
        ? "UserCheckIcon"
        : this.G_USER_STATUS_SESSION === 2
        ? "UserPlusIcon"
        : this.G_USER_STATUS_SESSION === 3
        ? "UserMinusIcon"
        : "UserXIcon";
    }
  },
  methods: {
    ...mapActions({
      A_CHANGE_USER_STATUS_SESSION: "UserStore/A_CHANGE_USER_STATUS_SESSION"
    }),
    ...mapMutations({
      SET_USER_STATUS_SESSION: "UserStore/SET_USER_STATUS_SESSION"
    }),
    changeStatusSession(status) {
      if (status === this.G_USER_STATUS_SESSION) return;
      this.SET_USER_STATUS_SESSION([{ status_session: status }]);
      const params = {
        id: this.currentUser.user_id,
        state: status.toString()
      };
      this.A_CHANGE_USER_STATUS_SESSION(params);
    }
  }
};
</script>

<style>
</style>