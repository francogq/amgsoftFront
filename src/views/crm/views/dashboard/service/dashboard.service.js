import { amgApi } from '@/service/axios'

class DashboardService {
    //User Create
    async userCreator(params){
        const data = await amgApi.post('/commons/sellerall/2',params)
        return data.data
    }
    async getDashboardData(params){
        const data = await amgApi.post('/crm/get-data-dashboard',params)
        return data
    }
}
export default new DashboardService()