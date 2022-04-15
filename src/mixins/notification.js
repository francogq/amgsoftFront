export default {
  methods: {
    showWindowNotification(title, body = 'New Notification', icon, tag = Math.random(1, 500000000), onClick) {
      Notification.requestPermission(permission => {
        const notification = new Notification(title, {
          body,
          icon,
          tag,
        })
        notification.onclick = onClick
      })
    },
  },
}
