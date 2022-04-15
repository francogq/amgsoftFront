import { amgApi } from '@/service/axios'

class Call {
  async getCalls (body) {
    try {
      const data = await amgApi.post('/lead/show-status-call', body)
      return data
    } catch (error) {
      throw error
    }
  }
  async postCall (body) {
    try {
      const data = await amgApi.post('/lead/update-call', body)
      return data
    } catch (error) {
      throw error
    }
  }
}

export default new Call()
