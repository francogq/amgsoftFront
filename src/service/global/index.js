import { amgApi } from '@/service/axios';

class GlobalService {

    async getCountries() {
        try {
            const data = await amgApi.post("commons/get-world-countrys", {})
            return data
        } catch (error) {
            console.log("Something went wrong on getCountries", error)
            throw error
        }
    }

    async getOwners({ modul, body }) {
        try {
            const data = await amgApi.post(`/commons/user-module/${modul}`, body)
            return data
        } catch (error) {
            console.log('Something went wrong on getOwners:', error)
            throw error
        }
    }

    async getPrograms(params) {
        try {
            const data = await amgApi.get('/program/get-programs', { params })
            return data
        } catch (error) {
            console.log('Something went wrong on getPrograms:', error)
            throw error
        }
    }

    async getSellers(modul, body) {
        try {
            const data = await amgApi.post(`commons/sellerall/${modul}`, body)
            return data
        } catch (error) {
            console.log('Something went wrong on getSellers:', error)
            throw error
        }
    }

    async getSourceNames(params) {
        try {
            const data = await amgApi.get('/commons/get-sources-names', { params })
            return data
        } catch (error) {
            console.log('Something went wrong on getSourceNames:', error)
            throw error
        }
    }

    async getStates(body) {
        try {
            const data = await amgApi.post('/lead/get-states', body)
            return data
        } catch (error) {
            console.log('Something went wrong on getStates:', error)
            throw error
        }
    }

    async getStatesEEuu(params) {
        try {
            const data = await amgApi.get('/commons/get-eeuu-states', { params })
            return data
        } catch (error) {
            console.log('Something went wrong on getStatesEeuu:', error)
            throw error
        }
    }

    async getUniqueMobile(body) {
        try {
            const data = await amgApi.post('/uniquemobile', body)
            return data
        } catch (error) {
            console.log('Something went wrong on postUniqueMobile:', error)
            throw error
        }
    }

    async getStatusLead() {
        try {
            const data = await amgApi.get('/lead/get-state-leads')
            return data
        } catch (error) {
            console.log('Something went wrong on getStatusLead', error)
            throw error
        }
    }
    async getHourSystem() {
        try {
            const data = await amgApi.post('/commons/get-hour-system')
            return data
        } catch (error) {
            console.log('Something went wrong on getStatusLead', error)
            throw error
        }
    }

}

export default new GlobalService()