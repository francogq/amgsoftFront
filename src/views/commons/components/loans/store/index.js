import loansService from '@/views/commons/components/loans/services/loans.service'

export default {
  namespaced: true,
  state: {
    researchLoans: 0,
    counterTab: [],
    modalRequest: {
      show: false,
      idLoan: null,
      tab: null,
    },
  },
  getters: {
    researchLoans: state => state.researchLoans,
    modalRequest: state => state.modalRequest,
    counterTab: state => state.counterTab,
  },
  mutations: {
    ADD_ONE_RESEARCH(state) {
      // plus one
      state.researchLoans += 1
    },
    SET_COUNTER_TAB(state, payload) {
      state.counterTab = payload
    },
  },
  actions: {
    async loadCounterTab({ commit, rootState }) {
      const params = {
        id_user: rootState.auth.currentUser.user_id,
        id_module: rootState.auth.currentUser.modul_id,
      }
      const response = await loansService.getCounterLoanTab(params)
      commit('SET_COUNTER_TAB', response[0])

      return response
    },
  },
}
