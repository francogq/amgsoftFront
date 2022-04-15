<template>
  <div>
    <header-slot>
      <template #actions>
        <b-button
          v-if="isManagement"
          variant="info"
          :block="!bigWindow"
          class="mr-1"
          @click="openModalImportLoan"
        >Import Loan</b-button>
        <b-button variant="primary" :block="!bigWindow" @click="openModalLoan()">Request Loan</b-button>
      </template>
    </header-slot>

    <b-nav card-header pills class="m-0">
      <b-nav-item
        v-if="isManagement"
        :to="`/${route}/loans/general`"
        exact
        exact-active-class="active"
        :link-classes="['px-3',bgTabsNavs]"
      >
        Loans
        <span v-if="counterTab.management > 0" class="ml-1">
          <feather-icon
            icon
            :badge="
                  counterTab.management > 99 ? '99+' : counterTab.management
                "
            badge-classes="badge-important"
          />
        </span>
      </b-nav-item>
      <b-nav-item
        v-if="isSupervisor || isCeo"
        :to="`/${route}/loans/loans-module/`"
        exact
        :link-classes="['px-3',bgTabsNavs]"
        exact-active-class="active"
      >
        Loans by Module
        <span v-if="counterTab.supervisor > 0" class="ml-1">
          <feather-icon
            icon
            :badge="
                  counterTab.supervisor > 99 ? '99+' : counterTab.supervisor
                "
            badge-classes="badge-important"
          />
        </span>
      </b-nav-item>
      <b-nav-item
        exact-active-class="active"
        :to="`/${route}/loans/my-loans`"
        exact
        :link-classes="['px-3',bgTabsNavs]"
      >
        My Loans
        <span v-if="counterTab.my_loan > 0" class="ml-1">
          <feather-icon
            icon
            :badge="counterTab.my_loan > 99 ? '99+' : counterTab.my_loan"
            badge-classes="badge-important"
          />
        </span>
      </b-nav-item>
    </b-nav>

    <b-card no-body class="border-top-primary border-3 border-table-radius px-0">
      <router-view :key="this.$route.name" class="mt-2" />
    </b-card>
    <ModalRequestLoan v-if="modalRequest.show" :info="modalRequest" @hide="closeModalLoan" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalRequestLoan from "./modals/ModalRequestLoan.vue";

export default {
  name: "LoansComponent",
  components: {
    ModalRequestLoan
  },

  data() {
    return {
      tab: this.$route.meta.tab,

      routeVar: this.$route.name
    };
  },
  created() {
    this.$store.dispatch("loans-store/loadCounterTab");
  },
  computed: {
    ...mapGetters({
      bigWindow: "app/bigWindow",
      currentUser: "auth/currentUser",
      researchLoans: "loans-store/researchLoans",
      counterTab: "loans-store/counterTab",
      modalRequest: "loans-store/modalRequest",
      isSupervisor: "auth/isSupervisor",
      isCeo: "auth/isCeo"
    }),
    positionResponsive() {
      return this.bigWindow ? "text-right" : "";
    },
    isManagement() {
      return this.$route.meta.module == 16;
    },
    route() {
      return this.$route.meta.route;
    }
  },
  mounted() {
    this.modalRequest.tab = this.tab;
  },
  methods: {
    openModalImportLoan() {
      this.showImportLoan = true;
    },
    closeModalImportLoan() {
      this.$refs.loanTabOne.refresh();
      this.showImportLoan = false;
    },

    openModalLoan() {
      this.modalRequest.show = true;
    },
    closeModalLoan(status) {
      // Just is a new loan
      if (status) {
        this.$store.commit("loans-store/ADD_ONE_RESEARCH");
      }

      this.modalRequest.show = false;
    }
  }
};
</script>

<style>
</style>
