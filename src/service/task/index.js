import { amgApi } from "@/service/axios";

class TaskService {
  async getTask(body) {
    try {
      const data = await amgApi.post("/tasks/get-task", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTasks(body) {
    try {
      const data = await amgApi.post(
        "/notification/get-task-notifications",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getHistoryTasks(body) {
    try {
      const data = await amgApi.post("/tasks/search-history-task-lead", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async makeFavoriteTask(body) {
    try {
      const data = await amgApi.post("/tasks/make-favorite", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postCreateLeadTask(body) {
    try {
      const data = await amgApi.post("/tasks/create-task-lead", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postDeleteLeadTask(body) {
    try {
      const data = await amgApi.post("/tasks/delete-task", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postDoneLeadTask(body) {
    try {
      const data = await amgApi.post("/tasks/done-task", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postCheckTask(body) {
    try {
      const data = await amgApi.post("/credit-expert/check-task-credit", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteTaskCredit(body) {
    try {
      const data = await amgApi.post("/credit-expert/delete-task-credit", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async editTaskCredit(body) {
    try {
      const { data } = await amgApi.post("/tasks/get-edit-task", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async addTask(body) {
    try {
      const { data } = await amgApi.post("/tasks/add-task", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getQuickTasksList(body) {
    try {
      const { data } = await amgApi.post("/messages/get-all-task-notes", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteQuickTask(body) {
    try {
      const { data } = await amgApi.post(
        "/messages/delete-task-notes-by-id",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async saveQuickTask(body) {
    try {
      const { data } = await amgApi.post("/messages/insert-task-notes", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getQuickTasks(body) {
    try {
      const { data } = await amgApi.post("/tasks/get-all-tasksselect", body);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async validateTaskFavorite(body) {
    try {
      const data = await amgApi.post("/tasks/validate-favorites-tasks", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTaskCounter(body) {
    try {
      const data = await amgApi.post("/notification/count-tasks", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAllTask(body) {
    try {
      const data = await amgApi.post(body.api_url, body);
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  async changeTaskTodayModal(body) {
    try {
      const data = await amgApi.post("/tasks/change-status-tasks-today", body);
      return data.data;
    } catch (error) {
      throw error;
    }
  }

  async exportTasksToExcel(body) {
    try {
      const { data } = await amgApi.post("/tasks/export-task-to-excel", body, {
        responseType: "blob",
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new TaskService();
