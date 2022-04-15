import moment from "moment";

export default {
  namespaced: true,
  state: {
    year: moment().format("YYYY"),
    halfYear: true,
    percentApartment: "100.00",
    loading: false,
    moduleProgram: null,
  },
  getters: {
    year: (state) => state.year,
    halfYear: (state) => state.halfYear,
    percentApartment: (state) => state.percentApartment,
    loading: (state) => state.loading,
    moduleProgram: (state) => state.moduleProgram,
  },
  mutations: {
    SET_YEAR_COMMISSIONS(state, payload) {
      return (state.year = payload);
    },
    SET_HALF_YEAR_COMMISSIONS(state, payload) {
      return (state.halfYear = payload);
    },
    SET_PERCENT_APARTMENT_COMMISSIONS(state, payload) {
      return (state.percentApartment = payload);
    },
    SET_LOADING(state, payload) {
      return (state.loading = payload);
    },
    SET_MODULE_PROGRAM(state, payload) {
      return (state.moduleProgram = payload);
    },
  },
  actions: {},
};
