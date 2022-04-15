// IMPORT LIBRARIES
import Vue from 'vue'

import crmGlobal from '@/views/crm/services/global'

const state = {
  S_OWNERS: [],
  S_PROGRAMS: [],
  S_SOURCE_NAMES: [],
  S_STATES: [],
  S_EEUU_STATES: [],
  S_COUNTRIES: [],
  S_SELLERS: [],
}
const getters = {
  G_OWNERS() {
    const owners = state.S_OWNERS.map(el => ({
      label: el.user_name,
      value: el.id,
    }))
    return owners
  },
  G_SOURCE_NAMES() {
    const sourceNames = state.S_SOURCE_NAMES.map(el => ({
      label: el.name,
      id: el.id,
    }))
    return sourceNames
  },
  G_PROGRAMS() {
    const programs = state.S_PROGRAMS.map(el => ({
      label: el.name,
      id: el.id,
    }))
    return programs
  },
  G_STATES() {
    const states = state.S_STATES.map(el => ({
      label: el.slug,
      value: el.id,
    }))
    return states
  },
  G_EEUU_STATES() {
    const eeuuStates = state.S_EEUU_STATES.map(el => ({
      state: el.state,
      value: el.slug,
    }))
    return eeuuStates
  },
  G_CRS() {
    return [
      { label: 'All', value: null },
      { label: 'Yes', value: '2' },
      { label: 'No', value: '1' },
    ]
  },
  G_TYPE_DOCS() {
    return [
      { label: 'All', value: null },
      { label: 'SSN', value: 'ssn' },
      { label: 'ITIN', value: 'itin' },
      { label: 'CPN', value: 'cpn' },
    ]
  },
  G_LANGUAGES() {
    return [
      { label: 'English', value: 'EN' },
      { label: 'Spanish', value: 'ES' },
    ]
  },
  G_COUNTRIES() {
    const countries = state.S_COUNTRIES.map(el => ({
      label: el.name,
      id: el.id,
    }))
    return countries
  },
  G_SELLERS() {
    const sellers = state.S_SELLERS.map(el => ({
      label: el.user_name,
      id: el.id,
    }))
    return sellers
  },
}
const mutations = {
  SET_DATA(state, params) {
    Vue.set(state, params.destination, params.data)
  },
  PUSH_DATA(state, params) {
    state[params.destination].push(params.data)
  },
  REMOVE_DATA(state, params) {
    const index = state[params.destination]
      .map(el => el.id)
      .indexOf(params.id)
    if (index !== -1) {
      state[params.destination].splice(index, 1)
    }
  },
}
const actions = {
  async A_GET_OWNERS({ commit }, { modul, body }) {
    try {
      const response = await crmGlobal.getOwners({ modul, body })

      console.log(response)

      commit('SET_DATA', {
        destination: 'S_OWNERS',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_OWNERS [ACTION]', error)
      throw error
    }
  },
  async A_GET_PROGRAMS({ commit }, params) {
    try {
      const response = await crmGlobal.getPrograms(params)
      commit('SET_DATA', {
        destination: 'S_PROGRAMS',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_PROGRAMS [ACTION]', error)
      throw error
    }
  },
  async A_GET_SOURCE_NAMES({ commit }, params) {
    try {
      const response = await crmGlobal.getSourceNames(params)
      /* console.log('A_GET_SOURCE_NAMES response', response) */
      commit('SET_DATA', {
        destination: 'S_SOURCE_NAMES',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_SOURCE_NAMES [ACTION]', error)
      throw error
    }
  },
  async A_GET_STATES({ commit }, params) {
    try {
      const response = await crmGlobal.getStates(params)
      /* console.log('A_GET_STATES response', response) */
      commit('SET_DATA', {
        destination: 'S_STATES',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_STATES [ACTION]', error)
      throw error
    }
  },
  async A_GET_EEUU_STATES({ commit }, params) {
    try {
      const response = await crmGlobal.getStatesEeuu(params)
      /* console.log('A_GET_EEUU_STATES response', response) */
      commit('SET_DATA', {
        destination: 'S_EEUU_STATES',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_EEUU_STATES [ACTION]', error)
      throw error
    }
  },
  async A_GET_COUNTRIES({ commit }, params) {
    try {
      const response = await crmGlobal.getCountries(params)
      /* console.log('A_GET_COUNTRIES response', response) */
      commit('SET_DATA', {
        destination: 'S_COUNTRIES',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_COUNTRIES [ACTION]', error)
      throw error
    }
  },
  async A_GET_SELLERS({ commit }, { modul, body }) {
    try {
      const response = await crmGlobal.getSellers({ modul, body })
      /* console.log('A_GET_SELLERS response', response) */
      commit('SET_DATA', {
        destination: 'S_SELLERS',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_SELLERS [ACTION]', error)
      throw error
    }
  },

  /* SETS */

  /* DELETES */

  /* OTHER ACTIONS */

  async A_UNIQUE_MOBILE({ commit }, body) {
    try {
      const response = await crmGlobal.postUniqueMobile(body)
      /* console.log('A_UNIQUE_MOBILE response', response) */
      return response
    } catch (error) {
      console.log('ERROR_UNIQUE_MOBILE [ACTION]', error)
      throw error
    }
  },
  async A_GET_CREATES_SALE({ commit }, id) {
    try {
      const response = await crmGlobal.getCreatesSale(id)
      return response
    } catch (error) {
      console.log('ERROR_GET_CREATES_SALE [ACTION]', error)
      throw error
    }
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
