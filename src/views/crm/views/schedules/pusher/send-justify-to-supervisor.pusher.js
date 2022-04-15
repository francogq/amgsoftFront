import NotificationMixin from '@/mixins/notification'
import store from '@/store'

const sendJustifyToSupervisor = () => {
  window.pusher.bind('send-justify-to-supervisor', async data => {
    const sessionId = store.state.auth.currentUser.user_id
    if (data.to_id == sessionId) {
      NotificationMixin.methods.showWindowNotification(
        `${data.title}`,
        `${data.user.first_name} ${data.user.last_name}`,
        `${process.env.VUE_APP_BASE_URL_ASSETS}/images/logo-amg-soft.png`,
        '',
        () => {
          window.open(data.route)
        },
      )
    }
  })
}
export default sendJustifyToSupervisor
