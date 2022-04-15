<template>
  <div>
    <header-slot></header-slot>
    <!-- Navigation -->
    <b-nav card-header pills class="m-0">
      <!-- Pending -->
      <b-nav-item
        :to="{ name: $route.meta.pendingRoute }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Pending</b-nav-item>
      <!-- Returned -->
      <b-nav-item
        :to="{ name: $route.meta.returnedRoute }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >
        Returned
        <span class="ml-2" v-if="countData > 0 && currentUser.role_id != 1">
          <feather-icon icon :badge="countData" badge-classes="badge-important" />
        </span>
      </b-nav-item>
      <!-- Completed -->
      <b-nav-item
        :to="{ name: $route.meta.completedRoute }"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >Completed</b-nav-item>
    </b-nav>
    <!-- Dynamic Route -->
    <b-card no-body class="border-top-primary border-3 border-table-radius">
      <router-view :key="$route.name"></router-view>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
//Import Services
import NrcService from "./service/ncr.service";
export default {
  data:function() {
    return {
      countData: null
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser"
    })
  },
  methods: {
    countReturned:async function() {
      if (this.currentUser.role_id != 1) {
        try {
          const response = await NrcService.ncrLeadsCountInProcess({
            user_id: this.currentUser.user_id,
            modul: this.$route.meta.module
          });
          if (response.status == 200) {
            this.countData =
              response.data[0].countReturned > 99
                ? "+99"
                : response.data[0].countReturned;
          }
        } catch (error) {
          console.error(error);
          this.showToast(
            "danger",
            "top-right",
            "Error",
            "XIcon",
            "Something went wrong!"
          );
        }
      }
    }
  },
  created:function() {
    this.countReturned();
  }
};
</script>

<style >
</style>