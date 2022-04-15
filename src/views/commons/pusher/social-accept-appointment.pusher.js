import store from '@/store';
import Vue from "vue";
import NotificationMixin from '@/mixins/notification'
const socialAcceptAppoitment = () => {
    window.pusher.bind('social-accept-appointment', async data => {
        const sessionId = store.state.auth.currentUser.user_id
        if (data.to_id == sessionId) {
            const result = await Vue.swal.fire({
                icon: "success",
                html: `You have a new appointment!<br><h2 style="font-weight: 600;">${data.lead_name}</h2><h3><br><b>Date:</b> ${data.hour_created}</h3>`,
                showConfirmButton: true,
            })
            if (result.value) {
                await window.amgApi.post('/commons/close-all-swal', data)
            }
            NotificationMixin.methods.showWindowNotification(
                `${data.lead_name}`,
                'New appoitment',
                `${process.env.VUE_APP_BASE_URL_ASSETS}/images/icons/dashboard/CRM-calendar.ico`,
                `newAppoiment${data.lead_id}`,
                () => {
                  window.focus()
                },
            )
        }
    })
}
export default socialAcceptAppoitment
