import NotificationMixin from '@/mixins/notification'
import GeneralMixin from '@/mixins/general'
import store from '@/store'

const sendFromRrhhJustifyToManagment = () => {
  window.pusher.bind('send-from-rrhh-justify-to-management', async data => {
    const sessionId = store.state.auth.currentUser.user_id
    if (data.to_id == sessionId) {
      const res = await GeneralMixin.methods.showConfirmSwal(`${data.title}`, `${data.message}`)
      if (res.isConfirmed) {
        // eslint-disable-next-line no-param-reassign
        data.to_id = sessionId
        NotificationMixin.methods.showWindowNotification(
          `${data.title}`,
          `${data.message}`,
          `${process.env.VUE_APP_BASE_URL_ASSETS}/images/logo-amg-soft.png`,
          '',
          () => {
            window.open(data.route)
          },
        )
        await window.amgApi.post('/commons/close-all-swal', data)
      } else {
        await window.amgApi.post('/commons/close-all-swal', data)
      }
    }
  })
}
export default sendFromRrhhJustifyToManagment