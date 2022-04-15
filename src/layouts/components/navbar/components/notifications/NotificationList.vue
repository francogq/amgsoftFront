<template>
  <div>
    <b-list-group>
      <template v-if="!loading">
        <b-list-group-item
          v-for="notification in S_ALL_USER_NOTIFICATIONS"
          :key="notification.id"
          @click="
            notification.status == 1 ? null : updateNotification(notification)
          "
        >
          <div class="d-flex w-100 justify-content-between">
            <b-media no-body>
              <b-media-aside class="mr-2">
                <b-avatar
                  :class="notification.status == 1 ? '' : 'cursor-pointer'"
                  size="30"
                  :variant="
                    notification.status == 1 ? 'light-primary' : 'primary'
                  "
                >
                  <feather-icon
                    size="15"
                    :icon="
                      notification.type == 0
                        ? 'ClipboardIcon'
                        : notification.type == 1
                        ? 'PhoneIcon'
                        : notification.type == 2
                        ? 'DollarSignIcon'
                        : notification.type == 3
                        ? 'FileTextIcon'
                        : 'PhoneForwardedIcon'
                    "
                  />
                </b-avatar>
              </b-media-aside>
              <b-media-body class="my-auto" @click="closeNotifications()">
                <b-link
                  :class="[
                    'font-weight-bold mb-0 h5',
                    notification.status == 0
                      ? skin == 'dark'
                        ? 'text-light'
                        : 'text-dark'
                      : '',
                  ]"
                  class="d-flex"
                  :to="notification.link"
                >
                  <p v-html="notification.notification"></p>
                  <feather-icon
                    style="margin-left: 4px; margin-top: 3px"
                    icon="ExternalLinkIcon"
                  ></feather-icon>
                </b-link>
              </b-media-body>
            </b-media>
            <small>{{ notification.created_at | myDateGlobal }}</small>
          </div>
        </b-list-group-item>
      </template>
      <template v-else>
        <b-list-group-item
          :key="notification.id"
          v-for="notification in S_ALL_USER_NOTIFICATIONS.length"
        >
          <div class="d-flex w-100 justify-content-between align-items-center">
            <b-media no-body class="w-100">
              <b-media-aside class="mr-2" width="100%">
                <b-skeleton type="avatar" size="30px"></b-skeleton>
              </b-media-aside>
              <b-media-body class="my-auto">
                <b-skeleton style="margin-top: 9px"></b-skeleton>
              </b-media-body>
            </b-media>
            <small></small>
          </div>
        </b-list-group-item>
      </template>
    </b-list-group>
    <div class="mx-2 mb-2 mt-2">
      <b-row>
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span class="text-muted"
            >Showing {{ startPage }} to {{ toPage }} of
            {{ totalData }} entries</span
          >
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="totalData"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon icon="ChevronLeftIcon" size="18" />
            </template>
            <template #next-text>
              <feather-icon icon="ChevronRightIcon" size="18" />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
export default {
  async mounted() {
    await this.getAllUserNotifications();
  },
  data() {
    return {
      currentPage: 1,
      perPage: 7,
      totalData: 0,
      startPage: 0,
      toPage: 0,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      skin: "appConfig/skin",
    }),
    ...mapState({
      S_ALL_USER_NOTIFICATIONS: (state) =>
        state.NotificationStore.S_ALL_USER_NOTIFICATIONS,
    }),
  },
  methods: {
    ...mapActions({
      A_GET_ALL_USER_NOTIFICATIONS:
        "NotificationStore/A_GET_ALL_USER_NOTIFICATIONS",
      A_UPDATE_NOTIFICATION: "NotificationStore/A_UPDATE_NOTIFICATION",
    }),
    ...mapMutations({
      DECREASE_NOTIFICATION_COUNTER:
        "NotificationStore/DECREASE_NOTIFICATION_COUNTER",
    }),
    async getAllUserNotifications(page = 1) {
      this.loading = true;
      try {
        const data = await this.A_GET_ALL_USER_NOTIFICATIONS({
          id: this.currentUser.user_id,
          page,
        });
        this.currentPage = data.current_page;
        this.perPage = data.per_page;
        this.totalData = data.total;
        this.startPage = data.from;
        this.toPage = data.to;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    async updateNotification(notification) {
      try {
        await this.A_UPDATE_NOTIFICATION({
          id: notification.id,
        });
        notification.status = 1;
        this.DECREASE_NOTIFICATION_COUNTER();
      } catch (error) {
        console.log(error);
      }
    },
    closeNotifications() {
      this.$emit("closeNotifications");
    },
  },
  watch: {
    currentPage(newVal, oldVal) {
      this.getAllUserNotifications(newVal);
    },
  },
};
</script>

<style>
/* .list-group-item-selected {
  background-color: #82868b !important;
  border-color: white !important;
  color: white !important;
  opacity: 0.6 !important;
} */
/* .list-group-item-selected h5,
h4 {
  color: white !important;
} */
</style>
