import Vue from "vue";
import Vuex from "vuex";
// Modules
import ecommerceStoreModule from "@/views/apps/e-commerce/eCommerceStoreModule";
import app from "@/store/app";
import appConfig from "@/store/app-config";
import verticalMenu from "@/store/vertical-menu";
import auth from "@/store/auth";
import CrmStore from "@/views/crm/store";
import saleMade from "@/views/crm/views/sales-made/sale-made.store";
import CommissionsStore from "@/views/commons/components/commissions/store";
import LoansStore from "@/views/commons/components/loans/store";
import GlobalStore from "@/views/store";
import stickyNotesStoreModule from "@/layouts/components/navbar/components/sticky-notes/store/sticky-notes.store";
import TaskStore from "@/store/task";
import NotificationStore from "@/store/notification";
import InventoryStore from "@/views/commons/components/inventory/store";
import NCRStore from "@/views/commons/components/ncr/store";
import UserStore from "@/store/user";
import ProfileStore from "@/store/profile";
import MessageStore from "@/store/message";
import SidebarStore from "@/store/sidebar";
import StandarStore from "@/store/global";

import SocialNetworkStore from "@/views/social-network/store";
import DebtSolutionStore from "@/views/debt-solution/store";
import SchedulesStore from "@/views/commons/components/schedules/store";

import ClientsStore from "@/views/commons/components/clients/store"
Vue.use(Vuex);

const initialState = {
  ecommerceStoreModule: { ...ecommerceStoreModule.state },
  CrmStore: { ...CrmStore.state },
  SocialNetworkStore: { ...SocialNetworkStore.state },
  DebtSolutionStore: { ...DebtSolutionStore.state },
  saleMade: { ...saleMade.state },
  CommissionsStore: { ...CommissionsStore.state },
  LoansStore: { ...LoansStore.state },
  GlobalStore: { ...GlobalStore.state },
  stickyNotesStoreModule: { ...stickyNotesStoreModule.state },
  TaskStore: { ...TaskStore.state },
  NotificationStore: { ...NotificationStore.state },
  InventoryStore: { ...InventoryStore.state },
  NCRStore: { ...NCRStore.state },
  UserStore: { ...UserStore.state },
  MessageStore: { ...MessageStore.state },
  SidebarStore: { ...SidebarStore.state },
  SchedulesStore: { ...SchedulesStore.state },
  ClientsStore: {...ClientsStore.state}
};

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    "app-ecommerce": ecommerceStoreModule,
    auth,
    "crm-store": saleMade,
    ...CrmStore,
    ...SocialNetworkStore,
    ...DebtSolutionStore,
    "commissions-store": CommissionsStore,
    "loans-store": LoansStore,
    "global-store": GlobalStore,
    StandarStore,
    TaskStore,
    "sticky-notes": stickyNotesStoreModule,
    "inventory-store": InventoryStore,
    "ncr-store": NCRStore,
    "clients-store":ClientsStore,
    NotificationStore,
    UserStore,
    ProfileStore,
    MessageStore,
    SidebarStore,
    SchedulesStore,
  },
  mutations: {
    resetState(state) {
      Object.keys(state).forEach((key) => {
        Object.assign(state[key], initialState[key]);
      });
    },
  },
  actions: {},
  state: {
    defaultRows: 50,
  },
  strict: process.env.DEV,
});
