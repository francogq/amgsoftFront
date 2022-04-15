import {amgApi} from '@/service/axios'

// General services on module Social Network after refactoring
class BankOfFlyerService {
    async getBankOfFlyers(body, page) {
        try {
            const data = await amgApi.post(`social-network/bank-of-flyers/search-bank-flyers?page=${page}`, body)
            return data
        } catch (error) {
            console.log('Something went wrong on getBankOfFlyers:', error)
            throw error
        }
    }


    async getLeadsFlyer(body) {
        try {
            const data = await amgApi.post('social-network/bank-of-flyers/get-leads-flyers', body)
            return data
        } catch (error) {
            console.log('Something went wrong on getLeadsFlyer:', error)
            throw error
        }
    }

    async insertCampaignFlyers(body) {
        try {
            const data = await amgApi.post('social-network/bank-of-flyers/insert-campaigns-flyers', body)
            return data
        } catch (error) {
            console.log('Something went wrong on insertCampaignFlyers:', error)
            throw error
        }
    }

    async deleteCampaignFlyers(body) {
        try {
            const data = await amgApi.post('social-network/bank-of-flyers/delete-campaigns-flyers', body)
            return data
        } catch (error) {
            console.log('Something went wrong on deleteCampaignFlyers:', error)
            throw error
        }
    }

    async getCampaignFlyers(body) {
        try {
            const data = await amgApi.post('social-network/bank-of-flyers/get-campaigns-flyers', body)
            return data
        } catch (error) {
            console.log('Something went wrong on getCampaignFlyers:', error)
            throw error
        }
    }

    async insertFlyerComments(body) {
        try {
            const data = await amgApi.post('social-network/bank-of-flyers/insert-flyer-comments', body)
            return data
        } catch (error) {
            console.log('Something went wrong on insertFlyerComments:', error)
            throw error
        }
    }

    async getFlyerComments(body) {
        try {
            const data = await amgApi.post('social-network/bank-of-flyers/get-flyer-comments', body)
            return data
        } catch (error) {
            console.log('Something went wrong on getFlyerComments:', error)
            throw error
        }
    }

    async updateChangeView(body) {
        try {
            const data = await amgApi.post('social-network/bank-of-flyers/change-view', body)
            return data
        } catch (error) {
            console.log('Something went wrong on updateChangeView:', error)
            throw error
        }
    }

    async countNotification(body) {
        try {
            const data = await amgApi.post('social-network/bank-of-flyers/count-notification', body)
            return data
        } catch (error) {
            console.log('Something went wrong on countNotification:', error)
            throw error
        }
    }

}

export default new BankOfFlyerService()
