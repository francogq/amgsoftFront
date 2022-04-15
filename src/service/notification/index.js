import { amgApi } from "@/service/axios";

class NotificationService {
  async getUserNotifications(body) {
    try {
      const data = await amgApi.post('/notification/get-notifications', body)
      return data
    } catch (error) {
      throw error;
    }
  }
  async getAllUserNotifications(body) {
    try {
      const data = await amgApi.post(
        "/notification/get-all-notifications-by-id",
        body
      );
      return data.data;
    } catch (error) {
      throw error;
    }
  }
  async updateNotification(body) {
    try {
      const data = await amgApi.post(
        "/notification/update-notifications",
        body
      );
      return data.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new NotificationService();
