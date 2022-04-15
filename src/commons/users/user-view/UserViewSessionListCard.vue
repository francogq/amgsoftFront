<template>
  <b-card no-body>
    <b-card-body>
      <b-card-title>Session List</b-card-title>
      <b-card-sub-title>Session list according to user</b-card-sub-title>
    </b-card-body>
    <b-table
      striped
      responsive
      :items="S_USER_SESSIONS"
      :fields="arrayColumns"
      class="mb-0"
      v-if="!loading"
      style="max-height: 210px; overflow: auto;"
    >
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-1" />
          <strong>Loading...</strong>
        </div>
      </template>
      <template #cell(start_login)="data">
        {{ data.item.start_login | myGlobal }}
      </template>
      <template #cell(end_login)="data">
        {{ data.item.end_login | myGlobal }}
      </template>
    </b-table>
    <b-skeleton-table
      v-else
      :rows="4"
      :columns="3"
      :table-props="{  striped: true }"
    ></b-skeleton-table>
    <div class="mx-2 mb-2 mt-1">
      <b-row>
        <b-col
          cols="12"
          sm="6"
          class="
            d-flex
            align-items-center
            justify-content-center justify-content-sm-start
          "
        >
          <span class="text-muted">
            Showing {{ startPage }} to {{ toPage }} of {{ totalData }} entries
          </span>
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="
            d-flex
            align-items-center
            justify-content-center justify-content-sm-end
          "
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
  </b-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  async mounted() {
    await this.getUserSessions();
  },
  data() {
    return {
      arrayColumns: [
        {
          key: "ip",
          label: "IP",
          sortable: true,
          visible: true,
        },
        {
          key: "start_login",
          label: "Start Login",
          sortable: true,
          visible: true,
        },
        {
          key: "end_login",
          label: "End Login",
          sortable: true,
          visible: true,
        },
      ],
      //pagination
      totalData: 0,
      perPage: 5,
      currentPage: 1,
      startPage: 1,
      toPage: 10,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
    }),
    ...mapState({
      S_USER_SESSIONS: (state) => state.UserStore.S_USER_SESSIONS,
    }),
  },
  methods: {
    ...mapActions({
      A_GET_USER_SESSIONS: "UserStore/A_GET_USER_SESSIONS",
    }),
    async getUserSessions(page = 1) {
      this.loading = true;
      try {
        const data = await this.A_GET_USER_SESSIONS({
          id: this.currentUser.user_id,
          perpage: this.perPage,
          page,
        });
        this.totalData = data.data.total;
        this.currentPage = data.data.current_page;
        this.startPage = data.data.from;
        this.toPage = data.data.to;
        this.loading = false;
      } catch (error) {
        this.showErrorSwal(error);
        this.loading = false;
      }
    },
  },
  watch: {
    currentPage(newPage) {
      this.getUserSessions(newPage);
    },
  },
};
</script>

<style>
</style>
