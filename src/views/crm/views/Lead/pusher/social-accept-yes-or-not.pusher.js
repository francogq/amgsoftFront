import Vue from 'vue'
import GeneralMixin from '@/mixins/general'
import NotificationMixin from '@/mixins/notification'
import store from '@/store'

const acceptLeadFromSocialNetwork = () => {
  window.pusher.bind('social-accept-yesornot', async data => {
    const sessionId = store.state.auth.currentUser.user_id
    let timerInterval
    const includeSessionIdOnNoAcceptArray = data.no_accept.includes(sessionId)
    if (sessionId == data.to_id && sessionId != data.from_id && !includeSessionIdOnNoAcceptArray) {
      const result = await Vue.swal.fire({
        html: `Do you accept a new lead?<br><h2 style="font-weight: 600;">${data.lead_name}</h2><h3><br><b>Date:</b> ${data.hour_created}</h3><br>I will close in <strong>30</strong> seconds.`,
        imageUrl: `${process.env.VUE_APP_BASE_URL_FRONT}/assets/images/icons/swal/warning.svg`,
        imageWidth: 70,
        timer: 30000,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'btn btn-primary mr-1',
          cancelButton: 'btn btn-outline-danger',
        },
        onBeforeOpen: () => {
          timerInterval = setInterval(() => {
            const content = Vue.swal.getContent()
            if (content) {
              const b = content.querySelector('strong')
              if (b) {
                b.textContent = Math.ceil(
                  Vue.swal.getTimerLeft() / 1000,
                )
              }
            }
          }, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        },
      })
      store.commit('app/SET_LOADING', true)
      if (result.isConfirmed) {
        NotificationMixin.methods.showWindowNotification(`${data.lead_name}`, 'New Appoiment', `${process.env.VUE_APP_BASE_URL_ASSETS}/images/icons/dashboard/CRM-leads.ico`, `newAppoiment2${data.lead_id}`, () => { window.focus() })
        const response = await window.amgApi.post('/lead/social-network/accept-lead-social-network', data)
        if (GeneralMixin.methods.isResponseSuccess(response)) {
          window.open(
            `/crm/leads/${data.lead_id}`,
            '_blank',
          )
        }
        await window.amgApi.post('/commons/close-all-swal', data)
      } else if (result.dismiss === 'cancel' || result.dismiss === 'backdrop') {
        data.no_accept.push(data.to_id)
        await window.amgApi.post('/lead/find-seller-lead', data)
        await window.amgApi.post('/commons/close-all-swal', data)
      } else if (result.dismiss === 'timer') {
        Vue.swal.fire({
          title: 'Time out!',
          text: 'I will close in 2 seconds.',
          timer: 2000,
          showConfirmButton: false,
        })
        data.no_accept.push(data.to_id)
        await window.amgApi.post('/lead/find-seller-lead', data)
        await window.amgApi.post('/commons/close-all-swal', data)
      }
    }
    store.commit('app/SET_LOADING', false)
  })
}
export default acceptLeadFromSocialNetwork
