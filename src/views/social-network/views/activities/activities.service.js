import { amgApi } from '@/service/axios'
// General services on module Social Network after refactoring
class ActivitiesService {
  async getSchedules(body) {
    try {
      const data = await amgApi.post('/social-network/activities/get-schedules', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getLeadsMigration:', error)
      throw error
    }
  }

  async insertTask(body) {
    try {
      const data = await amgApi.post('/social-network/activities/create-tasks', body)
      return data
    } catch (error) {
      console.log('Something went wrong on insertTask:', error)
      throw error
    }
  }

  async updateTask(body) {
    try {
      const data = await amgApi.post('/social-network/activities/update-tasks', body)
      return data
    } catch (error) {
      console.log('Something went wrong on updateTask:', error)
      throw error
    }
  }

  async getTrackingChanges(body) {
    try {
      const data = await amgApi.post('/social-network/activities/get-tracking', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getTrackingChanges:', error)
      throw error
    }
  }

  async getTask(body) {
    try {
      const data = await amgApi.post('/social-network/activities/get-tasks', body)
      return data
    } catch (error) {
      console.log('Something went wrong on getTask:', error)
      throw error
    }
  }

  async createSchedules(body) {
    try {
      const data = await amgApi.post('/social-network/activities/create-schedules', body)
      return data
    } catch (error) {
      console.log('Something went wrong on createSchedules:', error)
      throw error
    }
  }

  async updateSchedules(body) {
    try {
      const data = await amgApi.post('/social-network/activities/update-schedules', body)
      return data
    } catch (error) {
      console.log('Something went wrong on updateSchedules:', error)
      throw error
    }
  }
}
export default new ActivitiesService()
