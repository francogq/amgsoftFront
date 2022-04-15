import store from '@/store'

const alertMarkSchedules = () => {
  window.pusher.bind('alert-mark-schedules', async data => {
    const sessionId = store.state.auth.currentUser.user_id
    if (data.to_id == sessionId) {
      /* ***********************
      **************************
      * JORDY LO HACE GAAAAAAA *
      **************************
      ************************* */
    }
  })
}
export default alertMarkSchedules
