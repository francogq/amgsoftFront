import { amgApi } from '@/service/axios'
// General services on module Social Network after refactoring
class MigrationService {
  async getLeadsMigration(body, page) {
    try {
      const data = await amgApi.post(`social-network/migrations/search-leads-migration?page=${page}`, body)
      return data
    } catch (error) {
      console.log('Something went wrong on getLeadsMigration:', error)
      throw error
    }
  }

  async getStatusLead() {
    try {
      const data = await amgApi.get('social-network/migrations/search-status-leads')
      return data
    } catch (error) {
      console.log('Something went wrong on getStatusLead:', error)
      throw error
    }
  }

  async getUserModule(body) {
    try {
      const data = await amgApi.post('commons/user-module/15', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getUserModule:', error)
      throw error
    }
  }

  async deleteLeadsMigration(body) {
    try {
      const data = await amgApi.post('social-network/migrations/delete-leads-migration', body)
      return data
    } catch (error) {
      console.log('Something went wrong on deleteLeadsMigration:', error)
      throw error
    }
  }
}
export default new MigrationService()
