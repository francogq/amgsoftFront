export default {
  namespaced: true,
  state: {
    S_COUNTER_OVERTIME: 0,
    S_COUNTER_OVERTIME_DONE: 0,
    S_COUNTER_OVERTIME_ACCOUNT: 0,
    S_COUNTER_JUSTIFICATIONS: 0,
    S_COUNTER_JUSTIFICATIONS_DONE: 0,
    S_COUNTER_JUSTIFICATIONS_ACCOUNT: 0,
  },
  getters: {

  },
  mutations: {
    M_SET_COUNTER_OVERTIME(state, payload = { totalOver: 0, doneOver: 0, accountOver: 0 }) {
      state.S_COUNTER_OVERTIME = payload.totalOver
      state.S_COUNTER_OVERTIME_DONE = payload.doneOver
      state.S_COUNTER_OVERTIME_ACCOUNT = payload.accountOver
    },
    M_SET_COUNTER_JUSTIFICATIONS(state, payload = { totalJus: 0, doneJus: 0, accountJus: 0 }) {
      state.S_COUNTER_JUSTIFICATIONS = payload.totalJus
      state.S_COUNTER_JUSTIFICATIONS_DONE = payload.doneJus
      state.S_COUNTER_JUSTIFICATIONS_ACCOUNT = payload.accountJus
    },
  },
  actions: {
    A_SET_COUNTERS_TABS_SCHEDULES({ commit }, payload = {
      totalOver: 0, doneOver: 0, accountOver: 0, totalJus: 0, doneJus: 0, accountJus: 0,
    }) {
      commit('M_SET_COUNTER_OVERTIME', payload)
      commit('M_SET_COUNTER_JUSTIFICATIONS', payload)
    },
  },
}
