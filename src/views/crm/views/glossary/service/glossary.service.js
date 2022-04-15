import { amgApi } from '@/service/axios'

class GlossarydService {
    
    async deleteGlossary(params){
        const data = await amgApi.post("/glossary/delete-glossary", params)
        return data.data
    }
    async getCategories(){
        const data = await  amgApi.get("/glossary/get-all-glossaries-category")
        return data
    }

    //Modal Glossary
    async createGlossary(params){
        const data = await amgApi.post("/glossary/create-glossary", params)
        return data.data
    }
    async editGlossary(params){
        const data = await amgApi.post("/glossary/edit-glossary", params)
        return data.data
    }
    
    //Modal Add Category
    async createCategory(params){
        const data = await amgApi.post("/glossary/create-glossary-category", params)
        return data.data
    }
   
    
}
export default new GlossarydService()