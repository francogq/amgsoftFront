import navMenuItems from "@/navigation/vertical";
import LoansService from "@/views/commons/components/loans/services/loans.service";
import GeneralMixins from "@/mixins/general";
import store from "@/store";

export default {
  namespaced: true,
  state: {
    S_SIDEBAR_ITEMS: navMenuItems,
  },
  getters: {},
  mutations: {
    UPDATE_SIDEBAR_ITEM_PROPERTY(state, payload) {
      // eslint-disable-next-line array-callback-return
      state.S_SIDEBAR_ITEMS.map((item) => {
        if (item?.route === payload.routeName) {
          // eslint-disable-next-line no-param-reassign
          item.tag = payload.tag;
        }
      });
    },
    async M_UPDATE_COUNTER_LOANS(
      state,
      payload = { module: 2, role: 1, userId: 1 }
    ) {
      const [loanNav] = state.S_SIDEBAR_ITEMS.filter(
        (nav) => nav.title === "Loans"
      );
      // eslint-disable-next-line no-nested-ternary
      const statusShow =
        payload.module === 16
          ? 4
          : payload.module === 17
          ? 3
          : payload.role === 2 || payload.role === 1
          ? 2
          : 0;
      const [response] = await LoansService.getCounterLoan({
        page: 1,
        type: statusShow,
        id_module: payload.module,
        status: 1,
      });
      loanNav.tag = response.counter;
    },
    async M_UPDATE_COUNTER_NCR(
      state,
      payload = { module: 2, role: 1, userId: 1 }
    ) {
      const [ncrNav] = state.S_SIDEBAR_ITEMS.filter((nav) =>
        nav.title ? nav.title === "NCR" : false
      );
      if (payload.role !== 1) {
        const response = await window.amgApi.post(
          "/lead/ncr/ncr-leads-count-in-process",
          {
            user_id: payload.userId,
            modul: payload.module,
          }
        );
        if (GeneralMixins.methods.isResponseSuccess(response)) {
          const { total } = response.data[0];
          if (total > 99) {
            ncrNav.tag = "+99";
          } else {
            ncrNav.tag = total;
          }
        }
      } else {
        ncrNav.tag = 0;
      }
    },
    async M_UPDATE_COUNTER_SCHEDULES(
      state,
      payload = { module: 2, role: 1, userId: 1 }
    ) {
      const [schedulesNav] = state.S_SIDEBAR_ITEMS.filter(
        (nav) => nav.title === "Schedules"
      );
      if (payload.role === 1 || payload.role === 2 || payload.role === 1) {
        const params = { moduleid: payload.module };
        const response = await window.amgApi.post(
          "/schedules/get-all-counters",
          params
        );
        if (GeneralMixins.methods.isResponseSuccess(response)) {
          schedulesNav.tag = response.data.grandTotal;
          await store.dispatch(
            "SchedulesStore/A_SET_COUNTERS_TABS_SCHEDULES",
            response.data
          );
        }
      } else {
        schedulesNav.tag = 0;
      }
    },
  },
  actions: {
    A_UPDATE_COUNTERS({ commit }, payload = { module: 2, role: 1, userId: 1 }) {
      if (payload.module === 2) {
        commit("M_UPDATE_COUNTER_LOANS", payload);
        commit("M_UPDATE_COUNTER_NCR", payload);
        commit("M_UPDATE_COUNTER_SCHEDULES", payload);
      }
    },
  },
};
