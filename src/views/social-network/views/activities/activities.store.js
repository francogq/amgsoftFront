import ActivitiesService from '@/views/social-network/views/activities/activities.service'

const state = {
  S_TASKS: [],

}
const getters = {
  G_TASKS() {
    const tasks = state.S_TASKS
    return tasks
  },

}

const mutations = {
  SET_TASKS(state, states) {
    state.S_TASKS = states
  },

}
const actions = {
  async A_GET_TASKS({ commit }, params) {
    try {
      let TASKS = await ActivitiesService.getTask(params)
      TASKS = TASKS.data

      commit('SET_TASKS',

        TASKS)
      return TASKS
    } catch (error) {
      console.log('ERROR_GET_TASKS [ACTION]', error)
      throw error
    }
  },

}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,

}
