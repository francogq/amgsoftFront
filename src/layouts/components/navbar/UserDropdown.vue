<template>
  <b-nav-item-dropdown
    right
    toggle-class="d-flex align-items-center dropdown-user-link"
    class="dropdown-user"
  >
    <template #button-content>
      <div class="d-sm-flex d-none user-nav">
        <p
          class="user-name font-weight-bolder mb-0"
        >{{ currentUser.fullName || currentUser.username }}</p>
        <span class="user-status">{{ currentUser.role_name ? currentUser.role_name : currentUser.roleName }} {{ ((isCeo || isSupervisor) ? '' : (currentUser.level_name || '')) }}</span>
      </div>
      <b-avatar
        size="40"
        :src="currentUser.avatar"
        variant="light-primary"
        badge
        class="badge-minimal"
        :badge-variant="statusSession"
      >
        <feather-icon v-if="!currentUser.fullName" icon="UserIcon" size="19" />
      </b-avatar>
    </template>

    <b-dropdown-item :to="{ name: 'users-my-profile' }" link-class="d-flex align-items-center">
      <feather-icon size="16" icon="UserIcon" class="mr-50" />
      <span>My Profile</span>
    </b-dropdown-item>
    <b-dropdown-item link-class="d-flex align-items-center" :to="{ name: 'amg-messages' }">
      <messages class="mr-50" />
      <span>Messages</span>
    </b-dropdown-item>
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="$refs.stickyNotes.openStickyNotes()"
    >
      <sticky-notes ref="stickyNotes" class="mr-50" />
      <span>Sticky Notes</span>
    </b-dropdown-item>
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="$refs.payStub.openPayStubModal()"
    >
      <pay-stub ref="payStub" class="mr-50" />
      <span>Pay Stub</span>
    </b-dropdown-item>
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="$refs.messenger.redirectToMessenger()"
    >
      <messenger ref="messenger" class="mr-50" />
      <span>Messenger</span>
    </b-dropdown-item>
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="$refs.schedules.openModalReport()"
    >
      <schedules-report ref="schedules" class="mr-50" />
      <span>Schedule R.</span>
    </b-dropdown-item>
    <b-dropdown-item link-class="d-flex align-items-center" @click="logout">
      <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
      <span>Exit</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { mapGetters } from "vuex";

import { initialAbility } from "@/libs/acl/config";
import useJwt from "@/auth/jwt/useJwt";
import { avatarText } from "@core/utils/filter";
import { mapMutations } from "vuex";
import StickyNotes from "./components/sticky-notes/StickyNotes.vue";
import Appointments from "./components/appointments/Appointments.vue";
import Messages from "./components/messages/Messages.vue";
import Messenger from "./components/messenger/Messenger.vue";
import PayStub from "./components/pay-stub/PayStub.vue";
import SchedulesReport from "./components/schedules/SchedulesReportUser.vue";

export default {
  components: {
    StickyNotes,
    Appointments,
    Messages,
    Messenger,
    PayStub,
    SchedulesReport
  },
  data() {
    return {
      userData: JSON.parse(localStorage.getItem("userData")),
      avatarText
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      G_USER_STATUS_SESSION: "UserStore/G_USER_STATUS_SESSION"
    }),
    statusSession() {
      return this.G_USER_STATUS_SESSION === 1
        ? "success"
        : this.G_USER_STATUS_SESSION === 2
        ? "warning"
        : this.G_USER_STATUS_SESSION === 3
        ? "danger"
        : "secondary";
    }
  },
  mounted() {},
  methods: {
    ...mapMutations({
      resetState: "resetState"
    }),
    logout() {
      // Remove userData from localStorage
      // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName);
      localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName);

      // Remove userData from localStorage
      this.resetState();
      // Reset ability
      this.$ability.update(initialAbility);
      window.location.href = process.env.VUE_APP_ORIGINAL_SOFT;
      // Redirect to login page
      // this.$router.push({ name: "auth-login" });
    }
  }
};
</script>
