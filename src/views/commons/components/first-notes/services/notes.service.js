import { amgApi } from "@/service/axios";

class NotesService {
  async getListTypeGoal() {
    try {
      const { data } = await amgApi.get("/commons/get-list-type-goal");
      return data;
    } catch (error) {
      throw error;
    }
  }
  async insertFirstNote(params) {
    try {
      const { data } = await amgApi.post(
        "/note/first-note/insert-first-note",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getFirstNote(params) {
    try {
      const { data } = await amgApi.post(
        "/note/first-note/get-first-note",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updateFirstNote(params) {
    try {
      const { data } = await amgApi.post(
        "/note/first-note/update-first-note",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async notesSales(params) {
    try {
      const { data } = await amgApi.post("/sales-made/get-sale-notes", params);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async insertSaleNotes(params) {
    try {
      const { data } = await amgApi.post(
        "/sales-made/insert-sales-notes",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new NotesService();
