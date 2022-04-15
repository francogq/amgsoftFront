import GlobalServices from "../services/global.service";

export default {
  namespaced: true,
  state: {
    sellersCrm: {},
    capturedCrm: [],
    programs: {},
    sources: {},
    states: {},
    statusip: [
      { value: 0, text: "ALL" },
      { value: 1, text: "NO" },
      { value: 2, text: "YES" },
    ],
    status: [
      { value: 0, text: "ALL", variant: "" },
      { value: 1, text: "PENDING", variant: "warning" },
      { value: 2, text: "REVISION", variant: "primary" },
      { value: 3, text: "DESAPROVE", variant: "danger" },
      { value: 4, text: "APPROVED", variant: "success" },
      { value: 5, text: "SUPERVISOR", variant: "warning" },
    ],
  },
  getters: {
    getSellerEmpty(state) {
      return state.sellersCrm.empty();
    },
    getCapturedEmpty(state) {
      return state.capturedCrm === {};
    },
    programs(state) {
      return state.programs;
    },
  },
  mutations: {
    SET_SELLERS_CRM(state, sellersCrm) {
      state.sellersCrm = sellersCrm;
    },
    SET_CAPTURED_CRM(state, capturedCrm) {
      state.capturedCrm = capturedCrm;
    },
    // TODO Hacerlo global
    SET_PROGRAMS(state, programs) {
      state.programs = programs;
    },
    SET_SOURCES(state, sources) {
      state.sources = sources;
    },
    SET_STATES(state, states) {
      state.states = states;
    },
  },
  actions: {
    // eslint-disable-next-line consistent-return
    async A_GET_USERS_BY_MODULE({}, moduleId) {
      try {
        const params = {
          roles: "[]",
          type: "1",
        };
        const response = await GlobalServices.getUsersByModuleAndRoles(
          moduleId,
          params
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },

    async A_GET_HOUR_SYSTEM({}, body) {
      try {
        const response = await GlobalServices.getHourSystem(body);
        return response;
      } catch (error) {
        throw error;
      }
    },
    async getSellers({ commit }) {
      const sellers = await GlobalServices.getSellersCrm();
      const formatedSellers = sellers.map((seller) => ({
        value: seller.id,
        text: seller.user_name,
      }));
      commit("SET_SELLERS_CRM", formatedSellers);
    },
    async getCaptured({ commit }) {
      const captured = await GlobalServices.getCapturedCrm();
      const formatedCaptured = captured.map((cap) => ({
        value: cap.id,
        text: cap.user_name,
      }));
      commit("SET_CAPTURED_CRM", formatedCaptured);
    },
    // TODO Hacerlo global
    async getPrograms({ commit }) {
      const programs = await GlobalServices.getPrograms();
      const formatedPrograms = programs.map((pro) => ({
        value: pro.id,
        text: pro.name,
      }));
      commit("SET_PROGRAMS", formatedPrograms);
    },
    async getSources({ commit }) {
      const sources = await GlobalServices.getSources();
      const formatedSources = sources.map((source) => ({
        value: source.id,
        text: source.name,
      }));
      commit("SET_SOURCES", formatedSources);
    },
    async getStates({ commit }) {
      const states = await GlobalServices.getStates();
      const formatedStates = states.map((state) => ({
        value: state.slug,
        text: state.slug,
      }));
      commit("SET_STATES", formatedStates);
    },
  },
};
