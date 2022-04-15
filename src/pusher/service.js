// General services on module Social Network after refactoring
import { paragonNewCommentNotification } from '@/views/social-network/views/bank-of-flyers/bank-of-flyers.pusher'
import { refreshMessageQuantites } from '@/commons/messages/messages.pusher'
import { insertLoan } from '@/views/commons/components/loans/loans.pusher'

class PusherService {
  async instanceNewPusher() {
    const pusher = new Pusher('fb2e6fc854a858bb1dda', {
      cluster: 'us2',
      authEndpoint: `${process.env.VUE_APP_BASE_URL}/pusher`,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    })
    window.pusher = pusher
    try {
      pusher.subscribe('private-mail')
      refreshMessageQuantites()
      insertLoan()
      paragonNewCommentNotification()
    } catch (error) {
      pusher.unsubscribe('private-mail')
    }
  }
}
export default new PusherService()
