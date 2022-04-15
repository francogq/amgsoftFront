import { amgApi } from "@/service/axios";

class ApplicationsService{

    async searchApplicationAdvisor(parameters){
        /*
        recibe los sgtes parametros
            column: null,
            filter_advisor: null,
            filter_paid: null,
            filter_program: 4,
            filter_result: null,
            filter_status: null,
            from: null,
            id: 1,
            order: 5,
            orderby: "desc",
            role_id: 1,
            status_app: 1,
            to: null

        */
        try
        {
            let data = await amgApi.post('applications/search-application-advisor',parameters)
            return data
        }
        catch(error)
        { 
            console.log(error)
        }
        
    }
    async getUsersProgramNcr(parameters){
        try
        {
            let data = await amgApi.post('program/get-users-program-ncr',parameters)
            return data
        }
        catch(error)
        { 
            console.log(error)
        }
    }
    async getPersonalInformation(parameter){
        try{
            let data = await amgApi.post('applications/search-personal-information',parameter)
            return data
        }
        catch(error){
            console.log(error)
        }
    }
    async getCountries(){
        try{
            let data = await amgApi.post('commons/get-world-countrys')
            return data
        }catch(error){
            console.log(error)
        }
    }
    async getInternalEmail(id){
        try{
                let data = []
                let result = await amgApi.post('applications/get-access-credentials',{ca_id:id})
                result.data.map((el)=>{
                    data.push({id:el.id,email:el.user})
                })
                return data
                
        }catch(error){
                console.log(error)
        }
    }
    async savePersonalInfo(parameters){
        try{
            let data = await amgApi.post('applications/save-personal-info-form',parameters)
            return data.status === 200 ? true : false
        }catch(error){
            console.log(error)
            return false
        }
    }
    async updateStatusApp(parameters){
        try{
            let data = await amgApi.post('applications/app-status-update',parameters)
            return data.status === 200 ? true : false 
        }catch(error){
                console.log(error)
        }
    }
}


export default new ApplicationsService