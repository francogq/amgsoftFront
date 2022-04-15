import { amgApi } from "@/service/axios";

class LeadService {
    async A_GET_LEADS(params) {
        try {
            const data = await amgApi.post("commons/debt-solution/get-lead", params);
        return data.data;
        } catch (error) {
            console.log("Error A_GET_LEADS")
        }
        
    }
    async createLeadEvent(params) {
        try {
            const data = await amgApi.post("lead/event/create-lead-event", params);
            return data.data; 
        } catch (error) {
            console.log("Error createLeadEvent")
        }
       
    }
}
export default new LeadService();
