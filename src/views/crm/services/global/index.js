import { amgApi } from "@/service/axios";

class CrmGlobal {
  async getCountries(body) {
    try {
      const data = await amgApi.post("/commons/get-world-countrys", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on getCountries:", error);
      throw error;
    }
  }

  async getOwners({ modul, body }) {
    try {
      const data = await amgApi.post(`/commons/user-module/${modul}`, body)
      return data
    } catch (error) {
      console.log("Something went wrong on getOwners:", error);
      throw error;
    }
  }

  async getPrograms(params) {
    try {
      const data = await amgApi.get('/program/get-programs', { params })
      return data
    } catch (error) {
      console.log("Something went wrong on getPrograms:", error);
      throw error;
    }
  }

  async getSellers({ modul, body }) {
    try {
      const data = await amgApi.post(`/commons/sellerall/${modul}`, body);
      return data;
    } catch (error) {
      console.log("Something went wrong on getSellers:", error);
      throw error;
    }
  }

  async getSourceNames(params) {
    try {
      const data = await amgApi.get("/commons/get-sources-names", { params });
      return data;
    } catch (error) {
      console.log("Something went wrong on getSourceNames:", error);
      throw error;
    }
  }

  async getStates(body) {
    try {
      const data = await amgApi.post("/lead/get-states", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on getStates:", error);
      throw error;
    }
  }

  async getStatesEeuu(params) {
    try {
      const data = await amgApi.get("/commons/get-eeuu-states", { params });
      return data;
    } catch (error) {
      console.log("Something went wrong on getStatesEeuu:", error);
      throw error;
    }
  }

  async postUniqueMobile(body) {
    try {
      const data = await amgApi.post('/lead/verify-mobile', body)
      return data
    } catch (error) {
      console.log("Something went wrong on postUniqueMobile:", error);
      throw error;
    }
  }

  async getCreatesSale(id) {
    try {
      const { data, status } = await amgApi.post('/sale/get-creates-sale', {
        sale_id: id
      })
      return { data, status }
    } catch (error) {
      console.log("Something went wrong on getCreatesSale", error)
      throw error;
    }
  }
}

export default new CrmGlobal();
