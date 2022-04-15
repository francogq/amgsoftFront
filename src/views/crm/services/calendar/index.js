import { amgApi } from '@/service/axios'

class Calendar {
  async filterMonthNext(body) {
    try {
      const data = await amgApi.post('/commons/calendar/get-event-calendar', body)
      return data
    } catch (error) {
      throw error
    }
  }

  async filterMonthNextTask(body) {
    try {
      const data = await amgApi.post('/commons/calendar/filter-month-next-task-all', body)
      return data
    } catch (error) {
      throw error
    }
  }
}

export default new Calendar()
