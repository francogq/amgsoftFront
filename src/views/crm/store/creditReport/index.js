// IMPORT LIBRARIES
import Vue from 'vue'

import creditReport from '@/views/crm/services/creditReport'
import mixins from '@/mixins/general'

const state = {
  S_CREDIT_REPORTS: [],
  S_CREDIT_REPORT_PENDINGS: [],
  S_CREDIT_REPORT: {},
}
const getters = {
  G_CREDIT_REPORTS () {
    /* const stateLeads = state.S_STATE_LEADS.map(el => ({ label: el.name, value: el.id }))
    return stateLeads */
  },
}
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
  },
  UPDATE_DATA (state, params) {
    const index = state[params.destination].map(el => el.id).indexOf(params.data.id)
    if (index !== -1) {
      for (let key in params.data) {
        state[params.destination][index][key] = params.data[key]
      }
    }
  }
}
const actions = {
  async A_GET_CREDIT_REPORTS ({ commit }, body) {
    try {
      const response = await creditReport.getCreditReport(body)
      /* console.log('A_GET_CREDIT_REPORTS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        commit('SET_DATA', {
          destination: 'S_CREDIT_REPORTS',
          data: response.data
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_GET_CREDIT_REPORTS [ACTION]', error)
      throw error
    }
  },
  async A_GET_CREDIT_REPORT_PENDINGS ({ commit }, body) {
    try {
      const response = await creditReport.getCreditReportPendings(body)
      /* console.log('A_GET_CREDIT_REPORT_PENDINGS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        response.data.map((el) => {
          el.attemps_count = el.attemps == null ? '' : JSON.parse(el.attemps).length
        })
        commit('SET_DATA', {
          destination: 'S_CREDIT_REPORT_PENDINGS',
          data: response.data
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_GET_CREDIT_REPORT_PENDINGS [ACTION]', error)
      throw error
    }
  },
  async A_COUNT_CREDIT_REPORT_PENDINGS ({ commit }, body) {
    try {
      const response = await creditReport.countCreditReportPendings(body)
      /* console.log('A_COUNT_CREDIT_REPORT_PENDINGS response', response) */
      return response
    } catch (error) {
      console.log('ERROR_COUNT_CREDIT_REPORT_PENDINGS [ACTION]', error)
      throw error
    }
  },

  /* SETS */
  
  /* UPDATES */
  
  /* DELETES */
  
  /* OTHER ACTIONS */
  
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations

}
