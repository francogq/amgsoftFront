import {amgApi} from "@/service/axios";

class NavbarService {

  async getUserNotifications(userId) {
    const data = await amgApi.post('/notification/get-notifications', {
        id: userId
    })
    return data.data
  }
}
export default new NavbarService()
