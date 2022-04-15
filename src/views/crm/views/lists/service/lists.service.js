import { amgApi } from '@/service/axios'

class ListService {
    //List
    async deleteUser(params){
        const data = await amgApi.post("/commons/list-users/delete-list-of-user",params)
        return data.data
    }
    async groupUser(params){
        const data = await amgApi.post("/commons/sellerall/2",params)
        return data.data
    }
    async saveGroup(params){
        const data = await amgApi.post("/commons/list-users/save-group",params)
        
    }

    //Modal General
    async changeStatus(params){
        const data = await amgApi.post("/commons/list-users/update-list-Of-user", params)
        return data.data
    }

    //  Modal User
    async getLead(params){
        const data = await amgApi.post("/commons/list-users/get-lead",params)
        return data.data
    }

    
}
export default new ListService()