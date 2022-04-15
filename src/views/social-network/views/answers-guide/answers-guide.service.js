import { amgApi } from '@/service/axios'

class AnswersGuide {
  // trae los hijos directos de un cierto padre de un cierto programa, si le mando el padre como null, me regresa
  // los hijos del programa.... padre, programa
  async getAnswersGuide(body) {
    try {
      const data = await amgApi.post('/social-network/answers-guide/get-asnwer-guide-sn', body)
      return data.data
    } catch (error) {
      throw error
    }
  }

  //elimina al answer que le pasaste por id junto con toda su generacion, padre
  async deleteAnswerGuide(body) {
    try {
      const data = await amgApi.post('/social-network/answers-guide/delete-asnwer-guide-sn', body)
      return data
    } catch (error) {
      throw error
    }
  }

  //me devuelve el arbol entero de un elemento, solo tengo que pasarle el id y me trae
  //los hijos, nietos, etc.... padre
  async getTreeAnswer(body) {
    try {
      const data = await amgApi.post('/social-network/answers-guide/get-tree-answer', body)
      return data
    } catch (error) {
      throw error
    }
  }

  // guarda una respuesta o la actualiza estableciendo su
  // id, programa, contenido, usuario que lo creo, id del papa, tipo (cliente o team)
  async saveAnswerGuide(body) {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await amgApi.post('/social-network/answers-guide/save-update-answer-guide-sn', body)
      return data
    } catch (error) {
      throw error
    }
  }

  async getFanPages() {
    try {
      const data = await amgApi.get('/social-network/answers-guide/all-fan-pages')
      return data.data
    } catch (error) {
      throw error
    }
  }
}

export default new AnswersGuide()
