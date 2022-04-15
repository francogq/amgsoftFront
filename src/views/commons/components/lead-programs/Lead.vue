<template>
  <div>
    <lead-list-add-new
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
    <b-nav card-header pills class="m-0">
      <b-nav-item
        exact-active-class="active"
        :link-classes="['px-3', bgTabsNavs]"
        exact
        :to="`/${routeModule}/leads/`"
        >Leads</b-nav-item
      >
    </b-nav>

    <b-card
      no-body
      class="border-top-primary border-3 border-table-radius px-0"
    >
      <router-view />
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import LeadListAddNew from "./components/sidebar/LeadListAddNew.vue";

export default {
  components: {
     LeadListAddNew,
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/currentUser",
      token: "auth/token",
      skin: "appConfig/skin",
      G_STATE_LEADS: "CrmLeadStore/G_STATE_LEADS",
    }),
    ...mapState({
      S_SELECTED_LEADS: (state) => state.CrmLeadStore.S_SELECTED_LEADS,
      S_FILTERS_LEADS: (state) => state.CrmLeadStore.S_FILTERS_LEADS,
    }),
    routeModule() {
      return this.$route.meta.route;
    },
    isLeadsRoute() {
      return this.$route.path === `/${this.routeModule}/leads/`;
    },
  },
  data() {
    return {
      isOnlyLead: false,
      isAddNewUserSidebarActive: false,
      preloading: true,
      dato1: "desc",
      dato2: 10,
      isLoading: false,
      keyCreateList: 0,
    };
  },
  async created() {
    await Promise.all([
      this.getStateLeads(),
      this.getStatusLeads(),
      this.getSourceLeads(),
      this.getOwners(),
      this.getPrograms(),
      this.getSourceNames(),
      this.getStates(),
      this.getEeuuStates(),
      this.getCountries(),
      this.getSellers(),
    ]);
  },
  methods: {
    ...mapActions({
      A_GET_STATE_LEADS: "CrmLeadStore/A_GET_STATE_LEADS",
      A_GET_STATUS_LEADS: "CrmLeadStore/A_GET_STATUS_LEADS",
      A_GET_SOURCE_LEADS: "CrmLeadStore/A_GET_SOURCE_LEADS",
      A_EXPORT_LEADS_TO_EXCEL: "CrmLeadStore/A_EXPORT_LEADS_TO_EXCEL",
      A_GET_OWNERS: "CrmGlobalStore/A_GET_OWNERS",
      A_GET_PROGRAMS: "CrmGlobalStore/A_GET_PROGRAMS",
      A_GET_SOURCE_NAMES: "CrmGlobalStore/A_GET_SOURCE_NAMES",
      A_GET_STATES: "CrmGlobalStore/A_GET_STATES",
      A_GET_EEUU_STATES: "CrmGlobalStore/A_GET_EEUU_STATES",
      A_GET_COUNTRIES: "CrmGlobalStore/A_GET_COUNTRIES",
      A_GET_SELLERS: "CrmGlobalStore/A_GET_SELLERS",
    }),
    async getStateLeads() {
      try {
        await this.A_GET_STATE_LEADS();
      } catch (error) {
        console.log("Something went wrong getStateLeads:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getStatusLeads() {
      try {
        await this.A_GET_STATUS_LEADS();
      } catch (error) {
        console.log("Something went wrong getStatusLeads:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getSourceLeads() {
      try {
        await this.A_GET_SOURCE_LEADS();
      } catch (error) {
        console.log("Something went wrong getSourceLeads:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getOwners() {
      try {
        await this.A_GET_OWNERS({
          modul: this.currentUser.modul_id,
          body: { roles: "[1,2,5]", type: "1" },
        });
      } catch (error) {
        console.log("Something went wrong getOwners:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getPrograms() {
      try {
        await this.A_GET_PROGRAMS();
      } catch (error) {
        console.log("Something went wrong getPrograms:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getSourceNames() {
      try {
        await this.A_GET_SOURCE_NAMES();
      } catch (error) {
        console.log("Something went wrong getSourceNames:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getStates() {
      try {
        await this.A_GET_STATES({ type: 1 });
      } catch (error) {
        console.log("Something went wrong getStates:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getEeuuStates() {
      try {
        await this.A_GET_EEUU_STATES();
      } catch (error) {
        console.log("Something went wrong getEeuuStates:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getCountries() {
      try {
        await this.A_GET_COUNTRIES();
      } catch (error) {
        console.log("Something went wrong getCountries:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
    async getSellers() {
      try {
        await this.A_GET_SELLERS({
          modul: this.currentUser.modul_id,
          body: { roles: "[]", type: "1" },
        });
      } catch (error) {
        console.log("Something went wrong getSellers:", error);
        this.showToast(
          "danger",
          "top-right",
          "Oop!",
          "AlertOctagonIcon",
          this.getInternalErrors(error)
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>