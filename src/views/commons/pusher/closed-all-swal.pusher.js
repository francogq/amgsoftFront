import Vue from 'vue'
import store from '@/store'

const closedAllSwal = () => {
  window.pusher.bind('closed-all-swal', async data => {
    const sessionId = store.state.auth.currentUser.user_id
    if (data.to_id == sessionId) {
      Vue.swal.close()
    }
  })
}
export default closedAllSwal