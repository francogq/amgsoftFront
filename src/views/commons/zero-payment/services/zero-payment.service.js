import { amgApi } from "@/service/axios"; 

class ZeroPaymentService {

    async getAccountStatus(){
        try
        {
            let data = await amgApi.get('clients/get-status-account-client')
            return data
        }
        catch(error){
            console.error(error)
        }
    }

    async getDataZeroPayment(parameters){
        /*
            Recibe los siguientes parametros
            name_text: contenido del input para busqueda
            programid: id del programa actual, para este es 4
            moduleid: id del modulo actual, para este es 5
            date_from: fecha de origen para filtrar
            date_to: fecha de fin para filtrar
            zp_status: id del estado del zero payment
            perpage: cantidad de items por pagina
            npage: cantidad
        */
        try
        {
            let data = await amgApi.post('sales-made/payment/get-zero-payment',parameters) 
            return data
        }
        catch(error){console.error(error)}        
        
    }   
     async getNotesZeroPayment(parameter){
        let objParameter = {id_transaction:parameter}
        try {
            let data = await amgApi.post('sales-made/payment/get-notes-zero-payment',objParameter)    
            return data
        } catch (error) {
            console.error(error)
        }
        
    }
    async updateNoteZeroPayment(parameters){
        let objParameters={...parameters}
        try{
            let data = await amgApi.post('sales-made/payment/update-notes-zero-payment',objParameters)
        }catch(error){
            console.log(error)
        }
    }
    async getTrackingZeroPayment(parameter){
        let objParameter = {id_transaction:parameter}
        try {
            let data = await amgApi.post('sales-made/payment/get-tracking-zero-payment',objParameter)    
            return data
        } catch (error) {
            console.error(error)
        }
        

    }

}
export default new ZeroPaymentService();
