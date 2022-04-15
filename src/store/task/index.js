import Vue from "vue";

import TaskService from "@/service/task";
import GlobalService from "@/views/services/global.service";
import mixins from "@/mixins/general";

const state = {
  S_TASKS: [],
  S_HISTORY_TASKS: [],
  S_TASK: {},
  S_TASK_COUNTER: {
    overdue: 0,
    today: 0,
    upcoming: 0,
    done: 0,
    t_today: 0,
  },
  S_TASK_TODAY_INITIAL: false,
};
const getters = {
  taskCounter: (state) =>
    state.S_TASK_COUNTER.overdue +
    state.S_TASK_COUNTER.today +
    state.S_TASK_COUNTER.upcoming,
};
const mutations = {
  SET_DATA(state, params) {
    Vue.set(state, params.destination, params.data);
  },
  M_TASK_TODAY(state, val) {
    state.S_TASK_TODAY_INITIAL = val;
  },
  M_SHOW_TASK_TODAY_MODAL(state) {
    if (state.S_TASK_COUNTER.today && state.S_TASK_COUNTER.t_today) {
      state.S_TASK_TODAY_INITIAL = true;
    }
  },
  M_CHANGE_T_TODAY(state, val) {
    state.S_TASK_COUNTER.t_today = val;
  },
};
const actions = {
  async A_GET_TASK({ commit }, body) {
    try {
      const response = await TaskService.getTask(body);
      return response;
    } catch (error) {
      console.log("ERROR_GET_TASK [ACTION]", error);
      throw error;
    }
  },
  async A_GET_TASKS({ commit }, body) {
    try {
      const response = await TaskService.getTasks(body);
      if (mixins.methods.isResponseSuccess(response)) {
        response.data.forEach((task) => {
          task.tasks = JSON.parse(task.tasks);
        });
        commit("SET_DATA", {
          destination: "S_TASKS",
          data: response.data,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_GET_TASKS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_LEAD_HISTORY_TASKS({ commit }, body) {
    try {
      const response = await TaskService.getHistoryTasks(body);
      /* console.log('A_GET_LEAD_HISTORY_TASKS response', response) */
      if (mixins.methods.isResponseSuccess(response)) {
        commit("SET_DATA", {
          destination: "S_HISTORY_TASKS",
          data: response.data.data,
        });
      }
      return response;
    } catch (error) {
      console.log("ERROR_GET_LEAD_HISTORY_TASKS [ACTION]", error);
      throw error;
    }
  },
  async A_GET_TASK_COUNTER({ commit }, body) {
    try {
      const response = await TaskService.getTaskCounter(body);
      if (mixins.methods.isResponseSuccess(response)) {
        commit("SET_DATA", {
          destination: "S_TASK_COUNTER",
          data: response.data,
        });
      }
      // Show Modal Task TodayInitially
      commit("M_SHOW_TASK_TODAY_MODAL");
      return response;
    } catch (error) {
      throw error;
    }
  },
  async A_DONE_LEAD_TASK({ commit }, body) {
    try {
      const response = await TaskService.postDoneLeadTask(body);
      /* console.log('A_DONE_LEAD_TASK response', response) */
      return response;
    } catch (error) {
      console.log("ERROR_DONE_LEAD_TASK [ACTION]", error);
      throw error;
    }
  },
  async A_VALIDATE_TASK_FAVORITE({ commit }, body) {
    try {
      const response = await TaskService.validateTaskFavorite(body);
      /* console.log('A_VALIDATE_TASK_FAVORITE response', response) */
      return response;
    } catch (error) {
      console.log("ERROR_VALIDATE_TASK_FAVORITE [ACTION]", error);
      throw error;
    }
  },
  async A_SET_LEAD_TASK({ commit }, body) {
    try {
      const response = await TaskService.postCreateLeadTask(body);
      return response;
    } catch (error) {
      console.log("ERROR_SET_LEAD_TASK [ACTION]", error);
      throw error;
    }
  },
  async A_DELETE_LEAD_TASK({ commit }, body) {
    try {
      const response = await TaskService.postDeleteLeadTask(body);
      /* console.log('A_DELETE_LEAD_TASK response', response) */
      return response;
    } catch (error) {
      console.log("ERROR_DELETE_LEAD_TASK [ACTION]", error);
      throw error;
    }
  },
  async A_MAKE_FAVORITE_LEAD_TASK({ commit }, body) {
    try {
      const response = await TaskService.makeFavoriteTask(body);
      /* console.log('A_MAKE_FAVORITE_LEAD_TASK response', response) */
      return response;
    } catch (error) {
      console.log("ERROR_MAKE_FAVORITE_LEAD_TASK [ACTION]", error);
      throw error;
    }
  },
  async A_CHANGE_TASK_TODAY_MODAL({ commit }, body) {
    try {
      const response = await TaskService.changeTaskTodayModal(body);
      return response;
    } catch (error) {
      console.log("ERROR_CHANGE_TASK_TODAY_MODAL [ACTION]", error);
      throw error;
    }
  },

  async A_GET_HOUR_SYSTEM({}, body) {
    try {
      const response = await GlobalService.getHourSystem(body);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async A_EXPORT_TASKS_TO_EXCEL({ commit }, body) {
    try {
      const response = await TaskService.exportTasksToExcel(body);
      return response;
    } catch (error) {
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
