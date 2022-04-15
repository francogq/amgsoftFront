import { amgApi, amgApiFake } from "@/service/axios";

class CrmLead {
  async getLead(id, params) {
    try {
      const { data } = await amgApi.get(`/lead/show/${id}`, params);
      return data;
    } catch (error) {
      console.log("Something went wrong on getLead:", error);
      throw error;
    }
  }

  async getLeads(body) {
    try {
      const response = await amgApi.post("/lead/search-leads", body);

      response.data.data.map((item) => {
        item.editStatus = false;
      });

      return response;
    } catch (error) {
      console.log("Something went wrong on getLeads:", error);
      throw error;
    }
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

  async getLeadsWPotential(body) {
    try {
      const { data } = await amgApi.post(
        "/lead/social-network/search-leads-sn-potential",
        body
      );
      return data;
    } catch (error) {
      console.log("Something went wrong on getLeadsWPotential:", error);
      throw error;
    }
  }

  async getStateLeads(params) {
    try {
      const data = await amgApi.get("/lead/get-state-leads", { params });
      return data;
    } catch (error) {
      console.log("Something went wrong on getStateLeads:", error);
      throw error;
    }
  }

  async getStatusLeads(params) {
    try {
      const data = await amgApi.get("/lead/get-lead-status", { params });
      return data;
    } catch (error) {
      console.log("Something went wrong on getStatusLeads:", error);
      throw error;
    }
  }

  async getSourceLeads(params) {
    try {
      const data = await amgApi.get("/commons/get-lead-sources", { params });
      return data;
    } catch (error) {
      console.log("Something went wrong on getSourceLeads:", error);
      throw error;
    }
  }

  async postCreateLead(body) {
    try {
      const data = await amgApi.post("/lead/create-lead", body);
      return data;
    } catch (error) {
      throw error;
    }
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

  async postRequestLead(body) {
    try {
      const data = await amgApi.post("/lead/social-network/request-lead", body);
      return data;
    } catch (error) {
      console.log("Something went wrong on postRequestLead:", error);
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

  async postSearchFileLead(body) {
    try {
      const data = await amgApi.post(
        "/lead/social-network/search-file-lead-sn",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postFileNameLead(body) {
    try {
      const data = await amgApi.post(
        "/lead/social-network/update-file-name",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postFileLead(body) {
    try {
      const data = await amgApi.post(
        "/lead/social-network/upload-file-lead-sn",
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteFileLead(body) {
    try {
      const data = await amgApi.post(
        "/lead/social-network/delete-file-sn",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postLeadPayment(body) {
    try {
      const data = await amgApi.post("/authorize/lead-payment", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postMyListCreate(body) {
    try {
      const data = await amgApi.post(
        "/commons/list-users/create-list-of-users",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postSetPotential(body) {
    try {
      const data = await amgApi.post(
        "/lead/social-network/set-potential",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postChangeStatusSn(body) {
    try {
      const data = await amgApi.post(
        "/lead/social-network/change-status-sn",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getLeadEdit(id, params) {
    try {
      const { data } = await amgApi.get(`/lead/edit/${id}`, params);
      return data;
    } catch (error) {
      console.log("Something went wrong on getLead:", error);
      throw error;
    }
  }

  async postUniquesSsn(body) {
    try {
      const data = await amgApi.post("/clients/unique-ssn", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postUniquesItin(body) {
    try {
      const data = await amgApi.post("/clients/unique-itin", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postUniquesCpn(body) {
    try {
      const data = await amgApi.post("/clients/unique-cpn", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async putFieldsLead(body) {
    try {
      const data = await amgApi.post("/lead/update-fields-lead", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postAllTrackingChangeLeads(body) {
    try {
      const data = await amgApi.post(
        "/lead/get-all-tracking-fields-lead",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getTrakingStatusLeads(body) {
    try {
      const data = await amgApi.post(
        "/lead/ncr/get-lead-tracking-status-by-id",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async putLead(id, body) {
    try {
      body.id = id;
      const data = await amgApi.post(`/lead/update-lead`, body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getLeadDocument(body) {
    try {
      const data = await amgApi.post("/lead/get-lead-document", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getLeadSendRequest(body) {
    try {
      const data = await amgApi.post("/lead/ncr/send-leads-request", body);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async createSellerList(body) {
    try {
      const { data } = await amgApi.post(
        "/commons/list-users/create-seller-list",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async exportLeadsToExcel(body) {
    try {
      const { data } = await amgApi.post("/lead/export-lead-to-excel", body, {
        responseType: "blob",
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateStatusPotentialSn(body) {
    try {
      const { data, status } = await amgApi.post(
        "/lead/social-network/update-status-potential-sn", body
      );
      return { data, status };
    } catch (error) {
      console.log("Something went wrong on updateStatusPotentialSn:", error);
      throw error;
    }
  }
}

export default new CrmLead();
