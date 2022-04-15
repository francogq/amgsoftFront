import { amgApi } from '@/service/axios'
// General services on module Social Network after refactoring
class DashboardService {
  async getUsers(body) {
    try {
      const data = await amgApi.post('commons/sellerall/15', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getUsers:', error)
      throw error
    }
  }

  async getFilterCardSocial(body) {
    try {
      const data = await amgApi.post('social-network/get-social-cards', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getFilterCardSocial:', error)
      throw error
    }
  }

  async getDataLead(body) {
    try {
      const data = await amgApi.post('social-network/get-lead-data', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getDataLead:', error)
      throw error
    }
  }

  async getLeadsGraphic(body) {
    try {
      const data = await amgApi.post('social-network/get-leads-graphic', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getLeadsGraphic:', error)
      throw error
    }
  }

  async getRepliesGraphic(body) {
    try {
      const data = await amgApi.post('social-network/get-replies-graphic', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getRepliesGraphic:', error)
      throw error
    }
  }

  async getAnswersGraphic(body) {
    try {
      const data = await amgApi.post('social-network/get-answers-graphic', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getRepliesGraphic:', error)
      throw error
    }
  }

  async getMobilesGraphic(body) {
    try {
      const data = await amgApi.post('social-network/get-mobiles-graphic', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getMobilesGraphic:', error)
      throw error
    }
  }

  async getTasksGraphic(body) {
    try {
      const data = await amgApi.post('social-network/get-tasks-graphic', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getTasksGraphic:', error)
      throw error
    }
  }

  async getProductivityGraphic(body) {
    try {
      const data = await amgApi.post('social-network/get-productivity-graphic', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getProductivityGraphic:', error)
      throw error
    }
  }

  async getTaskCatcherGraphic(body) {
    try {
      const data = await amgApi.post('social-network/get-tasks-catcher-graphic', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getTaskCatcherGraphic:', error)
      throw error
    }
  }

  async getMultiChartGraphic(body) {
    try {
      const data = await amgApi.post('social-network/get-multi-chart-per-week', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getMultiChartGraphic:', error)
      throw error
    }
  }
}
export default new DashboardService()
