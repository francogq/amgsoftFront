import { amgApi } from "@/service/axios";
class ClientDashboardService {
  //Client Innformation
  async search(params) {
    const data = await amgApi.post("/commons/search-account", params);
    return data;
  }

  async userModule(id,params){
      const data = await amgApi.post("/commons/user-module/"+id,params)
      return data
  }

  async allScore(params){
      const data = await amgApi.post("/clients/all-scores",params)
      return data
  }

  // Modal History
  async historyStatus(params){
    const data = await amgApi.post("/commons/history-status",params)
    return data
  }

  async stateLeads(){
    const data = await amgApi.get("/commons/state-leads")
    return data
  }
  async stateEEUU(){
    const data = await amgApi.get("/commons/get-eeuu-states")
    return data
  }
  async setCoApplicant(params){
    const data = await amgApi.post("/commons/set-coapplicant",params)
    return data
  }
  async getCoApplicant(params){
    const data = await amgApi.post("/commons/get-coapplicant",params)
    return data
  }
}
export default new ClientDashboardService();
