import { amgApi } from '@/service/axios'

class RecoveryListService {
    //TabBYProgram
    async searchRecoveryList(params){
        const data = await amgApi.post("/social-network/recovery-list/search-recovery-by-user",params)
        return data
    }
    async sendForPusher(params){
        const data = await amgApi.post("/social-network/recovery-list/pusher-recovery-list-done",params)
        return data
    }
    async getUserOfRecoveryList(params){
        const data = await amgApi.post("/social-network/recovery-list/get-user-of-recovery-list",params)
        return data
    }
    async getRecoveryListByUser(params) {
        const { data } = await amgApi.post("/social-network/recovery-list/get-recovery-list-by-user", params);
        return data;
    }

    async getRecoveryListByProgram(params) {
        const { data } = await amgApi.post("/social-network/recovery-list/get-recovery-list-by-program", params);
        return data;
    }
    async createListRecoveryByProgram(params) {
        console.log('params: ', params)
        const { data } = await amgApi.post("/social-network/recovery-list/create-recovery-list", params);
        return data;
    }
    //userId,programId,cant
}
export default new RecoveryListService()