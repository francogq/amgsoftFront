<template lang="">
    <div>
    <header-slot>

    </header-slot>
        <b-card
      no-body
      class="border-top-primary border-3 border-table-radius px-0"
    >
      <router-view />
    </b-card>
    </div>
</template>
<script>
import { mapGetters} from "vuex";
export default {
      computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      skin: "appConfig/skin",
    }),
    routeModule() {
      return this.$route.meta.route;
    },
    moduleId() {
      return this.$route.meta.module;
    },
    isLeadsRoute() {
      return this.$route.path === `/${this.routeModule}/accountsactions/`;
    },
  },
};
</script>
<style lang="">
</style>