import { amgApi } from '@/service/axios'

class NrcService {
    //NCR Main
    async ncrLeadsCountInProcess(params){
        const data = await amgApi.post("/lead/ncr/ncr-leads-count-in-process", params)
        return data
    }

    //Content pending
    async changeStatus(params){
        const data = await amgApi.post("/lead/ncr/change-status",params)
        return data
    }

    // Modal Tracking Status
    async getTrackingStatus(params){
        const data = await amgApi.post("/lead/ncr/get-lead-tracking-status-by-id",params)
        return data
    }

    //Modal Questionnaire
    async getQuestionnaire(params){
        const data = await amgApi.post("/lead/ncr/get-all-leads-questions",params)
        return data
    }

    async saveQuestionnaire(params){
        const data = await amgApi.post("/lead/ncr/create-leads-questionnaire",params)
        return data
    }

    // Mixin
    async getSellers(params){
        const data = await amgApi.post("/commons/sellerall/2",params)
        return data
    }

}

export default new NrcService()