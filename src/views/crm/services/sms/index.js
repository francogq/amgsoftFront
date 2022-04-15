import { amgApi } from "@/service/axios";

class CrmSms {
  async getAllQuicksSms(body) {
    try {
      const data = await amgApi.post("/messages/get-all-quick-sms", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on getAllQuicksSms:", error);
      throw error;
    }
  }

  async postHistorySmsLead(body) {
    try {
      const data = await amgApi.post("/messages/get-tracking-sms-lead", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on postHistorySmsLead:", error);
      throw error;
    }
  }

  async postSaveQuickSms(body) {
    try {
      const data = await amgApi.post("/messages/save-quick-sms", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on postSaveQuickSms:", error);
      throw error;
    }
  }

  async postDeleteQuickSms(body) {
    try {
      const data = await amgApi.post("/messages/delete-quick", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on postDeleteQuickSms:", error);
      throw error;
    }
  }

  async postSendMessageLead(body) {
    try {
      const data = await amgApi.post("/messages/send-mass-message", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on postSendMessageLead:", error);
      throw error;
    }
  }
}

export default new CrmSms();
