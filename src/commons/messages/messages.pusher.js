import NotificationMixin from '@/mixins/notification'
import store from '@/store/index'
import router from '@/router/index'

const refreshMessageQuantites = () => {
  window.pusher.bind('messaging', data => {
    const callback = () => {
      window.focus()
      router.push('/messages')
    }
    if (
      (store.state.auth.currentUser.user_id == data.to_id) && (store.state.auth.currentUser.user_id != data.from_id) && data.type == 1) {
      NotificationMixin.methods.showWindowNotification(
        data.user_name,
        data.subject,
        undefined,
        undefined,
        callback,
      )
      store.dispatch('MessageStore/A_GET_USER_CONTACTS', { id: store.state.auth.currentUser.user_id })
    } else if ((store.state.auth.currentUser.user_id != data.from_id) && data.type == 2) {
      data.users.map(async user => {
        if (user.id == store.state.auth.currentUser.user_id) {
          NotificationMixin.methods.showWindowNotification(
            data.user_name,
            data.subject,
            undefined,
            undefined,
            callback,
          )
          await store.dispatch('MessageStore/A_GET_USER_CONTACTS', { id: store.state.auth.currentUser.user_id })
        }
      })
    }
  })
}
export default refreshMessageQuantites
