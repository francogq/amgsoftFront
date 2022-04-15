import NotificationMixin from '@/mixins/notification'
import store from '@/store/index'

// eslint-disable-next-line import/prefer-default-export
export const newFlyerNotification = () => {
    // eslint-disable-next-line no-undef
    pusher.bind('new-flyer-send-sn', data => {
        const callback = () => {
            window.focus()
        }

        // eslint-disable-next-line array-callback-return

        if (data.to_id === store.state.auth.currentUser.user_id) {

            NotificationMixin.methods.showWindowNotification(
                data.title,
                data.body,
                undefined,
                undefined,
                callback,
            )
        }
    })
}
