import { amgApi } from "@/service/axios";

class CommissionsService {
  async searchCommissions(params) {
    try {
      const { data } = await amgApi.post(
        "/commissions/get-report-commissions",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async searchCommissionsDepartments(params) {
    try {
      const { data } = await amgApi.post(
        "/commissions/get-report-commissions-department",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updatePercentage(params) {
    try {
      const { data } = await amgApi.post(
        "/commissions/edit-percentage-to-pay-crm",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getDepartmentPercentage(params) {
    try {
      const { data } = await amgApi.post(
        "/commissions/get-percentage-by-department",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async searchCommissionsUserCrm(params) {
    try {
      const { data } = await amgApi.post(
        "/commissions/get-details-of-commissions-crm",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async searchCommissionsUserAdm(params) {
    try {
      const { data } = await amgApi.post(
        "/commissions/get-details-of-commissions-administration",
        params
      );
      return data;
    } catch (error) {
      console.log("Something went wrong on Commissions:", error);
      throw error;
    }
  }
  async searchCommissionsUserDepartment(params) {
    try {
      const { data } = await amgApi.post(
        "/commissions/get-details-of-commissions-departments",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async searchCommissionsApprove(params) {
    try {
      const { data } = await amgApi.post(
        "/commissions/get-approve-commissions",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async anullComissions(params) {
    try {
      const { data } = await amgApi.post(
        "/commissions/anull-commissions",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async approveCommissions(params) {
    try {
      const { data } = await amgApi.post(
        "/commissions/approve-commissions",
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CommissionsService();
