import UserService from "@/service/user/user.service";
export default {
  namespaced: true,
  state: {
    S_USER_SESSIONS: [],
    S_USER_STATUS_SESSION: null,
  },
  getters: {
    G_USER_STATUS_SESSION(state) {
      return state.S_USER_STATUS_SESSION;
    },
  },
  mutations: {
    SET_USER_SESSIONS(state, payload) {
      state.S_USER_SESSIONS = payload;
    },
    SET_USER_STATUS_SESSION(state, payload) {
      state.S_USER_STATUS_SESSION = payload[0].status_session;
    },
  },
  actions: {
    async A_GET_USER_SESSIONS({ commit }, body) {
      try {
        const response = await UserService.getUserSessions(body);
        commit("SET_USER_SESSIONS", response.data.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    async A_GET_USER_STATUS_SESSION({ commit }, body) {
      try {
        const response = await UserService.getUserStatusSession(body);
        commit("SET_USER_STATUS_SESSION", response.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    async A_CHANGE_USER_STATUS_SESSION({ commit }, body) {
      try {
        const response = await UserService.changeUserStatusSession(body);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
};
