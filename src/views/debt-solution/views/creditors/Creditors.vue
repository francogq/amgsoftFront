<template>
    <div>
    <add-new-creditor
      :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive"
      :key="keyCreateList"
      @saveLead="keyCreateList = Math.random()"
    />
    <header-slot>
      <template #actions>
        <div>
          <b-button
            v-if="!isOnlyLead"
            variant="success"
            class="mr-1"
            @click="isAddNewUserSidebarActive = true"
          >
            <feather-icon
              icon="PlusIcon"
              size="15"
              class="mr-50 text-white"
            />Create
          </b-button>

        </div>
      </template>
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
import AddNewCreditor from "./components/sidebar/AddNewCreditor.vue";
export default {
      components: {
     AddNewCreditor,
  },
      data() {
    return {
      isOnlyLead: false,
      isAddNewUserSidebarActive: false,
      keyCreateList: 0,
    };
  },
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
    isCreditorRoute() {
      return this.$route.path === `/${this.routeModule}/creditors/`;
    },
  },
};
</script>
<style lang="">
</style>