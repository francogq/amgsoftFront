// IMPORT LIBRARIES
import Vue from "vue";

import crmService from "@/views/crm/services/crm.service";

const state = {
  S_LEADS: [],
  S_SN_LEADS: [],
  S_W_POTENTIAL_LEADS: [],
  S_SELECTED_LEADS: [],
  S_STATE_LEADS: [],
  S_STATUS_LEADS: [],
  S_SOURCE_LEADS: [],
  S_OWNERS: [],
  S_PROGRAMS: [],
  S_SOURCE_NAMES: [],
  S_STATES: [],
  S_EEUU_STATES: [],
  S_COUNTRIES: [],
  S_SELLERS: [],
  S_SMS_QUICKS: [],
  S_SMS_HISTORY_QUICKS: [],
  S_LEAD: {},
  S_FILTERS_LEADS: {
    searchQuery: "",
    from: null,
    to: null,
    statusLead: null,
    owner: null,
    assignTo: null,
    cr: null,
    program: null,
    sourceName: null,
    typeDoc: null,
    stAd: null,
    perPage: 10,
    currentPage: 1,
  },
};
const getters = {
  G_STATE_LEADS() {
    const stateLeads = state.S_STATE_LEADS.map((el) => ({
      label: el.name,
      value: el.id,
    }));
    return stateLeads;
  },
  G_STATUS_LEADS() {
    const statusLeads = state.S_STATUS_LEADS.map((el) => ({
      label: el.value,
      value: el.id,
    }));
    return statusLeads;
  },
  G_SOURCE_LEADS() {
    const sourceLeads = state.S_SOURCE_LEADS.map((el) => ({
      label: el.value,
      value: el.id,
    }));
    return sourceLeads;
  },
  G_OWNERS() {
    const owners = state.S_OWNERS.map((el) => ({
      label: el.user_name,
      value: el.id,
    }));
    return owners;
  },
  G_SOURCE_NAMES() {
    const sourceNames = state.S_SOURCE_NAMES.map((el) => ({
      label: el.name,
      value: el.id,
    }));
    return sourceNames;
  },
  G_PROGRAMS() {
    const programs = state.S_PROGRAMS.map((el) => ({
      label: el.value,
      value: el.id,
    }));
    return programs;
  },
  G_STATES() {
    const states = state.S_STATES.map((el) => ({
      label: el.slug,
      value: el.id,
    }));
    return states;
  },
  G_EEUU_STATES() {
    const eeuuStates = state.S_EEUU_STATES.map((el) => ({
      label: el.state,
      value: el.slug,
    }));
    return eeuuStates;
  },
  G_CRS() {
    return [
      { label: "All", value: null },
      { label: "Yes", value: 2 },
      { label: "No", value: 1 },
    ];
  },
  G_TYPE_DOCS() {
    return [
      { label: "All", value: null },
      { label: "SSN", value: "ssn" },
      { label: "ITIN", value: "itin" },
      { label: "CPN", value: "cpn" },
    ];
  },
  G_LANGUAGES() {
    return [
      { label: "English", value: "EN" },
      { label: "Spanish", value: "ES" },
    ];
  },
  G_COUNTRIES() {
    const countries = state.S_COUNTRIES.map((el) => ({
      label: el.name,
      value: el.id,
    }));
    return countries;
  },
  G_SELLERS() {
    const sellers = state.S_SELLERS.map((el) => ({
      label: el.user_name,
      value: el.id,
    }));
    return sellers;
  },
};
const mutations = {
  SET_DATA(state, params) {
    Vue.set(state, params.destination, params.data);
  },
  PUSH_DATA(state, params) {
    state[params.destination].push(params.data);
  },
  REMOVE_DATA(state, params) {
    const index = state[params.destination]
      .map((el) => el.id)
      .indexOf(params.id);
    if (index !== -1) {
      state[params.destination].splice(index, 1);
    }
  },
  M_STATUS_LEADS_CLIENT(state) {
    const statusLeadClient = { label: "client", value: 7 };
    state.S_STATUS_LEADS.push(statusLeadClient);
  },
};
const actions = {
  async A_GET_LEADS({ commit }, body) {
    try {
      const response = await crmService.getLeads(body);
      commit("SET_DATA", {
        destination: "S_LEADS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_LEADS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_SN_LEADS({ commit }, body) {
    try {
      const response = await crmService.getLeadsSn(body);
      commit("SET_DATA", {
        destination: "S_SN_LEADS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_SN_LEADS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_W_POTENTIAL_LEADS({ commit }, body) {
    try {
      const response = await crmService.getLeadsWPotential(body);
      commit("SET_DATA", {
        destination: "S_W_POTENTIAL_LEADS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_W_POTENTIAL_LEADS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_STATE_LEADS({ commit }, params) {
    try {
      const response = await crmService.getStateLeads(params);
      commit("SET_DATA", {
        destination: "S_STATE_LEADS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_STATE_LEADS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_STATUS_LEADS({ commit }, params) {
    try {
      const response = await crmService.getStatusLeads(params);
      commit("SET_DATA", {
        destination: "S_STATUS_LEADS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_STATUS_LEADS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_SOURCE_LEADS({ commit }, params) {
    try {
      const response = await crmService.getSourceLeads(params);
      commit("SET_DATA", {
        destination: "S_SOURCE_LEADS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_SOURCE_LEADS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_OWNERS({ commit }, { modul, body }) {
    try {
      const response = await crmService.getOwners({ modul, body });
      commit("SET_DATA", {
        destination: "S_OWNERS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_OWNERS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_PROGRAMS({ commit }, params) {
    try {
      const response = await crmService.getPrograms(params);
      commit("SET_DATA", {
        destination: "S_PROGRAMS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_PROGRAMS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_SOURCE_NAMES({ commit }, params) {
    try {
      const response = await crmService.getSourceNames(params);
      commit("SET_DATA", {
        destination: "S_SOURCE_NAMES",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_SOURCE_NAMES [ACTION]", error);
      throw error;
    }
  },
  async A_GET_STATES({ commit }, params) {
    try {
      const response = await crmService.getStates(params);
      commit("SET_DATA", {
        destination: "S_STATES",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_STATES [ACTION]", error);
      throw error;
    }
  },
  async A_GET_EEUU_STATES({ commit }, params) {
    try {
      const response = await crmService.getStatesEeuu(params);
      commit("SET_DATA", {
        destination: "S_EEUU_STATES",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_EEUU_STATES [ACTION]", error);
      throw error;
    }
  },
  async A_GET_COUNTRIES({ commit }, params) {
    try {
      const response = await crmService.getCountries(params);
      commit("SET_DATA", {
        destination: "S_COUNTRIES",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_COUNTRIES [ACTION]", error);
      throw error;
    }
  },
  async A_GET_SELLERS({ commit }, { modul, body }) {
    try {
      const response = await crmService.getSellers({ modul, body });
      commit("SET_DATA", {
        destination: "S_SELLERS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_SELLERS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_SMS_QUICKS({ commit }, body) {
    try {
      const response = await crmService.getAllQuicksSms(body);
      commit("SET_DATA", {
        destination: "S_SMS_QUICKS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_SMS_QUICKS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_HISTORY_SMS_LEADS({ commit }, body) {
    try {
      const response = await crmService.postHistorySmsLead(body);
      commit("SET_DATA", {
        destination: "S_SMS_HISTORY_QUICKS",
        data: response.data,
      });
      return response;
    } catch (error) {
      console.log("ERROR_GET_HISTORY_SMS_LEADS [ACTION]", error);
      throw error;
    }
  },

  /* SETS */

  A_SET_SELECTED_LEADS({ commit }, data) {
    commit("SET_DATA", {
      destination: "S_SELECTED_LEADS",
      data,
    });
  },
  A_SET_FILTERS_LEADS({ commit }, data) {
    commit("SET_DATA", {
      destination: "S_FILTERS_LEADS",
      data,
    });
  },
  async A_SET_LEADS({ commit }, body) {
    try {
      const response = await crmService.postCreateLead(body);
      if (response.status == 200 || response.status == 201) {
        body.id = response.data.id;
        commit("PUSH_DATA", {
          destination: "S_LEADS",
          data: body,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_GET_SMS_QUICKS [ACTION]", error);
      throw error;
    }
  },
  async A_SET_REQUEST_LEADS({ commit }, body) {
    try {
      const response = await crmService.postRequestLead(body);
      return response;
    } catch (error) {
      console.log("ERROR_GET_SMS_QUICKS [ACTION]", error);
      throw error;
    }
  },
  async A_SET_SMS_QUICK({ commit }, body) {
    try {
      const response = await crmService.postSaveQuickSms(body);
      if (response.status == 200) {
        body.id = response.data.id;
        commit("PUSH_DATA", {
          destination: "S_SMS_QUICKS",
          data: body,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_GET_SMS_QUICKS [ACTION]", error);
      throw error;
    }
  },

  /* DELETES */

  async A_DELETE_LEADS({ commit }, body) {
    try {
      const response = await crmService.postDeleteLead(body);
      if (response.status == 200) {
        commit("REMOVE_DATA", {
          destination: "S_LEADS",
          id: body.leadid,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_DELETE_LEADS [ACTION]", error);
      throw error;
    }
  },
  async A_DELETE_SMS_QUICK({ commit }, body) {
    try {
      const response = await crmService.postDeleteQuickSms(body);
      if (response.status == 200) {
        commit("REMOVE_DATA", {
          destination: "S_SMS_QUICKS",
          id: body.id,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_DELETE_SMS_QUICK [ACTION]", error);
      throw error;
    }
  },

  /* OTHER ACTIONS */

  async A_PROCESS_LEADS({ commit }, body) {
    try {
      const response = await crmService.postProcessLead(body);
      return response;
    } catch (error) {
      console.log("ERROR_PROCESS_LEADS [ACTION]", error);
      throw error;
    }
  },
  async A_UNIQUE_MOBILE({ commit }, body) {
    try {
      const response = await crmService.postUniqueMobile(body);
      return response;
    } catch (error) {
      console.log("ERROR_UNIQUE_MOBILE [ACTION]", error);
      throw error;
    }
  },
  async A_SEND_MESSAGE_LEAD({ commit }, body) {
    try {
      const response = await crmService.postSendMessageLead(body);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async A_GET_USER_APPOINTMENT_SN({ commit }, body) {
    try {
      const response = await crmService.postUserAppointmentSn(body);
      /* console.log('A_GET_USER_APPOINTMENT_SN response', response) */
      return response;
    } catch (error) {
      console.log("ERROR_GET_USER_APPOINTMENT_SN [ACTION]", error);
      throw error;
    }
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
