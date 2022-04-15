import { amgApi } from "@/service/axios";

const DEFAULT_BODY_GET_SELLERS_CRM = {
  roles: "[1,2,5]",
  type: "1",
};
const DEFAULT_BODY_GET_CAPTURED_CRM = {
  roles: "[]",
  type: "1",
};
class CrmService {
  async getLeads(body) {
    try {
      const { data } = await amgApi.post("/lead/search-leads", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on getLeads:", error);
      throw error;
    }
  }

  async getSellersCrm(module = 2, body = DEFAULT_BODY_GET_SELLERS_CRM) {
    // eslint-disable-next-line no-undef
    let data = await amgApi.post(`/commons/sellerall/${module}`, body);
    data = data.data;
    return data;
  }

  async getCapturedCrm(module = 2, body = DEFAULT_BODY_GET_CAPTURED_CRM) {
    // eslint-disable-next-line no-undef
    let data = await amgApi.post(`/commons/sellerall/${module}`, body);
    data = data.data;
    return data;
  }

  async getLeadsSn(body) {
    try {
      const { data } = await amgApi.post(
        "/lead/social-network/search-leads-recovery",
        body
      );
      return data;
    } catch (error) {
      console.log("Something went wrong on getLeadsSn:", error);
      throw error;
    }
  }

  async getStatusLeads(params) {
    try {
      const { data } = await amgApi.get("/lead/get-lead-status", { params });
      return data;
    } catch (error) {
      console.log("Something went wrong on getStatusLeads:", error);
      throw error;
    }
  }

  async getStateLeads(params) {
    try {
      const { data } = await amgApi.get("/lead/get-state-leads", { params });
      return data;
    } catch (error) {
      console.log("Something went wrong on getStateLeads:", error);
      throw error;
    }
  }

  async getSourceLeads(params) {
    try {
      const { data } = await amgApi.get("/commons/get-lead-sources", {
        params,
      });
      return data;
    } catch (error) {
      console.log("Something went wrong on getSourceLeads:", error);
      throw error;
    }
  }

  async getOwners({ modul, body }) {
    try {
      const { data } = await amgApi.post(`/commons/user-module/${modul}`, body);
      return data;
    } catch (error) {
      console.log("Something went wrong on getOwners:", error);
      throw error;
    }
  }

  async getSourceNames(params) {
    try {
      const { data } = await amgApi.get("/commons/get-sources-names", {
        params,
      });
      return data;
    } catch (error) {
      console.log("Something went wrong on getSourceNames:", error);
      throw error;
    }
  }

  async getPrograms(params) {
    try {
      const { data } = await amgApi.get("/program/get-programs", { params });
      return data;
    } catch (error) {
      console.log("Something went wrong on getPrograms:", error);
      throw error;
    }
  }

  async getStates(body) {
    try {
      const { data } = await amgApi.post("/lead/get-states", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on getStates:", error);
      throw error;
    }
  }

  async getStatesEeuu(params) {
    try {
      const { data } = await amgApi.get("/commons/get-eeuu-states", { params });
      return data;
    } catch (error) {
      console.log("Something went wrong on getStatesEeuu:", error);
      throw error;
    }
  }

  async getAlgo() {
    // eslint-disable-next-line no-undef
    const data = await amgApi.get("/welcome/welcome");
    return data;
  }

  async getListCards(body) {
    try {
      const { data } = await amgApi.post("/sales-made/get-list-cards", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on getListCards:", error);
      throw error;
    }
  }

  async getSaleAnnul(body, page) {
    try {
      const { data } = await amgApi.post(
        `/sales-made/search-sale-annul?page=${page}`,
        body
      );
      return data;
    } catch (error) {
      console.error("Something went wrong on getListCards:", error);
      throw error;
    }
  }

  async getLeadsFiles(body) {
    try {
      const { data } = await amgApi.post(
        "/sales-made/get-all-files-lead",
        body
      );
      return data;
    } catch (error) {
      console.error("Something went wrong on getLeadsFiles:", error);
      throw error;
    }
  }

  async getLeadsFilesAccount(body) {
    try {
      const { data } = await amgApi.post(
        "/sales-made/payment/get-all-files-account",
        body
      );
      return data;
    } catch (error) {
      console.error("Something went wrong on getLeadsFiles:", error);
      throw error;
    }
  }

  async generatePdf(body) {
    try {
      const { data } = await amgApi.post("/sales-made/generate-pdf", body);
      return data;
    } catch (error) {
      console.error("Something went wrong on generatePdf:", error);
      throw error;
    }
  }

  async deleteFile(body) {
    try {
      const { data } = await amgApi.post("/sales-made/delete-file", body);
      return data;
    } catch (error) {
      console.error("Something went wrong on getLeadsFiles:", error);
      throw error;
    }
  }

  async getSaleMade(body, page) {
    try {
      const { data } = await amgApi.post(
        `/sales-made/get-sales-made?page=${page}`,
        body
      );
      data.data.map((d) => {
        d.selected = false;
        d.editFee = false;
        d.editCaptured = false;
        d.editSeller = false;
        d.sellerNew = 0;
        d.capturedNew = d.captured_id;
        d.feeNew = d.fee;
        if (d.commission) d.commission = JSON.parse(d.commission);
      });
      return data;
    } catch (error) {
      console.error("Something went wrong on getSaleMade:", error);
      throw error;
    }
  }

  async getCountries(body) {
    try {
      const { data } = await amgApi.post("/commons/get-world-countrys", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on getCountries:", error);
      throw error;
    }
  }

  async getUserCreatorOwner(body) {
    try {
      const { data } = await amgApi.post(
        `/commons/sellerall/${body.modul}`,
        body
      );
      return data;
    } catch (error) {
      console.log("Something went wrong on getUserCreatorOwner:", error);
      throw error;
    }
  }

  async postUniqueMobile(body) {
    try {
      const { data } = await amgApi.post("/lead/verify-mobile", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on postUniqueMobile:", error);
      throw error;
    }
  }

  async postRequestLead(body) {
    try {
      const { data } = await amgApi.post(
        "/lead/social-network/request-lead",
        body
      );
      return data;
    } catch (error) {
      console.log("Something went wrong on postRequestLead:", error);
      throw error;
    }
  }

  async postCreateLead(body) {
    try {
      const data = await amgApi.post("/lead/create-lead", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on postCreateLead:", error);
    }
  }

  async getSources() {
    let data = await amgApi.get("/commons/get-sources-names");
    data = data.data;
    return data;
  }

  async postDeleteLead(body) {
    try {
      const data = await amgApi.post("/lead/destroy-lead", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on postDeleteLead:", error);
      throw error;
    }
  }

  async postProcessLead(body) {
    try {
      const data = await amgApi.post("/lead/social-network/process-lead", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on postProcessLead:", error);
      throw error;
    }
  }

  async getAllQuicksSms(body) {
    try {
      const { data } = await amgApi.post("/messages/get-all-quick-sms", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on getAllQuicksSms:", error);
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

  async postHistorySmsLead(body) {
    try {
      const data = await amgApi.post(
        "/api/messages/get-tracking-sms-lead",
        body
      );
      return data;
    } catch (error) {
      console.log("Something went wrong on postHistorySmsLead:", error);
      throw error;
    }
  }

  async getCapturedByTracking(body) {
    try {
      const { data } = await amgApi.post(
        "/sales-made/get-tracking-captured",
        body
      );
      return data;
    } catch (error) {
      console.error("Something went wrong on getCapturedByTracking:", error);
      throw error;
    }
  }

  async getSellerTracking(body) {
    try {
      const { data } = await amgApi.post("/sales-made/get-history-sale", body);
      return data;
    } catch (error) {
      console.error("Something went wrong on getSellerTracking:", error);
      throw error;
    }
  }

  async getFeeTracking(body) {
    try {
      const { data } = await amgApi.post("/sales-made/get-tracking-fee", body);
      return data;
    } catch (error) {
      console.error("Something went wrong on getSellerTracking:", error);
      throw error;
    }
  }

  async saveNewCaptured(body) {
    try {
      return await amgApi.post("/sales-made/edit-captured-by", body);
    } catch (error) {
      console.error("Something went wrong on getSellerTracking:", error);
      throw error;
    }
  }

  async saveNewSeller(body) {
    try {
      return await amgApi.post("/sales-made/edit-seller-user", body);
    } catch (error) {
      console.error("Something went wrong on getSellerTracking:", error);
      throw error;
    }
  }

  async saveNewFee(body) {
    try {
      return await amgApi.post("/sales-made/edit-fee-sales-made", body);
    } catch (error) {
      console.error("Something went wrong on saveNewFee:", error);
      throw error;
    }
  }

  async postUserAppointmentSn(body) {
    try {
      const data = await amgApi.post(
        "/lead/social-network/get-users-appointmens-sn",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CrmService();
