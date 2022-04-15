import { amgApi } from '@/service/axios'

class LoansService {
  async getLoans(params) {
    try {
      const { data } = await amgApi.post('/loans/get-loans', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async getCounterLoan(params) {
    try {
      const { data } = await amgApi.post('/loans/get-counter-loans', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async getCounterLoanTab(params) {
    try {
      const { data } = await amgApi.post('/loans/get-counter-loan-tab', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async insertLoan(params) {
    try {
      const { data } = await amgApi.post('/loans/insert-loan', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async importLoan(params) {
    try {
      const { data } = await amgApi.post('/loans/import-loan', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async getUserData(params) {
    try {
      const { data } = await amgApi.post('/loans/get-user-loan', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async getReportLoan(params) {
    try {
      const { data } = await amgApi.post('/loans/get-report-loan', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async updateDateLoan(params) {
    try {
      const { data } = await amgApi.post(
        '/loans/update-date-first-due',
        params,
      )
      return data
    } catch (error) {
      throw error
    }
  }

  async getDataLoan(id) {
    try {
      const { data } = await amgApi.get(`/loans/get-data-loan/${id}`)
      return data
    } catch (error) {
      throw error
    }
  }

  async insertStatusLoan(params) {
    try {
      const { data } = await amgApi.post('/loans/insert-status-loan', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async getTrackingLoan(params) {
    try {
      const { data } = await amgApi.post('/loans/get-tracking-loan', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async getTrackingLoanPayDay(params) {
    try {
      const { data } = await amgApi.post(
        '/loans/tracking-loan-pay-day',
        params,
      )
      return data
    } catch (error) {
      throw error
    }
  }

  async getPayDayLoan(params) {
    try {
      const { data } = await amgApi.post('/loans/get-pay', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async getPayListLoan(params) {
    try {
      const { data } = await amgApi.post('/loans/get-pay-list-user', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async changeStatusPayLoan(params) {
    try {
      const { data } = await amgApi.post('/loans/edit-status-pay', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async insertPay(params) {
    try {
      const { data } = await amgApi.post('/loans/insert-pay-loan', params)
      return data
    } catch (error) {
      throw error
    }
  }

  async getDue(params) {
    try {
      const { data } = await amgApi.post('/loans/get-due-user', params)
      return data
    } catch (error) {
      throw error
    }
  }
}

export default new LoansService()
