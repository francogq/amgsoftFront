import { amgApi } from "@/service/axios";

class UserService {
  async getUserSessions(body) {
    try {
      const data = await amgApi.post("/commons/session-users", body);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async validatePasswordUser(body) {
    try {
      const data = await amgApi.post(
        "/profile/validate-if-password-is-correct",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async changePasswordUser(body) {
    try {
      const data = await amgApi.post("/commons/change-password-user", body);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getUserStatusSession(body) {
    try {
      const data = await amgApi.post("/commons/get-user-status-session", body);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async changeUserStatusSession(body) {
    try {
      const data = await amgApi.post(
        "/commons/change-user-status-session",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
