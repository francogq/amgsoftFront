// IMPORT LIBRARIES
import Vue from 'vue'

import CallService from '@/views/crm/services/call'
import mixins from '@/mixins/general'

const state = {
  S_CALLS: [],
}
const getters = {}
const mutations = {
  SET_DATA (state, params) {
    Vue.set(state, params.destination, params.data)
  },
  PUSH_DATA (state, params) {
    state[params.destination].push(params.data)
  },
  UNSHIFT_DATA (state, params) {
    state[params.destination].unshift(params.data)
  },
  REMOVE_DATA (state, params) {
    const index = state[params.destination].map(el => el.id).indexOf(params.id)
    if (index !== -1) {
      state[params.destination].splice(index, 1)
    }
  }
}
const actions = {
  async A_GET_CALLS ({ commit }, body) {
    try {
      const response = await CallService.getCalls(body)
      /* console.log('A_GET_CALLS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        commit('SET_DATA', {
          destination: 'S_CALLS',
          data: response.data
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_GET_CALLS [ACTION]', error)
      throw error
    }
  },
  async A_SET_CALL ({ commit }, body) {
    try {
      const response = await CallService.postCall(body)
      /* console.log('A_SET_CALL response', response) */
      if (mixins.methods.isResponseSuccess(response) && body.limit !== -1) {
        body.id = response.data.id
        commit('UNSHIFT_DATA', {
          destination: 'S_CALLS',
          data: body
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_SET_CALL [ACTION]', error)
      throw error
    }
  },
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations

}
