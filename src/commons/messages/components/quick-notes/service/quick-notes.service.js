import { amgApi } from "@/service/axios";

class QuickNotesService {
  async getQuickNotes(body) {
    const data = await amgApi.post("/messages/all-quicks", body);
    return data.data;
  }
  async deleteQuickNote(body) {
    const data = await amgApi.post("/messages/delete-quick", body);
    return data.data;
  }
  async saveQuickNote(body) {
    const data = await amgApi.post("/messages/save-quick", body);
    return data.data;
  }
}
export default new QuickNotesService();