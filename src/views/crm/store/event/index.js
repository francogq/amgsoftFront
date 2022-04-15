// IMPORT LIBRARIES
import Vue from "vue";

import eventService from "@/views/crm/services/event";
import mixins from "@/mixins/general";

const state = {
  S_EVENTS: [],
  S_EVENT: {},
};
const getters = {
  G_EVENTS() {
    /* const stateLeads = state.S_STATE_LEADS.map(el => ({ label: el.name, value: el.id }))
    return stateLeads */
  },
  G_EVENT_TITLES() {
    return [
      { label: "TEL", value: "TEL" },
      { label: "CN", value: "CN" },
    ];
  },
};
const mutations = {
  SET_DATA(state, params) {
    Vue.set(state, params.destination, params.data);
  },
  PUSH_DATA(state, params) {
    state[params.destination].push(params.data);
  },
  UNSHIFT_DATA(state, params) {
    state[params.destination].unshift(params.data);
  },
  REMOVE_DATA(state, params) {
    const index = state[params.destination]
      .map((el) => el.id)
      .indexOf(params.id);
    if (index !== -1) {
      state[params.destination].splice(index, 1);
    }
  },
  UPDATE_DATA(state, params) {
    const index = state[params.destination]
      .map((el) => el.id)
      .indexOf(params.data.id);
    if (index !== -1) {
      for (let key in params.data) {
        state[params.destination][index][key] = params.data[key];
      }
    }
  },
};
const actions = {
  async A_GET_EVENTS({ commit }, params) {
    try {
      const response = await eventService.getEvents(params);
      /* console.log('A_GET_EVENTS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        commit("SET_DATA", {
          destination: "S_EVENTS",
          data: response.data.data,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_GET_EVENTS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_EVENT({ commit }, body) {
    try {
      const response = await eventService.getEvent(body);
      console.log(response)
      /* console.log('A_GET_EVENT response', response) */
      return response;
    } catch (error) {
      console.log("ERROR_GET_EVENT [ACTION]", error);
      throw error;
    }
  },

  /* SETS */

  async A_SET_EVENT({ commit }, body) {
    try {
      const response = await eventService.postEvent(body);
      if (mixins.methods.isResponseSuccess(response)) {
        response.data.name_user = body.seller;
        commit("UNSHIFT_DATA", {
          destination: "S_EVENTS",
          data: response.data,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_SET_EVENT [ACTION]", error);
      throw error;
    }
  },

  /* UPDATES */

  async A_UPDATE_EVENT({ commit }, body) {
    try {
      const response = await eventService.updateEvent(body);
      /* console.log('A_UPDATE_EVENT response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        body.user = {
          id: body.user_id,
          first_name: body.seller,
          last_name: "",
        };
        commit("UPDATE_DATA", {
          destination: "S_EVENTS",
          data: body,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_UPDATE_EVENT [ACTION]", error);
      throw error;
    }
  },

  /* DELETES */

  async A_DELETE_EVENT({ commit }, body) {
    try {
      const response = await eventService.postDeleteEvent(body);
      /* console.log('A_DELETE_EVENT response', response) */
      if (mixins.methods.isResponseSuccess(response))
        commit("REMOVE_DATA", {
          destination: "S_EVENTS",
          id: body.id,
        });
      return response;
    } catch (error) {
      console.log("ERROR_DELETE_EVENT [ACTION]", error);
      throw error;
    }
  },
  async A_DELETE_EVENTS({ commit }, id) {
    try {
      const response = await eventService.postDeleteEvents(id);
      /* console.log('A_DELETE_EVENTS response', response) */
      if (mixins.methods.isResponseSuccess(response))
        commit("REMOVE_DATA", {
          destination: "S_EVENTS",
          id,
        });
      return response;
    } catch (error) {
      console.log("ERROR_DELETE_EVENTS [ACTION]", error);
      throw error;
    }
  },

  /* OTHER ACTIONS */

  async A_GET_DATE_EVENTS_TASKS({ commit }, params) {
    try {
      const response = await eventService.getDateEventsTasks(params);
      /* console.log('A_GET_DATE_EVENTS_TASKS response', response) */
      return response;
    } catch (error) {
      console.log("ERROR_GET_DATE_EVENTS_TASKS [ACTION]", error);
      throw error;
    }
  },
  async A_ATTEND_EVENT({ commit }, body) {
    try {
      const response = await eventService.postAttendEvent(body);
      /* console.log('A_ATTEND_EVENT response', response) */
      return response;
    } catch (error) {
      console.log("ERROR_ATTEND_EVENT [ACTION]", error);
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
