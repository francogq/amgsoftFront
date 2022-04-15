import { amgApi } from "@/service/axios";

class GlobalService {
  async getPrograms(params) {
    try {
      const { data } = await amgApi.get("/program/get-programs");
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCountrys(params) {
    try {
      const { data } = await amgApi.post("/commons/get-world-countrys");
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  async getHourSystem(params) {
    try {
      const { data } = await amgApi.post(
        `/commons/get-hour-system?timezone=${params}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getUsersByModuleAndRoles(payload) {
    try {
      const { data } = await amgApi.post(`/commons/user-module/${payload.moduleId}`, {roles: payload.roles, type: "1"});
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new GlobalService();
