<template>
  <div>
    <header-slot>

      <template #actions>
        <div>
          <b-row style="justify-content: right;">
            <b-col md="9">
              <global-search-component></global-search-component>
            </b-col>
          </b-row>
        </div>
      </template>
    </header-slot>
    <b-nav card-header pills class="m-0">
      <b-nav-item
        exact-active-class="active"
        :link-classes="['px-3', bgTabsNavs]"
        exact
        :to="{ name: 'sn-list-business' }"
        >BUSINESS
      </b-nav-item>
      <b-nav-item
        exact-active-class="active"
        :link-classes="['px-3', bgTabsNavs]"
        exact
        :to="{ name: 'sn-list-credit-experts' }"
        >CREDIT EXPERTS
      </b-nav-item>
      <b-nav-item
        exact-active-class="active"
        :link-classes="['px-3', bgTabsNavs]"
        exact
        :to="{ name: 'sn-list-tax-research' }"
        >TAX RESEARCH
      </b-nav-item>
      <b-nav-item
        exact-active-class="active"
        :link-classes="['px-3', bgTabsNavs]"
        exact
        :to="{ name: 'sn-list-boost-credit' }"
        >BOOST CREDIT
      </b-nav-item>
      <b-nav-item
        exact-active-class="active"
        :link-classes="['px-3', bgTabsNavs]"
        exact
        :to="{ name: 'sn-list-debt-solution' }"
        >DEBT SOLUTION
      </b-nav-item>

      <b-nav-item
        exact-active-class="active"
        :link-classes="['px-3', bgTabsNavs]"
        exact
        :to="{ name: 'sn-list-not-call' }"
        >NOT CALL
      </b-nav-item>
    </b-nav>
      
    <b-card 
      no-body
      class="border-top-primary border-3 border-table-radius px-0"
    > 
      <router-view :key="$route.name"/>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import GlobalSearchComponent from '../../commons/GlobalSearchComponent.vue'
export default {
  components: {
    "global-search-component": GlobalSearchComponent,
  },
  data() {
    return {
      //
    };
  },
  methods: {
    //
  },
};
</script>