import { amgApi } from "@/service/axios";

class PayStubService {
  async getUserPayStub(userId) {
    const data = await amgApi.post(
      "/management/pay-roll/get-file-pay-stub-by-userId",
      {
        id_user: userId,
      }
    );
    return data.data;
  }
  async readFile(id_file) {
    const data = await amgApi.post("/management/pay-roll/read-file-pay-stub", {
      id_file: id_file,
    });
    return data.data;
  }
  async getPayStubCounter(id) {
    const data = await amgApi.post("/management/pay-roll/get-pay-stub-counter", {
      id
    });
    return data.data;
  }
}
export default new PayStubService();
