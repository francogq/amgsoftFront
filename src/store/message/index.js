import MessageService from "@/service/message/index";
import moment from "moment";
import Vue from "vue";
export default {
  namespaced: true,
  state: {
    S_USER_CONTACTS: [],
    S_USER_MESSAGES: [],
    S_QUICK_NOTES: [],
    S_USERS_TO_MESSAGE: [],
    S_USER_TO_MESSAGE: {},
    S_TOTAL_MESSAGES: 0,
    S_FILTERED_MESSAGES: [],
    S_MESSAGES_COUNTER_NOTIFICATION: 0,
    S_CHAT_COMPOSE_IS_OPEN: false,
  },
  getters: {},
  mutations: {
    SET_USER_CONTACTS(state, payload) {
      state.S_USER_CONTACTS = payload;
    },
    SET_USER_MESSAGES(state, payload) {
      state.S_USER_MESSAGES = payload;
    },
    SET_QUICK_NOTES(state, payload) {
      state.S_QUICK_NOTES = payload;
    },
    SET_USERS_TO_MESSAGE(state, payload) {
      state.S_USERS_TO_MESSAGE = payload;
    },
    SET_USER_TO_MESSAGE(state, payload) {
      state.S_USER_TO_MESSAGE = payload;
    },
    SET_LAST_CHAT_CONTACT_DATE(state, payload) {
      state.S_USER_CONTACTS.find((el) => el.coworker_id === payload).date =
        moment().format("YYYY-MM-DD HH:mm:ss");
    },
    SET_LAST_MESSAGE_TO_ACTIVE_CHAT(state, payload) {
      state.S_USER_MESSAGES.chat.chat.push(payload);
    },
    SET_STATUS_TO_LAST_MESSAGE(state, payload) {
      let obj = state.S_USER_MESSAGES.chat.chat.find(
        (el) => el.index == payload.index
      );
      Vue.set(obj, "files", payload.data.files_names_last_message);
      Vue.set(obj, "route_temp", payload.data.route_temp);
      Vue.set(obj, "was_sent", payload.status);
      Vue.set(obj, "error", payload.error);
    },
    DELETE_MESSAGE_WITH_ERROR_INDEX(state, payload) {
      state.S_USER_MESSAGES.chat.chat.splice(payload, 1);
    },
    SET_NEW_MESSAGES_TO_CONVERSATION(state, payload) {
      state.S_USER_MESSAGES.chat.chat.unshift(...payload);
    },
    SET_TOTAL_MESSAGES(state, payload) {
      state.S_TOTAL_MESSAGES = payload;
    },
    SET_FILTERED_MESSAGES(state, payload) {
      state.S_FILTERED_MESSAGES = payload;
    },
    SET_CONTACT_MESSAGE_COUNTER(state, payload) {
      state.S_USER_CONTACTS.forEach((contact) => {
        if (contact.coworker_id == payload) {
          contact.cm++;
        }
      });
    },
    SET_MESSAGES_COUNTER_NOTIFICATION(state, payload) {
      state.S_MESSAGES_COUNTER_NOTIFICATION = payload;
    },
    TOGGLE_CHAT_COMPOSE(state, payload) {
      state.S_CHAT_COMPOSE_IS_OPEN = payload;
    }
  },
  actions: {
    async A_GET_USER_CONTACTS({ commit }, body) {
      try {
        const response = await MessageService.getUserContacts(body);
        commit("SET_USER_CONTACTS", response.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    async A_GET_MESSAGES_COUNTER_NOTIFICATION({ commit }, body) {
      try {
        const response = await MessageService.getMessagesCounter(body);
        commit("SET_MESSAGES_COUNTER_NOTIFICATION", response.data[0].cont);
        return response;
      } catch (error) {
        throw error;
      }
    },
    async A_GET_USER_MESSAGES({ commit }, body) {
      try {
        const response = await MessageService.getUserMessages(body);
        commit("SET_TOTAL_MESSAGES", response.total);
        if (body.page > 1) {
          commit("SET_NEW_MESSAGES_TO_CONVERSATION", response.data.chat.chat);
        } else {
          commit("SET_USER_MESSAGES", response.data);
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    async A_GET_QUICK_NOTES({ commit }, body) {
      try {
        const response = await MessageService.getAllQuickNotes(body);
        commit("SET_QUICK_NOTES", response.data.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    async A_GET_USERS_TO_MESSAGE({ commit }, body) {
      try {
        const response = await MessageService.getUsersToMessage(body);
        commit("SET_USERS_TO_MESSAGE", response.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
    async A_SAVE_MESSAGE_REPLY({ commit }, body) {
      try {
        const formData = new FormData();
        body.files.forEach((file) => {
          formData.append("images[]", file, file.name);
        });
        formData.append("temporalid", body.temporalid);
        formData.append("content", body.content);
        formData.append("id_login", body.id_login);
        formData.append("id_user", JSON.stringify(body.id_user));
        formData.append("text", body.text);
        formData.append("subject", body.subject);
        formData.append("subjectresp", body.subjectresp);
        formData.append("contentresp", body.contentresp);
        formData.append("type", body.type);
        const response = await MessageService.saveMessageReply(
          formData,
          body.endpoint
        );
        if (body.type) {
          commit("SET_STATUS_TO_LAST_MESSAGE", {
            index: body.index,
            status: true,
            error: false,
            data: response.data[0]
          });
          if (body.originalMessageIndex) {
            commit(
              "DELETE_MESSAGE_WITH_ERROR_INDEX",
              body.originalMessageIndex
            );
          }
        }
        return response;
      } catch (error) {
        if (body.type) {
          commit("SET_STATUS_TO_LAST_MESSAGE", {
            index: body.index,
            status: false,
            error: true,
          });
          if (body.originalMessageIndex) {
            commit(
              "DELETE_MESSAGE_WITH_ERROR_INDEX",
              body.originalMessageIndex
            );
          }
        }
        throw error;
      }
    },
    async A_SEARCH_MESSAGES_IN_CHAT({ commit }, body) {
      try {
        const response = await MessageService.searchMessagesInChat(body);
        commit("SET_FILTERED_MESSAGES", response.data);
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
};
