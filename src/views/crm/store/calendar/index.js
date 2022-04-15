// IMPORT LIBRARIES
import Vue from 'vue'

import CalendarService from '@/views/crm/services/calendar'
import mixins from '@/mixins/general'

const state = {
  S_CALENDARS: [],
}
const getters = {}
const mutations = {
  SET_DATA(state, params) {
    Vue.set(state, params.destination, params.data)
  },
  PUSH_DATA(state, params) {
    state[params.destination].push(params.data)
  },
  UNSHIFT_DATA(state, params) {
    state[params.destination].unshift(params.data)
  },
  REMOVE_DATA(state, params) {
    const index = state[params.destination].map(el => el.id).indexOf(params.id)
    if (index !== -1) {
      state[params.destination].splice(index, 1)
    }
  },
}
const actions = {
  async A_GET_CALENDARS({ commit }, body) {
    try {
      const response = await CalendarService.filterMonthNext(body)
      /* console.log('A_GET_CALENDARS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        commit('SET_DATA', {
          destination: 'S_CALENDARS',
          data: response.data,
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_GET_CALENDARS [ACTION]', error)
      throw error
    }
  },
  async A_GET_CALENDARS_TASK({ commit }, body) {
    try {
      const response = await CalendarService.filterMonthNextTask(body)
      /* console.log('A_GET_CALENDARS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        commit('SET_DATA', {
          destination: 'S_CALENDARS',
          data: response.data,
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_GET_CALENDARS [ACTION]', error)
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
