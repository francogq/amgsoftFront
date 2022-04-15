import { amgApi } from "@/service/axios";
class ClientService {
  //ClientsTab
  async search(params) {
    const data = await amgApi.post("/clients/search-global-clients", params);
    return data;
  }
  // Clients
  async usersPrograms(params) {
    const data = await amgApi.post("/commons/users-programs", params);
    return data.data;
  }

  async searchClientPayment(params) {
    const data = await amgApi.post("/clients/search-client-payment", params);
    return data;
  }

  async usersAllPrograms(params) {
    const data = await amgApi.post("/commons/users-all-programs", params);
    return data;
  }

  async generateRefresh(params) {
    const data = await amgApi.post(
      "/clients/generate-adclientds",
      params
    );
    return data.data;
  }

  // General Shared Table
  async clientsShared(params) {
    const data = await amgApi.post(
      "/clients/clients-share",
      params
    );
    return data;
  }
  async programs() {
    const data = await amgApi.get("/commons/programs");
    return data;
  }
  async usersSuperviser(params) {
    const data = await amgApi.post(
      "/commons/all-users-superviser-prog",
      params
    );
    return data;
  }
  // Modal Send Sms
  async getNumberModule(params) {
    const data = await amgApi.post("/commons/get-number-module", params);
    return data;
  }
  async sendMessageClients(params) {
    const data = await amgApi.post(
      "/messages/send-mass-message-clients",
      params
    );
    return data;
  }
  // Modal Send Email
  async allQuicksEmail(params) {
    const data = await amgApi.post("/emails/all-quicks-email", params);
    return data;
  }

  async deleteQuickEmail(params) {
    const data = await amgApi.post("/emails/delete-quick-email", params);
    return data;
  }

  async saveQuickEmail(params) {
    const data = await amgApi.post("/emails/save-quick-email", params);
    return data;
  }

  async sendEmail(params,onUploadProgress) {
    const data = await amgApi.post(
      "/emails/filedragdropemail",
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      },
    );
  }
}
export default new ClientService();
