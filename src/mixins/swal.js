export default {
  methods: {
    showConfirmSwalHtmlWithTimer(html, type, timer) {
      let timerInterval
      return this.$swal({
        html,
        type,
        timer,
        imageUrl: '/assets/images/icons/swal/warning.svg',
        imageWidth: 70,
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'btn btn-primary mr-1',
          cancelButton: 'btn btn-outline-danger',
        },
        onBeforeOpen: () => {
          timerInterval = setInterval(() => {
            const content = this.$swal.getContent()
            if (content) {
              const b = content.querySelector('strong')
              if (b) {
                b.textContent = Math.ceil(
                  this.$swal.getTimerLeft() / 1000,
                )
              }
            }
          }, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        },
      })
    },
  },
}
