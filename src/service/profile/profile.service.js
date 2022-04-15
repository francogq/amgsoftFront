import { amgApi } from "@/service/axios"

class ProfileService {

    async updateProfile(body) {
        try {
            const { data, status } = await amgApi.post('/profile/update-profile', body)
            return { data, status }
        } catch (error) {
            throw error
        }
    }

}

export default new ProfileService()