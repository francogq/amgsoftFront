// IMPORT LIBRARIES
import Vue from 'vue'

import CreditCardService from '@/views/crm/services/creditCard'
import mixins from '@/mixins/general'

const state = {
  S_CREDIT_CARDS: [],
  CARDS_UPDATE:null
}
const getters = {
  LISTCARDS: (state) => state.CARDS_UPDATE,
}
const mutations = {
  SET_DATA_UPDATED(state,params){
    state.CARDS_UPDATE = params
  },
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
  SET_DATA_CARDS_UPDATE({commit},params){
    commit('SET_DATA_UPDATED',params)
  },
  async A_GET_CREDIT_CARD ({ commit }, body) {
    try {
      const response = await CreditCardService.getCreditCard(body)
      /* console.log('A_GET_CREDIT_CARD response', response) */
      return response
    } catch (error) {
      console.log('ERROR_GET_CREDIT_CARD [ACTION]', error)
      throw error
    }
  },

  async A_GET_ORIGINAL_TARGET ({ commit }, body) {
    try {
      const response = await CreditCardService.getOriginalTarget(body)
      /* console.log('A_GET_ORIGINAL_TARGET response', response) */
      return response
    } catch (error) {
      console.log('ERROR_GET_ORIGINAL_TARGET [ACTION]', error)
      throw error
    }
  },

  async A_SET_CREDIT_CARD ({ commit }, body) {
    try {
      const response = await CreditCardService.createCreditCard(body)
      /* console.log('A_SET_CREDIT_CARD response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        body.id = response.data.id
        commit('UNSHIFT_DATA', {
          destination: 'S_CREDIT_CARDS',
          data: body
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_SET_CREDIT_CARD [ACTION]', error)
      throw error
    }
  },

  async A_DELETE_CREDIT_CARD ({ commit }, body) {
    try {
      const response = await CreditCardService.deleteCreditCard(body)
      /* console.log('A_DELETE_CREDIT_CARD response', response) */
      return response
    } catch (error) {
      console.log('ERROR_DELETE_CREDIT_CARD [ACTION]', error)
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
