<template>
  <div>
    <header-slot>
      <template #actions>
        <div>
          <b-row>
            <b-col md="12">
              <div class="d-flex justify-content-end align-items-center">
                <global-search-component
                  class="w-100 mr-2"
                ></global-search-component>
                <lead-create-social />
              </div>
            </b-col>
          </b-row>
        </div>
      </template>
    </header-slot>

    <div v-if="isCeo || isSupervisor || isTeamLeader">
        <b-nav card-header pills class="m-0">
          <b-nav-item
            exact-active-class="active"
            :link-classes="['px-3', bgTabsNavs]"
            exact
            :to="{ name: 'sn-list-new-leads' }"
            >LEADS
          </b-nav-item>

          <b-nav-item
            exact-active-class="active"
            :link-classes="['px-3', bgTabsNavs]"
            exact
            :to="{ name: 'sn-list-without-potential-leads' }"
            >WITHOUT POTENTIAL
          </b-nav-item>

          <b-nav-item
            exact-active-class="active"
            :link-classes="['px-3', bgTabsNavs]"
            exact
            :to="{ name: 'sn-list-closed-leads' }"
            class="tab-count-nav-closed"
            >CLOSED
            <b-badge pill variant="success" class="ml-1">{{ S_LEADS_COUNT_CLOSED_COUNTER }}</b-badge>
          </b-nav-item>
        </b-nav>
        <b-card 
          no-body
          class="border-top-primary border-3 border-table-radius px-0"
        > 
          <router-view :key="$route.name"/>
        </b-card>
    </div>

    <div v-else>
      <new-leads></new-leads>
    </div>

  </div>
</template>

<script>
import GlobalSearchComponent from "../../commons/GlobalSearchComponent.vue";
import LeadCreateSocial from "@/views/social-network/views/leads/components/lead-create/LeadCreateSocial";
import NewLeads from "@/views/social-network/views/leads/tabs/new-leads/NewLeads.vue";
import {mapState, mapActions} from 'vuex'
// components
export default {
  components: {
    "global-search-component": GlobalSearchComponent,
    "new-leads": NewLeads,
    LeadCreateSocial
  },
  computed: {
    ...mapState("SocialNetworkLeadsStore", ["S_LEADS_COUNT_CLOSED_COUNTER"]),
  },
  methods: {
    ...mapActions('SocialNetworkLeadsStore', ['A_GET_COUNT_LEAD_CLOSED']),
    async getCountLeadClosed() {
      try {
        await this.A_GET_COUNT_LEAD_CLOSED();
      } catch (error) {
        console.log("Something went wrong getCountLeadClosed:", error);
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
  async created() {
    await this.getCountLeadClosed();
  },
};
</script>

<style lang="scss">
  .tab-count-nav-closed a{
    padding: 7.5px 40px !important;
  }
</style>