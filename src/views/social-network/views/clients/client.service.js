import { amgApi } from '@/service/axios'
// General services on module Social Network after refactoring
class ClientService {
  async getClients(body, page) {
    try {
      const data = await amgApi.post(`clients/search-clients?page=${page}`, body)
      return data
    } catch (error) {
      console.log('Something went wrong on getClients:', error)
      throw error
    }
  }
}
export default new ClientService()
