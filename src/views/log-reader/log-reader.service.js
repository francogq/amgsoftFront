import { amgApi } from '@/service/axios'

class LogReaderService {
  async getLogList(body) {
    try {
      const data = await amgApi.post('/auth/log-reader', body)
      return data
    } catch (error) {
      throw error
    }
  }
  async deleteLogList(body) {
    try {
      const data = await amgApi.post('/auth/delete-log-reader', body)
      return data
    } catch (error) {
      throw error
    }
  }
}
export default new LogReaderService()
