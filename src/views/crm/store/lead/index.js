// IMPORT LIBRARIES
import Vue from 'vue'

import crmLead from '@/views/crm/services/lead'
import mixins from '@/mixins/general'

const state = {
  S_LEADS: {
    items: [],
    total: 0,
    fromPage: 0,
    toPage: 0,
  },
  S_UPDATE_TABLE_LEAD: false,
  S_SN_LEADS: [],
  S_W_POTENTIAL_LEADS: [],
  S_SELECTED_LEADS: [],
  S_STATE_LEADS: [],
  S_STATUS_LEADS: [],
  S_SOURCE_LEADS: [],
  S_FILES_LEADS: [],
  S_TRAKING_STATUS_LEADS: [],
  S_DOCUMENT_LEAD: new Object(),
  S_USER_APPOINTEMENTS: [],
  S_LEAD: new Object(),
  S_LEAD_EDIT: new Object(),
  S_FILTERS_LEADS: {
    searchQuery: '',
    from: null,
    to: null,
    statusLead: null,
    owner: null,
    cr: null,
    program: null,
    sourceName: null,
    typeDoc: null,
    stAd: null,
    perPage: 10,
    currentPage: 1,
  },
  S_KEY_UPDATE_DETAILS_LEAD: 0,
  S_FILTER_DATA_LOADED: false
}
const getters = {
  G_UPDATE_TABLE_LEAD() {
    return state.S_UPDATE_TABLE_LEAD
  },
  G_STATE_LEADS(state) {
    const stateLeads = state.S_STATE_LEADS.map(el => ({
      label: el.name,
      id: el.id,
    }))
    return stateLeads
  },
  G_STATUS_LEADS(state) {
    const statusLeads = state.S_STATUS_LEADS.map(el => ({
      label: el.value,
      id: el.id,
    }))
    return statusLeads
  },
  G_STATUS_LEADS_S() {
    const statusLeads = state.S_STATUS_LEADS.map(el => ({
      text: el.value,
      value: { value: el.value, id: el.id },
    }))
    return statusLeads
  },
  G_SOURCE_LEADS() {
    const sourceLeads = state.S_SOURCE_LEADS.map(el => ({
      label: el.value,
      id: el.id,
    }))
    return sourceLeads
  },
}
const mutations = {
  SET_UPDATE_TABLE_LEAD(state, params) {
    state.S_UPDATE_TABLE_LEAD = params
  },
  SET_DATA(state, params) {
    Vue.set(state, params.destination, params.data)
  },
  PUSH_DATA(state, params) {
    state[params.destination].push(params.data)
  },
  UNSHIFT_LEADS_DATA(state, params) {
    state[params.destination].items.unshift(params.data)
    state[params.destination].total++
  },
  REMOVE_DATA(state, params) {
    const index = state[params.destination]
      .map(el => el.id)
      .indexOf(params.id)
    if (index !== -1) {
      state[params.destination].splice(index, 1)
    }
  },
  REMOVE_LEAD_DATA(state, params) {
    const index = state[params.destination].items
      .map(el => el.id)
      .indexOf(params.id)
    if (index !== -1) {
      state[params.destination].items.splice(index, 1)
      state[params.destination].total--
    }
  },
  PROCESS_DATA(state, params) {
    const index = state[params.destination].items
      .map(el => el.id)
      .indexOf(params.id)
    if (index !== -1) {
      state[params.destination].items[index].status_sn_id = 3
    }
  },
  UPDATE_DATA(state, params) {
    for (const key in state[params.destination]) {
      if (params.data[key] && key !== 'id') {
        state[params.destination][key] = params.data[key]
      }
    }
  },
  M_STATUS_LEADS_CLIENT(state) {
    const statusLeadClient = { value: 'Client', id: 7 }
    state.S_STATUS_LEADS.push(statusLeadClient)
  },
  M_KEY_UPDATE_DETAILS_LEAD(state) {
    state.S_KEY_UPDATE_DETAILS_LEAD++
  },
  SET_DATA_LEAD_EDIT(state, payload) {
    state.S_LEAD_EDIT = payload
    Vue.set(state.S_LEAD_EDIT, 'state_lead', payload.state_lead)
  },

  M_SET_ACTIONS_STATUS_POTENTIAL(state, params) {
    state.S_W_POTENTIAL_LEADS.find(
        (lead) => lead.lead_id == params.lead_id
    ).status_potential = params.status_potential
  },
}
const actions = {
  async A_GET_LEADS({ commit }, body) {
    try {
      const response = await crmLead.getLeads(body)
      /* console.log('A_GET_LEADS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        const selectedIds = state.S_SELECTED_LEADS.map(el => el.id)
        let index = 0
        while (selectedIds.length > 0 && index < response.data.data.length) {
          if (selectedIds.includes(response.data.data[index].id)) {
            const { id } = response.data.data[index]
            response.data.data[index].selected = true
            const deleted = selectedIds.findIndex(s => s === id)
            if (deleted !== -1) selectedIds.splice(deleted, 1)
          }
          index += 1
        }
        const data = {
          items: response.data.data,
          total: response.data.total,
          fromPage: response.data.from,
          toPage: response.data.to,
        }
        commit('SET_DATA', {
          destination: 'S_LEADS',
          data,
        })
      }
      return response.data
    } catch (error) {
      console.log('ERROR_GET_LEADS [ACTION]', error)
      throw error
    }
  },
  async A_GET_LEAD({ commit }, { id, params }) {
    try {
      const response = await crmLead.getLead(id, params)
      /* console.log('A_GET_LEAD response', response) */
      commit('SET_DATA', {
        destination: 'S_LEAD',
        data: response[0],
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_LEAD [ACTION]', error)
      throw error
    }
  },
  async A_GET_LEAD_EDIT({ commit }, { id, params }) {
    try {
      const response = await crmLead.getLeadEdit(id, params)
      /* console.log('A_GET_LEAD_EDIT response', response) */
      commit('SET_DATA_LEAD_EDIT', response[0])
      return response
    } catch (error) {
      console.log('ERROR_GET_LEAD_EDIT [ACTION]', error)
      throw error
    }
  },
  async A_GET_SN_LEADS({ commit }, body) {
    try {
      const response = await crmLead.getLeadsSn(body)
      /* console.log('A_GET_SN_LEADS response', response) */
      commit('SET_DATA', {
        destination: 'S_SN_LEADS',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_SN_LEADS [ACTION]', error)
      throw error
    }
  },
  async A_GET_W_POTENTIAL_LEADS({ commit }, body) {
    try {
      const response = await crmLead.getLeadsWPotential(body)
      commit('SET_DATA', {
        destination: 'S_W_POTENTIAL_LEADS',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_W_POTENTIAL_LEADS [ACTION]', error)
      throw error
    }
  },
  async A_GET_STATE_LEADS({ commit }, params) {
    try {
      const response = await crmLead.getStateLeads(params)
      /* console.log('A_GET_STATE_LEADS response', response) */
      commit('SET_DATA', {
        destination: 'S_STATE_LEADS',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_STATE_LEADS [ACTION]', error)
      throw error
    }
  },
  async A_GET_STATUS_LEADS({ commit }, params) {
    try {
      const response = await crmLead.getStatusLeads(params)
      /* console.log('A_GET_STATUS_LEADS response', response) */
      commit('SET_DATA', {
        destination: 'S_STATUS_LEADS',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_STATUS_LEADS [ACTION]', error)
      throw error
    }
  },
  async A_GET_SOURCE_LEADS({ commit }, params) {
    try {
      const response = await crmLead.getSourceLeads(params)
      /* console.log('A_GET_SOURCE_LEADS response', response) */
      commit('SET_DATA', {
        destination: 'S_SOURCE_LEADS',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_SOURCE_LEADS [ACTION]', error)
      throw error
    }
  },
  async A_GET_FILES_LEADS({ commit }, body) {
    try {
      const response = await crmLead.postSearchFileLead(body)
      /* console.log('A_GET_FILES_LEADS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        response.data.map(el => {
          el.isDisabled = true
        })
        commit('SET_DATA', {
          destination: 'S_FILES_LEADS',
          data: response.data,
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_GET_FILES_LEADS [ACTION]', error)
      throw error
    }
  },
  async A_GET_LEAD_DOCUMENT({ commit }, body) {
    try {
      const response = await crmLead.getLeadDocument(body)
      /* console.log('A_GET_LEAD_DOCUMENT response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        commit('SET_DATA', {
          destination: 'S_DOCUMENT_LEAD',
          data: response.data[0],
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_GET_LEAD_DOCUMENTS [ACTION]', error)
      throw error
    }
  },

  async A_GET_TRAKING_STATUS_LEADS({ commit }, body) {
    try {
      const response = await crmLead.getTrakingStatusLeads(body)
      commit('SET_DATA', {
        destination: 'S_TRAKING_STATUS_LEADS',
        data: response.data,
      })
      return response
    } catch (error) {
      console.log('ERROR_GET_TRAKING_STATUS_LEADS [ACTION]', error)
      throw error
    }
  },

  /* SETS */
  A_SET_UPDATE_TABLE_LEAD({ commit }, data) {
    commit("SET_UPDATE_TABLE_LEAD", data)
  },
  A_SET_SELECTED_LEADS({ commit }, data) {
    commit('SET_DATA', {
      destination: 'S_SELECTED_LEADS',
      data,
    })
  },
  A_SET_FILTERS_LEADS({ commit }, data) {
    commit('SET_DATA', {
      destination: 'S_FILTERS_LEADS',
      data,
    })
  },
  async A_SET_LEADS({ commit }, body) {
    try {
      const response = await crmLead.postCreateLead(body);
      body.state_hour = body.state

      for (let i = 0; i < body.program.length; i++) {
        switch (body.program[i].value) {
          case "Business":
            body.program[i] = {
              ...body.program[i],
              ...{ logo: `/images/logos/logo-${'bu'}.png` }
            }
            break
          case "Boost Credit":
            body.program[i] = {
              ...body.program[i],
              ...{ logo: `/images/logos/logo-${'bc'}.png` }
            }
            break
          case "Credit Experts":
            body.program[i] = {
              ...body.program[i],
              ...{ logo: `/images/logos/logo-${'ce'}.png` }
            }
            break
          case "Debt Solution":
            body.program[i] = {
              ...body.program[i],
              ...{ logo: `/images/logos/logo-${'ds'}.png` }
            }
            break
          case "Tax Research":
            body.program[i] = {
              ...body.program[i],
              ...{ logo: `/images/logos/logo-${'tr'}.png` }
            }
            break
          default:
            body.program[i] = {
              ...body.program[i],
              ...{ logo: "" }
            }
            break
        }
      }


      body.programs = JSON.stringify(body.program)
      console.log(body)
      if (mixins.methods.isResponseSuccess(response)) {
        body.id = response.data.id
        commit('UNSHIFT_LEADS_DATA', {
          destination: 'S_LEADS',
          data: body,
        });
        // commit("SET_UPDATE_TABLE_LEAD",true)
      }
      return response
    } catch (error) {
      console.log('ERROR_SET_LEADS [ACTION]', error)
      throw error
    }
  },

  async A_SET_REQUEST_LEADS({ commit }, body) {
    try {
      const response = await crmLead.postRequestLead(body)
      /* console.log('A_SET_REQUEST_LEADS response', response) */
      return response
    } catch (error) {
      console.log('ERROR_SET_REQUEST_LEADS [ACTION]', error)
      throw error
    }
  },
  async A_SET_FILE_LEAD({ commit }, body) {
    try {
      const response = await crmLead.postFileLead(body)
      /* console.log('A_SET_FILE_LEAD response', response) */
      return response
    } catch (error) {
      console.log('ERROR_SET_FILE_LEAD [ACTION]', error)
      throw error
    }
  },

  /* UPDATE */

  async A_UPDATE_FILE_NAME_LEAD({ commit }, body) {
    try {
      const response = await crmLead.postFileNameLead(body)
      /* console.log('A_UPDATE_FILE_NAME_LEAD response', response) */
      return response
    } catch (error) {
      console.log('ERROR_UPDATE_FILE_NAME_LEAD [ACTION]', error)
      throw error
    }
  },
  async A_UPDATE_FIELDS_LEAD({ commit }, body) {
    try {
      const response = await crmLead.putFieldsLead(body)
      /* console.log('A_UPDATE_FIELDS_LEAD response', response) */
      return response
    } catch (error) {
      console.log('ERROR_UPDATE_FIELDS_LEAD [ACTION]', error)
      throw error
    }
  },
  async A_UPDATE_LEAD({ commit }, { id, body }) {
    try {
      const response = await crmLead.putLead(id, body)
      /* console.log('A_UPDATE_LEAD response', response) */
      commit('UPDATE_DATA', {
        destination: 'S_LEAD',
        data: body,
      })
      return response
    } catch (error) {
      console.log('ERROR_UPDATE_LEAD [ACTION]', error)
      throw error
    }
  },

  /* DELETES */

  async A_DELETE_LEADS({ commit }, body) {
    try {
      const response = await crmLead.postDeleteLead(body)

      commit('REMOVE_LEAD_DATA', {
        destination: 'S_LEADS',
        id: body.lead_id,
      })
      return response
    } catch (error) {
      console.log('ERROR_DELETE_LEADS [ACTION]', error)
      throw error
    }
  },

  async A_DELETE_FILES_LEADS({ commit }, body) {
    try {
      const response = await crmLead.deleteFileLead(body)
      /* console.log('A_DELETE_FILES_LEADS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        commit('REMOVE_DATA', {
          destination: 'S_FILES_LEADS',
          id: body.file_id,
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_DELETE_FILES_LEADS [ACTION]', error)
      throw error
    }
  },

  /* OTHER ACTIONS */

  async A_PROCESS_LEADS({ commit }, body) {
    try {
      const response = await crmLead.postProcessLead(body)
      /* console.log('A_PROCESS_LEADS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        commit('PROCESS_DATA', {
          destination: 'S_LEADS',
          id: body.lead_id,
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_PROCESS_LEADS [ACTION]', error)
      throw error
    }
  },
  async A_GET_USER_APPOINTMENT_SN({ commit }, body) {
    try {
      const response = await crmLead.postUserAppointmentSn(body)
      /* console.log('A_GET_USER_APPOINTMENT_SN response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        response.data.map(el => {
          (el.label = body.taskForSn
            ? el.user_name
            : `${el.user_name} (${el.count_task}) ${el.disabled > 0 ? '(Not Available)' : ''
            }`),
            (el.value = el.id),
            (el.itemDisabled = el.disabled > 0)
        })
        commit('SET_DATA', {
          destination: 'S_USER_APPOINTEMENTS',
          data: response.data,
        })
      }
      return response
    } catch (error) {
      console.log('ERROR_GET_USER_APPOINTMENT_SN [ACTION]', error)
      throw error
    }
  },
  async A_LEAD_PAYMENT({ commit }, body) {
    try {
      const response = await crmLead.postLeadPayment(body)
      /* console.log('A_LEAD_PAYMENT response', response) */
      return response
    } catch (error) {
      console.log('ERROR_LEAD_PAYMENT [ACTION]', error)
      throw error
    }
  },
  async A_MY_LIST_CREATE({ commit }, body) {
    try {
      const response = await crmLead.postMyListCreate(body)
      /* console.log('A_MY_LIST_CREATE response', response) */
      return response
    } catch (error) {
      console.log('ERROR_MY_LIST_CREATE [ACTION]', error)
      throw error
    }
  },
  async A_SET_POTENTIAL({ commit }, body) {
    try {
      const response = await crmLead.postSetPotential(body)
      return response
    } catch (error) {
      console.log('ERROR_SET_POTENTIAL [ACTION]', error)
      throw error
    }
  },
  async A_CHANGE_STATUS_SN({ commit }, body) {
    try {
      const response = await crmLead.postChangeStatusSn(body)
      /* console.log('A_CHANGE_STATUS_SN response', response) */
      return response
    } catch (error) {
      console.log('ERROR_CHANGE_STATUS_SN [ACTION]', error)
      throw error
    }
  },
  async A_VALID_UNIQUE_SSN({ commit }, body) {
    try {
      const response = await crmLead.postUniquesSsn(body)
      /* console.log('A_VALID_UNIQUE_SSN response', response) */
      return response
    } catch (error) {
      console.log('ERROR_VALID_UNIQUE_SSN [ACTION]', error)
      throw error
    }
  },
  async A_VALID_UNIQUE_ITIN({ commit }, body) {
    try {
      const response = await crmLead.postUniquesItin(body)
      /* console.log('A_VALID_UNIQUE_ITIN response', response) */
      return response
    } catch (error) {
      console.log('ERROR_VALID_UNIQUE_ITIN [ACTION]', error)
      throw error
    }
  },
  async A_VALID_UNIQUE_CPN({ commit }, body) {
    try {
      const response = await crmLead.postUniquesCpn(body)
      /* console.log('A_VALID_UNIQUE_CPN response', response) */
      return response
    } catch (error) {
      console.log('ERROR_VALID_UNIQUE_CPN [ACTION]', error)
      throw error
    }
  },
  async A_GET_ALL_TRAKING_FIELDS_LEAD({ commit }, body) {
    try {
      const response = await crmLead.postAllTrackingChangeLeads(body)
      return response
    } catch (error) {
      console.log('ERROR_GET_ALL_TRAKING_FIELDS_LEAD [ACTION]', error)
      throw error
    }
  },
  async A_GET_LEAD_SEND_REQUEST({ commit }, body) {
    try {
      const response = await crmLead.getLeadSendRequest(body)
      return response
    } catch (error) {
      console.log('ERROR_GET_ALL_TRAKING_FIELDS_LEAD [ACTION]', error)
      throw error
    }
  },
  async A_ADD_SELLER_LIST({ commit }, body) {
    try {
      const response = await crmLead.createSellerList(body)
      return response
    } catch (error) {
      throw error
    }
  },
  async A_EXPORT_LEADS_TO_EXCEL({ commit }, body) {
    try {
      const response = await crmLead.exportLeadsToExcel(body)
      return response
    } catch (error) {
      throw error
    }
  },

  async A_UPDATE_STATUS_POTENTIAL_SN({ commit }, body) {
    try {
      const response = await crmLead.updateStatusPotentialSn(body)
      return response
    } catch (error) {
      console.log('ERROR_UPDATE_STATUS_POTENTIAL_SN [ACTION]', error)
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
