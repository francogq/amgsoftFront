// IMPORT LIBRARIES
import Vue from "vue";

import NotesService from "@/views/crm/services/notes";
import mixins from "@/mixins/general";

const state = {
  S_NOTES: [],
};
const getters = {};
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
};
const actions = {
  async A_GET_LEAD_NOTES({ commit }, body) {
    try {
      const response = await NotesService.getLeadNotes(body);
      if (mixins.methods.isResponseSuccess(response)) {
        commit("SET_DATA", {
          destination: "S_NOTES",
          data: response.data,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_GET_NOTES [ACTION]", error);
      throw error;
    }
  },
  async A_SET_LEAD_NOTE({ commit }, body) {
    try {
      const response = await NotesService.postLeadNotes(body);
      if (mixins.methods.isResponseSuccess(response)) {
        commit("SET_DATA", {
          destination: "S_NOTES",
          data: response.data,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_SET_NOTE [ACTION]", error);
      throw error;
    }
  },
  async A_UPDATE_LEAD_NOTE({ commit }, body) {
    try {
      const response = await NotesService.putLeadNotes(body);
      if (mixins.methods.isResponseSuccess(response)) {
        commit("SET_DATA", {
          destination: "S_NOTES",
          data: response.data,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_UPDATE_LEAD_NOTE [ACTION]", error);
      throw error;
    }
  },
  async A_MAKE_IMPORTANT_NOTE({ commit }, body) {
    try {
      const response = await NotesService.postMakeImportantNote(body);
      return response;
    } catch (error) {
      console.log("ERROR_MAKE_IMPORTANT_NOTE [ACTION]", error);
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
