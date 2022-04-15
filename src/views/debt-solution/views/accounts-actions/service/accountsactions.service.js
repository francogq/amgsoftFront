import { amgApi } from "@/service/axios";

class AccountsActionsService {
    async GET_ACCOUNTS_ACTIONS(params) {
        try {
            const data = await amgApi.post("debt-solution/get-accounts-actions", params);
        return data.data;
        } catch (error) {
            console.log("Error GET_ACCOUNTS_ACTIONS")
        }
    }
    async GET_TRACKING_ACCOUNTS_ACTIONS(params) {
        try {
            const data = await amgApi.post("debt-solution/get-tracking-accounts-actions", params);
        return data.data;
        } catch (error) {
            console.log("Error GET_TRACKING_ACCOUNTS_ACTIONS")
        }
    }

}
export default new AccountsActionsService();
