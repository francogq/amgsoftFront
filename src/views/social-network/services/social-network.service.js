import {amgApi} from '@/service/axios'

// General services on module Social Network after refactoring
class SocialNetworkService {


    async getStates(body) {
        try {
            const data = await amgApi.post('/lead/get-states', body)
            return data
        } catch (error) {
            console.log('Something went wrong on getStates:', error)
            throw error
        }
    }

    async getPrograms(body) {
        try {
            const data = await amgApi.post('/commons/all-fangapes', body)
            return data
        } catch (error) {
            console.log('Something went wrong on getStates:', error)
            throw error
        }
    }


}

export default new SocialNetworkService()
