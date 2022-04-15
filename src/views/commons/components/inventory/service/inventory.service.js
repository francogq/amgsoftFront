import { amgApi } from '@/service/axios'

class InventoryService {
    //Inventory Main
    async countRequestEquipment(params){
        const data = await amgApi.post("/logistics/inventory/get-counter-equipment-request", params)
        return data
    }
    //Inventory Grid
    async getSelectCategory(params){
        const data = await amgApi.get("/logistics/inventory/get-all-equipment-category", params)
        return data
    }
    async validatePassword(params){
        const data = await amgApi.post("/logistics/inventory/equipment-validate-return", params)
        return data
    }
    //Request Equipment
    async getSelectUsers(params){
        const data = await amgApi.post("/logistics/inventory/get-list-users-by-module-id",params)
        return data
    }
    async saveRequest(params){
        const data = await amgApi.post("/logistics/inventory/save-request-equipment",params)
        return data
    }
    //Modal View Equipment
    async searchEquipmentById(params){
        const data = await amgApi.post("/logistics/inventory/get-equipment-data-by-id",params)
        return data
    }
    async getSelectBrand(params){
        const data = await amgApi.get("/logistics/inventory/get-all-equipment-brand", params)
        return data
    }
    //Modal Repair Equipment 
    async saveAssignEquipment(params){
        const data = await amgApi.post("/logistics/inventory/save-repair-equipment",params)
        return data
    }
    
}

export default new InventoryService()