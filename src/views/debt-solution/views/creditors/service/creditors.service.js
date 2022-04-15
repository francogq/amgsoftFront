import { amgApi } from "@/service/axios";

class CreditorsService {
    async GET_CREDITORS_PARENTS(params) {
        try {
            const data = await amgApi.post("debt-solution/get-creditors-parents", params);
        return data.data;
        } catch (error) {
            console.log("Error GET_CREDITORS_PARENTS")
        }
    }
    async GET_CREDITORS(params) {
        try {
            const data = await amgApi.post("debt-solution/get-creditors", params);
        return data.data;
        } catch (error) {
            console.log("Error GET_CREDITORS")
        }
    }
    async SAVE_CREDITORS(params) {
        try {
            const data = await amgApi.post("debt-solution/save-creditors", params);
        return data.data;
        } catch (error) {
            console.log("Error SAVE_CREDITORS")
        }
    }

}
export default new CreditorsService();