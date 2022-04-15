import { amgApi } from '@/service/axios'

class PaymentService {
    //Process
    async getCard(params) {
        const data = await amgApi.post("/crm/payment/get-lead-payment-by-id", params)
        return data.data
    }

    async subtAutorize(params) {
        const data = await amgApi.post("/authorize/checkout-payment", params)
        return data
    }
    async searchlead(params) {
        const data = await amgApi.post("/crm/payment/get-lead-by-id", params)
        return data.data
    }
    //Payment
    async getAllUsers(params) {
        const data = await amgApi.post(`/commons/user-module/2`, params)
        return data.data
    }
    //VoidRefundInfo
    async getVoidRefund(params) {
        const data = await amgApi.post("/crm/payment/get-void-refund", params)
        return data.data
    }
    //Refund
    async voidTransaction(params) {
        const data = await amgApi.post("/authorize/void-transaction", params)
        return data
    }
    async refundTransaction(params) {
        const data = await amgApi.post("/authorize/refund-transaction", params)
        return data
    }

    //CrediCard
    async searchcards(params) {
        const data = await amgApi.post("/clients/search-cards-clients", params)
        return data.data
    }
    //CreateCard
    async getStates(params) {
        const data = await amgApi.get("/commons/get-eeuu-states")
        return data.data
    }
}
export default new PaymentService()