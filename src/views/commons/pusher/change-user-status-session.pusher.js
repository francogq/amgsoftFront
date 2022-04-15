import store from '@/store'

const changeUserStatusSession = () => {
    window.pusher.bind('change-user-status-session', async data => {
        const sessionId = store.state.auth.currentUser.user_id
        if (data.to_id == sessionId) {
            await store.dispatch('UserStore/A_GET_USER_STATUS_SESSION', {
                id: sessionId
            })
        }
    })
}
export default changeUserStatusSession
