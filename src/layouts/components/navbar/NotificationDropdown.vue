<template>
  <div>
    <b-nav-item-dropdown class="dropdown-notification mr-25" menu-class="dropdown-menu-media" right>
      <template #button-content>
        <feather-icon
          :badge="G_NOTIFICATION_COUNTER > 99 ? '+99' : G_NOTIFICATION_COUNTER"
          badge-classes="badge-important"
          class="text-body"
          icon="BellIcon"
          size="19"
        />
      </template>

      <!-- Header -->
      <li class="dropdown-menu-header">
        <div class="dropdown-header d-flex">
          <h4 class="notification-title mb-0 mr-auto">Notifications</h4>
          <b-badge pill variant="light-primary">{{G_NOTIFICATION_COUNTER}} New</b-badge>
        </div>
      </li>

      <!-- Notifications -->
      <vue-perfect-scrollbar
        :settings="perfectScrollbarSettings"
        class="scrollable-container media-list scroll-area"
        tagname="li"
      >
        <!-- Account Notification -->
        <b-link
          v-for="notification in S_NOTIFICATIONS"
          :key="notification.id"
          :to="notification.link"
        >
          <b-media>
            <template #aside>
              <b-avatar size="32" variant="light-secondary">
                <feather-icon icon="InfoIcon" />
              </b-avatar>
            </template>
            <p class="media-heading">
              <span class="font-weight-bolder">{{ notification.notification }}</span>
            </p>
            <small class="notification-text">
              {{
              notification.created_at | myDateGlobal
              }}
            </small>
          </b-media>
        </b-link>
      </vue-perfect-scrollbar>

      <!-- Cart Footer -->
      <li class="dropdown-menu-footer">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          block
          @click="notificationModal = true"
        >Read all notifications</b-button>
      </li>
    </b-nav-item-dropdown>
    <b-modal
      v-model="notificationModal"
      title-class="h3 text-white"
      size="lg"
      centered
      title="Notifications"
      hide-footer
      modal-class="modal-primary"
    >
      <notification-list @closeNotifications="notificationModal = false"></notification-list>
    </b-modal>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Ripple from "vue-ripple-directive";
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import NotificationList from "./components/notifications/NotificationList.vue";
export default {
  mounted() {
    this.A_GET_NOTIFICATIONS({ id: this.currentUser.user_id });
  },
  components: {
    VuePerfectScrollbar,
    NotificationList
  },
  directives: {
    Ripple
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      G_NOTIFICATION_COUNTER: "NotificationStore/G_NOTIFICATION_COUNTER"
    }),
    ...mapState({
      S_NOTIFICATIONS: state => state.NotificationStore.S_NOTIFICATIONS
    })
  },
  data() {
    return {
      perfectScrollbarSettings: {
        maxScrollbarLength: 60,
        wheelPropagation: false
      },
      notificationModal: false
    };
  },
  methods: {
    ...mapActions({
      A_GET_NOTIFICATIONS: "NotificationStore/A_GET_NOTIFICATIONS"
    }),
    ...mapMutations({
      DECREASE_NOTIFICATION_COUNTER:
        "NotificationStore/DECREASE_NOTIFICATION_COUNTER"
    })
  }
};
</script>

<style>
</style>
