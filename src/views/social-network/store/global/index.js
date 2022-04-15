// IMPORT LIBRARIES
import Vue from 'vue'

import socialNetworkService from '@/views/social-network/services/social-network.service'

const state = {
  S_PROGRAMS: [],
  S_STATES: [],

}
const getters = {
  G_PROGRAMS() {
    const programs = state.S_PROGRAMS.map(el => ({ label: el.value, id: el.id }))
    return programs
  },
  G_STATES() {
    const states = state.S_STATES.map(el => ({ label: el.state, value: el.id }))

    return states
  },

}

const mutations = {
  SET_STATES(state, states) {
    state.S_STATES = states
  },
  SET_PROGRAMS(state, programs) {
    state.S_PROGRAMS = programs
  },
  PUSH_DATA(state, params) {
    state[params.destination].push(params.data)
  },
  REMOVE_DATA(state, params) {
    const index = state[params.destination].map(el => el.id).indexOf(params.id)
    if (index !== -1) {
      state[params.destination].splice(index, 1)
    }
  },
}
const actions = {
  async A_GET_PROGRAMS({ commit }, params) {
    try {
      let programs = await socialNetworkService.getPrograms(params)
      programs = programs.data

      commit('SET_PROGRAMS',

        programs)
      return programs
    } catch (error) {
      console.log('ERROR_GET_PROGRAMS [ACTION]', error)
      throw error
    }
  },
  async A_GET_STATES({ commit }, params) {
    try {
      let states = await socialNetworkService.getStates(params)
      states = states.data

      commit('SET_STATES',

        states)

      return states
    } catch (error) {
      console.log('ERROR_GET_STATES [ACTION]', error)
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
