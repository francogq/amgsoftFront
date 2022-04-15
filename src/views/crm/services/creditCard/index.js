import { amgApi } from "@/service/axios";

class CreditCard {
  async getCreditCard(body) {
    try {
      const data = await amgApi.post("/cards/get-cards-data-by-id", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getOriginalTarget(body) {
    try {
      const data = await amgApi.post("/cards/original-target", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCreditCard(body) {
    try {
      const data = await amgApi.post("note/first-note/delete-card-lead", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createCreditCard(body) {
    try {
      const data = await amgApi.post("createcard", body);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CreditCard();
