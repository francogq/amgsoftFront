import { amgApi } from '@/service/axios'

class Notes {
  async getLeadNotes(body) {
    try {
      const { data, status } = await amgApi.post('/note/note/get-lead-notes', body)
      return { data, status }
    } catch (error) {
      throw error
    }
  }

  async postLeadNotes(body) {
    try {
      const data = await amgApi.post('notescreate', body)
      return data
    } catch (error) {
      throw error
    }
  }
  async postUpdateLeadNote(body) {
    try {
      const data = await amgApi.post('/note/note/update-notes', body)
      return data
    } catch (error) {
      throw error
    }
  }
  async postMakeImportantNote(body) {
    try {
      const data = await amgApi.post('/note/note/important-note', body)
      return data
    } catch (error) {
      throw error
    }
  }

  async postCreateNote(body) {
    try {
      const { data, status } = await amgApi.post('/note/note/notes-create', body)
      return { data, status }
    } catch (error) {
      throw error
    }
  }
}

export default new Notes()
