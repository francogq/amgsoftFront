import { amgApi } from "@/service/axios";

class CreditReport {
  async getCreditReport(body) {
    try {
      const data = await amgApi.post(
        "/lead/credit-report/get-files-report",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCreditReportPendings(body) {
    try {
      const data = await amgApi.post(
        "/credit-report/search-credit-reports-pending",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async countCreditReportPendings(body) {
    try {
      const data = await amgApi.post("/lead/get-cr-count-pending-tab", body);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CreditReport();
