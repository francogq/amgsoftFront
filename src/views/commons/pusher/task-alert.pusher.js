import Vue from 'vue'
import NotificationMixin from '@/mixins/notification'
import store from '@/store'

const taskAlert = () => {
  window.pusher.bind('task-alert', async data => {
    const sessionId = store.state.auth.currentUser.user_id
    if (data != []) {
      if (data.to_id == sessionId) {
        const result = await Vue.swal.fire({
          html: `<img src="${process.env.VUE_APP_BASE_URL_FRONT}/assets/images/icons/swal/warning.svg" style="margin-bottom: 10px;">
                <div><h2 style="font-weight: 600;">IMPORTANT TASK!!!</h2></div>
                <div style="text-align: center;">
                <div style="font-weight: bolder; text-transform: uppercase;">You have a important task with ${data.lead_name}, in five minuts</div>
                <div ><span style="font-weight: bolder;">Subject: </span> ${data.subject}</div>
                </div>`,
          allowOutsideClick: false,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'LEAD',
          cancelButtonText: 'OK',
        })
        if (result.value) {
          window.open(`${process.env.VUE_APP_BASE_URL_FRONT}/crm/leads/${data.lead_id}`)
          NotificationMixin.methods.showWindowNotification(
            `${data.lead_name}`,
            'You have an task scheduled in 5 minutes',
            `${process.env.VUE_APP_BASE_URL_ASSETS}/images/icons/dashboard/CRM-appointmentsmade.ico`,
            `taskScheduled${data.task_id}`,
            () => {
              window.focus()
            },
          )
          await window.amgApi.post('/commons/close-all-swal', data)
        } else {
          await window.amgApi.post('/commons/close-all-swal', data)
        }
      }
    }
  })
}
export default taskAlert
